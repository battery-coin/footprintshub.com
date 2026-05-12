import type { AttributionModel } from "./types";
import { normalizeBaseUrl } from "@/lib/url/site-url";

export const REFERRAL_COOKIE = "fh_ref";
export const VISITOR_COOKIE = "fh_visitor";
export const SESSION_COOKIE = "fh_session";

export function buildReferralUrl({
  baseUrl,
  code,
  path = "/",
}: {
  baseUrl: string;
  code: string;
  path?: string;
}) {
  const url = new URL(path, normalizeBaseUrl(baseUrl));
  url.searchParams.set("ref", code);
  return url.toString();
}

export function shouldReplaceAttribution({
  model,
  hasFirstTouch,
  hasLastTouch,
  isCouponAttribution,
}: {
  model: AttributionModel;
  hasFirstTouch: boolean;
  hasLastTouch: boolean;
  isCouponAttribution?: boolean;
}) {
  if (model === "manual_override") {
    return false;
  }

  if (model === "coupon_priority" && isCouponAttribution) {
    return true;
  }

  if (model === "lifetime") {
    return !hasFirstTouch;
  }

  if (model === "first_touch") {
    return !hasFirstTouch;
  }

  if (model === "last_touch") {
    return true;
  }

  return !hasLastTouch;
}

export function calculateLifetimeAttributionExpiry({
  startsAt = new Date(),
  lifetimeAttributionDays,
}: {
  startsAt?: Date;
  lifetimeAttributionDays?: number;
}) {
  if (!lifetimeAttributionDays || lifetimeAttributionDays <= 0) {
    return null;
  }

  return new Date(startsAt.getTime() + lifetimeAttributionDays * 24 * 60 * 60 * 1000);
}

export function shouldUseLifetimeAttribution({
  enabled,
  attributionExpired,
  couponOverride,
  hasCouponAttribution,
}: {
  enabled: boolean;
  attributionExpired: boolean;
  couponOverride: boolean;
  hasCouponAttribution: boolean;
}) {
  if (!enabled || attributionExpired) {
    return false;
  }

  if (couponOverride && hasCouponAttribution) {
    return false;
  }

  return true;
}
