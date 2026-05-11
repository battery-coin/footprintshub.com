import type { CatalogProduct } from "@/lib/catalog/types";

const HEADERS = [
  "title",
  "slug",
  "subtitle",
  "short_description",
  "description",
  "product_type",
  "franchise",
  "status",
  "price",
  "compare_at_price",
  "sku",
  "inventory_quantity",
  "track_inventory",
  "allow_backorder",
  "requires_shipping",
  "image_url",
  "seo_title",
  "seo_description",
];

export function exportProductsToCsv(products: CatalogProduct[]) {
  const rows = products.map((product) => [
    product.title,
    product.slug,
    product.subtitle ?? "",
    product.shortDescription ?? "",
    product.description,
    product.productType,
    product.franchise,
    product.status,
    centsToMoney(product.priceCents),
    product.compareAtPriceCents ? centsToMoney(product.compareAtPriceCents) : "",
    product.sku ?? "",
    String(product.inventoryQuantity),
    String(product.trackInventory),
    String(product.allowBackorder ?? false),
    String(product.requiresShipping ?? true),
    product.imageUrl ?? "",
    product.seoTitle ?? "",
    product.seoDescription ?? "",
  ]);

  return [HEADERS, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}

function centsToMoney(cents: number) {
  return (cents / 100).toFixed(2);
}

function escapeCsvCell(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  return value;
}
