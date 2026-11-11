# Financial calculation audit — notebooks

Second-phase review of the financial logic in the four cleaning notebooks.

**How the audit was done.** The original notebooks (with their saved outputs) and the two MySQL exports were examined locally. Those files are confidential and are not in this repository. To keep it that way, impacts are reported here as **ratios and row counts, never as amounts or client names**.

**Status vocabulary.** *Confirmed* = reproduced from the saved outputs and from the loaded tables. *Corrected* = the notebook was changed. *Open* = documented, calculation left as written, business decision needed.

| # | Finding | Severity | Status |
|---|---|---|---|
| F1 | Collection imputed as revenue × percentage instead of revenue × ratio | Critical | Confirmed — **corrected** |
| F2 | Imputed collections contradict the outstanding balance of the same invoice | High | Confirmed — open |
| F3 | Missing client names replaced by the most frequent client | High | Confirmed — open |
| F4 | Missing payments estimated by a regression model | High | Confirmed — open |
| F5 | Local 2023 VAT/TTC overwritten at 19 % for all rows | Medium | Confirmed — open |
| F6 | Zero or missing VAT rate forced to 19 % on detailed expenses | High | Confirmed — open |
| F7 | Rows addressed by fixed position | Medium | Confirmed — **corrected** |
| F8 | Unprotected divisions | Low | No occurrence in current data — **guarded** |
| F9 | Impossible dates silently clamped | Low | Confirmed — open |
| F10 | Mean of ratios vs. weighted ratio | Low | Methodological note |
| F11 | Country labels differing by letter case | Medium | Confirmed — open |

---

## F1 — Percentage used as a ratio (`2023.ipynb`, sheet `EXPORT`)

**1. Original formula**

```python
res["comport"] = (res['Recouvrement €'] / res['CA €']) * 100      # percent
r1 = res_filtré['comport'].mean(skipna=True)                       # e.g. 92.3
res.loc[11, "Recouvrement €"] = res.loc[11, 'CA €'] * r1
```

and the same pattern with `r2` for row 28.

**2. Mathematical interpretation.** `comport` is the collection rate of an invoice **in percent** (100 = fully collected). `r1` and `r2` are client averages of that percentage, observed at about 92 and 99.5. The intent is: *estimated collection = revenue × the client's usual collection rate*.

**3. Error.** The percentage is multiplied by revenue without dividing by 100. The imputed collection equals revenue × 92.3 and revenue × 99.5, i.e. **about a hundred times the invoice amount**.

**4. Correct formula**

```
estimated collection = revenue × (client mean collection rate in % / 100)
                     = revenue × client mean collection ratio (0–1)
```

**5. Impact (computed on the authorised local data)**

- Two export invoices of 2023 are affected, out of 29.
- On those two rows the stored collection is **92.3× and 99.5× the invoiced amount**.
- These two rows account for roughly **nine tenths** of the total 2023 export collections as stored.
- Total 2023 export collections as stored are about **9.9× the total 2023 export revenue**. With the corrected formula the ratio is about **0.90**; if the two invoices are treated as uncollected (see F2) it is about **0.81**.
- The inflated values are present in the staging table `export2023` **and in the warehouse table `export_d`**, which the Power BI report reads. Any measure built on export collections for 2023 is therefore overstated in the loaded data until the pipeline is re-run.
- **Visible in the published report.** Screenshots of the *Produit* page show collections of 15.84 M against foreign revenue of 4.00 M, and a liquidity figure of 18.91 M against a global revenue of 7.69 M. The size of the gap is consistent with the overstatement once converted to dinars.

**Correction.** `2023.ipynb` now calls `impute_collection_from_client_ratio()` (in `aquavolta_helpers.py`). The methodology is unchanged — client mean of per-invoice collection ratios — but the ratio is a fraction. The original lines are kept as a commented block in the notebook. Unit tests cover the behaviour (`analytics/tests/`).

**Remediation of loaded data.** Correcting the notebook does not correct data already loaded. Either:

1. re-run `2023.ipynb` on the source workbook, reload staging and warehouse through Talend, then refresh the Power BI dataset; or
2. apply a controlled, logged `UPDATE` to the two rows in staging and warehouse, after the business has chosen between the F1 and F2 values.

