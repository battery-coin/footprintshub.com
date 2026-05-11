import assert from "node:assert/strict";
import test from "node:test";
import { buildProductMediaKey, sanitizeFilename, sanitizePathSegment, validateProductImageUpload } from "./r2";

test("sanitizeFilename keeps safe lowercase file names", () => {
  assert.equal(sanitizeFilename("Hero Studio Poster FINAL.png"), "hero-studio-poster-final.png");
  assert.equal(sanitizeFilename(""), "product-image");
});

test("sanitizePathSegment creates storage-safe folders", () => {
  assert.equal(sanitizePathSegment("Matrix Decoded Alpha Deck!"), "matrix-decoded-alpha-deck");
});

test("buildProductMediaKey creates product-scoped R2 keys", () => {
  const key = buildProductMediaKey("Poster.png", "Featured Drop");

  assert.match(key, /^products\/featured-drop\/\d{4}\/\d{2}\/.+-poster\.png$/);
});

test("validateProductImageUpload accepts supported image files", () => {
  assert.deepEqual(validateProductImageUpload({ contentType: "image/webp", size: 1024 }), { ok: true });
});

test("validateProductImageUpload rejects scripts and oversized files", () => {
  assert.equal(validateProductImageUpload({ contentType: "image/svg+xml", size: 1024 }).ok, false);
  assert.equal(validateProductImageUpload({ contentType: "image/png", size: 50 * 1024 * 1024 }).ok, false);
});
