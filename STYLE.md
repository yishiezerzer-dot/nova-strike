# Nova Strike style guide: "Mission Print"

The game looks like a 1970s space-agency print run: mission patches, star charts and field dispatches. It uses flat matte inks on dark paper stock, with no glow, no additive light and no gradients that pretend to be light. If a new visual would look at home on a neon synthwave poster, it is wrong for this game.

## Material rules
- **Ink, not light.** Never use `shadowBlur`, `'lighter'` blending or soft radial glows. The style layer turns them off globally.
- **Halftone dots replace glow.** `glow()` draws a solid core with a falling-off dot screen. Use it sparingly for blooms and big hits. Pickups and explosions do not glow.
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
1. **Vermilion means "this hurts you".** Enemy bullets are a vermilion disc with a small bone core, a thin ink keyline just outside the disc, and a faint vermilion halo, drawn after the effects. Keep the vermilion band at least about 3 px wide on small bullets. Only hazards (lasers, warnings, mines) share the ink. Boss inks are steered off it (`offV`), and pickups, UI decoration and effects never use it at full strength (pickup letters that would snap to it are printed orange instead).
2. **Player shots recede.** They are deep-blue streaks at about 60% alpha, with no bloom. They must never be brighter than the bullets they cross.
3. **Enemies are filled masses.** The body is a dark shade of the role ink, with a role-ink keyline and the offset plate. The silhouette carries the role; colour supports it.
4. **The player is the brightest silhouette.** The bone hull has an ink keyline, a livery plate and a dark canopy.
5. **Hitboxes match visuals.** Bullet discs are drawn at about 1.0 times the hit radius, and bodies stay within their collision circle.
6. **Effects stay quiet.** Use few, large, flat shapes; no particle soup over bullets. Explosions are one jagged blast (`drawBlasts`) on held frames at 14 fps: a bone pop with a colour plate, then an ink burst with a paper hole, then a ring of dots, plus 2 to 5 flat chunks that rotate in steps.
7. **Hits jolt, they don't flash white.** A hit floods the body with its role ink and kicks the colour plate out of register (`PLATE` 5 px on enemies, 6 px on bosses) for the flash frames.
8. **Nothing dims the playfield.** The vignette stays faint (edge alpha 0.18), set pieces print at 20% in play, and the boss-fight dialogue box sits at 60%.
9. **Run the colour-blind check after visual changes.** `node tools/cbcheck.js` plays a boss fight in each act and measures bullet core and ring contrast against the background under normal vision and simulated protanopia, deuteranopia and tritanopia (`cbCheck` in the devtest hook), once with standard bullets and once with high-contrast bullets. It also plants one of each pickup and checks the token edge against the background and its colour distance from vermilion. Then it plays wave sectors with each background archetype (nebula, rift, tunnel, gates, arcs, belt) and the eclipse, minefield and meteor events. It covers the open playfield only, not HUD bands, banners, toasts or dialogue, and skips bullets that overlap each other or sit on an enemy or boss body. Thresholds: bullet core 4.5:1 and ring 1.6:1 at the 10th percentile; pickup edge 3:1 and CIE76 distance 30 from vermilion for every pickup. In wave sectors only high-contrast bullets must pass; standard bullets over mid-tone backgrounds (gate lasers, banded planets) can dip just under 4.5:1 for protanopia and are reported as warnings. Green and mustard sit close to vermilion for red-green colour blindness, so keep them off anything that sits near bullets.
10. **High-contrast bullets** (setting, `SV.hcb`): the halo is dropped, the ink keyline is thicker and a bone outer ring is added. Player shots drop from 62% to 42% alpha so enemy fire stands further forward. The hitbox does not change; the bullet only looks slightly bigger.
11. **Reduced motion** (setting, `SV.rm`, defaults to the system `prefers-reduced-motion`): the boss poster cuts in and out without sliding and its rays hold still, rubber stamps land without the slam, and screen wipes become a plain fade. Shake and flashes keep their own settings.

## Type
- **Font:** one condensed grotesk stack, `Bahnschrift SemiCondensed`, then DIN Condensed, then Roboto Condensed (`FONT`).
- **Display sizes (17 and up):** slight tracking.
- **Headings** (`txt` with a shadow argument at size 20 and up): a hard ink drop shadow and printed rules either side, like `---- HANGAR ----`.

## UI devices
- **Cards and panels** (`panel`, `button`, side-panel `box`): dark paper with a hairline in the accent ink and a hard offset shadow block. Solid buttons are flat ink with a darker offset block.
- **Icons** (`hexIcon`): a double-ring stamp with a letter.
- **Pickups** (`drawPickup`): gems are small jade diamonds and power-ups are light plum four-point stars. Every other pickup is a printed token: a dark disc with an offset plate, a keyline in the rarity ink (jade uncommon, sky rare, light plum epic), an inner hairline and a letter. Rare tokens get a perforated stamp edge, and epic tokens also get four orbiting diamonds. A thin ring steps outward from each token to draw the eye.
- **Boss intro** (`drawPoster`): a full-screen mission poster slides down while the boss flies in. It has rays in the boss class ink, a double frame, a medallion with the real boss drawn large, a class stamp (WARNING, MINI BOSS, FINAL BOSS), the name with an offset plate, the title and threat pips. It is pulled away upward after about 2.2 s the first time each boss is met, and after about 1.1 s on later meetings and in Boss Rush (`SV.bseen`, `boss.pe`). Leftover enemy bullets are drawn on top of it.
- **Credit hauler** (`LV.shop`): a jade diamond token with an offset plate, an inner hairline and a diamond pulse stepping outward. It bobs in 2 px steps.
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
- **Jingles:** soft triangle and sine lines with a stamp "ka-chunk" (`SFX.stamp`) that lands with the on-screen stamp. Sector clear stamps at 0.55 s, game over at 0.7 s with a drooping "tape stop" melody, achievements are a stamp plus a two-note bell, and the win is an arpeggio over a held sine chord. The boss poster stamp uses the same thump.
- **Warnings and cues:** the alarm, gate warning, combo, hurt, bomb, beam and boss stinger, and the enemy telegraph tones (sniper, lancer, warden, hive), are triangle and sine voices with bandpassed ticks. They keep their old pitches and timing so they still read as cues.
- **Avoid:** square-wave bleeps and sawtooth blasts. The only sawtooth left is the music bass, which runs through the 2.6 kHz music lowpass.
