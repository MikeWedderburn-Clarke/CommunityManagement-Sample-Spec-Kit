import pg from "pg";

let pool: pg.Pool | null = null;

export interface DbClient {
  query<T extends pg.QueryResultRow = pg.QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<pg.QueryResult<T>>;
}

let devDb: DbClient | null = null;

export function getDb(): DbClient {
  const dbUrl = process.env.DATABASE_URL;

  // No DATABASE_URL or explicitly set to "pglite" → use PGlite file-backed dev DB
  if (!dbUrl || dbUrl === "pglite") {
    if (!devDb) {
      let ready: Promise<DbClient> | null = null;
      devDb = {
        async query(text: string, params?: unknown[]) {
          if (!ready) {
            ready = import("./pglite-dev").then((m) => m.getDevDb());
          }
          const client = await ready;
          return client.query(text, params);
        },
      } as DbClient;
    }
    return devDb;
  }

  if (!pool) {
    pool = new pg.Pool({
      connectionString: dbUrl,
      max: 10,
    });
  }
  return pool;
}

/** For tests: inject a PGlite-compatible client */
let testClient: DbClient | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setTestDb(client: any): void {
  testClient = client as DbClient;
}

export function clearTestDb(): void {
  testClient = null;
}

export function db(): DbClient {
  if (testClient) return testClient;
  return getDb();
}
