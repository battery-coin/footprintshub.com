export type PromotionActionType = "percentage" | "fixed" | "free_shipping" | "buy_x_get_y";

export type PromotionRule = {
  attribute: "productId" | "categoryId" | "collectionId" | "customerGroupId" | "subtotalCents";
  operator: "equals" | "in" | "gte" | "lte";
  value: string | string[] | number;
};

export type PromotionAction = {
  type: PromotionActionType;
  value: {
    percentageBps?: number;
    fixedCents?: number;
  };
};

export type PromotionEvaluationInput = {
  subtotalCents: number;
  productIds: string[];
  categoryIds: string[];
  collectionIds: string[];
  customerGroupId?: string;
};

export type PromotionDefinition = {
  id: string;
  code?: string;
  name: string;
  rules: PromotionRule[];
  actions: PromotionAction[];
};
