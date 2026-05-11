import "server-only";

import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import type { AppRoleKey, PermissionContext } from "./permissions";

export type CurrentUser = {
  id: string;
  email: string;
  name?: string | null;
  roles: AppRoleKey[];
};

function splitEmails(value?: string) {
  return new Set(
    (value ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

function ownerEmail() {
  return (process.env.PLATFORM_OWNER_EMAIL ?? "").trim().toLowerCase();
}

function fallbackOperationalRoles(email: string): AppRoleKey[] {
  if (ownerEmail() && email.toLowerCase() === ownerEmail()) {
    return ["owner"];
  }

  if (splitEmails(process.env.ADMIN_EMAILS).has(email.toLowerCase())) {
    return ["admin_products", "order_manager", "support_agent"];
  }

  return [];
}

export function getConfiguredOwnerEmail() {
  return ownerEmail();
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const configuredOwner = ownerEmail();
  const fallbackEmail = configuredOwner || splitEmails(process.env.ADMIN_EMAILS).values().next().value;

  if (!fallbackEmail) {
    return null;
  }

  if (!hasDatabaseUrl()) {
    return {
      id: fallbackEmail,
      email: fallbackEmail,
      name: configuredOwner === fallbackEmail ? "David Kam" : null,
      roles: fallbackOperationalRoles(fallbackEmail),
    };
  }

  try {
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { email: fallbackEmail },
      include: {
        appRoles: {
          where: { revokedAt: null },
          select: { role: true },
        },
      },
    });

    if (!user) {
      return {
        id: fallbackEmail,
        email: fallbackEmail,
        name: configuredOwner === fallbackEmail ? "David Kam" : null,
        roles: fallbackOperationalRoles(fallbackEmail),
      };
    }

    const storedRoles = user.appRoles.map((role) => role.role as AppRoleKey);
    const roles = Array.from(new Set([...fallbackOperationalRoles(user.email), ...storedRoles]));

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles,
    };
  } catch {
    return {
      id: fallbackEmail,
      email: fallbackEmail,
      name: configuredOwner === fallbackEmail ? "David Kam" : null,
      roles: fallbackOperationalRoles(fallbackEmail),
    };
  }
}

export async function getCurrentPermissionContext(shopId?: string): Promise<PermissionContext> {
  const user = await getCurrentUser();

  return {
    userId: user?.id,
    email: user?.email,
    roles: user?.roles ?? [],
    isPlatformOwner: user?.roles.includes("owner") ?? false,
    shopId,
  };
}

export async function getCurrentUserRoles() {
  return (await getCurrentUser())?.roles ?? [];
}
