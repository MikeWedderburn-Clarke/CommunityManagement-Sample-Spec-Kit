import { NextRequest, NextResponse } from "next/server";
import { getCertification, updateCertification, deleteCertification } from "@/lib/teachers/certifications";
import { updateCertificationSchema } from "@/lib/validation/teacher-schemas";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; certId: string }> },
) {
  const { certId } = await params;
  const cert = await getCertification(certId);
  if (!cert) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(cert);
}

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
  const parsed = updateCertificationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const cert = await updateCertification(certId, parsed.data);
  if (!cert) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(cert);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; certId: string }> },
) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { certId } = await params;
  const deleted = await deleteCertification(certId);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
