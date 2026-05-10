import { NextResponse } from "next/server";
import { getProducts } from "@/lib/catalog/products";

export async function GET() {
  return NextResponse.json({ products: await getProducts() });
}
