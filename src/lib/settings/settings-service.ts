import type { Prisma } from "@prisma/client";
import { FLAGSHIP_SHOP_ID } from "@/lib/catalog/seed-products";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

const memoryShopSettings = new Map<string, { value: Prisma.JsonValue; category: string }>();
const memoryPlatformSettings = new Map<string, { value: Prisma.JsonValue; category: string }>();

export async function getDefaultShopId() {
  if (!hasDatabaseUrl()) {
    return FLAGSHIP_SHOP_ID;
  }

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

export async function getShopSetting<T = Prisma.JsonValue>(shopId: string, key: string, fallback?: T) {
  if (!hasDatabaseUrl()) {
    return (memoryShopSettings.get(`${shopId}:${key}`)?.value as T | undefined) ?? fallback;
  }

  const setting = await getPrisma().shopSetting.findUnique({
    where: { shopId_key: { shopId, key } },
  });

  return (setting?.value as T | undefined) ?? fallback;
}

export async function setShopSetting({
  shopId,
  key,
  value,
  category = "general",
  updatedByUserId,
}: {
  shopId: string;
  key: string;
  value: Prisma.InputJsonValue;
  category?: string;
  updatedByUserId?: string | null;
}) {
  if (!hasDatabaseUrl()) {
    memoryShopSettings.set(`${shopId}:${key}`, { value: value as Prisma.JsonValue, category });
    return { stored: false as const, key, value };
  }

  const setting = await getPrisma().shopSetting.upsert({
    where: { shopId_key: { shopId, key } },
    update: { value, category, updatedByUserId: updatedByUserId ?? null },
    create: { shopId, key, value, category, updatedByUserId: updatedByUserId ?? null },
  });

  return { stored: true as const, setting };
}

export async function getPlatformSetting<T = Prisma.JsonValue>(key: string, fallback?: T) {
  if (!hasDatabaseUrl()) {
    return (memoryPlatformSettings.get(key)?.value as T | undefined) ?? fallback;
  }

  const setting = await getPrisma().platformSetting.findUnique({ where: { key } });
  return (setting?.value as T | undefined) ?? fallback;
}

export async function setPlatformSetting({
  key,
  value,
  category = "general",
  updatedByUserId,
}: {
  key: string;
  value: Prisma.InputJsonValue;
  category?: string;
  updatedByUserId?: string | null;
}) {
  if (!hasDatabaseUrl()) {
    memoryPlatformSettings.set(key, { value: value as Prisma.JsonValue, category });
    return { stored: false as const, key, value };
  }

  const setting = await getPrisma().platformSetting.upsert({
    where: { key },
    update: { value, category, updatedByUserId: updatedByUserId ?? null },
    create: { key, value, category, updatedByUserId: updatedByUserId ?? null },
  });

  return { stored: true as const, setting };
}

export async function getSettingsByCategory(shopId: string, category: string) {
  if (!hasDatabaseUrl()) {
    return Array.from(memoryShopSettings.entries())
      .filter(([compoundKey, setting]) => compoundKey.startsWith(`${shopId}:`) && setting.category === category)
      .map(([compoundKey, setting]) => ({ key: compoundKey.replace(`${shopId}:`, ""), value: setting.value, category: setting.category }));
  }

  return getPrisma().shopSetting.findMany({
    where: { shopId, category },
    orderBy: { key: "asc" },
  });
}
