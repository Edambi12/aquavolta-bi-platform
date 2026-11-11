# KPI catalog

KPIs are listed as defined in the specification, with the warehouse columns that can support them. **Formulas are those written in the specification.** Where the specification gives no formula, a neutral definition is proposed and flagged as such. The DAX actually used in the Power BI report was not extracted, so this catalog does not claim to describe the report's exact calculations.

Notation: amounts in TND unless stated. Column references use `table.column`.

## Profitability

| KPI | Definition (specification) | Supporting data | Notes |
|---|---|---|---|
| Profitability per project | Collections − Expenses | Collections: `export_d.Recouvrement`, `local_d.RECOUVREMENT`, `encaissement_d.paiement_TND`; expenses: `depense_d.TTC` | No project key exists in revenue or expense data. `encaissement_d.AFFAIRE` is the only project-like attribute, and expenses cannot be tied to it. Computable today by department or period only |
| Profitability per client | Σ of the client's projects | Client columns in `export_d`, `local_d` | Expenses are not attributed to clients, so only the collection side is client-level |
| Project margin (%) | Project result / Project collections | As above | Same limitation |

## Revenue

| KPI | Definition (specification) | Supporting data |
|---|---|---|
| Revenue variation 2022→2023, local and export, per country | Rate of change between the two years | `export_d.CA_TND`, `local_d.CA_HT` or `TTC`, `PAYS`, `DATE` |
| Department share of revenue | Department revenue (local/export) / revenue of all departments | `departement` in `export_d`, `local_d` |
| Country share of revenue | Country revenue / revenue of all countries | `PAYS` |

Rate of change is the standard `(value 2023 − value 2022) / value 2022`; the specification names the indicator without writing the formula.

Whether local revenue is measured excluding tax (`CA_HT`) or including tax (`TTC`) is not stated in the specification and must be fixed with the business.

## Expenses

| KPI | Definition (specification) | Supporting data |
|---|---|---|
| Share of all expenses relative to revenue (2022 / 2023) | Total expenses / revenue, per year | `depense_d`, `export_d`, `local_d` |
| Expenses by supplier, type, payment method, period | Breakdown | `depense_d.FOURNISSEUR`, `TYPE_DE_DEPENSES`, `REGLEMENT`, `DATE` |

Whether "all expenses" includes payroll cost is not specified.

## Payroll

| KPI | Definition (specification) | Supporting data |
|---|---|---|
| Annual and monthly payroll cost per department | Sum of total cost | `salaire_d.COUT_TOTAL`, `DEPARTEMENT`, `date` |
| CNSS, tax and net-salary follow-up | Sums | `salaire_d.CNSS`, `FISCAL`, `SALAIRE_NET` |

## Foreign exchange

| KPI | Definition (specification) | Supporting data |
|---|---|---|
| FX losses by country (export) | Sum of FX loss | `export_d.Perte_de_change`, `PAYS` |
| FX-loss variation 2022→2023 by bank | Rate of change | `export_d.Perte_de_change`, `Banque`, `DATE` |
| Bank share of FX losses | Bank's FX loss / FX loss of all banks | Same |

## Collections and receivables

| KPI | Definition (specification) | Supporting data | Notes |
|---|---|---|---|
| Actual export collections | (Collection × conversion rate) − FX loss | `export_d.Recouvrement`, `tx_conv`, `Perte_de_change` | Cash actually received in till and bank |
| Actual local collections | Collection − outstanding | `local_d.RECOUVREMENT`, `RESTANT` | Formula reproduced as written in the specification; its business meaning should be confirmed, since subtracting the outstanding balance from the collected amount is unusual |
| Client share of outstanding credit | Client's outstanding / total outstanding of all clients | `Restant` / `RESTANT`, client columns | |
| Average collection delay per client | Not defined in the specification | `encaissement_d.DATE`, `DATE_ENC` | Proposed: mean of (collection date − invoice date). `DATE_ENC` is stored as text and must be parsed |

## Measures present in the Power BI report

Names referenced by report visuals (definitions not extracted):

| Group | Measures / fields |
|---|---|
| Revenue | `CA global`, `CA étranger`, `TC CA`, `part` |
| Expenses | `dépense_global`, `TC depense`, `charge bancaire` |
| Result | `Résultat global`, `résultat 2022`, `résultat 2023`, `TC de résultat`, `taux de rentabilité` |
| Collections | `total encais`, `recouvrement tnd`, `recouv étranger`, `durée moyenne de créance client` |
| Counts | `nb client`, `nb banque`, `Nbre de feur`, `nbre de SALARIE` |

`TC` is read here as *taux de croissance* (growth rate) — an interpretation of the name, to confirm.

## KPIs not yet available

| KPI | Blocker |
|---|---|
| True per-project profitability and margin | No project key across revenue, expenses and payroll |
| Actual vs budgeted costs | No budget data |
| Expected vs collected FX differential, exchange-rate scenarios | Simulation not implemented |
| KPI history, thresholds and alerts | Not implemented |
| Forecast KPIs | **Planned — Future Development Phase** |
