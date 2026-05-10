export const permissionKeys = [
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
  userId: string;
  rolePermissions: PermissionKey[];
  isPlatformOwner?: boolean;
  shopId?: string;
};

export function hasPermission(context: PermissionContext, permission: PermissionKey) {
  return Boolean(context.isPlatformOwner || context.rolePermissions.includes(permission));
}

export function requirePermission(context: PermissionContext, permission: PermissionKey) {
  if (!hasPermission(context, permission)) {
    return { ok: false as const, reason: `Missing permission: ${permission}` };
  }

  return { ok: true as const };
}
