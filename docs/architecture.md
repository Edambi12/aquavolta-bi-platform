# Architecture

## Overview

The platform is a classic batch BI chain with a separate web front end.

```mermaid
flowchart TB
    subgraph L1["1 · Sources (confidential, off-repo)"]
        SRC["Excel workbooks<br/>DATA FORMATION BI 2022 / 2023, DATA BI"]
    end
    subgraph L2["2 · Exploration &amp; cleaning"]
        NB["Jupyter notebooks<br/>pandas · missingno · scikit-learn"]
        OUT["Cleaned workbooks OUTPUT_*.xlsx"]
    end
    subgraph L3["3 · Integration"]
        TAL["Talend Open Studio 8.0.1<br/>project DATAWARHOUSE"]
    end
    subgraph L4["4 · Storage (MySQL / MariaDB)"]
        STG[("datasa<br/>Staging Area")]
        DWH[("data_war_house<br/>Data Warehouse")]
    end
    subgraph L5["5 · Analysis"]
        PBI["Power BI report<br/>Accueil · Produit · Charge · Résultat"]
    end
    subgraph L6["6 · Access"]
        WEB["React SPA (Lovable)"]
        SUPA[("Supabase<br/>Auth + Postgres + RLS")]
    end
    ML["Predictive models — planned"]:::planned

    SRC --> NB --> OUT --> TAL --> STG --> DWH --> PBI
    PBI -- "Publish to web (iframe)" --> WEB
    WEB <--> SUPA
    DWH -.-> ML -.-> PBI
    classDef planned stroke-dasharray: 5 5,fill:#f6f6f6,color:#666;
```

## Layers

| Layer | Component | Responsibility |
|---|---|---|
| Sources | Excel workbooks | Export revenue, local revenue, expenses, payroll, collections |
| Exploration | Python notebooks | Profiling, quality diagnosis, cleaning, imputation, normalised output files |
| Integration | Talend | Loading cleaned files to staging, consolidating years, feeding the warehouse |
| Staging | MySQL `datasa` | Raw yearly tables, unified tables, reference tables |
| Warehouse | MySQL `data_war_house` | Analysis-ready tables and a central fact table |
| Analysis | Power BI | Measures, slicers, four report pages |
| Access | React application | Company service pages, authentication, embedded report |

## Web application

- **Framework:** React 18 + TypeScript, built with Vite 5; UI with Tailwind CSS and shadcn/ui (Radix primitives); routing with React Router; data fetching helpers from TanStack Query.
- **Backend:** Supabase. Authentication by email/password and OAuth (Google, GitHub). Tables `profiles`, `departements`, `donnees_utilisateur` protected by Row Level Security policies defined in `app/supabase/migrations/`.
- **Dashboard integration:** the header's *Dashboard* button opens a dialog containing an `<iframe>` pointing at the published Power BI report.

The web application and the BI chain are **decoupled**: the application does not query MySQL. Its only link to the BI layer is the embedded report URL. Its Supabase database stores application data (user profiles and service requests), not financial data.

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Landing page: hero, services, testimonials |
| `/electricite`, `/fluides`, `/genie-civil` | Public (submitting requires sign-in) | Department service catalogues and quote-request forms |
| `/auth` | Public | Sign-in / sign-up |
| `/dashboard` | Authenticated | User profile |
| `/data-view` | Authenticated | The user's submitted service requests |

## Quality and delivery tooling (phase 2)

| Element | Location | Role |
|---|---|---|
| Helper module | `analytics/notebooks/aquavolta_helpers.py` | Paths, workbook I/O with explicit errors, safe ratio, client-ratio imputation, identity control |
| Unit tests | `analytics/tests/` | Behaviour of the helpers on synthetic fixtures |
| Notebook validator | `analytics/tools/validate_notebooks.py` | Rejects outputs, shell commands, local paths, syntax errors |
| Data-quality controls | `database/checks/data_quality_checks.sql` | Read-only checks on the current warehouse |
| CI | `.github/workflows/ci.yml` | Frontend type-check, lint, build; notebook validation and tests |

## Current limitations and target architecture

The warehouse layer is the weakest part of the chain: the central fact table has no grain and is not used by the report, reporting tables carry no integrity constraint, and amounts are stored as text. The data-access layer is the second: the report is distributed through a public link.

```mermaid
flowchart LR
    subgraph Now["Current"]
        A1[("data_war_house<br/>fact_tabel + *_d tables")] --> B1["Power BI report<br/>Publish to web (public)"]
    end
    subgraph Target["Proposed — not deployed"]
        A2[("Star schema<br/>4 facts, conformed dimensions")] --> B2["Company report<br/>authenticated workspace + RLS"]
        A3[("Anonymised dataset")] --> B3["Portfolio report<br/>public"]
    end
```

Details: [dwh-target-model.md](dwh-target-model.md) and [security-and-privacy.md](security-and-privacy.md).

## Extension point for predictive analytics

Predictive analytics is `Planned — Future Development Phase`. The intended integration keeps the current chain unchanged:

1. Python reads history from the warehouse (`export_d`, `local_d`, `depense_d`, `salaire_d`, `encaissement_d`, or the facts of the target model once migrated), after the data corrections of the calculation audit.
2. Models write forecasts to **new, dedicated tables** (for example `forecast_flux`, `forecast_perte_change`) with model name, training date and horizon.
3. Power BI adds a forecast page reading those tables, visually separated from actuals.

Nothing of this exists yet; the dashed elements in the diagrams mark it as future work.
