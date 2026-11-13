# Aperture

A fast, calm video‑calling app. Start a meeting instantly, schedule one for
later, or join with a link — built on Next.js 16, Auth.js, Prisma/Postgres
and Stream Video.

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19
- **Auth.js (next-auth v5)** — Google & GitHub sign‑in, Prisma adapter
- **Prisma + PostgreSQL** — users, accounts, sessions
- **Stream Video** — the actual calling, recording, virtual backgrounds
- **Tailwind CSS v4** + shadcn/ui primitives, **Motion** for animation

## Getting started

```bash
npm install
cp .env.example .env   # fill in the values described below
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

See [`.env.example`](.env.example) for the full list and where to get each
value. You'll need:

- A **Postgres** database (`DATABASE_URL`)
- An **Auth.js secret** (`npx auth secret`)
- A **Google OAuth client** and a **GitHub OAuth app**, both with their
  callback URL set to `{your-url}/api/auth/callback/{google|github}`
- A **Stream Video** app (the free tier is enough) for its API key/secret

## Deploying on Vercel

1. Push this repo to GitHub and import it into Vercel.
2. Add the environment variables above in the Vercel project settings —
   set `NEXT_PUBLIC_BASE_URL` to your production domain, and update the
   OAuth apps' callback URLs to match it.
3. Point `DATABASE_URL` at a Postgres instance reachable from Vercel (Neon,
   Supabase and Vercel Postgres all work out of the box).
4. Deploy. `prisma generate` runs automatically via `postinstall`; run
   `npx prisma migrate deploy` against the production database once
   (locally, or as a one-off Vercel deploy step) to create the schema.
