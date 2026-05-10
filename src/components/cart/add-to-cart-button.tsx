"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CatalogProduct } from "@/lib/catalog/types";
import { useCart } from "./cart-provider";

export function AddToCartButton({ product, compact = false }: { product: CatalogProduct; compact?: boolean }) {
  const { addItem } = useCart();
  const disabled = product.priceCents === 0 || product.status !== "active";

  return (
    <Button
      type="button"
      onClick={() => addItem(product)}
      disabled={disabled}
      className={compact ? "min-h-9 px-3" : undefined}
      aria-label={`Add ${product.title} to cart`}
    >
      <Plus size={16} aria-hidden="true" />
      {compact ? "Add" : "Add to cart"}
    </Button>
  );
}
