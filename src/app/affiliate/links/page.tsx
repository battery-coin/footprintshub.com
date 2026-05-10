import { AffiliateShell } from "@/components/affiliate/affiliate-shell";
import { getDemoReferralLink } from "@/lib/affiliate/demo-data";

export default function AffiliateLinksPage() {
  const links = ["/", "/products/footprints-supporter-bundle", "/products/matrix-decoded-alpha-deck"].map((path) => ({
    path,
    url: getDemoReferralLink(path),
  }));

  return (
    <AffiliateShell>
      <h1 className="text-3xl font-semibold">Referral links</h1>
      <div className="mt-6 grid gap-4">
        {links.map((link) => (
          <div key={link.path} className="rounded-lg border border-black/10 bg-white p-5">
            <p className="font-medium">{link.path}</p>
            <p className="mt-2 break-all rounded-md bg-black/[0.03] p-3 font-mono text-sm">{link.url}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-lg border border-black/10 bg-white p-5">
        <p className="font-medium">QR code placeholder</p>
        <div className="mt-4 grid h-36 w-36 grid-cols-6 gap-1 rounded-md bg-white p-3 shadow-inner">
          {Array.from({ length: 36 }).map((_, index) => (
            <span key={index} className={index % 2 === 0 || index % 7 === 0 ? "bg-black" : "bg-black/10"} />
          ))}
        </div>
      </div>
    </AffiliateShell>
  );
}
