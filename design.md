# Vânător — Design System

Inspiration: vintage outdoor / national-park badge aesthetic (blurred forest photography, enamel-badge
logo, condensed rustic type, moss green + bone white). Applied to a Romanian hunting platform:
exam revision + hunter's guide.

## Voice & language
- All UI copy in **Romanian** (the audience is Romanian hunting-exam candidates).
- Tone: calm, field-manual, factual. Short imperative labels ("Începe examenul", "Caută armurii").
- No emoji in UI. Icons are line icons (lucide-react) or engraved-style SVG marks.

## Color
| Token | Hex | Use |
|---|---|---|
| `--bark` | `#0F140C` | page background (darkest) |
| `--forest` | `#18220F` | section background |
| `--canopy` | `#212D18` | cards, panels |
| `--bracken` | `#2E3D22` | borders, hairlines, inactive |
| `--moss` | `#7FAE55` | primary accent (correct, CTA hover, active) |
| `--moss-deep` | `#4C7A33` | primary button fill |
| `--sage` | `#A9B79A` | muted text on dark |
| `--bone` | `#F2EFE4` | primary text on dark, light surfaces |
| `--brass` | `#C9A227` | scores, numerals, badge details, emphasis |
| `--rust` | `#B5533A` | wrong answers, danger, closed season |

Rules: dark forest dominance, **brass for numerals/data**, **moss for actions**, rust only for
negative state. Never a purple/blue gradient. Light surfaces (`--bone`) only for the guide's long-form
reading views, always with `--bark` text.

Texture: every large surface carries either a blurred forest photo (`filter: blur(2px) saturate(.8)`
behind a `rgba(15,20,12,.78)` scrim), a 3% noise overlay, or a 1px topographic-line SVG pattern.
Flat solid fills are only allowed inside cards.

## Typography
- Display: **Bitter** (slab serif) — 600/700, tight tracking (-0.01em), used for h1–h3 and numerals.
- Label/eyebrow: **Oswald** — 500, uppercase, tracking 0.18em, 11–13px. Used for section eyebrows,
  tab labels, table headers, badge text.
- Body: **Karla** — 400/500, 16px/1.7. Long-form guide text 18px/1.8, max-width 68ch.
- Mono (timers, scores, question counters): **JetBrains Mono**, tabular-nums.
- Load via Google Fonts `<link>` in `index.html`. Never Inter / Roboto / Space Grotesk / Poppins.

Scale: 12 · 13 · 15 · 16 · 18 · 21 · 27 · 34 · 44 · 58 · 76 (fluid `clamp()` for hero).

## Layout
- Container 1200px, gutters 24px (16px mobile).
- Vertical rhythm: sections 96px desktop / 56px mobile.
- Asymmetry is deliberate: hero text left-weighted at 58% with the badge overlapping the photo edge;
  feature grid alternates 2fr/1fr rows instead of a uniform 3-col card grid.
- Radius: 4px (inputs, chips), 10px (cards), 999px (chips/pills). No 24px+ blobby corners.
- Borders over shadows on dark: `1px solid var(--bracken)`. Shadow only for floating overlays
  (`0 24px 60px -20px rgba(0,0,0,.7)`).

## Components
- **Badge/logo**: circular enamel badge, double ring, `EST. 2026` above, `VÂNĂTOR` in slab caps,
  pine + antler mark inside, `REVIZUIRE · GHID` in the lower arc.
- **Button primary**: `--moss-deep` fill, bone text, Oswald caps 13px, 1px moss border, hover lifts to
  `--moss`. **Secondary**: transparent, bracken border, bone text. **Ghost**: text + underline on hover.
- **Card**: canopy fill, bracken border, 10px radius, 20–28px padding; hovered cards raise border to
  moss and translate -2px.
- **Chip (chapter selector)**: pill, bracken border, sage text; active = moss-deep fill + bone text.
- **Question**: statement in Bitter 21px; options are full-width rows with a brass letter key (a/b/c),
  hover = bracken fill. States: selected (moss border), correct (moss fill 12% + moss border),
  wrong (rust fill 12% + rust border).
- **Stat block**: brass numeral in Bitter 44px over an Oswald caps label in sage.
- **Table (hunting seasons)**: bone-on-dark, Oswald caps header, alternating `rgba(255,255,255,.02)`
  rows, moss left-border on rows currently open, rust when closed.
- **Map (armurii)**: dark-tiled Leaflet map, moss circular markers with brass ring, popup card in
  canopy. Search field above with county dropdown.
- **Weapon card**: photo/illustration top, name in Bitter, spec grid in mono 13px, caliber chips.

## Motion
One orchestrated page-load per route: staggered fade+rise (`opacity 0→1`, `translateY 14px→0`,
70ms stagger, 520ms `cubic-bezier(.22,.61,.36,1)`) via Motion. Flashcards use a 3D Y-flip (600ms).
Exam timer pulses rust under 5 minutes. Respect `prefers-reduced-motion` (disable transforms).

## Structure
- `/` landing — hero, cifre, cum funcționează, module, ghid preview, preț, footer
- `/auth` — sign in / sign up (Google + email-parolă)
- `/revizuire` — exam app shell: Examen 30, Istoric, Greșeli, Flashcards, Test-grilă, Fișe, Perioade
- `/arme` — weapon inventory + filters + detail
- `/armurii` — map + city/county search
- `/ghid` — hunter's guide index + article pages
