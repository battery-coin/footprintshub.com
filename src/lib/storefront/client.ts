import type { CartLineInput } from "@/lib/catalog/types";

export type StorefrontClientOptions = {
  baseUrl?: string;
  fetcher?: typeof fetch;
};

export type StorefrontCartPayload = {
  items: CartLineInput[];
  couponCode?: string;
  cartId?: string;
};

function makeUrl(baseUrl: string | undefined, path: string) {
  if (!baseUrl) {
    return path;
  }

  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

async function readJson<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as T | { error?: string } | null;

  if (!response.ok) {
    const message =
      body && typeof body === "object" && "error" in body && body.error
        ? body.error
        : "Storefront request failed.";
    throw new Error(message);
  }

  return body as T;
}

export function createStorefrontClient(options: StorefrontClientOptions = {}) {
  const fetcher = options.fetcher ?? fetch;

  return {
    async listProducts() {
      const response = await fetcher(makeUrl(options.baseUrl, "/api/store/products"));
      return readJson(response);
    },
    async getProduct(idOrSlug: string) {
      const response = await fetcher(makeUrl(options.baseUrl, `/api/store/products/${encodeURIComponent(idOrSlug)}`));
      return readJson(response);
    },
    async validateCart(payload: StorefrontCartPayload) {
      const response = await fetcher(makeUrl(options.baseUrl, "/api/cart"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: payload.items }),
      });

      return readJson(response);
    },
    async createCheckoutSession(payload: StorefrontCartPayload) {
      const response = await fetcher(makeUrl(options.baseUrl, "/api/checkout/create-session"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      return readJson<{ url?: string; error?: string }>(response);
    },
    async resolveTenant() {
      const response = await fetcher(makeUrl(options.baseUrl, "/api/store/tenant"));
      return readJson(response);
    },
    async listRegions() {
      const response = await fetcher(makeUrl(options.baseUrl, "/api/store/regions"));
      return readJson(response);
    },
    async listShippingOptions() {
      const response = await fetcher(makeUrl(options.baseUrl, "/api/store/shipping-options"));
      return readJson(response);
    },
  };
}
