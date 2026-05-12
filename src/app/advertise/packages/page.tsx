import { AdPackageCard } from "@/components/ads/AdPackageCard";
import { getAdProducts } from "@/lib/ads/ad-products";

export default async function AdvertisePackagesPage() {
  const products = await getAdProducts();
  const types = Array.from(new Set(products.map((product) => product.productType)));

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Buy ads</p>
        <h1 className="mt-3 text-4xl font-semibold">Ad packages and sponsorships</h1>
        <p className="mt-4 text-lg leading-8 text-black/60">
          Choose a package, add it to cart, and submit creative after verified payment. Every ad is reviewed before it goes live.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {types.map((type) => <span key={type} className="rounded-full border border-black/10 px-3 py-1 text-sm">{type.replaceAll("_", " ")}</span>)}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => <AdPackageCard key={product.id} product={product} />)}
      </div>
    </main>
  );
}
