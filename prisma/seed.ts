import { Prisma, PrismaClient } from "@prisma/client";
import { seedProducts } from "../src/lib/catalog/seed-products";

const prisma = new PrismaClient();

async function main() {
  const shop = await prisma.shop.upsert({
    where: { slug: "footprintshub" },
    update: {
      name: "FootprintsHub",
      status: "active",
      description:
        "Flagship commerce shop for Footprints, Matrix Decoded, Hero Studio drops, collectibles, merch, and digital unlocks.",
    },
    create: {
      name: "FootprintsHub",
      slug: "footprintshub",
      subdomain: "shop",
      customDomain: "footprintshub.com",
      status: "active",
      description:
        "Flagship commerce shop for Footprints, Matrix Decoded, Hero Studio drops, collectibles, merch, and digital unlocks.",
      domains: {
        create: [
          { hostname: "footprintshub.com", type: "root_domain", status: "active" },
          { hostname: "www.footprintshub.com", type: "root_domain", status: "active" },
        ],
      },
    },
  });

  for (const product of seedProducts) {
    const metadata = product.metadata as Prisma.InputJsonValue | undefined;

    await prisma.product.upsert({
      where: {
        shopId_slug: {
          shopId: shop.id,
          slug: product.slug,
        },
      },
      update: {
        title: product.title,
        subtitle: product.subtitle,
        description: product.description,
        shortDescription: product.shortDescription,
        productType: product.productType,
        franchise: product.franchise,
        status: product.status,
        priceCents: product.priceCents,
        compareAtPriceCents: product.compareAtPriceCents,
        currency: product.currency,
        sku: product.sku,
        inventoryQuantity: product.inventoryQuantity,
        trackInventory: product.trackInventory,
        imageUrl: product.imageUrl,
        galleryUrls: product.galleryUrls,
        isFeatured: product.isFeatured,
        isLimitedEdition: product.isLimitedEdition,
        preorderStatus: product.preorderStatus,
        digitalUnlockIncluded: product.digitalUnlockIncluded,
        tokenGated: product.tokenGated,
        metadata,
      },
      create: {
        shopId: shop.id,
        title: product.title,
        slug: product.slug,
        subtitle: product.subtitle,
        description: product.description,
        shortDescription: product.shortDescription,
        productType: product.productType,
        franchise: product.franchise,
        status: product.status,
        priceCents: product.priceCents,
        compareAtPriceCents: product.compareAtPriceCents,
        currency: product.currency,
        sku: product.sku,
        inventoryQuantity: product.inventoryQuantity,
        trackInventory: product.trackInventory,
        imageUrl: product.imageUrl,
        galleryUrls: product.galleryUrls,
        isFeatured: product.isFeatured,
        isLimitedEdition: product.isLimitedEdition,
        preorderStatus: product.preorderStatus,
        digitalUnlockIncluded: product.digitalUnlockIncluded,
        tokenGated: product.tokenGated,
        metadata,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
