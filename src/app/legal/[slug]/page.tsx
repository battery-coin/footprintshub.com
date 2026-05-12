import { notFound } from "next/navigation";

const pages: Record<string, { title: string; body: string[] }> = {
  terms: {
    title: "Terms of Sale",
    body: [
      "These terms establish the working commerce rules for FootprintsHub and require final legal review before high-volume public launch.",
      "Products are sold as merchandise, collectibles, memberships, digital goods, or supporter bundles. No product is offered as an investment.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "Customer data is used to process orders, support accounts, fulfill products, detect fraud, and provide service updates.",
      "Production launch requires a full privacy policy covering analytics, payments, email, cookies, data retention, and user rights.",
    ],
  },
  refunds: {
    title: "Refund Policy",
    body: [
      "Refund terms must be finalized before accepting payment. Physical products, digital goods, memberships, preorders, and randomized collectibles may need separate rules.",
      "Refunds, partial refunds, chargebacks, and failed fulfillment may reverse discounts, loyalty credits, store credit adjustments, and affiliate or ambassador commissions.",
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
      "Secure download links may be tokenized, limited by download count, and expire after the purchase window shown on the product page.",
      "Customers may not redistribute private files, license keys, download URLs, or protected digital access unless a written license allows it.",
    ],
  },
  subscriptions: {
    title: "Subscription Terms",
    body: [
      "Subscription products renew on the billing interval shown at checkout and are processed through Stripe Billing when recurring payment is enabled.",
      "Trials, failed payments, cancellation timing, and access revocation depend on the posted product terms and verified Stripe subscription status.",
      "Customers should cancel before the renewal date when they do not want future recurring access.",
    ],
  },
  services: {
    title: "Service Product Terms",
    body: [
      "Service products may require a customer brief, scheduling, delivery windows, revision limits, and a defined scope of work.",
      "Refunds or cancellations may depend on scheduling status, work already performed, custom deliverables, and the posted service terms.",
      "Customers are responsible for providing accurate information needed to deliver the service.",
    ],
  },
  "nft-digital-collectibles": {
    title: "NFT-Linked Digital Collectibles",
    body: [
      "NFT-linked products may represent a digital collectible, certificate, access credential, claim code, provenance record, or digital twin.",
      "NFT-linked products are not sold as investments and do not promise resale value, price appreciation, profit, ROI, yield, or financial return.",
      "Blockchain transactions, wallet use, marketplace rules, network fees, and customer tax obligations may involve risks and may be irreversible.",
      "Automatic minting is disabled unless secure wallet, signing, legal, and operational controls are reviewed and enabled.",
    ],
  },
  "membership-terms": {
    title: "Membership Terms",
    body: [
      "Membership products provide access to specified content, perks, services, or community features for the period shown at checkout.",
      "Access may end or be revoked when a membership expires, is canceled, is unpaid, violates policy, or is refunded.",
      "Membership benefits are not investments, financial products, income opportunities, or resale-value promises.",
    ],
  },
  "download-license": {
    title: "Download License",
    body: [
      "Digital downloads are licensed for the permitted customer use shown on the product page or receipt.",
      "Unauthorized copying, resale, sharing, scraping, public reposting, or redistribution of protected downloads is not allowed.",
      "Download access can be limited, revoked, or reviewed for fraud, abuse, refunds, chargebacks, or policy violations.",
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
  "gift-vouchers": {
    title: "Gift Voucher Terms",
    body: [
      "Gift vouchers are store value for eligible purchases and are not cash, investments, or financial products.",
      "Voucher balances, expiration, refunds, and transfer rules must be finalized before public launch.",
    ],
  },
  "store-credit": {
    title: "Store Credit Terms",
    body: [
      "Store credit may be issued for refunds, promotions, wallet conversion, or manual adjustments when approved.",
      "Store credit has no cash value unless a written policy says otherwise and must be tracked through a ledger.",
    ],
  },
  loyalty: {
    title: "Loyalty Terms",
    body: [
      "Loyalty points are promotional rewards, not money, securities, investments, yield, or guaranteed benefits.",
      "Points may expire, be reversed for refunds or abuse, and may be changed or discontinued by the shop.",
    ],
  },
  reviews: {
    title: "Product Review Policy",
    body: [
      "Reviews may be moderated for spam, fraud, abuse, private information, illegal content, or misleading claims.",
      "Product reviews must not make investment, resale-value, medical, or guaranteed-outcome claims.",
    ],
  },
  returns: {
    title: "Returns Policy",
    body: [
      "Return eligibility depends on product type, fulfillment status, delivery timing, digital access, preorder status, and posted policy.",
      "Approved returns may result in refund, replacement, or store credit depending on the final public policy.",
    ],
  },
  "digital-downloads": {
    title: "Digital Downloads Terms",
    body: [
      "Digital download access may have download limits, expiration, account requirements, and fraud controls.",
      "Digital products and downloads provide access or collectible utility only and do not promise profit, ROI, yield, resale value, or appreciation.",
    ],
  },
  "payment-authorization": {
    title: "Payment Authorization",
    body: [
      "Checkout sessions, payment authorization, capture, cancellation, and refund timing depend on the payment provider and final store policy.",
      "FootprintsHub does not store raw card data. Payment credentials are handled by approved payment providers such as Stripe Checkout.",
    ],
  },
  "creator-shop-responsibility": {
    title: "Creator Shop Responsibility",
    body: [
      "Future creator shops are responsible for accurate product descriptions, lawful marketing, fulfillment promises, refund rules, and required disclosures for their products and campaigns.",
      "The platform may suspend products, shops, affiliate activity, or payouts for fraud, policy violations, legal risk, chargebacks, or customer harm.",
    ],
  },
  "printful-fulfillment": {
    title: "Printful Fulfillment",
    body: [
      "Print-on-demand products may be produced by Printful or another approved fulfillment provider after verified payment and product mapping review.",
      "Production, shipping, replacement, and cancellation timing may differ from in-stock products. Customers should review product pages and shipping policy before checkout.",
      "If Printful is not configured or a product mapping fails, the order may require manual fulfillment review before production starts.",
    ],
  },
  "crypto-payments": {
    title: "Crypto Payment Terms",
    body: [
      "Crypto checkout is disabled unless the store explicitly enables a reviewed provider integration.",
      "Any future Battery Coin or Coinbase checkout option is for approved utility payment only and is not an investment, yield, staking, resale, or profit opportunity.",
      "Refunds, overpayments, underpayments, network fees, exchange-rate differences, and chargeback-like disputes require separate provider-specific policy before launch.",
    ],
  },
  "advertising-terms": {
    title: "Advertising Terms",
    body: [
      "FootprintsHub ad products are reviewed internal placements, sponsorships, promotions, and campaign features. They are not a programmatic ad exchange.",
      "All ads are subject to approval before publishing. The platform may reject, pause, remove, or request changes to creative at any time for policy, legal, security, or brand reasons.",
      "Ad purchases do not guarantee impressions, clicks, conversions, sales, audience growth, or performance unless a package expressly promises a specific deliverable.",
    ],
  },
  "sponsorship-terms": {
    title: "Sponsorship Terms",
    body: [
      "Sponsorship packages may include reviewed placements, mentions, event support, creator or fan-club features, or campaign promotion.",
      "Sponsors are responsible for accurate claims, lawful creative, rights to submitted assets, and compliance with platform policy.",
    ],
  },
  "ad-content-policy": {
    title: "Ad Content Policy",
    body: [
      "Ads may not promote illegal products or services, misleading claims, harassment, hate, explicit adult content, unreviewed weapons or drug claims, false financial claims, or unsubstantiated medical claims.",
      "HTML ads are disabled by default unless reviewed and sanitized. Unsafe target URLs such as javascript: or data: URLs are rejected.",
    ],
  },
  "ad-refunds": {
    title: "Ad Refund Terms",
    body: [
      "Ad refunds depend on review, scheduling, delivery, and campaign status. Not-yet-reviewed or rejected ads may be eligible for refund or creative resubmission.",
      "Live or completed ads may be partially refundable or non-refundable depending on delivery status and the posted package terms.",
      "Affiliate commissions on ad purchases may be reversed for refunds, chargebacks, rejected campaigns, or cancelled ad delivery.",
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
