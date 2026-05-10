export default function AccountStoreCreditPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Store credit</h1>
      <p className="mt-3 text-sm leading-6 text-black/60">
        Customer store-credit balance is derived from `StoreCreditLedger`; do not mutate balances directly.
      </p>
    </main>
  );
}
