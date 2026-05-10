import type { WorkflowDefinition } from "@/lib/workflows/types";

export type CalculateOrderCommissionsWorkflowInput = {
  shopId: string;
  orderId: string;
  idempotencyKey: string;
};

export const calculateOrderCommissionsWorkflow: WorkflowDefinition<
  CalculateOrderCommissionsWorkflowInput,
  CalculateOrderCommissionsWorkflowInput
> = {
  id: "affiliate.calculate-order-commissions",
  name: "Calculate affiliate commissions",
  steps: [
    {
      id: "resolve-attribution",
      name: "Resolve attribution",
      execute: (input: CalculateOrderCommissionsWorkflowInput) => input,
    },
    {
      id: "calculate-commission-ledger",
      name: "Calculate commission ledger entries",
      execute: (input: CalculateOrderCommissionsWorkflowInput) => input,
    },
  ],
};
