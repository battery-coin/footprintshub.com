import type { WorkflowDefinition } from "@/lib/workflows/types";

export type CompleteOrderWorkflowInput = {
  shopId: string;
  orderId: string;
  paymentSessionId?: string;
  idempotencyKey: string;
};

export type CompleteOrderWorkflowOutput = CompleteOrderWorkflowInput & {
  completed: boolean;
};

export const completeOrderWorkflow: WorkflowDefinition<CompleteOrderWorkflowInput, CompleteOrderWorkflowOutput> = {
  id: "order.complete",
  name: "Complete paid order",
  steps: [
    {
      id: "mark-payment-paid",
      name: "Mark payment paid",
      execute: (input: CompleteOrderWorkflowInput) => input,
    },
    {
      id: "mark-order-paid",
      name: "Mark order paid",
      execute: (input: CompleteOrderWorkflowInput) => input,
    },
    {
      id: "deduct-inventory",
      name: "Deduct inventory",
      execute: (input: CompleteOrderWorkflowInput) => input,
      compensate: () => undefined,
    },
    {
      id: "grant-digital-unlocks",
      name: "Grant digital unlocks",
      execute: (input: CompleteOrderWorkflowInput) => input,
    },
    {
      id: "calculate-affiliate-commissions",
      name: "Calculate affiliate commissions",
      execute: (input: CompleteOrderWorkflowInput) => input,
    },
    {
      id: "emit-order-paid",
      name: "Emit order paid event",
      execute: (input: CompleteOrderWorkflowInput, context) => {
        context.events?.push({
          type: "order.paid",
          aggregateType: "order",
          aggregateId: input.orderId,
          payload: { shopId: input.shopId },
        });

        return { ...input, completed: true };
      },
    },
  ],
};
