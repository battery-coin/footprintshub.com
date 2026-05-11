import { AccessDenied } from "@/components/auth/AccessDenied";
import { getCurrentPermissionContext } from "@/lib/auth/current-user";
import { appRoles, hasPermission } from "@/lib/auth/permissions";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

type RolePageUser = {
  id: string;
  email: string;
  name: string | null;
  roles: Array<{ role: string; shopId: string | null; assignedAt: Date | string }>;
};

async function getRoleData() {
  if (!hasDatabaseUrl()) {
    return { users: [] as RolePageUser[], roles: [], unavailable: true };
  }

  const prisma = getPrisma();
  const users = await prisma.user
    .findMany({
      orderBy: [{ updatedAt: "desc" }],
      take: 100,
      select: {
        id: true,
        email: true,
        name: true,
        appRoles: {
          where: { revokedAt: null },
          select: { role: true, shopId: true, assignedAt: true },
        },
      },
    })
    .catch(() => []);

  return { users: users.map((user) => ({ ...user, roles: user.appRoles })) as RolePageUser[], roles: appRoles, unavailable: false };
}

export default async function OwnerRolesPage() {
  const context = await getCurrentPermissionContext();

  if (!hasPermission(context, "canManageRoles")) {
    return <AccessDenied requiredPermission="canManageRoles" currentRoles={context.roles ?? []} />;
  }

  const data = await getRoleData();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">Owner control</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">Roles and permissions</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-black/65">
            Only the owner can grant sensitive access. Product, finance, payout, refund, affiliate, fulfillment, tax,
            and security roles stay separate by design.
          </p>
        </div>
      </div>

      {data.unavailable ? (
        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
          Role data is unavailable until DATABASE_URL is configured and the owner bootstrap has run.
        </div>
      ) : null}

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-black/10 bg-white">
          <div className="border-b border-black/10 p-5">
            <h2 className="text-lg font-semibold text-black">Users</h2>
          </div>
          <div className="divide-y divide-black/10">
            {(data.users ?? []).map((user) => (
              <div key={user.id} className="grid gap-4 p-5 md:grid-cols-[1fr_220px]">
                <div>
                  <p className="font-medium text-black">{user.name || user.email}</p>
                  <p className="text-sm text-black/60">{user.email}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(user.roles ?? []).length ? (
                      user.roles?.map((role) => (
                        <span key={`${user.id}-${role.role}-${role.shopId ?? "platform"}`} className="rounded-full bg-black/[0.06] px-3 py-1 text-xs font-medium text-black/70">
                          {role.role}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-black/45">No active admin roles</span>
                    )}
                  </div>
                </div>
                <RoleActions userId={user.id} />
              </div>
            ))}
            {!(data.users ?? []).length ? (
              <div className="p-8 text-sm text-black/60">No users found yet. Create David&apos;s user account, then run owner bootstrap.</div>
            ) : null}
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-lg font-semibold text-black">Permission catalog</h2>
          <p className="mt-2 text-sm text-black/60">Sensitive roles are intentionally narrow. Avoid granting more than one financial role unless needed.</p>
          <div className="mt-4 grid gap-2">
            {appRoles.map((role) => (
              <span key={role} className="rounded-md border border-black/10 px-3 py-2 text-sm text-black/70">
                {role}
              </span>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

function RoleActions({ userId }: { userId: string }) {
  return (
    <div className="grid gap-2">
      <form action="/api/owner/roles/assign" method="post" className="grid gap-2">
        <input type="hidden" name="userId" value={userId} />
        <select name="role" className="rounded-md border border-black/10 px-3 py-2 text-sm">
          {appRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <input name="notes" placeholder="Role note" className="rounded-md border border-black/10 px-3 py-2 text-sm" />
        <button className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white">Assign role</button>
      </form>
      <form action="/api/owner/roles/revoke" method="post" className="grid gap-2">
        <input type="hidden" name="userId" value={userId} />
        <select name="role" className="rounded-md border border-black/10 px-3 py-2 text-sm">
          {appRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button className="rounded-md border border-black/10 px-3 py-2 text-sm font-medium text-black">Revoke role</button>
      </form>
    </div>
  );
}
