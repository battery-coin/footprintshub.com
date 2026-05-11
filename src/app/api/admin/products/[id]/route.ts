import { NextResponse } from "next/server";
import { logProductChanged, logPriceChanged } from "@/lib/audit/audit-log";
import { requireRequestPermission } from "@/lib/auth/require-permission";
import { getProductForEditor, saveProduct } from "@/lib/products/product-service";
import { productEditorSchema } from "@/lib/products/product-validation";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  const allowed = await requireRequestPermission(request, "canManageProducts");
  if (!allowed.ok) {
    return allowed.response;
  }

  const { id } = await params;
  const product = await getProductForEditor(id);

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  const allowed = await requireRequestPermission(request, "canManageProducts");
  if (!allowed.ok) {
    return allowed.response;
  }

  const parsed = productEditorSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product payload.", issues: parsed.error.issues }, { status: 400 });
  }

  const { id } = await params;
  const result = await saveProduct(parsed.data, id);
  await logProductChanged({ actorId: allowed.user?.id, targetType: "product", targetId: id, metadata: { title: parsed.data.title } });
  await logPriceChanged({ actorId: allowed.user?.id, targetType: "product", targetId: id, metadata: { priceCents: parsed.data.priceCents } });
  return NextResponse.json(result, { status: result.stored ? 200 : 202 });
}
