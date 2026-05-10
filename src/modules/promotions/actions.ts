import type { PromotionAction } from "./types";

export function calculatePromotionDiscount(action: PromotionAction, subtotalCents: number) {
  if (action.type === "percentage") {
    return Math.floor((subtotalCents * (action.value.percentageBps ?? 0)) / 10_000);
  }

  if (action.type === "fixed") {
    return Math.min(subtotalCents, action.value.fixedCents ?? 0);
  }

  return 0;
}
