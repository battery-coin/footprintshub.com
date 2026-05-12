import Link from "next/link";

export default function AdvertiseSuccessPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-semibold">Ad purchase received</h1>
      <p className="mt-4 text-black/60">After payment is verified, your ad campaign is created for creative submission and review.</p>
      <Link href="/advertise/campaigns" className="mt-6 inline-flex rounded-md bg-black px-5 py-3 text-sm font-medium text-white">Manage campaigns</Link>
    </main>
  );
}
