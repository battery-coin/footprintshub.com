import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createInventoryDeductionDrafts, validateInventoryForCart } from "./inventory-service";
import type { PricedCartLine } from "@/lib/catalog/types";

const line = {
  product: {
    id: "prod_1",
    shopId: "shop_1",
    title: "Poster",
    slug: "poster",
    description: "Poster",
    productType: "physical",
    franchise: "footprints",
    status: "active",
    priceCents: 2500,
    currency: "USD",
    inventoryQuantity: 2,
    trackInventory: true,
    galleryUrls: [],
    isFeatured: false,
    isLimitedEdition: false,
    digitalUnlockIncluded: false,
    tokenGated: false,
  },
  quantity: 3,
  unitPriceCents: 2500,
  totalCents: 7500,
} satisfies PricedCartLine;

describe("inventory service", () => {
  it("rejects carts that exceed inventory when backorder is disabled", () => {
    const result = validateInventoryForCart([line]);

    assert.equal(result.ok, false);
    assert.equal(result.errors.length, 1);
  });

  it("creates negative inventory ledger deductions", () => {
    const drafts = createInventoryDeductionDrafts([{ ...line, quantity: 1, totalCents: 2500 }], "order_1");

    assert.equal(drafts[0].quantityDelta, -1);
    assert.equal(drafts[0].idempotencyKey, "inventory:deduct:order_1:prod_1");
  });
});
