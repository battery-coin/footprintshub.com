export type CurrentUser = {
  id?: string;
  email?: string;
  role?: string;
};

function splitEmails(value?: string) {
  return new Set(
    (value ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function getCurrentUser(): CurrentUser | null {
  const email = process.env.PLATFORM_OWNER_EMAIL ?? splitEmails(process.env.ADMIN_EMAILS).values().next().value;
  return email ? { email, role: "platform_owner" } : null;
}

export function isPlatformOwner(user: CurrentUser | null | undefined) {
  if (!user?.email) {
    return false;
  }

  return user.email.toLowerCase() === (process.env.PLATFORM_OWNER_EMAIL ?? "").toLowerCase();
}

export function isAdmin(user: CurrentUser | null | undefined) {
  if (!user?.email) {
    return false;
  }

  return isPlatformOwner(user) || splitEmails(process.env.ADMIN_EMAILS).has(user.email.toLowerCase());
}

export function isShopOwner(user: CurrentUser | null | undefined, shopOwnerEmail?: string | null) {
  return Boolean(user?.email && shopOwnerEmail && user.email.toLowerCase() === shopOwnerEmail.toLowerCase());
}

export function requireAdmin(user = getCurrentUser()) {
  return isAdmin(user) ? { ok: true as const, user } : { ok: false as const, reason: "Admin access required." };
}

export function requirePlatformOwner(user = getCurrentUser()) {
  return isPlatformOwner(user)
    ? { ok: true as const, user }
    : { ok: false as const, reason: "Platform owner access required." };
}

export function requireShopOwnerOrPlatformOwner(shopOwnerEmail?: string | null, user = getCurrentUser()) {
  return isPlatformOwner(user) || isShopOwner(user, shopOwnerEmail)
    ? { ok: true as const, user }
    : { ok: false as const, reason: "Shop owner or platform owner access required." };
}
