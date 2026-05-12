import type { Product } from "@prisma/client";
import { hasDatabaseUrl, getPrisma } from "@/lib/db/prisma";
import { seedProducts } from "./seed-products";
import type { CartLineInput, CatalogProduct, PricedCartLine } from "./types";

function mapProduct(product: Product): CatalogProduct {
  return {
    id: product.id,
    shopId: product.shopId,
    title: product.title,
    slug: product.slug,
    subtitle: product.subtitle ?? undefined,
    description: product.description,
    shortDescription: product.shortDescription ?? undefined,
    productType: product.productType,
    paymentMode: product.paymentMode,
    deliveryMode: product.deliveryMode,
    fulfillmentType: product.fulfillmentType,
    franchise: product.franchise,
    status: product.status,
    visibility: product.visibility,
    priceCents: product.priceCents,
    compareAtPriceCents: product.compareAtPriceCents ?? undefined,
    currency: product.currency,
    sku: product.sku ?? undefined,
    inventoryQuantity: product.inventoryQuantity,
    trackInventory: product.trackInventory,
    allowBackorder: product.allowBackorder,
    lowStockThreshold: product.lowStockThreshold ?? undefined,
    imageUrl: product.imageUrl ?? undefined,
    galleryUrls: product.galleryUrls,
    seoTitle: product.seoTitle ?? undefined,
    seoDescription: product.seoDescription ?? undefined,
    isFeatured: product.isFeatured,
    isLimitedEdition: product.isLimitedEdition,
    preorderStatus: product.preorderStatus ?? undefined,
    preorderReleaseAt: product.preorderReleaseAt ?? undefined,
    requiresShipping: product.requiresShipping,
    requiresScheduling: product.requiresScheduling,
    requiresDownload: product.requiresDownload,
    requiresWallet: product.requiresWallet,
    subscriptionEligible: product.subscriptionEligible,
    nftEligible: product.nftEligible,
    accessDurationDays: product.accessDurationDays ?? undefined,
    termsRequired: product.termsRequired,
    digitalUnlockIncluded: product.digitalUnlockIncluded,
    tokenGated: product.tokenGated,
    isRandomized: product.isRandomized,
    oddsDisclosureUrl: product.oddsDisclosureUrl ?? undefined,
    printfulEnabled: product.printfulEnabled,
    printfulProductId: product.printfulProductId ?? undefined,
    printfulSyncProductId: product.printfulSyncProductId ?? undefined,
    metadata:
      product.metadata && typeof product.metadata === "object" && !Array.isArray(product.metadata)
        ? (product.metadata as Record<string, unknown>)
        : undefined,
  };
}

export async function getProducts() {
  if (!hasDatabaseUrl()) {
    return seedProducts.filter((product) => product.status === "active");
  }

  try {
    const products = await getPrisma().product.findMany({
      where: { status: "active" },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });

    return products.map(mapProduct);
  } catch {
    return seedProducts.filter((product) => product.status === "active");
  }
}

export async function getAllProductsForAdmin() {
  if (!hasDatabaseUrl()) {
    return seedProducts;
  }

  try {
    const products = await getPrisma().product.findMany({
      orderBy: [{ createdAt: "desc" }],
    });

    return products.map(mapProduct);
  } catch {
    return seedProducts;
  }
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export async function priceCartLines(lines: CartLineInput[]): Promise<PricedCartLine[]> {
  const products = await getProducts();
  const productsById = new Map(products.map((product) => [product.id, product]));

  return lines
    .map((line) => {
      const product = productsById.get(line.productId);
      const quantity = Math.max(0, Math.min(99, Math.floor(line.quantity)));

      if (!product || quantity < 1 || product.status !== "active") {
        return null;
      }

      return {
        product,
        quantity,
        unitPriceCents: product.priceCents,
        totalCents: product.priceCents * quantity,
      };
    })
    .filter((line): line is PricedCartLine => Boolean(line));
}

export function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}
