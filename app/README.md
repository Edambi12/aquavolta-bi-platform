# AQUAVOLTA Solutions — web application

Source code of the Lovable.dev project **`aquavolta-solution`**, retrieved from Lovable at commit `0d0962faefd968c2019cbeb055c5e8d46a0538af`.

Published by Lovable at <https://aquavolta-solution.lovable.app>.

The application presents the company's three service departments (electricity, fluids, civil engineering), lets clients create an account and submit quote requests, and embeds the published Power BI report.

## Stack

React 18 · TypeScript · Vite 5 · Tailwind CSS · shadcn/ui (Radix UI) · React Router 6 · TanStack Query · Supabase (Auth + PostgreSQL) · lucide-react icons.

## Routes

| Route | Access | Page |
|---|---|---|
| `/` | Public | Landing page (`Index`) |
| `/electricite` | Public | Electricity services and quote form |
| `/fluides` | Public | Fluids services and quote form |
| `/genie-civil` | Public | Civil-engineering services and quote form |
| `/auth` | Public | Sign-in / sign-up (email, Google, GitHub) |
| `/dashboard` | Authenticated | User profile |
| `/data-view` | Authenticated | The user's service requests |
| `*` | Public | Not found |

The **Dashboard** button in the header opens the Power BI report in a full-screen dialog:
<https://app.powerbi.com/view?r=eyJrIjoiZWNjNjk5YWQtYThlOC00YmQwLWExNWYtZGQxMzkzMDEzOTYyIiwidCI6ImRiZDY2NjRkLTRlYjktNDZlYi05OWQ4LTVjNDNiYTE1M2M2MSIsImMiOjl9>

## Setup

```bash
cp .env.example .env     # fill in your Supabase project values
npm ci
npm run dev              # http://localhost:8080
```

| Script | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type-check (application and Vite config) |

## Environment variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project reference |

The three variables are required at build time and at `npm run dev`. If `VITE_SUPABASE_URL` is missing, the Supabase client throws on start-up and the page stays blank; this is the behaviour of the generated code and was left unchanged. Placeholder values are enough to build and to browse the public pages.

## Supabase backend

Migrations in `supabase/migrations/` create:

- `profiles` — one row per user, filled by a trigger on sign-up; owner-only RLS policies.
- `departements` — seeded with the three departments; readable by authenticated users.
- `donnees_utilisateur` — service requests as JSONB; owner-only RLS policies.

To use your own project, apply the migrations with the Supabase CLI and enable the Google and GitHub providers if social sign-in is wanted. More detail in `SUPABASE_AUTH_GUIDE.md` (French, generated with the project).

## Differences from the Lovable project

| Item | Status |
|---|---|
| Source, configuration, migrations, `package-lock.json` | Retrieved unchanged |
| `.env` | Not committed; replaced by `.env.example` |
| `.gitignore` | `.env` rules appended |
| `README.md` | Lovable boilerplate replaced by this file |
| `bun.lockb` | Not retrieved (binary); `package-lock.json` is the lockfile of record |
| Images in `src/assets/` and `public/favicon.ico` | Retrieved from the published site (see below) |

## Binary assets

The 23 images in `src/assets/` and `public/favicon.ico` could not be transferred through the Lovable connector, which returns file contents as text. They were downloaded instead from the project's published site (`aquavolta-solution.lovable.app`) and restored under their original file names. A local production build of this folder produces the same content-hashed file name for each of the 23 images, and for the CSS bundle, as the published site, which confirms that the files are identical.

## Verification status

- `npm run typecheck`: passes.
- `npm run build`: succeeds.
- Production build exercised in a headless browser: the public routes (`/`, the three department pages, `/auth` and the not-found page) render, service images load, `/dashboard` redirects unauthenticated visitors to `/auth`, the quote form opens, the Dashboard dialog embeds the Power BI URL, and the mobile layout has no horizontal overflow. Sign-up, sign-in and request submission were not exercised, as they need a live Supabase project.
- `npm run lint`: 0 errors, 8 warnings. The 11 errors of the generated code were fixed in the second audit phase (typed `catch` blocks through `src/lib/errors.ts`, two empty interfaces turned into type aliases, an ES import in `tailwind.config.ts`, a typed cast and a stable `useCallback` in `DataView`). The remaining warnings are `react-refresh/only-export-components` in generated UI components and concern hot reload only.
- These fixes change no markup and no style: the CSS bundle produced by the build is byte-identical to the one built before them. Screenshots of the service and sign-in pages taken before and after the fixes are pixel-identical, and the navigation, quote form, dashboard dialog and mobile menu were re-checked in a headless browser.
- The same three commands run in GitHub Actions on every push and pull request.

## Dashboard confidentiality

The **Dashboard** button is shown to every visitor, signed in or not, and the embedded report is a public *Publish to web* link. The application therefore provides no access control over the report. See `docs/security-and-privacy.md` before using it with real data.

## Content notice

Testimonials, figures ("500+ projects"), certifications, prices and contact details shown in the pages are demonstration content produced during generation.
