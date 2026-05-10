import test from "node:test";
import assert from "node:assert/strict";
import {
  clearCommerceEventSubscribers,
  createCommerceEvent,
  publishCommerceEvent,
  subscribeToCommerceEvent,
} from "./event-bus";

test("publishCommerceEvent notifies subscribers", async () => {
  clearCommerceEventSubscribers();
  const seen: string[] = [];
  subscribeToCommerceEvent("order.paid", (event) => {
    seen.push(event.aggregateId);
  });

  await publishCommerceEvent(
    createCommerceEvent({
      type: "order.paid",
      aggregateType: "order",
      aggregateId: "order_1",
      payload: {},
    }),
  );

  assert.deepEqual(seen, ["order_1"]);
  clearCommerceEventSubscribers();
});
