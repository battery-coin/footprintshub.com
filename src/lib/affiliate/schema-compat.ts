import { getPrisma } from "@/lib/db/prisma";

export async function ensureAffiliateProgramActivePlanColumn() {
  const prisma = getPrisma();

  await prisma.$executeRawUnsafe('ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "activePlanId" TEXT');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "AffiliateProgram_activePlanId_idx" ON "AffiliateProgram"("activePlanId")');
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
}
