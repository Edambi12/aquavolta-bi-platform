"""Shared helpers for the AQUAVOLTA cleaning notebooks.

Centralises three things that were previously repeated or hard-coded in the
notebooks:

* path management (confidential workbooks live outside the repository);
* workbook loading / saving with explicit error messages;
* the client-ratio imputation of missing collections, with safe division and
  an audit trail.

The module has no side effect at import time and only depends on pandas/numpy.
"""

from __future__ import annotations

import os
from pathlib import Path

import numpy as np
import pandas as pd

# --------------------------------------------------------------------------
# Paths
# --------------------------------------------------------------------------
# Repository root = two levels above this file (analytics/notebooks/..).
REPO_ROOT = Path(__file__).resolve().parents[2]

#: Folder holding the confidential source workbooks (never committed).
DATA_DIR = Path(os.environ.get("AQUAVOLTA_DATA_DIR", REPO_ROOT / "data" / "raw")).expanduser()

#: Folder receiving the cleaned workbooks produced by the notebooks.
OUTPUT_DIR = Path(os.environ.get("AQUAVOLTA_OUTPUT_DIR", REPO_ROOT / "data" / "processed")).expanduser()


def load_sheet(workbook: str, sheet_name: str, header: int = 0, data_dir: Path | None = None) -> pd.DataFrame:
    """Read one sheet of a source workbook located in ``DATA_DIR``.

    Raises
    ------
    FileNotFoundError
        If the workbook is absent, with instructions on where to put it.
    ValueError
        If the sheet does not exist in the workbook.
    """
    path = Path(data_dir or DATA_DIR) / workbook
    if not path.is_file():
        raise FileNotFoundError(
            f"Source workbook not found: {path}\n"
            "The source workbooks are confidential and are not part of the repository. "
            "Copy them into data/raw/ at the repository root, or set the "
            "AQUAVOLTA_DATA_DIR environment variable to the folder that contains them."
        )
    try:
        return pd.read_excel(path, sheet_name=sheet_name, header=header)
    except ValueError as exc:  # pandas raises ValueError for an unknown sheet
        raise ValueError(f"Cannot read sheet '{sheet_name}' from {path.name}: {exc}") from exc


def save_output(df: pd.DataFrame, filename: str, output_dir: Path | None = None) -> Path:
    """Write a cleaned DataFrame to ``OUTPUT_DIR`` and return the file path."""
    target_dir = Path(output_dir or OUTPUT_DIR)
    target_dir.mkdir(parents=True, exist_ok=True)
    path = target_dir / filename
    df.to_excel(path, index=False)
    return path


# --------------------------------------------------------------------------
# Financial helpers
# --------------------------------------------------------------------------
def collection_ratio(collected: pd.Series, revenue: pd.Series) -> pd.Series:
    """Collection ratio as a FRACTION (1.0 = fully collected).

    Division is safe: a zero or missing revenue yields ``NaN`` instead of
    ``inf`` so that it cannot contaminate a mean. Multiply by 100 for display.
    """
    collected = pd.to_numeric(collected, errors="coerce")
    revenue = pd.to_numeric(revenue, errors="coerce")
    return collected / revenue.where(revenue != 0)


def impute_collection_from_client_ratio(
    df: pd.DataFrame,
    client_col: str,
    revenue_col: str,
    collected_col: str,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Fill missing collections with ``revenue x client mean collection ratio``.

    Methodology (unchanged from the original notebook): for an invoice whose
    collected amount is missing, estimate it from the average collection ratio
    observed on the *other invoices of the same client*.

    Differences from the original implementation:

    * the ratio is used as a fraction (0-1). The original multiplied revenue
      by a percentage (0-100), inflating the imputed amounts a hundredfold;
    * rows are selected by condition (missing value + client), not by fixed
      row position, so the logic survives a change in row order;
    * division by zero and clients without any observed ratio are handled:
      such rows are left missing and reported, never filled silently.

    Returns
    -------
    (DataFrame, DataFrame)
        A copy of ``df`` with imputed values, and an audit table with one row
        per missing value (index label, client, revenue, ratio used, imputed
        amount, status).
    """
    out = df.copy()
    ratio = collection_ratio(out[collected_col], out[revenue_col])
    client_mean_ratio = ratio.groupby(out[client_col]).mean()  # NaN-skipping mean

    audit_rows = []
    for idx in out.index[out[collected_col].isna()]:
        client = out.at[idx, client_col]
        revenue = pd.to_numeric(out.at[idx, revenue_col], errors="coerce")
        client_ratio = client_mean_ratio.get(client, np.nan)
        if pd.isna(client) or pd.isna(revenue) or pd.isna(client_ratio):
            imputed, status = np.nan, "not imputed (no usable client ratio or revenue)"
        else:
            imputed, status = revenue * client_ratio, "imputed"
            out.at[idx, collected_col] = imputed
        audit_rows.append(
            {
                "index": idx,
                "client": client,
                "revenue": revenue,
                "client_mean_ratio": client_ratio,
                "imputed_collection": imputed,
                "status": status,
            }
        )
    audit = pd.DataFrame(
        audit_rows,
        columns=["index", "client", "revenue", "client_mean_ratio", "imputed_collection", "status"],
    )
    return out, audit


def check_collection_identity(
    df: pd.DataFrame,
    revenue_col: str,
    collected_col: str,
    outstanding_col: str,
    tolerance: float = 0.01,
) -> pd.DataFrame:
    """Return the rows where ``revenue != collected + outstanding``.

    An empty result means the three columns are consistent. A non-empty result
    after imputation means the imputed collection contradicts the outstanding
    balance recorded in the source and needs a business decision.
    """
    revenue = pd.to_numeric(df[revenue_col], errors="coerce")
    collected = pd.to_numeric(df[collected_col], errors="coerce")
    outstanding = pd.to_numeric(df[outstanding_col], errors="coerce")
    gap = revenue - collected - outstanding
    result = df.loc[gap.abs() > tolerance, [revenue_col, collected_col, outstanding_col]].copy()
    result["gap"] = gap[gap.abs() > tolerance]
    return result
