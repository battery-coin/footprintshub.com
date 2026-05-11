const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^192\.168\./,
  /^0\./,
  /^\[?::1\]?$/i,
];

export function validateImportUrl(rawUrl: string, allowLocalhost = process.env.NODE_ENV === "development") {
  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    return { ok: false as const, error: "Enter a valid HTTPS API URL." };
  }

  if (!["https:", "http:"].includes(url.protocol)) {
    return { ok: false as const, error: "Only HTTP and HTTPS URLs are supported." };
  }

  if (url.protocol === "http:" && process.env.NODE_ENV === "production") {
    return { ok: false as const, error: "Production API imports must use HTTPS." };
  }

  if (!allowLocalhost && PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(url.hostname))) {
    return { ok: false as const, error: "Private, localhost, and internal network URLs are blocked for API imports." };
  }

  return { ok: true as const, url };
}
