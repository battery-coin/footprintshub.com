# Product API Import Guide

Date: 2026-05-10

## Route

- API: `/api/admin/products/import/api`

## Supported Sources

- JSON array of products
- Object with `products` array
- Object with `data` array

## Security

The importer blocks localhost and private network URLs outside development-friendly mode, rejects non-HTTP protocols, requires HTTPS in production, limits response size, and expects JSON.

## Status

API import preview and simple draft import are implemented. Complex field mapping UI is a future enhancement.
