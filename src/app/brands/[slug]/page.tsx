export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Brand</h1>
      <p className="mt-2 font-mono text-sm text-black/50">{slug}</p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
        Brand/manufacturer landing pages will list shop-scoped products assigned through the `Brand` relation.
      </p>
    </main>
  );
}
