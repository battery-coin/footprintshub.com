import { Mail, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Contact</p>
      <h1 className="mt-3 text-4xl font-semibold">Need help with FootprintsHub?</h1>
      <p className="mt-4 text-lg leading-8 text-black/60">
        For launch readiness, use the support path below. Production email delivery can later connect through Resend, SendGrid, SMTP, or SiteGround mail.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <Mail size={24} aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold">Customer support</h2>
          <p className="mt-2 text-sm leading-6 text-black/60">
            Use this route for order questions, refund policy questions, shipping questions, and digital-good access.
          </p>
          <div className="mt-5">
            <ButtonLink href="/support">Open support center</ButtonLink>
          </div>
        </Card>
        <Card>
          <MessageCircle size={24} aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold">Affiliate questions</h2>
          <p className="mt-2 text-sm leading-6 text-black/60">
            Ambassadors can review program rules, disclosure requirements, and application status from the affiliate area.
          </p>
          <div className="mt-5">
            <ButtonLink href="/affiliate">Affiliate center</ButtonLink>
          </div>
        </Card>
      </div>
    </main>
  );
}

