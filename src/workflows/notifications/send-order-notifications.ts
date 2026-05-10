import type { WorkflowDefinition } from "@/lib/workflows/types";

export type SendOrderNotificationsWorkflowInput = {
  shopId: string;
  orderId: string;
  customerEmail?: string;
};

export const sendOrderNotificationsWorkflow: WorkflowDefinition<
  SendOrderNotificationsWorkflowInput,
  SendOrderNotificationsWorkflowInput
> = {
  id: "notifications.send-order",
  name: "Send order notifications",
  steps: [
    {
      id: "load-email-provider",
      name: "Load notification provider",
      execute: (input: SendOrderNotificationsWorkflowInput) => input,
    },
    {
      id: "queue-order-emails",
      name: "Queue order emails",
      execute: (input: SendOrderNotificationsWorkflowInput) => input,
    },
  ],
};
