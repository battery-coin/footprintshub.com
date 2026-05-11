import type { ReactNode } from "react";
import { AccessDenied } from "./AccessDenied";
import { getCurrentUser } from "@/lib/auth/current-user";
import type { AppRoleKey } from "@/lib/auth/permissions";

export async function RoleGuard({ allowedRoles, children }: { allowedRoles: AppRoleKey[]; children: ReactNode }) {
  const user = await getCurrentUser();
  const roles = user?.roles ?? [];

  if (roles.includes("suspended") || !allowedRoles.some((role) => roles.includes(role))) {
    return <AccessDenied requiredPermission={`Role: ${allowedRoles.join(" or ")}`} currentRoles={roles} />;
  }

  return <>{children}</>;
}
