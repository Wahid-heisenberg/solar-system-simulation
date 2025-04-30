import os
import requests
from pathlib import Path
import sys

# Reconfigure stdout to use UTF-8 encoding
sys.stdout.reconfigure(encoding='utf-8')

# List of texture filenames
textures = [
    "2k_mercury.jpg",
    "2k_sun.jpg",
    "2k_venus_surface.jpg",
    "2k_earth_daymap.jpg",
    "2k_earth_daymap.jpg",
    "2k_earth_nightmap.jpg",
    "2k_earth_nightmap.jpg",
    "2k_moon.jpg",
    "2k_mars.jpg",
    "2k_jupiter.jpg",
    "2k_saturn.jpg",
    "2k_saturn_ring_alpha.png",
    "2k_uranus.jpg",
    "2k_neptune.jpg",
    "2k_stars_milky_way.jpg"
]

# Base URL for downloading textures
base_url = "https://www.solarsystemscope.com/textures/download/"

# Directory to save downloaded textures
save_dir = Path("textures")
save_dir.mkdir(exist_ok=True)

for filename in textures:
    url = base_url + filename
    save_path = save_dir / filename
    print(f"Downloading {filename}...")

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        with open(save_path, "wb") as f:
            f.write(response.content)
        print(f"✓ Saved to {save_path}")
    except Exception as e:
        print(f"✗ Failed to download {filename}: {e}")
