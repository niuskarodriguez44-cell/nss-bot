#!/usr/bin/env python3
"""Genera la música y los efectos de sonido del video (síntesis propia, sin copyright).

Uso:  python3 scripts/make_audio.py
Salida: public/music.mp3 y public/sfx/*.mp3
Requiere numpy y el ffmpeg de Remotion (npx remotion ffmpeg).
"""
import os, subprocess, tempfile, wave
import numpy as np

SR = 44100
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
DURATION = 46.0  # segundos (1380 frames a 30 fps)
rng = np.random.default_rng(7)  # semilla fija: resultado reproducible


def to_mp3(stereo: np.ndarray, path: str, bitrate="160k"):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pcm = (np.clip(stereo, -1, 1) * 32767).astype("<i2")
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "a.wav")
        with wave.open(wav, "wb") as w:
            w.setnchannels(2)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes(pcm.tobytes())
        subprocess.run(
            ["npx", "remotion", "ffmpeg", "-y", "-loglevel", "error", "-i", wav,
             "-codec:a", "libmp3lame", "-b:a", bitrate, path],
            check=True, cwd=ROOT)


def mono_to_stereo(x):
    return np.stack([x, x], axis=1)


def tt(n):
    return np.arange(n) / SR


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ---------------------------------------------------------------- instrumentos
def pluck(f, dur=1.4, amp=1.0):
    t = tt(int(dur * SR))
    y = (np.sin(2*np.pi*f*t)
         + 0.35*np.sin(2*np.pi*2*f*t)*np.exp(-t*10)
         + 0.15*np.sin(2*np.pi*3*f*t)*np.exp(-t*14))
    env = np.minimum(t/0.004, 1) * np.exp(-t*5.5)
    return amp * y * env


def pad(f, dur, amp=1.0):
    t = tt(int(dur * SR))
    y = np.zeros_like(t)
    for detune in (-0.0018, 0.0018):
        for n in range(1, 7):
            y += np.sin(2*np.pi*f*(1+detune)*n*t) / n**1.8
    a = min(0.9, dur/3)
    r = min(1.4, dur/3)
    env = np.minimum(t/a, 1) * np.minimum((dur - t)/r, 1)
    return amp * y * env * 0.5


def bass(f, dur, amp=1.0):
    t = tt(int(dur * SR))
    y = np.sin(2*np.pi*f*t) + 0.2*np.sin(2*np.pi*2*f*t)
    env = np.minimum(t/0.012, 1) * np.exp(-t*1.6) * np.minimum((dur - t)/0.08, 1)
    return amp * y * env


def kick(amp=1.0):
    t = tt(int(0.3 * SR))
    f = 45 + 80*np.exp(-t*28)
    ph = 2*np.pi*np.cumsum(f)/SR
    return amp * np.sin(ph) * np.exp(-t*14)


def shaker(dur=0.09, amp=1.0):
    t = tt(int(dur * SR))
    n = rng.standard_normal(len(t))
    n = np.diff(n, prepend=0)
    return amp * n * np.exp(-t*45) * 0.5


def place(buf, y, t0, pan=0.0):
    i = int(t0 * SR)
    if i >= buf.shape[0]:
        return
    y = y[: buf.shape[0] - i]
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    buf[i:i+len(y), 0] += y * l
    buf[i:i+len(y), 1] += y * r


def reverb(buf, wet=0.28, secs=2.2):
    n = int(secs * SR)
    t = tt(n)
    out = np.zeros_like(buf)
    for c in range(2):
        ir = rng.standard_normal(n) * np.exp(-t*2.6)
        ir[: int(0.012*SR)] *= np.linspace(0, 1, int(0.012*SR))
        L = len(buf) + n
        sz = 1 << (L - 1).bit_length()
        conv = np.fft.irfft(np.fft.rfft(buf[:, c], sz) * np.fft.rfft(ir, sz), sz)[: len(buf)]
        out[:, c] = conv
    out *= 0.045
    return buf*(1-wet*0.5) + out*wet*3


