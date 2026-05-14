import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminReturnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Return request</h1>
      <p className="mt-2 font-mono text-sm text-black/50">{id}</p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
        Detail workflow is prepared for review, approval, rejection, receipt, refund, and store-credit actions.
      </p>
    </AdminShell>
  );
}
