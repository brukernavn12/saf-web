#!/usr/bin/env python3
"""Convert HEIC files in public/images/reiser to WebP."""

from __future__ import annotations

import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageOps

REISER_DIR = Path(__file__).resolve().parents[1] / "public" / "images" / "reiser"
WEBP_QUALITY = 85


def convert_heic_to_webp(heic_path: Path) -> Path:
    webp_path = heic_path.with_suffix(".webp")

    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        jpeg_path = Path(tmp.name)

    try:
        result = subprocess.run(
            [
                "sips",
                "-s",
                "format",
                "jpeg",
                str(heic_path),
                "--out",
                str(jpeg_path),
            ],
            capture_output=True,
            text=True,
            check=False,
        )
        if result.returncode != 0:
            raise RuntimeError(result.stderr.strip() or result.stdout.strip())

        image = ImageOps.exif_transpose(Image.open(jpeg_path))
        image.save(webp_path, "WEBP", quality=WEBP_QUALITY)
    finally:
        jpeg_path.unlink(missing_ok=True)

    return webp_path


def main() -> int:
    heic_files = sorted(
        path
        for path in REISER_DIR.iterdir()
        if path.is_file() and path.suffix.lower() == ".heic"
    )

    if not heic_files:
        print("No HEIC files found.")
        return 0

    converted = 0
    failed: list[tuple[str, str]] = []

    for heic_path in heic_files:
        try:
            webp_path = convert_heic_to_webp(heic_path)
            heic_path.unlink()
            converted += 1
            print(f"OK  {heic_path.name} -> {webp_path.name}")
        except Exception as error:  # noqa: BLE001
            failed.append((heic_path.name, str(error)))
            print(f"ERR {heic_path.name}: {error}", file=sys.stderr)

    print(f"\nConverted: {converted}/{len(heic_files)}")
    if failed:
        print(f"Failed: {len(failed)}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
