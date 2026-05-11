# Product Media and Image Upload

Date: 2026-05-10

## MVP Support

The product editor supports image/media URLs, alt text, primary image selection, gallery preview, removal, and persistence through `ProductMedia`.

## Storage Status

Direct binary upload is not enabled yet. This is intentional because production storage should use Cloudflare R2 or another durable object store, not Railway ephemeral storage.

## Future Work

- Add Cloudflare R2 credentials.
- Add signed upload URLs.
- Validate image MIME type and file size.
- Generate responsive image variants.
