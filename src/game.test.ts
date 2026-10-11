import { describe, expect, it } from "vitest";
import { CARD_H, CARD_W, FOUNDATION_X, TOP_ROW_Y } from "./constants";
import { game, type CascadeDebugApi, type CascadeState } from "./game";

function setup(): [CascadeState, CascadeDebugApi] {
  return game.initialize({
    input: { register: () => undefined, layout: () => null },
    audio: {
      define: () => undefined,
      load: async () => undefined,
    },
    assets: {
      loadImage: async () => ({}) as ImageBitmap,
      loadAudio: async () => ({}) as AudioBuffer,
      load: async () => new Blob(),
      resolve: (path: string) => path,
    },
    diagnostics: { register: () => undefined },
    events: { on: () => () => undefined },
    viewport: () => ({
      width: 1280,
      height: 720,
      scale: 1,
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 0,
      dpr: 1,
    }),
  }) as [CascadeState, CascadeDebugApi];
}

describe("Cascade rules", () => {
  it("deals Klondike tableau and stock", () => {
    const [state, debug] = setup();
    const dealt = debug.deal(state);
    const snap = debug.snapshot(dealt);

    expect(snap.tableau.map((pile) => pile.length)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
    expect(snap.tableau.every((pile) => pile[pile.length - 1]?.faceUp)).toBe(
      true,
    );
    expect(snap.tableau.flat().filter((card) => card.faceUp)).toHaveLength(7);
    expect(snap.stock).toHaveLength(24);
    expect(snap.waste).toHaveLength(0);
    expect(
      new Set([...snap.stock, ...snap.tableau.flat()].map((c) => c.id)).size,
    ).toBe(52);
  });

  it("turns draw-three waste sets and recycles in order", () => {
    const [state, debug] = setup();
    let s = debug.addCard(state, "stock", 0, "spades", 1, false);
    s = debug.addCard(s, "stock", 0, "hearts", 2, false);
    s = debug.addCard(s, "stock", 0, "clubs", 3, false);
    s = debug.addCard(s, "stock", 0, "diamonds", 4, false);

    s = debug.turnStock(s);
    expect(debug.snapshot(s).wasteSets).toEqual([3]);
    expect(debug.snapshot(s).waste.map((card) => card.rank)).toEqual([4, 3, 2]);

    s = debug.turnStock(s);
    expect(debug.snapshot(s).wasteSets).toEqual([3, 1]);
    expect(debug.snapshot(s).wasteVisibleCount).toBe(1);

    s = debug.turnStock(s);
    expect(debug.snapshot(s).stock.map((card) => card.rank)).toEqual([
      1, 2, 3, 4,
    ]);
    const recycledStock = debug.snapshot(s).stock;
    expect(recycledStock[recycledStock.length - 1]?.rank).toBe(4);
    expect(debug.snapshot(s).wasteSets).toEqual([]);
  });

  it("moves cards by foundation and tableau rules", () => {
    const [state, debug] = setup();
    let s = debug.addCard(state, "tableau", 0, "hearts", 1, true);
    s = debug.addCard(s, "tableau", 1, "spades", 13, true);
    s = debug.addCard(s, "tableau", 2, "hearts", 12, true);

    let accepted = debug.move(s, "tableau", 0, 0, "foundation", 0);
    expect(accepted[1]).toBe(true);
    expect(
      debug.snapshot(accepted[0]).foundations[0].map((c) => c.rank),
    ).toEqual([1]);

    accepted = debug.move(accepted[0], "tableau", 2, 0, "tableau", 1);
    expect(accepted[1]).toBe(true);
    expect(debug.snapshot(accepted[0]).tableau[1].map((c) => c.rank)).toEqual([
      13, 12,
    ]);
  });

  it("launches victory cascade flyers without moving them on launch frame", () => {
    const [state, debug] = setup();
    let s = debug.setScreen(state, "won");
    s = debug.setLaunchClock(s, 0.18);
    s = debug.addCard(s, "foundation", 0, "spades", 1, true);

    const fakeApi = {
      input: {
        pressed: () => false,
        pointerSamples: () => [],
      },
      audio: {
        play: () => undefined,
        muted: () => false,
        setMuted: () => undefined,
      },
    } as unknown as Parameters<typeof game.update>[1];

    const next = game.update(s, fakeApi, 0);
    const flyer = debug.snapshot(next).flyers[0];
    expect(flyer.x).toBe(FOUNDATION_X[0]);
    expect(flyer.y).toBe(TOP_ROW_Y);
    expect(flyer.vy).toBeLessThan(0);
    expect(flyer.x + CARD_W).toBeGreaterThan(0);
    expect(flyer.y + CARD_H).toBeGreaterThan(0);
  });
});
