import { getCurrentUser, type CurrentUser } from "./current-user";
import { getPermissions, hasPermission } from "./permissions";

export { getCurrentUser, type CurrentUser };

export function isPlatformOwner(user: CurrentUser | null | undefined) {
  if (!user) {
    return false;
  }

  return user.roles.includes("owner");
}

export function isAdmin(user: CurrentUser | null | undefined) {
  if (!user) {
    return false;
  }

  return hasPermission({ userId: user.id, email: user.email, roles: user.roles }, "canViewAdmin");
}

export function isShopOwner(user: CurrentUser | null | undefined, shopOwnerEmail?: string | null) {
  return Boolean(user?.email && shopOwnerEmail && user.email.toLowerCase() === shopOwnerEmail.toLowerCase());
}

export async function requireAdmin(user?: CurrentUser | null) {
  const resolvedUser = user ?? (await getCurrentUser());
  return isAdmin(resolvedUser)
    ? { ok: true as const, user: resolvedUser }
    : { ok: false as const, reason: "Admin access required." };
}

export async function requirePlatformOwner(user?: CurrentUser | null) {
  const resolvedUser = user ?? (await getCurrentUser());
  return isPlatformOwner(resolvedUser)
    ? { ok: true as const, user: resolvedUser }
    : { ok: false as const, reason: "Platform owner access required." };
}

export async function requireShopOwnerOrPlatformOwner(shopOwnerEmail?: string | null, user?: CurrentUser | null) {
  const resolvedUser = user ?? (await getCurrentUser());
  return isPlatformOwner(resolvedUser) || isShopOwner(resolvedUser, shopOwnerEmail)
    ? { ok: true as const, user: resolvedUser }
    : { ok: false as const, reason: "Shop owner or platform owner access required." };
}

export function getRoleSummary(user: CurrentUser | null | undefined) {
  if (!user) {
    return { roles: [], permissions: getPermissions({ roles: [] }) };
  }

  return { roles: user.roles, permissions: getPermissions({ userId: user.id, email: user.email, roles: user.roles }) };
}
