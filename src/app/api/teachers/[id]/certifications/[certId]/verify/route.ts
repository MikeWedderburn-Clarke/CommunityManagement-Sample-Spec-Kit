import { NextRequest, NextResponse } from "next/server";
import { verifyCertification } from "@/lib/teachers/certifications";
import { verifyCertificationSchema } from "@/lib/validation/teacher-schemas";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; certId: string }> },
) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { certId } = await params;
  const body = await request.json();
  const parsed = verifyCertificationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const cert = await verifyCertification(certId, userId, parsed.data.decision);
  if (!cert) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(cert);
}
