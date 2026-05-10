import type { Prisma } from "@prisma/client";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export async function writeAdminAuditLog({
  shopId,
  actorUserId,
  action,
  entityType,
  entityId,
  before,
  after,
  ipHash,
  metadata,
}: {
  shopId?: string;
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  before?: Prisma.InputJsonValue;
  after?: Prisma.InputJsonValue;
  ipHash?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  if (!hasDatabaseUrl()) {
    return { written: false };
  }

  await getPrisma().adminAuditLog.create({
    data: {
      shopId,
      actorUserId,
      action,
      entityType,
      entityId,
      before,
      after,
      ipHash,
      metadata,
    },
  });

  return { written: true };
}
