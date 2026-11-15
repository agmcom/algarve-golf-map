import type { Scorecard, ScorecardHole, ScorecardLoop } from '@/data/scorecards'

export const M_TO_YD = 1.09361
export const toYards = (m: number) => Math.round(m * M_TO_YD)

/** Tee colour name → swatch colour. Unknown names get a neutral grey. */
const SWATCH: Record<string, string> = {
  black: '#222', white: '#fff', yellow: '#f2c94c', blue: '#2f6fd0', red: '#d64545',
  gold: '#c9a227', green: '#3c9a4b', purple: '#7d4cc2', orange: '#ee8a2f', silver: '#b8bcc2',
  grey: '#9a9a9a', gray: '#9a9a9a', pink: '#e98bb5', bronze: '#a9713d', champion: '#222',
}
export function teeSwatch(tee: string): string {
  const key = tee.toLowerCase().split(/[\s/]+/)[0]
  return SWATCH[key] ?? '#9a9a9a'
}

export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/** Metres for a tee over some holes, or null if any hole lacks that tee. */
export function teeLength(holes: ScorecardHole[], tee: string): number | null {
  const v = holes.map(h => h.m[tee])
  return v.some(x => x == null) ? null : sum(v)
}

export const parOf = (holes: ScorecardHole[]) => sum(holes.map(h => h.par))

export function allHoles(card: Scorecard): ScorecardHole[] {
  return card.loops.flatMap(l => l.holes)
}

/** True when the card is one 18-hole loop, so it has an Out/In split. */
export const isSingle18 = (card: Scorecard) => card.loops.length === 1 && card.loops[0].holes.length === 18

/** 9-hole courses (a single loop of nine). */
export const isNine = (card: Scorecard) => card.loops.length === 1 && card.loops[0].holes.length === 9

/** The longest tee that has a length on every hole. */
export function longestTee(card: Scorecard, loops: ScorecardLoop[] = card.loops): { tee: string; metres: number } | null {
  const holes = loops.flatMap(l => l.holes)
  let best: { tee: string; metres: number } | null = null
  for (const t of card.tees) {
    const len = teeLength(holes, t)
    if (len != null && (!best || len > best.metres)) best = { tee: t, metres: len }
  }
  return best
}

export function shortestTee(card: Scorecard, loops: ScorecardLoop[] = card.loops): { tee: string; metres: number } | null {
  const holes = loops.flatMap(l => l.holes)
  let best: { tee: string; metres: number } | null = null
  for (const t of card.tees) {
    const len = teeLength(holes, t)
    if (len != null && (!best || len < best.metres)) best = { tee: t, metres: len }
  }
  return best
}

export function parCounts(holes: ScorecardHole[]): { 3: number; 4: number; 5: number; 6: number } {
  const c = { 3: 0, 4: 0, 5: 0, 6: 0 }
  for (const h of holes) if (h.par in c) c[h.par as 3 | 4 | 5 | 6]++
  return c
}

/** Longest single hole, measured from the longest tee. */
export function longestHole(card: Scorecard): { loop: string | null; hole: ScorecardHole; metres: number; tee: string } | null {
  const tee = longestTee(card)?.tee
  if (!tee) return null
  let best: { loop: string | null; hole: ScorecardHole; metres: number; tee: string } | null = null
  for (const l of card.loops) for (const h of l.holes) {
    const m = h.m[tee]
    if (m != null && (!best || m > best.metres)) best = { loop: l.name, hole: h, metres: m, tee }
  }
  return best
}

export function shortestHole(card: Scorecard): { loop: string | null; hole: ScorecardHole; metres: number; tee: string } | null {
  const tee = longestTee(card)?.tee
  if (!tee) return null
  let best: { loop: string | null; hole: ScorecardHole; metres: number; tee: string } | null = null
  for (const l of card.loops) for (const h of l.holes) {
    const m = h.m[tee]
    if (m != null && (!best || m < best.metres)) best = { loop: l.name, hole: h, metres: m, tee }
  }
  return best
}

/** Stroke index 1 on a single 18-hole card (the hole the club rates hardest). */
export function hardestHole(card: Scorecard): ScorecardHole | null {
  if (!isSingle18(card)) return null
  return card.loops[0].holes.find(h => h.si === 1) ?? null
}

/** 18-hole combinations on a 27-hole course: every pair of loops. */
export function loopPairs(card: Scorecard): [ScorecardLoop, ScorecardLoop][] {
  const out: [ScorecardLoop, ScorecardLoop][] = []
  const ls = card.loops.filter(l => l.holes.length === 9)
  if (ls.length < 3) return out
  for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++) out.push([ls[i], ls[j]])
  return out
}

export const fmtNum = (n: number) => n.toLocaleString('en-GB')
