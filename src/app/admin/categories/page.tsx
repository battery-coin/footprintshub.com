import { AdminShell } from "@/components/admin/admin-shell";
import { EditRowLink } from "@/components/admin/edit-row-link";
import { ButtonLink } from "@/components/ui/button";

const plannedCategories = ["Footprints", "Matrix Decoded", "Hero Studio", "Battery Movement", "Digital Unlocks"];

export default function AdminCategoriesPage() {
  return (
    <AdminShell requiredPermission="canManageCatalog">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Categories</h1>
          <p className="mt-2 text-sm text-black/55">Magento-style category trees are scaffolded in Prisma.</p>
        </div>
        <ButtonLink href="/admin/products/new" variant="secondary">
          Assign products
        </ButtonLink>
      </div>
      <div className="mt-6 grid gap-3">
        {plannedCategories.map((category) => (
          <div key={category} className="flex flex-col gap-3 rounded-lg border border-black/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{category}</p>
              <p className="mt-1 text-sm text-black/55">Ready for slug, SEO metadata, image, parent, and sort order.</p>
            </div>
            <EditRowLink href={`/admin/categories?edit=${encodeURIComponent(category.toLowerCase().replaceAll(" ", "-"))}`} />
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

