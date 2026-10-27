# Nova Strike style guide: "Mission Print"

The game looks like a 1970s space-agency print run: mission patches, star charts and field dispatches. It uses flat matte inks on dark paper stock, with no glow, no additive light and no gradients that pretend to be light. If a new visual would look at home on a neon synthwave poster, it is wrong for this game.

## Material rules
- **Ink, not light.** Never use `shadowBlur`, `'lighter'` blending or soft radial glows. The style layer turns them off globally.
- **Halftone dots replace glow.** `glow()` draws a solid core with a falling-off dot screen. Use it sparingly for blooms, pickups and big hits.
- **Misregistration.** Filled ships, enemies and bosses get a second plate in their line colour, offset down-right (`PLATE` in `poly()`). The logo, cards and buttons use a hard offset block in the same way.
- **Paper stock.** Each act has its own dark paper with grain, halftone dust clouds, flat planets (bands plus a hard terminator shadow) and printed star dots and plus marks.

## Palette (ink set)
Every colour the code sets is snapped to this ink set by `ink()` near the top of the script. Old hex literals still work, but new code should use these values directly. A `'!'` prefix (`'!#ff4a1f'`) bypasses the snap for exact colours.

| Role | Ink | Hex |
|---|---|---|
| Paper, Act I to IV and finale/endless | navy, umber, teal, aubergine, black | `PAPERS` |
| Bone (text, player hull, light accents) | bone | `#efe6d2` |
| **Enemy fire and danger (reserved)** | vermilion | `#ff4a1f` |
| Score, gold, highlights | mustard | `#f2b544` |
| Warm accents | orange | `#ec8a3c` |
| Gems and currency | jade | `#3fbf8f` |
| Light green roles | sage | `#a9c46a` |
| Player identity, player shots | sky | `#62b2dc` |
| Shield and tech roles | cobalt | `#6283d8` |
| Heavy roles | lilac | `#a08fdc` |
| Fast roles | plum, rose | `#c76fc4`, `#e2678f` |
| Secondary text | warm grey | `#b3a993` |

## Readability rules (do not break)
1. **Vermilion means "this hurts you".** Enemy bullets are a vermilion disc with an ink keyline, a bone core and a thin vermilion halo, drawn after the effects. Only hazards (lasers, warnings, mines, VEX) share the ink. Pickups, UI decoration and effects never use it at full strength.
2. **Player shots recede.** They are pale-blue streaks at about 80% alpha, with no bloom.
3. **Enemies are filled masses.** The body is a dark shade of the role ink, with a role-ink keyline and the offset plate. The silhouette carries the role; colour supports it.
4. **The player is the brightest silhouette.** The bone hull has an ink keyline, a livery plate and a dark canopy.
5. **Hitboxes match visuals.** Bullet discs are drawn at about 1.0 times the hit radius, and bodies stay within their collision circle.
6. **Effects stay quiet.** Use few, large, flat shapes; no particle soup over bullets.

## Type
- **Font:** one condensed grotesk stack, `Bahnschrift SemiCondensed`, then DIN Condensed, then Roboto Condensed (`FONT`).
- **Display sizes (17 and up):** slight tracking.
- **Headings** (`txt` with a shadow argument at size 20 and up): a hard ink drop shadow and printed rules either side, like `---- HANGAR ----`.

## UI devices
- **Cards and panels** (`panel`, `button`, side-panel `box`): dark paper with a hairline in the accent ink and a hard offset shadow block. Solid buttons are flat ink with a darker offset block.
- **Icons** (`hexIcon`): a double-ring stamp with a letter.
- **Rubber stamps** (`stampMark`, `stamps`): ISSUED on purchases, CLEARED or FLAWLESS on sector clear, LOST on game over. Use them for new "document" moments.
- **Transitions:** a halftone dot screen that shrinks away diagonally (`drawWipe`).
- **Logo** (`mkLogo`): bone NOVA with an orange offset plate, a sky orbit swoosh and a mustard STRIKE ribbon with stars.

## Sound: "paper and press"
- **Shots:** soft bandpass ticks plus a quiet low triangle.
- **Hits:** paper flicks.
- **Explosions:** sine thumps under lowpassed noise.
- **UI:** stamp ticks (highpass noise). Purchases are a "ka-chunk".
- **Master:** a gentle 6.5 kHz roll-off for tape warmth.
- **Avoid:** square-wave bleeps and sawtooth blasts in new SFX.
