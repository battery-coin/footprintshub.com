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

  const affiliatePlan = await prisma.affiliatePlan.upsert({
    where: { id: "affiliate_plan_footprintshub_7_level" },
    update: {
      shopId: shop.id,
      affiliateProgramId: affiliateProgram.id,
      name: "FootprintsHub 7-Level Ambassador Plan",
      description:
        "Purchase-only ambassador commission plan with capped direct and ancestor commissions. No commission is paid for recruitment alone.",
      status: "active",
      planType: "seven_level",
      isDefault: true,
      currency: "USD",
      maxActiveLevels: 7,
      maxCommissionPoolBps: 2000,
      maxCommissionPoolCents: null,
      allowLifetimeAttribution: true,
      lifetimeAttributionDays: null,
      attributionModel: "coupon_priority",
      cookieDays: 30,
      holdDays: 14,
      autoApproveCommissions: false,
      blockOwnReferrals: true,
      blockSaleItems: false,
      allowStoreCreditPayout: true,
      allowCashPayout: false,
    },
    create: {
      id: "affiliate_plan_footprintshub_7_level",
      shopId: shop.id,
      affiliateProgramId: affiliateProgram.id,
      name: "FootprintsHub 7-Level Ambassador Plan",
      description:
        "Purchase-only ambassador commission plan with capped direct and ancestor commissions. No commission is paid for recruitment alone.",
      status: "active",
      planType: "seven_level",
      isDefault: true,
      currency: "USD",
      maxActiveLevels: 7,
      maxCommissionPoolBps: 2000,
      allowLifetimeAttribution: true,
      attributionModel: "coupon_priority",
      cookieDays: 30,
      holdDays: 14,
      autoApproveCommissions: false,
      blockOwnReferrals: true,
      blockSaleItems: false,
      allowStoreCreditPayout: true,
      allowCashPayout: false,
    },
  });

  await prisma.commissionRule.upsert({
    where: { id: "commission_rule_footprintshub_direct_default" },
    update: {
      shopId: shop.id,
      affiliateProgramId: affiliateProgram.id,
      planId: affiliatePlan.id,
      businessModelType: "seven_level",
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
      planId: affiliatePlan.id,
      businessModelType: "seven_level",
      scope: "global",
      type: "percentage",
      percentageBps: 1000,
      priority: 0,
      active: true,
    },
  });

  const levelRates = [
    { depth: 0, bps: 1000, label: "Direct referring affiliate" },
    { depth: 1, bps: 200, label: "Parent ambassador" },
    { depth: 2, bps: 150, label: "Grandparent ambassador" },
    { depth: 3, bps: 100, label: "Third-level ambassador" },
    { depth: 4, bps: 75, label: "Fourth-level ambassador" },
    { depth: 5, bps: 50, label: "Fifth-level ambassador" },
    { depth: 6, bps: 25 },
    { depth: 7, bps: 25 },
  ];

  for (const level of levelRates) {
    await prisma.affiliatePlanLevel.upsert({
      where: {
        affiliatePlanId_levelDepth: {
          affiliatePlanId: affiliatePlan.id,
          levelDepth: level.depth,
        },
      },
      update: {
        shopId: shop.id,
        label:
          level.label ??
          (level.depth === 6 ? "Sixth-level ambassador" : level.depth === 7 ? "Seventh-level ambassador" : `Level ${level.depth}`),
        enabled: true,
        commissionType: "percentage",
        percentageBps: level.bps,
        fixedCents: null,
        commissionBase: "product_subtotal",
        maxPerOrderCents: null,
        maxPerMonthCents: null,
        requiresRankId: null,
        compressionBehavior: "pay_zero",
      },
      create: {
        id: `affiliate_plan_level_footprintshub_${level.depth}`,
        shopId: shop.id,
        affiliatePlanId: affiliatePlan.id,
        levelDepth: level.depth,
        label:
          level.label ??
          (level.depth === 6 ? "Sixth-level ambassador" : level.depth === 7 ? "Seventh-level ambassador" : `Level ${level.depth}`),
        enabled: true,
        commissionType: "percentage",
        percentageBps: level.bps,
        commissionBase: "product_subtotal",
        compressionBehavior: "pay_zero",
      },
    });

    if (level.depth === 0) {
      continue;
    }

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
    ["rank_bronze", "Bronze", 10, 0, 0, 0],
    ["rank_silver", "Silver", 20, 1, 100, 50000],
    ["rank_gold", "Gold", 30, 3, 200, 150000],
    ["rank_platinum", "Platinum", 40, 5, 300, 500000],
    ["rank_founder_ambassador", "Founder Ambassador", 50, 7, 500, 0],
    ["rank_creator_partner", "Creator Partner", 60, 7, 500, 0],
  ] as const;

  for (const [id, name, priority, maxPaidLevels, commissionBonusBps, monthlySalesRequiredCents] of ranks) {
    await prisma.affiliateRank.upsert({
      where: {
        shopId_name: {
          shopId: shop.id,
          name,
        },
      },
      update: {
        priority,
        maxPaidLevels,
        commissionBonusBps,
        directCommissionBonusBps: commissionBonusBps,
        monthlySalesRequiredCents,
        active: true,
      },
      create: {
        id,
        shopId: shop.id,
        name,
        priority,
        maxPaidLevels,
        commissionBonusBps,
        directCommissionBonusBps: commissionBonusBps,
        monthlySalesRequiredCents,
        active: true,
        description: `${name} affiliate rank for qualified purchase commissions.`,
      },
    });
  }

  const performanceTiers = [
    ["tier_starter", "Starter", 10, 0, 99999, 800, 0],
    ["tier_builder", "Builder", 20, 100000, 499999, 1000, 3],
    ["tier_leader", "Leader", 30, 500000, null, 1200, 7],
  ] as const;

  for (const [id, name, priority, minValue, maxValue, directCommissionBps, maxPaidLevels] of performanceTiers) {
    await prisma.affiliatePerformanceTier.upsert({
      where: {
        affiliatePlanId_name: {
          affiliatePlanId: affiliatePlan.id,
          name,
        },
      },
      update: {
        shopId: shop.id,
        priority,
        metric: "monthly_sales",
        minValue,
        maxValue,
        directCommissionBps,
        maxPaidLevels,
        active: true,
      },
      create: {
        id,
        shopId: shop.id,
        affiliatePlanId: affiliatePlan.id,
        name,
        priority,
        metric: "monthly_sales",
        minValue,
        maxValue,
        directCommissionBps,
        maxPaidLevels,
        active: true,
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
      activePlanId: affiliatePlan.id,
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
      activePlanId: affiliatePlan.id,
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
