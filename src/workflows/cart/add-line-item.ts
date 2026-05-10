import type { WorkflowDefinition } from "@/lib/workflows/types";

export type AddLineItemWorkflowInput = {
  shopId: string;
  cartId?: string;
  sessionId: string;
  productId: string;
  variantId?: string;
  quantity: number;
};

export type AddLineItemWorkflowOutput = AddLineItemWorkflowInput & {
  totalsRecalculated: boolean;
};

export const addLineItemWorkflow: WorkflowDefinition<AddLineItemWorkflowInput, AddLineItemWorkflowOutput> = {
  id: "cart.add-line-item",
  name: "Add line item",
  steps: [
    {
      id: "resolve-shop",
      name: "Resolve shop context",
      execute: (input: AddLineItemWorkflowInput) => input,
    },
    {
      id: "validate-product",
      name: "Validate product and variant",
      execute: (input: AddLineItemWorkflowInput) => input,
    },
    {
      id: "validate-inventory",
      name: "Validate inventory availability",
      execute: (input: AddLineItemWorkflowInput) => input,
    },
    {
      id: "upsert-line-item",
      name: "Create or update line item",
      execute: (input: AddLineItemWorkflowInput) => input,
    },
    {
      id: "recalculate-totals",
      name: "Recalculate cart totals",
      execute: (input: AddLineItemWorkflowInput) => ({
        ...input,
        totalsRecalculated: true,
      }),
    },
  ],
};
