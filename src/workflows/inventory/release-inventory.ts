import type { WorkflowDefinition } from "@/lib/workflows/types";

export type ReleaseInventoryWorkflowInput = {
  shopId: string;
  cartId?: string;
  orderId?: string;
  reason: string;
};

export const releaseInventoryWorkflow: WorkflowDefinition<ReleaseInventoryWorkflowInput, ReleaseInventoryWorkflowInput> = {
  id: "inventory.release",
  name: "Release inventory",
  steps: [
    {
      id: "load-reservations",
      name: "Load active reservations",
      execute: (input: ReleaseInventoryWorkflowInput) => input,
    },
    {
      id: "release-reservations",
      name: "Release reservations",
      execute: (input: ReleaseInventoryWorkflowInput) => input,
    },
  ],
};
