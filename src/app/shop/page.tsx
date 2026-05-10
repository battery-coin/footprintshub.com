import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/lib/catalog/products";

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const products = await getProducts();
  const query = readParam(params.q)?.trim().toLowerCase() ?? "";
  const franchise = readParam(params.franchise) ?? "all";
  const type = readParam(params.type) ?? "all";
  const sort = readParam(params.sort) ?? "featured";
  const franchises = Array.from(new Set(products.map((product) => product.franchise))).sort();
  const types = Array.from(new Set(products.map((product) => product.productType))).sort();
  const visibleProducts = products
    .filter((product) => {
      const matchesQuery =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.franchise.toLowerCase().includes(query);
      const matchesFranchise = franchise === "all" || product.franchise === franchise;
      const matchesType = type === "all" || product.productType === type;
      return matchesQuery && matchesFranchise && matchesType;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.priceCents - b.priceCents;
      if (sort === "price-desc") return b.priceCents - a.priceCents;
      if (sort === "newest") return b.id.localeCompare(a.id);
      return Number(b.isFeatured) - Number(a.isFeatured) || a.title.localeCompare(b.title);
    });

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Shop</p>
        <h1 className="mt-3 text-4xl font-semibold">FootprintsHub flagship catalog</h1>
        <p className="mt-4 text-lg leading-8 text-black/60">
          Supporter bundles, Matrix Decoded collectibles, creator commerce concepts, and future digital unlock products.
        </p>
      </div>
      <form className="mt-8 grid gap-3 rounded-lg border border-black/10 bg-white p-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <Input name="q" placeholder="Search products" defaultValue={query} aria-label="Search products" />
        <select name="franchise" defaultValue={franchise} className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm">
          <option value="all">All collections</option>
          {franchises.map((item) => (
            <option key={item} value={item}>
              {item.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <select name="type" defaultValue={type} className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm">
          <option value="all">All product types</option>
          {types.map((item) => (
            <option key={item} value={item}>
              {item.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm">
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price low to high</option>
          <option value="price-desc">Price high to low</option>
        </select>
        <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white md:col-start-4">Apply filters</button>
      </form>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {visibleProducts.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No products match those filters"
            description="Try a broader search, switch collections, or return to all featured products."
            actionHref="/shop"
            actionLabel="Reset filters"
          />
        </div>
      ) : null}
    </main>
  );
}
