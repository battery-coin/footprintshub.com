import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { logSecuritySettingChanged } from "@/lib/audit/audit-log";
import { requireRequestPermission } from "@/lib/auth/require-permission";
import { getDefaultShopId, getSettingsByCategory, setShopSetting } from "@/lib/settings/settings-service";

const settingSchema = z.object({
  key: z.string().trim().min(1),
  category: z.string().trim().min(1).default("general"),
  value: z.unknown().refine(isJsonSerializable, "Setting value must be JSON-serializable."),
});

export async function GET(request: Request) {
  const allowed = await requireRequestPermission(request, "canManageShopSettings");
  if (!allowed.ok) {
    return allowed.response;
  }

  const url = new URL(request.url);
  const category = url.searchParams.get("category") || "general";
  const shopId = await getDefaultShopId();
  const settings = await getSettingsByCategory(shopId, category);

  return NextResponse.json({ shopId, category, settings });
}

export async function PUT(request: Request) {
  const allowed = await requireRequestPermission(request, "canManageShopSettings");
  if (!allowed.ok) {
    return allowed.response;
  }

  const parsed = settingSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid setting payload.", issues: parsed.error.issues }, { status: 400 });
  }

  const shopId = await getDefaultShopId();
  const result = await setShopSetting({
    shopId,
    key: parsed.data.key,
    value: parsed.data.value as Prisma.InputJsonValue,
    category: parsed.data.category,
  });

  if (parsed.data.category === "security") {
    await logSecuritySettingChanged({
      actorId: allowed.user?.id,
      targetType: "shop_setting",
      targetId: parsed.data.key,
      metadata: { shopId, key: parsed.data.key },
    });
  }

  return NextResponse.json({ ok: true, shopId, ...result });
}

function isJsonSerializable(value: unknown) {
  try {
    JSON.stringify(value);
    return value !== undefined;
  } catch {
    return false;
  }
}
