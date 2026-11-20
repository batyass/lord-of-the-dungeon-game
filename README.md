# Lord of the Dungeon — playable web build

The Godot 4.7 Web export of *Lord of the Dungeon*, published with GitHub Pages:

<https://batyass.github.io/lord-of-the-dungeon-game/index.html>

The showcase site embeds this page in an iframe:
<https://github.com/batyass/lord-of-the-dungeon>.

## Why the files look like this

Godot emits a single `index.pck` (~132 MB), over GitHub's 100 MB per-file limit.
`index.pck.part1`–`part3` hold it split; `sw.js` streams them back as one
`index.pck` response so the engine can read the pack without loading it into
memory. Browsers that block a service worker in a third-party iframe get a Blob
URL built from the same parts.

## Regenerating

From the game project:

```sh
/Applications/Godot.app/Contents/MacOS/Godot --headless --path . \
  --export-release "Web" public/game/index.html
bun run game:host      # rebuilds this directory
git commit -am "Update web build" && git push
```

This repository holds only generated files; do not edit them by hand.