`database/checks/data_quality_checks.sql` (controls C1 and C2) lists the affected rows and should return no row once fixed.

---

## F2 — Imputed collection contradicts the outstanding balance

**1. Original logic.** The collected amount is imputed only because the cell is empty. The `Restant €` column of the same rows is not consulted.

**2. Interpretation.** For every other export invoice of both years, `CA € = Recouvrement € + Restant €` holds exactly.

**3. Possible error.** On the two rows with a missing collection, the source records `Restant € = CA €`: the invoice is entirely outstanding. The most direct reading is that **nothing has been collected** and the empty cell means zero. Any positive imputed value — even the corrected one — makes collected + outstanding exceed the invoice.

**4. Candidate formula.** `Recouvrement € = CA € − Restant €`, which gives `0` for both rows. This is an accounting identity, not an estimate.

**5. Impact.** Relative to the F1-corrected values, total 2023 export collections would be about 10 % lower (ratio to revenue ≈ 0.81 instead of ≈ 0.90).

**Decision needed.** This is a business question (were these invoices unpaid at the extraction date?), so the notebook does not choose. It keeps the original methodology and adds a control cell, `check_collection_identity()`, that lists the rows breaking the identity.

A related anomaly: both rows carry a non-zero foreign-exchange loss although nothing is recorded as collected (control C4). The source values should be checked.

---

## F3 — Missing client name replaced by the mode (`2022.ipynb`, `2023.ipynb`, sheet `LOCAL`)

**1. Original formula.** `res['NOM DU CLIENT'].fillna(mode)`.

**2. Interpretation.** Two local invoices per year (2 of 29, 6.9 %) have no client name; they are attributed to the most frequent client.

**3. Problem.** The mode is a real client. The method does not estimate *who* the client is; it transfers revenue to whoever invoices most often. With only four local clients the distortion is material.

**4. Recommended alternative.** A neutral label (`CLIENT NON IDENTIFIE`) kept visible in reports, or recovery of the name from the invoice number.

**5. Impact (local data).** The invoices concerned represent about 4 % (2022) and 6.5 % (2023) of local revenue including tax. They raise the revenue attributed to the most frequent client by about **11 % in 2022 and 20 % in 2023**, moving its share of local revenue from about 39 % to 43 % (2022) and from about 32 % to 39 % (2023). Client ranking, client share of revenue and client share of outstanding balances are affected.

**Status.** Calculation unchanged; a review note was added before the cell.

---

## F4 — Payments estimated by regression (`encaissement.ipynb`)

**1. Original formula.** `IterativeImputer(estimator=BayesianRidge())` fitted on `CA €`, `tx conv`, `CA TND`, `paiement TND`, `TCL`; missing values replaced by predictions.

**2. Interpretation.** `paiement TND` is empty on 9 of 29 invoices. The model predicts a payment from the invoice amount and the exchange rate.

**3. Problem.** A missing payment on a collections sheet usually means the invoice has not been paid. Predicting a value creates cash that may not exist, and predicted bank charges with it. With 20 complete rows and near-collinear predictors (`CA TND = CA € × tx conv`), the model essentially reproduces the invoice amount. A later cell then replaces any numeric `RECU` value by the label `PAYE`.

**4. Recommended alternative.** Leave unpaid invoices empty (or `0`) with an explicit status, or impute only after the business confirms payment; keep a flag column for imputed rows.

**5. Impact.** Not quantified: the payment status of the nine invoices is not known from the files available.

**Status.** Calculation unchanged; review note added.

---

## F5 — Local 2023: VAT and TTC overwritten (`2023.ipynb`, sheet `LOCAL`)

**1. Original formula.** `tva 19% = HT × 0.19`, `TTC = HT × 1.19` for every row.

**2. Interpretation.** A uniform 19 % rate is assumed.

**3. Problem.** Rows whose source showed no VAT receive one, and `RESTANT` is not recomputed. In the loaded 2023 local data, three invoices no longer satisfy `TTC = RECOUVREMENT + RESTANT`; for two of them the identity holds exactly on the pre-tax amount, which indicates invoices originally issued without VAT.

**4. Recommended alternative.** Recompute only where VAT is missing, or keep source values and flag deviations from 19 %.

**5. Impact.** Three of 29 rows; amounts not published.

