import test from "node:test";
import assert from "node:assert/strict";
import { evaluatePromotion } from "./service";

test("evaluatePromotion applies a percentage action when rules match", () => {
  const result = evaluatePromotion(
    {
      id: "promo_1",
      name: "Ten percent",
      rules: [{ attribute: "subtotalCents", operator: "gte", value: 1000 }],
      actions: [{ type: "percentage", value: { percentageBps: 1000 } }],
    },
    {
      subtotalCents: 5000,
      productIds: [],
      categoryIds: [],
      collectionIds: [],
    },
  );

  assert.equal(result.eligible, true);
  assert.equal(result.discountCents, 500);
});
