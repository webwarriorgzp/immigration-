# NOOLAM: scroll-driven silk showcase

A single page that rebuilds, section by section, the NOOLAM site from the reference reel. It's plain HTML, CSS and ES modules with no build step. Libraries load from CDNs: GSAP + ScrollTrigger, Lenis and Three.js.

Run it with any static server from this folder, e.g. `python3 -m http.server`, then open http://localhost:8000.

## Sections, in reel order
| # | Section | What it does |
|---|---------|--------------|
| 0 | Silk curtain | Intro loader: a red silk curtain with the crest lifts away on a wavy edge |
| – | Nav + ticker | Maroon pill nav with a gold active state, bag count, "Visit the Store"; hides on scroll down. A maroon ticker is fixed to the bottom of the screen |
| 1 | Hero | Pinned: the silk close-up pulls back into the showroom ("Woven for the Divine."), then dollies in and cuts to the artisans ("An heirloom from the first fold.") |
| 2 | Band | Gold serif marquee on maroon with a scalloped edge, moved by scroll |
| 3 | Six Moods | Jharokha (onion-dome) arches with cut-outs on pastel grounds; they reveal from the bottom and drift on scroll |
| 4 | Try the Look | A lineup of cut-outs drifts sideways; hover blurs the rest; tap opens a single look with numbered hotspots, piece list, total and "Add full look to bag" |
| 5 | Pick a Silk | Pinned 3D perspective wall of vivid cards with condensed titles; cards tilt to the pointer, press in, flip on click, spin on double-click |
| 6 | The Rack | Filter chips with counts; cut-outs hang on hangers along a rail that drags and scrolls; filtering drops new pieces in with a swing; tapping opens a focus view with sizes and "Add to bag" |
| 7 | Draped in devotion | A tilted 3D carousel of product cards with a diagonal phrase ribbon |
| 8 | Feel the drape | A wide centre screen (crossfading slideshow, or a video via `DRAPE.video`) with parallax columns |
| 9 | Silk, in motion | Pinned coverflow ring of reel cards; tapping opens a story viewer (progress bars, tap sides to skip, hold to pause, swipe down to close) |
| 10 | Bridal | Pinned coverflow of arch cards with motion blur and snapping; name, price and "Add to cart" update |
| 11 | Three silks, one weave | Three thin threads; each silk you pick unfurls as a fabric ribbon; three picks braid them, apply 10% off and enable "Add woven set to bag", which flies the ribbons off |
| 12 | Footer | Magenta card with link columns and a newsletter form |

## Assets
- **Photography:** from cult91.com, with real product names, prices and product links (`js/data.js`).
- **Cut-outs (`assets/cut/*.webp`):** made offline from the same photos with `@imgly/background-removal-node`, then cleaned and trimmed.
- **Fabric (`assets/fabric-*.jpg`, `assets/swatch-*.jpg`):** cropped from the saree and suit photos.
- **`hero-showroom.jpg`:** the cult91 store interior, with the outside sign cropped off and the back-wall logo painted over.

To swap anything, edit `js/data.js`. Every section reads its content from there.
