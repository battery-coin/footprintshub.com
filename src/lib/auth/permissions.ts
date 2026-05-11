export const appRoles = [
  "owner",
  "admin_products",
  "catalog_manager",
  "order_manager",
  "refund_manager",
  "finance_manager",
  "payout_approver",
  "affiliate_manager",
  "affiliate_analyst",
  "ads_manager",
  "sponsor_manager",
  "printful_manager",
  "fulfillment_manager",
  "inventory_manager",
  "tax_manager",
  "subscription_manager",
  "digital_asset_manager",
  "nft_manager",
  "customer_manager",
  "support_agent",
  "content_moderator",
  "security_manager",
  "analyst",
  "shop_owner",
  "creator",
  "affiliate",
  "customer",
  "fan",
  "suspended",
] as const;

export type AppRoleKey = (typeof appRoles)[number];

export const permissionKeys = [
  "canManageRoles",
  "canViewAdmin",
  "canManageProducts",
  "canManagePricing",
  "canManageCatalog",
  "canViewOrders",
  "canManageOrders",
  "canManageRefunds",
  "canViewFunds",
  "canManageFunds",
  "canApprovePayouts",
  "canChangePayoutDestination",
  "canManageAffiliatePlans",
  "canManageAffiliateApplications",
  "canViewAffiliateReports",
  "canApproveAffiliatePayouts",
  "canManageAds",
  "canApproveAdCreatives",
  "canManageSponsors",
  "canManagePrintful",
  "canManageFulfillment",
  "canManageInventory",
  "canManageTax",
  "canManageSubscriptions",
  "canManageDigitalAssets",
  "canManageNFTProducts",
  "canManageCustomers",
  "canSupportUsers",
  "canModerateContent",
  "canManageSecurity",
  "canViewAuditLogs",
  "canViewAnalytics",
  "canManageShopSettings",
  "canAccessOwnAffiliateDashboard",
  "canAccessOwnCustomerAccount",
  "products.read",
  "products.write",
  "orders.read",
  "orders.write",
  "refunds.write",
  "affiliates.read",
  "affiliates.write",
  "payouts.approve",
  "settings.write",
  "users.manage",
  "reports.read",
  "shops.manage",
  "platform.manage",
] as const;

export type PermissionKey = (typeof permissionKeys)[number];

export type PermissionContext = {
  userId?: string;
  email?: string;
  roles?: AppRoleKey[];
  rolePermissions?: PermissionKey[];
  isPlatformOwner?: boolean;
  shopId?: string;
};

const rolePermissions: Record<AppRoleKey, PermissionKey[]> = {
  owner: permissionKeys.filter((permission) => !["canAccessOwnAffiliateDashboard", "canAccessOwnCustomerAccount"].includes(permission)),
  admin_products: ["canViewAdmin", "canManageProducts", "canManagePricing", "canManageCatalog", "canManageInventory", "products.read", "products.write"],
  catalog_manager: ["canViewAdmin", "canManageCatalog", "products.read"],
  order_manager: ["canViewAdmin", "canViewOrders", "canManageOrders", "orders.read", "orders.write"],
  refund_manager: ["canViewAdmin", "canViewOrders", "canManageRefunds", "refunds.write"],
  finance_manager: ["canViewAdmin", "canViewOrders", "canViewFunds", "canViewAffiliateReports", "canManageTax", "canViewAnalytics", "reports.read"],
  payout_approver: ["canViewAdmin", "canApprovePayouts", "canApproveAffiliatePayouts", "payouts.approve"],
  affiliate_manager: ["canViewAdmin", "canManageAffiliatePlans", "canManageAffiliateApplications", "canViewAffiliateReports", "affiliates.read", "affiliates.write"],
  affiliate_analyst: ["canViewAdmin", "canViewAffiliateReports", "canViewAnalytics", "affiliates.read", "reports.read"],
  ads_manager: ["canViewAdmin", "canManageAds", "canApproveAdCreatives"],
  sponsor_manager: ["canViewAdmin", "canManageSponsors", "canManageAds"],
  printful_manager: ["canViewAdmin", "canManagePrintful", "canManageFulfillment"],
  fulfillment_manager: ["canViewAdmin", "canManageFulfillment"],
  inventory_manager: ["canViewAdmin", "canManageInventory"],
  tax_manager: ["canViewAdmin", "canManageTax"],
  subscription_manager: ["canViewAdmin", "canManageSubscriptions", "canViewOrders"],
  digital_asset_manager: ["canViewAdmin", "canManageDigitalAssets"],
  nft_manager: ["canViewAdmin", "canManageNFTProducts"],
  customer_manager: ["canViewAdmin", "canManageCustomers", "canSupportUsers", "canViewOrders"],
  support_agent: ["canViewAdmin", "canManageCustomers", "canSupportUsers", "canViewOrders"],
  content_moderator: ["canViewAdmin", "canModerateContent", "canApproveAdCreatives"],
  security_manager: ["canViewAdmin", "canManageSecurity", "canViewAuditLogs"],
  analyst: ["canViewAdmin", "canViewAnalytics", "reports.read"],
  shop_owner: ["canViewAdmin", "canManageShopSettings", "canManageProducts", "canManageCatalog", "canViewOrders"],
  creator: ["canAccessOwnCustomerAccount"],
  affiliate: ["canAccessOwnAffiliateDashboard", "canAccessOwnCustomerAccount"],
  customer: ["canAccessOwnCustomerAccount"],
  fan: ["canAccessOwnCustomerAccount"],
  suspended: [],
};

export function getPermissions(context: PermissionContext) {
  const roles = context.roles ?? [];
  const denied = roles.includes("suspended");
  const permissions = new Set<PermissionKey>(context.rolePermissions ?? []);

  if (context.isPlatformOwner || roles.includes("owner")) {
    rolePermissions.owner.forEach((permission) => permissions.add(permission));
  }

  if (!denied) {
    roles.forEach((role) => rolePermissions[role].forEach((permission) => permissions.add(permission)));
  }

  if (denied) {
    permissions.clear();
  }

  return Object.fromEntries(permissionKeys.map((permission) => [permission, permissions.has(permission)])) as Record<PermissionKey, boolean>;
}

export function hasPermission(context: PermissionContext, permission: PermissionKey) {
  return Boolean(getPermissions(context)[permission]);
}

export function requirePermission(context: PermissionContext, permission: PermissionKey) {
  if (!hasPermission(context, permission)) {
    return { ok: false as const, reason: `Missing permission: ${permission}` };
  }

  return { ok: true as const };
}
