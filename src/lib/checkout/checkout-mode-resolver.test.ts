import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveCheckoutMode } from "./checkout-mode-resolver";
import type { CatalogProduct, PricedCartLine } from "@/lib/catalog/types";

function line(overrides: Partial<CatalogProduct>): PricedCartLine {
  const product: CatalogProduct = {
    id: overrides.id ?? "product_1",
    shopId: "shop_1",
    title: overrides.title ?? "Product",
    slug: overrides.slug ?? "product",
    description: "Test product",
    productType: overrides.productType ?? "physical",
    paymentMode: overrides.paymentMode ?? "one_time",
    deliveryMode: overrides.deliveryMode ?? "shipped",
    franchise: "footprints",
    status: "active",
    visibility: "visible",
    priceCents: overrides.priceCents ?? 1000,
    currency: "USD",
    inventoryQuantity: 10,
    trackInventory: true,
    galleryUrls: [],
    isFeatured: false,
    isLimitedEdition: false,
    requiresShipping: overrides.requiresShipping ?? true,
    digitalUnlockIncluded: false,
    tokenGated: false,
    metadata: overrides.metadata,
  };

  return {
    product,
    quantity: 1,
    unitPriceCents: product.priceCents,
    totalCents: product.priceCents,
  };
}

test("resolves one-time carts to payment mode", () => {
  const result = resolveCheckoutMode([line({ productType: "physical", paymentMode: "one_time" })]);
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.mode, "payment");
});

test("resolves subscription carts to subscription mode", () => {
  const result = resolveCheckoutMode([line({ productType: "subscription", paymentMode: "recurring" })]);
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.mode, "subscription");
});

test("blocks mixed one-time and recurring checkout", () => {
  const result = resolveCheckoutMode([
    line({ id: "physical", productType: "physical", paymentMode: "one_time" }),
    line({ id: "subscription", productType: "subscription", paymentMode: "recurring" }),
  ]);

  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.reason, /separately/i);
});
