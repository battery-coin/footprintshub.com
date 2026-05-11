import { productEditorSchema } from "@/lib/products/product-validation";
import type { ProductEditorInput } from "@/lib/products/product-validation";

export function validateImportedProduct(input: unknown) {
  return productEditorSchema.safeParse(input);
}

export function findDuplicateSkus(products: ProductEditorInput[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  products.forEach((product) => {
    [product.sku, ...product.variants.map((variant) => variant.sku)]
      .filter((sku): sku is string => Boolean(sku))
      .forEach((sku) => {
        if (seen.has(sku)) {
          duplicates.add(sku);
        }
        seen.add(sku);
      });
  });

  return [...duplicates];
}
