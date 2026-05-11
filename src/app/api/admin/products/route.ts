import { NextResponse } from "next/server";
import { logProductChanged, logPriceChanged } from "@/lib/audit/audit-log";
import { requireRequestPermission } from "@/lib/auth/require-permission";
import { getAllProductsForAdmin } from "@/lib/catalog/products";
import { productEditorSchema } from "@/lib/products/product-validation";
import { saveProduct } from "@/lib/products/product-service";

export async function GET(request: Request) {
  const allowed = await requireRequestPermission(request, "canManageProducts");
  if (!allowed.ok) {
    return allowed.response;
  }

  return NextResponse.json({ products: await getAllProductsForAdmin() });
}

export async function POST(request: Request) {
  const allowed = await requireRequestPermission(request, "canManageProducts");
  if (!allowed.ok) {
    return allowed.response;
  }

  const parsed = productEditorSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product payload.", issues: parsed.error.issues }, { status: 400 });
  }

  const result = await saveProduct(parsed.data);
  await logProductChanged({ actorId: allowed.user?.id, targetType: "product", targetId: result.productId, metadata: { title: parsed.data.title } });
  await logPriceChanged({ actorId: allowed.user?.id, targetType: "product", targetId: result.productId, metadata: { priceCents: parsed.data.priceCents } });
  return NextResponse.json(result, { status: result.stored ? 201 : 202 });
}
