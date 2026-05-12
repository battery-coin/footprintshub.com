import type { Prisma } from "@prisma/client";
import { validatePrintfulOrderPayload } from "./validate-printful-order";
import type { PrintfulOrderPayload, PrintfulRecipient } from "./printful-types";

type PrintfulOrderBuildInput = {
  id: string;
  orderNumber: string;
  customerEmail: string | null;
  shippingAddress: Prisma.JsonValue | null;
  currency: string;
  shop?: { slug?: string | null } | null;
  items: Array<{
    id: string;
    productId: string;
    variantId: string | null;
    titleSnapshot: string;
    quantity: number;
    unitPriceCents: number;
    fulfillmentTypeSnapshot: string | null;
    printfulVariantId: string | null;
    printfulSyncVariantId: string | null;
    product: {
      title: string;
      fulfillmentType: string;
      printfulEnabled: boolean;
      printfulVariantId?: never;
    };
    variant: {
      printfulVariantId: string | null;
      printfulSyncVariantId: string | null;
      printfulRetailPriceCents: number | null;
    } | null;
  }>;
};

export function getPrintfulEligibleItems(order: PrintfulOrderBuildInput) {
  return order.items.filter((item) => item.fulfillmentTypeSnapshot === "printful" || item.product.fulfillmentType === "printful" || item.product.printfulEnabled);
}

export function buildPrintfulOrderPayload(order: PrintfulOrderBuildInput): PrintfulOrderPayload {
  const recipient = buildRecipient(order);
  const items = getPrintfulEligibleItems(order).map((item) => {
    const syncVariantId = toPositiveInteger(item.printfulSyncVariantId ?? item.variant?.printfulSyncVariantId ?? undefined);
    const variantId = toPositiveInteger(item.printfulVariantId ?? item.variant?.printfulVariantId ?? undefined);
    const retailPriceCents = item.variant?.printfulRetailPriceCents ?? item.unitPriceCents;

    return {
      external_id: item.id,
      name: item.titleSnapshot || item.product.title,
      quantity: item.quantity,
      retail_price: (retailPriceCents / 100).toFixed(2),
      ...(syncVariantId ? { sync_variant_id: syncVariantId } : {}),
      ...(syncVariantId ? {} : variantId ? { variant_id: variantId } : {}),
    };
  });

  return validatePrintfulOrderPayload({
    external_id: buildExternalId(order),
    shipping: process.env.PRINTFUL_DEFAULT_SHIPPING_METHOD?.trim() || "STANDARD",
    recipient,
    items,
  });
}

function buildRecipient(order: PrintfulOrderBuildInput): PrintfulRecipient {
  const address = normalizeAddress(order.shippingAddress);

  return {
    name: address.name || order.customerEmail || "FootprintsHub Customer",
    ...(address.company ? { company: address.company } : {}),
    address1: address.line1,
    ...(address.line2 ? { address2: address.line2 } : {}),
    city: address.city,
    ...(address.state ? { state_code: address.state } : {}),
    country_code: address.country,
    zip: address.postalCode,
    ...(address.phone ? { phone: address.phone } : {}),
    ...(order.customerEmail ? { email: order.customerEmail } : {}),
  };
}

function normalizeAddress(value: Prisma.JsonValue | null) {
  const raw = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

  return {
    name: stringValue(raw.name),
    company: stringValue(raw.company),
    line1: stringValue(raw.line1 ?? raw.address1),
    line2: stringValue(raw.line2 ?? raw.address2),
    city: stringValue(raw.city),
    state: stringValue(raw.state ?? raw.state_code ?? raw.region),
    country: stringValue(raw.country ?? raw.country_code),
    postalCode: stringValue(raw.postalCode ?? raw.postal_code ?? raw.zip),
    phone: stringValue(raw.phone),
  };
}

function buildExternalId(order: PrintfulOrderBuildInput) {
  const shopSlug = order.shop?.slug ? `${sanitizeExternalId(order.shop.slug)}-` : "";
  return `FH-${shopSlug}${sanitizeExternalId(order.orderNumber)}`.slice(0, 32);
}

function sanitizeExternalId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toPositiveInteger(value?: string | null) {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}
