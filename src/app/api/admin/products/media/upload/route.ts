import { NextResponse } from "next/server";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { getR2SetupStatus, uploadProductMediaToR2, validateProductImageUpload } from "@/lib/storage/r2";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json(getR2SetupStatus());
}

export async function POST(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const setup = getR2SetupStatus();

  if (!setup.configured) {
    return NextResponse.json(
      {
        error: "Cloudflare R2 is not configured.",
        missing: setup.missing,
      },
      { status: 503 },
    );
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Attach an image file." }, { status: 400 });
  }

  const validation = validateProductImageUpload({
    contentType: file.type,
    size: file.size,
  });

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const productSlug = typeof formData?.get("productSlug") === "string" ? String(formData.get("productSlug")) : "";
  const altText = typeof formData?.get("altText") === "string" ? String(formData.get("altText")) : "";
  const bytes = Buffer.from(await file.arrayBuffer());
  const upload = await uploadProductMediaToR2({
    bytes,
    filename: file.name,
    contentType: file.type,
    productSlug,
  });

  return NextResponse.json({
    stored: true,
    media: {
      url: upload.url,
      altText,
      mediaType: "image",
      isPrimary: false,
      sortOrder: 0,
      storageProvider: "cloudflare-r2",
      storageKey: upload.key,
      contentType: upload.contentType,
      size: upload.size,
    },
  });
}
