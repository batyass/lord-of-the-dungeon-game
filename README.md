# Lord of the Dungeon — playable web build

The Godot 4.7 Web export of **Lord of the Dungeon**, published with GitHub Pages.

Play: https://batyass.github.io/lord-of-the-dungeon-game/

The game pack (`index.pck`, ~132 MB) is split into parts under GitHub's 100 MB
per-file limit. `sw.js` streams the parts back as a single `index.pck` response,
so the stock Godot loader needs no changes beyond registering the worker.

Built from the project repository with `npm run game:host`.
