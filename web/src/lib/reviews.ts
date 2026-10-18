import type { CourseReview, ReviewBuggyRule, ReviewDifficulty, ReviewGroupType, ReviewRoundTime, ReviewTeeTime } from '@/types/database'

// A course's reviews page stays noindex (and out of the sitemap) until it has
// at least this many approved reviews.
export const MIN_REVIEWS_TO_INDEX = 1
export const REVIEWS_PER_PAGE = 20
// "Current condition" = rounds played in the last N calendar months (incl. this one).
export const RECENT_MONTHS = 3

// Temporary, out-of-the-ordinary conditions — the "why" behind a low condition
// rating that the star ratings alone can't explain.
export const CONDITION_FLAGS: Record<string, string> = {
  'hollow-tined':    'Greens recently hollow-tined or sanded',
  'temporary':       'Temporary greens or tees in use',
  'works-on-course': 'Maintenance works on the course',
}

// Short chip labels for review cards.
export const CONDITION_FLAG_CHIPS: Record<string, string> = {
  'hollow-tined':    'Hollow-tined greens',
  'temporary':       'Temporary greens/tees',
  'works-on-course': 'Works on course',
}

export const ROUND_TIME_LABELS: Record<ReviewRoundTime, string> = {
  '<4h':    'Under 4 hours',
  '4-4.5h': '4 to 4½ hours',
  '4.5-5h': '4½ to 5 hours',
  '>5h':    'Over 5 hours',
}

export const BUGGY_RULE_LABELS: Record<ReviewBuggyRule, string> = {
  'fairways':   'Buggies allowed on fairways',
  '90-degree':  '90-degree rule',
  'paths-only': 'Buggies on paths only',
  'walked':     'Walked the course',
}

export const GROUP_LABELS: Record<ReviewGroupType, string> = {
  couple:  'As a couple',
  friends: 'With friends',
  society: 'Society or group trip',
  solo:    'On my own',
}

export const TEE_TIME_LABELS: Record<ReviewTeeTime, string> = {
  morning:  'Morning',
  midday:   'Midday',
  twilight: 'Twilight',
}

export const DIFFICULTY_LABELS: Record<ReviewDifficulty, string> = {
  'easier':      'Easier than expected',
  'as-expected': 'About what I expected',
  'harder':      'Harder than expected',
}

// Handicap bands used to summarise "how it plays for your handicap".
export const HCP_BANDS: { label: string; min: number; max: number }[] = [
  { label: 'Handicap 0–12',  min: 0,  max: 12 },
  { label: 'Handicap 13–24', min: 13, max: 24 },
  { label: 'Handicap 25+',   min: 25, max: 54 },
]

export type RatingKey =
  | 'rating_greens' | 'rating_fairways' | 'rating_tees_bunkers'
  | 'rating_layout' | 'rating_views' | 'rating_pace' | 'rating_staff' | 'rating_clubhouse' | 'rating_value'

export const CONDITION_RATINGS: { key: RatingKey; label: string }[] = [
  { key: 'rating_greens',       label: 'Greens' },
  { key: 'rating_fairways',     label: 'Fairways' },
  { key: 'rating_tees_bunkers', label: 'Tees & bunkers' },
]

export const EXPERIENCE_RATINGS: { key: RatingKey; label: string }[] = [
  { key: 'rating_layout',    label: 'Layout & design' },
  { key: 'rating_views',     label: 'Views & scenery' },
  { key: 'rating_pace',      label: 'Pace of play' },
  { key: 'rating_staff',     label: 'Staff & welcome' },
  { key: 'rating_clubhouse', label: 'Clubhouse & facilities' },
  { key: 'rating_value',     label: 'Value for money' },
]

export const COUNTRIES = [
  'United Kingdom', 'Ireland', 'Portugal', 'Spain', 'Netherlands', 'Belgium',
  'Germany', 'France', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland',
  'Austria', 'Italy', 'Poland', 'United States', 'Canada', 'Other',
]

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export const SEASON_LABELS: Record<Season, string> = {
  spring: 'Spring (Mar–May)',
  summer: 'Summer (Jun–Aug)',
  autumn: 'Autumn (Sep–Nov)',
  winter: 'Winter (Dec–Feb)',
}

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function monthOf(playedMonth: string): number {
  return Number(playedMonth.slice(5, 7))
}

export function seasonOf(playedMonth: string): Season {
  const m = monthOf(playedMonth)
  if (m >= 3 && m <= 5) return 'spring'
  if (m >= 6 && m <= 8) return 'summer'
  if (m >= 9 && m <= 11) return 'autumn'
  return 'winter'
}

// '2026-09-01' → 'Sep 2026'
export function formatPlayedMonth(playedMonth: string): string {
  return `${MONTH_SHORT[monthOf(playedMonth) - 1]} ${playedMonth.slice(0, 4)}`
}

