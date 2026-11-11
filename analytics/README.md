# Analytics — Python exploration and cleaning

Four Jupyter notebooks document the exploration and cleaning work performed before the ETL phase. They are published **without any cell output**, because the outputs displayed real client names, salaries and transactions.

> A review of the financial calculations is in [calculation-audit.md](calculation-audit.md). One confirmed error was corrected; five calculations are flagged and left unchanged pending a business decision.

## Contents

| Path | Purpose |
|---|---|
| `notebooks/2022.ipynb`, `2023.ipynb`, `encaissement.ipynb`, `looktest.ipynb` | Cleaning notebooks |
| `notebooks/aquavolta_helpers.py` | Paths, workbook loading/saving, safe ratio, client-ratio imputation, identity control |
| `tests/test_helpers.py` | Unit tests of the helpers (synthetic fixtures) |
| `tools/validate_notebooks.py` | Static validation of the notebooks |
| `requirements.txt`, `requirements-dev.txt` | Runtime and test dependencies |
| `calculation-audit.md` | Financial calculation audit |

## Notebooks

| File | Source workbook → sheets | Cleaned output |
|---|---|---|
| `2022.ipynb` | `DATA FORMATION BI 2022.xlsx` → `EXPORT`, `LOCAL`, `DEPENSES`, `SALAIRES` | `OUTPUT___EXPORT2022`, `OUTPUT____LOCAL2022`, `OUTPUT___DEPENSE___2022`, `OUTPUT____SALAIRE2022` |
| `2023.ipynb` | `DATA FORMATION BI 2023.xlsx` → `EXPORT`, `LOCAL`, `DEPENSES`, `SALAIRES` | `OUTOUT___EXPORT2023`, `OUTPUT___LOCAL2023`, `OUTPUT___DEPENSE2023`, `OUTPUT____SALAIRE2023` |
| `encaissement.ipynb` | `DATA BI.xlsx` → `ENCAISSEMENTS` | `output____ENCAISSEMENT` |
| `looktest.ipynb` (originally `looktest (1).ipynb`) | `DATA BI.xlsx` → `DEPENSES` | `OUTPUT_DEPENSE` |

Output file names are unchanged, including their original spelling, because the downstream Talend Jobs expect them.

## Installation and execution

```bash
python -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r analytics/requirements.txt
```

Dependencies are installed from `requirements.txt` only; the notebooks contain no `pip` or shell command.

The source workbooks are confidential and are not distributed. Place them in `data/raw/` at the repository root (git-ignored), or point to their folder:

```bash
export AQUAVOLTA_DATA_DIR=/path/to/workbooks           # Windows: set AQUAVOLTA_DATA_DIR=C:\path
export AQUAVOLTA_OUTPUT_DIR=/path/to/cleaned/outputs   # optional, defaults to data/processed/
jupyter notebook analytics/notebooks
```

Run each notebook from top to bottom. Structure of every notebook: title and instructions → imports → helper import (prints the resolved folders) → one section per sheet. Each section reloads its sheet into `res`, so a section can be re-run on its own after the setup cells. A missing workbook or sheet raises an explicit error that says where the file is expected.

## Methodology implemented

**Initial exploration** — `shape`, `size`, `info()`, `describe()`, column listing for every sheet.

**Missing values** — `missingno` bar charts in all notebooks; `looktest.ipynb` adds the matrix, dendrogram and heatmap views and a count/percentage table per column.

**Duplicates** — `DataFrame.duplicated().sum()` on export, expenses and payroll sheets.

**Outliers** — box plot of export revenue by country; interquartile-range rule (1.5 × IQR) on export revenue; z-score rule (threshold 2) on FX loss, local TTC and total salary cost; log-transformed histogram of local TTC. Outliers are detected and displayed; no row is removed or capped on that basis.

**Imputation and correction**

| Technique | Where | Applied to |
|---|---|---|
| Mode (`Series.mode`) | `2022`, `2023`, `encaissement`, `looktest` | Client name, bank, description, payment fields |
| Mean | `looktest` | `HT` |
| Constant fill | `looktest` | `SODEXO`, `RS` → 0; `REMARQUE` → label |
| `SimpleImputer(strategy="most_frequent")` | `looktest` | `TF` |
| `IterativeImputer(estimator=BayesianRidge())` | `encaissement` | `CA €`, `tx conv`, `CA TND`, `paiement TND`, `TCL` |
| Client mean collection ratio | `2023` | Missing export collections (corrected implementation) |
| Row removal | `looktest` | Rows without an invoice number |
| Sequential renumbering | `2022` | Missing row numbers |

**Date normalisation** — dates are written as `dd/mm/YYYY`. `2023.ipynb` repairs malformed dates (two-digit years, out-of-range day or month); `encaissement.ipynb` does the same for the collection date; payroll months are mapped to the first day of the month.

**Categorical harmonisation** — department codes are unified (`ELEC` → `ELECTRICITE`, `GCIVILE` → `GENI CIVIL`); a mislabelled column is renamed (`date` → `type`).

**Financial recomputation** — local 2023: `tva 19% = HT × 0.19`, `TTC = HT × 1.19`; expenses 2023: `TTC = HT + TVA`; detailed expenses: observed VAT rate snapped to 7, 13 or 19 % (default 19 %), then `TVA`, `TTC = SODEXO + HT + TVA + TF` and `NET RS = TTC − RS`.

## Specification coverage

| Requirement | Status |
|---|---|
| `SimpleImputer` | Used with `most_frequent`; mean and mode are otherwise applied with pandas |
| `IterativeImputer` | Used (collections) — see audit finding F4 |
| `KNNImputer` | **Not applied** |
| Median imputation | **Not applied** |

## Changes made in the second audit phase

| Change | Type | Detail |
|---|---|---|
| Collection imputation in `2023.ipynb` | **Calculation correction** | Ratio used as a fraction instead of a percentage; rows selected by condition instead of `res.loc[11]` / `res.loc[28]`; safe division. Original lines kept as a commented block. Finding F1/F7 |
| Identity control in `2023.ipynb` | Added check | Lists rows where `CA € ≠ Recouvrement € + Restant €`; changes no value |
| Review notes | Documentation | Markdown notes before the five calculations left unchanged (F3–F6) |
| `aquavolta_helpers.py` | Refactoring | Path resolution independent of the working directory; `load_sheet` / `save_output` with explicit errors |
| `!pip install missingno` | Removed | Installation is documented above |
| Unused imports | Removed | `IsolationForest`, `zscore`, `KNNImputer`, `MissingIndicator`, `calendar`, `dateutil.parser`, and others not referenced by any cell |
| Duplicate function definitions in `2022.ipynb` | Removed | `detect_outliers_zscore` is defined once |
| Bare `except:` in `fix_date` | Narrowed | `except ValueError:` |
| Titles and section headers | Added | One markdown header per sheet |
| Client-name literals | Removed | No client name remains in the code |

No other calculation was modified. Exploratory cells were all kept.

## Verification

| Check | Command | Result |
|---|---|---|
| Static validation | `python analytics/tools/validate_notebooks.py` | 4 notebooks OK |
| Unit tests | `pip install -r analytics/requirements-dev.txt && python -m pytest analytics/tests -q` | 9 passed |
| End-to-end execution | All code cells of the four notebooks executed in order | Passed on throwaway **synthetic** workbooks generated only to exercise the code; not kept, not a business result |
| Execution on real workbooks | — | **Not performed**: the workbooks were not available |

Both automated checks also run in GitHub Actions.
