# Data dictionary

Column names are those of the MySQL databases. Descriptions are based on the column names, the notebooks and the specification; items marked *(to confirm)* could not be verified from the project files.

Unless noted, the staging table (`*_sa`) and warehouse table (`*_d`) share the same columns.

## Export revenue — `export__sa` / `export_d`

| Column | Type | Description |
|---|---|---|
| `id_export` | int, PK | Surrogate key |
| `DATE` | datetime | Invoice date |
| `PAYS` | varchar | Client country |
| `Type` | varchar | Record type label |
| `Nom_du_client` | varchar | Client name |
| `departement` | varchar | Department (electricity, fluids, civil engineering) |
| `CA` | varchar | Revenue in foreign currency (source column `CA €`) |
| `tx_conv` | varchar | Conversion rate to TND |
| `CA_TND` | varchar | Revenue converted to Tunisian dinar |
| `Recouvrement` | varchar | Amount collected (source column `Recouvrement €`) |
| `Restant` | varchar | Outstanding balance |
| `Perte_de_change` | varchar | Foreign-exchange loss |
| `Banque` | varchar | Receiving bank |

The yearly table `export2023` additionally holds `N__FCT` (invoice number).

## Local revenue — `local_sa` / `local_d`

| Column | Type | Description |
|---|---|---|
| `id_local` | int, PK | Surrogate key |
| `Date` | datetime | Invoice date |
| `PAYS` | varchar | Country |
| `type` | varchar | Record type label |
| `NOM_DU_CLIENT` | varchar | Client name |
| `departement` | varchar | Department |
| `CA_HT` | varchar | Revenue excluding tax |
| `tva_19` | varchar | VAT at 19 % |
| `TTC` | varchar | Revenue including tax |
| `RECOUVREMENT` | varchar | Amount collected |
| `RESTANT` | varchar | Outstanding balance |
| `Banque` | varchar | Receiving bank |

`local2023` names the pre-tax amount `HT` and adds `N__FCT`.

## Expenses — `depense_sa` / `depense_d`

| Column | Type | Description |
|---|---|---|
| `id_depense` | int, PK | Surrogate key |
| `DATE` | datetime | Expense date |
| `DEPARTEMENT` | varchar | Department |
| `TYPE_DE_DEPENSES` | varchar | Expense category |
| `FOURNISSEUR` | varchar | Supplier |
| `HT` | varchar | Amount excluding tax |
| `TVA` | varchar | VAT amount |
| `TTC` | varchar | Amount including tax |
| `REGLEMENT` | varchar | Payment method |

## Payroll — `salaire_sa` / `salaire_d`

| Column | Type | Description |
|---|---|---|
| `id_salaire` | int, PK | Surrogate key |
| `SALARIE` | varchar | Employee — **personal data** |
| `MOIS` | varchar | Month name |
| `DEPARTEMENT` | varchar | Department |
| `SALAIRE_NET` | int | Net salary — **sensitive** |
| `CNSS` | varchar | Social-security contribution |
| `FISCAL` | varchar | Tax charge |
| `TICKET_RESTO` | int | Meal vouchers |
| `COUT_TOTAL` | varchar | Total employer cost |
| `banque` | varchar | Paying bank |
| `date` | datetime | First day of the pay month (derived in Python) |

## Collections — `encaissement` / `encaissement_d`

| Column | Type | Description |
|---|---|---|
| `id_encais` | int, PK | Surrogate key |
| `DATE` | datetime | Invoice date |
| `NCG`, `ICG`, `NCT`, `NCG_1`, `ICG_1` | int / varchar | Accounting and third-party codes *(to confirm)* |
| `N__FCT` | int | Invoice number |
| `AFFAIRE` | varchar | Business deal / project label |
| `CA` | varchar | Invoiced amount in foreign currency |
| `tx_conv` | varchar | Conversion rate |
| `CA_TND` | varchar | Invoiced amount in TND |
| `paiement_TND` | varchar | Payment received in TND |
| `TCL` | varchar | Bank charge on the transfer *(to confirm)* |
| `RECU__frais_deduits` | varchar | Amount received net of fees, or status `PAYE` |
| `DATE_ENC` | varchar | Collection date (`dd/mm/YYYY` text) |
| `BANQUE` | varchar | Receiving bank |

## Reference and dimension tables

| Table (staging / warehouse) | Columns | Description |
|---|---|---|
| `date__sa` / `date_d` | `id` PK, `DATE` | Distinct dates |
| `departement_sa` / `departement_d` | `id` PK, `departement` | Departments |
| `reglement_sa` / `reglement_d` | `id` PK, `REGLEMENT` | Payment methods |

## Fact table — `fact_tabel` (warehouse only)

| Column | Type | Description |
|---|---|---|
| `TYPE_DE_DEPENSES` | varchar | Expense category (degenerate attribute) |
| `HT`, `TVA`, `TTC` | varchar | Expense amounts |
| `departement_fk` | int → `departement_d.id` | |
| `reglement_fk` | int → `reglement_d.id` | |
| `date_fk` | int → `date_d.id` | |
| `encaissement_fk` | int → `encaissement_d.id_encais` | |
| `export_fk` | int → `export_d.id_export` | |
| `local_fk` | int → `local_d.id_local` | |
| `salaire_fk` | int → `salaire_d.id_salaire` | |
| `depense_fk` | int → `depense_d.id_depense` | |

## Yearly landing tables (staging only)

`depense2022`, `depense2023`, `export2022`, `export2023`, `local2022`, `local2023`, `salaires__2022`, `salaires__2023` mirror the cleaned sheets, keyed by the source row number `N` (or `id` for payroll). Types are not harmonised between years.

## Web application tables (Supabase / PostgreSQL)

| Table | Columns | Access rule |
|---|---|---|
| `profiles` | `id` (→ `auth.users`), `email`, `first_name`, `last_name`, `birth_date`, `client_type` (`local` / `étranger`), `company_name`, `country`, `payment_currency`, timestamps | Owner can select, insert, update |
| `departements` | `id`, `nom`, `created_at` | Readable by authenticated users |
| `donnees_utilisateur` | `id`, `departement_id` (→ `departements`), `utilisateur_id` (→ `auth.users`), `contenu` (JSONB), timestamps | Owner can select, insert, update, delete |

## Sensitivity classification

| Level | Data |
|---|---|
| Personal + confidential | Employee names, salaries, CNSS and tax amounts |
| Confidential | Client and supplier names, invoice amounts, balances, bank names, FX losses |
| Internal | Department, expense category and payment-method labels |
