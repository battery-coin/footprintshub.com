import { z } from "zod";

export const affiliatePlanLevelPayloadSchema = z.object({
  levelDepth: z.coerce.number().int().min(0).max(20),
  label: z.string().trim().min(1),
  enabled: z.boolean(),
  commissionType: z.enum(["percentage", "fixed", "percentage_plus_fixed", "store_credit"]),
  percentageBps: z.coerce.number().int().min(0).max(10000).optional(),
  fixedCents: z.coerce.number().int().min(0).optional(),
  commissionBase: z.enum([
    "order_subtotal",
    "product_subtotal",
    "item_subtotal",
    "direct_commission",
    "leg_volume",
    "weaker_leg_volume",
    "matrix_level_volume",
    "gross_margin",
  ]),
  maxPerOrderCents: z.coerce.number().int().min(0).optional(),
  maxPerMonthCents: z.coerce.number().int().min(0).optional(),
  sortOrder: z.coerce.number().int().min(0),
});

export const levelsPayloadSchema = z.object({
  levels: z.array(affiliatePlanLevelPayloadSchema).min(1),
});
