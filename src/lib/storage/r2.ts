import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const defaultMaxUploadBytes = 8 * 1024 * 1024;

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
  endpoint: string;
  maxUploadBytes: number;
};

let r2Client: S3Client | null = null;
let r2ClientKey = "";

export type ProductMediaUploadInput = {
  bytes: Buffer;
  filename: string;
  contentType: string;
  productSlug?: string;
};

export type ProductMediaUploadResult = {
  key: string;
  url: string;
  bucket: string;
  contentType: string;
  size: number;
};

export function isR2Configured() {
  return Boolean(
    process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
      process.env.CLOUDFLARE_R2_BUCKET &&
      process.env.CLOUDFLARE_R2_PUBLIC_URL,
  );
}

export function getR2SetupStatus() {
  return {
    configured: isR2Configured(),
    missing: [
      ["CLOUDFLARE_R2_ACCOUNT_ID", process.env.CLOUDFLARE_R2_ACCOUNT_ID],
      ["CLOUDFLARE_R2_ACCESS_KEY_ID", process.env.CLOUDFLARE_R2_ACCESS_KEY_ID],
      ["CLOUDFLARE_R2_SECRET_ACCESS_KEY", process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY],
      ["CLOUDFLARE_R2_BUCKET", process.env.CLOUDFLARE_R2_BUCKET],
      ["CLOUDFLARE_R2_PUBLIC_URL", process.env.CLOUDFLARE_R2_PUBLIC_URL],
    ]
      .filter(([, value]) => !value)
      .map(([key]) => key),
  };
}

export function validateProductImageUpload({ contentType, size }: { contentType: string; size: number }) {
  const maxUploadBytes = getMaxUploadBytes();

  if (!allowedImageTypes.has(contentType)) {
    return {
      ok: false as const,
      error: "Use a JPG, PNG, WebP, GIF, or AVIF image.",
    };
  }

  if (size <= 0) {
    return {
      ok: false as const,
      error: "Upload a non-empty image file.",
    };
  }

  if (size > maxUploadBytes) {
    return {
      ok: false as const,
      error: `Image must be ${Math.round(maxUploadBytes / 1024 / 1024)} MB or smaller.`,
    };
  }

  return { ok: true as const };
}

export async function uploadProductMediaToR2(input: ProductMediaUploadInput): Promise<ProductMediaUploadResult> {
  const setup = getR2SetupStatus();

  if (!setup.configured) {
    throw new Error(`Cloudflare R2 is not configured. Missing: ${setup.missing.join(", ")}`);
  }

  const validation = validateProductImageUpload({
    contentType: input.contentType,
    size: input.bytes.byteLength,
  });

  if (!validation.ok) {
    throw new Error(validation.error);
  }

  const config = getR2Config();
  const key = buildProductMediaKey(input.filename, input.productSlug);

  await getR2Client(config).send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: input.bytes,
      ContentType: input.contentType,
      CacheControl: "public, max-age=31536000, immutable",
      Metadata: {
        source: "footprintshub-admin",
      },
    }),
  );

  return {
    key,
    url: `${config.publicUrl}/${key}`,
    bucket: config.bucket,
    contentType: input.contentType,
    size: input.bytes.byteLength,
  };
}

export function buildProductMediaKey(filename: string, productSlug = "unsorted") {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const safeSlug = sanitizePathSegment(productSlug) || "unsorted";
  const safeName = sanitizeFilename(filename);

  return `products/${safeSlug}/${year}/${month}/${randomUUID()}-${safeName}`;
}

export function sanitizeFilename(filename: string) {
  const clean = filename
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return clean || "product-image";
}

export function sanitizePathSegment(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getR2Config(): R2Config {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucket = process.env.CLOUDFLARE_R2_BUCKET;
  const publicUrl = normalizePublicUrl(process.env.CLOUDFLARE_R2_PUBLIC_URL);
  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : "");

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl || !endpoint) {
    throw new Error("Cloudflare R2 is not configured.");
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicUrl,
    endpoint,
    maxUploadBytes: getMaxUploadBytes(),
  };
}

function getR2Client(config: R2Config) {
  const clientKey = `${config.endpoint}:${config.accessKeyId}:${config.bucket}`;

  if (!r2Client || r2ClientKey !== clientKey) {
    r2Client = new S3Client({
      region: "auto",
      endpoint: config.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
    r2ClientKey = clientKey;
  }

  return r2Client;
}

function normalizePublicUrl(value?: string) {
  return value?.replace(/\/+$/g, "") ?? "";
}

function getMaxUploadBytes() {
  const configured = Number(process.env.CLOUDFLARE_R2_MAX_UPLOAD_MB);
  return Number.isFinite(configured) && configured > 0 ? configured * 1024 * 1024 : defaultMaxUploadBytes;
}
