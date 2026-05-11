"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Plus, Trash2, WandSparkles, Upload, Download, Copy, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import { calculateMarginBps, calculateProfitCents, formatMargin } from "@/lib/pricing/margin";
import { slugifyProductTitle, type ProductEditorInput } from "@/lib/products/product-validation";

type ProductEditorProps = {
  mode: "create" | "edit";
  product?: ProductEditorInput & { id?: string };
};

type SaveState = "idle" | "saving" | "saved" | "error";

const defaultProduct: ProductEditorInput = {
  title: "",
  slug: "",
  subtitle: "",
  shortDescription: "",
  description: "",
  productType: "physical",
  franchise: "footprints",
  status: "draft",
  visibility: "visible",
  priceCents: 0,
  compareAtPriceCents: undefined,
  costCents: undefined,
  currency: "USD",
  sku: "",
  barcode: "",
  inventoryQuantity: 0,
  trackInventory: true,
  allowBackorder: false,
  lowStockThreshold: undefined,
  requiresShipping: true,
  weightValue: "",
  weightUnit: "oz",
  lengthValue: "",
  widthValue: "",
  heightValue: "",
  dimensionUnit: "in",
  taxable: true,
  taxClassId: "",
  fulfillmentType: "manual",
  printfulProductId: "",
  printfulSyncProductId: "",
  digitalUnlockIncluded: false,
  tokenGated: false,
  blindBoxEligible: false,
  boosterPackEligible: false,
  affiliateEligible: true,
  oddsDisclosureUrl: "",
  imageUrl: "",
  media: [],
  options: [],
  variants: [],
  discountSchedules: [],
  categoryName: "",
  collectionName: "",
  vendor: "",
  tags: [],
  isFeatured: false,
  isLimitedEdition: false,
  preorderStatus: "",
  preorderReleaseAt: "",
  scheduledPublishAt: "",
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  metadataJson: "{}",
};

