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
  "blind-box-odds": {
    title: "Blind Box Odds",
    body: [
      "Blind box and booster pack products must publish assortment details and odds before paid randomized sales begin.",
      "Randomized collectibles should be described as merchandise, game utility, or collectible entertainment, not as gambling, investment, or resale-value products.",
      "Each product page should identify rarity tiers, possible items, purchase limits, refund rules, and whether digital unlocks are included.",
    ],
  },
  "affiliate-terms": {
    title: "Affiliate Terms",
    body: [
      "The FootprintsHub affiliate and ambassador program pays commissions only on qualified purchases of real products, memberships, campaign items, digital goods, creator shop purchases, or approved commercial transactions.",
      "No commission is earned merely for recruiting or enrolling another affiliate. There are no guaranteed earnings, income promises, investment returns, employment relationship, or business opportunity claims.",
      "Commissions may be held, rejected, reversed, capped, or adjusted for fraud, self-referrals, refunds, chargebacks, product exclusions, policy violations, or manual compliance review.",
      "Affiliates are responsible for accurate payout details, taxes, lawful marketing practices, and accepting current program terms before receiving payouts.",
    ],
  },
  "affiliate-disclosure": {
    title: "Affiliate Disclosure",
    body: [
      "Affiliates, creators, and fan ambassadors must clearly disclose when they may receive a commission or store credit from a link, coupon, product card, post, livestream, campaign, or recommendation.",
      "Disclosures must be easy to notice and understand. Do not hide affiliate disclosures in vague hashtags, small print, profile-only text, or long legal paragraphs.",
      "Affiliates may describe products as collectibles, merchandise, supporter bundles, memberships, access, or digital unlocks, but must not make investment, profit, ROI, resale value, income, or lifestyle claims.",
    ],
  },
  "ambassador-program-rules": {
    title: "Ambassador Program Rules",
    body: [
      "The ambassador network can support up to seven configurable commission levels, but it is not a recruiting-income program. All paid commissions must be tied to qualified purchases.",
      "Level 0 is the direct referring affiliate. Levels 1 through 7 are ancestor ambassadors in the referral network when the shop owner enables them and sets transparent commission rules.",
      "The program blocks self-referrals by default, supports payout holds, requires refund and chargeback reversals, enforces commission caps, and keeps an audit log of commission and payout decisions.",
      "Mandatory purchases, pay-to-join fees, starter kits, inventory loading, recruiting-only compensation, and earnings claims require separate legal review before any public launch.",
    ],
  },
  "income-disclaimer": {
    title: "Income Disclaimer",
    body: [
      "FootprintsHub does not guarantee affiliate, ambassador, creator, fan, store credit, or payout earnings.",
      "Commissions are available only on qualified purchases and remain subject to eligibility, approval, hold periods, caps, fraud review, refund reversal, chargeback reversal, and program changes.",
      "The ambassador program is not an investment, employment relationship, franchise, business opportunity, passive income promise, or recruiting-income plan.",
      "Affiliates must not make income claims, lifestyle claims, profit claims, ROI claims, resale-value claims, or financial-return claims when promoting FootprintsHub, Hero Studio, creator shops, collectibles, memberships, or digital goods.",
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
