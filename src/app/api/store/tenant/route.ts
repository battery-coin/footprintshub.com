import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { resolveTenantFromHost } from "@/lib/tenant/resolve-tenant";

export async function GET() {
  const headerStore = await headers();
  const tenant = resolveTenantFromHost(headerStore.get("host"));

  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found." }, { status: 404 });
  }

  return NextResponse.json({ tenant });
}
