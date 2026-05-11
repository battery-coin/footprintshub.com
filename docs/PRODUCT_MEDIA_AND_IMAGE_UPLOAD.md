# Product Media and Image Upload

Date: 2026-05-10

## MVP Support

The product editor supports Cloudflare R2 image uploads, image/media URLs, alt text, primary image selection, gallery preview, removal, and persistence through `ProductMedia`.

## Storage Status

Direct binary upload is now implemented through a server-only Cloudflare R2 route:

- `POST /api/admin/products/media/upload`
- Uses the existing `ADMIN_SECRET` gate.
- Accepts multipart form data with an image file.
- Uploads to R2 using the S3-compatible API.
- Returns a public URL that the product editor adds to the gallery.

The URL fallback remains available for existing externally hosted images.

## Required Railway Variables

Set these on Railway before using R2 uploads:

```text
CLOUDFLARE_R2_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET=
CLOUDFLARE_R2_PUBLIC_URL=
CLOUDFLARE_R2_ENDPOINT=
CLOUDFLARE_R2_MAX_UPLOAD_MB=8
```

`CLOUDFLARE_R2_PUBLIC_URL` should be the public bucket URL, R2.dev URL, or a custom media domain such as `https://media.footprintshub.com`.

## Validation

Allowed image types:

- JPG
- PNG
- WebP
- GIF
- AVIF

SVG is intentionally blocked for now because customer-facing SVG uploads can carry script/security risk if served incorrectly. The default size limit is 8 MB.

## Future Work

- Add signed browser-to-R2 upload URLs for very large catalogs.
- Generate responsive image variants.
