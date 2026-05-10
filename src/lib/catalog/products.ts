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
    franchise: product.franchise,
    status: product.status,
    priceCents: product.priceCents,
    compareAtPriceCents: product.compareAtPriceCents ?? undefined,
    currency: product.currency,
    sku: product.sku ?? undefined,
    inventoryQuantity: product.inventoryQuantity,
    trackInventory: product.trackInventory,
    imageUrl: product.imageUrl ?? undefined,
    galleryUrls: product.galleryUrls,
    isFeatured: product.isFeatured,
    isLimitedEdition: product.isLimitedEdition,
    preorderStatus: product.preorderStatus ?? undefined,
    digitalUnlockIncluded: product.digitalUnlockIncluded,
    tokenGated: product.tokenGated,
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
