import type { Prisma } from "@prisma/client";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { seedProducts, FLAGSHIP_SHOP_ID } from "@/lib/catalog/seed-products";
import { slugifyProductTitle, type ProductEditorInput } from "./product-validation";

type ProductWithEditorRelations = Prisma.ProductGetPayload<{
  include: {
    media: true;
    variants: true;
    options: { include: { values: true } };
    discountSchedules: true;
    brand: true;
    productCategories: { include: { category: true } };
    productCollections: { include: { collection: true } };
  };
}>;

export type ProductEditorData = ReturnType<typeof mapProductForEditor>;

export async function getProductForEditor(id: string) {
  if (!hasDatabaseUrl()) {
    const product = seedProducts.find((item) => item.id === id);
    return product ? mapSeedProductForEditor(product) : null;
  }

  const product = await getPrisma().product.findUnique({
    where: { id },
    include: editorIncludes,
  });

  return product ? mapProductForEditor(product) : null;
}

export async function saveProduct(input: ProductEditorInput, productId?: string) {
  if (!hasDatabaseUrl()) {
    return {
      ok: true as const,
      stored: false,
      productId: productId ?? `draft_${input.slug}`,
      message: "DATABASE_URL is not configured, so the product payload was validated but not persisted.",
    };
  }

  const prisma = getPrisma();
  const shopId = await getDefaultShopId();
  const metadata = JSON.parse(input.metadataJson || "{}") as Prisma.InputJsonObject;
  const primaryMedia = input.media.find((item) => item.isPrimary) ?? input.media[0];
  const imageUrl = input.imageUrl || primaryMedia?.url || null;
  const galleryUrls = input.media.map((item) => item.url);
  const brandId = input.vendor ? await upsertBrand(input.vendor, shopId) : undefined;

  const saved = await prisma.$transaction(async (tx) => {
    const data = {
      shopId,
      brandId,
      taxClassId: input.taxClassId || null,
      title: input.title,
      slug: input.slug,
      subtitle: input.subtitle || null,
      description: input.description,
      shortDescription: input.shortDescription || null,
      productType: input.productType,
      paymentMode: input.paymentMode,
      franchise: input.franchise,
      status: input.status,
      visibility: input.visibility,
      priceCents: input.priceCents,
      compareAtPriceCents: input.compareAtPriceCents ?? null,
      costCents: input.costCents ?? null,
      barcode: input.barcode || null,
      currency: input.currency,
      sku: input.sku || null,
      vendor: input.vendor || null,
      tags: input.tags,
      inventoryQuantity: input.inventoryQuantity,
      trackInventory: input.trackInventory,
      allowBackorder: input.allowBackorder,
      lowStockThreshold: input.lowStockThreshold ?? null,
      imageUrl,
      galleryUrls,
      seoTitle: input.seoTitle || null,
      seoDescription: input.seoDescription || null,
      canonicalUrl: input.canonicalUrl || null,
      isFeatured: input.isFeatured,
      isLimitedEdition: input.isLimitedEdition,
      preorderStatus: input.preorderStatus || null,
      preorderReleaseAt: toDate(input.preorderReleaseAt),
      requiresShipping: input.requiresShipping,
      deliveryMode: input.deliveryMode,
      requiresScheduling: input.requiresScheduling,
      requiresDownload: input.requiresDownload,
      requiresWallet: input.requiresWallet,
      subscriptionEligible: input.subscriptionEligible,
      nftEligible: input.nftEligible,
      accessDurationDays: input.accessDurationDays ?? null,
      termsRequired: input.termsRequired,
      weightValue: input.weightValue || null,
      weightUnit: input.weightUnit || null,
      lengthValue: input.lengthValue || null,
      widthValue: input.widthValue || null,
      heightValue: input.heightValue || null,
      dimensionUnit: input.dimensionUnit || null,
      taxable: input.taxable,
      fulfillmentType: input.fulfillmentType,
      printfulProductId: input.printfulProductId || null,
      printfulSyncProductId: input.printfulSyncProductId || null,
      digitalUnlockIncluded: input.digitalUnlockIncluded,
      tokenGated: input.tokenGated,
      blindBoxEligible: input.blindBoxEligible,
      boosterPackEligible: input.boosterPackEligible,
      affiliateEligible: input.affiliateEligible,
      isRandomized: input.blindBoxEligible || input.boosterPackEligible,
      oddsDisclosureUrl: input.oddsDisclosureUrl || null,
      publishedAt: input.status === "active" ? new Date() : null,
      scheduledPublishAt: toDate(input.scheduledPublishAt),
      metadata,
    } satisfies Prisma.ProductUncheckedCreateInput;

    const product = productId
      ? await tx.product.update({ where: { id: productId }, data })
      : await tx.product.create({ data });

    await tx.productMedia.deleteMany({ where: { productId: product.id } });
    await tx.productVariant.deleteMany({ where: { productId: product.id } });
    await tx.productOption.deleteMany({ where: { productId: product.id } });
    await tx.discountSchedule.deleteMany({ where: { productId: product.id } });
    await tx.productCategory.deleteMany({ where: { productId: product.id } });
    await tx.productCollection.deleteMany({ where: { productId: product.id } });

    if (input.media.length) {
      await tx.productMedia.createMany({
        data: input.media.map((media, index) => ({
          productId: product.id,
          url: media.url,
          altText: media.altText || product.title,
          mediaType: media.mediaType,
          isPrimary: media.isPrimary || index === 0,
          sortOrder: media.sortOrder ?? index,
        })),
      });
    }

    for (const option of input.options) {
      await tx.productOption.create({
        data: {
          shopId,
          productId: product.id,
          name: option.name,
          type: "select",
          values: {
            create: option.values.map((value, index) => ({
              label: value,
              sortOrder: index,
            })),
          },
        },
      });
    }

    if (input.variants.length) {
      await tx.productVariant.createMany({
        data: input.variants.map((variant, index) => ({
          productId: product.id,
          title: variant.title,
          sku: variant.sku || null,
          barcode: variant.barcode || null,
          optionValues: variant.optionValues,
          priceCents: variant.priceCents ?? null,
          compareAtPriceCents: variant.compareAtPriceCents ?? null,
          costCents: variant.costCents ?? null,
          paymentMode: variant.paymentMode ?? null,
          stripePriceIdOneTime: variant.stripePriceIdOneTime || null,
          stripePriceIdRecurring: variant.stripePriceIdRecurring || null,
          recurringInterval: variant.recurringInterval ?? null,
          recurringIntervalCount: variant.recurringIntervalCount ?? null,
          trialPeriodDays: variant.trialPeriodDays ?? null,
          digitalAssetId: variant.digitalAssetId || null,
          serviceTemplateId: variant.serviceTemplateId || null,
          nftTemplateId: variant.nftTemplateId || null,
          inventoryQuantity: variant.inventoryQuantity,
          trackInventory: variant.trackInventory,
          allowBackorder: variant.allowBackorder,
          weightValue: variant.weightValue || null,
          weightUnit: variant.weightUnit || null,
          taxable: variant.taxable ?? null,
          imageUrl: variant.imageUrl || null,
          printfulVariantId: variant.printfulVariantId || null,
          printfulSyncVariantId: variant.printfulSyncVariantId || null,
          active: variant.active,
          sortOrder: variant.sortOrder ?? index,
          attributes: variant.optionValues,
        })),
      });
    }

    if (input.discountSchedules.length) {
      await tx.discountSchedule.createMany({
        data: input.discountSchedules.map((discount) => ({
          shopId,
          productId: product.id,
          name: discount.name,
          type: discount.type,
          percentageBps: discount.percentageBps ?? null,
          fixedCents: discount.fixedCents ?? null,
          salePriceCents: discount.salePriceCents ?? null,
          startsAt: new Date(discount.startsAt),
          endsAt: new Date(discount.endsAt),
          active: discount.active,
        })),
      });
    }

    if (input.categoryName) {
      const category = await tx.category.upsert({
        where: { shopId_slug: { shopId, slug: slugifyProductTitle(input.categoryName) } },
        update: { name: input.categoryName },
        create: { shopId, name: input.categoryName, slug: slugifyProductTitle(input.categoryName) },
      });
      await tx.productCategory.create({ data: { productId: product.id, categoryId: category.id } });
    }

    if (input.collectionName) {
      const collection = await tx.collection.upsert({
        where: { shopId_slug: { shopId, slug: slugifyProductTitle(input.collectionName) } },
        update: { name: input.collectionName },
        create: { shopId, name: input.collectionName, slug: slugifyProductTitle(input.collectionName) },
      });
      await tx.productCollection.create({ data: { productId: product.id, collectionId: collection.id } });
    }

    await tx.adminAuditLog.create({
      data: {
        shopId,
        action: productId ? "product_updated" : "product_created",
        entityType: "Product",
        entityId: product.id,
        after: { title: input.title, status: input.status, variantCount: input.variants.length },
      },
    });

    return product;
  });

  return { ok: true as const, stored: true, productId: saved.id };
}

