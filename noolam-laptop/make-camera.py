"""Builds the laptop camera path from the visit recording's marks.

Reads <recording>.json (section starts and click positions written by
noolam-film/visit/record.cjs) and writes the KEYS array into
compositions/laptop.html between the CAMERA-KEYS markers.

Each key is [start_s, target, duration_s]; target is "close" (screen filling
the frame), "wide" (the whole laptop) or [video_x, video_y, zoom].
"""
import json, re, sys

marks = json.load(open(sys.argv[1]))
sec = {m["name"]: m["t"] for m in marks if m["name"] != "click"}
c = [m for m in marks if m["name"] == "click"]
assert len(c) >= 16, f"expected 16 clicks, got {len(c)}"

K = []
def key(t, target, d):
    K.append([round(t, 3), target, d])

key(1.8, "close", 1.4)
# Hero: "Woven for the Divine." bottom left, then the heritage line top left.
key(sec["hero"] + 3.1, [520, 760, 1.35], 1.0)
key(sec["hero"] + 7.3, "close", 0.9)
key(sec["hero"] + 9.5, [470, 330, 1.3], 0.9)
key(sec["moods"], "close", 0.9)
# Six Moods arches.
key(sec["moods"] + 2.6, [960, 600, 1.18], 0.9)
key(sec["look"] - 0.6, "close", 0.8)
# Try the Look: lineup, single look, "Add full look to bag", back.
key(sec["look"] + 2.6, [760, 640, 1.2], 0.8)
key(c[0]["t"] + 0.4, [900, 560, 1.12], 0.8)
key(c[2]["t"] - 0.6, [c[2]["x"], c[2]["y"], 1.45], 0.6)
key(c[3]["t"] - 0.5, "close", 0.7)
# Pick a Silk: the card that turns.
key(c[4]["t"] - 0.7, [c[4]["x"], c[4]["y"] + 60, 1.4], 0.7)
key(c[5]["t"] + 1.0, "close", 0.7)
# The Rack: filter chip, pieces dropping in, focus view, add to bag.
key(c[6]["t"] - 0.6, [c[6]["x"], c[6]["y"] + 40, 1.4], 0.6)
key(c[6]["t"] + 0.9, [960, 620, 1.12], 0.8)
key(c[7]["t"] + 0.2, [960, 560, 1.28], 0.7)
key(c[8]["t"] - 0.5, [c[8]["x"], c[8]["y"], 1.5], 0.5)
key(c[9]["t"] - 0.2, "close", 0.7)
# Draped in devotion: add to cart.
key(c[10]["t"] - 0.6, [c[10]["x"], c[10]["y"] - 80, 1.35], 0.6)
key(c[10]["t"] + 1.1, "close", 0.7)
# Feel the drape: into the centre screen where the film plays.
key(sec["drape"] + 2.4, [960, 470, 1.45], 1.0)
key(sec["reels"] - 0.2, "close", 0.8)
# Story viewer.
key(c[11]["t"] + 0.3, [960, 540, 1.3], 0.8)
key(c[11]["t"] + 5.9, "close", 0.7)
# Bridal arches.
key(sec["bridal"] + 2.2, [960, 600, 1.12], 0.9)
key(sec["weave"] - 0.4, "close", 0.7)
# The weave: swatches, then back for the braid, then the add button.
key(c[12]["t"] - 0.6, [c[13]["x"], c[12]["y"] - 40, 1.4], 0.6)
key(c[14]["t"] + 0.8, "close", 1.0)
key(c[15]["t"] - 0.6, [c[15]["x"], c[15]["y"] - 60, 1.4], 0.6)
key(c[15]["t"] + 1.0, "close", 0.8)
# Footer: pull back to the whole laptop for the last shot.
key(sec["footer"] + 0.6, "wide", 1.6)

# Never start a move before the previous one has landed.
K.sort(key=lambda k: k[0])
for i in range(1, len(K)):
    prev_end = K[i - 1][0] + K[i - 1][2]
    if K[i][0] < prev_end + 0.05:
        K[i][0] = round(prev_end + 0.05, 3)

p = "compositions/laptop.html"
s = open(p).read()
block = "/* CAMERA-KEYS */ const KEYS = " + json.dumps(K) + "; /* /CAMERA-KEYS */"
s = re.sub(r"/\* CAMERA-KEYS \*/.*?/\* /CAMERA-KEYS \*/", block, s, flags=re.S)
open(p, "w").write(s)
print(len(K), "camera keys; last at", K[-1][0], "s; video ends", sec.get("end"))