export function ProductEditor({ mode, product }: ProductEditorProps) {
  const [draft, setDraft] = useState<ProductEditorInput>(product ?? defaultProduct);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");
  const [createdId, setCreatedId] = useState(product?.id ?? "");
  const [csvText, setCsvText] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [importResult, setImportResult] = useState("");
  const [dirty, setDirty] = useState(false);

  const productId = product?.id ?? createdId;
  const profitCents = calculateProfitCents(draft.priceCents, draft.costCents);
  const marginBps = calculateMarginBps(draft.priceCents, draft.costCents);
  const adminSecretQuery = typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("admin_secret") ?? "";
  const adminQuery = adminSecretQuery ? `?admin_secret=${encodeURIComponent(adminSecretQuery)}` : "";

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const warnings = useMemo(() => {
    const next: string[] = [];
    if ((draft.costCents ?? 0) > draft.priceCents) next.push("Cost is higher than price.");
    if (draft.compareAtPriceCents != null && draft.compareAtPriceCents < draft.priceCents) next.push("Compare-at price is below the product price.");
    if (draft.productType === "digital" && draft.requiresShipping) next.push("Digital products should not require shipping.");
    if (draft.fulfillmentType === "printful" && !draft.printfulProductId && !draft.printfulSyncProductId) {
      next.push("Printful fulfillment needs a product ID or sync product ID.");
    }
    if ((draft.seoTitle?.length ?? 0) > 70) next.push("SEO title is longer than 70 characters.");
    if ((draft.seoDescription?.length ?? 0) > 160) next.push("SEO description is longer than 160 characters.");
    return next;
  }, [draft]);

  function update<K extends keyof ProductEditorInput>(key: K, value: ProductEditorInput[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setDirty(true);
  }

  async function save(status?: ProductEditorInput["status"]) {
    setSaveState("saving");
    setMessage("");
    const payload = { ...draft, status: status ?? draft.status };
    const path = productId ? `/api/admin/products/${productId}${adminQuery}` : `/api/admin/products${adminQuery}`;
    const response = await fetch(path, {
      method: productId ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      setSaveState("error");
      setMessage(json.error ?? "Unable to save product.");
      return;
    }

    setSaveState("saved");
    setDirty(false);
    setCreatedId(json.productId ?? productId);
    setDraft(payload);
    setMessage(json.stored === false ? "Validated. Connect Neon to persist this product." : "Product saved.");
  }

  function duplicateProduct() {
    setDraft((current) => ({
      ...current,
      title: `${current.title || "Product"} Copy`,
      slug: `${current.slug || "product"}-copy`,
      status: "draft",
    }));
    setCreatedId("");
    setDirty(true);
    setMessage("Duplicate staged as a new draft. Review the slug and save.");
  }

  function addMedia() {
    setDraft((current) => ({
      ...current,
      media: [
        ...current.media,
        {
          url: current.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
          altText: current.title || "Product image",
          mediaType: "image",
          variantSku: "",
          isPrimary: current.media.length === 0,
          sortOrder: current.media.length,
        },
      ],
    }));
    setDirty(true);
  }

  function addOption() {
    setDraft((current) => ({
      ...current,
      options: [...current.options, { name: "Size", values: ["Standard"] }],
    }));
    setDirty(true);
  }

  function generateVariants() {
    const variants = buildVariants(draft.options).map((optionValues, index) => ({
      id: "",
      title: Object.values(optionValues).join(" / ") || "Default",
      sku: `${draft.sku || slugifyProductTitle(draft.title || "PRODUCT").toUpperCase()}-${index + 1}`,
      barcode: "",
      optionValues,
      priceCents: draft.priceCents,
      compareAtPriceCents: draft.compareAtPriceCents,
      costCents: draft.costCents,
      inventoryQuantity: draft.inventoryQuantity,
      trackInventory: draft.trackInventory,
      allowBackorder: draft.allowBackorder,
      weightValue: draft.weightValue,
      weightUnit: draft.weightUnit,
      taxable: draft.taxable,
      imageUrl: draft.imageUrl,
      printfulVariantId: "",
      printfulSyncVariantId: "",
      active: true,
      sortOrder: index,
    }));
    update("variants", variants);
  }

  async function previewCsv(commit = false) {
    const response = await fetch(`/api/admin/products/import/csv${adminQuery}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ csv: csvText, commit }),
    });
    const json = await response.json().catch(() => ({}));
    setImportResult(response.ok ? `${commit ? "Imported" : "Previewed"} ${json.totalRows ?? 0} rows. ${json.imported ?? 0} saved.` : json.error);
  }

  async function previewApi(commit = false) {
    const response = await fetch(`/api/admin/products/import/api${adminQuery}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: apiUrl, commit }),
    });
    const json = await response.json().catch(() => ({}));
    setImportResult(response.ok ? `${commit ? "Imported" : "Previewed"} ${json.total ?? 0} API products. ${json.imported ?? 0} saved.` : json.error);
  }

  return (
    <div className="pb-24">
      <div className="sticky top-0 z-20 -mx-4 border-b border-black/10 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">{mode === "create" ? "Create product" : "Edit product"}</p>
            <h1 className="text-3xl font-semibold">{draft.title || "New product"}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {productId ? (
              <Link className="inline-flex min-h-10 items-center gap-2 rounded-md border border-black/15 px-4 py-2 text-sm font-medium" href={`/products/${draft.slug}`}>
                <Eye size={16} /> Preview
              </Link>
            ) : null}
            <Button type="button" variant="secondary" onClick={duplicateProduct}>
              <Copy size={16} /> Duplicate
            </Button>
            <Button type="button" variant="secondary" onClick={() => save("draft")} disabled={saveState === "saving"}>
              Save Draft
            </Button>
            <Button type="button" onClick={() => save("active")} disabled={saveState === "saving"}>
              Save and Publish
            </Button>
          </div>
        </div>
        {message ? <p className={`mt-2 text-sm ${saveState === "error" ? "text-red-700" : "text-emerald-700"}`}>{message}</p> : null}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-6">
          <Section title="Basic information" detail="Name, story, type, and selling status.">
            <div className="grid gap-4">
              <Field label="Title">
                <Input
                  value={draft.title}
                  onChange={(event) => {
                    const title = event.target.value;
                    setDraft((current) => ({ ...current, title, slug: current.slug ? current.slug : slugifyProductTitle(title) }));
                    setDirty(true);
                  }}
                />
              </Field>
              <Field label="Subtitle">
                <Input value={draft.subtitle} onChange={(event) => update("subtitle", event.target.value)} />
              </Field>
              <Field label="Short description">
                <Input value={draft.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} />
              </Field>
              <Field label="Description">
                <Textarea value={draft.description} onChange={(event) => update("description", event.target.value)} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField label="Product type" value={draft.productType} onChange={(value) => update("productType", value as ProductEditorInput["productType"])}>
                  {["physical", "digital", "bundle", "membership", "preorder", "blind_box", "booster_pack", "service"].map((value) => (
                    <option key={value} value={value}>{labelize(value)}</option>
                  ))}
                </SelectField>
                <SelectField label="World" value={draft.franchise} onChange={(value) => update("franchise", value as ProductEditorInput["franchise"])}>
                  {["footprints", "matrix_decoded", "hero_studio", "battery_movement", "other"].map((value) => (
                    <option key={value} value={value}>{labelize(value)}</option>
                  ))}
                </SelectField>
              </div>
            </div>
          </Section>

          <Section title="Media" detail="Use URL-based media now; connect Cloudflare R2 later for direct uploads.">
            <div className="grid gap-4">
              <Field label="Primary image URL">
                <Input value={draft.imageUrl} onChange={(event) => update("imageUrl", event.target.value)} placeholder="https://..." />
              </Field>
              <Button type="button" variant="secondary" onClick={addMedia}>
                <Plus size={16} /> Add image URL to gallery
              </Button>
              <div className="grid gap-3 sm:grid-cols-2">
                {draft.media.map((media, index) => (
                  <div key={`${media.url}-${index}`} className="rounded-lg border border-black/10 p-3">
                    <div className="aspect-[4/3] overflow-hidden rounded-md bg-black/[0.03]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={media.url} alt={media.altText || draft.title} className="h-full w-full object-cover" />
                    </div>
                    <Input className="mt-3" value={media.url} onChange={(event) => updateMedia(index, "url", event.target.value)} />
                    <Input className="mt-2" value={media.altText} placeholder="Alt text" onChange={(event) => updateMedia(index, "altText", event.target.value)} />
                    <div className="mt-3 flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={media.isPrimary} onChange={() => setPrimaryMedia(index)} /> Primary
                      </label>
                      <button type="button" className="text-sm text-red-700" onClick={() => removeMedia(index)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section title="Pricing" detail="Admin-only costs and margin are never shown to customers.">
            <div className="grid gap-4 sm:grid-cols-3">
              <MoneyField label="Price" cents={draft.priceCents} onChange={(value) => update("priceCents", value ?? 0)} />
              <MoneyField label="Compare-at price" cents={draft.compareAtPriceCents} onChange={(value) => update("compareAtPriceCents", value)} />
              <MoneyField label="Cost per item" cents={draft.costCents} onChange={(value) => update("costCents", value)} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Metric label="Profit" value={formatMoney(profitCents)} tone={profitCents < 0 ? "warn" : "normal"} />
              <Metric label="Margin" value={formatMargin(marginBps)} tone={(marginBps ?? 0) < 2000 ? "warn" : "normal"} />
              <Metric label="Currency" value={draft.currency} />
            </div>
          </Section>

          <Section title="Inventory" detail="SKU, stock policy, and operational inventory settings.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="SKU"><Input value={draft.sku} onChange={(event) => update("sku", event.target.value)} /></Field>
              <Field label="Barcode"><Input value={draft.barcode} onChange={(event) => update("barcode", event.target.value)} /></Field>
              <NumberField label="Quantity" value={draft.inventoryQuantity} onChange={(value) => update("inventoryQuantity", value)} />
              <NumberField label="Low stock threshold" value={draft.lowStockThreshold ?? 0} onChange={(value) => update("lowStockThreshold", value)} />
            </div>
            <ToggleGrid>
              <Toggle label="Track quantity" checked={draft.trackInventory} onChange={(value) => update("trackInventory", value)} />
              <Toggle label="Allow backorder" checked={draft.allowBackorder} onChange={(value) => update("allowBackorder", value)} />
            </ToggleGrid>
          </Section>

          <Section title="Options and variants" detail="Build Size, Color, Edition, Rarity, Bundle Type, or Printful variant mappings.">
            <div className="grid gap-4">
              {draft.options.map((option, index) => (
                <div key={`${option.name}-${index}`} className="grid gap-3 rounded-lg border border-black/10 p-4 sm:grid-cols-[1fr_2fr_auto]">
                  <Input value={option.name} onChange={(event) => updateOption(index, "name", event.target.value)} />
                  <Input value={option.values.join(", ")} onChange={(event) => updateOption(index, "values", event.target.value.split(",").map((value) => value.trim()).filter(Boolean))} />
                  <Button type="button" variant="ghost" onClick={() => removeOption(index)}><Trash2 size={16} /></Button>
                </div>
              ))}
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary" onClick={addOption}><Plus size={16} /> Add option</Button>
                <Button type="button" variant="secondary" onClick={generateVariants}><WandSparkles size={16} /> Generate variants</Button>
              </div>
              {draft.variants.length ? (
                <div className="overflow-x-auto rounded-lg border border-black/10">
                  <table className="w-full min-w-[980px] text-left text-sm">
                    <thead className="bg-black/[0.03]">
                      <tr>
                        <th className="px-3 py-2">Variant</th>
                        <th className="px-3 py-2">SKU</th>
                        <th className="px-3 py-2">Price</th>
                        <th className="px-3 py-2">Cost</th>
                        <th className="px-3 py-2">Inventory</th>
                        <th className="px-3 py-2">Printful variant</th>
                        <th className="px-3 py-2">Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {draft.variants.map((variant, index) => (
                        <tr key={`${variant.title}-${index}`} className="border-t border-black/5">
                          <td className="px-3 py-2"><Input value={variant.title} onChange={(event) => updateVariant(index, "title", event.target.value)} /></td>
                          <td className="px-3 py-2"><Input value={variant.sku} onChange={(event) => updateVariant(index, "sku", event.target.value)} /></td>
                          <td className="px-3 py-2"><MoneyInput cents={variant.priceCents} onChange={(value) => updateVariant(index, "priceCents", value)} /></td>
                          <td className="px-3 py-2"><MoneyInput cents={variant.costCents} onChange={(value) => updateVariant(index, "costCents", value)} /></td>
                          <td className="px-3 py-2"><Input type="number" value={variant.inventoryQuantity} onChange={(event) => updateVariant(index, "inventoryQuantity", number(event.target.value))} /></td>
                          <td className="px-3 py-2"><Input value={variant.printfulVariantId} onChange={(event) => updateVariant(index, "printfulVariantId", event.target.value)} /></td>
                          <td className="px-3 py-2"><input type="checkbox" checked={variant.active} onChange={(event) => updateVariant(index, "active", event.target.checked)} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="rounded-md bg-black/[0.03] p-3 text-sm text-black/55">No variants yet. Add options and generate variants, or keep this as a single-SKU product.</p>}
            </div>
          </Section>

          <details className="rounded-lg border border-black/10 bg-white p-5" open>
            <summary className="cursor-pointer text-lg font-semibold">Shipping, taxes, and fulfillment</summary>
            <div className="mt-5 grid gap-6">
              <ToggleGrid>
                <Toggle label="Requires shipping" checked={draft.requiresShipping} onChange={(value) => update("requiresShipping", value)} />
                <Toggle label="Taxable" checked={draft.taxable} onChange={(value) => update("taxable", value)} />
                <Toggle label="Digital unlock included" checked={draft.digitalUnlockIncluded} onChange={(value) => update("digitalUnlockIncluded", value)} />
              </ToggleGrid>
              <div className="grid gap-4 sm:grid-cols-4">
                <Field label="Weight"><Input value={draft.weightValue} onChange={(event) => update("weightValue", event.target.value)} /></Field>
                <Field label="Weight unit"><Input value={draft.weightUnit} onChange={(event) => update("weightUnit", event.target.value)} /></Field>
                <Field label="Length"><Input value={draft.lengthValue} onChange={(event) => update("lengthValue", event.target.value)} /></Field>
                <Field label="Width"><Input value={draft.widthValue} onChange={(event) => update("widthValue", event.target.value)} /></Field>
                <Field label="Height"><Input value={draft.heightValue} onChange={(event) => update("heightValue", event.target.value)} /></Field>
                <Field label="Dimension unit"><Input value={draft.dimensionUnit} onChange={(event) => update("dimensionUnit", event.target.value)} /></Field>
                <SelectField label="Fulfillment" value={draft.fulfillmentType} onChange={(value) => update("fulfillmentType", value as ProductEditorInput["fulfillmentType"])}>
                  {["manual", "printful", "digital", "internal", "mixed"].map((value) => <option key={value} value={value}>{labelize(value)}</option>)}
                </SelectField>
                <Field label="Tax class ID"><Input value={draft.taxClassId} onChange={(event) => update("taxClassId", event.target.value)} /></Field>
              </div>
              {draft.fulfillmentType === "printful" ? (
                <div className="grid gap-4 rounded-lg border border-black/10 bg-black/[0.02] p-4 sm:grid-cols-2">
                  <Field label="Printful product ID"><Input value={draft.printfulProductId} onChange={(event) => update("printfulProductId", event.target.value)} /></Field>
                  <Field label="Printful sync product ID"><Input value={draft.printfulSyncProductId} onChange={(event) => update("printfulSyncProductId", event.target.value)} /></Field>
                  <p className="sm:col-span-2 text-sm text-black/55">Printful submission still runs only after verified payment. Configure `PRINTFUL_API_KEY` before production fulfillment.</p>
                </div>
              ) : null}
            </div>
          </details>

          <Section title="Scheduled discounts" detail="Create sale windows without changing the base price.">
            <div className="grid gap-3">
              {draft.discountSchedules.map((discount, index) => (
                <div key={`${discount.name}-${index}`} className="grid gap-3 rounded-lg border border-black/10 p-4 lg:grid-cols-6">
                  <Input value={discount.name} onChange={(event) => updateDiscount(index, "name", event.target.value)} />
                  <select className="rounded-md border border-black/15 px-3 py-2 text-sm" value={discount.type} onChange={(event) => updateDiscount(index, "type", event.target.value as ProductEditorInput["discountSchedules"][number]["type"])}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                    <option value="sale_price">Sale price</option>
                  </select>
                  <MoneyInput cents={discount.salePriceCents ?? discount.fixedCents ?? discount.percentageBps} onChange={(value) => updateDiscountAmount(index, value ?? 0)} />
                  <Input type="datetime-local" value={discount.startsAt} onChange={(event) => updateDiscount(index, "startsAt", event.target.value)} />
                  <Input type="datetime-local" value={discount.endsAt} onChange={(event) => updateDiscount(index, "endsAt", event.target.value)} />
                  <Button type="button" variant="ghost" onClick={() => removeDiscount(index)}><Trash2 size={16} /></Button>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={addDiscount}><Plus size={16} /> Add sale window</Button>
            </div>
          </Section>

          <details className="rounded-lg border border-black/10 bg-white p-5">
            <summary className="cursor-pointer text-lg font-semibold">SEO and advanced settings</summary>
            <div className="mt-5 grid gap-4">
              <Field label="Slug"><Input value={draft.slug} onChange={(event) => update("slug", slugifyProductTitle(event.target.value))} /></Field>
              <Field label="SEO title"><Input value={draft.seoTitle} onChange={(event) => update("seoTitle", event.target.value)} /></Field>
              <Field label="Meta description"><Textarea value={draft.seoDescription} onChange={(event) => update("seoDescription", event.target.value)} /></Field>
              <Field label="Canonical URL"><Input value={draft.canonicalUrl} onChange={(event) => update("canonicalUrl", event.target.value)} /></Field>
              <ToggleGrid>
                <Toggle label="Token-gated placeholder" checked={draft.tokenGated} onChange={(value) => update("tokenGated", value)} />
                <Toggle label="Affiliate eligible" checked={draft.affiliateEligible} onChange={(value) => update("affiliateEligible", value)} />
                <Toggle label="Blind box" checked={draft.blindBoxEligible} onChange={(value) => update("blindBoxEligible", value)} />
                <Toggle label="Booster pack" checked={draft.boosterPackEligible} onChange={(value) => update("boosterPackEligible", value)} />
              </ToggleGrid>
              <Field label="Odds disclosure URL"><Input value={draft.oddsDisclosureUrl} onChange={(event) => update("oddsDisclosureUrl", event.target.value)} /></Field>
              <Field label="Metadata JSON"><Textarea value={draft.metadataJson} onChange={(event) => update("metadataJson", event.target.value)} /></Field>
            </div>
          </details>
        </div>

        <aside className="grid h-fit gap-5 xl:sticky xl:top-24">
          <section className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="text-lg font-semibold">Product preview</h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-black/10">
              <div className="aspect-[4/3] bg-black/[0.03]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {draft.imageUrl ? <img src={draft.imageUrl} alt={draft.title} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {draft.isFeatured ? <Badge>Featured</Badge> : null}
                  {draft.isLimitedEdition ? <Badge>Limited</Badge> : null}
                  {draft.productType === "blind_box" ? <Badge>Blind Box</Badge> : null}
                  {draft.productType === "booster_pack" ? <Badge>Booster Pack</Badge> : null}
                </div>
                <h3 className="mt-3 font-semibold">{draft.title || "Product title"}</h3>
                <p className="mt-1 text-sm text-black/55">{draft.shortDescription || "Short product summary appears here."}</p>
                <p className="mt-3 font-semibold">{formatMoney(draft.priceCents)}</p>
                <p className="mt-1 text-xs text-black/45">{draft.inventoryQuantity} units - {draft.status}</p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="text-lg font-semibold">Organization</h2>
            <div className="mt-4 grid gap-3">
              <SelectField label="Status" value={draft.status} onChange={(value) => update("status", value as ProductEditorInput["status"])}>
                {["draft", "active", "hidden", "sold_out", "archived"].map((value) => <option key={value} value={value}>{labelize(value)}</option>)}
              </SelectField>
              <SelectField label="Visibility" value={draft.visibility} onChange={(value) => update("visibility", value as ProductEditorInput["visibility"])}>
                {["visible", "hidden", "catalog_only", "direct_link"].map((value) => <option key={value} value={value}>{labelize(value)}</option>)}
              </SelectField>
              <Field label="Category"><Input value={draft.categoryName} onChange={(event) => update("categoryName", event.target.value)} /></Field>
              <Field label="Collection"><Input value={draft.collectionName} onChange={(event) => update("collectionName", event.target.value)} /></Field>
              <Field label="Vendor / brand"><Input value={draft.vendor} onChange={(event) => update("vendor", event.target.value)} /></Field>
              <Field label="Tags"><Input value={draft.tags.join(", ")} onChange={(event) => update("tags", event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))} /></Field>
              <ToggleGrid>
                <Toggle label="Featured" checked={draft.isFeatured} onChange={(value) => update("isFeatured", value)} />
                <Toggle label="Limited edition" checked={draft.isLimitedEdition} onChange={(value) => update("isLimitedEdition", value)} />
              </ToggleGrid>
            </div>
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="text-lg font-semibold">Import / export</h2>
            <p className="mt-2 text-sm text-black/55">Preview CSV or JSON API imports. Import saves as draft unless rows specify another status.</p>
            <Textarea className="mt-4 min-h-24" value={csvText} onChange={(event) => setCsvText(event.target.value)} placeholder="title,slug,price,sku..." />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={() => previewCsv(false)}><Upload size={16} /> Preview CSV</Button>
              <Button type="button" variant="secondary" onClick={() => previewCsv(true)}>Import CSV</Button>
            </div>
            <Input className="mt-4" value={apiUrl} onChange={(event) => setApiUrl(event.target.value)} placeholder="https://api.example.com/products.json" />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={() => previewApi(false)}>Preview API</Button>
              <Button type="button" variant="secondary" onClick={() => previewApi(true)}>Import API</Button>
            </div>
            <Link className="mt-3 inline-flex text-sm font-medium underline" href="/templates/footprintshub-product-import-template.csv">
              <Download size={16} /> Download CSV template
            </Link>
            {importResult ? <p className="mt-3 rounded-md bg-black/[0.03] p-3 text-sm">{importResult}</p> : null}
          </section>

          {warnings.length ? (
            <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-semibold text-amber-900">Needs attention</h2>
              <ul className="mt-3 grid gap-2 text-sm text-amber-900">
                {warnings.map((warning) => <li key={warning}>{warning}</li>)}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );

  function updateMedia<K extends keyof ProductEditorInput["media"][number]>(index: number, key: K, value: ProductEditorInput["media"][number][K]) {
    update("media", draft.media.map((media, mediaIndex) => (mediaIndex === index ? { ...media, [key]: value } : media)));
  }

  function removeMedia(index: number) {
    update("media", draft.media.filter((_, mediaIndex) => mediaIndex !== index));
  }

  function setPrimaryMedia(index: number) {
    update("media", draft.media.map((media, mediaIndex) => ({ ...media, isPrimary: mediaIndex === index })));
    update("imageUrl", draft.media[index]?.url ?? draft.imageUrl);
  }

  function updateOption<K extends keyof ProductEditorInput["options"][number]>(index: number, key: K, value: ProductEditorInput["options"][number][K]) {
    update("options", draft.options.map((option, optionIndex) => (optionIndex === index ? { ...option, [key]: value } : option)));
  }

  function removeOption(index: number) {
    update("options", draft.options.filter((_, optionIndex) => optionIndex !== index));
  }

  function updateVariant<K extends keyof ProductEditorInput["variants"][number]>(index: number, key: K, value: ProductEditorInput["variants"][number][K]) {
    update("variants", draft.variants.map((variant, variantIndex) => (variantIndex === index ? { ...variant, [key]: value } : variant)));
  }

  function addDiscount() {
    const now = new Date();
    const later = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    update("discountSchedules", [
      ...draft.discountSchedules,
      {
        id: "",
        name: "Launch sale",
        type: "percentage",
        percentageBps: 1000,
        fixedCents: undefined,
        salePriceCents: undefined,
        startsAt: toDatetimeLocal(now),
        endsAt: toDatetimeLocal(later),
        active: true,
      },
    ]);
  }

  function updateDiscount<K extends keyof ProductEditorInput["discountSchedules"][number]>(index: number, key: K, value: ProductEditorInput["discountSchedules"][number][K]) {
    update("discountSchedules", draft.discountSchedules.map((discount, discountIndex) => (discountIndex === index ? { ...discount, [key]: value } : discount)));
  }

  function updateDiscountAmount(index: number, value: number) {
    const discount = draft.discountSchedules[index];
    if (!discount) return;
    if (discount.type === "percentage") updateDiscount(index, "percentageBps", value);
    if (discount.type === "fixed") updateDiscount(index, "fixedCents", value);
    if (discount.type === "sale_price") updateDiscount(index, "salePriceCents", value);
  }

  function removeDiscount(index: number) {
    update("discountSchedules", draft.discountSchedules.filter((_, discountIndex) => discountIndex !== index));
  }
}

function Section({ title, detail, children }: { title: string; detail?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-black/10 bg-white p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">{title}</h2>
        {detail ? <p className="mt-1 text-sm text-black/55">{detail}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

function SelectField({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode }) {
  return (
    <Field label={label}>
      <select className="min-h-10 rounded-md border border-black/15 bg-white px-3 py-2 text-sm" value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </Field>
  );
}

function MoneyField({ label, cents, onChange }: { label: string; cents?: number | null; onChange: (value: number | undefined) => void }) {
  return (
    <Field label={label}>
      <MoneyInput cents={cents} onChange={onChange} />
    </Field>
  );
}

function MoneyInput({ cents, onChange }: { cents?: number | null; onChange: (value: number | undefined) => void }) {
  return <Input type="number" step="0.01" value={cents == null ? "" : cents / 100} onChange={(event) => onChange(event.target.value === "" ? undefined : Math.round(Number(event.target.value) * 100))} />;
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <Field label={label}>
      <Input type="number" value={value} onChange={(event) => onChange(number(event.target.value))} />
    </Field>
  );
}

function ToggleGrid({ children }: { children: ReactNode }) {
  return <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-black/10 px-3 py-2 text-sm">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function Metric({ label, value, tone = "normal" }: { label: string; value: string; tone?: "normal" | "warn" }) {
  return (
    <div className={`rounded-lg border p-4 ${tone === "warn" ? "border-amber-200 bg-amber-50" : "border-black/10 bg-black/[0.02]"}`}>
      <p className="text-xs uppercase tracking-[0.16em] text-black/45">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function buildVariants(options: ProductEditorInput["options"]) {
  if (!options.length) return [];
  return options.reduce<Array<Record<string, string>>>((rows, option) => {
    const existingRows = rows.length ? rows : [{}];
    return existingRows.flatMap((row) => option.values.map((value) => ({ ...row, [option.name]: value })));
  }, []);
}

function number(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
}

function formatMoney(cents?: number | null) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((cents ?? 0) / 100);
}

function labelize(value: string) {
  return value.replaceAll("_", " ");
}

function toDatetimeLocal(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}
