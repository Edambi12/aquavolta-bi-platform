# ETL — Talend

## What is known

| Item | Value |
|---|---|
| Tool | Talend Open Studio for Data Integration **8.0.1** (build 20211109_1610) |
| Project name | `DATAWARHOUSE` |
| Language | Java |
| Targets | MySQL databases `datasa` (staging) and `data_war_house` (warehouse) |

## What is missing

The archive supplied for this repository (`DATAWARHOUSE.zip`) contained only:

```text
DATAWARHOUSE/talend.project
DATAWARHOUSE/.settings/project.settings
DATAWARHOUSE/.settings/migration_task.index
DATAWARHOUSE/.settings/relationship.index      (empty)
```

These are project-level settings. **There is no `process/` folder and therefore no Job.** The relationship index is empty, which confirms that no Job, connection or schema was part of the export. For that reason:

- no Talend Job is published in this repository;
- no component-level description of the Jobs (`tFileInputExcel`, `tMap`, `tDBOutput`, …) is given, because it could not be verified;
- `talend.project` itself is not committed, as it stores a user entry with a password hash.

## How to export the Jobs

In Talend Studio: right-click **Job Designs → Export items**, tick every Job, enable **Export dependencies**, and export to an archive or folder. The export should contain:

```text
DATAWARHOUSE/
├── talend.project
├── process/
│   ├── <JobName>_0.1.item          # Job design (components, links, tMap expressions)
│   ├── <JobName>_0.1.properties    # Job metadata
│   └── <JobName>_0.1.screenshot    # optional canvas preview
├── metadata/
│   ├── connections/*.item|*.properties        # MySQL connections
│   └── fileExcel/*.item|*.properties          # Excel file schemas
└── context/*.item|*.properties                # context variables
```

Before committing the export to `etl/talend/`:

1. Replace database passwords in `metadata/connections/*.item` and in context files with context variables or placeholders.
2. Replace absolute Windows file paths with a context variable such as `context.data_dir`.
3. Do not include `talend.project` unless the user entry has been removed.
4. Check that no sample data was captured in `.item` files (for example in `tFixedFlowInput` components).

## What the databases show about the ETL

The following is inferred from the database structures only, not from Job definitions:

- Cleaned workbooks are loaded year by year (`depense2022`, `depense2023`, `export2022`, …).
- The yearly tables are consolidated into unified staging tables (`depense_sa`, `export__sa`, `local_sa`, `salaire_sa`); year-specific columns such as the invoice number `N__FCT` are not carried over.
- Reference tables are derived for dates, departments and payment methods (`date__sa`, `departement_sa`, `reglement_sa`).
- Staging tables are copied to the warehouse `*_d` tables, and `fact_tabel` is populated with foreign keys to them.

See [docs/data-pipeline.md](../docs/data-pipeline.md).
