import { validateImportUrl } from "./import-security";

const MAX_IMPORT_BYTES = 1_000_000;

export async function fetchProductImportPreview(rawUrl: string, headers?: Record<string, string>) {
  const validated = validateImportUrl(rawUrl);

  if (!validated.ok) {
    return validated;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(validated.url, {
      headers,
      signal: controller.signal,
    });

    const contentLength = Number(response.headers.get("content-length") ?? 0);
    const contentType = response.headers.get("content-type") ?? "";

    if (contentLength > MAX_IMPORT_BYTES) {
      return { ok: false as const, error: "API response is too large for an MVP import preview." };
    }

    if (!contentType.includes("json")) {
      return { ok: false as const, error: "API import expects a JSON response." };
    }

    const json = await response.json();
    const products = normalizeProductPayload(json);

    return { ok: true as const, products: products.slice(0, 25), total: products.length };
  } catch {
    return { ok: false as const, error: "Unable to fetch the API import preview." };
  } finally {
    clearTimeout(timeout);
  }
}

export function normalizeProductPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.products)) return record.products;
    if (Array.isArray(record.data)) return record.data;
  }

  return [];
}
