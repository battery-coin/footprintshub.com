import { createStripeCheckoutProvider } from "./providers/stripe-checkout";
import type { CreatePaymentSessionInput, PaymentProviderAdapter, PaymentProviderCode } from "./types";

const providers: Record<PaymentProviderCode, PaymentProviderAdapter | undefined> = {
  stripe_checkout: createStripeCheckoutProvider(),
  manual: undefined,
  paypal_placeholder: undefined,
  battery_coin_placeholder: undefined,
};

export function getPaymentProvider(code: PaymentProviderCode) {
  const provider = providers[code];

  if (!provider) {
    throw new Error(`Payment provider is not enabled: ${code}`);
  }

  return provider;
}

export async function createProviderPaymentSession(
  providerCode: PaymentProviderCode,
  input: CreatePaymentSessionInput,
) {
  return getPaymentProvider(providerCode).createSession(input);
}
