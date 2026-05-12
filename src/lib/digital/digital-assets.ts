import type { Prisma } from "@prisma/client";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export async function createDigitalAsset(input: {
  shopId: string;
  productId?: string;
  title: string;
  fileUrl: string;
  fileName: string;
  description?: string;
  maxDownloads?: number;
  expiresAfterDays?: number;
  metadata?: Prisma.InputJsonValue;
}) {
  if (!hasDatabaseUrl()) {
    return { stored: false as const, id: `preview_${Date.now()}` };
  }

  const asset = await getPrisma().downloadAsset.create({
    data: {
      shopId: input.shopId,
      productId: input.productId,
      title: input.title,
      description: input.description,
      fileUrl: input.fileUrl,
      fileName: input.fileName,
      maxDownloads: input.maxDownloads,
      expiresAfterDays: input.expiresAfterDays,
      status: "active",
    },
  });

  return { stored: true as const, id: asset.id };
}
