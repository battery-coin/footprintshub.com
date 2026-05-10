import { createHash } from "node:crypto";

export function hashIpAddress(ipAddress: string | null | undefined) {
  if (!ipAddress) {
    return null;
  }

  const secret = process.env.AFFILIATE_IP_HASH_SECRET ?? "local-development-only";
  return createHash("sha256").update(`${secret}:${ipAddress}`).digest("hex");
}

export function detectDevice(userAgent: string | null | undefined) {
  const value = (userAgent ?? "").toLowerCase();

  if (value.includes("mobile") || value.includes("iphone") || value.includes("android")) {
    return "mobile";
  }

  if (value.includes("ipad") || value.includes("tablet")) {
    return "tablet";
  }

  return "desktop";
}

export function isLikelyDuplicateClick({
  previousClickAt,
  now = new Date(),
  minimumSeconds = 10,
}: {
  previousClickAt?: Date | null;
  now?: Date;
  minimumSeconds?: number;
}) {
  if (!previousClickAt) {
    return false;
  }

  return now.getTime() - previousClickAt.getTime() < minimumSeconds * 1000;
}
