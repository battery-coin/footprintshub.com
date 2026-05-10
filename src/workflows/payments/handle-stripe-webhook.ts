import type { WorkflowDefinition } from "@/lib/workflows/types";

export type HandleStripeWebhookWorkflowInput = {
  eventId: string;
  eventType: string;
  orderId?: string;
  shopId?: string;
};

export type HandleStripeWebhookWorkflowOutput = HandleStripeWebhookWorkflowInput & {
  handled: boolean;
};

export const handleStripeWebhookWorkflow: WorkflowDefinition<
  HandleStripeWebhookWorkflowInput,
  HandleStripeWebhookWorkflowOutput
> = {
  id: "payment.stripe-webhook",
  name: "Handle Stripe webhook",
  steps: [
    {
      id: "verify-signature",
      name: "Verify Stripe signature",
      execute: (input: HandleStripeWebhookWorkflowInput) => input,
    },
    {
      id: "record-idempotency",
      name: "Record webhook idempotency",
      execute: (input: HandleStripeWebhookWorkflowInput) => input,
    },
    {
      id: "normalize-event",
      name: "Normalize provider event",
      execute: (input: HandleStripeWebhookWorkflowInput) => ({ ...input, handled: true }),
    },
  ],
};
