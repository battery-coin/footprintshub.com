# Database Migration And Seeding

## Prisma Scripts

Package scripts include:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

The package Prisma seed command is:

```bash
tsx prisma/seed.ts
```

## Seed Products

The seed script includes:

- Footprints Supporter Bundle
- Footprints Choir Supporter Pack
- Matrix Decoded Alpha Deck
- Matrix Decoded Booster Pack Series 1
- Team Tardee Plush Blind Box
- Satoshi Founder Pack
- Founder Decoder Bundle
- Hero Studio Fan Club Starter Pack
- Digital Twin Registration Placeholder
- Limited Edition Footprints Poster

## Neon First-Time Flow

After creating the Neon database and setting local `DATABASE_URL`:

```bash
npx prisma validate
npx prisma migrate deploy
npm run prisma:seed
```

Use `migrate dev` only for local development databases:

```bash
npx prisma migrate dev --name initial_footprintshub
```

## Production Safety

- Do not run `prisma db reset` against Neon.
- Do not seed production repeatedly without reviewing upsert behavior.
- Do not commit Neon connection strings.

