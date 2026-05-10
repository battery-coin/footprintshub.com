import type { AffiliateAncestor, AffiliateRecord } from "./types";

export function assertValidParentAssignment({
  affiliateId,
  parentAffiliate,
  descendants = [],
}: {
  affiliateId: string;
  parentAffiliate?: AffiliateRecord;
  descendants?: AffiliateRecord[];
}) {
  if (!parentAffiliate) {
    return { ok: true as const };
  }

  if (parentAffiliate.id === affiliateId) {
    return { ok: false as const, reason: "Affiliate cannot be their own parent." };
  }

  if (parentAffiliate.status !== "approved") {
    return { ok: false as const, reason: "Parent affiliate must be approved." };
  }

  if (descendants.some((affiliate) => affiliate.id === parentAffiliate.id)) {
    return { ok: false as const, reason: "Circular affiliate tree detected." };
  }

  return { ok: true as const };
}

export function getAncestorsWithinDepth(ancestors: AffiliateAncestor[], maxDepth: number) {
  return ancestors.filter((ancestor) => ancestor.depth > 0 && ancestor.depth <= maxDepth).sort((a, b) => a.depth - b.depth);
}
