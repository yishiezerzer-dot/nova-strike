# Nova Strike

A vertical shoot-'em-up roguelite in a single HTML file, styled like a 1970s space-agency print run.

**Play it here: https://yishiezerzer-dot.github.io/nova-strike/**

It runs in any modern browser on desktop or phone. Nothing to install, no account, no ads.

## How to play
Fly through sectors of enemy waves, pick up weapons and perks, and beat the boss at the end of each act. Your ship fires automatically, so you just steer and dodge. Red-orange shots are enemy fire; everything else is safe to touch. Gems you collect buy permanent upgrades in the Hangar between runs.

| | Desktop | Phone / tablet |
|---|---|---|
| Move | Mouse, or WASD / arrow keys | Drag anywhere on the screen |
| Fire | Automatic | Automatic |
| Bomb (clears bullets) | Right click, Space or B | Bomb button, bottom right |
| Pause | Esc or P | Pause button, top left |
| Mute | M, or the speaker icon | Speaker icon |
| Fullscreen | F, or the fullscreen icon | Fullscreen icon |

On phones it plays best in portrait. Adding it to the home screen gives it the whole screen.

## Modes
- **Campaign:** four acts and 20 sectors. Choose your route on the star chart, with mini-bosses, act bosses and events along the way.
- **Endless:** opens after the campaign, with rotating mutators every ten sectors.
- **Daily run:** one seeded run a day, the same for everyone.
- **Weekly challenge and challenge runs:** fixed loadouts and rules.
- **Boss Rush:** every boss back to back against the clock.

## Settings and accessibility
Settings are on the title screen, and most of them are also in the pause menu.
- Music and sound effects on or off.
- Screen shake: full, low or off.
- Flashes: full, soft or off.
- Graphics quality: automatic, or set by hand.
- Damage numbers on or off.
- **High-contrast bullets:** a thicker dark outline and a light outer ring on enemy fire. It is checked against simulated red-, green- and blue-blind vision.
- **Reduced motion:** follows your device setting by default.

## Saves
Progress saves automatically in your browser, on that device and in that browser only. Clearing site data deletes it. Settings has a two-step **Reset all data** if you want to start over.

## Playing offline
Download `index.html` and open it in a browser. It works without an internet connection. Saves from the offline copy are kept apart from the website's.

## For developers
- Everything is in `index.html`: plain JavaScript and Canvas 2D, with no build step and no dependencies.
- `STYLE.md` is the art, colour, readability and sound guide.
- `tools/cbcheck.js` is a colour-blind contrast check for bullets and pickups. It needs Node and Playwright: `node tools/cbcheck.js`.
- Opening the file locally with `#devtest` on the URL turns on a test hook (`window.__ns`). It is off on the website.