export async function getProductImportJobs() {
  if (!hasDatabaseUrl()) {
    return [];
  }

  return getPrisma().importJob.findMany({
    orderBy: { createdAt: "desc" },
    take: 25,
  });
}

export async function createImportJob({
  type,
  sourceName,
  sourceUrl,
  totalRows,
  successRows,
  failedRows,
  mapping,
}: {
  type: "csv" | "api" | "manual";
  sourceName?: string;
  sourceUrl?: string;
  totalRows: number;
  successRows?: number;
  failedRows?: number;
  mapping?: Prisma.InputJsonValue;
}) {
  if (!hasDatabaseUrl()) {
    return { stored: false, id: `preview_${Date.now()}` };
  }

  const shopId = await getDefaultShopId();
  const job = await getPrisma().importJob.create({
    data: {
      shopId,
      type,
      status: failedRows ? "partially_completed" : "completed",
      sourceName,
      sourceUrl,
      totalRows,
      processedRows: totalRows,
      successRows: successRows ?? totalRows,
      failedRows: failedRows ?? 0,
      mapping,
    },
  });

  return { stored: true, id: job.id };
}

const editorIncludes = {
  media: { orderBy: [{ sortOrder: "asc" as const }] },
  variants: { orderBy: [{ sortOrder: "asc" as const }] },
  options: { include: { values: { orderBy: [{ sortOrder: "asc" as const }] } }, orderBy: [{ sortOrder: "asc" as const }] },
  discountSchedules: { orderBy: [{ startsAt: "asc" as const }] },
  brand: true,
  productCategories: { include: { category: true } },
  productCollections: { include: { collection: true } },
};

