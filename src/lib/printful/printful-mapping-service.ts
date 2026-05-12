import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export type PrintfulMappingStatus = "unmapped" | "partially_mapped" | "mapped" | "invalid";

export async function getPrintfulProductMappingRows() {
  if (!hasDatabaseUrl()) {
    return [];
  }

  const products = await getPrisma().product.findMany({
    where: {
      OR: [{ fulfillmentType: "printful" }, { printfulEnabled: true }, { productType: "print_on_demand" }],
    },
    include: { variants: { orderBy: { sortOrder: "asc" } } },
    orderBy: { updatedAt: "desc" },
  }).catch(() => []);

  return products.map((product) => {
    const variantCount = product.variants.length;
    const mappedVariantCount = product.variants.filter((variant) => variant.printfulVariantId || variant.printfulSyncVariantId).length;
    const hasProductMapping = Boolean(product.printfulProductId || product.printfulSyncProductId || product.printfulTemplateId);
    const status = getMappingStatus({ hasProductMapping, variantCount, mappedVariantCount });

    return {
      id: product.id,
      title: product.title,
      sku: product.sku,
      slug: product.slug,
      printfulProductId: product.printfulProductId,
      printfulSyncProductId: product.printfulSyncProductId,
      printfulTemplateId: product.printfulTemplateId,
      variantCount,
      mappedVariantCount,
      status,
    };
  });
}

export async function getPrintfulOrderRows() {
  if (!hasDatabaseUrl()) {
    return [];
  }

  return getPrisma().printfulOrder.findMany({
    include: { order: { select: { orderNumber: true, customerEmail: true, totalCents: true, currency: true } } },
    orderBy: { updatedAt: "desc" },
    take: 50,
  }).catch(() => []);
}

function getMappingStatus(input: { hasProductMapping: boolean; variantCount: number; mappedVariantCount: number }): PrintfulMappingStatus {
  if (!input.hasProductMapping && input.mappedVariantCount === 0) return "unmapped";
  if (input.variantCount > 0 && input.mappedVariantCount === input.variantCount) return "mapped";
  if (input.hasProductMapping && input.variantCount === 0) return "mapped";
  if (input.mappedVariantCount > input.variantCount) return "invalid";
  return "partially_mapped";
}
