import type { PricedCartLine } from "@/lib/catalog/types";

export type CheckoutModeResolution =
  | {
      ok: true;
      mode: "payment" | "subscription" | "free";
      hasOneTime: boolean;
      hasRecurring: boolean;
      hasExternal: boolean;
    }
  | {
      ok: false;
      reason: string;
      hasOneTime: boolean;
      hasRecurring: boolean;
      hasExternal: boolean;
    };

const recurringProductTypes = new Set(["subscription", "membership"]);

export function resolveCheckoutMode(lines: PricedCartLine[]): CheckoutModeResolution {
  const hasRecurring = lines.some((line) => line.product.paymentMode === "recurring" || recurringProductTypes.has(line.product.productType));
  const hasOneTime = lines.some((line) => {
    const mode = line.product.paymentMode ?? "one_time";
    return mode === "one_time" || mode === "one_time_or_recurring" || (!recurringProductTypes.has(line.product.productType) && mode !== "external" && mode !== "free");
  });
  const hasExternal = lines.some((line) => line.product.paymentMode === "external");
  const allFree = lines.every((line) => (line.product.paymentMode === "free" || line.unitPriceCents === 0) && line.totalCents === 0);

  if (hasExternal) {
    return {
      ok: false,
      reason: "This cart contains a product that uses external payment. Please contact support or buy it separately.",
      hasOneTime,
      hasRecurring,
      hasExternal,
    };
  }

  if (hasRecurring && hasOneTime) {
    return {
      ok: false,
      reason: "Please checkout subscription products separately from one-time products.",
      hasOneTime,
      hasRecurring,
      hasExternal,
    };
  }

  if (allFree) {
    return { ok: true, mode: "free", hasOneTime, hasRecurring, hasExternal };
  }

  return {
    ok: true,
    mode: hasRecurring ? "subscription" : "payment",
    hasOneTime,
    hasRecurring,
    hasExternal,
  };
}
