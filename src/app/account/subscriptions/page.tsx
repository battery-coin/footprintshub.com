export default function AccountSubscriptionsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Subscriptions</h1>
      <p className="mt-3 text-black/60">Recurring access, memberships, and service retainers appear here after Stripe confirms subscription status.</p>
      <div className="mt-8 rounded-lg border border-black/10 bg-white p-6">
        <h2 className="font-semibold">No active subscriptions</h2>
        <p className="mt-2 text-sm text-black/55">Subscription management will connect to the Stripe Customer Portal when portal setup is enabled.</p>
      </div>
    </main>
  );
}
