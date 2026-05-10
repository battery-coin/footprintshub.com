import type { PromotionEvaluationInput, PromotionRule } from "./types";

export function evaluatePromotionRule(rule: PromotionRule, input: PromotionEvaluationInput) {
  const valuesByAttribute = {
    productId: input.productIds,
    categoryId: input.categoryIds,
    collectionId: input.collectionIds,
    customerGroupId: input.customerGroupId,
    subtotalCents: input.subtotalCents,
  };
  const actual = valuesByAttribute[rule.attribute];

  if (rule.operator === "equals") {
    return actual === rule.value;
  }

  if (rule.operator === "in") {
    const expected = Array.isArray(rule.value) ? rule.value : [String(rule.value)];
    const actualValues = Array.isArray(actual) ? actual : actual ? [String(actual)] : [];
    return expected.some((value) => actualValues.includes(value));
  }

  if (rule.operator === "gte") {
    return Number(actual) >= Number(rule.value);
  }

  if (rule.operator === "lte") {
    return Number(actual) <= Number(rule.value);
  }

  return false;
}

export function promotionRulesMatch(rules: PromotionRule[], input: PromotionEvaluationInput) {
  return rules.every((rule) => evaluatePromotionRule(rule, input));
}
