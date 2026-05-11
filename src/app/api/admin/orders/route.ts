import { NextResponse } from "next/server";
import { requireRequestPermission } from "@/lib/auth/require-permission";

export async function GET(request: Request) {
  const allowed = await requireRequestPermission(request, "canViewOrders");
  if (!allowed.ok) {
    return allowed.response;
  }

  return NextResponse.json({ orders: [] });
}
