import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateTotalsPipeline } from "./totals-pipeline";
import type { PricedCartLine } from "@/lib/catalog/types";

describe("totals pipeline", () => {
  it("orders subtotal, discounts, credits, shipping, tax, and grand total", () => {
    const result = calculateTotalsPipeline({
      lines: [line({ priceCents: 10000, requiresShipping: true })],
      giftVoucherCents: 1000,
      storeCreditCents: 500,
      loyaltyPointsCents: 250,
      shipping: { method: { code: "flat", name: "Flat", priceCents: 700 } },
    });

    assert.deepEqual(
      result.lines.map((item) => item.code),
      ["subtotal", "discount", "gift_voucher", "store_credit", "loyalty_points", "shipping", "tax", "grand_total"],
    );
    assert.equal(result.shippingCents, 700);
    assert.equal(result.totalCents, 8950);
  });

  it("skips shipping for digital-only cart", () => {
    const result = calculateTotalsPipeline({
      lines: [line({ priceCents: 2500, requiresShipping: false })],
      shipping: { method: { code: "flat", name: "Flat", priceCents: 700 } },
    });

    assert.equal(result.requiresShipping, false);
    assert.equal(result.shippingCents, 0);
  });
});

function line({ priceCents, requiresShipping }: { priceCents: number; requiresShipping: boolean }): PricedCartLine {
  return {
    product: {
      id: "prod_1",
      shopId: "shop_1",
      title: "Test Product",
      slug: "test-product",
      description: "Test",
      productType: requiresShipping ? "physical" : "digital",
      franchise: "footprints",
      status: "active",
      priceCents,
      currency: "USD",
      inventoryQuantity: 10,
      trackInventory: true,
      galleryUrls: [],
      isFeatured: false,
      isLimitedEdition: false,
      requiresShipping,
      digitalUnlockIncluded: !requiresShipping,
      tokenGated: false,
    },
    quantity: 1,
    unitPriceCents: priceCents,
    totalCents: priceCents,
  };
}
