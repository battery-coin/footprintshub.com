export type ProductType =
  | "physical"
  | "digital"
  | "digital_download"
  | "digital_unlock"
  | "service"
  | "subscription"
  | "bundle"
  | "membership"
  | "nft"
  | "nft_linked_physical"
  | "ad_placement"
  | "sponsorship"
  | "campaign_boost"
  | "creator_promotion"
  | "fan_club_promotion"
  | "newsletter_ad"
  | "homepage_feature"
  | "banner_ad"
  | "video_ad"
  | "event_sponsorship"
  | "classified_ad"
  | "featured_listing"
  | "social_promotion_package"
  | "preorder"
  | "blind_box"
  | "booster_pack"
  | "print_on_demand"
  | "event_access"
  | "appointment"
  | "donation_like_supporter_bundle";

export type ProductPaymentMode = "one_time" | "recurring" | "one_time_or_recurring" | "free" | "external";

export type ProductDeliveryMode =
  | "shipped"
  | "download"
  | "access_grant"
  | "service_scheduled"
  | "subscription_access"
  | "nft_claim"
  | "ad_review_and_schedule"
  | "ad_auto_schedule"
  | "sponsor_placement"
  | "campaign_boost"
  | "featured_listing"
  | "hybrid"
  | "none";

export type Franchise =
  | "footprints"
  | "matrix_decoded"
  | "hero_studio"
  | "battery_movement"
  | "other";

export type ProductStatus = "draft" | "active" | "archived" | "hidden" | "sold_out";

export type ProductVisibility = "visible" | "hidden" | "catalog_only" | "direct_link";

export type CatalogProduct = {
  id: string;
  shopId: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  shortDescription?: string;
  productType: ProductType;
  paymentMode?: ProductPaymentMode;
  deliveryMode?: ProductDeliveryMode;
  franchise: Franchise;
  status: ProductStatus;
  visibility?: ProductVisibility;
  priceCents: number;
  compareAtPriceCents?: number;
  currency: string;
  sku?: string;
  inventoryQuantity: number;
  trackInventory: boolean;
  allowBackorder?: boolean;
  lowStockThreshold?: number;
  imageUrl?: string;
  galleryUrls: string[];
  seoTitle?: string;
  seoDescription?: string;
  isFeatured: boolean;
  isLimitedEdition: boolean;
  preorderStatus?: string;
  preorderReleaseAt?: Date;
  requiresShipping?: boolean;
  requiresScheduling?: boolean;
  requiresDownload?: boolean;
  requiresWallet?: boolean;
  subscriptionEligible?: boolean;
  nftEligible?: boolean;
  accessDurationDays?: number;
  termsRequired?: boolean;
  digitalUnlockIncluded: boolean;
  tokenGated: boolean;
  isRandomized?: boolean;
  oddsDisclosureUrl?: string;
  affiliateEligible?: boolean;
  metadata?: Record<string, unknown>;
};

export type CartLineInput = {
  productId: string;
  variantId?: string;
  quantity: number;
};

export type PricedCartLine = {
  product: CatalogProduct;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
};
