import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export async function getSecureDownloadByToken(token: string) {
  if (!hasDatabaseUrl()) {
    return { ok: false as const, status: 503, reason: "Digital download storage is not connected." };
  }

  const entitlement = await getPrisma().downloadEntitlement.findUnique({
    where: { token },
    include: { downloadAsset: true },
  });

  if (!entitlement) {
    return { ok: false as const, status: 404, reason: "Download link was not found." };
  }

  if (entitlement.status === "revoked" || entitlement.revokedAt) {
    await logDownloadAccess(entitlement.shopId, entitlement.id, "revoked");
    return { ok: false as const, status: 403, reason: "Download access has been revoked." };
  }

  if (entitlement.expiresAt && entitlement.expiresAt.getTime() < Date.now()) {
    await logDownloadAccess(entitlement.shopId, entitlement.id, "expired");
    return { ok: false as const, status: 410, reason: "Download link has expired." };
  }

  if (entitlement.remainingDownloads != null && entitlement.remainingDownloads <= 0) {
    await logDownloadAccess(entitlement.shopId, entitlement.id, "exhausted");
    return { ok: false as const, status: 403, reason: "Download limit has been reached." };
  }

  await getPrisma().downloadEntitlement.update({
    where: { id: entitlement.id },
    data: {
      remainingDownloads: entitlement.remainingDownloads == null ? null : Math.max(0, entitlement.remainingDownloads - 1),
      firstDownloadedAt: entitlement.firstDownloadedAt ?? new Date(),
      lastDownloadedAt: new Date(),
      status: entitlement.remainingDownloads === 1 ? "exhausted" : entitlement.status,
    },
  });
  await logDownloadAccess(entitlement.shopId, entitlement.id, "success");

  return {
    ok: true as const,
    url: entitlement.downloadAsset.fileUrl,
    fileName: entitlement.downloadAsset.fileName,
    mimeType: entitlement.downloadAsset.mimeType ?? "application/octet-stream",
  };
}

async function logDownloadAccess(shopId: string, entitlementId: string, status: "success" | "blocked" | "expired" | "revoked" | "exhausted") {
  if (!hasDatabaseUrl()) return;
  await getPrisma().downloadAccessLog.create({
    data: {
      shopId,
      entitlementId,
      status,
    },
  });
}
