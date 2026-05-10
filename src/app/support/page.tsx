import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Support</p>
      <h1 className="mt-3 text-4xl font-semibold">Support center</h1>
      <p className="mt-4 text-lg leading-8 text-black/60">
        Clear support paths reduce customer confusion while payment, fulfillment, and email integrations are being configured.
      </p>
      <div className="mt-8">
        <Accordion
          items={[
            { title: "Order help", body: "Use your checkout email and order number when asking about a purchase. Customer account order history is scaffolded for the next auth phase." },
            { title: "Refund help", body: "Refunds depend on product type, fulfillment status, digital delivery, preorder timing, and the posted refund policy." },
            { title: "Shipping help", body: "Physical and print-on-demand products require shipping. Digital-only products can skip shipping." },
            { title: "Affiliate help", body: "Affiliate commissions are paid only on qualified purchases and may be held, reversed, or rejected for refunds, chargebacks, fraud, or policy issues." },
          ]}
        />
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/faq">Read FAQ</ButtonLink>
        <ButtonLink href="/contact" variant="secondary">Contact FootprintsHub</ButtonLink>
      </div>
    </main>
  );
}

