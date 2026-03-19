import { NextRequest, NextResponse } from "next/server";
import { isMockAuthEnabled } from "@/lib/auth/mock-users";
import { seedMockUsers } from "@/lib/auth/mock-seed";
import { seedDevData } from "@/db/seeds/dev";
import { notFound } from "@/lib/errors";

// GET /api/dev/mock-user/seed — trigger idempotent seed
// GET /api/dev/mock-user/seed?full=true — seed users + events + teachers
export async function GET(request: NextRequest) {
  if (!isMockAuthEnabled()) {
    return notFound("Not available in production");
  }

  const full = request.nextUrl.searchParams.get("full") === "true";
  if (full) {
    const log = await seedDevData();
    return NextResponse.json({ log });
  }

  const result = await seedMockUsers();
  return NextResponse.json(result);
}
