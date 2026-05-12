import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export default async function AccountOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = hasDatabaseUrl()
    ? await getPrisma().order.findUnique({
        where: { id },
        include: { printfulOrders: true, shipments: true },
      })
    : null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Order {order?.orderNumber ?? "detail"}</h1>
      <p className="mt-2 font-mono text-sm text-black/50">{order?.id ?? id}</p>
      <p className="mt-3 text-sm leading-6 text-black/60">
        Customer-visible history, downloads, shipments, returns, and reorder actions appear here as account auth is connected.
      </p>
      {order?.printfulOrders.length ? (
        <section className="mt-8 rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-xl font-semibold">Production status</h2>
          <div className="mt-3 grid gap-3 text-sm text-black/60">
            {order.printfulOrders.map((printfulOrder) => (
              <p key={printfulOrder.id}>
                {printfulOrder.status === "inprocess"
                  ? "Your item is being produced."
                  : printfulOrder.status === "fulfilled" || printfulOrder.status === "shipped"
                    ? "Your item has shipped or is ready for tracking."
                    : printfulOrder.status === "failed"
                      ? "Fulfillment requires review. Support will follow up if anything is needed."
                      : "Your paid order is queued for fulfillment review."}
              </p>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
