"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMoney } from "@/lib/catalog/products";
import { useCart } from "@/components/cart/cart-provider";

export default function CheckoutPage() {
  const { items, subtotalCents, checkout, isCheckingOut } = useCart();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedRandomized, setAcceptedRandomized] = useState(false);
  const hasPhysical = items.some((item) => item.requiresShipping !== false);
  const hasRandomized = items.some((item) => item.productType === "blind_box" || item.productType === "booster_pack");
  const canCheckout = acceptedTerms && (!hasRandomized || acceptedRandomized) && items.length > 0;
  const shippingMessage = useMemo(
    () => (hasPhysical ? "Shipping details are required for physical and print-on-demand products." : "This cart can skip shipping if all items remain digital-only."),
    [hasPhysical],
  );

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState title="Your checkout is empty" description="Add a product before starting Stripe Checkout." actionHref="/shop" actionLabel="Shop products" />
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Checkout</p>
        <h1 className="mt-3 text-4xl font-semibold">Review before payment</h1>
        <p className="mt-4 text-sm leading-7 text-black/60">
          Stripe Checkout opens after the server recalculates product prices, product status, inventory, and cart totals.
        </p>

        <div className="mt-8 grid gap-4">
          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="text-xl font-semibold">Delivery</h2>
            <p className="mt-2 text-sm leading-6 text-black/60">{shippingMessage}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="text-xl font-semibold">Agreements</h2>
            <label className="mt-4 flex gap-3 text-sm leading-6 text-black/65">
              <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1" />
              I accept the terms of sale, refund policy, shipping policy, and digital goods terms.
            </label>
            {hasRandomized ? (
              <label className="mt-3 flex gap-3 text-sm leading-6 text-black/65">
                <input type="checkbox" checked={acceptedRandomized} onChange={(event) => setAcceptedRandomized(event.target.checked)} className="mt-1" />
                I understand blind box or booster pack products require published odds and assortment rules before public launch.
              </label>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-black/55">
              <Link href="/legal/terms" className="underline">Terms</Link>
              <Link href="/legal/refunds" className="underline">Refunds</Link>
              <Link href="/legal/shipping" className="underline">Shipping</Link>
              <Link href="/legal/digital-goods" className="underline">Digital goods</Link>
            </div>
          </div>
        </div>
      </section>

      <aside className="h-fit rounded-lg border border-black/10 bg-white p-5">
        <h2 className="text-xl font-semibold">Order summary</h2>
        <div className="mt-4 divide-y divide-black/10">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between gap-4 py-3 text-sm">
              <span>
                {item.title}
                <span className="block text-black/50">Qty {item.quantity}</span>
              </span>
              <span className="font-medium">{formatMoney(item.unitPriceCents * item.quantity, item.currency)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>{formatMoney(subtotalCents)}</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-black/55">Shipping, tax, discounts, and payment status are finalized server-side.</p>
        <div className="mt-5 grid gap-3">
          <Button type="button" onClick={checkout} disabled={!canCheckout || isCheckingOut}>
            {isCheckingOut ? "Opening Stripe..." : "Continue to Stripe Checkout"}
          </Button>
          <ButtonLink href="/cart" variant="secondary">Return to cart</ButtonLink>
        </div>
      </aside>
    </main>
  );
}
