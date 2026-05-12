import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRequestPermission } from "@/lib/auth/require-permission";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { FLAGSHIP_SHOP_ID } from "@/lib/catalog/seed-products";
import { slugifyProductTitle } from "@/lib/products/product-validation";

const schema = z.object({
  name: z.string().trim().min(2),
  locationKey: z.string().trim().min(2),
  dimensions: z.string().trim().optional().default(""),
  placementType: z.enum(["homepage_banner", "sidebar_banner", "newsletter_feature", "creator_page", "fan_club_page", "product_feature", "campaign_feature", "video_pre_roll", "social_post", "event_sponsor", "other"]).default("homepage_banner"),
  basePriceCents: z.coerce.number().int().min(0).default(0),
});

export async function POST(request: Request) {
  const permission = await requireRequestPermission(request, "canManageAds");
  if (!permission.ok) return permission.response;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid placement." }, { status: 400 });
  }
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: true, stored: false, placementId: `preview_${Date.now()}` });
  }

  const shop = await getPrisma().shop.findFirst({ where: { status: "active" }, orderBy: { createdAt: "asc" } });
  const placement = await getPrisma().adPlacement.create({
    data: {
      shopId: shop?.id ?? FLAGSHIP_SHOP_ID,
      name: parsed.data.name,
      slug: slugifyProductTitle(parsed.data.name),
      locationKey: parsed.data.locationKey,
      dimensions: parsed.data.dimensions || null,
      placementType: parsed.data.placementType,
      basePriceCents: parsed.data.basePriceCents,
      currency: "USD",
      allowedMediaTypes: ["image", "video", "text"],
      requiresApproval: true,
    },
  });

  return NextResponse.json({ ok: true, stored: true, placementId: placement.id });
}
