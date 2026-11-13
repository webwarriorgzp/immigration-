"""Level-locked mix:  python3 mix.py voice.mp3 music.wav sfx.wav [out=mix_raw.wav]
Music gated RMS = 50 % of voice gated RMS (-6 dB). SFX gated RMS <= 50 % of voice, peaks <= 0.7 x voice peak.
No ducking or compression: each stem gets one linear gain. Voice is untouched."""
import sys, subprocess, wave, numpy as np
SR = 48000
def load(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)
def gated_rms(x, blk=0.4, rel=-20.0):
    n = int(blk * SR); m = len(x) // n
    if m == 0: return float(np.sqrt(np.mean(x ** 2)) + 1e-12)
    b = np.sqrt(np.mean(x[: m * n].reshape(m, n) ** 2, axis=1)) + 1e-12
    b = b[b > 10 ** (-70 / 20)]
    if len(b) == 0: return 1e-12
    g = b[b > np.sqrt(np.mean(b ** 2)) * 10 ** (rel / 20)]
    return float(np.sqrt(np.mean(g ** 2)))
db = lambda r: 20 * np.log10(max(r, 1e-12))
voice, music, sfx = load(sys.argv[1]), load(sys.argv[2]), load(sys.argv[3])
out = sys.argv[4] if len(sys.argv) > 4 else "mix_raw.wav"
N = len(voice); fit = lambda x: np.pad(x, (0, max(0, N - len(x))))[:N]
music, sfx = fit(music), fit(sfx)
vr, vp = gated_rms(voice), np.abs(voice).max()
gm = 0.5 * vr / gated_rms(music) if np.abs(music).max() > 0 else 0.0
gs = 0.5 * vr / gated_rms(sfx) if np.abs(sfx).max() > 0 else 0.0
if gs and np.abs(sfx).max() * gs > 0.7 * vp: gs = 0.7 * vp / np.abs(sfx).max()
music, sfx = music * gm, sfx * gs
mix = voice + music + sfx
pk = np.abs(mix).max()
if pk > 0.98: mix *= 0.98 / pk   # one linear trim on the whole mix keeps the ratios
pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
with wave.open(out, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(f"voice gated RMS {db(vr):6.1f} dBFS  peak {db(vp):6.1f}")
print(f"music vs voice  {db(gated_rms(music)) - db(vr):+6.1f} dB  (target -6.0)")
s_r = gated_rms(sfx) if gs else 0
print(f"sfx   vs voice  {db(s_r) - db(vr) if gs else float('-inf'):+6.1f} dB  (<= -6.0), peak {db(np.abs(sfx).max()) - db(vp) if gs else float('-inf'):+6.1f} dB vs voice peak (<= -3.1)")
print("wrote", out, f"{N / SR:.2f} s")