**Status.** Calculation unchanged; review note added. Control C3 lists the rows.

---

## F6 — VAT rate correction on detailed expenses (`looktest.ipynb`)

**1. Original formula**

```python
tx_tva = TVA / HT * 100
corriger_tva(t): 19 if t is NaN or t == 0; 7 if 6 ≤ t ≤ 8; 13 if 12 ≤ t ≤ 14; 19 if 18 ≤ t ≤ 20; else 19
TVA = HT × tx_tva / 100 ;  TTC = SODEXO + HT + TVA + TF ;  NET RS = TTC − RS
```

**2. Interpretation.** Observed rates are snapped to a legal rate and VAT is recomputed.

**3. Problem.** Of 584 rows, 277 have an observed rate of exactly 0 and 134 have no VAT at all. All of them receive 19 %. Only 84 rows carried an exact legal rate. Many expense types are legitimately VAT-free (salaries, bank charges, stamps, foreign suppliers), so the rule can add VAT — and therefore cost — to roughly two thirds of the lines. Rates outside the tolerance bands (for example 3 %, 29 %, 76 %) are also set to 19 % although they more likely signal an input error to investigate.

**4. Recommended alternative.** Treat 0 as a valid rate; recompute VAT only where it is missing *and* the expense type is taxable; list out-of-band rates for manual review.

**5. Impact.** Not quantified: the output of this notebook is not among the tables supplied, so the before/after totals cannot be compared.

Also in this notebook, `HT` is mean-imputed on two rows. A mean is sensitive to the large invoices present in expense data; the median, or the value implied by `TTC`, is safer.

**Status.** Calculation unchanged; review note added.

---

## F7 — Rows addressed by position

`res.loc[11]` and `res.loc[28]` rely on the default integer index, i.e. on the physical row order of the sheet. Adding, deleting or sorting a row would apply the imputation to the wrong invoice without any error. The pairing between each position and a hard-coded client name was also manual. A further slip: after imputing row 28 the notebook printed row 11 again, so the second result was never displayed — which is probably why the error went unnoticed.

**Correction.** Rows are now selected by condition (`Recouvrement €` missing) and matched to their own client; the audit table printed by the notebook shows each imputed row.

## F8 — Division by zero and missing values

`Recouvrement € / CA €` and `TVA / HT` are unprotected. A zero denominator gives `inf`, which then makes a mean infinite. No zero revenue exists in the current export data, so no value was affected. `collection_ratio()` now returns `NaN` for a zero or missing denominator. In `looktest.ipynb`, `inf` and `NaN` rates fall into the default branch of `corriger_tva` (see F6).

## F9 — Date repair

`fix_date` (`2023.ipynb`) clamps impossible dates to the nearest valid one (month 13 → 12, day 32 → last day, 29 February of a non-leap year → 28). Three export dates are concerned; a fourth only had a stray space. The result is a plausible date, not a verified one; it can move an invoice across a month boundary. Affected rows should be confirmed against the invoices. The bare `except:` in this function was narrowed to `except ValueError:`.

## F10 — Mean of ratios

The client rate is the unweighted mean of per-invoice ratios. A small, partly paid invoice weighs as much as a large one. The amount-weighted ratio, `Σ collected / Σ revenue`, is the usual definition of a collection rate. Left as designed; noted for the KPI definitions.

## F11 — Country labels

`France` and `france` coexist in the export data (control C6). Grouping by country splits one country into two, which affects revenue by country, country share and FX loss by country. Normalising case and spacing during cleaning resolves it.

---

## What was verified, and how

| Check | Result |
|---|---|
| Static validation of the four notebooks (`analytics/tools/validate_notebooks.py`) | Pass |
| Unit tests of the helper functions (`analytics/tests/`, 9 tests on synthetic fixtures) | Pass |
| End-to-end execution of the four refactored notebooks | Pass on **throwaway synthetic workbooks** built only to exercise the code paths; they were not kept and produce no business result |
| Execution on the real workbooks | **Not done** — the workbooks were not available; the corrected values quoted above are derived arithmetically from the saved outputs and the loaded tables |
| Data-quality controls on the current warehouse export | C1: 2 rows, C2: 2 rows, C3: 3 rows, C4: 2 rows, C5: 0 rows, C6: 1 label |
