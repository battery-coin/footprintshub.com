import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { getDefaultShopId, getSettingsByCategory, setShopSetting } from "@/lib/settings/settings-service";

const settingSchema = z.object({
  key: z.string().trim().min(1),
  category: z.string().trim().min(1).default("general"),
  value: z.unknown().refine(isJsonSerializable, "Setting value must be JSON-serializable."),
});

export async function GET(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const category = url.searchParams.get("category") || "general";
  const shopId = await getDefaultShopId();
  const settings = await getSettingsByCategory(shopId, category);

  return NextResponse.json({ shopId, category, settings });
}

export async function PUT(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
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
