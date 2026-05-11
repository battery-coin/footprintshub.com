import { NextResponse } from "next/server";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { parseCsvProducts } from "@/lib/import/csv-product-import";
import { mapImportRowToProduct } from "@/lib/import/product-import-mapper";
import { createImportJob, saveProduct } from "@/lib/products/product-service";

export async function POST(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const csv = typeof body?.csv === "string" ? body.csv : "";
  const commit = Boolean(body?.commit);

  if (csv.length > 500_000) {
    return NextResponse.json({ error: "CSV import is limited to 500 KB in the MVP importer." }, { status: 413 });
  }

  const rows = parseCsvProducts(csv);
  const mapped = rows.map((row, index) => {
    try {
      return { rowNumber: index + 2, ok: true as const, product: mapImportRowToProduct(row) };
    } catch (error) {
      return { rowNumber: index + 2, ok: false as const, error: error instanceof Error ? error.message : "Invalid row." };
    }
  });

  let imported = 0;
  if (commit) {
    for (const row of mapped) {
      if (row.ok) {
        await saveProduct(row.product);
        imported += 1;
      }
    }
  }

  const job = await createImportJob({
    type: "csv",
    sourceName: "CSV upload",
    totalRows: rows.length,
    successRows: commit ? imported : mapped.filter((row) => row.ok).length,
    failedRows: mapped.filter((row) => !row.ok).length,
    mapping: { mode: commit ? "import" : "preview" },
  });

  return NextResponse.json({ job, rows: mapped.slice(0, 25), totalRows: rows.length, imported });
}
