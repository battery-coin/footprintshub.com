import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductArt } from "@/components/product/product-art";
import { formatMoney, getProductBySlug, getProducts } from "@/lib/catalog/products";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="aspect-square overflow-hidden rounded-lg bg-black">
        <ProductArt product={product} priority />
      </div>
      <div className="self-center">
        <div className="flex flex-wrap gap-2">
          <Badge>{product.franchise.replaceAll("_", " ")}</Badge>
          <Badge>{product.productType.replaceAll("_", " ")}</Badge>
          {product.isLimitedEdition ? <Badge>Limited edition</Badge> : null}
          {product.digitalUnlockIncluded ? <Badge>Digital unlock</Badge> : null}
        </div>
        <h1 className="mt-5 text-4xl font-semibold">{product.title}</h1>
        {product.subtitle ? <p className="mt-3 text-xl text-black/60">{product.subtitle}</p> : null}
        <p className="mt-6 text-3xl font-semibold">{formatMoney(product.priceCents, product.currency)}</p>
        <p className="mt-6 text-base leading-8 text-black/68">{product.description}</p>
        {product.productType === "blind_box" || product.productType === "booster_pack" ? (
          <div className="mt-6 rounded-lg border border-[var(--accent)]/25 bg-white p-4 text-sm leading-6 text-black/65">
            Published odds and assortment rules are required before this randomized collectible can be sold publicly.
          </div>
        ) : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <AddToCartButton product={product} />
        </div>
      </div>
    </main>
  );
}
