import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/catalog/products";
import { getAdProductBySlug } from "@/lib/ads/ad-products";

export default async function AdvertisePackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getAdProductBySlug(slug);
  if (!product) notFound();

  const duration = typeof product.metadata?.durationDays === "number" ? product.metadata.durationDays : 30;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section>
          <div className="flex flex-wrap gap-2">
            <Badge>{product.productType.replaceAll("_", " ")}</Badge>
            <Badge>{duration} days</Badge>
            <Badge>Creative review</Badge>
          </div>
          <h1 className="mt-5 text-4xl font-semibold">{product.title}</h1>
          <p className="mt-4 text-lg leading-8 text-black/60">{product.description}</p>
          <div className="mt-8 grid gap-4 rounded-lg border border-black/10 bg-white p-6">
            <h2 className="text-xl font-semibold">What is included</h2>
            <ul className="grid gap-2 text-sm leading-6 text-black/65">
              <li>Reviewed placement package with admin approval before publishing.</li>
              <li>Creative submission after purchase with target URL and notes.</li>
              <li>Basic click tracking when the ad is displayed through FootprintsHub ad slots.</li>
              <li>Refund eligibility depends on review and delivery status.</li>
            </ul>
          </div>
        </section>
        <aside className="h-fit rounded-lg border border-black/10 bg-white p-6">
          <p className="text-sm text-black/55">Package price</p>
          <p className="mt-1 text-3xl font-semibold">{formatMoney(product.priceCents, product.currency)}</p>
          <AddToCartButton product={product} />
          <p className="mt-4 text-xs leading-5 text-black/50">Ads are subject to policy review. No impressions, clicks, conversions, or performance outcomes are guaranteed unless a package expressly says so.</p>
        </aside>
      </div>
    </main>
  );
}
