import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";
import type { DbClient } from "./client";

let initPromise: Promise<DbClient> | null = null;

async function init(): Promise<DbClient> {
  const { PGlite } = await import("@electric-sql/pglite");

  const dataDir = resolve(process.cwd(), ".pglite");
  const migrationsDir = resolve(process.cwd(), "src/db/migrations");

  console.log("[PGlite dev] Initializing file-backed database at", dataDir);
  const pg = new PGlite(dataDir);

  // Create migrations tracking table
  await pg.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const applied = await pg.query<{ name: string }>(
    "SELECT name FROM _migrations ORDER BY id",
  );
  const appliedNames = new Set(applied.rows.map((r) => r.name));

  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (appliedNames.has(file)) continue;
    const sql = readFileSync(resolve(migrationsDir, file), "utf-8");
    await pg.exec("BEGIN");
    try {
      await pg.exec(sql);
      await pg.query("INSERT INTO _migrations (name) VALUES ($1)", [file]);
      await pg.exec("COMMIT");
      console.log(`[PGlite dev] migrated: ${file}`);
    } catch (err) {
      await pg.exec("ROLLBACK");
      throw err;
    }
  }

  console.log("[PGlite dev] Ready — all migrations applied");
  const client = pg as unknown as DbClient;

  // Auto-seed dev data (users, events, teachers) on first init
  try {
    const { seedDevData } = await import("@/db/seeds/dev");
    const log = await seedDevData(client);
    log.forEach((l) => console.log(`[PGlite dev] ${l}`));
  } catch (err) {
    console.warn("[PGlite dev] Auto-seed skipped:", err);
  }

  return client;
}

export function getDevDb(): DbClient {
  return {
    async query(text: string, params?: unknown[]) {
      if (!initPromise) initPromise = init();
      const client = await initPromise;
      return client.query(text, params);
    },
  } as DbClient;
}
