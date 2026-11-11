"""Unit tests for aquavolta_helpers.

All values below are small SYNTHETIC fixtures written for the tests.
They are not company data and are not business results.
"""

import sys
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "notebooks"))

from aquavolta_helpers import (  # noqa: E402
    check_collection_identity,
    collection_ratio,
    impute_collection_from_client_ratio,
    load_sheet,
)


def make_frame():
    return pd.DataFrame(
        {
            "client": ["A", "A", "A", "B", "B", "C"],
            "ca": [1000.0, 2000.0, 500.0, 400.0, 800.0, 300.0],
            "rec": [1000.0, 1000.0, np.nan, 400.0, np.nan, np.nan],
            "rest": [0.0, 1000.0, 500.0, 0.0, 800.0, 300.0],
        }
    )


def test_ratio_is_a_fraction():
    ratio = collection_ratio(pd.Series([50.0, 100.0]), pd.Series([100.0, 100.0]))
    assert ratio.tolist() == [0.5, 1.0]


def test_ratio_is_safe_on_zero_and_missing_revenue():
    ratio = collection_ratio(pd.Series([10.0, 10.0, np.nan]), pd.Series([0.0, np.nan, 100.0]))
    assert ratio.isna().all()
    assert not np.isinf(ratio.fillna(0)).any()


def test_imputation_uses_client_mean_ratio_as_fraction():
    out, audit = impute_collection_from_client_ratio(make_frame(), "client", "ca", "rec")
    # Client A: per-invoice ratios 1.0 and 0.5 -> mean 0.75 -> 500 * 0.75
    assert out.loc[2, "rec"] == pytest.approx(375.0)
    # Client B: single observed ratio 1.0 -> 800 * 1.0
    assert out.loc[4, "rec"] == pytest.approx(800.0)
    assert audit.loc[audit["index"] == 2, "client_mean_ratio"].iloc[0] == pytest.approx(0.75)


def test_imputed_collection_never_exceeds_revenue_when_ratios_are_at_most_one():
    out, _ = impute_collection_from_client_ratio(make_frame(), "client", "ca", "rec")
    filled = out.dropna(subset=["rec"])
    assert (filled["rec"] <= filled["ca"] + 1e-9).all()


def test_percentage_bug_is_not_reproduced():
    """The original code multiplied revenue by a percentage (75), not a ratio (0.75)."""
    out, _ = impute_collection_from_client_ratio(make_frame(), "client", "ca", "rec")
    assert out.loc[2, "rec"] != pytest.approx(500.0 * 75.0)


def test_client_without_history_is_reported_not_filled():
    out, audit = impute_collection_from_client_ratio(make_frame(), "client", "ca", "rec")
    assert pd.isna(out.loc[5, "rec"])
    assert audit.loc[audit["index"] == 5, "status"].iloc[0].startswith("not imputed")


def test_imputation_is_independent_of_row_order_and_does_not_mutate_input():
    frame = make_frame()
    shuffled = frame.sample(frac=1, random_state=1)
    out, _ = impute_collection_from_client_ratio(shuffled, "client", "ca", "rec")
    assert out.loc[2, "rec"] == pytest.approx(375.0)
    assert frame["rec"].isna().sum() == 3


def test_identity_check_flags_imputed_rows_that_contradict_outstanding():
    out, _ = impute_collection_from_client_ratio(make_frame(), "client", "ca", "rec")
    gaps = check_collection_identity(out.dropna(subset=["rec"]), "ca", "rec", "rest")
    assert sorted(gaps.index.tolist()) == [2, 4]
    assert check_collection_identity(make_frame().iloc[[0, 1, 3]], "ca", "rec", "rest").empty


def test_load_sheet_reports_missing_workbook(tmp_path):
    with pytest.raises(FileNotFoundError, match="AQUAVOLTA_DATA_DIR"):
        load_sheet("absent.xlsx", sheet_name="X", data_dir=tmp_path)
