This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Database (Neon + Drizzle ORM)

This project is wired to use Neon PostgreSQL with Drizzle ORM.

### 1) Configure environment

Copy `env.example` to `.env.local` and fill in your Neon connection string (ensure `sslmode=require`).

```
cp env.example .env.local
# edit .env.local and set NEON_DATABASE_URL
```

### 2) Generate and push schema

Drizzle will read schema from `src/db/schema.ts` and generate migrations into `drizzle/`.

```
npm run db:generate
npm run db:push
```

### 3) Seed sample products

The seed script inserts a few Nike products. It clears the `products` table first (dev-only convenience).

```
npm run seed
```

### 4) Run the app

```
npm run dev
```

Open http://localhost:3000 to view the product list. If you see "No products found", verify your `.env.local` and re-run the seed script.
