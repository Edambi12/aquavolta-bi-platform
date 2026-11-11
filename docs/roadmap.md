# Roadmap

## Current state

| Phase | Status |
|---|---|
| Data collection and exploration (Python) | Done |
| Cleaning and preparation | Done |
| Staging Area (MySQL) | Done |
| Data Warehouse (MySQL) | Done — simplified model |
| Power BI dashboards | Done — published |
| Web application | Done |
| Predictive analytics | **Planned — Future Development Phase** |

## Short term — consolidate what exists

- **Export the Talend Jobs** to `etl/talend/` with credentials and paths moved to context variables (see `etl/README.md`).
- **Document the DAX measures** of the report in `docs/kpi-catalog.md`.
- **Add approved screenshots** of the report and the application, captured from anonymised data.
- **Create a synthetic demonstration dataset** matching the schemas, clearly labelled as synthetic, so the pipeline can be run end to end without confidential data.
- **Review the points raised in `analytics/README.md`** (collection-ratio imputation, index-based fills).
- **Apply `KNNImputer` and median imputation** where relevant, to complete the cleaning methods required by the specification, and compare them with the current choices.

## Medium term — strengthen the model and governance

- **Dimensional model:** introduce `Dim_Clients`, `Dim_Fournisseurs`, `Dim_Pays` and a full `Dim_Temps` (year, quarter, month); split facts into revenue, expenses and payroll as in the specification; type monetary columns as `DECIMAL`.
- **Project dimension:** define a project identifier with the business so that per-project profitability and margin become computable.
- **Data quality:** row-count reconciliation between source, staging and warehouse; rejected-row tables; load logging.
- **Security:** role-based access (finance, management, HR), restricted visibility of payroll data, replacement of the public report link by authenticated sharing.
- **KPI steering:** historisation of KPIs, thresholds and alerts.
- **Frontend quality:** resolve linter findings, add tests, code-split the bundle.

## Predictive analytics — Planned — Future Development Phase

Nothing in this section is implemented. No model has been trained, and no accuracy figure or forecast exists.

**Objectives from the specification**

- Forecast future financial flows (time-series projection).
- Forecast foreign-exchange losses.
- Simulate scenarios, for example by exchange rate.

**Preconditions**

- A validated, typed warehouse with reconciled history.
- Agreement on forecast targets, granularity and horizon.
- An honest assessment of data volume: two years of history gives at most 24 monthly points per series, which strongly limits model choice and the reliability of any seasonal estimate.

**Intended approach**

1. Build monthly series from the warehouse: collections, revenue (local/export), expenses, payroll cost, FX losses.
2. Start with simple baselines (naive, seasonal naive, moving average) and evaluate candidates such as exponential smoothing or ARIMA against them with time-ordered validation.
3. Report error metrics on held-out periods together with uncertainty intervals.
4. Store forecasts in dedicated warehouse tables, separate from actuals, with model and run metadata.
5. Add a forecast page to the Power BI report, visually distinct from historical data.
6. Have results validated by the business before they are used, as the acceptance criteria require.

**Planned repository location:** `analytics/forecasting/` for notebooks and scripts; new forecast tables under `database/warehouse/`.
