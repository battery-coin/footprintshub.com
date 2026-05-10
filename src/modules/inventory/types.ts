export type InventoryReservationStatus = "reserved" | "released" | "deducted" | "expired";

export type InventoryReservationRequest = {
  shopId: string;
  cartId?: string;
  orderId?: string;
  inventoryItemId: string;
  stockLocationId: string;
  quantity: number;
  idempotencyKey: string;
  expiresAt?: Date;
};

export type InventoryAvailability = {
  inventoryItemId: string;
  stockLocationId: string;
  stockedQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
};
