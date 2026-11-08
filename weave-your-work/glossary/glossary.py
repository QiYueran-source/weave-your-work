#!/usr/bin/env python3
"""Read and write the project glossary sources and the generated view.

Sources are `glossary/<operator>.jsonl`, one term per line. The view is
`GLOSSARY.md` at the project root, generated from every source. Standard
library only.
"""

import argparse
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

FIELDS = ("term", "definition", "avoid", "group", "created_at", "updated_at")


def now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def project_root(value: str | None) -> Path:
    if value:
        return Path(value).resolve()
    start = Path.cwd().resolve()
    for path in (start, *start.parents):
        if (path / ".waymark" / "config.toml").exists():
            return path
    return start


def operator(root: Path) -> str:
    user = root / ".waymark" / "user.toml"
    if user.exists():
        for line in user.read_text(encoding="utf-8").splitlines():
            match = re.match(r'\s*operator\s*=\s*"([^"]+)"', line)
            if match:
                return match.group(1)
    try:
        name = subprocess.check_output(
            ["git", "config", "user.name"], cwd=root, text=True
        ).strip()
        if name:
            return name
    except Exception:
        pass
    return os.environ.get("USER", "operator")


def source_files(root: Path) -> list[Path]:
    directory = root / "glossary"
    return sorted(directory.glob("*.jsonl")) if directory.exists() else []


def read_source(path: Path) -> list[dict]:
    terms = []
    for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            term = json.loads(line)
        except json.JSONDecodeError as error:
            raise SystemExit(f"{path}:{number}: {error}") from error
        missing = [field for field in FIELDS if field not in term]
        if missing:
            raise SystemExit(f"{path}:{number}: missing {', '.join(missing)}")
        terms.append(term)
    return terms


def merged(root: Path) -> list[dict]:
    terms: dict[str, dict] = {}
    order: list[str] = []
    for path in source_files(root):
        for term in read_source(path):
            key = term["term"]
            term = dict(term)
            term["_source"] = path.name
            if key not in terms:
                order.append(key)
                terms[key] = term
            elif term["updated_at"] >= terms[key]["updated_at"]:
                terms[key] = term
    return [terms[key] for key in order]


def find(root: Path, query: str) -> dict | None:
    terms = merged(root)
    for term in terms:
        if term["term"] == query:
            return term
    for term in terms:
        if term["term"].split(" (")[0] == query:
            return term
    return None


def write_term(
    root: Path,
    term: str,
    definition: str,
    avoid: list[str] | None = None,
    group: str = "",
) -> dict:
    if not term.strip():
        raise SystemExit("term is empty")
    if not definition.strip():
        raise SystemExit("definition is empty")
    directory = root / "glossary"
    directory.mkdir(exist_ok=True)
    path = directory / f"{operator(root)}.jsonl"
    stamp = now()
    record = {
        "term": term.strip(),
        "definition": definition.strip(),
        "avoid": avoid or [],
        "group": group.strip(),
        "created_at": stamp,
        "updated_at": stamp,
    }
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(record, ensure_ascii=False) + "\n")
    return record


def merge(root: Path) -> Path:
    terms = merged(root)
    header_path = root / "glossary" / "_header.md"
    if header_path.exists():
        header = header_path.read_text(encoding="utf-8").rstrip()
    else:
        header = "# Glossary\n\nThis file is generated from `glossary/*.jsonl`. Do not edit it by hand."

    groups: dict[str, list[dict]] = {}
    for term in terms:
        groups.setdefault(term.get("group") or "Language", []).append(term)

    lines = [header, ""]
    for group, items in groups.items():
        lines += [f"## {group}", ""]
        for term in items:
            lines += [f"**{term['term']}**:", term["definition"]]
            if term.get("avoid"):
                lines += ["_Avoid_: " + ", ".join(term["avoid"])]
            lines += [f"_Source_: {term['_source']}", ""]

    view = root / "GLOSSARY.md"
    view.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    return view


def import_glossary(root: Path, source: Path) -> tuple[int, Path]:
    lines = source.read_text(encoding="utf-8").splitlines()
    try:
        language = lines.index("## Language")
    except ValueError:
        language = 0

    header = "\n".join(lines[:language]).strip()
    directory = root / "glossary"
    directory.mkdir(exist_ok=True)
    (directory / "_header.md").write_text(header + "\n", encoding="utf-8")

    terms: list[dict] = []
    index = language + 1
    stamp = now()
    while index < len(lines):
        match = re.match(r"^\*\*(.+)\*\*:\s*$", lines[index])
        if not match:
            index += 1
            continue
        term = match.group(1).strip()
        index += 1
        definition_lines: list[str] = []
        avoid: list[str] = []
        while index < len(lines) and not re.match(r"^\*\*.+\*\*:\s*$", lines[index]):
            line = lines[index]
            if line.startswith("_Avoid_:"):
                avoid = [line[len("_Avoid_:") :].strip()]
            elif line.strip():
                definition_lines.append(line.strip())
            index += 1
        terms.append(
            {
                "term": term,
                "definition": " ".join(definition_lines).strip(),
                "avoid": avoid,
                "group": "Language",
                "created_at": stamp,
                "updated_at": stamp,
            }
        )

    path = directory / f"{operator(root)}.jsonl"
    with path.open("w", encoding="utf-8") as handle:
        for term in terms:
            handle.write(json.dumps(term, ensure_ascii=False) + "\n")
    return len(terms), path


def main() -> int:
    parser = argparse.ArgumentParser(description="Read and write the project glossary.")
    parser.add_argument("--project", help="project root; defaults to the nearest .waymark")
    sub = parser.add_subparsers(dest="command", required=True)

    lookup = sub.add_parser("lookup", help="print one merged term as JSON")
    lookup.add_argument("term")

    sub.add_parser("list", help="print every merged term as JSON lines")

    write = sub.add_parser("write", help="append a term to the current operator's source")
    write.add_argument("--term", required=True)
    write.add_argument("--definition", required=True)
    write.add_argument("--avoid", action="append", default=[])
    write.add_argument("--group", default="")

    merge_parser = sub.add_parser("merge", help="regenerate GLOSSARY.md from the sources")

    importer = sub.add_parser("import-glossary", help="write a JSONL source from a GLOSSARY.md")
    importer.add_argument("path")

    args = parser.parse_args()
    root = project_root(args.project)

    if args.command == "lookup":
        term = find(root, args.term)
        if term is None:
            print(f"not found: {args.term}", file=sys.stderr)
            return 1
        print(json.dumps(term, ensure_ascii=False, indent=2))
        return 0

    if args.command == "list":
        for term in merged(root):
            print(json.dumps(term, ensure_ascii=False))
        return 0

    if args.command == "write":
        record = write_term(root, args.term, args.definition, args.avoid, args.group)
        print(json.dumps(record, ensure_ascii=False))
        return 0

    if args.command == "merge":
        print(merge(root))
        return 0

    if args.command == "import-glossary":
        count, path = import_glossary(root, Path(args.path))
        print(f"imported {count} terms into {path}")
        return 0

    return 2


if __name__ == "__main__":
    raise SystemExit(main())
