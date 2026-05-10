import type { WorkflowDefinition } from "@/lib/workflows/types";

export type CreateCheckoutSessionWorkflowInput = {
  shopId: string;
  cartId: string;
  successUrl: string;
  cancelUrl: string;
};

export type CreateCheckoutSessionWorkflowOutput = {
  shopId: string;
  cartId: string;
  provider: "stripe_checkout";
  requiresRedirect: true;
};

export const createCheckoutSessionWorkflow: WorkflowDefinition<
  CreateCheckoutSessionWorkflowInput,
  CreateCheckoutSessionWorkflowOutput
> = {
  id: "checkout.create-session",
  name: "Create checkout session",
  steps: [
    {
      id: "resolve-cart",
      name: "Resolve cart",
      execute: (input: CreateCheckoutSessionWorkflowInput) => input,
    },
    {
      id: "validate-cart",
      name: "Validate cart items, discounts, shipping, and inventory",
      execute: (input: CreateCheckoutSessionWorkflowInput) => input,
    },
    {
      id: "calculate-server-totals",
      name: "Calculate server-side totals",
      execute: (input: CreateCheckoutSessionWorkflowInput) => input,
    },
    {
      id: "prepare-payment-session",
      name: "Prepare payment session",
      execute: (input: CreateCheckoutSessionWorkflowInput) => ({
        shopId: input.shopId,
        cartId: input.cartId,
        provider: "stripe_checkout" as const,
        requiresRedirect: true as const,
      }),
    },
  ],
};
