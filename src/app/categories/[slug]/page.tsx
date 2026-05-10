import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/lib/catalog/products";

const categoryMap: Record<string, string> = {
  footprints: "footprints",
  "matrix-decoded": "matrix_decoded",
  "hero-studio": "hero_studio",
  "battery-movement": "battery_movement",
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const franchise = categoryMap[slug];

  if (!franchise) {
    notFound();
  }

  const products = (await getProducts()).filter((product) => product.franchise === franchise);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold capitalize">{slug.replaceAll("-", " ")}</h1>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
