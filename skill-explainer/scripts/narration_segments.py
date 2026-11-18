#!/usr/bin/env python3
"""Mide en qué segundo empieza cada frase de public/cubanbot/narracion.mp3 (detección de silencios).

Uso: python3 scripts/narration_segments.py [n_frases=9]
Imprime la duración y el arreglo SEG para pegar en src/cubanbot/brand.ts.
"""
import subprocess, sys, tempfile, os, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
N = int(sys.argv[1]) if len(sys.argv) > 1 else 9
src = os.path.join(ROOT, "public", "cubanbot", "narracion.mp3")
with tempfile.TemporaryDirectory() as tmp:
    wav = os.path.join(tmp, "n.wav")
    subprocess.run(["npx", "remotion", "ffmpeg", "-y", "-loglevel", "error", "-i", src, "-ac", "1", "-ar", "16000", wav], check=True, cwd=ROOT)
    w = wave.open(wav)
    x = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(float) / 32768
sr = 16000
hop = 160  # 10 ms
rms = np.sqrt(np.convolve(x ** 2, np.ones(hop) / hop, "same"))[::hop]
silent = rms < max(0.01, np.percentile(rms, 30) * 1.5)
# tramos de silencio de al menos 350 ms
gaps = []
i = 0
while i < len(silent):
    if silent[i]:
        j = i
        while j < len(silent) and silent[j]:
            j += 1
        if (j - i) >= 35 and i > 0 and j < len(silent):
            gaps.append((j - i, i, j))
        i = j
    else:
        i += 1
gaps = sorted(sorted(gaps, reverse=True)[: N - 1], key=lambda g: g[1])
starts = [0.0] + [round(g[2] / 100 - 0.05, 2) for g in gaps]
print("duración", round(len(x) / sr, 2))
print("SEG =", starts)
