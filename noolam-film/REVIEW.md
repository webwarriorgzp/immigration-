# REVIEW: NOOLAM "One Thread" (27 s, 1920×1080, 30 fps)

## Creative calls
- Built storyline A, One Thread: a gold thread carries the film from the silk, through the lineup and showroom, into the three-silk braid and the crest. Not built: B "Pick a Silk" (hard cuts between colour fields) and C "Six Days to the Muhurtham" (a bride's day). Both are in `STORYLINES.md`.
- The lineup-to-showroom move is an endless zoom: the eight looks turn out to be the framed panel on the showroom's back wall (the panel where the store logo was painted over in `hero-showroom.jpg`).
- Copy is the site's own lines plus one opener ("It begins with a single thread"). The only price shown is real: Sindoor Tussar, ₹7,199.
- Sound: the ElevenLabs Music API needs a paid plan (the account returned 402), so the bed is a 22 s tanpura-and-sitar loop from the free sound-effects API, crossfaded to length (`assets/audio/film-bed.m4a`). Effects: silk whooshes on the dive (4.1 s), the pull-back (10.3 s) and the whip (14.8 s); a temple-bell chime on the wordmark (23.02 s). The site still plays the film muted.

## Measured
- `npx hyperframes check`: ok. Kept on purpose: `canvas_covered` (the lineup's white ground covers the frame by design), and WebGL `console_warning` performance notes from the software renderer.
- Snapshots at 1.8, 4.5, 5.4, 11, 13.6, 15.15–20.6 and 25.9 s, plus the review sheets (beats, seams, phone).

## Rendered
- `renders/noolam-one-thread.mp4`: 1920×1080, 30 fps, 27.0 s, H.264, 20.5 MB, no audio track. Frames pulled from the file at 14 points match the previews.
- Web copy for the site: `noolam/assets/noolam-film.mp4` (1280×720, CRF 26, faststart, 2.3 MB) and `noolam-film-poster.jpg`.

## Only looked at
- Motion between sampled frames; the render's motion blur was not inspected frame by frame.

## Weakest shot
- 4.5 s, the match cut from silk into the pallu: the colours match, but the first lineup frame shows a gap of white between the pallu and the body. With more time: re-aim the zoom point once more, or run the dive and pull-back as one move across the seam.
- The violet strand reads dark plum next to the black-gold one; a brighter violet crop would separate the three silks more clearly.
