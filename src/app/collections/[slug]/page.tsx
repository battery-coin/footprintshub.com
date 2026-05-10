import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/lib/catalog/products";
import type { Franchise } from "@/lib/catalog/types";

const labels: Record<string, string> = {
  footprints: "Footprints",
  matrix_decoded: "Matrix Decoded",
  hero_studio: "Hero Studio",
  battery_movement: "Battery Movement",
  digital_unlocks: "Digital Unlocks",
};

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProducts();
  const collectionProducts =
    slug === "digital_unlocks"
      ? products.filter((product) => product.digitalUnlockIncluded)
      : products.filter((product) => product.franchise === (slug as Franchise));

  if (!labels[slug]) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Collection</p>
      <h1 className="mt-3 text-4xl font-semibold">{labels[slug]}</h1>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {collectionProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
