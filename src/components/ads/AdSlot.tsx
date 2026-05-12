import Link from "next/link";
import { SponsoredBadge } from "@/components/ads/SponsoredBadge";
import { getLiveAdsForPlacement } from "@/lib/ads/ad-display-service";

export async function AdSlot({ placementKey, maxItems = 1, fallback }: { placementKey: string; maxItems?: number; fallback?: React.ReactNode }) {
  const ads = await getLiveAdsForPlacement(placementKey, maxItems);

  if (!ads.length) {
    return fallback ?? null;
  }

  return (
    <div className="grid gap-3">
      {ads.map((ad) => {
        const creative = ad.creatives[0];
        const targetUrl = creative?.targetUrl ?? ad.targetUrl ?? "/ads";
        return (
          <article key={ad.id} className="rounded-lg border border-black/10 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <SponsoredBadge />
              <Link href={`/ads/click/${ad.id}?to=${encodeURIComponent(targetUrl)}`} className="text-sm font-medium underline">
                Visit
              </Link>
            </div>
            {creative?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={creative.imageUrl} alt={creative.altText ?? ad.title} className="mt-3 aspect-[16/9] w-full rounded-md object-cover" />
            ) : null}
            <h3 className="mt-3 font-semibold">{creative?.title ?? ad.title}</h3>
            {creative?.text ? <p className="mt-1 text-sm text-black/60">{creative.text}</p> : null}
          </article>
        );
      })}
    </div>
  );
}
