#!/usr/bin/env python3
"""Efectos de sonido "foley" diseñados a mano (síntesis modal, sin librerías externas).

Suena más natural que un pack de UI: teclas de madera/plástico suaves, golpes de fieltro,
notas de marimba afinadas en la tonalidad de cada música, campanas de vidrio, whooshes de aire
y un poco de sala. Cada rol tiene varias variantes para que no suene a ametralladora.

Uso: python3 scripts/make_sfx_foley.py       (requiere numpy y scipy)
Salida: public/sfx/<prefijo>_<rol>_<variante>.mp3   (v1 = Do mayor, v2 = La menor)
"""
import os, subprocess, tempfile, wave
import numpy as np
from scipy import signal

SR = 44100
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "sfx")
rng = np.random.default_rng(23)


def tt(d):
    return np.arange(int(d * SR)) / SR


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def lpf(x, fc, order=2):
    sos = signal.butter(order, fc, btype="low", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def hpf(x, fc, order=2):
    sos = signal.butter(order, fc, btype="high", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def room(x, wet=0.16, secs=0.45):
    n = int(secs * SR)
    t = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-t * 9)
    ir = lpf(ir, 5000)
    ir[: int(0.004 * SR)] = 0
    y = signal.fftconvolve(x, ir)[: len(x) + n // 2]
    y = y / (np.max(np.abs(y)) + 1e-9) * np.max(np.abs(x))
    x = np.pad(x, (0, len(y) - len(x)))
    return x * (1 - wet) + y * wet * 1.6


# ------------------------------------------------------------------ fuentes
def key():
    """Tecla suave: clic de plástico + golpe sordo de madera."""
    t = tt(0.09)
    click = bp(rng.standard_normal(len(t)), 2200, 5200) * np.exp(-t * 520)
    f0 = rng.uniform(170, 230)
    thock = np.sin(2 * np.pi * f0 * t) * np.exp(-t * 85) + 0.4 * np.sin(2 * np.pi * f0 * 2.1 * t) * np.exp(-t * 140)
    return click * rng.uniform(0.35, 0.5) + thock * 0.9


def tap():
    """Toque de dedo sobre fieltro."""
    t = tt(0.12)
    body = np.sin(2 * np.pi * rng.uniform(300, 360) * t) * np.exp(-t * 55)
    air = lpf(rng.standard_normal(len(t)), 1800) * np.exp(-t * 160) * 0.5
    return body + air


def tok():
    """Golpecito de madera (bloque pequeño)."""
    t = tt(0.16)
    f = rng.uniform(780, 920)
    y = np.sin(2 * np.pi * f * t) * np.exp(-t * 48) + 0.35 * np.sin(2 * np.pi * f * 2.55 * t) * np.exp(-t * 90)
    return y + hpf(rng.standard_normal(len(t)), 1500) * np.exp(-t * 400) * 0.25


def thud():
    t = tt(0.3)
    f = 150 * np.exp(-t * 11) + 52
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 16)
    return y + lpf(rng.standard_normal(len(t)), 600) * np.exp(-t * 60) * 0.4


def marimba(f, dur=1.3, vel=1.0):
    t = tt(dur)
    y = np.zeros_like(t)
    for ratio, amp, decay in ((1, 1.0, 4.0), (3.99, 0.30, 14.0), (9.9, 0.07, 32.0)):
        y += amp * np.sin(2 * np.pi * f * ratio * t) * np.exp(-t * decay * (f / 440) ** 0.25)
    y *= np.minimum(t / 0.003, 1)
    mallet = lpf(rng.standard_normal(len(t)), 3500) * np.exp(-t * 300) * 0.08
    return (y + mallet) * vel


def glass(f, dur=2.2, vel=1.0):
    t = tt(dur)
    y = np.zeros_like(t)
    for ratio, amp, decay in ((1, 1.0, 2.0), (2.32, 0.4, 3.4), (4.25, 0.2, 5.5), (6.63, 0.08, 8.0)):
        y += amp * np.sin(2 * np.pi * f * ratio * t) * np.exp(-t * decay)
    return y * np.minimum(t / 0.006, 1) * vel


def whoosh(dur=0.5, level=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n)
    # barrido suave de filtro (paso bajo variable) en bloques
    out = np.zeros(n)
    block = 512
    zi = None
    for i in range(0, n, block):
        fc = 350 + 2300 * np.sin(np.pi * (i / n)) ** 1.5
        sos = signal.butter(2, fc, btype="low", fs=SR, output="sos")
        if zi is None:
            zi = signal.sosfilt_zi(sos) * 0
        seg, zi = signal.sosfilt(sos, x[i:i + block], zi=zi)
        out[i:i + block] = seg
    out = hpf(out, 180)
    env = np.sin(np.pi * t / dur) ** 2
    out *= env
    return out * level


def stereo(x, pan=0.0):
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    return np.stack([x * l, x * r], axis=1)


def seq(parts):
    """parts: lista de (retraso_s, señal mono)."""
    length = max(int(d * SR) + len(x) for d, x in parts)
    y = np.zeros(length)
    for d, x in parts:
        i = int(d * SR)
        y[i:i + len(x)] += x
    return y


def export(name, mono, pan=0.0, peak=0.7):
    mono = mono / (np.max(np.abs(mono)) + 1e-9) * peak
    mono = mono * np.minimum(1, np.minimum(np.arange(len(mono)) / (0.001 * SR), (len(mono) - np.arange(len(mono))) / (0.01 * SR)))
    st = stereo(mono, pan)
    pcm = (np.clip(st, -1, 1) * 32767).astype("<i2")
    os.makedirs(OUT, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "a.wav")
        with wave.open(wav, "wb") as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
        subprocess.run(["npx", "remotion", "ffmpeg", "-y", "-loglevel", "error", "-i", wav,
                        "-codec:a", "libmp3lame", "-b:a", "128k", os.path.join(OUT, name + ".mp3")],
                       check=True, cwd=ROOT)


# Tonalidades: v1 = Do mayor pentatónica, v2 = La menor pentatónica
SCALES = {
    "v1": [72, 74, 76, 79, 81, 84, 86],   # C5 D5 E5 G5 A5 C6 D6
    "v2": [69, 72, 74, 76, 79, 81, 84],   # A4 C5 D5 E5 G5 A5 C6
}


def build(prefix):
    sc = SCALES[prefix]
    for v in range(3):
        export(f"{prefix}_key_{v}", room(key(), 0.08), pan=rng.uniform(-0.2, 0.2), peak=0.55)
        export(f"{prefix}_tap_{v}", room(tap(), 0.1), pan=rng.uniform(-0.2, 0.2), peak=0.6)
        export(f"{prefix}_tok_{v}", room(tok(), 0.1), pan=rng.uniform(-0.3, 0.3), peak=0.6)
        export(f"{prefix}_whoosh_{v}", whoosh(rng.uniform(0.5, 0.65), 1.0), pan=0.0, peak=0.45)
        export(f"{prefix}_whoosh_s_{v}", whoosh(rng.uniform(0.28, 0.36), 1.0), pan=0.0, peak=0.4)
    for v in range(2):
        export(f"{prefix}_thud_{v}", room(thud(), 0.1), peak=0.65)
    for v in range(5):  # escala ascendente: cada llamada sube un grado
        export(f"{prefix}_note_{v}", room(marimba(midi(sc[v]) , 1.2, 1.0), 0.2), pan=-0.3 + 0.15 * v, peak=0.6)
        export(f"{prefix}_hi_{v}", room(marimba(midi(sc[v] + 12), 1.0, 1.0), 0.22), pan=0.3 - 0.12 * v, peak=0.5)
    for v in range(2):
        a, b = (sc[0], sc[3]) if v == 0 else (sc[1], sc[4])
        export(f"{prefix}_bell_{v}", room(glass(midi(a + 12), 2.4), 0.25), peak=0.55)
        export(f"{prefix}_bell_up_{v}", room(seq([(0, glass(midi(a + 12), 2.0)), (0.14, glass(midi(b + 12), 2.4))]), 0.25), peak=0.6)
        export(f"{prefix}_notif_{v}", room(seq([(0, marimba(midi(sc[2 + v]), 1.0)), (0.12, marimba(midi(sc[4]), 1.2))]), 0.2), peak=0.6)
        export(f"{prefix}_send_{v}", room(seq([(0, whoosh(0.3, 0.8)), (0.1, marimba(midi(sc[5]), 1.0))]), 0.15), peak=0.55)
        export(f"{prefix}_check_{v}", room(seq([(0, marimba(midi(sc[3 + v]), 0.9)), (0.09, marimba(midi(sc[5]), 1.1))]), 0.2), peak=0.55)
        export(f"{prefix}_sparkle_{v}", room(seq([(0.07 * i, marimba(midi(sc[i] + 12 + (12 if i > 3 else 0)), 0.8, 0.8)) for i in range(5)]), 0.25), peak=0.5)
        export(f"{prefix}_toggle_{v}", room(seq([(0, tok()), (0.07, np.roll(tok(), 0) * 1.0)]), 0.1), peak=0.6)


if __name__ == "__main__":
    for pfx in ("v1", "v2"):
        print("sfx", pfx)
        build(pfx)
    print("listo:", len(os.listdir(OUT)), "archivos en public/sfx")