# --------------------------------------------------------------------- música
def make_music():
    bar = 2.5  # 96 BPM, compás de 4/4
    beat = bar/4
    eighth = beat/2
    n = int(DURATION * SR)
    buf = np.zeros((n, 2))
    chords = [  # C, G/B, Am, F
        [48, 52, 55, 60], [47, 50, 55, 59], [45, 52, 57, 60], [41, 53, 57, 60]]
    bass_notes = [36, 43, 45, 41]
    pattern = [0, 1, 2, 3, 2, 1, 2, 1]
    total_bars = 19
    for b in range(total_bars):
        t0 = b*bar
        ch = chords[b % 4] if b < 16 else chords[0]
        bs = bass_notes[b % 4] if b < 16 else bass_notes[0]
        last = b >= 16
        dur = bar if not (b == total_bars-1) else DURATION - t0
        # colchón
        for m in ch:
            place(buf, pad(midi(m), dur + 0.6, 0.20 if b < 2 else 0.26), t0)
        # arpegio
        if b >= 1:
            for k in range(8):
                if b == 1 and k % 4 != 0:
                    continue
                if b >= 16 and k > (4 if b == 16 else 0):
                    continue
                m = ch[pattern[k]] + 12
                amp = 0.30 if b < 6 else 0.36
                place(buf, pluck(midi(m), 1.4, amp), t0 + k*eighth, pan=-0.35 + 0.7*(k/7))
        # bajo
        if 6 <= b < 16:
            place(buf, bass(midi(bs), bar, 0.38), t0)
        # percusión suave
        if 6 <= b < 16:
            for k in range(4):
                if k in (0, 2) or b >= 12:
                    place(buf, kick(0.28), t0 + k*beat)
            for k in range(8):
                if k % 2 == 1:
                    place(buf, shaker(0.09, 0.16), t0 + k*eighth, pan=0.3)
        # campanas agudas
        if 8 <= b < 16:
            for k in (0, 3, 5):
                m = ch[(b + k) % 4] + 24
                place(buf, pluck(midi(m), 1.6, 0.20), t0 + k*beat/1.0 * 0.5 + 0.0, pan=0.5)
    buf = reverb(buf)
    peak = np.max(np.abs(buf))
    buf = buf / peak * 0.85
    fade = np.minimum(1, np.linspace(0, 1, n) * DURATION / 0.8)  # entrada suave
    tail = np.minimum(1, (DURATION - tt(n)) / 2.5)               # salida suave
    buf *= (fade * tail)[:, None]
    return buf


# ------------------------------------------------------------------------ SFX
def sfx_tick():
    t = tt(int(0.05*SR))
    n = rng.standard_normal(len(t)) * np.exp(-t*220)
    s = np.sin(2*np.pi*2100*t) * np.exp(-t*160)
    return mono_to_stereo((n*0.5 + s*0.6) * 0.8)


def sfx_tock():
    t = tt(int(0.12*SR))
    y = np.sin(2*np.pi*760*t) * np.exp(-t*38) + 0.4*np.sin(2*np.pi*1520*t)*np.exp(-t*60)
    return mono_to_stereo(y * 0.8)


def sfx_pop():
    t = tt(int(0.22*SR))
    f = 280 + 520*(1-np.exp(-t*45))
    y = np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t*24)
    y += 0.25*np.sin(2*np.pi*np.cumsum(f*2)/SR) * np.exp(-t*40)
    return mono_to_stereo(y * 0.8)


def sfx_whoosh(dur=0.8):
    n = int(dur*SR)
    t = tt(n)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    y = 0.0
    cut = 250 + 3200*np.sin(np.pi*t/dur)**2
    a = 1 - np.exp(-2*np.pi*cut/SR)
    for i in range(n):
        y += a[i]*(x[i]-y)
        out[i] = y
    env = np.sin(np.pi*t/dur)**1.6
    out = out*env
    out /= np.max(np.abs(out)) + 1e-9
    left = out * np.linspace(0.8, 1.0, n)
    right = out * np.linspace(1.0, 0.8, n)
    return np.stack([left, right], axis=1) * 0.7


def bell(f, dur, amp=1.0):
    t = tt(int(dur*SR))
    y = np.zeros_like(t)
    for ratio, a, d in ((1, 1.0, 3.0), (2.0, 0.5, 4.5), (2.76, 0.35, 6.0), (5.4, 0.15, 9.0)):
        y += a*np.sin(2*np.pi*f*ratio*t)*np.exp(-t*d)
    return amp * y * np.minimum(t/0.003, 1)


def sfx_chime():
    return mono_to_stereo(bell(880, 1.6, 0.5))


def sfx_success():
    out = np.zeros((int(1.8*SR), 2))
    for i, f in enumerate((660, 990)):
        y = bell(f, 1.5, 0.5)
        j = int(i*0.13*SR)
        out[j:j+len(y), 0] += y
        out[j:j+len(y), 1] += y
    return out


def sfx_sparkle():
    out = np.zeros((int(1.4*SR), 2))
    for i, f in enumerate((1318, 1568, 1976, 2349, 2637, 3136)):
        y = pluck(f, 0.9, 0.35)
        j = int(i*0.06*SR)
        pan = -0.6 + i*0.24
        out[j:j+len(y), 0] += y*np.cos((pan+1)*np.pi/4)
        out[j:j+len(y), 1] += y*np.sin((pan+1)*np.pi/4)
    return out


def main():
    print("music…")
    to_mp3(make_music(), os.path.join(PUBLIC, "music.mp3"), "160k")
    sfx = {
        "tick": sfx_tick(), "tock": sfx_tock(), "pop": sfx_pop(),
        "whoosh": sfx_whoosh(), "chime": sfx_chime(),
        "success": sfx_success(), "sparkle": sfx_sparkle(),
    }
    for name, data in sfx.items():
        print("sfx", name)
        to_mp3(data, os.path.join(PUBLIC, "sfx", f"{name}.mp3"), "128k")


if __name__ == "__main__":
    main()
