import type { ReactNode } from "react";
import { AccessDenied } from "./AccessDenied";
import { getCurrentPermissionContext } from "@/lib/auth/current-user";
import { hasPermission, type PermissionKey } from "@/lib/auth/permissions";

export async function PermissionGuard({ permission, children }: { permission: PermissionKey; children: ReactNode }) {
  const context = await getCurrentPermissionContext();

  if (!hasPermission(context, permission)) {
    return <AccessDenied requiredPermission={permission} currentRoles={context.roles ?? []} />;
  }

  return <>{children}</>;
}
