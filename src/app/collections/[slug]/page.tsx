import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/lib/catalog/products";
import type { CatalogProduct, Franchise } from "@/lib/catalog/types";

type CollectionConfig = {
  title: string;
  description: string;
  filter: (product: CatalogProduct) => boolean;
};

const franchiseLabels: Record<Franchise, string> = {
  footprints: "Footprints",
  matrix_decoded: "Matrix Decoded",
  hero_studio: "Hero Studio",
  battery_movement: "Battery Movement",
  other: "Other",
};

const collectionAliases: Record<string, string> = {
  "matrix-decoded": "matrix_decoded",
  "hero-studio": "hero_studio",
  "battery-movement": "battery_movement",
  "digital-unlocks": "digital_unlocks",
};

function resolveCollection(slug: string): CollectionConfig | null {
  const normalizedSlug = collectionAliases[slug] ?? slug;

  if (normalizedSlug === "featured-drops") {
    return {
      title: "Featured Drops",
      description: "A curated view of the products currently highlighted across FootprintsHub.",
      filter: (product) => product.isFeatured,
    };
  }

  if (normalizedSlug === "digital_unlocks") {
    return {
      title: "Digital Unlocks",
      description: "Products that include future digital access, registration, or unlock workflows.",
      filter: (product) => product.digitalUnlockIncluded,
    };
  }

  if (normalizedSlug in franchiseLabels) {
    return {
      title: franchiseLabels[normalizedSlug as Franchise],
      description: "Browse products from this FootprintsHub product world.",
      filter: (product) => product.franchise === (normalizedSlug as Franchise),
    };
  }

  return null;
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProducts();
  const collection = resolveCollection(slug);

  if (!collection) {
    notFound();
  }

  const collectionProducts = products.filter(collection.filter);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Collection</p>
      <h1 className="mt-3 text-4xl font-semibold">{collection.title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-black/60">{collection.description}</p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {collectionProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
