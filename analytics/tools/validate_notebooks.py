#!/usr/bin/env python3
"""Static validation of the published notebooks. Needs no data and no third-party package.

Checks, for every notebook in analytics/notebooks/:
  * valid JSON, nbformat 4;
  * every code cell compiles as Python;
  * no saved output or execution count (outputs would expose confidential data);
  * no shell / magic command (dependencies are installed from requirements.txt);
  * no absolute Windows or user-home path;
  * no direct pd.read_excel / to_excel call bypassing the path helpers.

The prediction notebook (prediction/) is published with its metric outputs and
charts, so it is checked for JSON validity, syntax, shell commands and paths
only, plus the absence of local paths in its text outputs.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

NOTEBOOK_DIR = Path(__file__).resolve().parents[1] / "notebooks"
PREDICTION_DIR = Path(__file__).resolve().parents[2] / "prediction"
FORBIDDEN = {
    # Drive letter + backslash + folder + backslash (e.g. C:\\folder\\file); avoids matching "text:\\n".
    "absolute Windows path": re.compile(r"(?<![A-Za-z])[A-Za-z]:\\+[A-Za-z][\w ]*\\"),
    "user home path": re.compile(r"/(Users|home)/\w+"),
    "direct read_excel call": re.compile(r"\bread_excel\("),
    "direct to_excel call": re.compile(r"\.to_excel\("),
}


def validate(path: Path, allow_outputs: bool = False) -> list[str]:
    errors: list[str] = []
    try:
        nb = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        return [f"invalid JSON: {exc}"]
    if nb.get("nbformat") != 4:
        errors.append(f"unexpected nbformat {nb.get('nbformat')}")
    for number, cell in enumerate(nb.get("cells", [])):
        if cell.get("cell_type") != "code":
            continue
        source = "".join(cell.get("source", []))
        if allow_outputs:
            for output in cell.get("outputs", []):
                text = "".join(output.get("text", []))
                if FORBIDDEN["absolute Windows path"].search(text) or FORBIDDEN["user home path"].search(text):
                    errors.append(f"cell {number}: local path in a saved output")
        else:
            if cell.get("outputs"):
                errors.append(f"cell {number}: saved output present")
            if cell.get("execution_count") is not None:
                errors.append(f"cell {number}: execution count present")
        if any(line.lstrip().startswith(("!", "%")) for line in source.splitlines()):
            errors.append(f"cell {number}: shell or magic command")
        for label, pattern in FORBIDDEN.items():
            if pattern.search(source):
                errors.append(f"cell {number}: {label}")
        try:
            compile(source, f"{path.name}[{number}]", "exec")
        except SyntaxError as exc:
            errors.append(f"cell {number}: syntax error: {exc.msg} (line {exc.lineno})")
    return errors


def main() -> int:
    notebooks = [(path, False) for path in sorted(NOTEBOOK_DIR.glob("*.ipynb"))]
    notebooks += [(path, True) for path in sorted(PREDICTION_DIR.glob("*.ipynb"))]
    if not notebooks:
        print(f"No notebook found in {NOTEBOOK_DIR}")
        return 1
    failed = False
    for path, allow_outputs in notebooks:
        errors = validate(path, allow_outputs=allow_outputs)
        print(f"{'FAIL' if errors else 'OK  '} {path.parent.name}/{path.name}")
        for error in errors:
            print(f"       - {error}")
        failed = failed or bool(errors)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
