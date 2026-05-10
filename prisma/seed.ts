import { Prisma, PrismaClient } from "@prisma/client";
import { seedProducts } from "../src/lib/catalog/seed-products";

const prisma = new PrismaClient();

async function main() {
  const shop = await prisma.shop.upsert({
    where: { slug: "footprintshub" },
    update: {
      name: "FootprintsHub",
      status: "active",
      description:
        "Flagship commerce shop for Footprints, Matrix Decoded, Hero Studio drops, collectibles, merch, and digital unlocks.",
    },
    create: {
      name: "FootprintsHub",
      slug: "footprintshub",
      subdomain: "shop",
      customDomain: "footprintshub.com",
      status: "active",
      description:
        "Flagship commerce shop for Footprints, Matrix Decoded, Hero Studio drops, collectibles, merch, and digital unlocks.",
      domains: {
        create: [
          { hostname: "footprintshub.com", type: "root_domain", status: "active" },
          { hostname: "www.footprintshub.com", type: "root_domain", status: "active" },
        ],
      },
    },
  });

  const taxClass = await prisma.taxClass.upsert({
    where: {
      shopId_code: {
        shopId: shop.id,
        code: "standard",
      },
    },
    update: {
      name: "Standard taxable goods",
      taxable: true,
    },
    create: {
      id: "tax_standard_footprintshub",
      shopId: shop.id,
      name: "Standard taxable goods",
      code: "standard",
      taxable: true,
    },
  });

  await prisma.shippingMethod.upsert({
    where: {
      shopId_code: {
        shopId: shop.id,
        code: "flat_rate",
      },
    },
    update: {
      name: "Flat rate shipping",
      priceCents: 799,
      freeShippingThresholdCents: 10000,
      active: true,
    },
    create: {
      id: "ship_flat_rate_footprintshub",
      shopId: shop.id,
      name: "Flat rate shipping",
      code: "flat_rate",
      type: "flat_rate",
      priceCents: 799,
      freeShippingThresholdCents: 10000,
      active: true,
    },
  });

  const categories = [
    ["cat_footprints", "Footprints", "footprints"],
    ["cat_matrix_decoded", "Matrix Decoded", "matrix-decoded"],
    ["cat_hero_studio", "Hero Studio", "hero-studio"],
    ["cat_battery_movement", "Battery Movement", "battery-movement"],
    ["cat_digital_unlocks", "Digital Unlocks", "digital-unlocks"],
  ] as const;
  const categoryByFranchise = new Map<string, string>();

  for (const [id, name, slug] of categories) {
    const category = await prisma.category.upsert({
      where: {
        shopId_slug: {
          shopId: shop.id,
          slug,
        },
      },
      update: {
        name,
        active: true,
      },
      create: {
        id,
        shopId: shop.id,
        name,
        slug,
        active: true,
      },
    });

    categoryByFranchise.set(slug.replaceAll("-", "_"), category.id);
  }

  const featuredCollection = await prisma.collection.upsert({
    where: {
      shopId_slug: {
        shopId: shop.id,
        slug: "featured-drops",
      },
    },
    update: {
      name: "Featured drops",
      active: true,
    },
    create: {
      id: "collection_featured_drops",
      shopId: shop.id,
      name: "Featured drops",
      slug: "featured-drops",
      active: true,
    },
  });

  for (const product of seedProducts) {
    const metadata = product.metadata as Prisma.InputJsonValue | undefined;

    const savedProduct = await prisma.product.upsert({
      where: {
        shopId_slug: {
          shopId: shop.id,
          slug: product.slug,
        },
      },
      update: {
        title: product.title,
        taxClassId: product.productType === "digital" ? null : taxClass.id,
        subtitle: product.subtitle,
        description: product.description,
        shortDescription: product.shortDescription,
        productType: product.productType,
        franchise: product.franchise,
        status: product.status,
        priceCents: product.priceCents,
        compareAtPriceCents: product.compareAtPriceCents,
        currency: product.currency,
        sku: product.sku,
        inventoryQuantity: product.inventoryQuantity,
        trackInventory: product.trackInventory,
        requiresShipping: !["digital", "digital_unlock", "service"].includes(product.productType),
        imageUrl: product.imageUrl,
        galleryUrls: product.galleryUrls,
        seoTitle: product.title,
        seoDescription: product.shortDescription,
        isFeatured: product.isFeatured,
        isLimitedEdition: product.isLimitedEdition,
        preorderStatus: product.preorderStatus,
        digitalUnlockIncluded: product.digitalUnlockIncluded,
        tokenGated: product.tokenGated,
        metadata,
      },
      create: {
        shopId: shop.id,
        taxClassId: product.productType === "digital" ? null : taxClass.id,
        title: product.title,
        slug: product.slug,
        subtitle: product.subtitle,
        description: product.description,
        shortDescription: product.shortDescription,
        productType: product.productType,
        franchise: product.franchise,
        status: product.status,
        priceCents: product.priceCents,
        compareAtPriceCents: product.compareAtPriceCents,
        currency: product.currency,
        sku: product.sku,
        inventoryQuantity: product.inventoryQuantity,
        trackInventory: product.trackInventory,
        requiresShipping: !["digital", "digital_unlock", "service"].includes(product.productType),
        imageUrl: product.imageUrl,
        galleryUrls: product.galleryUrls,
        seoTitle: product.title,
        seoDescription: product.shortDescription,
        isFeatured: product.isFeatured,
        isLimitedEdition: product.isLimitedEdition,
        preorderStatus: product.preorderStatus,
        digitalUnlockIncluded: product.digitalUnlockIncluded,
        tokenGated: product.tokenGated,
        metadata,
      },
    });

    const categoryId = categoryByFranchise.get(product.franchise);

    if (categoryId) {
      await prisma.productCategory.upsert({
        where: {
          productId_categoryId: {
            productId: savedProduct.id,
            categoryId,
          },
        },
        update: {},
        create: {
          productId: savedProduct.id,
          categoryId,
        },
      });
    }

    if (product.isFeatured) {
      await prisma.productCollection.upsert({
        where: {
          productId_collectionId: {
            productId: savedProduct.id,
            collectionId: featuredCollection.id,
          },
        },
        update: {},
        create: {
          productId: savedProduct.id,
          collectionId: featuredCollection.id,
        },
      });
    }
  }

  const affiliateProgram = await prisma.affiliateProgram.upsert({
    where: { id: "affiliate_program_footprintshub" },
    update: {
      name: "FootprintsHub Ambassador Program",
      status: "active",
      attributionModel: "last_touch",
      cookieDays: 30,
      allowMultiLevel: true,
      maxLevels: 7,
      maxCommissionPoolBps: 2000,
      defaultCommissionType: "percentage",
      defaultCommissionValue: 1000,
      commissionBase: "product_subtotal",
      autoApproveCommissions: false,
      holdDays: 30,
      blockOwnReferrals: true,
      blockSaleItems: false,
      minPayoutCents: 5000,
      withdrawalFeeCents: 0,
      allowCouponGeneration: true,
      minCouponGenerationCents: 2500,
    },
    create: {
      id: "affiliate_program_footprintshub",
      shopId: shop.id,
      name: "FootprintsHub Ambassador Program",
      status: "active",
      attributionModel: "last_touch",
      cookieDays: 30,
      allowMultiLevel: true,
      maxLevels: 7,
      maxCommissionPoolBps: 2000,
      defaultCommissionType: "percentage",
      defaultCommissionValue: 1000,
      commissionBase: "product_subtotal",
      autoApproveCommissions: false,
      holdDays: 30,
      blockOwnReferrals: true,
      blockSaleItems: false,
      minPayoutCents: 5000,
      withdrawalFeeCents: 0,
      allowCouponGeneration: true,
      minCouponGenerationCents: 2500,
    },
  });

  await prisma.commissionRule.upsert({
    where: { id: "commission_rule_footprintshub_direct_default" },
    update: {
      shopId: shop.id,
      affiliateProgramId: affiliateProgram.id,
      scope: "global",
      type: "percentage",
      percentageBps: 1000,
      fixedCents: null,
      priority: 0,
      active: true,
    },
    create: {
      id: "commission_rule_footprintshub_direct_default",
      shopId: shop.id,
      affiliateProgramId: affiliateProgram.id,
      scope: "global",
      type: "percentage",
      percentageBps: 1000,
      priority: 0,
      active: true,
    },
  });

  const levelRates = [
    { depth: 1, bps: 200 },
    { depth: 2, bps: 100 },
    { depth: 3, bps: 75 },
    { depth: 4, bps: 50 },
    { depth: 5, bps: 25 },
    { depth: 6, bps: 25 },
    { depth: 7, bps: 25 },
  ];

  for (const level of levelRates) {
    await prisma.multiLevelCommissionRule.upsert({
      where: {
        affiliateProgramId_levelDepth: {
          affiliateProgramId: affiliateProgram.id,
          levelDepth: level.depth,
        },
      },
      update: {
        shopId: shop.id,
        type: "percentage",
        percentageBps: level.bps,
        fixedCents: null,
        commissionBase: "order_subtotal",
        maxPerOrderCents: null,
        maxPerMonthCents: null,
        active: true,
      },
      create: {
        id: `multi_level_rule_footprintshub_${level.depth}`,
        shopId: shop.id,
        affiliateProgramId: affiliateProgram.id,
        levelDepth: level.depth,
        type: "percentage",
        percentageBps: level.bps,
        commissionBase: "order_subtotal",
        active: true,
      },
    });
  }

  const ranks = [
    ["rank_bronze", "Bronze", 10, 0],
    ["rank_silver", "Silver", 20, 100],
    ["rank_gold", "Gold", 30, 200],
    ["rank_platinum", "Platinum", 40, 300],
    ["rank_founder_ambassador", "Founder Ambassador", 50, 500],
    ["rank_creator_partner", "Creator Partner", 60, 500],
  ] as const;

  for (const [id, name, priority, commissionBonusBps] of ranks) {
    await prisma.affiliateRank.upsert({
      where: {
        shopId_name: {
          shopId: shop.id,
          name,
        },
      },
      update: {
        priority,
        commissionBonusBps,
        active: true,
      },
      create: {
        id,
        shopId: shop.id,
        name,
        priority,
        commissionBonusBps,
        active: true,
        description: `${name} affiliate rank for qualified purchase commissions.`,
      },
    });
  }

  await prisma.affiliate.upsert({
    where: {
      shopId_referralCode: {
        shopId: shop.id,
        referralCode: "FOUNDER",
      },
    },
    update: {
      email: "affiliate@example.com",
      name: "Founder Ambassador Demo",
      status: "approved",
      approvedAt: new Date(),
      termsAcceptedAt: new Date(),
      disclosureAcceptedAt: new Date(),
      payoutMethod: "store_credit",
      notes: "Seed affiliate for local referral and attribution testing.",
    },
    create: {
      id: "affiliate_founder_demo",
      shopId: shop.id,
      email: "affiliate@example.com",
      name: "Founder Ambassador Demo",
      referralCode: "FOUNDER",
      status: "approved",
      approvedAt: new Date(),
      termsAcceptedAt: new Date(),
      disclosureAcceptedAt: new Date(),
      payoutMethod: "store_credit",
      notes: "Seed affiliate for local referral and attribution testing.",
    },
  });

  await prisma.marketingAsset.upsert({
    where: { id: "marketing_asset_footprintshub_founder_banner" },
    update: {
      shopId: shop.id,
      title: "Founder Bundle Banner",
      type: "banner",
      targetUrl: "/products/founder-decoder-bundle",
      imageUrl: "/product-placeholders/founder-decoder.svg",
      width: 1200,
      height: 630,
      active: true,
    },
    create: {
      id: "marketing_asset_footprintshub_founder_banner",
      shopId: shop.id,
      title: "Founder Bundle Banner",
      type: "banner",
      targetUrl: "/products/founder-decoder-bundle",
      imageUrl: "/product-placeholders/founder-decoder.svg",
      width: 1200,
      height: 630,
      active: true,
    },
  });

  const welcomeRule = await prisma.discountRule.upsert({
    where: { id: "discount_rule_welcome_footprintshub" },
    update: {
      shopId: shop.id,
      name: "Welcome supporter discount",
      scope: "cart",
      type: "percent",
      value: 1000,
      minSubtotalCents: 2500,
      active: true,
    },
    create: {
      id: "discount_rule_welcome_footprintshub",
      shopId: shop.id,
      name: "Welcome supporter discount",
      scope: "cart",
      type: "percent",
      value: 1000,
      minSubtotalCents: 2500,
      active: true,
    },
  });

  await prisma.discountCode.upsert({
    where: {
      shopId_code: {
        shopId: shop.id,
        code: "WELCOME10",
      },
    },
    update: {
      discountRuleId: welcomeRule.id,
      type: "percent",
      value: 1000,
      minSubtotalCents: 2500,
      active: true,
    },
    create: {
      id: "discount_code_welcome10",
      shopId: shop.id,
      discountRuleId: welcomeRule.id,
      code: "WELCOME10",
      type: "percent",
      value: 1000,
      minSubtotalCents: 2500,
      active: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
