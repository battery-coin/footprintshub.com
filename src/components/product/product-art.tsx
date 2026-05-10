import Image from "next/image";
import type { CatalogProduct } from "@/lib/catalog/types";

export function ProductArt({ product, priority = false }: { product: CatalogProduct; priority?: boolean }) {
  if (product.imageUrl) {
    return (
      <Image
        src={product.imageUrl}
        alt=""
        width={900}
        height={900}
        priority={priority}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="product-art flex h-full w-full items-end p-6 text-white">
      <span className="text-sm font-medium uppercase tracking-[0.18em]">{product.franchise.replaceAll("_", " ")}</span>
    </div>
  );
}
