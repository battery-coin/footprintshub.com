"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { formatMoney } from "@/lib/catalog/products";
import { useCart } from "@/components/cart/cart-provider";

export default function CartPage() {
  const { items, increaseItem, decreaseItem, removeItem, clearCart, subtotalCents } = useCart();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold">Cart</h1>
      {items.length === 0 ? (
        <div className="mt-10 rounded-lg border border-black/10 bg-white p-8 text-center">
          <p className="text-lg font-semibold">Your cart is empty.</p>
          <ButtonLink href="/shop" className="mt-5">
            Shop products
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="grid gap-4 rounded-lg border border-black/10 bg-white p-4 sm:grid-cols-[96px_1fr]">
                <Link href={`/products/${item.slug}`} className="relative h-24 overflow-hidden rounded-md bg-black">
                  {item.imageUrl ? <Image src={item.imageUrl} alt="" fill className="object-cover" /> : null}
                </Link>
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link href={`/products/${item.slug}`} className="font-semibold hover:underline">
                        {item.title}
                      </Link>
                      <p className="mt-1 text-sm text-black/55">{formatMoney(item.unitPriceCents, item.currency)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="focus-ring rounded p-2 text-black/50 hover:text-black"
                      aria-label={`Remove ${item.title}`}
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center overflow-hidden rounded-md border border-black/15">
                      <button type="button" onClick={() => decreaseItem(item.productId)} className="focus-ring flex h-10 w-10 items-center justify-center">
                        <Minus size={15} />
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button type="button" onClick={() => increaseItem(item.productId)} className="focus-ring flex h-10 w-10 items-center justify-center">
                        <Plus size={15} />
                      </button>
                    </div>
                    <span className="font-semibold">{formatMoney(item.unitPriceCents * item.quantity, item.currency)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-lg border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span>{formatMoney(subtotalCents)}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-black/55">
              Final totals are recalculated server-side before Stripe Checkout.
            </p>
            <div className="mt-5 grid gap-3">
              <ButtonLink href="/checkout">Review checkout</ButtonLink>
              <Button type="button" variant="ghost" onClick={clearCart}>
                Clear cart
              </Button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
