import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { getProducts } from "@/lib/catalog/products";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.filter((product) => product.isFeatured).slice(0, 4);
  const matrix = products.filter((product) => product.franchise === "matrix_decoded").slice(0, 4);

  return (
    <main>
      <section className="bg-black text-white">
        <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--gold)]">FootprintsHub Commerce</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-normal sm:text-7xl">
              Collectibles, merch, supporter drops, and digital unlocks.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
              A standalone store for Footprints, Matrix Decoded, Hero Studio creator drops, fan club products, booster packs, blind boxes, and future utility checkout.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/shop">
                Shop flagship products <ArrowRight size={16} aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/collections/matrix_decoded" variant="secondary">
                Matrix Decoded
              </ButtonLink>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-white/10 bg-white/5 p-5">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(199,160,87,0.28),transparent_36%),radial-gradient(circle_at_70%_20%,rgba(160,35,52,0.28),transparent_30%)]" />
            <div className="relative grid h-full content-end gap-4">
              {featured.slice(0, 3).map((product) => (
                <div key={product.id} className="rounded-md border border-white/10 bg-black/50 p-4 backdrop-blur">
                  <p className="text-sm text-white/55">{product.franchise.replaceAll("_", " ")}</p>
                  <p className="mt-1 text-xl font-semibold">{product.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading kicker="Featured" title="Footprints supporter products" href="/collections/footprints" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading kicker="Collectors" title="Matrix Decoded drops" href="/collections/matrix_decoded" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {matrix.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        <InfoPanel icon={<Sparkles size={20} />} title="Blind boxes and booster packs">
          Randomized products require published odds and clear assortment rules before paid launch.
        </InfoPanel>
        <InfoPanel icon={<ShieldCheck size={20} />} title="Server-priced checkout">
          Client cart prices are display-only. Stripe line items are recalculated on the server.
        </InfoPanel>
        <InfoPanel icon={<ArrowRight size={20} />} title="Hero Studio bridge">
          Creator shops can later use the same shop, product, order, and webhook architecture.
        </InfoPanel>
      </section>
    </main>
  );
}

function SectionHeading({ kicker, title, href }: { kicker: string; title: string; href: string }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">{kicker}</p>
        <h2 className="mt-2 text-3xl font-semibold">{title}</h2>
      </div>
      <ButtonLink href={href} variant="secondary">
        View collection
      </ButtonLink>
    </div>
  );
}

function InfoPanel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">{icon}</div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-black/60">{children}</p>
    </div>
  );
}
