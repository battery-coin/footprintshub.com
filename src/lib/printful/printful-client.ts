import "server-only";
import { PrintfulApiError, PrintfulConfigError, PrintfulDuplicateOrderError, PrintfulNetworkError, PrintfulRateLimitError } from "./printful-errors";
import type { PrintfulApiEnvelope, PrintfulOrderPayload, PrintfulOrderResponse } from "./printful-types";

const DEFAULT_BASE_URL = "https://api.printful.com";
const DEFAULT_TIMEOUT_MS = 15_000;

type PrintfulRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
};

export function getPrintfulConfig() {
  const apiKey = process.env.PRINTFUL_API_KEY?.trim();

  if (!apiKey) {
    throw new PrintfulConfigError("PRINTFUL_API_KEY is not configured.");
  }

  const baseUrl = normalizeBaseUrl(process.env.PRINTFUL_API_BASE_URL);
  const storeId = process.env.PRINTFUL_STORE_ID?.trim();

  return { apiKey, baseUrl, storeId };
}

export async function printfulGet<T>(path: string, query?: PrintfulRequestOptions["query"]) {
  return printfulRequest<T>(path, { method: "GET", query });
}

export async function printfulPost<T>(path: string, body?: unknown, query?: PrintfulRequestOptions["query"]) {
  return printfulRequest<T>(path, { method: "POST", body, query });
}

export async function printfulPut<T>(path: string, body?: unknown, query?: PrintfulRequestOptions["query"]) {
  return printfulRequest<T>(path, { method: "PUT", body, query });
}

export async function printfulDelete<T>(path: string, body?: unknown) {
  return printfulRequest<T>(path, { method: "DELETE", body });
}

export async function getPrintfulStoreInfo() {
  return printfulGet("stores");
}

export async function listPrintfulProducts() {
  return printfulGet("products");
}

export async function getPrintfulProduct(id: string | number) {
  return printfulGet(`products/${id}`);
}

export async function listSyncProducts() {
  return printfulGet("store/products");
}

export async function getSyncProduct(id: string | number) {
  return printfulGet(`store/products/${id}`);
}

export async function createPrintfulOrder(payload: PrintfulOrderPayload, options: { confirm?: boolean; updateExisting?: boolean } = {}) {
  return printfulPost<PrintfulOrderResponse>("orders", payload, {
    confirm: options.confirm,
    update_existing: options.updateExisting,
  });
}

export async function getPrintfulOrder(printfulOrderId: string | number) {
  return printfulGet<PrintfulOrderResponse>(`orders/${printfulOrderId}`);
}

export async function confirmPrintfulOrder(printfulOrderId: string | number) {
  return printfulPost<PrintfulOrderResponse>(`orders/${printfulOrderId}/confirm`);
}

export async function calculateShippingRates(payload: Pick<PrintfulOrderPayload, "recipient" | "items">) {
  return printfulPost("shipping/rates", payload);
}

async function printfulRequest<T>(path: string, options: PrintfulRequestOptions = {}) {
  const config = getPrintfulConfig();
  const url = new URL(path.replace(/^\/+/, ""), `${config.baseUrl}/`);

  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        ...(config.storeId ? { "X-PF-Store-Id": config.storeId } : {}),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal,
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => undefined)) as PrintfulApiEnvelope<T> | undefined;

    if (!response.ok) {
      const message = payload?.error?.message ?? payload?.error?.reason ?? payload?.result?.toString() ?? "Printful API request failed.";

      if (response.status === 429) {
        throw new PrintfulRateLimitError(response.status, payload);
      }

      if (response.status === 400 && message.toLowerCase().includes("external")) {
        throw new PrintfulDuplicateOrderError(response.status, payload);
      }

      throw new PrintfulApiError(message, response.status, payload);
    }

    return (payload?.result ?? payload) as T;
  } catch (error) {
    if (error instanceof PrintfulApiError) {
      throw error;
    }

    throw new PrintfulNetworkError(error instanceof Error ? error.message : undefined);
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeBaseUrl(input?: string) {
  const raw = input?.trim() || DEFAULT_BASE_URL;

  try {
    return new URL(raw).origin;
  } catch {
    return DEFAULT_BASE_URL;
  }
}
