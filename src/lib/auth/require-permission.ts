import "server-only";

import { NextResponse } from "next/server";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { logDeniedAccess } from "@/lib/audit/audit-log";
import { getCurrentUser } from "./current-user";
import { hasPermission, type AppRoleKey, type PermissionKey } from "./permissions";

export async function getRequestPermissionContext(request?: Request) {
  const user = await getCurrentUser();
  const roles = new Set<AppRoleKey>(user?.roles ?? []);

  if (request && process.env.ADMIN_SECRET && isAdminSecretValid(getAdminSecretFromRequest(request))) {
    roles.add("owner");
  }

  return {
    user,
    context: {
      userId: user?.id,
      email: user?.email,
      roles: Array.from(roles),
      isPlatformOwner: roles.has("owner"),
    },
  };
}

export async function requireRequestPermission(request: Request, permission: PermissionKey) {
  const { user, context } = await getRequestPermissionContext(request);

  if (hasPermission(context, permission)) {
    return { ok: true as const, user, context };
  }

  await logDeniedAccess({
    actorId: user?.id,
    targetType: "route",
    targetId: new URL(request.url).pathname,
    metadata: { requiredPermission: permission, roles: context.roles ?? [] },
  });

  return {
    ok: false as const,
    response: NextResponse.json(
      { error: "Access denied.", requiredPermission: permission, roles: context.roles ?? [] },
      { status: user ? 403 : 401 },
    ),
  };
}

export function accessDeniedResponse(requiredPermission: PermissionKey, status = 403) {
  return NextResponse.json({ error: "Access denied.", requiredPermission }, { status });
}

export async function requireOwnerRequest(request: Request) {
  return requireRequestPermission(request, "canManageRoles");
}
