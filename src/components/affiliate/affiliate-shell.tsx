import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  ["/affiliate/dashboard", "Dashboard"],
  ["/affiliate/links", "Links"],
  ["/affiliate/commissions", "Commissions"],
  ["/affiliate/payouts", "Payouts"],
  ["/affiliate/wallet", "Wallet"],
  ["/affiliate/coupons", "Coupons"],
  ["/affiliate/assets", "Assets"],
  ["/affiliate/resources", "Resources"],
  ["/affiliate/reports", "Reports"],
  ["/affiliate/team", "Network"],
  ["/affiliate/settings", "Settings"],
];

export function AffiliateShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[230px_1fr] lg:px-8">
      <aside className="h-fit rounded-lg border border-black/10 bg-white p-4">
        <p className="px-2 text-sm font-semibold uppercase tracking-[0.18em] text-black/45">Affiliate</p>
        <nav className="mt-4 grid gap-1">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm hover:bg-black/5">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section>{children}</section>
    </main>
  );
}
