import type {
  Game,
  InitApi,
  PointerSample,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import * as K from "./constants";

export type Screen = "title" | "howto" | "playing" | "won";
export type Suit = "spades" | "hearts" | "diamonds" | "clubs";
export type PileKind = "stock" | "waste" | "foundation" | "tableau";

export interface CardState {
  readonly id: number;
  readonly suit: Suit;
  readonly rank: number;
  readonly faceUp: boolean;
}
export interface DragState {
  readonly cards: readonly CardState[];
  readonly fromPile: "waste" | "foundation" | "tableau";
  readonly fromIndex: number;
  readonly x: number;
  readonly y: number;
}
export interface DropTargetState {
  readonly pile: "foundation" | "tableau";
  readonly index: number;
}
export interface PointerState {
  readonly x: number;
  readonly y: number;
  readonly down: boolean;
}
export interface PressState {
  readonly x: number;
  readonly y: number;
  readonly at: number;
}
export interface FlyerState {
  readonly id: number;
  readonly suit: Suit;
  readonly rank: number;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
}
export interface CascadeState {
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly stock: readonly CardState[];
  readonly waste: readonly CardState[];
  readonly wasteSets: readonly number[];
  readonly foundations: readonly (readonly CardState[])[];
  readonly tableau: readonly (readonly CardState[])[];
  readonly drag: DragState | null;
  readonly dropTarget: DropTargetState | null;
  readonly pointer: PointerState;
  readonly lastPress: PressState | null;
  readonly autoFlip: boolean;
  readonly winDetect: boolean;
  readonly launching: boolean;
  readonly trailPainting: boolean;
  readonly launchClock: number;
  readonly launched: number;
  readonly flyers: readonly FlyerState[];
  readonly cascadeDone: boolean;
  readonly trailStamps: number;
  readonly nextId: number;
  readonly simTime: number;
  readonly muted: boolean;
}

type CardPile = "stock" | "waste" | "foundation" | "tableau";
type MovePile = "waste" | "foundation" | "tableau";
type Color = "red" | "black";
interface Rect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}
interface SnapshotCard extends CardState {
  readonly color: Color;
}
interface CascadeSnapshot {
  readonly version: 1;
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly dealMode: string;
  readonly turnCount: number;
  readonly dealModeLabel: string;
  readonly muted: boolean;
  readonly autoFlip: boolean;
  readonly winDetect: boolean;
  readonly launching: boolean;
  readonly trailPainting: boolean;
  readonly stock: readonly SnapshotCard[];
  readonly waste: readonly SnapshotCard[];
  readonly wasteSets: readonly number[];
  readonly wasteVisibleCount: number;
  readonly foundations: readonly (readonly SnapshotCard[])[];
  readonly tableau: readonly (readonly SnapshotCard[])[];
  readonly drag:
    | null
    | (Omit<DragState, "cards"> & { readonly cards: readonly SnapshotCard[] });
  readonly dropTarget: DropTargetState | null;
  readonly pointer: PointerState;
  readonly lastPress: PressState | null;
  readonly launchClock: number;
  readonly launched: number;
  readonly flyers: readonly FlyerState[];
  readonly cascadeDone: boolean;
  readonly trailStamps: number;
  readonly simTime: number;
}
export interface CascadeDebugApi {
  readonly version: 1;
  reset(s: DeepReadonly<CascadeState>): CascadeState;
  snapshot(s: DeepReadonly<CascadeState>): CascadeSnapshot;
  reconcile(s: DeepReadonly<CascadeState>): CascadeState;
  menuItemRect(s: DeepReadonly<CascadeState>, index: number): Rect | null;
  setScreen(s: DeepReadonly<CascadeState>, screen: Screen): CascadeState;
  setMenuIndex(s: DeepReadonly<CascadeState>, index: number): CascadeState;
  setTitleIndex(s: DeepReadonly<CascadeState>, index: number): CascadeState;
  addCard(
    s: DeepReadonly<CascadeState>,
    pile: CardPile,
    index: number,
    suit: Suit,
    rank: number,
    faceUp: boolean,
  ): CascadeState;
  removeCard(s: DeepReadonly<CascadeState>, id: number): CascadeState;
  setCardFaceUp(
    s: DeepReadonly<CascadeState>,
    id: number,
    faceUp: boolean,
  ): CascadeState;
  clearPile(
    s: DeepReadonly<CascadeState>,
    pile: CardPile,
    index: number,
  ): CascadeState;
  clearTable(s: DeepReadonly<CascadeState>): CascadeState;
  addWasteSet(s: DeepReadonly<CascadeState>, count: number): CascadeState;
  clearWasteSets(s: DeepReadonly<CascadeState>): CascadeState;
  deal(s: DeepReadonly<CascadeState>): CascadeState;
  turnStock(s: DeepReadonly<CascadeState>): CascadeState;
  move(
    s: DeepReadonly<CascadeState>,
    fromPile: MovePile,
    fromIndex: number,
    fromRow: number,
    toPile: "foundation" | "tableau",
    toIndex: number,
  ): [CascadeState, boolean];
  autoMove(
    s: DeepReadonly<CascadeState>,
    pile: CardPile,
    index: number,
  ): [CascadeState, boolean];
  pointerDown(
    s: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  pointerMove(
    s: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  pointerUp(s: DeepReadonly<CascadeState>, x: number, y: number): CascadeState;
  setAutoFlip(s: DeepReadonly<CascadeState>, enabled: boolean): CascadeState;
  setWinDetect(s: DeepReadonly<CascadeState>, enabled: boolean): CascadeState;
  setLaunching(s: DeepReadonly<CascadeState>, enabled: boolean): CascadeState;
  setTrailPainting(
    s: DeepReadonly<CascadeState>,
    enabled: boolean,
  ): CascadeState;
  addFlyer(
    s: DeepReadonly<CascadeState>,
    suit: Suit,
    rank: number,
    x: number,
    y: number,
    vx: number,
    vy: number,
  ): CascadeState;
  setFlyerPosition(
    s: DeepReadonly<CascadeState>,
    id: number,
    x: number,
    y: number,
  ): CascadeState;
  setFlyerVelocity(
    s: DeepReadonly<CascadeState>,
    id: number,
    vx: number,
    vy: number,
  ): CascadeState;
  removeFlyer(s: DeepReadonly<CascadeState>, id: number): CascadeState;
  clearFlyers(s: DeepReadonly<CascadeState>): CascadeState;
  setLaunchClock(s: DeepReadonly<CascadeState>, seconds: number): CascadeState;
  clearTrail(s: DeepReadonly<CascadeState>): CascadeState;
  drawLaunchVx(): number;
}

export const BACKGROUND = "#14533f";
const CREAM = "#fff8e8";
const GOLD = "#e8c76b";
const RED = "#b72d3a";
const BLACK = "#222832";

const color = (suit: Suit): Color =>
  suit === "hearts" || suit === "diamonds" ? "red" : "black";
const cardSnap = (card: DeepReadonly<CardState>): SnapshotCard => ({
  ...card,
  color: color(card.suit),
});
const inside = (r: Rect, x: number, y: number): boolean =>
  x >= r.x && y >= r.y && x <= r.x + r.w && y <= r.y + r.h;
const rank = (n: number): string =>
  ({ 1: "A", 11: "J", 12: "Q", 13: "K" })[n] ?? String(n);
const suitGlyph = (s: Suit): string =>
  ({ spades: "♠", hearts: "♥", diamonds: "♦", clubs: "♣" })[s];

function base(muted = false): CascadeState {
  return {
    screen: "title",
    menuIndex: 0,
    titleIndex: 0,
    stock: [],
    waste: [],
    wasteSets: [],
    foundations: Array.from({ length: K.FOUNDATION_COUNT }, () => []),
    tableau: Array.from({ length: K.TABLEAU_COLUMNS }, () => []),
    drag: null,
    dropTarget: null,
    pointer: { x: 0, y: 0, down: false },
    lastPress: null,
    autoFlip: true,
    winDetect: true,
    launching: true,
    trailPainting: true,
    launchClock: 0,
    launched: 0,
    flyers: [],
    cascadeDone: false,
    trailStamps: 0,
    nextId: 1,
    simTime: 0,
    muted,
  };
}

function copy(s: DeepReadonly<CascadeState>): CascadeState {
  return {
    ...s,
    stock: [...s.stock],
    waste: [...s.waste],
    wasteSets: [...s.wasteSets],
    foundations: s.foundations.map((p) => [...p]),
    tableau: s.tableau.map((p) => [...p]),
    drag: s.drag ? { ...s.drag, cards: [...s.drag.cards] } : null,
    dropTarget: s.dropTarget ? { ...s.dropTarget } : null,
    pointer: { ...s.pointer },
    lastPress: s.lastPress ? { ...s.lastPress } : null,
    flyers: s.flyers.map((f) => ({ ...f })),
  };
}

function fullDeck(): CardState[] {
  let id = 1;
  return K.SUITS.flatMap((suit) =>
    Array.from({ length: K.RANK_MAX }, (_, i) => ({
      id: id++,
      suit,
      rank: i + 1,
      faceUp: false,
    })),
  );
}
function shuffle(cards: readonly CardState[]): CardState[] {
  const a = [...cards];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function deal(s: DeepReadonly<CascadeState>): CascadeState {
  const cards = shuffle(fullDeck());
  const tableau: CardState[][] = Array.from(
    { length: K.TABLEAU_COLUMNS },
    () => [],
  );
  let at = 0;
  for (let c = 0; c < K.TABLEAU_COLUMNS; c += 1) {
    for (let r = 0; r <= c; r += 1)
      tableau[c].push({ ...cards[at++], faceUp: r === c });
  }
  return {
    ...copy(s),
    stock: cards.slice(at).map((c) => ({ ...c, faceUp: false })),
    waste: [],
    wasteSets: [],
    foundations: Array.from({ length: K.FOUNDATION_COUNT }, () => []),
    tableau,
    drag: null,
    dropTarget: null,
    launchClock: 0,
    launched: 0,
    flyers: [],
    cascadeDone: false,
    trailStamps: 0,
    nextId: K.DECK_SIZE + 1,
  };
}

function turnStock(s: DeepReadonly<CascadeState>): CascadeState {
  if (s.stock.length > 0) {
    const stock = [...s.stock];
    const moved: CardState[] = [];
    for (let i = 0; i < K.TURN_COUNT && stock.length > 0; i += 1)
      moved.push({ ...stock.pop()!, faceUp: true });
    return {
      ...copy(s),
      stock,
      waste: [...s.waste, ...moved],
      wasteSets: [...s.wasteSets, moved.length],
    };
  }
  if (s.waste.length === 0) return copy(s);
  return {
    ...copy(s),
    stock: [...s.waste].reverse().map((c) => ({ ...c, faceUp: false })),
    waste: [],
    wasteSets: [],
  };
}
const visibleWaste = (s: DeepReadonly<CascadeState>): number =>
  s.wasteSets.length ? s.wasteSets[s.wasteSets.length - 1] : 0;
const decWaste = (sets: readonly number[]): readonly number[] => {
  const a = [...sets];
  for (let i = a.length - 1; i >= 0; i -= 1)
    if (a[i] > 0) {
      a[i] -= 1;
      return a.filter((n) => n > 0);
    }
  return [];
};
function validRun(cards: readonly CardState[]): boolean {
  return (
    cards.length > 0 &&
    cards.every(
      (card, i) =>
        i === 0 ||
        (card.rank === cards[i - 1].rank - 1 &&
          color(card.suit) !== color(cards[i - 1].suit)),
    )
  );
}
function acceptFoundation(
  pile: readonly CardState[],
  cards: readonly CardState[],
): boolean {
  if (cards.length !== 1) return false;
  const top = pile.length ? pile[pile.length - 1] : undefined;
  return top
    ? cards[0].suit === top.suit && cards[0].rank === top.rank + 1
    : cards[0].rank === 1;
}
function acceptTableau(
  pile: readonly CardState[],
  cards: readonly CardState[],
): boolean {
  if (!validRun(cards)) return false;
  const top = pile.length ? pile[pile.length - 1] : undefined;
  return top
    ? top.faceUp &&
        cards[0].rank === top.rank - 1 &&
        color(cards[0].suit) !== color(top.suit)
    : cards[0].rank === K.RANK_MAX;
}
function accepts(
  s: DeepReadonly<CascadeState>,
  t: DropTargetState,
  cards: readonly CardState[],
): boolean {
  return t.pile === "foundation"
    ? acceptFoundation(s.foundations[t.index] ?? [], cards)
    : acceptTableau(s.tableau[t.index] ?? [], cards);
}

function removeSource(
  s: CascadeState,
  pile: MovePile,
  index: number,
  row: number,
): [CascadeState, readonly CardState[]] {
  if (pile === "waste") {
    if (index !== 0 || row !== s.waste.length - 1) return [s, []];
    return [{ ...s, waste: s.waste.slice(0, -1) }, [s.waste[row]]];
  }
  if (pile === "foundation") {
    const p = s.foundations[index];
    if (!p || row !== p.length - 1) return [s, []];
    return [
      {
        ...s,
        foundations: s.foundations.map((x, i) =>
          i === index ? x.slice(0, -1) : x,
        ),
      },
      [p[row]],
    ];
  }
  const p = s.tableau[index];
  if (!p || row < 0 || row >= p.length || !p[row].faceUp) return [s, []];
  return [
    {
      ...s,
      tableau: s.tableau.map((x, i) => (i === index ? x.slice(0, row) : x)),
    },
    p.slice(row),
  ];
}
function appendTarget(
  s: CascadeState,
  t: DropTargetState,
  cards: readonly CardState[],
): CascadeState {
  return t.pile === "foundation"
    ? {
        ...s,
        foundations: s.foundations.map((p, i) =>
          i === t.index ? [...p, ...cards] : p,
        ),
      }
    : {
        ...s,
        tableau: s.tableau.map((p, i) =>
          i === t.index ? [...p, ...cards] : p,
        ),
      };
}
function flip(
  s: CascadeState,
  pile: MovePile,
  index: number,
): [CascadeState, boolean] {
  const column = s.tableau[index];
  const card =
    pile === "tableau" && column?.length
      ? column[column.length - 1]
      : undefined;
  if (!s.autoFlip || !card || card.faceUp) return [s, false];
  return [
    {
      ...s,
      tableau: s.tableau.map((p, i) =>
        i === index ? [...p.slice(0, -1), { ...card, faceUp: true }] : p,
      ),
    },
    true,
  ];
}
function win(s: CascadeState): CascadeState {
  const total = s.foundations.reduce((n, p) => n + p.length, 0);
  return s.winDetect && total === K.DECK_SIZE
    ? {
        ...s,
        screen: "won",
        launchClock: K.LAUNCH_INTERVAL,
        drag: null,
        dropTarget: null,
        cascadeDone: false,
      }
    : s;
}
function move(
  s: DeepReadonly<CascadeState>,
  fromPile: MovePile,
  fromIndex: number,
  fromRow: number,
  toPile: "foundation" | "tableau",
  toIndex: number,
): [CascadeState, boolean, readonly string[]] {
  const start = copy(s);
  const [cut, cards] = removeSource(start, fromPile, fromIndex, fromRow);
  const target = { pile: toPile, index: toIndex };
  if (cards.length === 0 || !accepts(cut, target, cards))
    return [start, false, []];
  let next = appendTarget(cut, target, cards);
  if (fromPile === "waste")
    next = { ...next, wasteSets: decWaste(next.wasteSets) };
  const [flipped, didFlip] = flip(next, fromPile, fromIndex);
  next = win(flipped);
  return [
    next,
    true,
    [
      K.CUES.drop,
      ...(toPile === "foundation" ? [K.CUES.home] : []),
      ...(didFlip ? [K.CUES.flip] : []),
      ...(next.screen === "won" ? [K.CUES.win] : []),
    ],
  ];
}
function autoMove(
  s: DeepReadonly<CascadeState>,
  pile: CardPile,
  index: number,
): [CascadeState, boolean, readonly string[]] {
  if (pile !== "waste" && pile !== "tableau") return [copy(s), false, []];
  const source = pile === "waste" ? s.waste : (s.tableau[index] ?? []);
  const card = source.length ? source[source.length - 1] : undefined;
  if (!card || !card.faceUp) return [copy(s), false, []];
  const target = s.foundations.findIndex((p) => acceptFoundation(p, [card]));
  return target < 0
    ? [copy(s), false, []]
    : move(s, pile, index, source.length - 1, "foundation", target);
}

function columnYs(col: readonly CardState[]): readonly number[] {
  if (col.length === 0) return [];
  const offsets = col
    .slice(0, -1)
    .map((c) => (c.faceUp ? K.FACE_UP_OFFSET : K.FACE_DOWN_OFFSET));
  const natural = K.TABLEAU_Y + offsets.reduce((a, b) => a + b, 0) + K.CARD_H;
  let up = K.FACE_UP_OFFSET;
  if (natural > K.COLUMN_BOTTOM_LIMIT) {
    const fixed = offsets
      .filter((_, i) => !col[i].faceUp)
      .reduce((a, b) => a + b, 0);
    const ups = offsets.filter((_, i) => col[i].faceUp).length;
    if (ups > 0)
      up = Math.max(
        K.FACE_UP_OFFSET_MIN,
        (K.COLUMN_BOTTOM_LIMIT - K.TABLEAU_Y - K.CARD_H - fixed) / ups,
      );
  }
  const ys = [K.TABLEAU_Y];
  for (let i = 0; i < col.length - 1; i += 1)
    ys.push(ys[i] + (col[i].faceUp ? up : K.FACE_DOWN_OFFSET));
  return ys;
}
function columnRect(s: DeepReadonly<CascadeState>, i: number): Rect {
  const ys = columnYs(s.tableau[i] ?? []);
  return {
    x: K.COLUMN_X[i],
    y: K.TABLEAU_Y,
    w: K.CARD_W,
    h: (ys.length ? ys[ys.length - 1] : K.TABLEAU_Y) + K.CARD_H - K.TABLEAU_Y,
  };
}
function pileAt(
  s: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): { pile: CardPile; index: number } | null {
  const top = [
    { pile: "stock" as const, index: 0, x: K.STOCK_X },
    { pile: "waste" as const, index: 0, x: K.WASTE_X },
    ...K.FOUNDATION_X.map((fx, index) => ({
      pile: "foundation" as const,
      index,
      x: fx,
    })),
  ];
  for (const p of top)
    if (inside({ x: p.x, y: K.TOP_ROW_Y, w: K.CARD_W, h: K.CARD_H }, x, y))
      return { pile: p.pile, index: p.index };
  for (let i = 0; i < K.TABLEAU_COLUMNS; i += 1)
    if (inside(columnRect(s, i), x, y)) return { pile: "tableau", index: i };
  return null;
}
function targetFor(
  s: DeepReadonly<CascadeState>,
  drag: DeepReadonly<DragState> | null,
): DropTargetState | null {
  if (!drag) return null;
  const p = pileAt(s, drag.x + K.CARD_W / 2, drag.y + K.CARD_H / 2);
  if (!p || (p.pile !== "foundation" && p.pile !== "tableau")) return null;
  const target = { pile: p.pile, index: p.index } as DropTargetState;
  return accepts(s, target, drag.cards) ? target : null;
}
function menuItems(screen: Screen): readonly string[] {
  if (screen === "title") return K.TITLE_ITEMS;
  if (screen === "howto") return [K.HOWTO_BACK_LABEL];
  if (screen === "playing") return K.HUD_ITEMS;
  return [];
}
function menuRect(screen: Screen, i: number): Rect | null {
  if (i < 0 || i >= menuItems(screen).length) return null;
  if (screen === "title") return { x: 510, y: 368 + i * 58, w: 260, h: 44 };
  if (screen === "howto") return { x: 554, y: 608, w: 172, h: 44 };
  if (screen === "playing")
    return { x: 24 + i * 154, y: K.HUD_Y + 4, w: 138, h: K.HUD_H - 8 };
  return null;
}
function menuAt(screen: Screen, x: number, y: number): number | null {
  for (let i = 0; i < menuItems(screen).length; i += 1)
    if (inside(menuRect(screen, i)!, x, y)) return i;
  return null;
}
function activate(
  s: DeepReadonly<CascadeState>,
  i: number,
): [CascadeState, readonly string[]] {
  if (s.screen === "title" && i === 0)
    return [
      { ...deal(s), screen: "playing", titleIndex: 0, menuIndex: 0 },
      [K.CUES.deal],
    ];
  if (s.screen === "title" && i === 1)
    return [{ ...copy(s), screen: "howto", titleIndex: 1, menuIndex: 0 }, []];
  if (s.screen === "howto")
    return [{ ...copy(s), screen: "title", menuIndex: s.titleIndex }, []];
  if (s.screen === "playing" && i === 0)
    return [{ ...deal(s), screen: "playing", menuIndex: 0 }, [K.CUES.deal]];
  if (s.screen === "playing" && i === 1)
    return [{ ...copy(s), screen: "title", menuIndex: s.titleIndex }, []];
  return [copy(s), []];
}
function hitCard(
  s: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): null | { pile: MovePile; index: number; row: number; x: number; y: number } {
  for (let c = K.TABLEAU_COLUMNS - 1; c >= 0; c -= 1) {
    const ys = columnYs(s.tableau[c] ?? []);
    for (let r = (s.tableau[c]?.length ?? 0) - 1; r >= 0; r -= 1)
      if (
        inside({ x: K.COLUMN_X[c], y: ys[r], w: K.CARD_W, h: K.CARD_H }, x, y)
      )
        return {
          pile: "tableau",
          index: c,
          row: r,
          x: K.COLUMN_X[c],
          y: ys[r],
        };
  }
  for (let i = 0; i < K.FOUNDATION_COUNT; i += 1)
    if (
      s.foundations[i]?.length &&
      inside(
        { x: K.FOUNDATION_X[i], y: K.TOP_ROW_Y, w: K.CARD_W, h: K.CARD_H },
        x,
        y,
      )
    )
      return {
        pile: "foundation",
        index: i,
        row: s.foundations[i].length - 1,
        x: K.FOUNDATION_X[i],
        y: K.TOP_ROW_Y,
      };
  const visible = visibleWaste(s);
  const start = Math.max(0, s.waste.length - visible);
  for (let r = s.waste.length - 1; r >= start; r -= 1)
    if (
      inside(
        {
          x: K.WASTE_X + (r - start) * K.WASTE_FAN,
          y: K.TOP_ROW_Y,
          w: K.CARD_W,
          h: K.CARD_H,
        },
        x,
        y,
      )
    )
      return {
        pile: "waste",
        index: 0,
        row: r,
        x: K.WASTE_X + (r - start) * K.WASTE_FAN,
        y: K.TOP_ROW_Y,
      };
  return null;
}
function pointerDown(
  s: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): [CascadeState, readonly string[]] {
  let next = {
    ...copy(s),
    pointer: { x, y, down: true },
    lastPress: { x, y, at: s.simTime },
  };
  const mi = menuAt(next.screen, x, y);
  if (mi !== null) next = { ...next, menuIndex: mi };
  if (next.screen === "won")
    return [{ ...deal(next), screen: "playing", menuIndex: 0 }, [K.CUES.deal]];
  if (next.screen !== "playing") return [next, []];
  const hit = hitCard(next, x, y);
  const source =
    hit?.pile === "waste"
      ? next.waste
      : hit?.pile === "foundation"
        ? next.foundations[hit.index]
        : hit
          ? next.tableau[hit.index]
          : [];
  const card = hit ? source[hit.row] : undefined;
  const dbl =
    hit &&
    card?.faceUp &&
    s.lastPress &&
    s.simTime - s.lastPress.at <= K.DOUBLE_CLICK_WINDOW &&
    Math.hypot(x - s.lastPress.x, y - s.lastPress.y) <= K.DOUBLE_CLICK_SLOP &&
    (hit.pile === "waste" ||
      (hit.pile === "tableau" && hit.row === source.length - 1));
  if (dbl) {
    const [n, , cues] = autoMove(next, hit.pile, hit.index);
    return [{ ...n, lastPress: next.lastPress, pointer: next.pointer }, cues];
  }
  if (
    !hit ||
    !card?.faceUp ||
    (hit.pile === "waste" && hit.row !== next.waste.length - 1)
  )
    return [next, []];
  const [cut, cards] = removeSource(next, hit.pile, hit.index, hit.row);
  const drag = {
    cards,
    fromPile: hit.pile,
    fromIndex: hit.index,
    x: hit.x,
    y: hit.y,
  };
  const withDrag = { ...cut, drag };
  return [
    { ...withDrag, dropTarget: targetFor(withDrag, drag) },
    [K.CUES.lift],
  ];
}
function pointerMove(
  s: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): CascadeState {
  let next = { ...copy(s), pointer: { x, y, down: s.pointer.down } };
  const mi = menuAt(next.screen, x, y);
  if (mi !== null) next = { ...next, menuIndex: mi };
  if (!next.drag || !s.lastPress) return next;
  const drag = {
    ...next.drag,
    x: next.drag.x + x - s.lastPress.x,
    y: next.drag.y + y - s.lastPress.y,
  };
  return { ...next, drag, dropTarget: targetFor(next, drag) };
}
function restore(s: DeepReadonly<CascadeState>): CascadeState {
  if (!s.drag) return copy(s);
  if (s.drag.fromPile === "waste")
    return {
      ...copy(s),
      waste: [...s.waste, ...s.drag.cards],
      drag: null,
      dropTarget: null,
    };
  if (s.drag.fromPile === "foundation")
    return {
      ...copy(s),
      foundations: s.foundations.map((p, i) =>
        i === s.drag?.fromIndex ? [...p, ...s.drag.cards] : p,
      ),
      drag: null,
      dropTarget: null,
    };
  return {
    ...copy(s),
    tableau: s.tableau.map((p, i) =>
      i === s.drag?.fromIndex ? [...p, ...s.drag.cards] : p,
    ),
    drag: null,
    dropTarget: null,
  };
}
function pointerUp(
  s: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): [CascadeState, readonly string[]] {
  let next = { ...copy(s), pointer: { x, y, down: false } };
  const a = s.lastPress ? menuAt(s.screen, s.lastPress.x, s.lastPress.y) : null;
  const b = menuAt(s.screen, x, y);
  if (b !== null) next = { ...next, menuIndex: b };
  if (a !== null && a === b) return activate(next, b);
  const click =
    s.lastPress &&
    Math.hypot(x - s.lastPress.x, y - s.lastPress.y) <= K.DRAG_THRESHOLD;
  if (click) {
    const r = restore(next);
    if (
      inside(
        { x: K.STOCK_X, y: K.TOP_ROW_Y, w: K.CARD_W, h: K.CARD_H },
        s.lastPress!.x,
        s.lastPress!.y,
      )
    )
      return [
        turnStock(r),
        r.stock.length ? [K.CUES.turn] : r.waste.length ? [K.CUES.recycle] : [],
      ];
    return [r, []];
  }
  if (!next.drag) return [next, []];
  const target = targetFor(next, next.drag);
  if (!target) return [restore(next), [K.CUES.reject]];
  let moved = appendTarget(next, target, next.drag.cards);
  if (next.drag.fromPile === "waste")
    moved = { ...moved, wasteSets: decWaste(moved.wasteSets) };
  moved = { ...moved, drag: null, dropTarget: null };
  const [flipped, didFlip] = flip(
    moved,
    next.drag.fromPile,
    next.drag.fromIndex,
  );
  moved = win(flipped);
  return [
    moved,
    [
      K.CUES.drop,
      ...(target.pile === "foundation" ? [K.CUES.home] : []),
      ...(didFlip ? [K.CUES.flip] : []),
      ...(moved.screen === "won" ? [K.CUES.win] : []),
    ],
  ];
}

function drawLaunchVx(): number {
  const v =
    K.LAUNCH_VX_MIN + Math.random() * (K.LAUNCH_VX_MAX - K.LAUNCH_VX_MIN);
  return Math.random() < 0.5 ? -v : v;
}
function cascade(
  s: DeepReadonly<CascadeState>,
  dt: number,
): [CascadeState, readonly string[]] {
  if (s.screen !== "won") return [copy(s), []];
  let next = copy(s);
  const cues: string[] = [];
  const flyers = next.flyers
    .map((f) => {
      const vy = f.vy + K.GRAVITY * dt;
      let y = f.y + vy * dt;
      let outVy = vy;
      if (y >= K.FLOOR_Y && outVy > 0) {
        y = K.FLOOR_Y;
        outVy = -outVy * K.BOUNCE_DAMP;
      }
      return { ...f, x: f.x + f.vx * dt, y, vy: outVy };
    })
    .filter((f) => f.x + K.CARD_W >= 0 && f.x <= K.STAGE_W);
  next = {
    ...next,
    flyers,
    trailStamps: next.trailPainting
      ? next.trailStamps + next.flyers.length
      : next.trailStamps,
  };
  if (next.launching) {
    let clock = next.launchClock + dt;
    let launched = next.launched;
    let foundations = next.foundations.map((p) => [...p]);
    const newFlyers = [...next.flyers];
    while (clock >= K.LAUNCH_INTERVAL && launched < K.DECK_SIZE) {
      const start = launched % K.FOUNDATION_COUNT;
      let fi = -1;
      for (let off = 0; off < K.FOUNDATION_COUNT; off += 1)
        if (foundations[(start + off) % K.FOUNDATION_COUNT].length) {
          fi = (start + off) % K.FOUNDATION_COUNT;
          break;
        }
      if (fi < 0) break;
      const card = foundations[fi][foundations[fi].length - 1];
      foundations = foundations.map((p, i) => (i === fi ? p.slice(0, -1) : p));
      newFlyers.push({
        id: card.id,
        suit: card.suit,
        rank: card.rank,
        x: K.FOUNDATION_X[fi],
        y: K.TOP_ROW_Y,
        vx: drawLaunchVx(),
        vy: K.LAUNCH_VY,
      });
      launched += 1;
      clock -= K.LAUNCH_INTERVAL;
      cues.push(K.CUES.launch);
    }
    next = {
      ...next,
      launchClock: clock,
      launched,
      foundations,
      flyers: newFlyers,
    };
  }
  if (next.launched >= K.DECK_SIZE && next.flyers.length === 0)
    next = { ...next, cascadeDone: true };
  return [next, cues];
}

function setPile(
  s: DeepReadonly<CascadeState>,
  pile: CardPile,
  index: number,
  fn: (p: readonly CardState[]) => readonly CardState[],
  inc = false,
): CascadeState {
  const n = copy(s);
  const nextId = n.nextId + (inc ? 1 : 0);
  if (pile === "stock" && index === 0)
    return { ...n, stock: fn(n.stock), nextId };
  if (pile === "waste" && index === 0)
    return {
      ...n,
      waste: fn(n.waste),
      wasteSets: inc ? n.wasteSets : [],
      nextId,
    };
  if (pile === "foundation" && index >= 0 && index < K.FOUNDATION_COUNT)
    return {
      ...n,
      foundations: n.foundations.map((p, i) => (i === index ? fn(p) : p)),
      nextId,
    };
  if (pile === "tableau" && index >= 0 && index < K.TABLEAU_COLUMNS)
    return {
      ...n,
      tableau: n.tableau.map((p, i) => (i === index ? fn(p) : p)),
      nextId,
    };
  throw new Error("pile not found");
}
function replaceCard(
  s: DeepReadonly<CascadeState>,
  id: number,
  fn: (c: CardState) => CardState,
): CascadeState {
  let found = false;
  const each = (p: readonly CardState[]) =>
    p.map((c) => (c.id === id ? ((found = true), fn(c)) : c));
  const n = {
    ...copy(s),
    stock: each(s.stock),
    waste: each(s.waste),
    foundations: s.foundations.map(each),
    tableau: s.tableau.map(each),
  };
  if (!found) throw new Error("card not found");
  return n;
}
function removeCard(s: DeepReadonly<CascadeState>, id: number): CascadeState {
  let found = false;
  const wasteHad = s.waste.some((c) => c.id === id);
  const each = (p: readonly CardState[]) =>
    p.filter((c) => (c.id === id ? ((found = true), false) : true));
  const n = {
    ...copy(s),
    stock: each(s.stock),
    waste: each(s.waste),
    foundations: s.foundations.map(each),
    tableau: s.tableau.map(each),
    wasteSets: wasteHad ? decWaste(s.wasteSets) : s.wasteSets,
  };
  if (!found) throw new Error("card not found");
  return n;
}
function flyer(
  s: DeepReadonly<CascadeState>,
  id: number,
  fn: (f: FlyerState) => FlyerState,
): CascadeState {
  let found = false;
  const flyers = s.flyers.map((f) =>
    f.id === id ? ((found = true), fn(f)) : { ...f },
  );
  if (!found) throw new Error("flyer not found");
  return { ...copy(s), flyers };
}

function debugApi(): CascadeDebugApi {
  return {
    version: K.CASCADE_DEBUG_VERSION,
    reset: (s) => base(s.muted),
    snapshot: (s) => ({
      version: K.CASCADE_DEBUG_VERSION,
      screen: s.screen,
      menuIndex: s.menuIndex,
      titleIndex: s.titleIndex,
      dealMode: K.DEAL_MODE,
      turnCount: K.TURN_COUNT,
      dealModeLabel: K.DEAL_MODE_LABEL,
      muted: s.muted,
      autoFlip: s.autoFlip,
      winDetect: s.winDetect,
      launching: s.launching,
      trailPainting: s.trailPainting,
      stock: s.stock.map(cardSnap),
      waste: s.waste.map(cardSnap),
      wasteSets: [...s.wasteSets],
      wasteVisibleCount: visibleWaste(s),
      foundations: s.foundations.map((p) => p.map(cardSnap)),
      tableau: s.tableau.map((p) => p.map(cardSnap)),
      drag: s.drag ? { ...s.drag, cards: s.drag.cards.map(cardSnap) } : null,
      dropTarget: targetFor(s, s.drag),
      pointer: { ...s.pointer },
      lastPress: s.lastPress ? { ...s.lastPress } : null,
      launchClock: s.launchClock,
      launched: s.launched,
      flyers: s.flyers.map((f) => ({ ...f })),
      cascadeDone: s.cascadeDone,
      trailStamps: s.trailStamps,
      simTime: s.simTime,
    }),
    reconcile: (s) => ({ ...copy(s), dropTarget: targetFor(s, s.drag) }),
    menuItemRect: (s, i) => menuRect(s.screen, i),
    setScreen: (s, screen) => ({ ...copy(s), screen }),
    setMenuIndex: (s, menuIndex) => ({ ...copy(s), menuIndex }),
    setTitleIndex: (s, titleIndex) => ({ ...copy(s), titleIndex }),
    addCard: (s, pile, index, suit, rankValue, faceUp) => {
      if (
        !(K.SUITS as readonly string[]).includes(suit) ||
        rankValue < 1 ||
        rankValue > 13 ||
        !Number.isInteger(rankValue)
      )
        throw new Error("bad card");
      return setPile(
        s,
        pile,
        index,
        (p) => [...p, { id: s.nextId, suit, rank: rankValue, faceUp }],
        true,
      );
    },
    removeCard,
    setCardFaceUp: (s, id, faceUp) =>
      replaceCard(s, id, (c) => ({ ...c, faceUp })),
    clearPile: (s, pile, index) => setPile(s, pile, index, () => []),
    clearTable: (s) => ({
      ...copy(s),
      stock: [],
      waste: [],
      wasteSets: [],
      foundations: Array.from({ length: K.FOUNDATION_COUNT }, () => []),
      tableau: Array.from({ length: K.TABLEAU_COLUMNS }, () => []),
      drag: null,
      dropTarget: null,
    }),
    addWasteSet: (s, count) => {
      if (!Number.isInteger(count)) throw new Error("count must be whole");
      return { ...copy(s), wasteSets: [...s.wasteSets, count] };
    },
    clearWasteSets: (s) => ({ ...copy(s), wasteSets: [] }),
    deal,
    turnStock,
    move: (s, a, b, c, d, e) => {
      const [n, ok] = move(s, a, b, c, d, e);
      return [n, ok];
    },
    autoMove: (s, p, i) => {
      const [n, ok] = autoMove(s, p, i);
      return [n, ok];
    },
    pointerDown: (s, x, y) => pointerDown(s, x, y)[0],
    pointerMove,
    pointerUp: (s, x, y) => pointerUp(s, x, y)[0],
    setAutoFlip: (s, autoFlip) => ({ ...copy(s), autoFlip }),
    setWinDetect: (s, winDetect) => ({ ...copy(s), winDetect }),
    setLaunching: (s, launching) => ({ ...copy(s), launching }),
    setTrailPainting: (s, trailPainting) => ({ ...copy(s), trailPainting }),
    addFlyer: (s, suit, rankValue, x, y, vx, vy) => ({
      ...copy(s),
      flyers: [
        ...s.flyers,
        { id: s.nextId, suit, rank: rankValue, x, y, vx, vy },
      ],
      nextId: s.nextId + 1,
    }),
    setFlyerPosition: (s, id, x, y) => flyer(s, id, (f) => ({ ...f, x, y })),
    setFlyerVelocity: (s, id, vx, vy) =>
      flyer(s, id, (f) => ({ ...f, vx, vy })),
    removeFlyer: (s, id) => {
      if (!s.flyers.some((f) => f.id === id))
        throw new Error("flyer not found");
      return { ...copy(s), flyers: s.flyers.filter((f) => f.id !== id) };
    },
    clearFlyers: (s) => ({ ...copy(s), flyers: [] }),
    setLaunchClock: (s, launchClock) => ({ ...copy(s), launchClock }),
    clearTrail: (s) => ({ ...copy(s), trailStamps: 0 }),
    drawLaunchVx,
  };
}

function register(api: InitApi<CascadeState>): void {
  for (const [name, keys] of Object.entries(K.MENU_BINDINGS))
    api.input.register(name, { keys: [...keys] });
  const cue = (
    name: string,
    freq: number,
    freqTo: number,
    durationMs: number,
  ) =>
    api.audio.define(name, {
      freq,
      freqTo,
      durationMs,
      gain: 0.12,
      wave: "triangle",
    });
  cue(K.CUES.deal, 220, 520, 130);
  cue(K.CUES.turn, 360, 240, 70);
  cue(K.CUES.recycle, 160, 260, 120);
  cue(K.CUES.lift, 520, 520, 45);
  cue(K.CUES.drop, 300, 430, 70);
  cue(K.CUES.reject, 140, 100, 90);
  cue(K.CUES.flip, 680, 520, 55);
  cue(K.CUES.home, 640, 900, 110);
  cue(K.CUES.launch, 420, 240, 80);
  cue(K.CUES.win, 440, 880, 300);
  api.diagnostics.register("screen", (s) => `${s.screen} ${K.DEAL_MODE}`);
  api.diagnostics.register(
    "top",
    (s) => `stock ${s.stock.length} waste ${s.waste.length}`,
  );
  api.diagnostics.register("foundations", (s) =>
    s.foundations.map((p) => p.length).join("/"),
  );
  api.diagnostics.register("columns", (s) =>
    s.tableau.map((p) => p.length).join("/"),
  );
  api.diagnostics.register("drag", (s) =>
    s.drag ? `drag ${s.drag.cards.length}` : "drag none",
  );
  api.diagnostics.register(
    "cascade",
    (s) => `launch ${s.launched} fly ${s.flyers.length}`,
  );
}

function play(api: UpdateApi, cues: readonly string[]): void {
  for (const cue of new Set(cues)) api.audio.play(cue);
}
function sample(
  s: CascadeState,
  e: PointerSample,
): [CascadeState, readonly string[]] {
  if (!e.primary) return [s, []];
  if (e.type === "down") return pointerDown(s, e.x, e.y);
  if (e.type === "up") return pointerUp(s, e.x, e.y);
  return [pointerMove(s, e.x, e.y), []];
}

function rr(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r = 10,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function slot(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.save();
  rr(ctx, x, y, K.CARD_W, K.CARD_H);
  ctx.fillStyle = "rgba(255,255,255,.06)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.25)";
  ctx.setLineDash([8, 8]);
  ctx.stroke();
  ctx.restore();
}
function card(
  ctx: CanvasRenderingContext2D,
  c: DeepReadonly<CardState>,
  x: number,
  y: number,
  lift = false,
): void {
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.35)";
  ctx.shadowBlur = lift ? 18 : 8;
  ctx.shadowOffsetY = lift ? 10 : 4;
  rr(ctx, x, y, K.CARD_W, K.CARD_H);
  ctx.fillStyle = c.faceUp ? CREAM : "#1c4e84";
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = c.faceUp ? "#d8ccb3" : "#94c0e8";
  ctx.lineWidth = 2;
  ctx.stroke();
  if (c.faceUp) {
    ctx.fillStyle = color(c.suit) === "red" ? RED : BLACK;
    ctx.font = "700 24px Georgia, serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(rank(c.rank), x + 10, y + 8);
    ctx.fillText(suitGlyph(c.suit), x + 10, y + 34);
    ctx.font = "700 48px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(suitGlyph(c.suit), x + K.CARD_W / 2, y + K.CARD_H / 2 + 8);
  } else {
    ctx.fillStyle = "#f5d782";
    for (let i = 0; i < 5; i += 1) ctx.fillRect(x + 18 + i * 14, y + 22, 6, 96);
  }
  ctx.restore();
}
function button(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  label: string,
  selected: boolean,
): void {
  rr(ctx, r.x, r.y, r.w, r.h, 8);
  ctx.fillStyle = selected ? GOLD : "rgba(255,255,255,.12)";
  ctx.fill();
  ctx.strokeStyle = selected ? "#fff3bd" : "rgba(255,255,255,.25)";
  ctx.stroke();
  ctx.fillStyle = selected ? "#183428" : CREAM;
  ctx.font = "700 18px system-ui,sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, r.x + r.w / 2, r.y + r.h / 2 + 1);
}
function table(
  ctx: CanvasRenderingContext2D,
  s: DeepReadonly<CascadeState>,
): void {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, K.STAGE_W, K.STAGE_H);
  ctx.fillStyle = "rgba(255,255,255,.035)";
  for (let i = 0; i < 28; i += 1) ctx.fillRect(i * 52 - 20, 0, 18, K.STAGE_H);
  if (s.trailStamps) {
    ctx.fillStyle = "rgba(255,248,232,.08)";
    for (let i = 0; i < Math.min(s.trailStamps, 260); i += 1)
      ctx.fillRect((i * 83) % K.STAGE_W, (i * 47) % 610, 72, 100);
  }
  [K.STOCK_X, K.WASTE_X, ...K.FOUNDATION_X].forEach((x) =>
    slot(ctx, x, K.TOP_ROW_Y),
  );
  if (s.stock.length)
    card(ctx, s.stock[s.stock.length - 1], K.STOCK_X, K.TOP_ROW_Y);
  const start = Math.max(0, s.waste.length - visibleWaste(s));
  s.waste
    .slice(start)
    .forEach((c, i) => card(ctx, c, K.WASTE_X + i * K.WASTE_FAN, K.TOP_ROW_Y));
  s.foundations.forEach(
    (p, i) =>
      p.length && card(ctx, p[p.length - 1], K.FOUNDATION_X[i], K.TOP_ROW_Y),
  );
  s.tableau.forEach((p, i) => {
    if (!p.length) slot(ctx, K.COLUMN_X[i], K.TABLEAU_Y);
    const ys = columnYs(p);
    p.forEach((c, r) => card(ctx, c, K.COLUMN_X[i], ys[r]));
  });
  if (s.dropTarget) {
    const r =
      s.dropTarget.pile === "foundation"
        ? {
            x: K.FOUNDATION_X[s.dropTarget.index],
            y: K.TOP_ROW_Y,
            w: K.CARD_W,
            h: K.CARD_H,
          }
        : columnRect(s, s.dropTarget.index);
    ctx.fillStyle = "rgba(246,214,111,.35)";
    rr(ctx, r.x - 4, r.y - 4, r.w + 8, r.h + 8, 12);
    ctx.fill();
  }
  s.drag?.cards.forEach((c, i) =>
    card(ctx, c, s.drag!.x, s.drag!.y + i * K.FACE_UP_OFFSET, true),
  );
  s.flyers.forEach((f) => card(ctx, { ...f, faceUp: true }, f.x, f.y, true));
}
function hud(
  ctx: CanvasRenderingContext2D,
  s: DeepReadonly<CascadeState>,
): void {
  ctx.fillStyle = "#0f3f31";
  ctx.fillRect(0, K.HUD_Y, K.STAGE_W, K.HUD_H);
  K.HUD_ITEMS.forEach((it, i) =>
    button(ctx, menuRect("playing", i)!, it, s.menuIndex === i),
  );
  ctx.fillStyle = CREAM;
  ctx.font = "700 18px system-ui,sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(K.DEAL_MODE_LABEL, K.STAGE_W - 26, K.HUD_Y + K.HUD_H / 2 + 1);
}

export const game: Game<CascadeState, CascadeDebugApi> = {
  initialize(api: InitApi<CascadeState>): [CascadeState, CascadeDebugApi] {
    register(api);
    return [base(false), debugApi()];
  },
  update(
    s: DeepReadonly<CascadeState>,
    api: UpdateApi,
    dt: number,
  ): CascadeState {
    let next = { ...copy(s), simTime: s.simTime + dt };
    const cues: string[] = [];
    const up = api.input.pressed(K.MENU_UP),
      down = api.input.pressed(K.MENU_DOWN),
      confirm = api.input.pressed(K.MENU_CONFIRM),
      back = api.input.pressed(K.MENU_BACK);
    const items = menuItems(next.screen);
    if (
      items.length &&
      (up || down || confirm || (back && next.screen === "howto"))
    ) {
      if (up)
        next = {
          ...next,
          menuIndex: (next.menuIndex + items.length - 1) % items.length,
        };
      else if (down)
        next = { ...next, menuIndex: (next.menuIndex + 1) % items.length };
      else {
        const old = next;
        const [n, c] = activate(next, next.menuIndex);
        next = n;
        cues.push(...c);
        if (old.screen === "playing" && old.menuIndex === 2)
          api.audio.setMuted(!api.audio.muted());
      }
    }
    for (const e of api.input.pointerSamples()) {
      const before = next;
      const [n, c] = sample(next, e);
      next = n;
      cues.push(...c);
      if (
        e.type === "up" &&
        before.screen === "playing" &&
        menuAt(before.screen, e.x, e.y) === 2 &&
        before.lastPress &&
        menuAt(before.screen, before.lastPress.x, before.lastPress.y) === 2
      )
        api.audio.setMuted(!api.audio.muted());
    }
    const [n, c] = cascade(next, dt);
    next = { ...n, muted: api.audio.muted() };
    cues.push(...c);
    play(api, cues);
    return next;
  },
  render(s: DeepReadonly<CascadeState>, api: RenderApi): void {
    const ctx = api.ctx;
    if (s.screen === "title") {
      table(ctx, s);
      ctx.fillStyle = "rgba(11,31,26,.72)";
      ctx.fillRect(0, 0, K.STAGE_W, K.STAGE_H);
      ctx.fillStyle = GOLD;
      ctx.font = "800 92px Georgia,serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(K.TITLE_TEXT, K.STAGE_W / 2, 214);
      ctx.fillStyle = CREAM;
      ctx.font = "700 24px system-ui,sans-serif";
      ctx.fillText(K.TAGLINE_TEXT, K.STAGE_W / 2, 286);
      ctx.font = "700 18px system-ui,sans-serif";
      ctx.fillText(K.DEAL_MODE_LABEL, K.STAGE_W / 2, 326);
      K.TITLE_ITEMS.forEach((it, i) =>
        button(ctx, menuRect("title", i)!, it, s.menuIndex === i),
      );
    } else if (s.screen === "howto") {
      table(ctx, s);
      ctx.fillStyle = "rgba(11,31,26,.82)";
      ctx.fillRect(0, 0, K.STAGE_W, K.STAGE_H);
      ctx.fillStyle = GOLD;
      ctx.font = "800 52px Georgia,serif";
      ctx.textAlign = "center";
      ctx.fillText("HOW TO PLAY", K.STAGE_W / 2, 104);
      ctx.fillStyle = CREAM;
      ctx.font = "500 28px system-ui,sans-serif";
      ctx.textAlign = "left";
      [
        "Build each foundation from ACE up to KING in the same suit.",
        "Columns build downward, alternating color. Empty columns take a KING.",
        "Tap the STOCK to turn three cards; tap it empty to recycle the waste.",
        "Drag cards or runs to move them. DOUBLE-CLICK a playable card to send it home.",
      ].forEach((line, i) => ctx.fillText(line, 290, 218 + i * 66));
      button(ctx, menuRect("howto", 0)!, K.HOWTO_BACK_LABEL, true);
    } else if (s.screen === "won") {
      table(ctx, s);
      if (s.cascadeDone) {
        ctx.fillStyle = "rgba(11,31,26,.38)";
        ctx.fillRect(0, 0, K.STAGE_W, K.STAGE_H);
        ctx.fillStyle = GOLD;
        ctx.font = "800 86px Georgia,serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(K.WIN_TEXT, K.STAGE_W / 2, 342);
      }
    } else {
      table(ctx, s);
      hud(ctx, s);
    }
  },
};
