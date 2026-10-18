import type { CoursePrice } from '@/types/database'

export const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Green-fee data is seeded from algarvegolf.net (see web/scripts/seed-prices.mjs).
export const PRICE_SOURCE = 'algarvegolf.net'
export const PRICE_SEASON = '2026/27'
export const PRICE_LAST_CHECKED = 'September 2026'

export interface MonthPrice {
  standard?: CoursePrice
  twilight?: CoursePrice
}

export interface PriceRange {
  min: number
  max: number
  minMonths: number[]
  maxMonths: number[]
  flat: boolean // min === max
}

export interface PriceSummary {
  byMonth: Record<number, MonthPrice>
  months: number[] // sorted list of months (1-12) that have any visitor price
  currentMonth: number // 1-12
  hasPrices: boolean
  hasStandard: boolean
  hasTwilight: boolean
  twilightOnly: boolean // hasTwilight && !hasStandard
  holes: number | null // dominant `holes` value across the price rows
  buggyIncluded: boolean // every priced row bundles a buggy
  buggyAddOn: number | null // optional buggy price when not included
  standard: PriceRange | null
  twilight: PriceRange | null
  primary: PriceRange | null // standard ?? twilight — what the page headlines
  primarySlot: 'standard' | 'twilight' | null
  twilightSaving: { minAbs: number; maxAbs: number; minPct: number; maxPct: number } | null
  coverage: { monthsCovered: number; yearRound: boolean; label: string | null }
}

export function monthListText(months: number[]): string {
  const names = [...months].sort((a, b) => a - b).map(m => MONTH_NAMES[m - 1])
  if (names.length === 0) return ''
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

export function priceCell(p?: CoursePrice): string {
  return p ? `€${p.price_eur}` : '—'
}

function rangeFrom(entries: { month: number; price: number }[]): PriceRange | null {
  if (entries.length === 0) return null
  let min = Infinity
  let max = -Infinity
  for (const e of entries) {
    if (e.price < min) min = e.price
    if (e.price > max) max = e.price
  }
  const minMonths = entries.filter(e => e.price === min).map(e => e.month).sort((a, b) => a - b)
  const maxMonths = entries.filter(e => e.price === max).map(e => e.month).sort((a, b) => a - b)
  return { min, max, minMonths, maxMonths, flat: min === max }
}

// A human phrase for which months have published rates, e.g. "June to December"
// or "the year apart from May". Null when all 12 months are covered.
function coverageLabel(months: number[]): string | null {
  const sorted = [...months].sort((a, b) => a - b)
  if (sorted.length >= 12) return null
  const missing: number[] = []
  for (let m = 1; m <= 12; m++) if (!sorted.includes(m)) missing.push(m)
  if (missing.length <= 2) return `the year apart from ${monthListText(missing)}`
  const contiguous = sorted.every((m, i) => i === 0 || m === sorted[i - 1] + 1)
  if (contiguous) return `${MONTH_NAMES[sorted[0] - 1]} to ${MONTH_NAMES[sorted[sorted.length - 1] - 1]}`
  return monthListText(sorted)
}

export function summarizePrices(prices: CoursePrice[], now: Date = new Date()): PriceSummary {
  const byMonth: Record<number, MonthPrice> = {}
  for (const p of prices) {
    if (!byMonth[p.month]) byMonth[p.month] = {}
    if (p.time_slot === 'standard' || p.time_slot === 'early_bird') byMonth[p.month].standard = p
    else if (p.time_slot === 'twilight' || p.time_slot === 'sunset') byMonth[p.month].twilight = p
  }

  const months = Object.keys(byMonth).map(Number).sort((a, b) => a - b)
  const standardEntries = months.filter(m => byMonth[m].standard).map(m => ({ month: m, price: byMonth[m].standard!.price_eur }))
  const twilightEntries = months.filter(m => byMonth[m].twilight).map(m => ({ month: m, price: byMonth[m].twilight!.price_eur }))

  const hasStandard = standardEntries.length > 0
  const hasTwilight = twilightEntries.length > 0
  const hasPrices = months.length > 0
  const twilightOnly = hasTwilight && !hasStandard

  const standard = rangeFrom(standardEntries)
  const twilight = rangeFrom(twilightEntries)
  const primary = standard ?? twilight
  const primarySlot = hasStandard ? 'standard' : hasTwilight ? 'twilight' : null

  const buggyIncluded = prices.length > 0 && prices.every(p => p.buggy_included)
  const buggyAddOn = prices.find(p => !p.buggy_included && p.buggy_price)?.buggy_price ?? null

  let twilightSaving: PriceSummary['twilightSaving'] = null
  const bothMonths = months.filter(m => byMonth[m].standard && byMonth[m].twilight)
  if (bothMonths.length > 0) {
    let minAbs = Infinity
    let maxAbs = -Infinity
    let minPct = Infinity
    let maxPct = -Infinity
    for (const m of bothMonths) {
      const s = byMonth[m].standard!.price_eur
      const t = byMonth[m].twilight!.price_eur
      const abs = s - t
      const pct = s > 0 ? (abs / s) * 100 : 0
      if (abs < minAbs) minAbs = abs
      if (abs > maxAbs) maxAbs = abs
      if (pct < minPct) minPct = pct
      if (pct > maxPct) maxPct = pct
    }
    if (maxAbs > 0) {
      twilightSaving = {
        minAbs: Math.round(minAbs),
        maxAbs: Math.round(maxAbs),
        minPct: Math.round(minPct),
        maxPct: Math.round(maxPct),
      }
    }
  }

  let holes: number | null = null
  if (prices.length > 0) {
    const counts = new Map<number, number>()
    for (const p of prices) counts.set(p.holes, (counts.get(p.holes) ?? 0) + 1)
    holes = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0]
  }

  const monthsCovered = months.length
  const yearRound = monthsCovered === 12

  return {
    byMonth,
    months,
    currentMonth: now.getMonth() + 1,
    hasPrices,
    hasStandard,
    hasTwilight,
    twilightOnly,
    holes,
    buggyIncluded,
    buggyAddOn,
    standard,
    twilight,
    primary,
    primarySlot,
    twilightSaving,
    coverage: { monthsCovered, yearRound, label: yearRound ? null : coverageLabel(months) },
  }
}