function mapProductForEditor(product: ProductWithEditorRelations) {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    subtitle: product.subtitle ?? "",
    description: product.description,
    shortDescription: product.shortDescription ?? "",
    productType: product.productType,
    paymentMode: product.paymentMode,
    franchise: product.franchise,
    status: product.status,
    visibility: product.visibility,
    priceCents: product.priceCents,
    compareAtPriceCents: product.compareAtPriceCents ?? undefined,
    costCents: product.costCents ?? undefined,
    currency: product.currency,
    sku: product.sku ?? "",
    barcode: product.barcode ?? "",
    inventoryQuantity: product.inventoryQuantity,
    trackInventory: product.trackInventory,
    allowBackorder: product.allowBackorder,
    lowStockThreshold: product.lowStockThreshold ?? undefined,
    requiresShipping: product.requiresShipping,
    deliveryMode: product.deliveryMode,
    requiresScheduling: product.requiresScheduling,
    requiresDownload: product.requiresDownload,
    requiresWallet: product.requiresWallet,
    subscriptionEligible: product.subscriptionEligible,
    nftEligible: product.nftEligible,
    accessDurationDays: product.accessDurationDays ?? undefined,
    termsRequired: product.termsRequired,
    weightValue: decimalToString(product.weightValue),
    weightUnit: product.weightUnit ?? "oz",
    lengthValue: decimalToString(product.lengthValue),
    widthValue: decimalToString(product.widthValue),
    heightValue: decimalToString(product.heightValue),
    dimensionUnit: product.dimensionUnit ?? "in",
    taxable: product.taxable,
    taxClassId: product.taxClassId ?? "",
    fulfillmentType: product.fulfillmentType,
    printfulProductId: product.printfulProductId ?? "",
    printfulSyncProductId: product.printfulSyncProductId ?? "",
    digitalUnlockIncluded: product.digitalUnlockIncluded,
    tokenGated: product.tokenGated,
    blindBoxEligible: product.blindBoxEligible,
    boosterPackEligible: product.boosterPackEligible,
    affiliateEligible: product.affiliateEligible,
    oddsDisclosureUrl: product.oddsDisclosureUrl ?? "",
    imageUrl: product.imageUrl ?? "",
    media: product.media.map((media) => ({
      url: media.url,
      altText: media.altText ?? "",
      mediaType: media.mediaType,
      variantSku: "",
      isPrimary: media.isPrimary,
      sortOrder: media.sortOrder,
    })),
    options: product.options.map((option) => ({
      name: option.name,
      values: option.values.map((value) => value.label),
    })),
    variants: product.variants.map((variant) => ({
      id: variant.id,
      title: variant.title,
      sku: variant.sku ?? "",
      barcode: variant.barcode ?? "",
      optionValues:
        variant.optionValues && typeof variant.optionValues === "object" && !Array.isArray(variant.optionValues)
          ? (variant.optionValues as Record<string, string>)
          : {},
      priceCents: variant.priceCents ?? undefined,
      compareAtPriceCents: variant.compareAtPriceCents ?? undefined,
      costCents: variant.costCents ?? undefined,
      paymentMode: variant.paymentMode ?? undefined,
      stripePriceIdOneTime: variant.stripePriceIdOneTime ?? "",
      stripePriceIdRecurring: variant.stripePriceIdRecurring ?? "",
      recurringInterval: variant.recurringInterval ?? undefined,
      recurringIntervalCount: variant.recurringIntervalCount ?? undefined,
      trialPeriodDays: variant.trialPeriodDays ?? undefined,
      digitalAssetId: variant.digitalAssetId ?? "",
      serviceTemplateId: variant.serviceTemplateId ?? "",
      nftTemplateId: variant.nftTemplateId ?? "",
      inventoryQuantity: variant.inventoryQuantity,
      trackInventory: variant.trackInventory,
      allowBackorder: variant.allowBackorder,
      weightValue: decimalToString(variant.weightValue),
      weightUnit: variant.weightUnit ?? "oz",
      taxable: variant.taxable ?? product.taxable,
      imageUrl: variant.imageUrl ?? "",
      printfulVariantId: variant.printfulVariantId ?? "",
      printfulSyncVariantId: variant.printfulSyncVariantId ?? "",
      active: variant.active,
      sortOrder: variant.sortOrder,
    })),
    discountSchedules: product.discountSchedules.map((discount) => ({
      id: discount.id,
      name: discount.name,
      type: discount.type,
      percentageBps: discount.percentageBps ?? undefined,
      fixedCents: discount.fixedCents ?? undefined,
      salePriceCents: discount.salePriceCents ?? undefined,
      startsAt: discount.startsAt.toISOString().slice(0, 16),
      endsAt: discount.endsAt.toISOString().slice(0, 16),
      active: discount.active,
    })),
    categoryName: product.productCategories[0]?.category.name ?? "",
    collectionName: product.productCollections[0]?.collection.name ?? "",
    vendor: product.vendor ?? product.brand?.name ?? "",
    tags: product.tags,
    isFeatured: product.isFeatured,
    isLimitedEdition: product.isLimitedEdition,
    preorderStatus: product.preorderStatus ?? "",
    preorderReleaseAt: product.preorderReleaseAt?.toISOString().slice(0, 16) ?? "",
    scheduledPublishAt: product.scheduledPublishAt?.toISOString().slice(0, 16) ?? "",
    seoTitle: product.seoTitle ?? "",
    seoDescription: product.seoDescription ?? "",
    canonicalUrl: product.canonicalUrl ?? "",
    metadataJson: JSON.stringify(product.metadata ?? {}, null, 2),
  };
}

