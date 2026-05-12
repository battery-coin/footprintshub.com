import assert from "node:assert/strict";
import { test } from "node:test";
import { adProductTypes, starterAdProducts } from "./ad-products";

test("starter ad products are active non-shipping cart products", () => {
  assert.ok(starterAdProducts.length >= 8);
  for (const product of starterAdProducts) {
    assert.equal(product.status, "active");
    assert.equal(product.requiresShipping, false);
    assert.equal(product.deliveryMode, "ad_review_and_schedule");
    assert.ok(adProductTypes.has(product.productType));
  }
});
