import { calculatePromotionDiscount } from "./actions";
import { promotionRulesMatch } from "./rules";
import type { PromotionDefinition, PromotionEvaluationInput } from "./types";

export function evaluatePromotion(promotion: PromotionDefinition, input: PromotionEvaluationInput) {
  if (!promotionRulesMatch(promotion.rules, input)) {
    return {
      promotionId: promotion.id,
      eligible: false,
      discountCents: 0,
    };
  }

  const discountCents = promotion.actions.reduce(
    (total, action) => total + calculatePromotionDiscount(action, input.subtotalCents),
    0,
  );

  return {
    promotionId: promotion.id,
    eligible: true,
    discountCents: Math.min(input.subtotalCents, discountCents),
  };
}
