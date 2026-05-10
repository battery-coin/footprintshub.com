import type { WorkflowDefinition } from "@/lib/workflows/types";

export type ReserveInventoryWorkflowInput = {
  shopId: string;
  cartId: string;
  idempotencyKey: string;
};

export const reserveInventoryWorkflow: WorkflowDefinition<ReserveInventoryWorkflowInput, ReserveInventoryWorkflowInput> = {
  id: "inventory.reserve",
  name: "Reserve inventory",
  steps: [
    {
      id: "validate-availability",
      name: "Validate availability",
      execute: (input: ReserveInventoryWorkflowInput) => input,
    },
    {
      id: "create-reservations",
      name: "Create reservations",
      execute: (input: ReserveInventoryWorkflowInput) => input,
      compensate: () => undefined,
    },
  ],
};
