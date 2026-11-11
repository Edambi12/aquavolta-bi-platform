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
| Exploratory prediction study (`prediction/`) | Done — negative result |
| Time-series forecasting of flows and FX losses | **Planned — Future Development Phase** |

## Delivered in the second audit phase

- Financial calculation audit of the four notebooks; one confirmed error corrected in `2023.ipynb`.
- Shared helper module, unit tests and a static notebook validator; shell commands removed from notebooks.
- Read-only data-quality controls for the current warehouse.
- Architecture review and proposed target star schema with migration roadmap.
- Frontend lint errors fixed (11 → 0) without functional or visual change.
- GitHub Actions CI for the frontend and the analytics code.

## Immediate — data corrections

1. **Decide the treatment of the two 2023 export invoices** (estimated collection vs. zero), then re-run `2023.ipynb`, reload staging and warehouse, refresh the Power BI dataset. Controls C1 and C2 must return no row.
2. **Settle the open calculation findings** F3 to F6 and F11 with the business and adapt the notebooks accordingly.
3. **Replace or disable the public Power BI link** (see `docs/security-and-privacy.md`).

## Short term — consolidate what exists

- **Export the Talend Jobs** to `etl/talend/` with credentials and paths moved to context variables (see `etl/README.md`).
- **Document the DAX measures** of the report in `docs/kpi-catalog.md`.
- **Add approved screenshots** of the report and the application, captured from anonymised data.
- **Create a synthetic demonstration dataset** matching the schemas, clearly labelled as synthetic, so the pipeline can be run end to end without confidential data.
- **Run the data-quality controls after every load** and keep their output with the load log.
- **Re-execute the notebooks on the real workbooks** and compare outputs with the loaded tables.
- **Apply `KNNImputer` and median imputation** where relevant, to complete the cleaning methods required by the specification, and compare them with the current choices.

## Medium term — strengthen the model and governance

- **Dimensional model:** migrate to the target star schema following the phased plan in `docs/dwh-target-model.md` (parallel run, reconciliation, compatibility views, page-by-page switch of the report).
- **Project dimension:** define a project identifier with the business so that per-project profitability and margin become computable.
- **Data quality:** row-count reconciliation between source, staging and warehouse; rejected-row tables; load logging.
- **Security:** role-based access (finance, management, HR), restricted visibility of payroll data, an authenticated report for company users and an anonymised report for the portfolio; Power BI Embedded if the report must be served inside the web application to authenticated users.
- **KPI steering:** historisation of KPIs, thresholds and alerts.
- **Frontend quality:** add component and end-to-end tests, code-split the bundle, gate the dashboard entry behind authentication once the report is private.
- **CI:** add a SQL job that creates the schemas on a MySQL service container.

## Predictive analytics

**Delivered — exploratory study.** `prediction/` compares Extra Trees, CatBoost, Ridge, a partial-pooling model and naive baselines for predicting an export invoice amount from country and department, under leave-one-group-out validation. Every model has a negative R² and none reliably beats the baselines. The study shows that these two predictors and 58 invoices are not enough; it produces no forecast.

**Forecasting — Planned — Future Development Phase.** Nothing below is implemented. No time-series model has been trained and no forecast exists.

**Objectives from the specification**

- Forecast future financial flows (time-series projection).
- Forecast foreign-exchange losses.
- Simulate scenarios, for example by exchange rate.

**Preconditions**

- Corrected and reconciled history: forecasting on the current 2023 export collections would learn from an error.
- A validated, typed warehouse.
- Agreement on forecast targets, granularity and horizon.
- An honest assessment of data volume: two years of history gives at most 24 monthly points per series, which strongly limits model choice and the reliability of any seasonal estimate.

**Intended approach**

1. Build monthly series from the warehouse: collections, revenue (local/export), expenses, payroll cost, FX losses.
2. Start with simple baselines (naive, seasonal naive, moving average) and evaluate candidates such as exponential smoothing or ARIMA against them with time-ordered validation.
3. Report error metrics on held-out periods together with uncertainty intervals.
4. Store forecasts in dedicated warehouse tables, separate from actuals, with model and run metadata.
5. Add a forecast page to the Power BI report, visually distinct from historical data.
6. Have results validated by the business before they are used, as the acceptance criteria require.

**Repository location:** `prediction/` for notebooks and scripts; new forecast tables in the warehouse.
