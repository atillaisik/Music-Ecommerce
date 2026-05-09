# ArasSounds (Music-Ecommerce)

## Commands
- `npm run dev` — Vite dev server on port **5180** (HMR overlay disabled)
- `npm run build` — production build
- `npm run build:dev` — development-mode build (sourcemaps, no minify-strip)
- `npm run preview` — preview the production build locally
- `npm run lint` — ESLint (flat config in `eslint.config.js`)
- `npm test` — Vitest single run (jsdom)
- `npm run test:watch` — Vitest watch mode
- `npx vitest run src/path/to/file.test.tsx` — run a single test file
- `npx vitest run -t "test name"` — run tests matching a name pattern

## Environment Setup
- **Node.js:** 18+ — managed via nvm recommended
- **Package manager:** npm (a `bun.lockb` is also present from Lovable; npm is canonical here)
- **Install deps:** `npm install`
- **Environment variables:** Copy `.env.example` to `.env` and fill in values. Required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Without them, `supabaseClient.ts` only warns — API calls will fail at runtime.
- **Database:** Supabase (hosted Postgres). Apply schema via the SQL files in `supabase/migrations/` against your Supabase project.
- **Working directory:** All commands run from `Music-Ecommerce/` (the project lives one level deep inside the repo root).

## Tech Stack
TypeScript | React 18 | Vite + SWC | shadcn-ui (Radix) | Tailwind CSS | Zustand | TanStack Query | React Router | React Hook Form + Zod | Supabase (Postgres + Auth + Storage + Realtime) | Vitest + Testing Library | Framer Motion | Recharts

## Architecture
- `src/App.tsx` — single composition root. Wraps in `QueryClientProvider` → `HelmetProvider` → `ThemeProvider` (dark default, key `arasounds-theme`) → `TooltipProvider` → `BrowserRouter`. Hosts `AppAuthHandler` (global Supabase auth listener) and `GlobalSubscriptions` (runs `useRealTimeSubscriptions` once for both storefront and admin).
- `src/pages/` — public storefront pages (`Index`, `Shop`, `ProductDetail`, `Checkout`, `Profile`, …)
- `src/pages/admin/` — admin pages, gated by `ProtectedAdminRoute` + `AdminLayout` at `/admin/*`. Login at `/admin/login` is outside the protected tree.
- `src/components/` — shared UI; `components/ui/` is shadcn primitives, `components/admin/` is admin-only, `components/magicui/` is animation helpers.
- `src/lib/<domain>API.ts` — thin Supabase wrappers per domain (`productAPI`, `orderAPI`, `customerAPI`, `brandAPI`, `categoryAPI`, `discountAPI`, `reviewAPI`, `faqAPI`, `wishlistAPI`, `siteContentAPI`, `analyticsAPI`, `profileAPI`). Consumed via React Query.
- `src/lib/store.ts` — `useCartStore` (Zustand + persist, localStorage). `src/lib/adminStore.ts` — `useAdminStore` (mirrors Supabase session; RLS is the real auth gate).
- `src/lib/supabaseClient.ts` — single shared Supabase client.
- `src/lib/schemas.ts` — Zod schemas used with `react-hook-form` + `@hookform/resolvers`.
- `src/lib/imageUploader.ts`, `image-utils.ts` — Supabase Storage uploads for product images.
- `src/hooks/useRealTimeSubscriptions.ts` — registers Supabase realtime channels and invalidates React Query caches; mounted once globally.
- `supabase/migrations/` — SQL migrations including RLS policies (see `20260428_implementation_16_rls.sql` + `.NOTES.md` for the canonical pattern).
- `docs/` — `database-schema.md`, `api-endpoints.md`, `admin-guide.md`, `setup-guide.md`.

### Adding a new table / domain
1. Add a migration in `supabase/migrations/` **including RLS policies** — never rely on default-open access.
2. Add a `src/lib/<domain>API.ts` module wrapping the shared `supabase` client.
3. If storefront/admin should react live, register the table in `useRealTimeSubscriptions` with the same React Query keys the API module uses.
4. Update `docs/database-schema.md`.

## Code Style
- TypeScript strict-ish (see `tsconfig.json`); path alias `@/*` → `src/*` (mirror in both `vite.config.ts` and `vitest.config.ts` if changed).
- ESLint flat config + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh`.
- Tailwind for styling; shadcn primitives over hand-rolled UI; `clsx` + `tailwind-merge` via `cn()` from `src/lib/utils.ts`.
- Forms: `react-hook-form` with Zod resolvers; share schemas via `src/lib/schemas.ts`.
- Data fetching: TanStack Query — keys must align with realtime invalidations.

## Testing Conventions
- **Runner:** Vitest in `jsdom`, globals enabled, setup at `src/test/setup.ts`.
- **Pattern:** `src/**/*.{test,spec}.{ts,tsx}` — co-locate test files next to source.
- **Library:** `@testing-library/react` + `@testing-library/jest-dom`.
- **Naming:** `describe('Component', () => { it('should <behavior>', …) })`.
- **Mocking:** mock Supabase client and any network calls — never hit a real Supabase project from tests.
- **Coverage:** aim for >80% on new code; every new feature or change must include tests.

## Database & Migrations
- Migrations are plain SQL files in `supabase/migrations/`, ordered by `YYYYMMDD_*` filename.
- Every table must have RLS enabled with explicit policies — see `20260428_implementation_16_rls.sql` for the canonical pattern.
- Apply migrations via the Supabase SQL editor or CLI; do not modify the schema manually outside of a migration file.
- Review every migration for destructive ops (DROP, ALTER ... DROP COLUMN, policy removal) before applying.

## Important
- NEVER commit `.env` files — use `.env.example` for reference.
- All user input must be validated with Zod before submission; the server side is enforced by Supabase RLS + check constraints.
- Image uploads go through `imageUploader.ts` — do not write directly to Storage from components.
- The `lovable-tagger` Vite plugin only runs in development mode and adds `data-lov-id` attributes for the Lovable editor — do not strip it from `vite.config.ts`.
- The root-level `test*.js` and `check_product.js` scripts are ad-hoc Supabase admin scripts — they are NOT part of the test suite and may use the service-role key. Do not run them casually.
- `IMPLEMENTATION_*.md` files at the repo root are historical change logs per feature batch. The highest-numbered one (currently `IMPLEMENTATION_16.md`) describes the most recent invariants — read it before large refactors.
- NEVER bypass `ProtectedAdminRoute` or RLS for convenience. Admin role checks live server-side.

## Workflow
- IMPORTANT: Only do what is explicitly asked. Do NOT add extra features, refactors, or improvements beyond the request.
- Before changing a domain, read its `<domain>API.ts` module and the matching migration to understand the RLS-enforced contract.
- After schema changes: update the migration, the matching API module, the React Query keys in `useRealTimeSubscriptions`, and `docs/database-schema.md`.
- After UI changes: run `npm run lint` and `npm test` before declaring done. For visible changes, also smoke-test in `npm run dev`.
- Every code change should come with a short, descriptive commit message.
- Every new feature or change must include tests.
- Changes must not break existing functionality — run the full relevant test suite after changes.

## Context Management
- Prefer reading specific files (`src/lib/<domain>API.ts`, the matching migration, the consuming page) over broad exploration.
- Run single tests first, full suite only for final verification.
- When compacting, preserve: list of modified files, migrations added, test commands run, any failing test details, and current task progress.
