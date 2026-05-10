import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { getAllProductsForAdmin } from "@/lib/catalog/products";

const productSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  priceCents: z.coerce.number().int().min(0),
});

export async function GET(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json({ products: await getAllProductsForAdmin() });
}

export async function POST(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = productSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product payload." }, { status: 400 });
  }

  return NextResponse.json(
    {
      message: "Product write scaffold accepted. Connect Neon persistence before enabling production writes.",
      product: parsed.data,
    },
    { status: 202 },
  );
}
