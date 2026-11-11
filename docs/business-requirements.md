# Business requirements

Summary of the project specification, *Cahier des charges fonctionnel et technique — Projet de mise en place de tableaux de bord décisionnels (BI) « Analyse Financière Dynamique »*, with the implementation status observed in the project files.

## Context

The company provides technical electricity and fluid services. It wants decision dashboards to analyse profitability overall and per client, and to optimise cash flows.

## Objectives

1. Centralise and make reliable the financial data: revenue, expenses, salaries, bank flows, foreign-exchange losses.
2. Analyse profitability dynamically by service, client, year and geographic zone.
3. Provide a forecasting capability to anticipate future financial flows.

## Goal tree

**Improve overall profitability**

| Sub-goal | Levers |
|---|---|
| Analyse profitability by project and client | Collections vs expenses; project margin; most profitable projects |
| Optimise cash flows | Average collection delay per client; late payments; projected flows |
| Reduce FX losses | Losses by country; expected vs collected differential; exchange-rate scenarios |
| Control internal costs | Monthly/annual payroll cost; split by department; CNSS and tax follow-up |
| Steer supplier spending | Expenses by HT/TVA/TTC; by supplier, period, payment method; actual vs budget |

## Data scope (2022 and 2023)

| Domain | Attributes |
|---|---|
| Export revenue | Country, client, amount, FX loss |
| Local revenue | Client, amount |
| Expenses | Supplier, payment type, HT/TVA/TTC amounts, period |
| Payroll | Employee, month, net salary, CNSS, fiscal charge, total cost, paying bank |

## Functional requirements and status

| # | Requirement | Status |
|---|---|---|
| 2.1 | Integrate 2022 and 2023 data for the four domains | Implemented |
| 2.2 | Reports with calculations, filters, charts | Implemented in Power BI |
| 2.2 | Export to PDF / Excel / PowerPoint | Native Power BI capability; not customised |
| 2.3 | Dynamic dashboards filterable by client, project, period | Period, country and department slicers implemented; no project attribute in the data |
| 2.3 | Profitability dashboard (collections vs expenses) | Implemented (*Résultat* page) |
| 2.3 | Export/local dashboard (revenue by country, FX losses) | Implemented (*Accueil*, *Produit* pages) |
| 2.3 | Expense dashboard | Implemented (*Charge* page) |
| 2.3 | Payroll dashboard | Payroll indicators on the *Charge* page |
| 2.3 | Forecast dashboard (time series) | **Planned — Future Development Phase** |
| 2.4 | Identify missing values, outliers, duplicates | Implemented (Python) |
| 2.4 | Clean with `SimpleImputer`, `KNNImputer`, `IterativeImputer` | `SimpleImputer` and `IterativeImputer` used; `KNNImputer` not applied |
| 2.4 | Apply to numeric and alphanumeric data | Implemented |
| 2.5 | KPI creation | Implemented as Power BI measures |
| 2.5 | KPI historisation | Not implemented |
| 2.5 | Thresholds and alerts | Not implemented |
| 2.5 | Simulation and forecasting | Exploratory prediction study delivered (no usable predictive power); forecasting and simulation **Planned — Future Development Phase** |
| 7 | Separate user accounts (finance, management, HR) | Not implemented |
| 7 | Restricted rights on sensitive data | Not implemented in the BI layer |
| 7 | Import/export traceability | Not implemented |

## Planning in the specification

| Phase | Specification status | Evidence in the project files |
|---|---|---|
| 1 — Data collection (Python) | Done | Notebooks |
| 2 — Exploration (Python) | Done | Notebooks |
| 3 — Cleaning and preparation (Talend) | Done | Cleaning is evidenced in Python; Talend Jobs not supplied |
| 4 — Staging load | Upcoming | Staging database exists |
| 5 — Data Warehouse modelling | — | Warehouse database exists |
| 6 — BI dashboards | — | Report built and published |
| 7 — Predictions and finalisation | — | Exploratory study in `prediction/`; forecasting not started |

The specification's planning reflects an earlier date; phases 4–6 have since been carried out.

## Deliverables

| Deliverable | Status |
|---|---|
| Talend ETL schemas | Built; not yet exported to this repository |
| Staging database | Delivered (structure published) |
| Structured Data Warehouse | Delivered (structure published; simplified model) |
| Interactive BI dashboards | Delivered (published report) |
| Prediction | Exploratory study delivered in `prediction/`; operational forecasting planned |

## Acceptance criteria

| Criterion | Assessment |
|---|---|
| Completeness and consistency across sources | Not formally tested; no reconciliation report exists yet |
| KPIs computed correctly | To be validated with the business; DAX definitions not yet documented |
| Dynamic dashboards filterable by client/project/period | Partially met (no project dimension) |
| Sensitive data secured | Not met in the BI layer (public link); enforced in this repository |
| Forecasts functional and validated | Not met: the exploratory models do not beat naive baselines; no forecast produced |
