import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseCsvProducts } from "./csv-product-import";
import { validateImportUrl } from "./import-security";
import { mapImportRowToProduct } from "./product-import-mapper";

describe("product imports", () => {
  it("parses CSV rows and maps them to product inputs", () => {
    const rows = parseCsvProducts("title,slug,price,sku\nSample Product,sample-product,12.50,SAMPLE-1");
    const product = mapImportRowToProduct(rows[0]);

    assert.equal(product.title, "Sample Product");
    assert.equal(product.priceCents, 1250);
    assert.equal(product.sku, "SAMPLE-1");
  });

  it("blocks private import URLs outside localhost-friendly mode", () => {
    const result = validateImportUrl("http://127.0.0.1:3000/products.json", false);
    assert.equal(result.ok, false);
  });
});
