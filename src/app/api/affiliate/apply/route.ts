import { NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabaseUrl, getPrisma } from "@/lib/db/prisma";

const applicationSchema = z.object({
  shopId: z.string().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  notes: z.string().max(2000).optional(),
  parentReferralCode: z.string().optional(),
  acceptedTerms: z.literal(true),
  acceptedDisclosure: z.literal(true),
});

export async function POST(request: Request) {
  const parsed = applicationSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid affiliate application." }, { status: 400 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      accepted: true,
      stored: false,
      message: "Application payload is valid. Configure DATABASE_URL to persist applications.",
    });
  }

  const prisma = getPrisma();
  const shop = await prisma.shop.findFirst({
    where: parsed.data.shopId ? { id: parsed.data.shopId } : { slug: "footprintshub" },
  });

  if (!shop) {
    return NextResponse.json({ error: "Shop not found." }, { status: 404 });
  }

  const referralCode = await generateReferralCode(parsed.data.name, shop.id);
  const parentAffiliate = parsed.data.parentReferralCode
    ? await prisma.affiliate.findFirst({
        where: {
          shopId: shop.id,
          referralCode: parsed.data.parentReferralCode.toUpperCase(),
          status: "approved",
        },
      })
    : null;
  const parentClosures = parentAffiliate
    ? await prisma.affiliateTreeClosure.findMany({
        where: {
          shopId: shop.id,
          descendantAffiliateId: parentAffiliate.id,
        },
        orderBy: { depth: "asc" },
      })
    : [];

  const affiliate = await prisma.$transaction(async (tx) => {
    const created = await tx.affiliate.create({
      data: {
        shopId: shop.id,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        referralCode,
        status: "pending",
        parentAffiliateId: parentAffiliate?.id,
        notes: parsed.data.notes,
        termsAcceptedAt: new Date(),
        disclosureAcceptedAt: new Date(),
      },
    });

    await tx.affiliateTreeClosure.createMany({
      data: [
        {
          shopId: shop.id,
          ancestorAffiliateId: created.id,
          descendantAffiliateId: created.id,
          depth: 0,
        },
        ...(parentAffiliate
          ? [
              {
                shopId: shop.id,
                ancestorAffiliateId: parentAffiliate.id,
                descendantAffiliateId: created.id,
                depth: 1,
              },
              ...parentClosures
                .filter((closure) => closure.depth > 0)
                .map((closure) => ({
                  shopId: shop.id,
                  ancestorAffiliateId: closure.ancestorAffiliateId,
                  descendantAffiliateId: created.id,
                  depth: closure.depth + 1,
                })),
            ]
          : []),
      ],
      skipDuplicates: true,
    });

    await tx.affiliateAuditLog.create({
      data: {
        shopId: shop.id,
        affiliateId: created.id,
        action: "affiliate_application_created",
        entityType: "Affiliate",
        entityId: created.id,
        after: {
          status: created.status,
          referralCode: created.referralCode,
          parentAffiliateId: parentAffiliate?.id,
        },
      },
    });

    return created;
  });

  return NextResponse.json({ accepted: true, stored: true, affiliateId: affiliate.id }, { status: 201 });
}

async function generateReferralCode(name: string, shopId: string) {
  const prisma = getPrisma();
  const base = name.replace(/[^a-z0-9]/gi, "").slice(0, 10).toUpperCase() || "PARTNER";

  for (let index = 0; index < 20; index += 1) {
    const code = index === 0 ? base : `${base}${index + 1}`;
    const existing = await prisma.affiliate.findFirst({ where: { shopId, referralCode: code } });
    if (!existing) {
      return code;
    }
  }

  return `${base}${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}
