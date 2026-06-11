#!/usr/bin/env python3
"""Organize /public/images into logo, hero, reiser, om-oss, general."""

from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "public" / "images"
SUBDIRS = ("logo", "hero", "reiser", "om-oss", "general")

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".heic",
    ".HEIC",
    ".JPG",
    ".JPEG",
    ".PNG",
    ".WEBP",
}

OM_OSS_NAMES = {
    "anne.jpg",
    "ina.jpg",
    "ina.webp",
    "emma.jpeg",
    "emma1.jpg",
    "morten rotete.jpg",
    "smaken teams bakgrunn 1.png",
}

LOGO_PATTERNS = (
    re.compile(r"logo", re.I),
    re.compile(r"^smaken logo", re.I),
)

REISER_PATTERNS = (
    re.compile(
        r"canal|carcassonne|castle|minervois|liviniere|fontfroide|peyre|"
        r"pontdugard|pont.?du.?gard|cite|halles|\bmat\b|ost og|oulibo|ouliibou|"
        r"oliven|basseng|riviere|ramparts|saint-nazaire|museum|covered-walkways|"
        r"caunes|detalj|peyrepertuse",
        re.I,
    ),
)

GENERAL_PATTERNS = (
    re.compile(r"skjermbilde", re.I),
    re.compile(r"\.textclipping$", re.I),
)

HASH_NAME = re.compile(r"^[a-f0-9]{32}\.(jpe?g|png|webp)$", re.I)


def is_image(path: Path) -> bool:
    return path.suffix in IMAGE_EXTENSIONS


def categorize(name: str, parent_hint: str | None = None) -> str:
    lower = name.lower()

    if lower == "hero.jpg" or lower.startswith("hero."):
        return "hero"

    if lower in {n.lower() for n in OM_OSS_NAMES}:
        return "om-oss"

    if any(p.search(name) for p in LOGO_PATTERNS):
        return "logo"

    if parent_hint in {"Oliven", "detaljbilder", "detaljer"}:
        return "reiser"

    if any(p.search(name) for p in REISER_PATTERNS):
        return "reiser"

    if HASH_NAME.match(name):
        return "reiser"

    if name.startswith("IMG_") or name.startswith("img_"):
        return "reiser"

    if any(p.search(name) for p in GENERAL_PATTERNS):
        return "general"

    if path_is_non_image_media(name):
        return "general"

    return "general"


def path_is_non_image_media(name: str) -> bool:
    lower = name.lower()
    return lower.endswith((".mov", ".pdf", ".textclipping"))


def unique_target(folder: Path, filename: str) -> Path:
    target = folder / filename
    if not target.exists():
        return target

    stem = Path(filename).stem
    suffix = Path(filename).suffix
    counter = 2
    while True:
        candidate = folder / f"{stem}-{counter}{suffix}"
        if not candidate.exists():
            return candidate
        counter += 1


def main() -> None:
    for sub in SUBDIRS:
        (ROOT / sub).mkdir(parents=True, exist_ok=True)

    moves: dict[str, list[str]] = {s: [] for s in SUBDIRS}
    skipped: list[str] = []

    for path in sorted(ROOT.rglob("*")):
        if not path.is_file():
            continue

        rel = path.relative_to(ROOT)
        if rel.parts[0] in SUBDIRS:
            continue

        if path.name == ".DS_Store":
            continue

        parent_hint = rel.parts[0] if len(rel.parts) > 1 else None
        category = categorize(path.name, parent_hint)

        if not is_image(path) and not path_is_non_image_media(path.name):
            skipped.append(str(rel))
            continue

        filename = path.name
        if parent_hint and parent_hint not in SUBDIRS:
            prefix = parent_hint.lower().replace(" ", "-")
            filename = f"{prefix}-{path.name}"

        dest_dir = ROOT / category
        dest = unique_target(dest_dir, filename)
        shutil.move(str(path), str(dest))
        moves[category].append(f"{rel} -> {dest.relative_to(ROOT)}")

    # Remove empty legacy folders
    for legacy in ("Oliven", "detaljbilder", "detaljer"):
        legacy_path = ROOT / legacy
        if legacy_path.exists() and not any(legacy_path.iterdir()):
            legacy_path.rmdir()

    print("=== IMAGE ORGANIZATION REPORT ===\n")
    total = 0
    for sub in SUBDIRS:
        count = len(moves[sub])
        total += count
        print(f"{sub}/: {count} files")
        for item in moves[sub][:8]:
            print(f"  - {item}")
        if count > 8:
            print(f"  ... and {count - 8} more")
        print()

    print(f"Total moved: {total}")
    if skipped:
        print(f"\nSkipped ({len(skipped)}):")
        for item in skipped:
            print(f"  - {item}")


if __name__ == "__main__":
    main()
