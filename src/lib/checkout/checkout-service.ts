import type { PricedCartLine } from "@/lib/catalog/types";
import { calculateTotalsPipeline, type TotalsPipelineInput } from "@/lib/totals/totals-pipeline";
import { validateCheckoutReadiness, type CheckoutIntentInput } from "./checkout-validation";

export function prepareCheckoutSummary({
  input,
  lines,
  totalsInput,
}: {
  input: CheckoutIntentInput;
  lines: PricedCartLine[];
  totalsInput?: Omit<TotalsPipelineInput, "lines">;
}) {
  const readiness = validateCheckoutReadiness({ input, lines });
  const totals = calculateTotalsPipeline({ lines, ...totalsInput });

  return {
    ok: readiness.ok,
    errors: readiness.errors,
    totals,
    metadata: {
      newsletterOptIn: input.newsletterOptIn,
      orderComment: input.orderComment,
      requiresShipping: readiness.requiresShipping,
      preorderAcknowledged: input.preorderAcknowledged,
      randomizedOddsAcknowledged: input.randomizedOddsAcknowledged,
    },
  };
}
