import test from "node:test";
import assert from "node:assert/strict";
import { calculateAvailableQuantity, canReserveInventory, createReservationPreview } from "./service";

test("canReserveInventory respects available quantity", () => {
  assert.equal(
    canReserveInventory(
      {
        inventoryItemId: "inv_1",
        stockLocationId: "loc_1",
        stockedQuantity: 10,
        reservedQuantity: 4,
        availableQuantity: 6,
      },
      6,
    ),
    true,
  );
  assert.equal(
    canReserveInventory(
      {
        inventoryItemId: "inv_1",
        stockLocationId: "loc_1",
        stockedQuantity: 10,
        reservedQuantity: 4,
        availableQuantity: 6,
      },
      7,
    ),
    false,
  );
});

test("createReservationPreview rejects invalid quantities", () => {
  assert.throws(() =>
    createReservationPreview({
      shopId: "shop_1",
      cartId: "cart_1",
      inventoryItemId: "inv_1",
      stockLocationId: "loc_1",
      quantity: 0,
      idempotencyKey: "reserve_1",
    }),
  );
});

test("calculateAvailableQuantity never returns a negative number", () => {
  assert.equal(calculateAvailableQuantity(3, 5), 0);
});
