const FALLBACK_SITE_URL = "https://footprintshub.com";

export function normalizeBaseUrl(input?: string | null) {
  const raw = (input ?? "").trim();
  const candidate = raw || FALLBACK_SITE_URL;
  const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export function getSiteUrl() {
  return normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL);
}

export function buildAbsoluteUrl(path = "/") {
  return new URL(path.startsWith("/") ? path : `/${path}`, getSiteUrl()).toString();
}

export function buildReferralUrl(referralCode: string, path = "/") {
  const url = new URL(path.startsWith("/") ? path : `/${path}`, getSiteUrl());
  url.searchParams.set("ref", referralCode);
  return url.toString();
}
