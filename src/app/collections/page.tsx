import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductArt } from "@/components/product/product-art";
import { getProducts } from "@/lib/catalog/products";

export default async function CollectionsPage() {
  const products = await getProducts();
  const groups = Array.from(
    products.reduce((map, product) => {
      const existing = map.get(product.franchise) ?? [];
      existing.push(product);
      map.set(product.franchise, existing);
      return map;
    }, new Map<string, typeof products>()),
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Collections</p>
        <h1 className="mt-3 text-4xl font-semibold">Shop by product world</h1>
        <p className="mt-4 text-lg leading-8 text-black/60">
          Footprints supporter drops, Matrix Decoded collectibles, and Hero Studio creator-shop concepts are grouped so customers can browse without friction.
        </p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {groups.map(([slug, items]) => (
          <Link key={slug} href={`/collections/${slug}`} className="overflow-hidden rounded-lg border border-black/10 bg-white">
            <div className="aspect-[4/3] bg-black">
              {items[0] ? <ProductArt product={items[0]} /> : null}
            </div>
            <div className="p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-black/45">{items.length} products</p>
              <h2 className="mt-2 text-2xl font-semibold capitalize">{slug.replaceAll("_", " ")}</h2>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
                View collection <ArrowRight size={15} aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

