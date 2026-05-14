import { getPrisma } from "@/lib/db/prisma";

export async function ensureAffiliateProgramActivePlanColumn() {
  const prisma = getPrisma();

  await prisma.$executeRawUnsafe(`
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AffiliateStructureType') THEN
    CREATE TYPE "AffiliateStructureType" AS ENUM ('binary', 'matrix', 'unilevel');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BinaryPayoutBasis') THEN
    CREATE TYPE "BinaryPayoutBasis" AS ENUM ('weaker_leg_volume', 'pair_matching', 'direct_purchase_volume');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BinarySpilloverMode') THEN
    CREATE TYPE "BinarySpilloverMode" AS ENUM ('auto_left', 'auto_right', 'weaker_leg', 'manual', 'balanced');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MatrixSpilloverMode') THEN
    CREATE TYPE "MatrixSpilloverMode" AS ENUM ('breadth_first', 'depth_first', 'manual', 'auto_fill');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MatrixLevelCommissionMode') THEN
    CREATE TYPE "MatrixLevelCommissionMode" AS ENUM ('per_level_percentage', 'per_member_fixed', 'level_completion');
  END IF;
END $$;
`);

  await prisma.$executeRawUnsafe('ALTER TYPE "CommissionBase" ADD VALUE IF NOT EXISTS \'direct_commission\'');
  await prisma.$executeRawUnsafe('ALTER TYPE "CommissionBase" ADD VALUE IF NOT EXISTS \'leg_volume\'');
  await prisma.$executeRawUnsafe('ALTER TYPE "CommissionBase" ADD VALUE IF NOT EXISTS \'weaker_leg_volume\'');
  await prisma.$executeRawUnsafe('ALTER TYPE "CommissionBase" ADD VALUE IF NOT EXISTS \'matrix_level_volume\'');
  await prisma.$executeRawUnsafe('ALTER TYPE "CommissionBase" ADD VALUE IF NOT EXISTS \'gross_margin\'');

  await prisma.$executeRawUnsafe('ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "activePlanId" TEXT');
  await prisma.$executeRawUnsafe('ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "defaultPlanType" "AffiliateStructureType"');
  await prisma.$executeRawUnsafe(`
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'AffiliateProgram'
      AND column_name = 'defaultPlanType'
      AND udt_name <> 'AffiliateStructureType'
  ) THEN
    ALTER TABLE "AffiliateProgram"
      ALTER COLUMN "defaultPlanType" DROP DEFAULT,
      ALTER COLUMN "defaultPlanType" TYPE "AffiliateStructureType"
      USING (
        CASE
          WHEN "defaultPlanType" IN ('binary', 'matrix', 'unilevel') THEN "defaultPlanType"::"AffiliateStructureType"
          ELSE NULL
        END
      );
  END IF;
END $$;
`);
  await prisma.$executeRawUnsafe('ALTER TABLE "AffiliatePlan" ADD COLUMN IF NOT EXISTS "structureType" "AffiliateStructureType" NOT NULL DEFAULT \'unilevel\'');
  await prisma.$executeRawUnsafe('ALTER TABLE "AffiliatePlanLevel" ADD COLUMN IF NOT EXISTS "structureType" "AffiliateStructureType" NOT NULL DEFAULT \'unilevel\'');
  await prisma.$executeRawUnsafe('ALTER TABLE "AffiliatePlanLevel" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "AffiliateProgram_activePlanId_idx" ON "AffiliateProgram"("activePlanId")');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "AffiliatePlan_shopId_structureType_idx" ON "AffiliatePlan"("shopId", "structureType")');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "AffiliatePlanLevel_shopId_structureType_idx" ON "AffiliatePlanLevel"("shopId", "structureType")');
  await prisma.$executeRawUnsafe(`
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'AffiliateProgram_activePlanId_fkey'
  ) THEN
    ALTER TABLE "AffiliateProgram"
      ADD CONSTRAINT "AffiliateProgram_activePlanId_fkey"
      FOREIGN KEY ("activePlanId")
      REFERENCES "AffiliatePlan"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE;
  END IF;
END $$;
`);

  await prisma.$executeRawUnsafe(`
CREATE TABLE IF NOT EXISTS "BinaryPlanConfig" (
  "id" TEXT NOT NULL,
  "shopId" TEXT NOT NULL,
  "affiliatePlanId" TEXT NOT NULL,
  "leftLabel" TEXT NOT NULL DEFAULT 'Left Team',
  "rightLabel" TEXT NOT NULL DEFAULT 'Right Team',
  "payoutBasis" "BinaryPayoutBasis" NOT NULL DEFAULT 'weaker_leg_volume',
  "pairRatioLeft" INTEGER NOT NULL DEFAULT 1,
  "pairRatioRight" INTEGER NOT NULL DEFAULT 1,
  "pairCommissionType" "CommissionType" NOT NULL DEFAULT 'percentage',
  "pairCommissionBps" INTEGER,
  "pairFixedCents" INTEGER,
  "spilloverMode" "BinarySpilloverMode" NOT NULL DEFAULT 'weaker_leg',
  "carryForwardVolume" BOOLEAN NOT NULL DEFAULT true,
  "flushAfterPayout" BOOLEAN NOT NULL DEFAULT false,
  "maxPairsPerPeriod" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BinaryPlanConfig_pkey" PRIMARY KEY ("id")
);
`);
  await prisma.$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS "BinaryPlanConfig_affiliatePlanId_key" ON "BinaryPlanConfig"("affiliatePlanId")');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "BinaryPlanConfig_shopId_idx" ON "BinaryPlanConfig"("shopId")');

  await prisma.$executeRawUnsafe(`
CREATE TABLE IF NOT EXISTS "MatrixPlanConfig" (
  "id" TEXT NOT NULL,
  "shopId" TEXT NOT NULL,
  "affiliatePlanId" TEXT NOT NULL,
  "width" INTEGER NOT NULL DEFAULT 3,
  "depth" INTEGER NOT NULL DEFAULT 7,
  "spilloverMode" "MatrixSpilloverMode" NOT NULL DEFAULT 'breadth_first',
  "completionBonusEnabled" BOOLEAN NOT NULL DEFAULT false,
  "completionBonusCents" INTEGER,
  "levelCommissionMode" "MatrixLevelCommissionMode" NOT NULL DEFAULT 'per_level_percentage',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MatrixPlanConfig_pkey" PRIMARY KEY ("id")
);
`);
  await prisma.$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS "MatrixPlanConfig_affiliatePlanId_key" ON "MatrixPlanConfig"("affiliatePlanId")');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "MatrixPlanConfig_shopId_idx" ON "MatrixPlanConfig"("shopId")');

  await prisma.$executeRawUnsafe(`
CREATE TABLE IF NOT EXISTS "UnilevelPlanConfig" (
  "id" TEXT NOT NULL,
  "shopId" TEXT NOT NULL,
  "affiliatePlanId" TEXT NOT NULL,
  "unlimitedFrontline" BOOLEAN NOT NULL DEFAULT true,
  "maxDepth" INTEGER NOT NULL DEFAULT 7,
  "compressionBehavior" "AffiliateCompressionBehavior" NOT NULL DEFAULT 'pay_zero',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UnilevelPlanConfig_pkey" PRIMARY KEY ("id")
);
`);
  await prisma.$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS "UnilevelPlanConfig_affiliatePlanId_key" ON "UnilevelPlanConfig"("affiliatePlanId")');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "UnilevelPlanConfig_shopId_idx" ON "UnilevelPlanConfig"("shopId")');
}
