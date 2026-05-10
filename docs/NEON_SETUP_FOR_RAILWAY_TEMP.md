# Neon Setup For Railway Temporary Deployment

## Manual Steps

1. Open Neon.
2. Create a project named `footprintshub`.
3. Create a database named `footprintshub`.
4. Copy the Postgres connection string with SSL enabled.
5. Prefer the pooled connection string for app runtime when available.
6. Add it to Railway as:

```txt
DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require
```

7. Add the same value to local `.env` only for migration testing.
8. Do not commit the connection string.

## Prisma Commands

For an already-created schema in a staging/production-like database:

```bash
npx prisma migrate deploy
```

For local development only:

```bash
npx prisma migrate dev --name initial_footprintshub
```

## Notes

- The current Prisma schema uses only `DATABASE_URL`.
- Direct database URLs may be preferred for migrations in some Prisma/Neon setups, but the MVP keeps configuration simple until a dedicated migration strategy is added.
- Do not run destructive seed or reset commands against production Neon.

