import { AdminShell } from "@/components/admin/admin-shell";
import { EditRowLink } from "@/components/admin/edit-row-link";

const plannedCollections = [
  "Featured drops",
  "Founder bundles",
  "Blind boxes and booster packs",
  "Fan club starter packs",
  "Digital unlocks",
];

export default function AdminCollectionsPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Collections</h1>
      <p className="mt-2 text-sm text-black/55">Collections support merchandising, landing pages, and campaign embeds.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {plannedCollections.map((collection) => (
          <div key={collection} className="rounded-lg border border-black/10 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{collection}</p>
                <p className="mt-1 text-sm text-black/55">Product assignment and sort order are in the database foundation.</p>
              </div>
              <EditRowLink href={`/admin/collections?edit=${encodeURIComponent(collection.toLowerCase().replaceAll(" ", "-"))}`} />
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
