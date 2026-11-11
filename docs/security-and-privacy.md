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
| `2023.ipynb` | Two real client names hard-coded as filters | Replaced with `CLIENT_A` / `CLIENT_B` |
| Notebooks | Absolute Windows paths | Replaced with configurable relative paths |
| `visualisation.pbix` | Imported data model inside the file | Not committed; only page and field names documented |
| Talend archive | `talend.project` holds a user entry with a password hash | Not committed |
| Lovable project `.env` | Supabase URL and publishable (anon) key | Not committed; `app/.env.example` with placeholders provided |
| Lovable project source | Supabase project reference in `app/supabase/config.toml` and in `app/SUPABASE_AUTH_GUIDE.md` | Kept: a project reference is an identifier, not a credential, and is visible to every visitor of the deployed app |
| Application images and screenshots | Service photos, logo and three captures of public marketing pages; no financial data | Committed |
| Git history | One prior commit containing only a placeholder README | Nothing to remediate |

A pattern scan of the staged files (JWT-like strings, private-key headers, password assignments, spreadsheet/dump/pbix extensions) is part of the pre-commit review.

## Notes on the web application

- The Supabase **publishable (anon) key** is designed to be shipped to browsers; data protection relies on Row Level Security. RLS is enabled on `profiles`, `departements` and `donnees_utilisateur`, with owner-only policies on user data.
- A **service-role key must never** be placed in a `VITE_*` variable or committed.
- Testimonials, statistics, certifications and contact details displayed on the marketing pages are generated placeholder content, not verified company facts.
- If a `.env` file has ever been pushed to another remote, rotate the key in the Supabase dashboard.

## Exposure outside this repository

**The Power BI report is shared through "Publish to web".** That mechanism creates an unauthenticated public URL: anyone with the link can view the report and its underlying aggregated figures, and the link is embedded in a public web page. For confidential financial data this is the main residual risk of the solution. Options:

1. Replace the dataset behind the public report with anonymised or synthetic data.
2. Share the real report only through authenticated Power BI workspaces or Power BI Embedded.
3. Disable the public embed code when the demonstration period ends.

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
