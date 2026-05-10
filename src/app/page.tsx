import { ArrowRight, BadgeDollarSign, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Accordion } from "@/components/ui/accordion";
import { ProductCard } from "@/components/product/product-card";
import { ProductArt } from "@/components/product/product-art";
import { ButtonLink } from "@/components/ui/button";
import { Timeline } from "@/components/ui/timeline";
import { getProducts } from "@/lib/catalog/products";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.filter((product) => product.isFeatured).slice(0, 4);
  const footprints = products.filter((product) => product.franchise === "footprints").slice(0, 4);
  const matrix = products.filter((product) => product.franchise === "matrix_decoded").slice(0, 4);
  const heroStudio = products.filter((product) => product.franchise === "hero_studio").slice(0, 4);

  return (
    <main>
      <section className="bg-black text-white">
        <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--gold)]">FootprintsHub Commerce</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-normal sm:text-7xl">FootprintsHub</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
              Premium supporter bundles, Matrix Decoded collectibles, creator merch concepts, and digital unlock products in one clean checkout.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/shop">
                Shop Featured Drops <ArrowRight size={16} aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/affiliate/apply" variant="secondary">
                Become an Affiliate
              </ButtonLink>
            </div>
          </div>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              {featured.slice(0, 4).map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className={`overflow-hidden rounded-lg border border-white/10 bg-white/5 ${index === 0 ? "col-span-2" : ""}`}
                >
                  <div className={index === 0 ? "aspect-[2/1]" : "aspect-square"}>
                    <ProductArt product={product} priority={index === 0} />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">{product.productType.replaceAll("_", " ")}</p>
                    <p className="mt-1 font-semibold">{product.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading kicker="Featured" title="Featured products" href="/collections/featured-drops" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading kicker="Footprints" title="Supporter bundles and choir packs" href="/collections/footprints" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {footprints.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading kicker="Collectors" title="Matrix Decoded drops" href="/collections/matrix_decoded" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {matrix.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
      </section>

      <section className="bg-black text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--gold)]">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold">Simple for customers, structured for the platform.</h2>
            <p className="mt-4 text-sm leading-7 text-white/65">
              FootprintsHub keeps the first customer journey calm while preserving the architecture needed for Hero Studio creator shops.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white p-6 text-black">
            <Timeline
              items={[
                { title: "Choose a product", detail: "Browse physical merch, digital unlocks, supporter bundles, collectibles, and creator-store products." },
                { title: "Checkout securely", detail: "Stripe Checkout is created server-side after cart prices, product status, inventory, and terms are validated." },
                { title: "Receive physical or digital items", detail: "Physical orders move into fulfillment review. Digital unlocks can be granted after verified payment." },
                { title: "Support creator worlds", detail: "Future Hero Studio shops can use the same shop, product, affiliate, order, and event architecture." },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        <InfoPanel icon={<PackageCheck size={20} />} title="Smart product types">
          Product badges identify limited drops, preorders, digital goods, print-on-demand items, blind boxes, booster packs, and founder products.
        </InfoPanel>
        <InfoPanel icon={<ShieldCheck size={20} />} title="Server-priced checkout">
          Client cart prices are display-only. Stripe line items are recalculated on the server before payment.
        </InfoPanel>
        <InfoPanel icon={<Sparkles size={20} />} title="Hero Studio ready">
          Creator shops can later use the same tenant-aware commerce engine on marketplace and subdomain storefronts.
        </InfoPanel>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Ambassadors</p>
            <h2 className="mt-3 text-3xl font-semibold">Earn commissions on qualified purchases.</h2>
            <p className="mt-4 text-sm leading-7 text-black/62">
              The affiliate program is purchase-based, capped, auditable, and designed for transparent creator and fan ambassador relationships.
            </p>
            <div className="mt-6">
              <ButtonLink href="/affiliate/apply">
                Apply to Become an Ambassador <BadgeDollarSign size={16} aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {heroStudio.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">FAQ</p>
        <h2 className="mt-3 text-3xl font-semibold">Quick answers before checkout</h2>
        <div className="mt-8">
          <Accordion
            items={[
              {
                title: "How does shipping work?",
                body: "Physical products require shipping details at checkout. Print-on-demand products may show production or setup-required status in admin until Printful credentials are configured.",
              },
              {
                title: "Can digital-only products skip shipping?",
                body: "Yes. Digital goods and unlock products are modeled separately so shipping can be skipped when every item in the cart is digital.",
              },
              {
                title: "How do refunds affect commissions?",
                body: "Refunds and chargebacks can reverse direct and multi-tier affiliate commissions. Commission records stay ledger-based for auditability.",
              },
              {
                title: "Are blind boxes ready to sell?",
                body: "Randomized products must publish odds, assortment rules, refund rules, and purchase limits before public launch.",
              },
              {
                title: "Can creators use this later?",
                body: "Yes. The commerce model is shop-aware so Hero Studio can map marketplace and creator subdomains to separate shop records later.",
              },
            ]}
          />
        </div>
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

function InfoPanel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">{icon}</div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-black/60">{children}</p>
    </div>
  );
}
