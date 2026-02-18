# Poll App

A Next.js poll application: **admins** sign in with email OTP to create and manage polls; **public users** vote without an account. Results update in near real time.

## Prerequisites

- **Node.js** 20+
- **pnpm** (or npm/yarn)
- **PostgreSQL** (local, or [Neon](https://neon.tech) / [Supabase](https://supabase.com) for a hosted DB)

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string. **Vercel + Supabase:** use the [Connection Pooler](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler) URL (port 6543), not the direct URL (`db.*.supabase.co:5432`), or you may get P1001 in production. |
| `NEXTAUTH_SECRET` | Yes | Random secret for NextAuth; generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | App URL; use `http://localhost:3000` for local dev |
| `RESEND_API_KEY` | No | [Resend](https://resend.com) API key for OTP emails. If empty, OTP codes are **logged to the terminal** (handy for local testing). |

### 3. Database

Create the database (if needed), then run migrations:

```bash
pnpm prisma migrate dev
```

(Optional) Seed or inspect data with Prisma Studio:

```bash
pnpm prisma studio
```

### 4. Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing the app

### Without Resend (local)

Leave `RESEND_API_KEY` empty. When you register or log in, the **6-digit OTP is printed in the terminal** where `pnpm dev` is running. Use that code on the verify page.

### Flow to try

1. **Landing** — [http://localhost:3000](http://localhost:3000)
2. **Admin sign up** — Go to **Login** or **Register**, enter email (and name for register). You’ll be sent to the verify page; enter the OTP from the email (or from the terminal if no Resend key).
3. **Dashboard** — After verify, you’re in the admin dashboard. Create a poll (question + 2–5 options).
4. **Poll detail** — Open a poll, use **Copy share link**, then **Close poll** (with confirmation) if you want.
5. **Public vote** — Open the share link in another browser or incognito. Vote once; you’ll see results and “You’ve already voted.” Refresh to see updated counts (SWR refreshes every few seconds).
6. **Theme** — Use the theme toggle in the header to switch dark/light.

## API documentation

OpenAPI 3.0 docs are generated from the codebase (JSDoc + Zod schemas). To generate the spec and view the docs:

```bash
pnpm openapi:generate
pnpm dev
```

Then open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) to browse and try the API.

## Scripts

| Command | Description |
|--------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm openapi:generate` | Generate OpenAPI spec to `public/openapi.json` |
| `pnpm prisma migrate dev` | Apply migrations (dev) |
| `pnpm prisma studio` | Open Prisma Studio |

## Stack

- **Next.js** 16 (App Router), **React** 19
- **NextAuth.js** v5 (OTP via Resend or console)
- **Prisma** 7 + PostgreSQL
- **Shadcn UI**, **Tailwind**, **Zustand**, **SWR**, **Zod**
