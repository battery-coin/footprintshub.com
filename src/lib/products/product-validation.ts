import { z } from "zod";

export const productTypes = [
  "physical",
  "digital",
  "digital_download",
  "digital_unlock",
  "service",
  "subscription",
  "bundle",
  "membership",
  "nft",
  "nft_linked_physical",
  "ad_placement",
  "sponsorship",
  "campaign_boost",
  "creator_promotion",
  "fan_club_promotion",
  "newsletter_ad",
  "homepage_feature",
  "banner_ad",
  "video_ad",
  "event_sponsorship",
  "classified_ad",
  "featured_listing",
  "social_promotion_package",
  "preorder",
  "blind_box",
  "booster_pack",
  "print_on_demand",
  "event_access",
  "appointment",
  "donation_like_supporter_bundle",
] as const;

export const productFranchises = ["footprints", "matrix_decoded", "hero_studio", "battery_movement", "other"] as const;
export const productStatuses = ["draft", "active", "archived", "hidden", "sold_out"] as const;
export const productVisibilities = ["visible", "hidden", "catalog_only", "direct_link"] as const;
export const paymentModes = ["one_time", "recurring", "one_time_or_recurring", "free", "external"] as const;
export const deliveryModes = [
  "shipped",
  "download",
  "access_grant",
  "service_scheduled",
  "subscription_access",
  "nft_claim",
  "ad_review_and_schedule",
  "ad_auto_schedule",
  "sponsor_placement",
  "campaign_boost",
  "featured_listing",
  "hybrid",
  "none",
] as const;
export const fulfillmentTypes = [
  "manual",
  "printful",
  "digital",
  "digital_download",
  "digital_unlock",
  "service_delivery",
  "subscription_access",
  "nft_delivery",
  "ad_delivery",
  "sponsorship_delivery",
  "promotion_delivery",
  "hybrid",
  "none",
  "internal",
  "mixed",
] as const;
export const recurringIntervals = ["day", "week", "month", "year"] as const;

const optionalText = z.string().trim().optional().default("");
const optionalCents = z.number().int().min(0).optional().nullable();
const optionalNumberText = z.string().trim().optional().default("");

