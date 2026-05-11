import { NextResponse } from "next/server";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { getAllProductsForAdmin } from "@/lib/catalog/products";
import { exportProductsToCsv } from "@/lib/export/product-csv-export";

export async function GET(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const csv = exportProductsToCsv(await getAllProductsForAdmin());

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="footprintshub-products.csv"',
    },
  });
}
