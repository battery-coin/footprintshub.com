import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/catalog/products";
import type { CatalogProduct } from "@/lib/catalog/types";

export function AdPackageCard({ product }: { product: CatalogProduct }) {
  const duration = typeof product.metadata?.durationDays === "number" ? product.metadata.durationDays : 30;

  return (
    <article className="grid gap-4 rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <Badge>{product.productType.replaceAll("_", " ")}</Badge>
        <Badge>{duration} days</Badge>
        {product.paymentMode === "recurring" ? <Badge>Recurring</Badge> : null}
      </div>
      <div>
        <Link href={`/advertise/packages/${product.slug}`} className="text-xl font-semibold hover:underline">
          {product.title}
        </Link>
        <p className="mt-2 min-h-12 text-sm leading-6 text-black/60">{product.shortDescription}</p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-lg font-semibold">{formatMoney(product.priceCents, product.currency)}</span>
        <AddToCartButton product={product} compact />
      </div>
    </article>
  );
}
