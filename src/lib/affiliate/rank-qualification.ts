import type { AffiliateQualificationSnapshotInput, AffiliateRankInput } from "./types";

export function calculateAffiliateQualification({
  ranks,
  metrics,
}: {
  ranks: AffiliateRankInput[];
  metrics: Omit<AffiliateQualificationSnapshotInput, "calculatedRankId" | "calculatedTierId" | "maxPaidLevels">;
}) {
  const qualifiedRanks = ranks
    .filter((rank) => rank.active)
    .filter((rank) => meetsRankRequirements(rank, metrics))
    .sort((a, b) => b.priority - a.priority);

  const rank = qualifiedRanks[0];

  return {
    calculatedRankId: rank?.id,
    maxPaidLevels: rank?.maxPaidLevels ?? 0,
    directCommissionBonusBps: rank?.directCommissionBonusBps ?? 0,
  };
}

export function meetsRankRequirements(
  rank: AffiliateRankInput,
  metrics: Pick<
    AffiliateQualificationSnapshotInput,
    "monthlySalesCents" | "directReferralCount" | "qualifiedOrderCount"
  >,
) {
  if (rank.monthlySalesRequiredCents && metrics.monthlySalesCents < rank.monthlySalesRequiredCents) {
    return false;
  }

  if (rank.directReferralRequiredCount && metrics.directReferralCount < rank.directReferralRequiredCount) {
    return false;
  }

  if (rank.qualifiedOrderRequiredCount && metrics.qualifiedOrderCount < rank.qualifiedOrderRequiredCount) {
    return false;
  }

  return true;
}
