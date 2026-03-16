import { NextRequest, NextResponse } from "next/server";
import { hideReview, unhideReview } from "@/lib/teachers/reviews";
import { moderateReviewSchema } from "@/lib/validation/teacher-schemas";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> },
) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reviewId } = await params;
  const body = await request.json();
  const parsed = moderateReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const result = parsed.data.action === "hide"
    ? await hideReview(reviewId, userId, parsed.data.reason)
    : await unhideReview(reviewId);

  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(result);
}
