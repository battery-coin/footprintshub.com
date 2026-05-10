import type { AffiliateAncestor, AffiliatePlanLevelInput, AffiliateRecord } from "./types";

export type QualifiedAncestor = AffiliateAncestor & {
  planLevel: AffiliatePlanLevelInput;
  compressionApplied: boolean;
  skippedAffiliateIds: string[];
};

export function resolveQualifiedAncestors({
  ancestors,
  levels,
  affiliateRanks,
}: {
  ancestors: AffiliateAncestor[];
  levels: AffiliatePlanLevelInput[];
  affiliateRanks: Record<string, string | undefined>;
}) {
  const sortedAncestors = ancestors
    .filter((ancestor) => ancestor.depth > 0 && ancestor.depth <= 7)
    .sort((a, b) => a.depth - b.depth);
  const result: QualifiedAncestor[] = [];
  const skipped: AffiliateRecord[] = [];

  for (const ancestor of sortedAncestors) {
    const level = levels.find((candidate) => candidate.enabled && candidate.levelDepth === ancestor.depth);

    if (!level) {
      continue;
    }

    if (isQualifiedForLevel(ancestor.affiliate, level, affiliateRanks)) {
      const compressionApplied = level.compressionBehavior === "compress_to_next_qualified" && skipped.length > 0;
      result.push({
        ...ancestor,
        planLevel: level,
        compressionApplied,
        skippedAffiliateIds: compressionApplied ? skipped.map((affiliate) => affiliate.id) : [],
      });
      skipped.length = 0;
      continue;
    }

    if (level.compressionBehavior === "compress_to_next_qualified") {
      skipped.push(ancestor.affiliate);
    }
  }

  return result;
}

export function isQualifiedForLevel(
  affiliate: AffiliateRecord,
  level: Pick<AffiliatePlanLevelInput, "requiresRankId">,
  affiliateRanks: Record<string, string | undefined>,
) {
  if (affiliate.status !== "approved") {
    return false;
  }

  if (!level.requiresRankId) {
    return true;
  }

  return affiliateRanks[affiliate.id] === level.requiresRankId;
}
