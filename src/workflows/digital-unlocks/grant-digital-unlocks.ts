import type { WorkflowDefinition } from "@/lib/workflows/types";

export type GrantDigitalUnlocksWorkflowInput = {
  shopId: string;
  orderId: string;
};

export const grantDigitalUnlocksWorkflow: WorkflowDefinition<GrantDigitalUnlocksWorkflowInput, GrantDigitalUnlocksWorkflowInput> = {
  id: "digital-unlock.grant",
  name: "Grant digital unlocks",
  steps: [
    {
      id: "load-digital-items",
      name: "Load digital order items",
      execute: (input: GrantDigitalUnlocksWorkflowInput) => input,
    },
    {
      id: "create-entitlements",
      name: "Create digital unlock entitlements",
      execute: (input: GrantDigitalUnlocksWorkflowInput) => input,
    },
  ],
};
