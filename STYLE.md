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
1. **Vermilion means "this hurts you".** Enemy bullets are a vermilion disc with a small bone core, a thin ink keyline just outside the disc, and a faint vermilion halo, drawn after the effects. Keep the vermilion band at least about 3 px wide on small bullets. Only hazards (lasers, warnings, mines) share the ink. Boss inks are steered off it (`offV`), and pickups, UI decoration and effects never use it at full strength.
2. **Player shots recede.** They are deep-blue streaks at about 60% alpha, with no bloom. They must never be brighter than the bullets they cross.
3. **Enemies are filled masses.** The body is a dark shade of the role ink, with a role-ink keyline and the offset plate. The silhouette carries the role; colour supports it.
4. **The player is the brightest silhouette.** The bone hull has an ink keyline, a livery plate and a dark canopy.
5. **Hitboxes match visuals.** Bullet discs are drawn at about 1.0 times the hit radius, and bodies stay within their collision circle.
6. **Effects stay quiet.** Use few, large, flat shapes; no particle soup over bullets.
7. **Hits jolt, they don't flash white.** A hit floods the body with its role ink and kicks the colour plate out of register (`PLATE` 5 px on enemies, 6 px on bosses) for the flash frames.
8. **Nothing dims the playfield.** The vignette stays faint (edge alpha 0.18), set pieces print at 20% in play, and the boss-fight dialogue box sits at 60%.
9. **Run the colour-blind check after visual changes.** `node tools/cbcheck.js` plays a boss fight in each act and measures bullet core and ring contrast against the background under normal vision and simulated protanopia, deuteranopia and tritanopia (`cbCheck` in the devtest hook). It covers the open playfield only, not HUD bands, toasts or dialogue. Thresholds are core 4.5:1 and ring 1.6:1 at the 10th percentile.

## Type
- **Font:** one condensed grotesk stack, `Bahnschrift SemiCondensed`, then DIN Condensed, then Roboto Condensed (`FONT`).
- **Display sizes (17 and up):** slight tracking.
- **Headings** (`txt` with a shadow argument at size 20 and up): a hard ink drop shadow and printed rules either side, like `---- HANGAR ----`.

## UI devices
- **Cards and panels** (`panel`, `button`, side-panel `box`): dark paper with a hairline in the accent ink and a hard offset shadow block. Solid buttons are flat ink with a darker offset block.
- **Icons** (`hexIcon`): a double-ring stamp with a letter.
- **Rubber stamps** (`stampMark`, `stamps`): ISSUED on purchases, CLEARED or FLAWLESS on sector clear, LOST on game over. Use them for new "document" moments.
- **Transitions:** a halftone dot screen that shrinks away diagonally (`drawWipe`).
- **Sector map:** a printed star chart (`screenMap`). It has a framed coordinate grid, registration crosses and a vertical plate caption. Routes are plotted solid where cleared and dotted ahead, with dotted jump curves between acts. Node shapes encode the type: ring for a sector, diamond for a mini-boss, ringed disc for a boss, eight-point star for a finale. Cleared nodes carry a jade postmark tick, and the selected node gets a rotating reticle.
- **Set pieces** (`buildSet`): flat printed compositions with offset plates and halftone shading. Act I is a ring station, Act II a cratered planetoid and belt, Act III a black hole with a banded disk, Act IV a megastructure arc over a moon, and the finale and Endless a constructivist sunburst over a horizon.
- **Logo** (`mkLogo`): bone NOVA with an orange offset plate, a sky orbit swoosh and a mustard STRIKE ribbon with stars.

## Sound: "paper and press"
- **Shots:** soft bandpass ticks plus a quiet low triangle.
- **Hits:** paper flicks.
- **Explosions:** sine thumps under lowpassed noise.
- **UI:** stamp ticks (highpass noise). Purchases are a "ka-chunk".
- **Master:** a gentle 6.5 kHz roll-off for tape warmth.
- **Music bus:** a 2.6 kHz lowpass and a slow tape wow (a 0.32 Hz LFO, ±7 cents, on every music voice's detune). Hats and snares are bandpassed noise, not bright highpass hiss.
- **Avoid:** square-wave bleeps and sawtooth blasts in new SFX.
