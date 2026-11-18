#!/usr/bin/env python3
"""Música con contraste para CubanBotVertical (síntesis propia), por secciones alineadas a la narración.

Uso: python3 scripts/make_music_vertical.py
Secciones (s, ya incluye el retraso de 0,5 s de la narración); ajustarlas si cambian los SEG del video.
"""
import importlib.util, os
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("ma", os.path.join(HERE, "make_audio.py"))
ma = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ma)
SR, midi, pad, pluck, bass, kick, shaker, place, reverb, to_mp3, tt = ma.SR, ma.midi, ma.pad, ma.pluck, ma.bass, ma.kick, ma.shaker, ma.place, ma.reverb, ma.to_mp3, ma.tt

D = 0.5
SEG = [0, 4.6, 9.6, 15.6, 21.4, 25.2, 28.8, 33.0]
T = [D + s for s in SEG] + [D + 36.0 + 2.2]
DUR = T[-1]
BPM = 100
beat = 60 / BPM
eighth = beat / 2
n = int(DUR * SR)
buf = np.zeros((n, 2))

Am = [57, 60, 64]; F = [53, 57, 60]; C = [60, 64, 67]; G = [55, 59, 62]; Dm = [50, 53, 57]; E = [52, 56, 59]


def section(t0, t1, chords, *, padv=0.2, arp=0.0, bassv=0.0, drums=0, bells=0.0, arp_oct=12):
    bar = 4 * beat
    t = t0
    k = 0
    while t < t1 - 0.05:
        ch = chords[k % len(chords)]
        d = min(bar, t1 - t)
        for m in ch:
            place(buf, pad(midi(m - 12), d + 0.5, padv), t)
        if arp:
            for j in range(int(d / eighth)):
                m = (ch + [ch[0] + 12])[[0, 1, 2, 3, 2, 1, 2, 1][j % 8]] + arp_oct
                place(buf, pluck(midi(m), 1.2, arp), t + j * eighth, pan=-0.3 + 0.6 * (j % 8) / 7)
        if bassv:
            place(buf, bass(midi(ch[0] - 24), d, bassv), t)
        if drums:
            for j in range(int(d / beat)):
                if drums >= 2 or j % 2 == 0:
                    place(buf, kick(0.32), t + j * beat)
                place(buf, shaker(0.08, 0.14), t + j * beat + eighth, pan=0.3)
        if bells:
            for j in (0, 3):
                place(buf, pluck(midi(ch[j % 3] + 24), 1.6, bells), t + j * beat, pan=0.4)
        t += bar
        k += 1


def riser(t0, d, v=0.12):
    x = tt(d)
    y = np.random.default_rng(3).standard_normal(len(x)) * (x / d) ** 2 * v
    place(buf, y, t0)


def hit(t0, v=0.6):
    place(buf, kick(v), t0)
    for m in (48, 55, 60, 64, 67):
        place(buf, pluck(midi(m), 2.5, 0.25), t0)


# 1 Gancho: curiosidad (menor, solo colchón y notas sueltas)
section(T[0], T[1], [Am, F], padv=0.16, arp=0.12, arp_oct=12)
# 2 Medidor: tensión (menor, bajo grave, sin batería)
section(T[1], T[2], [Dm, E], padv=0.2, arp=0.0, bassv=0.3)
# 3 Anillo: esperanza que crece (arpegio + subida)
section(T[2], T[3], [F, G], padv=0.22, arp=0.22)
riser(T[3] - 2.2, 2.2, 0.1)
# 4 Presentamos: explosión mayor, batería completa
hit(T[3], 0.7)
section(T[3], T[4], [C, G, Am, F], padv=0.24, arp=0.28, bassv=0.34, drums=2, bells=0.16)
# 5 Apps: sigue el groove
section(T[4], T[5], [C, G], padv=0.24, arp=0.26, bassv=0.32, drums=2)
# 6 Mientras duermes: caída, íntimo (solo colchón suave y campanita)
section(T[5], T[6], [F, Am], padv=0.14, bells=0.08)
# 7 Tú decides: reconstrucción
section(T[6], T[7], [F, G], padv=0.24, arp=0.24, bassv=0.3, drums=1)
riser(T[7] - 1.5, 1.5, 0.09)
# 8 Final: golpe y acorde que se queda
hit(T[7], 0.75)
section(T[7], DUR, [C], padv=0.26, arp=0.2, bassv=0.3, bells=0.18)

buf = reverb(buf, wet=0.25)
buf = buf / (np.max(np.abs(buf)) + 1e-9) * 0.9
buf *= np.minimum(1, (DUR - tt(n)) / 1.5)[:, None]
out = os.path.join(os.path.dirname(HERE), "public", "vertical", "musica.mp3")
os.makedirs(os.path.dirname(out), exist_ok=True)
to_mp3(buf, out)
print("ok", round(DUR, 2), "s ->", out)
