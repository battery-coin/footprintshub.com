import { AffiliateApplyForm } from "./affiliate-apply-form";

export default function AffiliateApplyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Affiliate application</p>
      <h1 className="mt-3 text-4xl font-semibold">Become a FootprintsHub ambassador</h1>
      <p className="mt-4 text-base leading-7 text-black/60">
        Apply to share qualified products and earn commissions on approved purchases. No commissions are paid for recruitment alone.
      </p>
      <AffiliateApplyForm />
    </main>
  );
}
