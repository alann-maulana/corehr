<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# CoreHR - Next.js + MySQL HR System

## Stack
- Next.js 16.2.7 (App Router, React 19, Turbopack)
- TypeScript (strict mode, target ES2017)
- MySQL 8.x via Knex.js (migrations in `/migrations`)
- NextAuth.js v5 beta (Google OAuth + mock credentials for dev)
- Material-UI v9 + Tailwind CSS v4
- Path alias: `@/*` maps to project root

## Dev Commands
```bash
npm run dev        # Start dev server (port 3000)
npm run build      # Production build
npm run lint       # ESLint check
```

**Package manager**: Project uses `bun.lock` — prefer `bun` commands when available, fallback to `npm`.

## Database & Migrations

**Knex CLI requires ts-node/tsx** — not currently installed. To run migrations:
```bash
# Install tsx first (not in deps yet)
npm install -D tsx

# Then run migrations
npx knex migrate:latest --knexfile knexfile.ts
npx knex migrate:make <name> --knexfile knexfile.ts
```

**Connection**: MySQL via env vars in `.env.local` (copy from `.env.example`).
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`
- Default: `localhost:3306`, database `corehr`, user `root`, no password
- Migrations dir: `./migrations`, extension: `.ts`
- DB singleton: `lib/db.ts` (use this, not raw knex instances)

**Schema**: Single `users` table (see `migrations/20260606_001_create_users.ts`)
- Fields: `id`, `google_id`, `name`, `email`, `avatar_url`, `role` (admin|employee), `status` (verified|unverified)

## Auth Architecture

**NextAuth.js v5** (`lib/auth.ts`):
- **Google OAuth**: Upserts user to DB on first sign-in, syncs role/status to JWT
- **Mock login** (dev only): Uses `MOCK_LOGIN_EMAIL`/`MOCK_LOGIN_PASSWORD` from env, bypasses DB entirely
- **JWT strategy**: role & status injected into token, exposed in session
- **DB-optional**: Auth falls back gracefully if DB unavailable (dev convenience)
- **Custom pages**: Sign-in at `/login`, errors redirect to `/login`

**Session types**: Extended in `types/next-auth.d.ts` with `id`, `role`, `status` fields.

## Project Structure
```
app/
  (auth)/          # Auth routes (login, waiting-verification)
  api/
    auth/          # NextAuth.js API routes
    dev/           # Dev-only API endpoints
  dashboard/       # Main app area
  layout.tsx       # Root layout (MUI + Tailwind setup)
components/
  auth/            # Auth-related components
  ui/              # Reusable UI components
lib/
  auth.ts          # NextAuth.js config & handlers
  auth-proxy.ts    # Auth utilities/wrappers
  db.ts            # Knex singleton
  validations/     # Joi schemas
```

## Framework Quirks

**Next.js 16.x**:
- App Router only, no Pages Router
- React 19 (new JSX transform, `react-jsx`)
- Turbopack enabled by default (`turbopack: {}` in config)
- MUI optimized via `experimental.optimizePackageImports`
- Knex/MySQL externalized (`serverExternalPackages`)

**Material-UI v9**: Uses `@mui/material-nextjs` for Next.js integration. Check MUI docs for v9-specific changes.

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Set `NEXTAUTH_SECRET` (generate: `openssl rand -base64 32`)
3. For Google OAuth: Create OAuth app at console.cloud.google.com, add client ID/secret
4. For dev: Set `MOCK_LOGIN_EMAIL`/`MOCK_LOGIN_PASSWORD` to skip Google
5. Ensure MySQL 8.x running, create database `corehr`
6. Install tsx: `npm install -D tsx` (needed for migrations)
7. Run migrations: `npx knex migrate:latest --knexfile knexfile.ts`

## Testing & Verification

**No test framework configured yet**. When adding tests:
- Use Vitest or Jest (Next.js 16 prefers Vitest)
- Place tests adjacent to code: `__tests__/` or `*.test.ts`

**Type checking**: `npx tsc --noEmit` (no script defined yet)

## Common Pitfalls

- **Knex migrations fail**: Install `tsx` dev dependency first
- **Auth DB errors ignored**: Auth gracefully degrades if DB unavailable (dev mode). Check logs for silent failures.
- **Mock login in production**: Credentials provider automatically disabled when `NODE_ENV=production`
- **MUI SSR issues**: Use `@mui/material-nextjs` components for proper Next.js integration
- **Tailwind v4 + MUI**: Both active. Tailwind uses PostCSS v4 syntax (`@tailwindcss/postcss`). Watch for specificity conflicts.
