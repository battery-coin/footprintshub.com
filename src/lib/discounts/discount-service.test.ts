import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyDiscount } from "./discount-service";
import type { PricedCartLine } from "@/lib/catalog/types";

const lines = [
  {
    product: {
      id: "prod_1",
      shopId: "shop_1",
      title: "Deck",
      slug: "deck",
      description: "Deck",
      productType: "physical",
      franchise: "matrix_decoded",
      status: "active",
      priceCents: 10000,
      currency: "USD",
      inventoryQuantity: 5,
      trackInventory: true,
      galleryUrls: [],
      isFeatured: false,
      isLimitedEdition: false,
      digitalUnlockIncluded: false,
      tokenGated: false,
    },
    quantity: 1,
    unitPriceCents: 10000,
    totalCents: 10000,
  },
] satisfies PricedCartLine[];

describe("applyDiscount", () => {
  it("applies percent discounts using basis points", () => {
    const result = applyDiscount({
      discount: {
        code: "WELCOME10",
        type: "percent",
        value: 1000,
        active: true,
      },
      subtotalCents: 10000,
      lines,
      now: new Date("2026-05-10T00:00:00Z"),
    });

    assert.equal(result.applied, true);
    assert.equal(result.discountCents, 1000);
  });

  it("rejects below-minimum coupons", () => {
    const result = applyDiscount({
      discount: {
        code: "BIG",
        type: "fixed",
        value: 5000,
        active: true,
        minSubtotalCents: 20000,
      },
      subtotalCents: 10000,
      lines,
      now: new Date("2026-05-10T00:00:00Z"),
    });

    assert.equal(result.applied, false);
    assert.equal(result.discountCents, 0);
  });
});
