import { NextRequest, NextResponse } from "next/server";
import { listExpiringCertifications } from "@/lib/teachers/certifications";

export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const days = parseInt(process.env.CERT_ALERT_DAYS_BEFORE_EXPIRY ?? "30", 10);
  const certs = await listExpiringCertifications(days);
  return NextResponse.json(certs);
}
