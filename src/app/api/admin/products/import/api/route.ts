import { NextResponse } from "next/server";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { fetchProductImportPreview } from "@/lib/import/api-product-import";
import { mapUnknownApiProductToProduct } from "@/lib/import/product-import-mapper";
import { createImportJob, saveProduct } from "@/lib/products/product-service";

export async function POST(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url : "";
  const commit = Boolean(body?.commit);
  const preview = await fetchProductImportPreview(url);

  if (!preview.ok) {
    return NextResponse.json({ error: preview.error }, { status: 400 });
  }

  let imported = 0;
  if (commit) {
    for (const product of preview.products) {
      await saveProduct(mapUnknownApiProductToProduct(product));
      imported += 1;
    }
  }

  const job = await createImportJob({
    type: "api",
    sourceName: commit ? "JSON API import" : "JSON API preview",
    sourceUrl: url,
    totalRows: preview.total,
    successRows: commit ? imported : preview.products.length,
    mapping: { mode: commit ? "import" : "preview" },
  });

  return NextResponse.json({ job, products: preview.products, total: preview.total, imported });
}
