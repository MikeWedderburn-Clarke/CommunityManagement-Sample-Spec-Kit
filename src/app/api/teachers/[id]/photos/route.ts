import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import type { TeacherPhoto } from "@/types/teachers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await db().query<TeacherPhoto>(
    `SELECT id, teacher_profile_id, url, sort_order, created_at
     FROM teacher_photos WHERE teacher_profile_id = $1
     ORDER BY sort_order`,
    [id],
  );
  return NextResponse.json(result.rows);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Check max 10 photos
  const countResult = await db().query<{ count: string }>(
    `SELECT COUNT(*)::text as count FROM teacher_photos WHERE teacher_profile_id = $1`,
    [id],
  );
  if (parseInt(countResult.rows[0].count, 10) >= 10) {
    return NextResponse.json({ error: "Maximum 10 photos allowed" }, { status: 400 });
  }

  const body = await request.json();
  if (!body.url || typeof body.url !== "string") {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  const maxOrder = await db().query<{ max_order: number }>(
    `SELECT COALESCE(MAX(sort_order), -1) as max_order FROM teacher_photos WHERE teacher_profile_id = $1`,
    [id],
  );

  const result = await db().query<TeacherPhoto>(
    `INSERT INTO teacher_photos (teacher_profile_id, url, sort_order)
     VALUES ($1, $2, $3)
     RETURNING id, teacher_profile_id, url, sort_order, created_at`,
    [id, body.url, maxOrder.rows[0].max_order + 1],
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}
