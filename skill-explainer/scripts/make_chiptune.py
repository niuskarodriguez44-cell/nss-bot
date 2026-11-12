#!/usr/bin/env python3
"""Música y efectos "8 bits" para el video McpStory (síntesis propia: onda cuadrada, triángulo y ruido).

Uso: python3 scripts/make_chiptune.py
Salida: public/music_pixel.mp3 (60 s) y public/sfx/px_<rol>_<n>.mp3
"""
import os, subprocess, tempfile, wave
import numpy as np

SR = 44100
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
rng = np.random.default_rng(8)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tt(d):
    return np.arange(int(d * SR)) / SR


def square(f, t, duty=0.5):
    ph = (f * t) % 1.0
    return np.where(ph < duty, 1.0, -1.0)


def tri(f, t):
    ph = (f * t) % 1.0
    return 4 * np.abs(ph - 0.5) - 1


def noise(t, rate=9000):
    n = len(t)
    k = max(1, int(SR / rate))
    bits = rng.integers(0, 2, size=n // k + 2) * 2.0 - 1
    return np.repeat(bits, k)[:n]


def env(t, dur, a=0.004, r=0.04, decay=None):
    e = np.minimum(t / a, 1.0) * np.minimum(np.maximum(dur - t, 0) / r, 1.0)
    if decay:
        e = e * np.exp(-t * decay)
    return e


def put(buf, y, t0):
    i = int(t0 * SR)
    if i >= len(buf):
        return
    y = y[: len(buf) - i]
    buf[i:i + len(y)] += y


def pulse(f, dur, vol=0.3, duty=0.5, decay=None, a=0.004, r=0.03):
    t = tt(dur)
    return vol * square(f, t, duty) * env(t, dur, a, r, decay)


def trian(f, dur, vol=0.35, decay=None):
    t = tt(dur)
    return vol * tri(f, t) * env(t, dur, 0.004, 0.03, decay)


def hat(vol=0.12):
    t = tt(0.05)
    return vol * noise(t, 18000) * np.exp(-t * 80)


def snare(vol=0.22):
    t = tt(0.16)
    return vol * noise(t, 12000) * np.exp(-t * 22) + 0.1 * square(190, t) * np.exp(-t * 30)


def kick(vol=0.35):
    t = tt(0.18)
    f = 130 * np.exp(-t * 20) + 45
    return vol * np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 14)


# ------------------------------------------------------------------ música
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
N16 = BEAT / 4


def chords_minor():
    # Am, F, Dm, E (menor, algo tenso)
    return [[57, 60, 64], [53, 57, 60], [50, 53, 57], [52, 56, 59]], [45, 41, 38, 40]


def chords_major():
    # C, G, Am, F
    return [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]], [36, 43, 45, 41]


def chords_major_d():
    # D, A, Bm, G (subida de tono)
    return [[62, 66, 69], [57, 61, 64], [59, 62, 66], [55, 59, 62]], [38, 45, 47, 43]


def play(buf, t0, t1, chords, bass, *, arp=True, arp_speed=2, bass_on=True, drums=0, lead=False, pad=False, vol=1.0, lead_scale=None):
    bar = 0
    t = t0
    while t < t1 - 1e-6:
        ch = chords[bar % len(chords)]
        bs = bass[bar % len(bass)]
        dur = min(BAR, t1 - t)
        if pad:
            for m in ch:
                put(buf, pulse(midi(m - 12), dur, 0.05 * vol, 0.25, a=0.05, r=0.1), t)
        if arp:
            step = N16 * arp_speed
            n = int(dur / step)
            seq = [0, 1, 2, 1, 0, 1, 2, 1] if arp_speed >= 2 else [0, 1, 2, 3, 2, 1, 0, 1]
            tones = ch + [ch[0] + 12]
            for k in range(n):
                m = tones[seq[k % len(seq)] % len(tones)] + 12
                put(buf, pulse(midi(m), step * 0.9, 0.11 * vol, 0.25, decay=6), t + k * step)
        if bass_on:
            for k in range(int(dur / BEAT)):
                put(buf, trian(midi(bs + (12 if k % 2 else 0)), BEAT * 0.9, 0.3 * vol), t + k * BEAT)
        if drums:
            for k in range(int(dur / BEAT)):
                if k % 2 == 0:
                    put(buf, kick(0.3 * vol), t + k * BEAT)
                else:
                    put(buf, snare(0.2 * vol), t + k * BEAT)
                if drums > 1:
                    put(buf, hat(0.1 * vol), t + k * BEAT + BEAT / 2)
        if lead:
            sc = lead_scale or [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[0] + 24, ch[1] + 24]
            idx = 2
            for k in range(8):
                idx = int(np.clip(idx + rng.choice([-1, 0, 1, 1, -2]), 0, len(sc) - 1))
                if k in (0, 3, 4, 6) and t + k * BEAT / 2 < t1:
                    put(buf, pulse(midi(sc[idx]), BEAT * 0.45, 0.14 * vol, 0.5, decay=3), t + k * BEAT / 2)
        t += BAR
        bar += 1


