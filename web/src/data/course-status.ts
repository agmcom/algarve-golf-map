// Course status notices: "is <course> open?"
//
// Only facts from the course's own website (or, for dates the club does not
// publish, a named golf-travel source), each with the date we checked it.
// On 2026-11-16 all 39 official course sites were scanned for closure,
// renovation and access notices; the four entries below are what was found.
// Every other course showed no closure notice on that date.
//
// kind:
//   closed    → course cannot be played; prices and booking buttons are hidden
//   private   → not open to the public; prices and booking buttons are hidden
//   reopened  → recently back after works; shown until `showUntil`
//   facility  → course open, but a facility (e.g. driving range) is closed

export type CourseStatusKind = 'closed' | 'private' | 'reopened' | 'facility'

export type CourseStatus = {
  kind: CourseStatusKind
  /** Short badge text for map cards and lists, e.g. "Closed until mid-2028". */
  badge: string
  /** One-line heading of the notice on the course page. */
  headline: string
  /** Full notice text, plain English. */
  detail: string
  /** ISO date we last checked the sources. */
  checked: string
  sources: { label: string; url: string }[]
  /** Optional onward link, e.g. a guide with alternatives. */
  link?: { href: string; label: string }
  /** ISO date after which the notice is no longer shown (for 'reopened'). */
  showUntil?: string
}

export const COURSE_STATUS: Record<string, CourseStatus> = {
  'san-lorenzo': {
    kind: 'closed',
    badge: 'Closed until mid-2028',
    headline: 'Closed for renovation until mid-2028',
    detail:
      'San Lorenzo closed on 19 October 2026 for a major renovation and is due to reopen in mid-2028 (some sources say spring 2028). You cannot book a round here until then. The club itself now sends golfers to the four Vilamoura Golf courses.',
    checked: '2026-11-16',
    sources: [{ label: 'San Lorenzo official website', url: 'https://www.golfsanlorenzo.pt/' }],
    link: {
      href: '/guide/san-lorenzo-golf-course-closed-until-2028-where-to-play-instead',
      label: 'Where to play instead',
    },
  },
  'victoria-els-club': {
    kind: 'private',
    badge: 'Private members club',
    headline: 'Private club: not open to the public',
    detail:
      'The Els Club Vilamoura is a private members club. Membership is only for people proposed by its founder members or invited by the club. Guests of the Victoria Golf Resort & Spa hotel can book a round through the club’s guest page, with conditions (including a minimum 3-night stay). The club publishes no green fees for other visitors.',
    checked: '2026-11-16',
    sources: [
      { label: 'The Els Club official website', url: 'https://www.theelsclubvilamoura.com/' },
      { label: 'Guest booking conditions', url: 'https://www.theelsclubvilamoura.com/guests/' },
    ],
  },
  'monte-rei': {
    kind: 'reopened',
    badge: 'Reopened Sept 2026',
    headline: 'Open again after the 2026 renovation',
    detail:
      'Monte Rei’s North Course closed on 13 April 2026 for a six-month renovation with Nicklaus Design. The greens and their surrounds were rebuilt, bunkers renovated, and the irrigation system and practice facilities upgraded. The course reopened on 14 September 2026.',
    checked: '2026-11-16',
    sources: [
      { label: 'Monte Rei official website', url: 'https://www.monte-rei.com/en/golf/' },
      { label: 'Teetimes.pt (closure and reopening dates)', url: 'https://www.teetimes.pt/blog/monte-rei-rebuilt-the-algarves-number-one-returns-on-14-september/' },
    ],
    showUntil: '2027-09-14',
  },
  'boavista': {
    kind: 'facility',
    badge: 'Driving range closed',
    headline: 'Course open, driving range closed',
    detail:
      'The golf course is open as normal. Boavista says its driving range is closed for repair work and will reopen once the work is finished. No reopening date is given, so check with the club if you want to warm up on the range.',
    checked: '2026-11-16',
    sources: [{ label: 'Boavista official website', url: 'https://www.boavistaresort.pt/en/Menu/Golf/About-the-Course.aspx' }],
  },
}

/** The notice to show for a course today, or null. */
export function getCourseStatus(slug: string, today: Date = new Date()): CourseStatus | null {
  const s = COURSE_STATUS[slug]
  if (!s) return null
  if (s.showUntil && today > new Date(s.showUntil)) return null
  return s
}

/** True when the course cannot be booked by visitors (hide prices and booking buttons). */
export function isUnbookable(slug: string): boolean {
  const s = getCourseStatus(slug)
  return s?.kind === 'closed' || s?.kind === 'private'
}

export function formatCheckedDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
