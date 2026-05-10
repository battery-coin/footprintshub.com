import { z } from "zod";

export const returnRequestSchema = z.object({
  shopId: z.string().min(1),
  orderId: z.string().min(1),
  orderItemId: z.string().optional(),
  customerId: z.string().optional(),
  reason: z.string().min(2),
  actionRequested: z.enum(["refund", "replacement", "store_credit", "other"]),
  quantity: z.number().int().positive(),
  customerComment: z.string().max(1000).optional(),
});

export type ReturnRequestInput = z.infer<typeof returnRequestSchema>;

export function validateReturnWindow({
  orderCreatedAt,
  now = new Date(),
  allowedDays = 30,
}: {
  orderCreatedAt: Date;
  now?: Date;
  allowedDays?: number;
}) {
  const ageMs = now.getTime() - orderCreatedAt.getTime();
  const allowedMs = allowedDays * 24 * 60 * 60 * 1000;

  return {
    ok: ageMs <= allowedMs,
    reason: ageMs <= allowedMs ? undefined : "Return window has expired.",
  };
}
