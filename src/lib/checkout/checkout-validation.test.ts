import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateCheckoutReadiness, type CheckoutIntentInput } from "./checkout-validation";
import type { PricedCartLine } from "@/lib/catalog/types";

describe("checkout validation", () => {
  it("requires shipping method and address for physical products", () => {
    const result = validateCheckoutReadiness({
      input: baseInput(),
      lines: [line(true)],
    });

    assert.equal(result.ok, false);
    assert.match(result.errors.join(" "), /Shipping address/);
    assert.match(result.errors.join(" "), /Shipping method/);
  });

  it("allows download-only checkout without shipping", () => {
    const result = validateCheckoutReadiness({
      input: baseInput({ termsAccepted: true }),
      lines: [line(false)],
    });

    assert.equal(result.ok, true);
    assert.equal(result.requiresShipping, false);
  });
});

function baseInput(overrides: Partial<CheckoutIntentInput> = {}): CheckoutIntentInput {
  return {
    cartId: "cart_1",
    customerEmail: "buyer@example.com",
    sameAsShipping: true,
    termsAccepted: false,
    newsletterOptIn: false,
    preorderAcknowledged: false,
    randomizedOddsAcknowledged: false,
    ...overrides,
  };
}

function line(requiresShipping: boolean): PricedCartLine {
  return {
    product: {
      id: "prod_1",
      shopId: "shop_1",
      title: "Product",
      slug: "product",
      description: "Product",
      productType: requiresShipping ? "physical" : "digital",
      franchise: "footprints",
      status: "active",
      priceCents: 1000,
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
    unitPriceCents: 1000,
    totalCents: 1000,
  };
}
