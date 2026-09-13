#!/usr/bin/env python3
"""
Audio Narration Generator for Learning Modules (Pilot: Excel-Trainer)

Uses ElevenLabs API with the Alice voice (eleven_multilingual_v2) to generate
MP3 narrations for each exercise in multiple languages.

Usage:
    python generate-audio.py                  # Generate all missing narrations
    python generate-audio.py --lang de        # Only German
    python generate-audio.py --lang uk        # Only Ukrainian
    python generate-audio.py --track kaufleute  # Only one track
    python generate-audio.py --force          # Regenerate existing files too
    python generate-audio.py --dry-run        # Preview texts without API calls

narrations.json: {lang: {"level1": {...}, "kaufleute-level1": {...}}}
Level keys without a track prefix belong to the AVM track. AVM keeps its
historical filenames (level1-ex1.mp3); other tracks get a prefix
(kaufleute-level1-ex1.mp3) — the same scheme ExerciseView and StoryIntro use.
"""

import json
import os
import re
import sys
import io
import argparse
import time
from pathlib import Path

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# --- Configuration ---
VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2"  # Alice — Clear, Engaging Educator
MODEL_ID = "eleven_multilingual_v2"
API_URL = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

VOICE_SETTINGS = {
    "stability": 0.5,
    "similarity_boost": 0.75
}

SCRIPT_DIR = Path(__file__).parent
NARRATIONS_FILE = SCRIPT_DIR / "narrations.json"
OUTPUT_DIR = SCRIPT_DIR.parent / "public" / "audio"

LEVEL_KEY = re.compile(r"^(?:(?P<track>[a-z]+)-)?level(?P<num>\d+)$")


def load_api_key():
    """Load API key from .env file in project root or parent directories."""
    # Check environment variable first
    key = os.environ.get("ELEVENLABS_API_KEY")
    if key:
        return key

    # Walk up from script dir to find .env
    search_dir = SCRIPT_DIR.parent
    for _ in range(5):
        env_file = search_dir / ".env"
        if env_file.exists():
            with open(env_file, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("ELEVENLABS_API_KEY="):
                        return line.split("=", 1)[1].strip().strip('"').strip("'")
        search_dir = search_dir.parent

    return None


def audio_filename(track, level_num, text_key):
    """File name the player expects, e.g. level1-ex1.mp3 or kaufleute-level1-ex1.mp3."""
    prefix = "" if track == "avm" else f"{track}-"
    # text_key is "intro" or an exercise id like "L1-EX1" / "K-L1-EX1"
    suffix = "intro" if text_key == "intro" else text_key.split("-")[-1].lower()
    return f"{prefix}level{level_num}-{suffix}.mp3"


def generate_audio(text, output_path, api_key):
    """Call ElevenLabs API to generate MP3 from text."""
    import urllib.request
    import urllib.error

    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }

    payload = json.dumps({
        "text": text,
        "model_id": MODEL_ID,
        "voice_settings": VOICE_SETTINGS
    }).encode("utf-8")

    req = urllib.request.Request(API_URL, data=payload, headers=headers, method="POST")

    try:
        with urllib.request.urlopen(req) as response:
            audio_data = response.read()
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, "wb") as f:
                f.write(audio_data)
            size_kb = len(audio_data) / 1024
            return True, f"{size_kb:.1f} KB"
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        return False, f"HTTP {e.code}: {error_body}"
    except Exception as e:
        return False, str(e)


def main():
    parser = argparse.ArgumentParser(description="Generate audio narrations for learning modules")
    parser.add_argument("--lang", choices=["de", "uk"], help="Generate only for this language")
    parser.add_argument("--track", help="Generate only for this track (e.g. avm, kaufleute)")
    parser.add_argument("--dry-run", action="store_true", help="Preview texts without API calls")
    parser.add_argument("--level", type=int, help="Generate only for this level (e.g. 1)")
    parser.add_argument("--force", action="store_true", help="Regenerate files that already exist")
    args = parser.parse_args()

    # Load narrations
    with open(NARRATIONS_FILE, "r", encoding="utf-8") as f:
        narrations = json.load(f)

    api_key = None
    if not args.dry_run:
        api_key = load_api_key()
        if not api_key:
            print("ERROR: ELEVENLABS_API_KEY not found in .env or environment.")
            print("Set it via: export ELEVENLABS_API_KEY=sk_...")
            sys.exit(1)

    languages = [args.lang] if args.lang else list(narrations.keys())
    total = 0
    success = 0
    skipped = 0
    errors = []

    for lang in languages:
        lang_data = narrations.get(lang, {})
        for level_key, level_texts in lang_data.items():
            match = LEVEL_KEY.match(level_key)
            if not match:
                errors.append(f"{lang}/{level_key}: unknown level key")
                continue
            track = match.group("track") or "avm"
            level_num = int(match.group("num"))
            if args.track and track != args.track:
                continue
            if args.level and level_num != args.level:
                continue

            for text_key, text in level_texts.items():
                filename = audio_filename(track, level_num, text_key)
                output_path = OUTPUT_DIR / lang / filename

                if output_path.exists() and not args.force:
                    skipped += 1
                    continue

                total += 1

                if args.dry_run:
                    print(f"  [{lang}] {filename}")
                    print(f"    \"{text}\"")
                    print()
                    success += 1
                    continue

                print(f"  [{lang}] Generating {filename}...", end=" ", flush=True)
                ok, info = generate_audio(text, output_path, api_key)
                if ok:
                    print(f"OK ({info})")
                    success += 1
                else:
                    print(f"FAILED: {info}")
                    errors.append(f"{lang}/{filename}: {info}")

                # Rate limit: ElevenLabs allows ~2-3 req/s on free tier
                time.sleep(0.5)

    print(f"\n{'=' * 50}")
    print(f"Results: {success}/{total} generated successfully ({skipped} existing skipped)")
    if errors:
        print(f"\nErrors ({len(errors)}):")
        for err in errors:
            print(f"  - {err}")

    return 0 if not errors else 1


if __name__ == "__main__":
    sys.exit(main())
