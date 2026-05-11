import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.PLATFORM_OWNER_EMAIL?.trim().toLowerCase();

  if (!email) {
    throw new Error("PLATFORM_OWNER_EMAIL is required. Set it to David Kam's login email first.");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log(`No user exists for ${email}. Create/sign in with David Kam's account, then run this bootstrap again.`);
    return;
  }

  const existing = await prisma.userAppRole.findFirst({
    where: { userId: user.id, role: "owner", shopId: null },
  });

  if (existing) {
    await prisma.userAppRole.update({
      where: { id: existing.id },
      data: { revokedAt: null, notes: "Owner bootstrap refreshed." },
    });
  } else {
    await prisma.userAppRole.create({
      data: {
        userId: user.id,
        role: "owner",
        notes: "Owner bootstrap.",
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "owner.bootstrap",
      targetUserId: user.id,
      targetType: "user",
      targetId: user.id,
      category: "roles",
      severity: "critical",
      metadata: { email },
    },
  });

  console.log(`Owner role is active for ${email}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
