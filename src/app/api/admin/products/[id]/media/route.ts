import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

const mediaSchema = z.object({
  url: z.string().url(),
  altText: z.string().optional(),
  mediaType: z.enum(["image", "video", "model"]).default("image"),
  isPrimary: z.boolean().default(false),
});

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = mediaSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid media payload.", issues: parsed.error.issues }, { status: 400 });
  }

  const { id } = await params;

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ stored: false, media: parsed.data }, { status: 202 });
  }

  const media = await getPrisma().productMedia.create({
    data: { productId: id, ...parsed.data },
  });

  return NextResponse.json({ stored: true, media }, { status: 201 });
}
