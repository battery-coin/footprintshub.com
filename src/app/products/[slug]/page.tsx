import { notFound } from "next/navigation";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductCard } from "@/components/product/product-card";
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

  const related = (await getProducts())
    .filter((item) => item.id !== product.id && item.franchise === product.franchise)
    .slice(0, 4);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://footprintshub.com";
  const productUrl = `${siteUrl}/products/${product.slug}`;

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="grid gap-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-black">
            <ProductArt product={product} priority />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(product.galleryUrls.length ? product.galleryUrls : [product.imageUrl, product.imageUrl, product.imageUrl]).slice(0, 3).map((_, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-md bg-black">
                <ProductArt product={product} />
              </div>
            ))}
          </div>
        </div>
        <div className="self-center">
          <div className="flex flex-wrap gap-2">
            <Badge>{product.franchise.replaceAll("_", " ")}</Badge>
            <Badge>{product.productType.replaceAll("_", " ")}</Badge>
            {product.isFeatured ? <Badge>Featured</Badge> : null}
            {product.isLimitedEdition ? <Badge>Limited</Badge> : null}
            {product.preorderStatus ? <Badge>Preorder</Badge> : null}
            {product.digitalUnlockIncluded ? <Badge>Digital unlock</Badge> : null}
            {!product.requiresShipping ? <Badge>Digital delivery</Badge> : null}
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
          <div className="mt-8">
            <Accordion
              items={[
                {
                  title: "What you get",
                  body: product.shortDescription ?? "A FootprintsHub product prepared for the current flagship store and future creator-shop catalog.",
                },
                {
                  title: "Shipping and fulfillment",
                  body: product.requiresShipping
                    ? "This item requires shipping details at checkout. Print-on-demand products may enter fulfillment review after verified payment."
                    : "This item is digital or service-based and does not require shipping unless bundled with physical products.",
                },
                {
                  title: "Refund and policy notes",
                  body: "Refund eligibility depends on product type, fulfillment status, digital access, preorder status, and the posted refund policy.",
                },
                {
                  title: "Affiliate share link",
                  body: `Ambassadors can append ?ref=CODE to this product URL: ${productUrl}`,
                },
              ]}
            />
          </div>
        </div>
      </section>
      {related.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Related</p>
              <h2 className="mt-2 text-3xl font-semibold">More from this world</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
