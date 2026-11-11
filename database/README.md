# Database — MySQL Staging Area and Data Warehouse

Both scripts are **structure-only**. They were derived from phpMyAdmin exports (MariaDB 10.4.32) by removing every `INSERT` statement. No business data is included.

| Script | Database | Tables |
|---|---|---|
| `staging/datasa_schema.sql` | `datasa` | 16 |
| `warehouse/data_war_house_schema.sql` | `data_war_house` | 9 |

## Staging Area — `datasa`

| Group | Tables | Notes |
|---|---|---|
| Yearly landing tables | `depense2022`, `depense2023`, `export2022`, `export2023`, `local2022`, `local2023`, `salaires__2022`, `salaires__2023` | One table per cleaned sheet. Column types differ between years (for example `DATE` is `varchar` in one year and `datetime` in the other) |
| Unified tables | `depense_sa`, `export__sa`, `local_sa`, `salaire_sa` | Both years consolidated, surrogate integer key, dates as `datetime` |
| Collections | `encaissement` | Single table |
| Reference tables | `date__sa`, `departement_sa`, `reglement_sa` | Distinct dates, departments, payment methods |

Every table has a primary key. There is **no foreign key** in the staging database.

## Data Warehouse — `data_war_house`

| Table | Key | Role |
|---|---|---|
| `date_d` | `id` | Date dimension (single `DATE` column) |
| `departement_d` | `id` | Department dimension |
| `reglement_d` | `id` | Payment-method dimension |
| `depense_d` | `id_depense` | Expense records |
| `encaissement_d` | `id_encais` | Collection records |
| `export_d` | `id_export` | Export revenue records |
| `local_d` | `id_local` | Local revenue records |
| `salaire_d` | `id_salaire` | Payroll records |
| `fact_tabel` | *(none)* | Central fact table: `TYPE_DE_DEPENSES`, `HT`, `TVA`, `TTC` + 8 foreign keys |

Foreign keys (all on `fact_tabel`):

| Column | References | On delete |
|---|---|---|
| `date_fk` | `date_d(id)` | CASCADE |
| `departement_fk` | `departement_d(id)` | — |
| `reglement_fk` | `reglement_d(id)` | — |
| `salaire_fk` | `salaire_d(id_salaire)` | — |
| `encaissement_fk` | `encaissement_d(id_encais)` | — |
| `export_fk` | `export_d(id_export)` | — |
| `local_fk` | `local_d(id_local)` | — |
| `depense_fk` | `depense_d(id_depense)` | — |

## Implemented model vs. specification

| Specification | Implemented |
|---|---|
| Three fact tables: `F_CA`, `F_Dépenses`, `F_Salaires` | One fact table, `fact_tabel`, whose measures (`HT`, `TVA`, `TTC`) are expense measures |
| `Dim_Clients` | Not a separate table — client name is a column of `export_d` / `local_d` |
| `Dim_Fournisseurs` | Not a separate table — supplier is a column of `depense_d` |
| `Dim_Pays` | Not a separate table — country is a column of `export_d` / `local_d` |
| `Dim_Projets` | Not implemented — the sources hold no project identifier (`AFFAIRE` exists only in collections) |
| `Dim_Temps` (year, month, quarter) | `date_d` with a single `DATE` column; calendar attributes come from Power BI |
| — | `departement_d` and `reglement_d` added as dimensions |

The result is star-shaped (one fact, eight referenced tables), but five of those eight tables hold transaction-level records with their own measures rather than descriptive attributes. They behave more like fact tables than dimensions, and the Power BI report reads them directly.

## Observations

- Monetary and rate columns are mostly `VARCHAR(255)` (`CA`, `tx_conv`, `HT`, `TVA`, `TTC`, `CNSS`, …). Converting them to `DECIMAL` would enable aggregation and validation in SQL.
- `fact_tabel` has no primary key and its foreign keys are nullable.
- In the supplied export, `fact_tabel` contains far fewer rows than the tables it references, so it does not carry one row per transaction.
- No `AUTO_INCREMENT` is declared; keys are assigned by the loading process.
- Table name `fact_tabel` and several identifiers keep their original spelling to stay consistent with the Talend Jobs and the Power BI model.

## Validation

Both scripts were executed against an empty MariaDB 10.11 instance: they run without error and create 16 and 9 tables respectively, 24 primary keys and the 8 foreign keys of `fact_tabel`, with zero rows. They were not tested on MySQL 8, which is expected to accept them (integer display widths raise deprecation warnings there). Loading data requires the confidential workbooks and the Talend Jobs.

```bash
mysql -u root -p -e "CREATE DATABASE datasa; CREATE DATABASE data_war_house;"
mysql -u root -p datasa         < staging/datasa_schema.sql
mysql -u root -p data_war_house < warehouse/data_war_house_schema.sql
```