function firstOfMonthIso(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-01`
}

function avg(values: number[]): number | null {
  if (values.length === 0) return null
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
}

function mostCommon<T extends string>(values: (T | null)[]): { value: T; count: number } | null {
  const counts = new Map<T, number>()
  for (const v of values) if (v) counts.set(v, (counts.get(v) ?? 0) + 1)
  let best: { value: T; count: number } | null = null
  for (const [value, count] of counts) if (!best || count > best.count) best = { value, count }
  return best
}

export interface RatingAverage { key: RatingKey; label: string; average: number | null; count: number }

export interface ReviewSummary {
  count: number
  overall: number | null
  recommendPct: number | null
  condition: RatingAverage[]
  experience: RatingAverage[]
  // Condition from rounds played in the last RECENT_MONTHS months; null if none.
  recent: {
    count: number
    rangeLabel: string          // 'Jul–Sep 2026'
    condition: RatingAverage[]
  } | null
  // Most reported condition flags — recent rounds if any, else all rounds.
  topFlags: { flag: string; label: string; count: number }[]
  buggyRule: { value: ReviewBuggyRule; count: number } | null
  roundTime: { value: ReviewRoundTime; count: number } | null
  // "How did it play for your handicap?" — per handicap band, most common answer.
  difficultyByBand: { label: string; count: number; answer: ReviewDifficulty; answerCount: number }[]
  // Clubs hired from the course's own pro shop.
  clubHire: { count: number; average: number | null } | null
  lastApprovedAt: string | null
}

function ratingAverages(reviews: CourseReview[], fields: { key: RatingKey; label: string }[]): RatingAverage[] {
  return fields.map(({ key, label }) => {
    const values = reviews.map(r => r[key]).filter((v): v is number => v != null)
    return { key, label, average: avg(values), count: values.length }
  })
}

export function summarizeReviews(reviews: CourseReview[], now: Date = new Date()): ReviewSummary {
  const count = reviews.length

  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (RECENT_MONTHS - 1), 1))
  const fromIso = firstOfMonthIso(from)
  const recentReviews = reviews.filter(r => r.played_month >= fromIso)

  const nowLabel = formatPlayedMonth(firstOfMonthIso(now))
  const fromLabel = formatPlayedMonth(fromIso)
  const rangeLabel = fromLabel.slice(-4) === nowLabel.slice(-4)
    ? `${fromLabel.slice(0, 3)}–${nowLabel}`
    : `${fromLabel}–${nowLabel}`

  const flagSource = recentReviews.length > 0 ? recentReviews : reviews
  const flagCounts = new Map<string, number>()
  for (const r of flagSource) {
    for (const f of r.condition_flags ?? []) {
      if (CONDITION_FLAGS[f]) flagCounts.set(f, (flagCounts.get(f) ?? 0) + 1)
    }
  }
  const topFlags = [...flagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([flag, n]) => ({ flag, label: CONDITION_FLAGS[flag], count: n }))

  const difficultyByBand = HCP_BANDS.flatMap(band => {
    const inBand = reviews.filter(r => r.difficulty_for_hcp && r.handicap != null && r.handicap >= band.min && r.handicap <= band.max)
    const top = mostCommon(inBand.map(r => r.difficulty_for_hcp))
    return top ? [{ label: band.label, count: inBand.length, answer: top.value, answerCount: top.count }] : []
  })

  const hireRatings = reviews
    .filter(r => r.hired_course_clubs)
    .map(r => r.rating_club_hire)
    .filter((v): v is number => v != null)

  const approvedDates = reviews.map(r => r.approved_at).filter((d): d is string => !!d).sort()

  return {
    count,
    overall: avg(reviews.map(r => r.rating_overall)),
    recommendPct: count > 0 ? Math.round((reviews.filter(r => r.would_recommend).length / count) * 100) : null,
    condition: ratingAverages(reviews, CONDITION_RATINGS),
    experience: ratingAverages(reviews, EXPERIENCE_RATINGS),
    recent: recentReviews.length > 0
      ? { count: recentReviews.length, rangeLabel, condition: ratingAverages(recentReviews, CONDITION_RATINGS) }
      : null,
    topFlags,
    buggyRule: mostCommon(reviews.map(r => r.buggy_rule)),
    roundTime: mostCommon(reviews.map(r => r.round_time)),
    difficultyByBand,
    clubHire: hireRatings.length > 0 ? { count: hireRatings.length, average: avg(hireRatings) } : null,
    lastApprovedAt: approvedDates.length > 0 ? approvedDates[approvedDates.length - 1] : null,
  }
}

// Newest round first, then newest approval.
export function sortReviews(reviews: CourseReview[]): CourseReview[] {
  return [...reviews].sort((a, b) =>
    b.played_month.localeCompare(a.played_month) ||
    (b.approved_at ?? b.created_at).localeCompare(a.approved_at ?? a.created_at)
  )
}
