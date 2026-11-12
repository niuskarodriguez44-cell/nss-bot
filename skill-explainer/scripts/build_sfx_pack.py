#!/usr/bin/env python3
"""Copia al proyecto los efectos de sonido CC0 del pack `uisfx` (instalado con la skill real-sfx).

Los archivos son datos (mp3, licencia CC0-1.0); aquí solo se copian y renombran.
Uso: python3 scripts/build_sfx_pack.py [pack]   (por defecto: soft)
"""
import os, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "..", ".claude", "skills", "real-sfx", "vendor", "node_modules", "uisfx", "sounds")
PACK = sys.argv[1] if len(sys.argv) > 1 else "soft"
DEST = os.path.join(ROOT, "public", "sfx")

# nombre en el proyecto -> cue de uisfx
CUES = {
    # compatibles con el video 1 (SkillExplainer)
    "tick": "typing", "tock": "progress-step", "pop": "select", "whoosh": "swipe",
    "chime": "checkpoint", "success": "complete", "sparkle": "reward",
    # vocabulario extra para el video 2 (AgentPlanner)
    "press": "press", "hover": "hover", "toggle-on": "toggle-on", "toggle-off": "toggle-off",
    "expand": "expand", "collapse": "collapse", "open": "open", "close": "close",
    "send": "send", "receive": "receive", "notification": "notification",
    "scanning": "scanning", "connecting": "connecting", "processing": "processing",
    "snap": "snap", "drag-start": "drag-start", "drop": "drop", "check": "check",
    "checkpoint": "checkpoint", "retry": "retry", "undo": "undo", "warning": "warning",
    "level-up": "level-up", "focus": "focus", "select": "select", "complete": "complete",
    "swipe": "swipe", "typing": "typing", "progress-step": "progress-step",
}

os.makedirs(DEST, exist_ok=True)
for name, cue in CUES.items():
    src = os.path.join(SRC, PACK, f"{cue}.mp3")
    if not os.path.exists(src):
        print("falta", src); continue
    shutil.copyfile(src, os.path.join(DEST, f"{name}.mp3"))
print(f"{len(CUES)} efectos copiados desde el pack '{PACK}' (CC0)")
