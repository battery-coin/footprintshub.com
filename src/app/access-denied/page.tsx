import { AccessDenied } from "@/components/auth/AccessDenied";

export default async function AccessDeniedPage({
  searchParams,
}: {
  searchParams?: Promise<{ required?: string; roles?: string }>;
}) {
  const resolved = searchParams ? await searchParams : {};
  const roles = resolved.roles?.split(",").filter(Boolean) ?? [];

  return <AccessDenied requiredPermission={resolved.required} currentRoles={roles} />;
}
