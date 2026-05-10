import type { AttributionModel } from "./types";

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
  const url = new URL(path, baseUrl);
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

  if (model === "first_touch") {
    return !hasFirstTouch;
  }

  if (model === "last_touch") {
    return true;
  }

  return !hasLastTouch;
}
