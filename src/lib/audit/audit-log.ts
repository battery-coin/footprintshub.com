import "server-only";

import type { Prisma } from "@prisma/client";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

type AuditInput = {
  actorId?: string | null;
  action: string;
  targetUserId?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  category?: string | null;
  severity?: string | null;
  metadata?: Prisma.InputJsonValue | null;
  ipHash?: string | null;
};

export async function writeAuditLog(input: AuditInput) {
  if (!hasDatabaseUrl()) {
    return { stored: false, reason: "DATABASE_URL is not configured." };
  }

  try {
    const prisma = getPrisma();
    const auditLog = await prisma.auditLog.create({
      data: {
        actorId: input.actorId ?? null,
        action: input.action,
        targetUserId: input.targetUserId ?? null,
        targetType: input.targetType ?? null,
        targetId: input.targetId ?? null,
        category: input.category ?? null,
        severity: input.severity ?? "info",
        metadata: input.metadata ?? undefined,
        ipHash: input.ipHash ?? null,
      },
    });

    return { stored: true, auditLog };
  } catch (error) {
    return { stored: false, reason: error instanceof Error ? error.message : "Audit log write failed." };
  }
}

export function logRoleAssigned(input: Omit<AuditInput, "action" | "category">) {
  return writeAuditLog({ ...input, action: "role.assigned", category: "roles", severity: "high" });
}

export function logRoleRevoked(input: Omit<AuditInput, "action" | "category">) {
  return writeAuditLog({ ...input, action: "role.revoked", category: "roles", severity: "high" });
}

export function logProductChanged(input: Omit<AuditInput, "action" | "category">) {
  return writeAuditLog({ ...input, action: "product.changed", category: "catalog" });
}

export function logPriceChanged(input: Omit<AuditInput, "action" | "category">) {
  return writeAuditLog({ ...input, action: "price.changed", category: "finance", severity: "medium" });
}

export function logRefundApproved(input: Omit<AuditInput, "action" | "category">) {
  return writeAuditLog({ ...input, action: "refund.approved", category: "refunds", severity: "high" });
}

export function logPayoutApproved(input: Omit<AuditInput, "action" | "category">) {
  return writeAuditLog({ ...input, action: "payout.approved", category: "payouts", severity: "high" });
}

export function logPayoutDestinationAttempted(input: Omit<AuditInput, "action" | "category">) {
  return writeAuditLog({ ...input, action: "payout.destination_attempted", category: "payouts", severity: "critical" });
}

export function logAffiliatePlanChanged(input: Omit<AuditInput, "action" | "category">) {
  return writeAuditLog({ ...input, action: "affiliate_plan.changed", category: "affiliates", severity: "medium" });
}

export function logAdApproved(input: Omit<AuditInput, "action" | "category">) {
  return writeAuditLog({ ...input, action: "ad.approved", category: "ads" });
}

export function logPrintfulRetry(input: Omit<AuditInput, "action" | "category">) {
  return writeAuditLog({ ...input, action: "printful.retry", category: "printful" });
}

export function logSecuritySettingChanged(input: Omit<AuditInput, "action" | "category">) {
  return writeAuditLog({ ...input, action: "security_setting.changed", category: "security", severity: "critical" });
}

export function logDeniedAccess(input: Omit<AuditInput, "action" | "category">) {
  return writeAuditLog({ ...input, action: "access.denied", category: "security", severity: "medium" });
}
