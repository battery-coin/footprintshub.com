import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/lib/catalog/products";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Shop</p>
        <h1 className="mt-3 text-4xl font-semibold">FootprintsHub flagship catalog</h1>
        <p className="mt-4 text-lg leading-8 text-black/60">
          Supporter bundles, Matrix Decoded collectibles, creator commerce concepts, and future digital unlock products.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
