export type CommerceModuleName =
  | "catalog"
  | "cart"
  | "checkout"
  | "orders"
  | "payments"
  | "promotions"
  | "inventory"
  | "fulfillment"
  | "customers"
  | "affiliates"
  | "tenancy"
  | "notifications"
  | "admin"
  | "events"
  | "security";

export type CommerceModuleRegistration = {
  name: CommerceModuleName;
  enabled: boolean;
  serverOnly: boolean;
  dependencies: CommerceModuleName[];
  description: string;
};

export const commerceModules: CommerceModuleRegistration[] = [
  {
    name: "tenancy",
    enabled: true,
    serverOnly: true,
    dependencies: [],
    description: "Resolves shop and domain context for every request.",
  },
  {
    name: "catalog",
    enabled: true,
    serverOnly: false,
    dependencies: ["tenancy"],
    description: "Products, variants, categories, collections, channels, and product metadata.",
  },
  {
    name: "cart",
    enabled: true,
    serverOnly: true,
    dependencies: ["tenancy", "catalog", "promotions", "inventory"],
    description: "Guest/customer carts, line items, server totals, and validation.",
  },
  {
    name: "checkout",
    enabled: true,
    serverOnly: true,
    dependencies: ["cart", "payments", "inventory", "orders"],
    description: "Checkout session orchestration and order preparation.",
  },
  {
    name: "payments",
    enabled: true,
    serverOnly: true,
    dependencies: ["tenancy", "events"],
    description: "Provider-neutral payment sessions with Stripe Checkout as the first provider.",
  },
  {
    name: "orders",
    enabled: true,
    serverOnly: true,
    dependencies: ["payments", "inventory", "fulfillment", "events"],
    description: "Order lifecycle, status history, payments, refunds, and fulfillment state.",
  },
  {
    name: "inventory",
    enabled: true,
    serverOnly: true,
    dependencies: ["tenancy", "catalog", "events"],
    description: "Inventory items, stock locations, reservations, deductions, and releases.",
  },
  {
    name: "fulfillment",
    enabled: true,
    serverOnly: true,
    dependencies: ["orders", "inventory"],
    description: "Shipping options, fulfillment records, shipment tracking, and provider hooks.",
  },
  {
    name: "promotions",
    enabled: true,
    serverOnly: true,
    dependencies: ["tenancy", "catalog"],
    description: "Coupon, automatic, campaign, affiliate coupon, and free-shipping rules.",
  },
  {
    name: "customers",
    enabled: true,
    serverOnly: true,
    dependencies: ["tenancy"],
    description: "Customer profiles, addresses, groups, order history, and Hero Studio identity mapping.",
  },
  {
    name: "affiliates",
    enabled: true,
    serverOnly: true,
    dependencies: ["orders", "events", "promotions"],
    description: "Affiliate attribution, 7-level ambassador commissions, wallet ledger, and payouts.",
  },
  {
    name: "notifications",
    enabled: true,
    serverOnly: true,
    dependencies: ["events"],
    description: "Provider-agnostic transactional notification hooks.",
  },
  {
    name: "admin",
    enabled: true,
    serverOnly: false,
    dependencies: ["security", "tenancy"],
    description: "Admin navigation, permission-aware pages, reports, and shop-scoped control panels.",
  },
  {
    name: "events",
    enabled: true,
    serverOnly: true,
    dependencies: [],
    description: "Commerce event outbox and local subscribers.",
  },
  {
    name: "security",
    enabled: true,
    serverOnly: true,
    dependencies: [],
    description: "Admin gating, audit logs, validation, rate-limit strategy, and server-secret boundaries.",
  },
];

export function getCommerceModule(name: CommerceModuleName) {
  const registration = commerceModules.find((entry) => entry.name === name);

  if (!registration) {
    throw new Error(`Unknown commerce module: ${name}`);
  }

  return registration;
}