export const productMediaInputSchema = z.object({
  url: z.string().trim().url("Enter a valid image or media URL."),
  altText: optionalText,
  mediaType: z.enum(["image", "video", "model"]).default("image"),
  variantSku: optionalText,
  isPrimary: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

export const productOptionInputSchema = z.object({
  name: z.string().trim().min(1, "Option name is required."),
  values: z.array(z.string().trim().min(1)).min(1, "Add at least one option value."),
});

export const productVariantInputSchema = z.object({
  id: optionalText,
  title: z.string().trim().min(1, "Variant title is required."),
  sku: optionalText,
  barcode: optionalText,
  optionValues: z.record(z.string(), z.string()).default({}),
  priceCents: optionalCents,
  compareAtPriceCents: optionalCents,
  costCents: optionalCents,
  paymentMode: z.enum(paymentModes).optional(),
  stripePriceIdOneTime: optionalText,
  stripePriceIdRecurring: optionalText,
  recurringInterval: z.enum(recurringIntervals).optional().nullable(),
  recurringIntervalCount: z.number().int().min(1).optional().nullable(),
  trialPeriodDays: z.number().int().min(0).optional().nullable(),
  digitalAssetId: optionalText,
  serviceTemplateId: optionalText,
  nftTemplateId: optionalText,
  inventoryQuantity: z.number().int().min(0).default(0),
  trackInventory: z.boolean().default(true),
  allowBackorder: z.boolean().default(false),
  weightValue: optionalNumberText,
  weightUnit: optionalText,
  taxable: z.boolean().optional(),
  imageUrl: optionalText,
  printfulVariantId: optionalText,
  printfulSyncVariantId: optionalText,
  active: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export const discountScheduleInputSchema = z.object({
  id: optionalText,
  name: z.string().trim().min(1, "Sale name is required."),
  type: z.enum(["percentage", "fixed", "sale_price"]).default("percentage"),
  percentageBps: optionalCents,
  fixedCents: optionalCents,
  salePriceCents: optionalCents,
  startsAt: z.string().trim().min(1, "Start date is required."),
  endsAt: z.string().trim().min(1, "End date is required."),
  active: z.boolean().default(true),
});

export const productEditorSchema = z
  .object({
    title: z.string().trim().min(2, "Title is required."),
    slug: z.string().trim().min(2, "Slug is required.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a URL-safe slug."),
    subtitle: optionalText,
    description: z.string().trim().min(1, "Description is required."),
    shortDescription: optionalText,
    productType: z.enum(productTypes).default("physical"),
    paymentMode: z.enum(paymentModes).default("one_time"),
    franchise: z.enum(productFranchises).default("footprints"),
    status: z.enum(productStatuses).default("draft"),
    visibility: z.enum(productVisibilities).default("visible"),
    priceCents: z.number().int().min(0, "Price cannot be negative."),
    compareAtPriceCents: optionalCents,
    costCents: optionalCents,
    currency: z.string().trim().length(3).default("USD"),
    sku: optionalText,
    barcode: optionalText,
    inventoryQuantity: z.number().int().min(0).default(0),
    trackInventory: z.boolean().default(true),
    allowBackorder: z.boolean().default(false),
    lowStockThreshold: z.number().int().min(0).optional().nullable(),
    requiresShipping: z.boolean().default(true),
    deliveryMode: z.enum(deliveryModes).default("shipped"),
    requiresScheduling: z.boolean().default(false),
    requiresDownload: z.boolean().default(false),
    requiresWallet: z.boolean().default(false),
    subscriptionEligible: z.boolean().default(false),
    nftEligible: z.boolean().default(false),
    accessDurationDays: z.number().int().min(0).optional().nullable(),
    termsRequired: z.boolean().default(false),
    weightValue: optionalNumberText,
    weightUnit: optionalText,
    lengthValue: optionalNumberText,
    widthValue: optionalNumberText,
    heightValue: optionalNumberText,
    dimensionUnit: optionalText,
    taxable: z.boolean().default(true),
    taxClassId: optionalText,
    fulfillmentType: z.enum(fulfillmentTypes).default("manual"),
    printfulProductId: optionalText,
    printfulSyncProductId: optionalText,
    digitalUnlockIncluded: z.boolean().default(false),
    tokenGated: z.boolean().default(false),
    blindBoxEligible: z.boolean().default(false),
    boosterPackEligible: z.boolean().default(false),
    affiliateEligible: z.boolean().default(true),
    oddsDisclosureUrl: optionalText,
    imageUrl: optionalText,
    media: z.array(productMediaInputSchema).default([]),
    options: z.array(productOptionInputSchema).default([]),
    variants: z.array(productVariantInputSchema).default([]),
    discountSchedules: z.array(discountScheduleInputSchema).default([]),
    categoryName: optionalText,
    collectionName: optionalText,
    vendor: optionalText,
    tags: z.array(z.string().trim().min(1)).default([]),
    isFeatured: z.boolean().default(false),
    isLimitedEdition: z.boolean().default(false),
    preorderStatus: optionalText,
    preorderReleaseAt: optionalText,
    scheduledPublishAt: optionalText,
    seoTitle: optionalText,
    seoDescription: optionalText,
    canonicalUrl: optionalText,
    metadataJson: z.string().trim().default("{}"),
  })
  .superRefine((product, context) => {
    if (product.compareAtPriceCents != null && product.compareAtPriceCents < product.priceCents) {
      context.addIssue({
        code: "custom",
        path: ["compareAtPriceCents"],
        message: "Compare-at price should be greater than or equal to the product price.",
      });
    }

    if (product.fulfillmentType === "printful" && !product.printfulProductId && !product.printfulSyncProductId) {
      context.addIssue({
        code: "custom",
        path: ["printfulProductId"],
        message: "Printful products need a Printful product ID or sync product ID.",
      });
    }

    const nonShippingTypes = new Set([
      "digital",
      "digital_download",
      "digital_unlock",
      "service",
      "subscription",
      "membership",
      "nft",
      "event_access",
      "appointment",
      "ad_placement",
      "sponsorship",
      "campaign_boost",
      "creator_promotion",
      "fan_club_promotion",
      "newsletter_ad",
      "homepage_feature",
      "banner_ad",
      "video_ad",
      "event_sponsorship",
      "classified_ad",
      "featured_listing",
      "social_promotion_package",
    ]);
    if (nonShippingTypes.has(product.productType) && product.requiresShipping) {
      context.addIssue({
        code: "custom",
        path: ["requiresShipping"],
        message: "This product type should not require shipping by default.",
      });
    }

    if ((product.productType === "subscription" || product.paymentMode === "recurring") && product.paymentMode === "one_time") {
      context.addIssue({
        code: "custom",
        path: ["paymentMode"],
        message: "Subscription products need recurring or one-time-or-recurring payment mode.",
      });
    }

    if ((product.productType === "digital_download" || product.requiresDownload) && product.requiresShipping) {
      context.addIssue({
        code: "custom",
        path: ["requiresShipping"],
        message: "Digital downloads should use secure download delivery instead of shipping.",
      });
    }

    const skus = [product.sku, ...product.variants.map((variant) => variant.sku)].filter(Boolean);
    const duplicateSkus = skus.filter((sku, index) => skus.indexOf(sku) !== index);
    if (duplicateSkus.length) {
      context.addIssue({
        code: "custom",
        path: ["variants"],
        message: `Duplicate SKU found: ${duplicateSkus[0]}`,
      });
    }

    product.discountSchedules.forEach((discount, index) => {
      const startsAt = new Date(discount.startsAt);
      const endsAt = new Date(discount.endsAt);

      if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || startsAt >= endsAt) {
        context.addIssue({
          code: "custom",
          path: ["discountSchedules", index, "startsAt"],
          message: "Scheduled discount start must be before the end.",
        });
      }

      if (discount.type === "percentage" && (!discount.percentageBps || discount.percentageBps > 10_000)) {
        context.addIssue({
          code: "custom",
          path: ["discountSchedules", index, "percentageBps"],
          message: "Percentage discounts must be between 0% and 100%.",
        });
      }

      if (discount.type === "fixed" && (discount.fixedCents ?? 0) > product.priceCents) {
        context.addIssue({
          code: "custom",
          path: ["discountSchedules", index, "fixedCents"],
          message: "Fixed discount cannot exceed the product price.",
        });
      }

      if (discount.type === "sale_price" && (discount.salePriceCents ?? product.priceCents) > product.priceCents) {
        context.addIssue({
          code: "custom",
          path: ["discountSchedules", index, "salePriceCents"],
          message: "Sale price cannot be higher than the product price.",
        });
      }
    });

    try {
      JSON.parse(product.metadataJson || "{}");
    } catch {
      context.addIssue({
        code: "custom",
        path: ["metadataJson"],
        message: "Metadata must be valid JSON.",
      });
    }
  });

export type ProductEditorInput = z.infer<typeof productEditorSchema>;

export function slugifyProductTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseDecimalText(value?: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
