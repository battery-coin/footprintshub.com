import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  ["/admin", "Overview"],
  ["/admin/products", "Products"],
  ["/admin/products/new", "New product"],
  ["/admin/categories", "Categories"],
  ["/admin/collections", "Collections"],
  ["/admin/orders", "Orders"],
  ["/admin/inventory", "Inventory"],
  ["/admin/fulfillment", "Fulfillment"],
  ["/admin/shipping-options", "Shipping options"],
  ["/admin/promotions", "Promotions"],
  ["/admin/sales-channels", "Sales channels"],
  ["/admin/regions", "Regions"],
  ["/admin/shops", "Shops"],
  ["/admin/discounts", "Discounts"],
  ["/admin/shipping", "Shipping"],
  ["/admin/tax", "Tax"],
  ["/admin/customers", "Customers"],
  ["/admin/affiliates", "Affiliates"],
  ["/admin/events", "Events"],
  ["/admin/audit-logs", "Audit logs"],
  ["/admin/security", "Security"],
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
      <aside className="h-fit rounded-lg border border-black/10 bg-white p-4">
        <p className="px-2 text-sm font-semibold uppercase tracking-[0.18em] text-black/45">Admin</p>
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
