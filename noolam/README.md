# NOOLAM: scroll-driven silk showcase (prototype)

A single-page prototype for a fictional Kanchipuram silk brand. It's plain HTML, CSS and ES modules with no build step. Libraries load from CDNs: GSAP + ScrollTrigger, Lenis and Three.js.

Run it with any static server from this folder, e.g. `python3 -m http.server`, then open http://localhost:8000.

## Sections
| # | Section | Technique |
|---|---------|-----------|
| 1 | Hero, "Woven for the Divine" | Pinned timeline: the silk close-up clips and zooms out into the showroom |
| 2 | Try the Look | Lineup of cut-outs; hover or tap blurs the rest and steps one forward; the side panel lists the pieces |
| 3 | Pick a Silk | Pinned horizontal track, per-card tilt via `containerAnimation` |
| 4 | The Rack | Filter chips; old items blur out, new ones slide in and swing from the hanger (`transform-origin: top`) |
| 5 | Feel the drape | Parallax columns around a central clip (canvas placeholder) |
| 6 | Silk, in motion | Reel cards open a story viewer with 3D side cards, a tinted backdrop, auto-advance, swipe and keyboard controls |
| 7 | Bridal | Arch cards fan out on scroll |
| 8 | Three silks, one weave | Three.js ribbons (CPU-deformed planes, sheen material) blend from free flow into a braid as you scroll |

## Photography
The product photos in `assets/` come from cult91.com. They're downsized to 900px JPEGs, and each look, card, rack item and reel uses its real product name and price. "Shop the look" links to the product page on cult91.com. Try the Look uses an expanding accordion because the photos have solid backgrounds, not transparent cut-outs.

## Swapping in assets
All content is in `js/data.js`. Placeholders (procedural silk textures and SVG models and garments, in `js/placeholders.js`) are drawn only when an item has no asset:

- Looks, cards and bridal items: add `img: 'assets/meera.png'` (a transparent PNG cut-out).
- Rack items: add `img: 'assets/maroon-saree-hanger.png'`.
- Drape clip: replace the `<canvas id="drape-canvas">` in `index.html` with a `<video autoplay muted loop playsinline>`.
- Weave ribbons: pass your own seamless fabric images to `initWeave` (any canvas or image works as a texture source).
