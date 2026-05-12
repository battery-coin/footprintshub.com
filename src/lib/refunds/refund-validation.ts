import { z } from "zod";

export const refundItemSchema = z.object({
  orderItemId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(999),
  restock: z.boolean().optional().default(false),
  reason: z.string().trim().max(500).optional(),
});

export const createRefundSchema = z.object({
  orderId: z.string().min(1),
  type: z.enum(["full", "partial", "manual", "store_credit"]).default("partial"),
  provider: z.enum(["stripe", "manual", "store_credit"]).default("stripe"),
  amountCents: z.coerce.number().int().positive().optional(),
  items: z.array(refundItemSchema).optional(),
  reason: z.string().trim().min(3).max(500).default("customer_request"),
  adminNote: z.string().trim().max(1000).optional(),
  customerNote: z.string().trim().max(1000).optional(),
  restock: z.boolean().optional().default(false),
  processNow: z.boolean().optional().default(true),
});

export type CreateRefundInput = z.infer<typeof createRefundSchema>;
