import { notFound } from "next/navigation";

const pages: Record<string, { title: string; body: string[] }> = {
  terms: {
    title: "Terms of Sale",
    body: [
      "These terms are placeholders for early commerce planning and require legal review before public launch.",
      "Products are sold as merchandise, collectibles, memberships, digital goods, or supporter bundles. No product is offered as an investment.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "This placeholder explains that customer data will be used to process orders, support accounts, fulfill products, and provide service updates.",
      "Production launch requires a full privacy policy covering analytics, payments, email, cookies, data retention, and user rights.",
    ],
  },
  refunds: {
    title: "Refund Policy",
    body: [
      "Refund terms must be finalized before accepting payment. Physical products, digital goods, memberships, preorders, and randomized collectibles may need separate rules.",
    ],
  },
  shipping: {
    title: "Shipping Policy",
    body: [
      "Shipping timelines must be based on real fulfillment capacity. Do not publish estimated dates until supplier and fulfillment rules are confirmed.",
    ],
  },
  preorders: {
    title: "Preorder Terms",
    body: [
      "Preorder products must clearly state estimated timing, cancellation rules, refund eligibility, and what happens if production changes.",
    ],
  },
  "fan-club-disclaimer": {
    title: "Fan Club Disclaimer",
    body: [
      "Fan club products must clearly identify whether a club, creator, character, brand, or campaign is official, partner-operated, or community-operated.",
    ],
  },
  "digital-goods": {
    title: "Digital Goods Terms",
    body: [
      "Digital goods and unlocks provide access, utility, or collectible features. They do not promise profit, resale value, yield, or financial return.",
    ],
  },
};

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = pages[slug];

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Legal</p>
      <h1 className="mt-3 text-4xl font-semibold">{page.title}</h1>
      <div className="mt-8 space-y-5 text-base leading-8 text-black/68">
        {page.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
