import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminDigitalAssetsPage() {
  return (
    <AdminShell requiredPermission="canManageDigitalAssets">
      <div className="grid gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Digital goods</p>
          <h1 className="text-3xl font-semibold">Digital assets</h1>
          <p className="mt-2 text-black/60">Upload or connect protected files, set download limits, and attach assets to digital download products.</p>
        </div>
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <h2 className="font-semibold">Storage setup required</h2>
          <p className="mt-2 text-sm text-black/55">
            Cloudflare R2 should hold private digital files. The secure download endpoint is tokenized; this page is ready for the storage picker/upload workflow.
          </p>
        </section>
      </div>
    </AdminShell>
  );
}
