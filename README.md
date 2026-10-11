# Cascade

Cascade is a browser Klondike solitaire built on the Simple 2D engine. It plays
Draw Three: the stock turns up to three cards at a time, the waste fans the
current set, and only the front card can be played.

The goal is the classic one: build the four foundations from Ace to King by
suit. Tableau columns build downward in alternating colors, empty columns accept
Kings, and a completed game ends with Cascade's card-launching victory shower.

## Install

```sh
npm ci
```

## Development

```sh
npm run dev
```

Vite serves the game locally and rebuilds as files change.

## Production Build

```sh
npm run build
```

The static site is written to `dist/` and can be served from any static host.

## Controls

Use a mouse or touch pointer to drag cards and runs. Click the stock to turn
cards; click it again when empty to recycle the waste. Double-click a playable
waste card or exposed tableau card to send it to its foundation when legal.

Menus and HUD controls can also be driven with the keyboard:

- `ArrowUp` / `W`: previous item
- `ArrowDown` / `S`: next item
- `Enter` / `Space`: confirm
- `Escape`: back from How To Play

The HUD contains `NEW GAME`, `MENU`, and `SOUND`.
