import Link from "next/link";
import type { ReactNode } from "react";
import { AccessDenied } from "@/components/auth/AccessDenied";
import { getCurrentPermissionContext } from "@/lib/auth/current-user";
import { getPermissions, hasPermission, type PermissionKey } from "@/lib/auth/permissions";

const links: Array<{ href: string; label: string; permission: PermissionKey }> = [
  { href: "/admin", label: "Overview", permission: "canViewAdmin" },
  { href: "/admin/products", label: "Products", permission: "canManageProducts" },
  { href: "/admin/products/new", label: "New product", permission: "canManageProducts" },
  { href: "/admin/digital-assets", label: "Digital assets", permission: "canManageDigitalAssets" },
  { href: "/admin/services", label: "Services", permission: "canManageFulfillment" },
  { href: "/admin/subscriptions", label: "Subscriptions", permission: "canManageSubscriptions" },
  { href: "/admin/nfts", label: "Digital collectibles", permission: "canManageNFTProducts" },
  { href: "/admin/ads", label: "Ads", permission: "canManageAds" },
  { href: "/admin/categories", label: "Categories", permission: "canManageCatalog" },
  { href: "/admin/collections", label: "Collections", permission: "canManageCatalog" },
  { href: "/admin/orders", label: "Orders", permission: "canViewOrders" },
  { href: "/admin/refunds", label: "Refunds", permission: "canManageRefunds" },
  { href: "/admin/returns", label: "Returns", permission: "canManageRefunds" },
  { href: "/admin/inventory", label: "Inventory", permission: "canManageInventory" },
  { href: "/admin/printful", label: "Printful", permission: "canManagePrintful" },
  { href: "/admin/fulfillment", label: "Fulfillment", permission: "canManageFulfillment" },
  { href: "/admin/shipping-options", label: "Shipping options", permission: "canManageFulfillment" },
  { href: "/admin/promotions", label: "Promotions", permission: "canManagePricing" },
  { href: "/admin/sales-channels", label: "Sales channels", permission: "canManageShopSettings" },
  { href: "/admin/regions", label: "Regions", permission: "canManageTax" },
  { href: "/admin/shops", label: "Shops", permission: "canManageRoles" },
  { href: "/admin/discounts", label: "Discounts", permission: "canManagePricing" },
  { href: "/admin/shipping", label: "Shipping", permission: "canManageFulfillment" },
  { href: "/admin/tax", label: "Tax", permission: "canManageTax" },
  { href: "/admin/customers", label: "Customers", permission: "canManageCustomers" },
  { href: "/admin/affiliates", label: "Affiliates", permission: "canViewAffiliateReports" },
  { href: "/admin/events", label: "Events", permission: "canManageSecurity" },
  { href: "/admin/audit-logs", label: "Audit logs", permission: "canViewAuditLogs" },
  { href: "/admin/security", label: "Security", permission: "canManageSecurity" },
  { href: "/admin/settings", label: "Settings", permission: "canManageShopSettings" },
  { href: "/admin/settings/payments/mixed", label: "Payment ratios", permission: "canManageFunds" },
  { href: "/admin/settings/tokens", label: "Token assets", permission: "canManageFunds" },
  { href: "/admin/payments/token", label: "Token reviews", permission: "canManageFunds" },
  { href: "/owner/roles", label: "Owner roles", permission: "canManageRoles" },
  { href: "/owner/audit-logs", label: "Owner audit logs", permission: "canViewAuditLogs" },
];

export async function AdminShell({ children, requiredPermission = "canViewAdmin" }: { children: ReactNode; requiredPermission?: PermissionKey }) {
  const context = await getCurrentPermissionContext();
  const permissions = getPermissions(context);
  const visibleLinks = links.filter((link) => permissions[link.permission]);

  if (!hasPermission(context, requiredPermission)) {
    return <AccessDenied requiredPermission={requiredPermission} currentRoles={context.roles ?? []} />;
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
      <aside className="h-fit rounded-lg border border-black/10 bg-white p-4">
        <p className="px-2 text-sm font-semibold uppercase tracking-[0.18em] text-black/45">Admin</p>
        <nav className="mt-4 grid gap-1">
          {visibleLinks.map(({ href, label }) => (
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
