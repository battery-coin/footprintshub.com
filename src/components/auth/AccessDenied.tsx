import Link from "next/link";

export function AccessDenied({
  requiredPermission,
  currentRoles = [],
}: {
  requiredPermission?: string;
  currentRoles?: string[];
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">Access denied</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-black">This area needs owner-approved access.</h1>
        <p className="mt-3 text-sm leading-6 text-black/65">
          FootprintsHub now separates product, finance, payout, refund, affiliate, fulfillment, tax, and security
          permissions. Ask the owner to grant only the role needed for this work.
        </p>
        <dl className="mt-6 grid gap-3 rounded-md bg-black/[0.03] p-4 text-sm">
          <div>
            <dt className="font-medium text-black">Required permission</dt>
            <dd className="mt-1 text-black/65">{requiredPermission ?? "Admin access"}</dd>
          </div>
          <div>
            <dt className="font-medium text-black">Current roles</dt>
            <dd className="mt-1 text-black/65">{currentRoles.length ? currentRoles.join(", ") : "No owner-approved admin role detected"}</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/admin" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white">
            Back to dashboard
          </Link>
          <Link href="/support" className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium text-black">
            Contact support
          </Link>
        </div>
      </div>
    </main>
  );
}
