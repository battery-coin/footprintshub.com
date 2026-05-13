import { getPrisma } from "@/lib/db/prisma";
import { FLAGSHIP_SHOP_ID } from "@/lib/catalog/seed-products";

export async function getOrCreateDefaultShop() {
  const prisma = getPrisma();
  const activeShop = await prisma.shop.findFirst({ where: { status: "active" }, orderBy: { createdAt: "asc" } });

  if (activeShop) {
    return activeShop;
  }

  return prisma.shop.upsert({
    where: { slug: "footprintshub" },
    update: {
      name: "FootprintsHub",
      status: "active",
      customDomain: "footprintshub.com",
    },
    create: {
      id: FLAGSHIP_SHOP_ID,
      name: "FootprintsHub",
      slug: "footprintshub",
      customDomain: "footprintshub.com",
      description: "Flagship FootprintsHub commerce shop.",
      status: "active",
    },
  });
}