def riser(buf, t0, dur, vol=0.12):
    t = tt(dur)
    f = 200 + 1400 * (t / dur) ** 2
    y = vol * square(f * 1.0, t, 0.5) * (t / dur)
    put(buf, y * np.minimum(1, (dur - t) / 0.03), t0)


def make_music():
    n = int(60 * SR)
    buf = np.zeros(n)
    cm, bm = chords_minor()
    cM, bM = chords_major()
    cD, bD = chords_major_d()
    # 0-5 s: curiosidad (menor, escaso)
    play(buf, 0, 5, cm, bm, arp=True, arp_speed=4, bass_on=True, vol=0.8)
    # 5-14 s: tensión (menor, rápido, caja y bajo insistente)
    play(buf, 5, 14, cm, bm, arp=True, arp_speed=1, drums=1, vol=1.0)
    for k in range(18):  # bajo en corcheas
        put(buf, trian(midi(bm[(k // 4) % 4]), BEAT / 2 * 0.9, 0.2), 5 + k * BEAT / 2)
    # 14-17 s: silencio expectante y subida
    riser(buf, 14.2, 3.0, 0.14)
    # 17-22 s: alivio, mayor luminoso
    put(buf, pulse(midi(72), 0.3, 0.2), 17.2)
    play(buf, 17.2, 22, cM, bM, arp=True, arp_speed=2, drums=0, pad=True, lead=True, vol=1.0)
    # 22-34 s: groove principal
    play(buf, 22, 34, cM, bM, arp=True, arp_speed=2, drums=2, lead=True, vol=1.0)
    # 34-40 s: variación; 40-43 s: pausa tensa (permiso); 43-46 s: regreso
    play(buf, 34, 40, cM[::-1], bM[::-1], arp=True, arp_speed=2, drums=2, lead=True, vol=1.0)
    play(buf, 40, 43, cm, bm, arp=False, bass_on=True, drums=0, pad=True, vol=0.8)
    play(buf, 43, 46, cM, bM, arp=True, arp_speed=1, drums=2, lead=True, vol=1.05)
    # 46-54 s: subida de tono, más energía
    put(buf, pulse(midi(74), 0.25, 0.2), 46)
    play(buf, 46, 54, cD, bD, arp=True, arp_speed=1, drums=2, lead=True, vol=1.05)
    # 54-60 s: final con fanfarria y acorde largo
    play(buf, 54, 58, cM, bM, arp=True, arp_speed=1, drums=2, lead=True, vol=1.0)
    for i, m in enumerate([72, 76, 79, 84]):
        put(buf, pulse(midi(m), 0.25, 0.22, 0.5, decay=2), 58 + i * 0.12)
    for m in (60, 64, 67, 72):
        put(buf, pulse(midi(m), 1.9, 0.12, 0.25, decay=1.6), 58.55)
    put(buf, trian(midi(36), 1.9, 0.35, decay=1.5), 58.55)
    buf = buf / (np.max(np.abs(buf)) + 1e-9) * 0.8
    buf *= np.minimum(1, tt(60) / 0.3) * np.minimum(1, (60 - tt(60)) / 1.2)
    return buf


# --------------------------------------------------------------------- SFX
def blip(f, dur=0.06, vol=0.5, duty=0.5):
    return pulse(f, dur, vol, duty, decay=18, a=0.002, r=0.01)


def sfx_voice(base):
    return [blip(base * j, 0.065, 0.55) for j in (1.0, 1.12, 0.9)]


def sweep(f0, f1, dur, vol=0.4, duty=0.5, decay=None):
    t = tt(dur)
    f = f0 + (f1 - f0) * (t / dur)
    y = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR) + (duty - 0.5) * 2)
    return vol * y * env(t, dur, 0.003, 0.02, decay)


def seq(parts):
    length = max(int(d * SR) + len(x) for d, x in parts)
    y = np.zeros(length)
    for d, x in parts:
        put(y, x, d)
    return y


def sfx_noise_sweep(dur, f_lo, f_hi, vol=0.35):
    t = tt(dur)
    rate = (f_lo + (f_hi - f_lo) * np.sin(np.pi * t / dur)).astype(int)
    out = np.zeros(len(t))
    pos = 0
    while pos < len(t):
        k = max(1, int(SR / max(rate[min(pos, len(t) - 1)], 500)))
        out[pos:pos + k] = rng.choice([-1.0, 1.0])
        pos += k
    return vol * out * np.sin(np.pi * t / dur) ** 1.2


def to_mp3(mono, path, peak=0.7, bitrate="128k"):
    mono = mono / (np.max(np.abs(mono)) + 1e-9) * peak
    pcm = (np.clip(mono, -1, 1) * 32767).astype("<i2")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "a.wav")
        with wave.open(wav, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
        subprocess.run(["npx", "remotion", "ffmpeg", "-y", "-loglevel", "error", "-i", wav,
                        "-ac", "2", "-codec:a", "libmp3lame", "-b:a", bitrate, path], check=True, cwd=ROOT)


def main():
    print("música…")
    to_mp3(make_music(), os.path.join(PUBLIC, "music_pixel.mp3"), peak=0.9, bitrate="160k")
    out = os.path.join(PUBLIC, "sfx")
    voices = {"owl": 330, "squirrel": 660, "beaver": 220, "fox": 520, "turtle": 165, "teacher": 440}
    for name, base in voices.items():
        for i, y in enumerate(sfx_voice(base)):
            to_mp3(y, os.path.join(out, f"px_v_{name}_{i}.mp3"), 0.6)
    for i, f in enumerate((1500, 1800)):
        to_mp3(blip(f, 0.03, 0.5, 0.25), os.path.join(out, f"px_type_{i}.mp3"), 0.45)
    for i, f in enumerate((900, 1100)):
        to_mp3(blip(f, 0.04, 0.5, 0.5), os.path.join(out, f"px_tick_{i}.mp3"), 0.5)
    S = {
        "coin": seq([(0, blip(988, 0.07, 0.5, 0.5)), (0.07, pulse(1319, 0.32, 0.5, 0.5, decay=7))]),
        "power": seq([(i * 0.055, pulse(midi(m), 0.07, 0.45, 0.25, decay=8)) for i, m in enumerate([72, 76, 79, 84, 88, 91])]),
        "jump": sweep(220, 720, 0.16, 0.4, 0.5, decay=6),
        "error": seq([(0, pulse(midi(57), 0.12, 0.5, 0.5)), (0.13, pulse(midi(52), 0.2, 0.5, 0.5, decay=6))]),
        "zap": seq([(0, sfx_noise_sweep(0.22, 3000, 9000, 0.5)), (0.0, sweep(1800, 300, 0.2, 0.25))]),
        "click": seq([(0, blip(180, 0.05, 0.6, 0.5)), (0, 0.6 * (noise(tt(0.03), 15000)) * np.exp(-tt(0.03) * 120))]),
        "select": seq([(0, blip(880, 0.05, 0.5)), (0.05, blip(1320, 0.08, 0.5))]),
        "confirm": seq([(0, pulse(midi(84), 0.09, 0.45, 0.25)), (0.09, pulse(midi(91), 0.25, 0.45, 0.25, decay=8))]),
        "warn": seq([(0, pulse(440, 0.08, 0.45)), (0.1, pulse(330, 0.08, 0.45)), (0.2, pulse(440, 0.08, 0.45)), (0.3, pulse(330, 0.12, 0.45, decay=8))]),
        "send": seq([(0, sweep(400, 1400, 0.16, 0.4, 0.5)), (0.17, blip(1760, 0.06, 0.4))]),
        "receive": seq([(0, sweep(1400, 500, 0.14, 0.4, 0.5)), (0.15, blip(988, 0.06, 0.4))]),
        "whoosh": sfx_noise_sweep(0.36, 1500, 7000, 0.4),
        "wipe": seq([(0, sweep(900, 150, 0.16, 0.3, 0.25)), (0, sfx_noise_sweep(0.16, 2000, 6000, 0.2))]),
        "fanfare": seq([(0.0, pulse(midi(72), 0.15, 0.4, 0.25)), (0.15, pulse(midi(76), 0.15, 0.4, 0.25)), (0.3, pulse(midi(79), 0.15, 0.4, 0.25)), (0.45, pulse(midi(84), 0.7, 0.4, 0.25, decay=3)), (0.45, pulse(midi(72), 0.7, 0.25, 0.5, decay=3))]),
        "boom": seq([(0, 0.7 * noise(tt(0.45), 6000) * np.exp(-tt(0.45) * 9)), (0, sweep(160, 40, 0.3, 0.5, 0.5, decay=6))]),
        "dizzy": seq([(0, (lambda t: 0.4 * np.sign(np.sin(2 * np.pi * np.cumsum(500 + 220 * np.sin(2 * np.pi * 9 * t)) / SR)) * np.exp(-t * 3) * np.minimum(t / 0.01, 1))(tt(0.6)))]),
        "tangle": seq([(0, sfx_noise_sweep(0.6, 1200, 8000, 0.35))] + [(0.07 * i, blip(300 + 90 * (i % 5), 0.04, 0.3)) for i in range(8)]),
    }
    for name, y in S.items():
        print("sfx", name)
        to_mp3(y, os.path.join(out, f"px_{name}_0.mp3"), 0.6)
    print("listo")


if __name__ == "__main__":
    main()
