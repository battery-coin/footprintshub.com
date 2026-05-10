import type { WorkflowDefinition } from "@/lib/workflows/types";

export type DeductInventoryWorkflowInput = {
  shopId: string;
  orderId: string;
  idempotencyKey: string;
};

export const deductInventoryWorkflow: WorkflowDefinition<DeductInventoryWorkflowInput, DeductInventoryWorkflowInput> = {
  id: "inventory.deduct",
  name: "Deduct inventory",
  steps: [
    {
      id: "load-order-items",
      name: "Load order items",
      execute: (input: DeductInventoryWorkflowInput) => input,
    },
    {
      id: "deduct-once",
      name: "Deduct stock once",
      execute: (input: DeductInventoryWorkflowInput) => input,
      compensate: () => undefined,
    },
  ],
};
