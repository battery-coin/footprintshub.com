"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { formatMoney } from "@/lib/catalog/products";
import { useCart } from "./cart-provider";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    increaseItem,
    decreaseItem,
    removeItem,
    clearCart,
    subtotalCents,
    checkout,
    isCheckingOut,
  } = useCart();

  return (
    <div
      className={`fixed inset-0 z-50 transition ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-black/40 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={closeCart}
        aria-label="Close cart"
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[var(--paper)] shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/10 p-5">
          <div>
            <p className="text-lg font-semibold">Cart</p>
            <p className="text-sm text-black/55">Prices are recalculated at checkout.</p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="focus-ring rounded-full p-2 hover:bg-black/5"
            aria-label="Close cart"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold">Your cart is empty</p>
              <p className="mt-2 text-sm text-black/55">Add a supporter bundle or collector item to begin.</p>
              <ButtonLink href="/shop" className="mt-6" onClick={closeCart}>
                Shop products
              </ButtonLink>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="grid grid-cols-[72px_1fr] gap-4 border-b border-black/10 pb-4">
                  <Link href={`/products/${item.slug}`} onClick={closeCart} className="relative h-20 overflow-hidden rounded-md bg-black">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt="" fill className="object-cover" />
                    ) : null}
                  </Link>
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/products/${item.slug}`} onClick={closeCart} className="font-medium leading-5 hover:underline">
                        {item.title}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="focus-ring rounded p-1 text-black/45 hover:text-black"
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-black/55">{formatMoney(item.unitPriceCents, item.currency)}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center overflow-hidden rounded-md border border-black/15">
                        <button
                          type="button"
                          onClick={() => decreaseItem(item.productId)}
                          className="focus-ring flex h-9 w-9 items-center justify-center hover:bg-black/5"
                          aria-label={`Decrease ${item.title}`}
                        >
                          <Minus size={14} aria-hidden="true" />
                        </button>
                        <span className="w-10 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => increaseItem(item.productId)}
                          className="focus-ring flex h-9 w-9 items-center justify-center hover:bg-black/5"
                          aria-label={`Increase ${item.title}`}
                        >
                          <Plus size={14} aria-hidden="true" />
                        </button>
                      </div>
                      <span className="font-medium">
                        {formatMoney(item.unitPriceCents * item.quantity, item.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-black/10 p-5">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Subtotal</span>
            <span>{formatMoney(subtotalCents)}</span>
          </div>
          <p className="mt-2 text-xs leading-5 text-black/55">
            Taxes, shipping, discounts, and final product availability are confirmed during checkout.
          </p>
          <div className="mt-5 grid gap-3">
            <Button type="button" onClick={checkout} disabled={!items.length || isCheckingOut}>
              {isCheckingOut ? "Opening checkout..." : "Checkout"}
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <ButtonLink href="/cart" variant="secondary" onClick={closeCart}>
                View cart
              </ButtonLink>
              <Button type="button" variant="ghost" onClick={clearCart} disabled={!items.length}>
                Clear
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
