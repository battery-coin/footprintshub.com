import { productEditorSchema, slugifyProductTitle, type ProductEditorInput } from "@/lib/products/product-validation";
import type { CsvProductRow } from "./csv-product-import";

export function mapImportRowToProduct(row: CsvProductRow): ProductEditorInput {
  const title = row.title || "Imported product";
  const imageUrl = row.image_url || "";
  const optionName = row.option1_name || "";
  const optionValue = row.option1_value || "";

  return productEditorSchema.parse({
    title,
    slug: row.slug || slugifyProductTitle(title),
    subtitle: row.subtitle || "",
    shortDescription: row.short_description || "",
    description: row.description || row.short_description || title,
    productType: row.product_type || "physical",
    franchise: row.franchise || "other",
    status: row.status || "draft",
    visibility: "visible",
    priceCents: moneyToCents(row.price),
    compareAtPriceCents: moneyToOptionalCents(row.compare_at_price),
    costCents: moneyToOptionalCents(row.cost),
    currency: "USD",
    sku: row.sku || "",
    barcode: row.barcode || "",
    inventoryQuantity: int(row.inventory_quantity, 0),
    trackInventory: bool(row.track_inventory, true),
    allowBackorder: bool(row.allow_backorder, false),
    lowStockThreshold: optionalInt(row.low_stock_threshold),
    requiresShipping: bool(row.requires_shipping, true),
    weightValue: row.weight || "",
    weightUnit: row.weight_unit || "oz",
    lengthValue: row.length || "",
    widthValue: row.width || "",
    heightValue: row.height || "",
    dimensionUnit: row.dimension_unit || "in",
    taxable: bool(row.taxable, true),
    fulfillmentType: row.fulfillment_type || "manual",
    printfulProductId: row.printful_product_id || "",
    digitalUnlockIncluded: false,
    blindBoxEligible: false,
    boosterPackEligible: false,
    affiliateEligible: true,
    imageUrl,
    media: imageUrl ? [{ url: imageUrl, altText: row.image_alt || title, mediaType: "image", isPrimary: true, sortOrder: 0 }] : [],
    options: optionName && optionValue ? [{ name: optionName, values: optionValue.split("|").map((value) => value.trim()).filter(Boolean) }] : [],
    variants: [],
    discountSchedules: [],
    categoryName: row.category || "",
    collectionName: row.collection || "",
    vendor: row.vendor || "",
    tags: row.tags ? row.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
    seoTitle: row.seo_title || "",
    seoDescription: row.seo_description || "",
    metadataJson: "{}",
  });
}

export function mapUnknownApiProductToProduct(input: unknown): ProductEditorInput {
  const record = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const title = text(record.title ?? record.name, "Imported API product");
  const price = text(record.price ?? record.priceCents ?? record.price_cents, "0");
  const image = text(record.image_url ?? record.imageUrl ?? record.image?.toString(), "");

  return mapImportRowToProduct({
    title,
    slug: text(record.slug, slugifyProductTitle(title)),
    subtitle: text(record.subtitle, ""),
    short_description: text(record.short_description ?? record.shortDescription, ""),
    description: text(record.description ?? record.body_html, title),
    product_type: text(record.product_type ?? record.productType, "physical"),
    franchise: text(record.franchise, "other"),
    status: text(record.status, "draft"),
    price: String(Number(price) > 999 ? Number(price) / 100 : price),
    compare_at_price: text(record.compare_at_price ?? record.compareAtPrice, ""),
    cost: text(record.cost, ""),
    sku: text(record.sku, ""),
    barcode: text(record.barcode, ""),
    inventory_quantity: text(record.inventory_quantity ?? record.inventoryQuantity, "0"),
    image_url: image,
    image_alt: title,
    category: text(record.category, ""),
    collection: text(record.collection, ""),
    tags: Array.isArray(record.tags) ? record.tags.join(",") : text(record.tags, ""),
    seo_title: text(record.seo_title ?? record.seoTitle, ""),
    seo_description: text(record.seo_description ?? record.seoDescription, ""),
  });
}

function moneyToCents(value?: string) {
  return Math.max(0, Math.round(Number(value || 0) * 100));
}

function moneyToOptionalCents(value?: string) {
  return value ? moneyToCents(value) : undefined;
}

function int(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.floor(parsed) : fallback;
}

function optionalInt(value: string | undefined) {
  return value ? int(value, 0) : undefined;
}

function bool(value: string | undefined, fallback: boolean) {
  if (!value) return fallback;
  return ["true", "1", "yes", "on"].includes(value.toLowerCase());
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}
