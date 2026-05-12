import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { adCreativeInputSchema, validateSafeAdTargetUrl } from "./creative-validation";

export async function submitAdCreative(input: unknown) {
  const parsed = adCreativeInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, status: 400, error: "Invalid creative submission.", details: parsed.error.flatten() };
  }

  if (!validateSafeAdTargetUrl(parsed.data.targetUrl)) {
    return { ok: false as const, status: 400, error: "Target URL must be a safe http or https URL." };
  }

  if (!hasDatabaseUrl()) {
    return { ok: true as const, stored: false, creativeId: `preview_${Date.now()}` };
  }

  const prisma = getPrisma();
  const campaign = await prisma.adCampaign.findUnique({ where: { id: parsed.data.campaignId } });
  if (!campaign) {
    return { ok: false as const, status: 404, error: "Ad campaign not found." };
  }

  const creative = await prisma.adCreative.create({
    data: {
      shopId: campaign.shopId,
      adCampaignId: campaign.id,
      type: parsed.data.type,
      title: parsed.data.title || null,
      imageUrl: parsed.data.imageUrl || null,
      videoUrl: parsed.data.videoUrl || null,
      text: parsed.data.text || parsed.data.notes || null,
      targetUrl: parsed.data.targetUrl,
      altText: parsed.data.altText || null,
      status: "pending_review",
    },
  });

  await prisma.adCampaign.update({
    where: { id: campaign.id },
    data: { status: "pending_review", targetUrl: parsed.data.targetUrl, customerNotes: parsed.data.notes || campaign.customerNotes },
  });

  return { ok: true as const, stored: true, creativeId: creative.id };
}
