#!/usr/bin/env python3
"""Descarga y optimiza las imágenes elegidas para SUMI."""
import json
import os
import io
import urllib.request
from PIL import Image

BASE = "/home/z/my-project"
RES = f"{BASE}/scripts/img-results"
OUT_PRODUCTS = f"{BASE}/public/images/products"
OUT_STORY = f"{BASE}/public/images/story"

# (json_key, index, output_path)
MAPPING = [
    ("philadelphia", 1, f"{OUT_PRODUCTS}/philadelphia.jpg"),
    ("california", 2, f"{OUT_PRODUCTS}/california.jpg"),
    ("acevichado", 0, f"{OUT_PRODUCTS}/acevichado.jpg"),
    ("dragon", 1, f"{OUT_PRODUCTS}/dragon.jpg"),
    ("rainbow", 1, f"{OUT_PRODUCTS}/rainbow.jpg"),
    ("nigiri", 0, f"{OUT_PRODUCTS}/nigiri.jpg"),
    ("furikake", 0, f"{OUT_PRODUCTS}/furikake.jpg"),
    ("tempura", 1, f"{OUT_PRODUCTS}/tempura.jpg"),
    ("veggie", 3, f"{OUT_PRODUCTS}/veggie.jpg"),
    ("dorayaki", 0, f"{OUT_PRODUCTS}/dorayaki.jpg"),
    ("cheesecake", 1, f"{OUT_PRODUCTS}/matcha.jpg"),
    ("chicha", 0, f"{OUT_PRODUCTS}/chicha.jpg"),
    ("maracuya", 3, f"{OUT_PRODUCTS}/maracuya.jpg"),
    ("platter", 3, f"{OUT_PRODUCTS}/platter.jpg"),
    ("chef", 2, f"{OUT_STORY}/chef.jpg"),
    ("interior", 3, f"{OUT_STORY}/interior.jpg"),
    ("chopsticks", 0, f"{OUT_STORY}/chopsticks.jpg"),
    ("lima", 0, f"{OUT_STORY}/lima.jpg"),
    ("nigiri", 0, f"{BASE}/public/images/hero-fallback.jpg"),
]

MAX_DIM = 1800  # px máximos por lado


def load_url(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    if len(data) < 8000:
        raise ValueError(f"Archivo demasiado pequeño: {len(data)} bytes")
    return data


def process(raw: bytes, out_path: str) -> None:
    img = Image.open(io.BytesIO(raw))
    img = img.convert("RGB")
    w, h = img.size
    if max(w, h) > MAX_DIM:
        scale = MAX_DIM / max(w, h)
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path, "JPEG", quality=84, optimize=True, progressive=True)
    size_kb = os.path.getsize(out_path) // 1024
    print(f"  OK {out_path}  {img.size[0]}x{img.size[1]} · {size_kb} KB")


for key, idx, out_path in MAPPING:
    with open(f"{RES}/{key}.json") as fp:
        data = json.load(fp)
    url = data["results"][idx]["original_url"]
    try:
        raw = load_url(url)
        process(raw, out_path)
    except Exception as e:
        print(f"  FALLA {key}[{idx}] → {out_path}: {e}")

print("LISTO")
