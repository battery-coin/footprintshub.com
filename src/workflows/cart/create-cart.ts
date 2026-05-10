import type { WorkflowDefinition } from "@/lib/workflows/types";

export type CreateCartWorkflowInput = {
  shopId: string;
  sessionId: string;
  customerId?: string;
  currency?: string;
};

export type CreateCartWorkflowOutput = CreateCartWorkflowInput & {
  status: "ready";
};

export const createCartWorkflow: WorkflowDefinition<CreateCartWorkflowInput, CreateCartWorkflowOutput> = {
  id: "cart.create",
  name: "Create cart",
  steps: [
    {
      id: "resolve-shop",
      name: "Resolve shop",
      execute: (input: CreateCartWorkflowInput) => input,
    },
    {
      id: "create-or-reuse-cart",
      name: "Create or reuse cart",
      execute: (input: CreateCartWorkflowInput) => ({
        ...input,
        currency: input.currency ?? "USD",
        status: "ready" as const,
      }),
    },
  ],
};