function mapSeedProductForEditor(product: (typeof seedProducts)[number]) {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    subtitle: product.subtitle ?? "",
    description: product.description,
    shortDescription: product.shortDescription ?? "",
    productType: product.productType,
    paymentMode: "one_time" as const,
    franchise: product.franchise,
    status: product.status,
    visibility: product.visibility ?? "visible",
    priceCents: product.priceCents,
    compareAtPriceCents: product.compareAtPriceCents,
    costCents: undefined,
    currency: product.currency,
    sku: product.sku ?? "",
    barcode: "",
    inventoryQuantity: product.inventoryQuantity,
    trackInventory: product.trackInventory,
    allowBackorder: product.allowBackorder ?? false,
    lowStockThreshold: product.lowStockThreshold,
    requiresShipping: product.requiresShipping ?? true,
    deliveryMode: product.requiresShipping ? ("shipped" as const) : ("download" as const),
    requiresScheduling: false,
    requiresDownload: product.productType === "digital",
    requiresWallet: false,
    subscriptionEligible: false,
    nftEligible: false,
    accessDurationDays: undefined,
    termsRequired: false,
    weightValue: "",
    weightUnit: "oz",
    lengthValue: "",
    widthValue: "",
    heightValue: "",
    dimensionUnit: "in",
    taxable: true,
    taxClassId: "",
    fulfillmentType: product.productType === "digital" ? ("digital" as const) : ("manual" as const),
    printfulProductId: "",
    printfulSyncProductId: "",
    digitalUnlockIncluded: product.digitalUnlockIncluded,
    tokenGated: product.tokenGated,
    blindBoxEligible: product.productType === "blind_box",
    boosterPackEligible: product.productType === "booster_pack",
    affiliateEligible: true,
    oddsDisclosureUrl: product.oddsDisclosureUrl ?? "",
    imageUrl: product.imageUrl ?? "",
    media: product.imageUrl
      ? [{ url: product.imageUrl, altText: product.title, mediaType: "image" as const, variantSku: "", isPrimary: true, sortOrder: 0 }]
      : [],
    options: [],
    variants: [],
    discountSchedules: [],
    categoryName: "",
    collectionName: typeof product.metadata?.collection === "string" ? product.metadata.collection : "",
    vendor: "",
    tags: [],
    isFeatured: product.isFeatured,
    isLimitedEdition: product.isLimitedEdition,
    preorderStatus: product.preorderStatus ?? "",
    preorderReleaseAt: product.preorderReleaseAt?.toISOString().slice(0, 16) ?? "",
    scheduledPublishAt: "",
    seoTitle: product.seoTitle ?? "",
    seoDescription: product.seoDescription ?? "",
    canonicalUrl: "",
    metadataJson: JSON.stringify(product.metadata ?? {}, null, 2),
  };
}

async function getDefaultShopId() {
  const prisma = getPrisma();
  const existing = await prisma.shop.findFirst({ where: { status: "active" }, orderBy: { createdAt: "asc" } });

  if (existing) {
    return existing.id;
  }

  const created = await prisma.shop.create({
    data: {
      id: FLAGSHIP_SHOP_ID,
      name: "FootprintsHub",
      slug: "footprintshub",
      status: "active",
    },
  });

  return created.id;
}

async function upsertBrand(name: string, shopId: string) {
  const slug = slugifyProductTitle(name);
  const brand = await getPrisma().brand.upsert({
    where: { shopId_slug: { shopId, slug } },
    update: { name },
    create: { shopId, name, slug },
  });

  return brand.id;
}

function toDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function decimalToString(value: Prisma.Decimal | null) {
  return value == null ? "" : value.toString();
}
