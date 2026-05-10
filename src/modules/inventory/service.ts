import type { InventoryAvailability, InventoryReservationRequest } from "./types";

export function canReserveInventory(availability: InventoryAvailability, requestedQuantity: number) {
  if (requestedQuantity <= 0) {
    return false;
  }

  return availability.availableQuantity >= requestedQuantity;
}

export function createReservationPreview(input: InventoryReservationRequest) {
  if (input.quantity <= 0) {
    throw new Error("Reservation quantity must be greater than zero.");
  }

  return {
    ...input,
    status: "reserved" as const,
    expiresAt: input.expiresAt ?? new Date(Date.now() + 30 * 60 * 1000),
  };
}

export function calculateAvailableQuantity(stockedQuantity: number, reservedQuantity: number) {
  return Math.max(0, stockedQuantity - reservedQuantity);
}
