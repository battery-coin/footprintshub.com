const faqs = [
  ["Is this Google Ads?", "No. This is an internal FootprintsHub and future Hero Studio placement system."],
  ["Can I upload creative before payment?", "The MVP creates campaigns after verified payment, then lets advertisers submit creative for review."],
  ["Are results guaranteed?", "No performance outcomes are guaranteed unless a package expressly states a specific deliverable."],
  ["Can subscriptions renew ad placements?", "Recurring ad subscriptions are scaffolded for Stripe subscription mode and need final scheduling automation before launch."],
];

export default function AdvertiseFaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-semibold">Advertising FAQ</h1>
      <div className="mt-8 divide-y divide-black/10 rounded-lg border border-black/10 bg-white">
        {faqs.map(([question, answer]) => (
          <details key={question} className="p-5">
            <summary className="cursor-pointer font-semibold">{question}</summary>
            <p className="mt-3 text-sm leading-6 text-black/60">{answer}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
