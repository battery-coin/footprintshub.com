import { NextResponse } from "next/server";
import { getProducts } from "@/lib/catalog/products";

export async function GET(_request: Request, { params }: { params: Promise<{ idOrSlug: string }> }) {
  const { idOrSlug } = await params;
  const products = await getProducts();
  const product = products.find((entry) => entry.id === idOrSlug || entry.slug === idOrSlug);

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({ product });
}
