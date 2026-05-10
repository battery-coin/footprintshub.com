import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateCartTotals } from "./cart-totals";
import type { PricedCartLine } from "@/lib/catalog/types";

const line = {
  product: {
    id: "prod_1",
    shopId: "shop_1",
    title: "Test product",
    slug: "test-product",
    description: "Test",
    productType: "physical",
    franchise: "footprints",
    status: "active",
    priceCents: 5000,
    currency: "USD",
    inventoryQuantity: 10,
    trackInventory: true,
    galleryUrls: [],
    isFeatured: false,
    isLimitedEdition: false,
    digitalUnlockIncluded: false,
    tokenGated: false,
    requiresShipping: true,
  },
  quantity: 2,
  unitPriceCents: 5000,
  totalCents: 10000,
} satisfies PricedCartLine;

describe("calculateCartTotals", () => {
  it("calculates subtotal, fixed discount, shipping, and total", () => {
    const totals = calculateCartTotals({
      lines: [line],
      discount: {
        code: "SAVE10",
        type: "fixed",
        value: 1000,
        active: true,
      },
      shipping: {
        method: {
          code: "flat_rate",
          name: "Flat rate",
          priceCents: 799,
        },
      },
    });

    assert.equal(totals.subtotalCents, 10000);
    assert.equal(totals.discountCents, 1000);
    assert.equal(totals.shippingCents, 799);
    assert.equal(totals.taxCents, 0);
    assert.equal(totals.totalCents, 9799);
  });

  it("does not charge shipping for digital-only carts", () => {
    const totals = calculateCartTotals({
      lines: [
        {
          ...line,
          product: {
            ...line.product,
            productType: "digital",
            requiresShipping: false,
          },
        },
      ],
    });

    assert.equal(totals.requiresShipping, false);
    assert.equal(totals.shippingCents, 0);
  });
});
