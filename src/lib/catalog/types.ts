export type ProductType =
  | "physical"
  | "digital"
  | "bundle"
  | "membership"
  | "preorder"
  | "blind_box"
  | "booster_pack";

export type Franchise =
  | "footprints"
  | "matrix_decoded"
  | "hero_studio"
  | "battery_movement"
  | "other";

export type ProductStatus = "draft" | "active" | "archived";

export type CatalogProduct = {
  id: string;
  shopId: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  shortDescription?: string;
  productType: ProductType;
  franchise: Franchise;
  status: ProductStatus;
  priceCents: number;
  compareAtPriceCents?: number;
  currency: string;
  sku?: string;
  inventoryQuantity: number;
  trackInventory: boolean;
  imageUrl?: string;
  galleryUrls: string[];
  isFeatured: boolean;
  isLimitedEdition: boolean;
  preorderStatus?: string;
  digitalUnlockIncluded: boolean;
  tokenGated: boolean;
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
