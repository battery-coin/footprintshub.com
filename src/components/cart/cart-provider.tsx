"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CatalogProduct } from "@/lib/catalog/types";

export type CartItemSnapshot = {
  productId: string;
  slug: string;
  title: string;
  imageUrl?: string;
  unitPriceCents: number;
  currency: string;
  quantity: number;
  productType?: string;
  requiresShipping?: boolean;
};

type CartState = {
  items: CartItemSnapshot[];
};

type CartAction =
  | { type: "hydrate"; items: CartItemSnapshot[] }
  | { type: "add"; product: CatalogProduct }
  | { type: "increase"; productId: string }
  | { type: "decrease"; productId: string }
  | { type: "remove"; productId: string }
  | { type: "clear" };

type CartContextValue = {
  items: CartItemSnapshot[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: CatalogProduct) => void;
  increaseItem: (productId: string) => void;
  decreaseItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalCents: number;
  checkout: () => Promise<void>;
  isCheckingOut: boolean;
};

const STORAGE_KEY = "footprintshub-cart-v1";

const CartContext = createContext<CartContextValue | null>(null);

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { items: action.items };
    case "add": {
      const existing = state.items.find((item) => item.productId === action.product.id);

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productId === action.product.id
              ? { ...item, quantity: Math.min(99, item.quantity + 1) }
              : item,
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            productId: action.product.id,
            slug: action.product.slug,
            title: action.product.title,
            imageUrl: action.product.imageUrl,
            unitPriceCents: action.product.priceCents,
            currency: action.product.currency,
            quantity: 1,
            productType: action.product.productType,
            requiresShipping: action.product.requiresShipping,
          },
        ],
      };
    }
    case "increase":
      return {
        items: state.items.map((item) =>
          item.productId === action.productId ? { ...item, quantity: Math.min(99, item.quantity + 1) } : item,
        ),
      };
    case "decrease":
      return {
        items: state.items
          .map((item) =>
            item.productId === action.productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item,
          )
          .filter((item) => item.quantity > 0),
      };
    case "remove":
      return { items: state.items.filter((item) => item.productId !== action.productId) };
    case "clear":
      return { items: [] };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        dispatch({ type: "hydrate", items: JSON.parse(raw) as CartItemSnapshot[] });
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (hasHydrated.current) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    }
  }, [state.items]);

  const checkout = useCallback(async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: state.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Checkout is not available yet.");
      }

      window.location.href = payload.url;
    } finally {
      setIsCheckingOut(false);
    }
  }, [state.items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem: (product) => {
        dispatch({ type: "add", product });
        setIsOpen(true);
      },
      increaseItem: (productId) => dispatch({ type: "increase", productId }),
      decreaseItem: (productId) => dispatch({ type: "decrease", productId }),
      removeItem: (productId) => dispatch({ type: "remove", productId }),
      clearCart: () => dispatch({ type: "clear" }),
      itemCount: state.items.reduce((count, item) => count + item.quantity, 0),
      subtotalCents: state.items.reduce((total, item) => total + item.unitPriceCents * item.quantity, 0),
      checkout,
      isCheckingOut,
    }),
    [checkout, isOpen, isCheckingOut, state.items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
