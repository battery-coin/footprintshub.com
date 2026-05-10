import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { resolveTenantFromHost } from "@/lib/tenant/resolveTenant";

export async function GET() {
  const headerStore = await headers();
  const host = headerStore.get("host");
  const tenant = resolveTenantFromHost(host);

  if (!tenant) {
    return NextResponse.json({ error: "Shop not found." }, { status: 404 });
  }

  return NextResponse.json({ tenant });
}
