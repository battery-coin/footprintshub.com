import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">FAQ</p>
      <h1 className="mt-3 text-4xl font-semibold">Frequently asked questions</h1>
      <div className="mt-8">
        <Accordion
          items={[
            { title: "What can I buy here?", body: "FootprintsHub supports physical products, digital products, creator merch, memberships, blind box concepts, booster pack concepts, and founder/supporter bundles." },
            { title: "Is checkout secure?", body: "Stripe Checkout is created server-side after product and cart validation. FootprintsHub does not store raw card data." },
            { title: "Can I become an ambassador?", body: "Yes. The application flow is available, and commissions are limited to qualified purchases with disclosure, fraud controls, and refund reversals." },
            { title: "Are blind boxes live?", body: "Randomized products need published odds and clear assortment rules before paid public sales." },
            { title: "How will Hero Studio connect later?", body: "Creator subdomains can map to shop records through Cloudflare wildcard DNS and the shop-domain resolver." },
          ]}
        />
      </div>
      <div className="mt-8">
        <ButtonLink href="/shop">Shop products</ButtonLink>
      </div>
    </main>
  );
}

