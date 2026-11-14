#!/usr/bin/env python3
"""Banda sonora de AliceMaf 12B + AIRE MoE (90 s, 48 kHz estéreo), alineada a src/timeline.ts.
Sonidos: síntesis original (whooshes, risers, golpes, ambiente) + paquete Interface Sounds de Kenney (CC0).
Uso: python3 scripts/make_audio.py <salida.wav>"""
import sys, numpy as np, wave
from scipy import signal
from scipy.io import wavfile
SR = 48000; DUR = 90.0; N = int(SR * DUR)
rng = np.random.default_rng(2026)
L = np.zeros(N); R = np.zeros(N)          # bus seco
WL = np.zeros(N); WR = np.zeros(N)        # envío a reverb

def put(sig, t, gain=1.0, pan=0.0, wet=0.25):
    s = np.atleast_2d(sig); s = s if s.shape[0] == 2 else np.vstack([s[0], s[0]])
    i = int(t * SR)
    if i >= N: return
    e = min(N, i + s.shape[1]); n = e - i
    pl = np.cos((pan + 1) * np.pi / 4); pr = np.sin((pan + 1) * np.pi / 4)
    L[i:e] += s[0, :n] * gain * pl; R[i:e] += s[1, :n] * gain * pr
    WL[i:e] += s[0, :n] * gain * wet; WR[i:e] += s[1, :n] * gain * wet

def env(n, a, d, curve=3.0):
    t = np.arange(n) / SR
    return np.minimum(t / max(a, 1e-4), 1) * np.exp(-t * curve / max(d, 1e-3))

def swept_noise(dur, f0, f1, q=2.5, curve=1.0):
    """Ruido filtrado por banda con frecuencia central que barre de f0 a f1 (bloques con estado)."""
    n = int(dur * SR); x = rng.standard_normal((2, n)); y = np.zeros((2, n)); blk = 512
    zi = [None, None]
    for b in range(0, n, blk):
        u = (b / n) ** curve; f = f0 * (f1 / f0) ** u
        bw = max(f / q, 40); lo = max(30, f - bw / 2); hi = min(SR / 2 - 100, f + bw / 2)
        sos = signal.butter(2, [lo, hi], btype='band', fs=SR, output='sos')
        for c in range(2):
            if zi[c] is None: zi[c] = signal.sosfilt_zi(sos) * 0
            seg, zi[c] = signal.sosfilt(sos, x[c, b:b + blk], zi=zi[c]); y[c, b:b + blk] = seg
    return y / (np.abs(y).max() + 1e-9)

def whoosh(dur=1.4, f0=300, f1=5000, peak=0.62):
    n = int(dur * SR); y = swept_noise(dur, f0, f1, 1.8, 1.0)
    t = np.linspace(0, 1, n); a = np.sin(np.pi * np.clip(t / (peak * 2), 0, 1)) ** 2 * (t < peak) + (1 - (t - peak) / (1 - peak)) ** 2 * (t >= peak)
    y = y * a
    y[1] = np.roll(y[1], int(0.004 * SR))   # ensanchado estéreo
    return y * 0.9

def riser(dur=3.5, f0=250, f1=9000):
    n = int(dur * SR); t = np.arange(n) / SR; u = t / dur
    y = swept_noise(dur, f0, f1, 1.4, 1.6) * (u ** 2.2)
    ph = 2 * np.pi * np.cumsum(180 * (1600 / 180) ** u) / SR
    tone = np.sin(ph) * 0.18 * u ** 2
    return y * 0.8 + tone

def boom(dur=3.2):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 32 + 70 * np.exp(-t * 9); sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.5)
    nz = signal.sosfilt(signal.butter(2, 260, 'low', fs=SR, output='sos'), rng.standard_normal(n)) * np.exp(-t * 7)
    click = signal.sosfilt(signal.butter(2, 3000, 'high', fs=SR, output='sos'), rng.standard_normal(n)) * np.exp(-t * 60) * 0.5
    y = sub * 1.0 + nz * 0.9 + click
    return np.vstack([y, y]) / (np.abs(y).max() + 1e-9)

