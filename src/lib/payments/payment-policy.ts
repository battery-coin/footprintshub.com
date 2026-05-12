import type { Prisma } from "@prisma/client";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { getDefaultShopId } from "@/lib/settings/settings-service";
import { validatePaymentRatio } from "./mixed-payment-calculator";

export const defaultPaymentPolicy = {
  id: "fallback-fiat-only",
  name: "Default fiat checkout",
  description: "100% USD checkout until a mixed payment policy is saved.",
  status: "active",
  compositionMode: "fiat_only",
  fiatCurrency: "USD",
  fiatPercentageBps: 10000,
  tokenPercentageBps: 0,
  tokenSymbol: "BATT",
  requireExactRatio: true,
  roundingMode: "nearest_cent",
  tokenPaymentsEnabled: false,
};

export type PaymentPolicyInput = {
  name?: string;
  description?: string | null;
  status?: "draft" | "active" | "archived";
  compositionMode?: "fiat_only" | "token_only" | "mixed_ratio" | "owner_defined" | "product_override" | "subscription_override";
  fiatCurrency?: string;
  fiatPercentageBps: number;
  tokenPercentageBps: number;
  tokenAssetId?: string | null;
  appliesTo?: "global" | "product" | "category" | "collection" | "subscription" | "ad" | "affiliate_payout" | "manual";
  requireExactRatio?: boolean;
  roundingMode?: "nearest_cent" | "round_up_fiat" | "round_up_token";
};

export async function getActiveGlobalPaymentPolicy() {
  if (!hasDatabaseUrl()) {
    return defaultPaymentPolicy;
  }

  try {
    const shopId = await getDefaultShopId();
    const policy = await getPrisma().paymentPolicy.findFirst({
      where: { shopId, status: "active", appliesTo: "global" },
      include: { tokenAsset: true },
      orderBy: { updatedAt: "desc" },
    });

    if (!policy) {
      return defaultPaymentPolicy;
    }

    return {
      ...policy,
      tokenSymbol: policy.tokenAsset?.symbol ?? "BATT",
      tokenPaymentsEnabled: Boolean(policy.tokenAsset?.enabled && process.env.ENABLE_TOKEN_PAYMENT_PROVIDER === "true"),
    };
  } catch {
    return defaultPaymentPolicy;
  }
}

export async function saveGlobalPaymentPolicy(input: PaymentPolicyInput) {
  const validation = validatePaymentRatio({
    fiatPercentageBps: input.fiatPercentageBps,
    tokenPercentageBps: input.tokenPercentageBps,
    requireExactRatio: input.requireExactRatio,
  });

  if (!validation.ok) {
    return { ok: false as const, status: 400, error: validation.error };
  }

  if (!hasDatabaseUrl()) {
    return { ok: true as const, stored: false, policy: { ...defaultPaymentPolicy, ...input } };
  }

  const prisma = getPrisma();
  const shopId = await getDefaultShopId();
  const existing = await prisma.paymentPolicy.findFirst({ where: { shopId, appliesTo: "global", status: { not: "archived" } } });
  const data: Prisma.PaymentPolicyUncheckedCreateInput = {
    shopId,
    name: input.name ?? "Global mixed payment policy",
    description: input.description ?? "Owner-defined USD and utility token payment composition.",
    status: input.status ?? "active",
    compositionMode: input.compositionMode ?? (input.tokenPercentageBps === 0 ? "fiat_only" : input.fiatPercentageBps === 0 ? "token_only" : "mixed_ratio"),
    fiatCurrency: input.fiatCurrency ?? "USD",
    fiatPercentageBps: input.fiatPercentageBps,
    tokenPercentageBps: input.tokenPercentageBps,
    tokenAssetId: input.tokenAssetId ?? null,
    appliesTo: input.appliesTo ?? "global",
    requireExactRatio: input.requireExactRatio ?? true,
    roundingMode: input.roundingMode ?? "nearest_cent",
  };

  const policy = existing
    ? await prisma.paymentPolicy.update({ where: { id: existing.id }, data })
    : await prisma.paymentPolicy.create({ data });

  return { ok: true as const, stored: true, policy };
}

export async function listTokenAssets() {
  if (!hasDatabaseUrl()) {
    return [{ id: "battery-coin", symbol: "BATT", name: "Battery Coin", chain: "utility", decimals: 18, enabled: false, utilityDescription: "Utility token payment access." }];
  }

  try {
    const shopId = await getDefaultShopId();
    return await getPrisma().tokenPaymentAsset.findMany({ where: { shopId }, orderBy: [{ enabled: "desc" }, { symbol: "asc" }] });
  } catch {
    return [{ id: "battery-coin", symbol: "BATT", name: "Battery Coin", chain: "utility", decimals: 18, enabled: false, utilityDescription: "Utility token payment access." }];
  }
}

export async function upsertTokenAsset(input: {
  id?: string;
  symbol: string;
  name: string;
  chain: string;
  contractAddress?: string | null;
  decimals: number;
  enabled: boolean;
  utilityDescription?: string | null;
}) {
  if (!hasDatabaseUrl()) {
    return { ok: true as const, stored: false, asset: input };
  }

  const prisma = getPrisma();
  const shopId = await getDefaultShopId();
  const existing = input.id ? await prisma.tokenPaymentAsset.findUnique({ where: { id: input.id } }) : null;
  const data = {
    shopId,
    symbol: input.symbol.toUpperCase(),
    name: input.name,
    chain: input.chain,
    contractAddress: input.contractAddress || null,
    decimals: input.decimals,
    enabled: input.enabled,
    utilityDescription: input.utilityDescription || null,
  };

  const asset = existing
    ? await prisma.tokenPaymentAsset.update({ where: { id: existing.id }, data })
    : await prisma.tokenPaymentAsset.create({ data });

  return { ok: true as const, stored: true, asset };
}
