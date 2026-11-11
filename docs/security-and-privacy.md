# Security and data privacy

The project processes real financial data of a company: employee names and salaries, client and supplier names, invoices, payments and bank information. This document records how that data is kept out of the public repository and what remains to be secured in the solution itself.

## Publication rules

Never committed:

- Source Excel workbooks and cleaned output workbooks.
- SQL dumps containing `INSERT` statements.
- Power BI `.pbix` / `.pbit` files (they embed imported data).
- Notebook outputs.
- `.env` files, keys, tokens, passwords, connection strings.
- Talend `talend.project` and connection metadata with credentials.

Published:

- Application source code.
- Notebook **code** only.
- Structure-only SQL scripts.
- Documentation with table and column names, without values.

## Audit performed before publication

| Item | Finding | Action |
|---|---|---|
| `datasa` SQL dump | 16 tables with data rows, including payroll per employee | All `INSERT` statements removed; verified that no data line remains |
| `data_war_house` SQL dump | 9 tables with data rows | Same |
| 4 notebooks | 146 saved outputs showing rows of real data and charts | All outputs and execution counts removed |
| `2023.ipynb` | Two real client names hard-coded as filters | Removed: rows are now selected by condition, so no client name appears in the code |
| Notebooks | Absolute Windows paths | Replaced with configurable relative paths |
| `visualisation.pbix` | Imported data model inside the file | Not committed; only page and field names documented |
| Talend archive | `talend.project` holds a user entry with a password hash | Not committed |
| Lovable project `.env` | Supabase URL and publishable (anon) key | Not committed; `app/.env.example` with placeholders provided |
| Lovable project source | Supabase project reference in `app/supabase/config.toml` and in `app/SUPABASE_AUTH_GUIDE.md` | Kept: a project reference is an identifier, not a credential, and is visible to every visitor of the deployed app |
| Application images and screenshots | Service photos, logo and three captures of public marketing pages; no financial data | Committed |
| Git history | One prior commit containing only a placeholder README | Nothing to remediate |

A pattern scan of the staged files (JWT-like strings, private-key headers, password assignments, spreadsheet/dump/pbix extensions) is part of the pre-commit review.

**Second audit phase.** The calculation audit was carried out on the confidential files locally; its report states impacts as ratios and row counts, with no amount and no client name. CI validates on every push that notebooks contain no output, no shell command and no local path. The CI workflow declares `contents: read` permissions, uses placeholder configuration values, and needs no repository secret. Unit-test and smoke-test fixtures are synthetic and labelled as such.

## Notes on the web application

- The Supabase **publishable (anon) key** is designed to be shipped to browsers; data protection relies on Row Level Security. RLS is enabled on `profiles`, `departements` and `donnees_utilisateur`, with owner-only policies on user data.
- A **service-role key must never** be placed in a `VITE_*` variable or committed.
- Testimonials, statistics, certifications and contact details displayed on the marketing pages are generated placeholder content, not verified company facts.
- If a `.env` file has ever been pushed to another remote, rotate the key in the Supabase dashboard.

## Power BI publication

**Current situation.** The report is distributed through *Publish to web*. This must be stated plainly:

- The URL is unauthenticated. Anyone who obtains it can open the report; it can be forwarded, indexed or embedded elsewhere.
- The web application embeds it behind a *Dashboard* button that every visitor sees, signed in or not. The application's login protects user profiles and service requests, **not** the report.
- The report is built on the real warehouse. Cards, charts and slicers disclose real aggregates (revenue, expenses, payroll cost, collections, FX losses) by period, country and department; small categories can reveal individual clients or suppliers.
- Excluding the `.pbix` file and the data rows from GitHub protects the *repository*. It does not protect the *report*.
- Microsoft documents *Publish to web* as intended for public information only, and tenant administrators can disable it.

The link is still documented in this repository because it is the project's delivered dashboard. It was not removed or altered during the audit; doing so is the owner's decision, to be taken with the company that owns the data.

**Recommended target**

| | 1 — Portfolio report | 2 — Company report | 3 — Power BI Embedded (optional) |
|---|---|---|---|
| Audience | Recruiters, public | Finance, management, HR of the company | Authenticated users of the web application |
| Data | Anonymised or synthetic | Real | Real |
| Access | Public link | Power BI workspace or app, Microsoft Entra sign-in | Embed token issued by a backend after login |
| Row-level security | Not needed | Roles per function; payroll restricted to HR | Effective identity passed with the embed token |
| Licence | Free / Pro to publish | Pro per user, or Premium / Fabric capacity | Embedded (A) or Fabric (F) capacity |
| Effort | Low | Low to medium | High: service principal, token endpoint, capacity cost |

1. **Anonymised portfolio report.** Duplicate the `.pbix`, point it at a dataset in which client, supplier, employee and bank names are replaced by stable pseudonyms and amounts are either synthetic or scaled by an undisclosed factor with noise; keep dates and structure so every visual still works. Remove unused tables from the model, check that no real label survives in slicers, titles, tooltips or the map, label the report "Demonstration data", publish it, and replace the URL in `README.md`, `powerbi/README.md` and `app/src/components/Header.tsx`. Scaling alone is weak protection when a third party knows one true figure; pseudonymised names plus synthetic amounts is the safer option for a public portfolio.
2. **Authenticated company report.** Publish the real report to a workspace, share it through a Power BI app or direct access to named users or security groups, define RLS roles (finance, management, HR), apply sensitivity labels if available, and **delete the existing embed code** (Power BI service → Settings → Manage embed codes) so the public URL stops working.
3. **Power BI Embedded.** Appropriate only if real-data reports must appear inside the web application. It needs a server-side component holding a service principal secret to request embed tokens — for example a Supabase Edge Function — and a capacity. A secret of that kind must never be placed in a `VITE_*` variable. For a portfolio project, option 1 in the public site and option 2 for the company cover the need at far lower cost.

**Interim measures** if the public link is kept for a demonstration period: obtain the data owner's explicit agreement, remove or aggregate payroll visuals, and set a date to delete the embed code.

## Requirements from the specification

| Requirement | Status | Proposed implementation |
|---|---|---|
| Separate accounts for finance, management, HR | Not implemented | Power BI workspace roles; MySQL users per role |
| Restricted rights on salaries and tax data | Not implemented | Row-level and object-level security in Power BI; MySQL views that exclude or aggregate `salaire_d`; column grants |
| Traceability of imports and exports | Not implemented | Talend load-log table (job, start, end, rows read/written/rejected); Power BI activity log |

## If confidential data is committed by mistake

1. Do not simply delete the file in a new commit — the data stays in history.
2. Treat the data as disclosed; rotate any exposed credential immediately.
3. Purge the file from history with `git filter-repo` and coordinate a force-push with every collaborator, or recreate the repository.
4. Ask GitHub Support to purge cached views if the repository was public.

History rewriting is destructive and must be a deliberate, manual decision.
