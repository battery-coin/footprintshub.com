import { z } from "zod";

export const productTypes = [
  "physical",
  "digital",
  "bundle",
  "membership",
  "preorder",
  "blind_box",
  "booster_pack",
  "digital_unlock",
  "service",
  "donation_like_supporter_bundle",
] as const;

export const productFranchises = ["footprints", "matrix_decoded", "hero_studio", "battery_movement", "other"] as const;
export const productStatuses = ["draft", "active", "archived", "hidden", "sold_out"] as const;
export const productVisibilities = ["visible", "hidden", "catalog_only", "direct_link"] as const;
export const fulfillmentTypes = ["manual", "printful", "digital", "internal", "mixed"] as const;

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

    if (product.productType === "digital" && product.requiresShipping) {
      context.addIssue({
        code: "custom",
        path: ["requiresShipping"],
        message: "Digital products should not require shipping.",
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
