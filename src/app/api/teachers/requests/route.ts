import { NextRequest, NextResponse } from "next/server";
import { listPendingRequests } from "@/lib/teachers/applications";

export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  const result = await listPendingRequests(page, limit);
  return NextResponse.json(result);
}
