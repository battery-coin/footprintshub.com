import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

export default function AffiliateApplyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Affiliate application</p>
      <h1 className="mt-3 text-4xl font-semibold">Become a FootprintsHub ambassador</h1>
      <p className="mt-4 text-base leading-7 text-black/60">
        Apply to share qualified products and earn commissions on approved purchases. No commissions are paid for recruitment alone.
      </p>
      <form className="mt-8 grid gap-4 rounded-lg border border-black/10 bg-white p-5">
        <Input name="name" placeholder="Display name" />
        <Input name="email" type="email" placeholder="Email" />
        <Input name="phone" placeholder="Phone, optional" />
        <Textarea name="notes" placeholder="Tell us how you plan to share FootprintsHub products" />
        <label className="flex gap-3 text-sm leading-6 text-black/65">
          <input type="checkbox" className="mt-1" required />
          I understand commissions are paid only on qualified purchases and that public affiliate disclosure is required.
        </label>
        <Button type="button">Submit application placeholder</Button>
      </form>
    </main>
  );
}
