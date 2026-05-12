import type { CatalogProduct } from "@/lib/catalog/types";
import { getProducts } from "@/lib/catalog/products";

export const adProductTypes = new Set([
  "ad_placement",
  "sponsorship",
  "campaign_boost",
  "creator_promotion",
  "fan_club_promotion",
  "newsletter_ad",
  "homepage_feature",
  "banner_ad",
  "video_ad",
  "event_sponsorship",
  "classified_ad",
  "featured_listing",
  "social_promotion_package",
]);

export const starterAdProducts: CatalogProduct[] = [
  adPackage("ad-homepage-sponsor", "Homepage Featured Sponsor", "Premium homepage placement reviewed and scheduled by the FootprintsHub team.", 25000, "homepage_feature"),
  adPackage("ad-footprints-campaign-sponsor", "Footprints Campaign Sponsor", "Sponsor an approved Footprints campaign placement with creative review.", 15000, "sponsorship"),
  adPackage("ad-matrix-drop-feature", "Matrix Decoded Collector Drop Feature", "Feature a collector drop in Matrix Decoded-friendly placements.", 12500, "featured_listing"),
  adPackage("ad-creator-shop-feature", "Creator Shop Featured Placement", "Promote a creator shop or product card in approved creator placements.", 9900, "creator_promotion"),
  adPackage("ad-fan-club-feature", "Fan Club Featured Placement", "Feature a fan club, membership, or campaign page after review.", 9900, "fan_club_promotion"),
  adPackage("ad-newsletter-sponsor", "Newsletter Sponsor", "Newsletter mention package with creative and link review.", 17500, "newsletter_ad"),
  adPackage("ad-social-promotion", "Social Promotion Package", "Reviewed social promotion package for approved campaigns and products.", 7900, "social_promotion_package"),
  adPackage("ad-video-spotlight", "Video Spotlight Sponsor", "Video spotlight placement for approved creative and campaigns.", 19900, "video_ad"),
];

export async function getAdProducts() {
  const products = await getProducts();
  const ads = products.filter((product) => adProductTypes.has(product.productType));
  return ads.length ? ads : starterAdProducts;
}

export async function getAdProductBySlug(slug: string) {
  const products = await getAdProducts();
  return products.find((product) => product.slug === slug);
}

function adPackage(id: string, title: string, shortDescription: string, priceCents: number, productType: CatalogProduct["productType"]): CatalogProduct {
  return {
    id,
    shopId: "flagship",
    title,
    slug: id,
    description: `${shortDescription} Ads are subject to approval and do not include guaranteed performance unless the package explicitly says so.`,
    shortDescription,
    productType,
    paymentMode: "one_time",
    deliveryMode: "ad_review_and_schedule",
    franchise: "footprints",
    status: "active",
    visibility: "visible",
    priceCents,
    currency: "USD",
    sku: id.toUpperCase(),
    inventoryQuantity: 999,
    trackInventory: false,
    allowBackorder: true,
    galleryUrls: [],
    isFeatured: productType === "homepage_feature" || productType === "sponsorship",
    isLimitedEdition: false,
    requiresShipping: false,
    digitalUnlockIncluded: false,
    tokenGated: false,
    affiliateEligible: true,
    metadata: {
      durationDays: 30,
      placementKey: productType,
      requiresAdminApproval: true,
      requiresCreativeUpload: true,
      requiresTargetUrl: true,
    },
  };
}
