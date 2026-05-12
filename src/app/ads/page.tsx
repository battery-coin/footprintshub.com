import Link from "next/link";
import { AdPackageCard } from "@/components/ads/AdPackageCard";
import { getAdProducts } from "@/lib/ads/ad-products";

export default async function AdsPage() {
  const products = await getAdProducts();
  const featured = products.slice(0, 3);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid min-h-[520px] content-center gap-8 border-b border-black/10 pb-12">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Advertise</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">Buy sponsored placements inside FootprintsHub.</h1>
          <p className="mt-5 text-lg leading-8 text-black/60">
            Promote approved campaigns, creator worlds, fan clubs, products, newsletters, and sponsorships through reviewed internal placements.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/ads/buy" className="rounded-md bg-black px-5 py-3 text-sm font-medium text-white">Buy Ads</Link>
            <Link href="/advertise/policy" className="rounded-md border border-black/15 px-5 py-3 text-sm font-medium">Review Policy</Link>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Featured packages</h2>
            <p className="mt-2 text-black/60">Start with reviewed packages that connect to the same cart and checkout.</p>
          </div>
          <Link href="/advertise/packages" className="text-sm font-medium underline">View all</Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {featured.map((product) => <AdPackageCard key={product.id} product={product} />)}
        </div>
      </section>
    </main>
  );
}