def bell(f, dur=2.2, bright=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for k, (m, a, d) in enumerate(((1, 1.0, 1.0), (2.76, 0.5 * bright, 0.6), (5.4, 0.25 * bright, 0.35), (8.9, 0.1 * bright, 0.2))):
        y += a * np.sin(2 * np.pi * f * m * t + k) * np.exp(-t * 3.2 / (dur * d))
    y *= np.minimum(t / 0.004, 1)
    return np.vstack([y, np.roll(y, 40)]) * 0.4

def shimmer(dur=3.0, f=2093):
    n = int(dur * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for k in range(7):
        ff = f * (1 + 0.5 * k) * (1 + 0.002 * rng.standard_normal()); y += np.sin(2 * np.pi * ff * t + rng.uniform(0, 6.28)) * (0.5 + 0.5 * np.sin(2 * np.pi * (0.7 + 0.3 * k) * t))
    y *= np.sin(np.pi * t / dur) ** 2 * 0.07
    return np.vstack([y, np.roll(y, 300)])

def pad(freqs, dur, vol=0.05):
    n = int(dur * SR); t = np.arange(n) / SR; y = np.zeros((2, n))
    for f in freqs:
        for d, c in ((-0.003, 0), (0.0, 0), (0.003, 1)):
            ff = f * (1 + d)
            w = sum(np.sin(2 * np.pi * ff * h * t + rng.uniform(0, 6.28)) / h ** 1.4 for h in range(1, 6))
            if d == 0: y[0] += w * 0.6; y[1] += w * 0.6
            else: y[c] += w
    lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 0.05 * t + 1)
    sos = signal.butter(2, 700, 'low', fs=SR, output='sos'); y = signal.sosfilt(sos, y, axis=1)
    y *= (0.55 + 0.45 * lfo) * vol
    a = np.minimum(t / 2.5, 1) * np.minimum((dur - t) / 3.0, 1)
    return y * a

def kenney(name, gain=1.0, pitch=1.0):
    sr, x = wavfile.read(f'audio/kenney/{name}.wav'); x = x.astype(np.float64)
    x = x / (np.abs(x).max() + 1e-9)
    if x.ndim == 2: x = x.mean(axis=1)
    if sr != SR: x = signal.resample_poly(x, SR, sr)
    if pitch != 1.0: x = signal.resample(x, int(len(x) / pitch))
    return np.vstack([x, x]) * gain

# ---------------- cronología (segundos globales) ----------------
TRANS = [8, 20, 30, 51, 80]                      # entradas por partículas
for T, tr in zip(TRANS, (1.4, 1.4, 1.4, 1.6, 1.4)):
    put(whoosh(tr + 0.35, 380, 5200), T - tr, 0.55, wet=0.35)
    put(bell(220 * 2, 1.8, 0.4), T, 0.35, wet=0.5)       # asentamiento suave
# E1: nacimiento de la partícula y formación del logo
put(bell(1760, 3.5), 0.25, 0.5, wet=0.6)
put(shimmer(3.8, 1568), 2.2, 0.9, wet=0.6)
put(kenney('open_003', 0.3, 0.8), 4.5, 1.0, wet=0.5)
# textos (subtítulos y rótulos): clic muy suave
for t in (8.9, 11.7, 16.2, 20.5, 24.8, 30.5, 34.9, 40.2, 45.3, 52.4, 56.8, 60.3, 63.8, 67.9, 71.0, 77.3, 80.5, 83.7, 86.7):
    put(kenney('tick_004', 0.10), t, 1.0, pan=rng.uniform(-0.4, 0.4), wet=0.4)
# E2: dos focos
put(bell(523, 3.0), 9.2, 0.45, pan=-0.5, wet=0.6); put(bell(784, 3.0), 10.0, 0.45, pan=0.5, wet=0.6)
# E3: el reto: pulsos graves
for k in range(4): put(boom(1.6)[:, :int(1.6 * SR)], 22 + k * 1.9, 0.18, wet=0.3)
# E4: ruteo (tiempos reales = original / 1.55 + 30)
K = 1.55
for t0, ex_ in ((5, (0, 2)), (19, (1, 2))):
    a = 30 + t0 / K
    put(whoosh(1.2, 500, 3500), a + 0.1, 0.35, pan=-0.6, wet=0.3)            # token → enrutador
    put(kenney('select_007', 0.45), a + 1.25, 1.0, wet=0.5)                  # decide el enrutador
    for j, e in enumerate(ex_):
        put(bell(660 * (1.5 if e == 2 else 1.25 if e == 0 else 1.0), 2.0), a + 2.15 + 0.12 * j, 0.5, pan=0.4, wet=0.5)   # experto activo
    put(whoosh(1.1, 800, 4200), a + 3.2, 0.3, pan=0.5, wet=0.3)
    put(kenney('confirmation_001', 0.5), a + 4.9, 1.0, wet=0.5)              # salida combinada
# E5: isotipo
for t, f in ((54.0, 880), (54.9, 1175)): put(bell(f, 2.4), t, 0.55, wet=0.6)
put(kenney('glass_006', 0.5), 54.4, 1.0, wet=0.5)
put(kenney('pluck_001', 0.45), 57.5, 1.0, wet=0.5); put(kenney('pluck_001', 0.45, 1.19), 60.0, 1.0, wet=0.5)
# subida + golpe en E6 (corte duro en 63.0)
put(riser(4.0), 59.0, 0.8, wet=0.4)
put(boom(3.4), 63.0, 0.95, wet=0.5)
put(bell(110 * 4, 4.0, 1.4), 63.0, 0.5, wet=0.7)
for t in (67.8, 70.9, 74.0):
    put(kenney('glass_006', 0.55, 1.0), t, 1.0, wet=0.6); put(shimmer(2.4, 1760), t, 0.8, wet=0.6)
# E7: anillo y cierre
put(shimmer(4.5, 1319), 81.0, 0.9, wet=0.6)
put(bell(523, 4.5), 86.7, 0.5, wet=0.7); put(bell(784, 4.5), 86.9, 0.4, wet=0.7); put(bell(1046, 4.5), 87.1, 0.35, wet=0.7)
# cama ambiente: acordes lentos que acompañan las escenas
CH = [(0, 20, (110, 165, 220)), (20, 30, (98, 147, 196)), (30, 51, (110, 165, 247)), (51, 63, (87.3, 131, 175, 262)),
      (63, 80, (73.4, 110, 165, 220)), (80, 90, (110, 165, 220, 277))]
for a, b, fr in CH: put(pad(fr, b - a + 3, 0.055), a - 0.5 if a else 0, 1.0, wet=0.35)

# reverb de convolución sintética (cola larga, estéreo descorrelacionado)
ir_n = int(2.8 * SR); t = np.arange(ir_n) / SR
ir = np.vstack([rng.standard_normal(ir_n) * np.exp(-t * 2.1), rng.standard_normal(ir_n) * np.exp(-t * 2.1)])
ir = signal.sosfilt(signal.butter(2, 7000, 'low', fs=SR, output='sos'), ir, axis=1) * 0.012
rl = signal.fftconvolve(WL, ir[0])[:N] + signal.fftconvolve(WR, ir[1])[:N] * 0.3
rr = signal.fftconvolve(WR, ir[1])[:N] + signal.fftconvolve(WL, ir[0])[:N] * 0.3
mix = np.vstack([L + rl, R + rr])
# bus: filtro de graves, límite suave y fundidos
mix = signal.sosfilt(signal.butter(2, 28, 'high', fs=SR, output='sos'), mix, axis=1)
mix = np.tanh(mix * 1.15) / np.tanh(1.15)
fade = np.minimum(np.arange(N) / (SR * 1.0), 1) * np.minimum((N - np.arange(N)) / (SR * 2.5), 1)
mix *= fade * (10 ** (-1.5 / 20) / (np.abs(mix).max() + 1e-9))
out = (mix.T * 32767).astype(np.int16)
wavfile.write(sys.argv[1], SR, out)
rms = np.sqrt((mix ** 2).mean()); print('ok', sys.argv[1], 'peak', round(float(np.abs(mix).max()), 3), 'rms dBFS', round(20 * np.log10(rms), 1))
