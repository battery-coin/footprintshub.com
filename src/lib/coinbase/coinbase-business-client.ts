import "server-only";
import { createHmac, createSign, randomBytes, timingSafeEqual } from "node:crypto";
import type {
  CoinbaseCheckoutCreateInput,
  CoinbaseCheckoutCreateResponse,
  CoinbaseCheckoutStatus,
  CoinbasePaymentStatus,
  CoinbaseWebhookEvent,
} from "./coinbase-types";

const DEFAULT_COINBASE_BASE_URL = "https://business.coinbase.com";
const CHECKOUTS_PATH = "/api/v1/checkouts";

export class CoinbaseConfigError extends Error {}
export class CoinbaseApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
  ) {
    super(message);
  }
}

export function isCoinbaseCheckoutEnabled() {
  return process.env.COINBASE_CHECKOUT_ENABLED === "true" || process.env.NEXT_PUBLIC_ENABLE_CRYPTO_CHECKOUT === "true";
}

export function getCoinbaseConfigStatus() {
  return {
    enabled: isCoinbaseCheckoutEnabled(),
    keyConfigured: Boolean(process.env.COINBASE_BUSINESS_API_KEY),
    secretConfigured: Boolean(process.env.COINBASE_BUSINESS_API_SECRET),
    webhookConfigured: Boolean(process.env.COINBASE_WEBHOOK_SECRET),
    baseUrl: getCoinbaseBaseUrl(),
  };
}

export function assertCoinbaseConfigured() {
  const status = getCoinbaseConfigStatus();
  if (!status.enabled) {
    throw new CoinbaseConfigError("Coinbase crypto checkout is disabled.");
  }
  if (!status.keyConfigured || !status.secretConfigured) {
    throw new CoinbaseConfigError("Coinbase Business API credentials are not configured.");
  }
}

export async function createCoinbaseCheckout(input: CoinbaseCheckoutCreateInput, idempotencyKey: string) {
  return coinbaseRequest<CoinbaseCheckoutCreateResponse>("POST", CHECKOUTS_PATH, input, idempotencyKey);
}

export async function getCoinbaseCheckout(checkoutId: string) {
  return coinbaseRequest<CoinbaseCheckoutCreateResponse>("GET", `${CHECKOUTS_PATH}/${encodeURIComponent(checkoutId)}`);
}

export function mapCoinbaseStatusToInternalStatus(status?: string): CoinbasePaymentStatus {
  const normalized = status?.toUpperCase() as CoinbaseCheckoutStatus | undefined;
  if (normalized === "COMPLETED") return "paid";
  if (normalized === "EXPIRED") return "expired";
  if (normalized === "DEACTIVATED") return "cancelled";
  if (normalized === "FAILED") return "failed";
  if (normalized === "REFUNDED") return "refunded";
  if (normalized === "PARTIALLY_REFUNDED") return "partially_refunded";
  return "pending";
}

export function normalizeCoinbaseEvent(payload: unknown): {
  id: string;
  type: string;
  checkoutId?: string;
  status?: CoinbasePaymentStatus;
  metadata: Record<string, string>;
  data?: CoinbaseWebhookEvent["data"];
} {
  const event = (payload ?? {}) as CoinbaseWebhookEvent;
  const data = event.data;
  const checkoutId = data?.id ?? data?.checkoutId;
  const type = event.type ?? event.eventType ?? "coinbase.checkout.updated";
  return {
    id: event.id ?? `${type}:${checkoutId ?? "unknown"}:${data?.status ?? "unknown"}`,
    type,
    checkoutId,
    status: mapCoinbaseStatusToInternalStatus(data?.status),
    metadata: data?.metadata ?? event.metadata ?? {},
    data,
  };
}

export function verifyCoinbaseWebhook(rawBody: string, signature: string | null) {
  const secret = process.env.COINBASE_WEBHOOK_SECRET;
  if (!secret) {
    return false;
  }
  if (!signature) {
    return false;
  }

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const candidates = signature.split(",").map((part) => part.trim().replace(/^sha256=/i, ""));
  return candidates.some((candidate) => timingSafeEqualHex(candidate, expected));
}

async function coinbaseRequest<T>(method: "GET" | "POST", path: string, body?: unknown, idempotencyKey?: string): Promise<T> {
  assertCoinbaseConfigured();
  const baseUrl = getCoinbaseBaseUrl();
  const url = new URL(path, baseUrl);
  const token = generateCoinbaseJwt(method, url.host, url.pathname);

  const response = await fetch(url, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...(idempotencyKey ? { "x-idempotency-key": idempotencyKey } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new CoinbaseApiError(`Coinbase request failed with status ${response.status}.`, response.status, payload);
  }
  return payload as T;
}

function generateCoinbaseJwt(method: string, host: string, path: string) {
  const keyName = process.env.COINBASE_BUSINESS_API_KEY;
  const keySecret = process.env.COINBASE_BUSINESS_API_SECRET?.replace(/\\n/g, "\n");
  if (!keyName || !keySecret) {
    throw new CoinbaseConfigError("Coinbase Business API credentials are not configured.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlJson({
    alg: "ES256",
    kid: keyName,
    nonce: randomBytes(16).toString("hex"),
    typ: "JWT",
  });
  const payload = base64UrlJson({
    iss: "cdp",
    nbf: now,
    exp: now + 120,
    sub: keyName,
    uri: `${method.toUpperCase()} ${host}${path}`,
  });
  const signingInput = `${header}.${payload}`;
  const signature = createSign("SHA256").update(signingInput).end().sign(keySecret);
  return `${signingInput}.${base64Url(signature)}`;
}

function getCoinbaseBaseUrl() {
  const raw = process.env.COINBASE_API_BASE_URL?.trim() || DEFAULT_COINBASE_BASE_URL;
  try {
    return new URL(raw).origin;
  } catch {
    return DEFAULT_COINBASE_BASE_URL;
  }
}

function base64UrlJson(value: unknown) {
  return base64Url(Buffer.from(JSON.stringify(value)));
}

function base64Url(value: Buffer | string) {
  return Buffer.from(value).toString("base64url");
}

function timingSafeEqualHex(a: string, b: string) {
  const aBuffer = Buffer.from(a, "hex");
  const bBuffer = Buffer.from(b, "hex");
  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}
