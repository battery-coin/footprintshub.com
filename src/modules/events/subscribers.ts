import { publishCommerceEvent, subscribeToCommerceEvent } from "./event-bus";

export function registerCoreCommerceSubscribers() {
  const unsubscribers = [
    subscribeToCommerceEvent("order.paid", async (event) => {
      await publishCommerceEvent({
        ...event,
        type: "affiliate.commission_created",
        aggregateType: "order",
      });
    }),
    subscribeToCommerceEvent("order.paid", async (event) => {
      await publishCommerceEvent({
        ...event,
        type: "digital_unlock.granted",
        aggregateType: "order",
      });
    }),
  ];

  return () => {
    for (const unsubscribe of unsubscribers) {
      unsubscribe();
    }
  };
}
