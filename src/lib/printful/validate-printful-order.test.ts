import assert from "node:assert/strict";
import { test } from "node:test";
import { PrintfulValidationError } from "./printful-errors";
import { validatePrintfulOrderPayload } from "./validate-printful-order";

test("blocks Printful payload without a mapped variant", () => {
  assert.throws(
    () =>
      validatePrintfulOrderPayload({
        external_id: "FH-TEST",
        shipping: "STANDARD",
        recipient: {
          name: "Test Customer",
          address1: "1 Main St",
          city: "Los Angeles",
          state_code: "CA",
          country_code: "US",
          zip: "90001",
        },
        items: [{ quantity: 1, name: "T-shirt" }],
      }),
    PrintfulValidationError,
  );
});

test("accepts Printful payload with sync variant mapping", () => {
  const payload = validatePrintfulOrderPayload({
    external_id: "FH-TEST",
    shipping: "STANDARD",
    recipient: {
      name: "Test Customer",
      address1: "1 Main St",
      city: "Los Angeles",
      state_code: "CA",
      country_code: "US",
      zip: "90001",
    },
    items: [{ quantity: 1, name: "T-shirt", sync_variant_id: 123 }],
  });

  assert.equal(payload.items[0]?.sync_variant_id, 123);
});
