# AQUAVOLTA Solutions — web application

Source code of the Lovable.dev project **`aquavolta-solution`**, retrieved from Lovable at commit `0d0962faefd968c2019cbeb055c5e8d46a0538af`.

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

## Environment variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project reference |

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
| Images in `src/assets/` and `public/favicon.ico` | See below |

## Binary assets

The application imports 23 images from `src/assets/` (logo, hero image and service photos) and uses `public/favicon.ico`. The Lovable connector used for the retrieval returns file contents as text, which corrupts binary files, so these files could not be transferred through it.

**If `src/assets/` is absent from this folder, the build fails on the missing imports.** To complete the application, export the project from Lovable (GitHub sync or ZIP download) and copy `src/assets/*` and `public/favicon.ico` here.

Expected files:

```text
src/assets/aquavolta-logo.png          src/assets/hero-aquavolte.jpg
src/assets/electricite-service.jpg     src/assets/fluides-service.jpg
src/assets/genie-civil-service.jpg
src/assets/elec-installation-industrielle.jpg   src/assets/elec-maintenance.jpg
src/assets/elec-solaire.jpg            src/assets/elec-domotique.jpg
src/assets/elec-eclairage-led.jpg      src/assets/elec-tableaux.jpg
src/assets/fluid-plomberie-cvc.jpg     src/assets/fluid-sprinklers.jpg
src/assets/fluid-traitement-eaux.jpg   src/assets/fluid-gaz.jpg
src/assets/fluid-climatisation.jpg     src/assets/fluid-pompage.jpg
src/assets/civil-maconnerie.jpg        src/assets/civil-terrassement.jpg
src/assets/civil-vrd.jpg               src/assets/civil-renovation.jpg
src/assets/civil-amenagement.jpg       src/assets/civil-batiment.jpg
public/favicon.ico
```

## Verification status

- `npx tsc --noEmit -p tsconfig.app.json`: passes.
- `npm run build`: succeeds when the image files are present.
- `npm run lint`: reports style findings in the generated code (mainly `no-explicit-any`, one empty interface, one `require()` in `tailwind.config.ts`); none blocks the build.

## Content notice

Testimonials, figures ("500+ projects"), certifications, prices and contact details shown in the pages are demonstration content produced during generation.
