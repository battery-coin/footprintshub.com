import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  ["/admin", "Overview"],
  ["/admin/products", "Products"],
  ["/admin/products/new", "New product"],
  ["/admin/categories", "Categories"],
  ["/admin/collections", "Collections"],
  ["/admin/orders", "Orders"],
  ["/admin/refunds", "Refunds"],
  ["/admin/returns", "Returns"],
  ["/admin/inventory", "Inventory"],
  ["/admin/printful", "Printful"],
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
  ["/admin/settings", "Settings"],
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <main id="admin-top" className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl gap-8 overflow-visible px-4 py-10 pb-24 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
      <aside className="h-fit rounded-lg border border-black/10 bg-white p-4 lg:sticky lg:top-24">
        <p className="px-2 text-sm font-semibold uppercase tracking-[0.18em] text-black/45">Admin</p>
        <nav className="mt-4 grid max-h-[70vh] gap-1 overflow-y-auto pr-1">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm hover:bg-black/5">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="min-w-0 overflow-visible">{children}</section>
    </main>
  );
}
