import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminAdPlacementsPage() {
  return (
    <AdminShell requiredPermission="canManageAds">
      <Panel title="Ad placements" detail="Create and manage homepage, newsletter, creator, product, campaign, video, social, and event sponsor inventory.">
        <Link href="/admin/ads/placements/new" className="inline-flex rounded-md bg-black px-4 py-2 text-sm font-medium text-white">New placement</Link>
      </Panel>
    </AdminShell>
  );
}

function Panel({ title, detail, children }: { title: string; detail: string; children: React.ReactNode }) {
  return <div className="grid gap-5"><div><h1 className="text-3xl font-semibold">{title}</h1><p className="mt-2 text-black/60">{detail}</p></div><section className="rounded-lg border border-black/10 bg-white p-6">{children}</section></div>;
}
