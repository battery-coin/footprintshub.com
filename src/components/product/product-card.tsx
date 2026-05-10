import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductArt } from "./product-art";
import { formatMoney } from "@/lib/catalog/products";
import type { CatalogProduct } from "@/lib/catalog/types";

export function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <Link href={`/products/${product.slug}`} className="block aspect-square overflow-hidden bg-black">
        <ProductArt product={product} />
      </Link>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <Badge>{product.franchise.replaceAll("_", " ")}</Badge>
          <Badge>{product.productType.replaceAll("_", " ")}</Badge>
          {product.isLimitedEdition ? <Badge>Limited</Badge> : null}
        </div>
        <div>
          <Link href={`/products/${product.slug}`} className="text-lg font-semibold hover:underline">
            {product.title}
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/60">{product.shortDescription}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold">{formatMoney(product.priceCents, product.currency)}</span>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
