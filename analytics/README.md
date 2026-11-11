# Analytics — Python exploration and cleaning

Four Jupyter notebooks document the exploration and cleaning work performed before the ETL phase. They are published **without any cell output**, because the outputs displayed real client names, salaries and transactions.

## Notebooks

| File | Original name | Source workbook → sheets | Cleaned output |
|---|---|---|---|
| `notebooks/2022.ipynb` | `2022.ipynb` | `DATA FORMATION BI 2022.xlsx` → `EXPORT`, `LOCAL`, `DEPENSES`, `SALAIRES` | `OUTPUT___EXPORT2022`, `OUTPUT____LOCAL2022`, `OUTPUT___DEPENSE___2022`, `OUTPUT____SALAIRE2022` |
| `notebooks/2023.ipynb` | `2023.ipynb` | `DATA FORMATION BI 2023.xlsx` → `EXPORT`, `LOCAL`, `DEPENSES`, `SALAIRES` | `OUTOUT___EXPORT2023`, `OUTPUT___LOCAL2023`, `OUTPUT___DEPENSE2023`, `OUTPUT____SALAIRE2023` |
| `notebooks/encaissement.ipynb` | `encaissement.ipynb` | `DATA BI.xlsx` → `ENCAISSEMENTS` | `output____ENCAISSEMENT` |
| `notebooks/looktest.ipynb` | `looktest (1).ipynb` | `DATA BI.xlsx` → `DEPENSES` | `OUTPUT_DEPENSE` |

## Methodology actually implemented

**Initial exploration** — `shape`, `size`, `info()`, `describe()`, column listing for every sheet.

**Missing values** — `missingno` bar charts in all notebooks; `looktest.ipynb` adds the matrix, dendrogram and heatmap views and a count/percentage table per column.

**Duplicates** — `DataFrame.duplicated().sum()` on export, expenses and payroll sheets.

**Outliers**
- Box plot of export revenue by country (`2022.ipynb`).
- Interquartile-range rule (1.5 × IQR) on export revenue.
- z-score rule (threshold 2) on FX loss, local TTC and total salary cost.
- Log-transformed histogram of local TTC to inspect skew.

Outliers are *detected and displayed*; no row is removed or capped on that basis.

**Imputation and correction**

| Technique | Where | Applied to |
|---|---|---|
| Mode (`Series.mode`) | `2022`, `2023`, `encaissement`, `looktest` | Client name, bank, description, payment fields |
| Mean | `looktest` | `HT` |
| Constant fill | `looktest` | `SODEXO`, `RS` → 0; `REMARQUE` → label |
| `SimpleImputer(strategy="most_frequent")` | `looktest` | `TF` |
| `IterativeImputer(estimator=BayesianRidge())` | `encaissement` | `CA €`, `tx conv`, `CA TND`, `paiement TND`, `TCL` |
| Client-level ratio | `2023` | Missing export collection, estimated from the same client's average collection ratio |
| Row removal | `looktest` | Rows without an invoice number |
| Sequential renumbering | `2022` | Missing row numbers |

**Date normalisation** — all dates are written as `dd/mm/YYYY`. `2023.ipynb` contains a repair function for malformed dates (two-digit years, out-of-range day or month); `encaissement.ipynb` contains a similar function for the collection date; payroll months (`JANVIER` … `DECEMBRE`) are mapped to the first day of the month.

**Categorical harmonisation** — department codes are unified (`ELEC` → `ELECTRICITE`, `GCIVILE` → `GENI CIVIL`); a mislabelled column is renamed (`date` → `type`).

**Financial recomputation**
- Local 2023: `tva 19% = HT × 0.19`, `TTC = HT × 1.19`.
- Expenses 2023: `TTC = HT + TVA`.
- Detailed expenses: the observed VAT rate `TVA / HT` is snapped to the nearest legal rate (7, 13 or 19 %, default 19 %), `TVA` is recomputed, then `TTC = SODEXO + HT + TVA + TF` and `NET RS = TTC − RS`.

## Specification coverage

The specification asks for `SimpleImputer` (mode, median, mean), `KNNImputer` and `IterativeImputer`.

| Requirement | Status |
|---|---|
| `SimpleImputer` | Used with `most_frequent`; mean and mode are otherwise applied with pandas |
| `IterativeImputer` | Used (collections) |
| `KNNImputer` | Imported, **not applied** |
| Median imputation | Not applied |
| `IsolationForest` | Imported, **not applied** |

## Changes made for publication

1. All cell outputs and execution counts removed.
2. Hard-coded Windows paths (`C:\formation BI\…`) replaced by `DATA_DIR` / `OUTPUT_DIR`, configured in a cell added after the imports and overridable with `AQUAVOLTA_DATA_DIR` / `AQUAVOLTA_OUTPUT_DIR`.
3. Two real client names used as filters in `2023.ipynb` replaced by `CLIENT_A` / `CLIENT_B`. Restore the real labels locally to reproduce the run.
4. Empty cells dropped; kernel metadata set to the generic `python3` kernel.

No calculation was modified.

## Points to review

These are observations on the original logic, left unchanged:

- `2023.ipynb` computes a client's collection ratio as a **percentage** (`× 100`) and then multiplies revenue by it without dividing by 100. The imputed collection amounts for the two affected rows should be checked.
- The same notebook fills rows by fixed index (`res.loc[11]`, `res.loc[28]`), which depends on the row order of the source sheet.
- Mode imputation of a missing client name assigns the most frequent client to unidentified invoices, which can bias per-client KPIs.

## Running

```bash
pip install -r analytics/requirements.txt
export AQUAVOLTA_DATA_DIR=/path/to/workbooks     # confidential, not distributed
jupyter notebook analytics/notebooks
```

The notebooks were syntax-checked after sanitisation but were not re-executed, since the source workbooks are not part of this repository.
