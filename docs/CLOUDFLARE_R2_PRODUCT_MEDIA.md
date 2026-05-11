# Cloudflare R2 Product Media

Date: 2026-05-10

## Status

Cloudflare R2 product image upload is implemented for the admin product editor.

Implemented pieces:

- Server-only R2 client in `src/lib/storage/r2.ts`
- Admin upload route at `POST /api/admin/product-media/upload`
- Setup/status route at `GET /api/admin/product-media/upload`
- Image type and file-size validation
- Product-scoped object keys under `products/{slug}/{year}/{month}/...`
- Product editor upload control in `/admin/products/new` and `/admin/products/[id]`
- URL fallback for existing external product images

## Required Variables

Add these to Railway:

```text
CLOUDFLARE_R2_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET=
CLOUDFLARE_R2_PUBLIC_URL=
CLOUDFLARE_R2_ENDPOINT=
CLOUDFLARE_R2_MAX_UPLOAD_MB=8
```

`CLOUDFLARE_R2_ENDPOINT` can usually stay blank. The app derives:

```text
https://{CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com
```

## Cloudflare Setup Steps

1. Open Cloudflare Dashboard.
2. Go to R2.
3. Create a bucket, for example `footprintshub-product-media`.
4. Create an R2 API token with object read/write access for that bucket.
5. Copy the Account ID, Access Key ID, Secret Access Key, and bucket name.
6. Configure public access through either:
   - R2.dev public bucket URL for temporary testing, or
   - a custom public media domain such as `media.footprintshub.com` later.
7. Add the Railway variables above.
8. Redeploy Railway.
9. Test `/admin/products/new` by uploading a small JPG, PNG, WebP, GIF, or AVIF image.

## Security Notes

- R2 credentials are server-only and must never use `NEXT_PUBLIC_`.
- The upload route uses the existing `ADMIN_SECRET` guard.
- SVG upload is blocked for now.
- Default max upload size is 8 MB.
- Uploaded objects are cacheable for one year because filenames include random UUIDs.

## Remaining Improvements

- Add a full auth/role system to replace `ADMIN_SECRET`.
- Add image transforms or responsive variants.
- Add signed direct-to-R2 uploads for very large media batches.
- Add delete-from-R2 cleanup when product media is removed.
