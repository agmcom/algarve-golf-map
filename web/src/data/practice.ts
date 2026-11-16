// Practice facilities: driving range, short-game areas, putting greens and range-ball prices.
// Every fact comes from the club's or resort's own website or price list. Evidence:
// research/driving-ranges-2026-11/FINDINGS.md (and research/academies/academies_findings.md).
// Several courses share one practice ground, so data is per ground and each ground lists its courses.
// Courses not listed here show no practice section (their official sites publish nothing useful).

export const PRACTICE_LAST_CHECKED = '2026-11-16'
export const PRACTICE_LAST_CHECKED_LABEL = 'November 2026'

export interface PracticeSource { label: string; url: string }
export interface PracticeItem { label: string; detail: string }

export interface PracticeGround {
  id: string
  /** Name used in headings, e.g. "Benamor Golf". */
  name: string
  courses: string[]
  summary: string
  items: PracticeItem[]
  /** Range-ball prices exactly as the club publishes them, with the list they come from. */
  balls?: { price: string; source: PracticeSource }
  /** Something a visitor must know now, e.g. the range is closed. */
  notice?: string
  /** /golf-academies/<slug> page for the academy based here. */
  academy?: string
  /**
   * Course whose /courses/<course>/practice-facilities page covers this ground (only grounds with
   * enough published detail). Shared grounds have ONE page; the other courses link to it.
   */
  pageCourse?: string
  sources: PracticeSource[]
}

const PESTANA_PRICES: PracticeSource = { label: 'Pestana Golf price list', url: 'https://pestanagolf.com/pt-pt/precario' }

export const PRACTICE_GROUNDS: PracticeGround[] = [
  {
    id: 'benamor',
    pageCourse: 'benamor',
    name: 'Benamor Golf',
    courses: ['benamor'],
    summary: 'A full practice ground set in the Algarve hills: mats at the front of the range, grass at the top end, a chipping green with a bunker and a nine-hole putting green.',
    items: [
      { label: 'Driving range', detail: '16 mats at the front of the range and a practice area on grass at the top end, with target flags and distance markers. The east side of the range is kept for lessons.' },
      { label: 'Short game', detail: 'A chipping and pitching green with a practice bunker at the top end of the range.' },
      { label: 'Putting', detail: 'A nine-hole putting green between the clubhouse and the range, and a second putting green next to the 1st tee.' },
      { label: 'Balls', detail: 'Balls are bought as tokens at the reception desk. Collecting balls from the range yourself is not allowed, and only one player may use each bay.' },
    ],
    academy: 'benamor-golf-lessons',
    sources: [{ label: 'Benamor Golf driving range page', url: 'https://www.benamorgolf.com/en/driving-range/' }],
  },
  {
    id: 'palmares',
    pageCourse: 'palmares',
    name: 'Palmares Golf',
    courses: ['palmares'],
    summary: 'A 300-yard driving range set in a natural valley, with short-game zones and putting greens, all with wide views of the coast.',
    items: [
      { label: 'Driving range', detail: '300 yards long, laid out in a natural valley.' },
      { label: 'Short game', detail: 'Dedicated short-game areas.' },
      { label: 'Putting', detail: 'Putting greens.' },
      { label: 'Clubhouse', detail: 'The clubhouse, designed by RCR Arquitectes, has direct access to the course, the range and the short-game areas.' },
    ],
    academy: 'palmares-golf-academy',
    sources: [
      { label: 'Palmares Golf Academy', url: 'https://www.palmaresliving.com/golf/golf-academy/' },
      { label: 'Palmares clubhouse', url: 'https://www.palmaresliving.com/golf/clubhouse/' },
    ],
  },
  {
    id: 'pinheiros-altos',
    pageCourse: 'pinheiros-altos',
    name: 'Pinheiros Altos',
    courses: ['pinheiros-altos'],
    summary: 'Two driving ranges with room for up to 30 players, two putting greens, a chipping and bunker area, and three teaching bays with a Titleist fitting centre. Visitors can pay a day fee to practise.',
    items: [
      { label: 'Driving range', detail: 'Two ranges, with space for up to 30 players at a time.' },
      { label: 'Short game', detail: 'A chipping area with a practice bunker.' },
      { label: 'Putting', detail: 'Two practice putting greens.' },
      { label: 'Teaching bays', detail: 'Three fully equipped teaching bays with V1 video analysis, one of them a Titleist custom fitting centre.' },
    ],
    balls: { price: 'Practice day fee €25 with unlimited balls, or €15 after 13:30', source: { label: 'Pinheiros Altos Golf Academy', url: 'https://pinheirosaltosgolfacademy.com/' } },
    academy: 'pinheiros-altos-golf-academy',
    sources: [
      { label: 'Pinheiros Altos golf academy page', url: 'https://www.pinheirosaltos.com/golf-academy' },
      { label: 'Pinheiros Altos Golf Academy', url: 'https://pinheirosaltosgolfacademy.com/' },
    ],
  },
  {
    id: 'penina',
    pageCourse: 'penina-championship',
    name: 'Penina',
    courses: ['penina-championship', 'penina-resort'],
    summary: 'An 80-metre-wide driving range on natural Bermuda grass, with target greens, a chipping green, a practice bunker and a putting green. The nine-hole Resort Course needs no handicap certificate, so it is a good next step after the range.',
    items: [
      { label: 'Driving range', detail: '80 metres wide, all on natural Bermuda grass, with target greens.' },
      { label: 'Short game', detail: 'A chipping green and a practice bunker.' },
      { label: 'Putting', detail: 'A putting green at the golf academy.' },
      { label: 'Short courses', detail: 'The nine-hole Resort Course and the nine-hole Academy Course.' },
    ],
    balls: { price: 'Basket of 50 balls €6 (on the 2024/25 visitors price list, the newest Penina publishes)', source: { label: 'Penina visitors price list 2024/2025 (PDF)', url: 'https://www.penina.com/media/4666496/2024_2025-pgc_visitors-price-list.pdf' } },
    academy: 'penina-golf-academy',
    sources: [
      { label: 'Penina Golf Academy', url: 'https://www.penina.com/golf/penina-golf-academy/' },
      { label: 'Penina visitors price list 2024/2025 (PDF)', url: 'https://www.penina.com/media/4666496/2024_2025-pgc_visitors-price-list.pdf' },
    ],
  },
  {
    id: 'morgado-alamos',
    pageCourse: 'morgado',
    name: 'Morgado and Álamos',
    courses: ['morgado', 'alamos'],
    summary: 'Two natural-grass practice tees with 35 bays each, ten target greens marked every 50 metres, two chipping greens with bunkers and several putting greens.',
    items: [
      { label: 'Driving range', detail: 'Two natural-grass practice tees with room for 35 players each, and ten target greens marked every 50 metres.' },
      { label: 'Short game', detail: 'Two chipping greens with practice bunkers.' },
      { label: 'Putting', detail: 'Putting greens at each practice tee and next to the 1st tee of Álamos.' },
      { label: 'Warm-up', detail: 'Two warm-up zones near the clubhouse.' },
    ],
    academy: 'morgado-golf-academy',
    sources: [
      { label: 'NAU golf academy page', url: 'https://www.nauhotels.com/en/golf/golf-academy' },
      { label: 'Morgado do Reguengo Golf Academy', url: 'https://www.nauhotels.com/en/nau-morgado-golf-country-club/golf/morgado-do-reguengo-golf-academy' },
    ],
  },
  {
    id: 'quinta-da-ria',
    pageCourse: 'quinta-da-ria',
    name: 'Quinta da Ria',
    courses: ['quinta-da-ria', 'quinta-de-cima'],
    summary: 'A 300-metre driving range with 70 grass bays and 5 covered bays, a Foresight simulator at the range, a chipping area with a bunker, putting greens at both courses and a nine-hole pitch-and-putt academy course.',
    items: [
      { label: 'Driving range', detail: '300 metres long, with 70 natural-grass bays on north and south tees and 5 covered bays on artificial mats. Some zones are kept for the professionals\' lessons.' },
      { label: 'Simulator', detail: 'A Foresight golf simulator at the range.' },
      { label: 'Short game', detail: 'A chipping area with a practice bunker.' },
      { label: 'Putting', detail: 'Putting greens at both Quinta da Ria and Quinta de Cima.' },
      { label: 'Academy course', detail: 'A nine-hole pitch-and-putt academy course.' },
    ],
    academy: 'quinta-da-ria-golf-lessons',
    sources: [{ label: 'Quinta da Ria practice facilities', url: 'https://www.quintadaria.com/practice-facilities/' }],
  },
  {
    id: 'quinta-do-vale',
    pageCourse: 'quinta-do-vale',
    name: 'Quinta do Vale',
    courses: ['quinta-do-vale'],
    summary: 'A very large driving range in two zones (room for 95 players in all), a chipping green with a bunker, putting greens and a new short-game academy course.',
    items: [
      { label: 'Driving range', detail: '26,788 m², split into a south side for up to 30 players and a north side for 65.' },
      { label: 'Short game', detail: 'A chipping green with a bunker beside it, plus several chipping and pitching areas.' },
      { label: 'Putting', detail: 'A putting green near the north side of the range and another near the 1st tee.' },
      { label: 'Academy course', detail: 'The newest addition: a short-game course that becomes seven teaching areas for group lessons in peak season.' },
    ],
    academy: 'quinta-da-ria-golf-lessons',
    sources: [{ label: 'Quinta do Vale practice facilities', url: 'https://www.quintadovalegolf.com/practice-facilities/' }],
  },
  {
    id: 'espiche',
    pageCourse: 'espiche',
    name: 'Espiche Golf',
    courses: ['espiche'],
    summary: 'A driving range for up to 29 players on both natural grass and mats, a 400 m² putting green and an 800 m² chipping area, renewed in early 2025.',
    items: [
      { label: 'Driving range', detail: 'Room for up to 29 players, with both natural grass and artificial mats.' },
      { label: 'Short game', detail: 'An 800 m² chipping area.' },
      { label: 'Putting', detail: 'A 400 m² putting green.' },
    ],
    academy: 'espiche-golf-academy',
    sources: [{ label: 'Espiche Golf Academy', url: 'https://www.espichegolf.pt/en/golf/golf-academy/' }],
  },
  {
    id: 'santo-antonio',
    pageCourse: 'santo-antonio',
    name: 'Santo António Golf',
    courses: ['santo-antonio'],
    summary: 'A driving range with 10 open-air and 4 covered practice tees, a putting green beside it and a short-game area behind the 1st tee with a chipping green and bunkers.',
    items: [
      { label: 'Driving range', detail: '10 open-air and 4 covered practice tees.' },
      { label: 'Short game', detail: 'A short-game area behind the 1st tee with a chipping green and bunkers.' },
      { label: 'Putting', detail: 'A practice putting green next to the range (one of four around the resort) and another in the short-game area.' },
    ],
    balls: { price: 'Token of 48 balls €4; range card of 10 tokens €37.50 (2026)', source: { label: 'Santo António golf rates 2026 (PDF)', url: 'https://webbox-assets.siteminder.com/assets/dlfyrswchjblukgy/83f0a354-f815-428c-98cb-c4c6ed8bfc93.pdf' } },
    sources: [{ label: 'Santo António golf page', url: 'https://www.saresorts.com/golf.html' }],
  },
  {
    id: 'pestana',
    name: 'Pestana Golf',
    courses: ['gramacho', 'vale-da-pinta', 'silves', 'alto-golf', 'vila-sol'],
    summary: 'The Pestana Golf Academy has covered hitting bays, eight target greens, a chipping area with practice bunkers and a large putting green. Range tokens are on Pestana\'s price list.',
    items: [
      { label: 'Driving range', detail: 'Covered hitting bays and eight target greens at the Pestana Golf Academy.' },
      { label: 'Short game', detail: 'A chipping area and practice bunkers.' },
      { label: 'Putting', detail: 'A large putting green.' },
    ],
    balls: { price: 'Driving range token (50 balls) €7', source: PESTANA_PRICES },
    academy: 'pestana-golf-academy',
    sources: [
      { label: 'Pestana Golf academy', url: 'https://pestanagolf.com/golf/#academia' },
      PESTANA_PRICES,
    ],
  },
  {
    id: 'castro-marim',
    pageCourse: 'castro-marim',
    name: 'Castro Marim Golfe',
    courses: ['castro-marim'],
    summary: 'A driving range with balls sold in three bucket sizes, and a range card that doubles your credit when you top it up with €50 or more.',
    items: [
      { label: 'Driving range', detail: 'Balls by the bucket, or with a rechargeable range card.' },
      { label: 'Lessons', detail: 'Golf clinics, group lessons and short-game lessons with the club professional.' },
    ],
    balls: { price: '25 balls €5, 55 balls €9, 110 balls €17 (2026). Range card: 100% bonus when topped up with at least €50', source: { label: 'Castro Marim public price list 2026 (PDF)', url: 'https://castromarimresort.com/wp-content/uploads/2026/01/RACK-RATE-PUBLIC-2026-act.pdf' } },
    academy: 'castro-marim-golf-academy',
    sources: [
      { label: 'Castro Marim public price list 2026 (PDF)', url: 'https://castromarimresort.com/wp-content/uploads/2026/01/RACK-RATE-PUBLIC-2026-act.pdf' },
      { label: 'Castro Marim golf academy', url: 'https://castromarimresort.com/en/golf/academy/' },
    ],
  },
  {
    id: 'balaia',
    pageCourse: 'balaia',
    name: 'Balaia Golf',
    courses: ['balaia'],
    summary: 'A practice range next to the clubhouse, with range balls from €2 a bucket.',
    items: [
      { label: 'Practice range', detail: 'Next to the clubhouse; the club presents it mainly as a place to work on your short game.' },
    ],
    balls: { price: 'Bucket of 24 balls €2, 48 balls €4; a spare club to practise with €10 (2025-26)', source: { label: 'Balaia green-fee rates 2025-26 (PDF)', url: 'https://www.balaiagolfvillage.com/media/f2qggqu4/golf-fees-2025-1.pdf' } },
    sources: [
      { label: 'Balaia Golf Club', url: 'https://www.balaiagolfvillage.com/en/balaia-golf-club/' },
      { label: 'Balaia green-fee rates 2025-26 (PDF)', url: 'https://www.balaiagolfvillage.com/media/f2qggqu4/golf-fees-2025-1.pdf' },
    ],
  },
  {
    id: 'vilamoura',
    name: 'Vilamoura',
    courses: ['vilamoura-old-course', 'vilamoura-pinhal', 'vilamoura-laguna', 'vilamoura-millennium'],
    summary: 'Each of the four Vilamoura courses has its own practice facilities, with a driving range, putting green and chipping area. The Vilamoura Golf Academy is based at the Pinhal course, whose clubhouse looks over the range.',
    items: [
      { label: 'Driving range', detail: 'A range at each course. The academy is at Pinhal, where the clubhouse looks over the range.' },
      { label: 'Short game', detail: 'A chipping area at each course.' },
      { label: 'Putting', detail: 'A putting green at each course.' },
    ],
    academy: 'vilamoura-golf-academy',
    sources: [
      { label: 'Vilamoura Golf Academy', url: 'https://www.vilamouragolf.com/en/academy/' },
      { label: 'Vilamoura Pinhal course page', url: 'https://www.vilamouragolf.com/en/golf-courses/pinhal/' },
    ],
  },
  {
    id: 'quinta-do-lago',
    name: 'Quinta do Lago',
    courses: ['quinta-do-lago-south', 'quinta-do-lago-north', 'quinta-do-lago-laranjal'],
    summary: 'Two practice ranges, one at Quinta do Lago and one at Laranjal, plus the Paul McGinley Golf Academy and a TaylorMade Performance Centre for club fitting.',
    items: [
      { label: 'Driving range', detail: 'Two practice ranges: one at Quinta do Lago and one at Laranjal.' },
      { label: 'Club fitting', detail: 'The TaylorMade Performance Centre.' },
    ],
    academy: 'quinta-do-lago-golf-academy',
    sources: [{ label: 'Quinta do Lago golf', url: 'https://www.quintadolago.com/en/golf/' }],
  },
  {
    id: 'vale-do-lobo',
    name: 'Vale do Lobo',
    courses: ['vale-do-lobo-royal', 'vale-do-lobo-ocean'],
    summary: 'The Vale do Lobo Golf Academy has a netted hitting area rather than an open driving range, plus a grass short-game area with bunkers and a putting green by the clubhouse.',
    items: [
      { label: 'Hitting area', detail: 'A netted practice area, used for warming up and for lessons.' },
      { label: 'Short game', detail: 'A grass short-game area with bunkers.' },
      { label: 'Putting', detail: 'A putting green next to the clubhouse.' },
    ],
    academy: 'vale-do-lobo-golf-academy',
    sources: [{ label: 'Vale do Lobo Golf Academy', url: 'https://www.valedolobo.com/en/resort/services-facilities/golf-academy/' }],
  },
  {
    id: 'amendoeira',
    name: 'Amendoeira',
    courses: ['amendoeira-faldo', 'amendoeira-oconnor'],
    summary: 'A driving range, putting greens and long and short game practice areas, plus a floodlit nine-hole par-3 academy course between the two championship courses.',
    items: [
      { label: 'Driving range', detail: 'Part of the Amendoeira Golf Academy.' },
      { label: 'Short game', detail: 'Long and short game practice areas.' },
      { label: 'Putting', detail: 'Practice putting greens.' },
      { label: 'Academy course', detail: 'A floodlit nine-hole par-3 course, suited to beginners and to sharpening your short game.' },
    ],
    academy: 'amendoeira-golf-academy',
    sources: [{ label: 'Amendoeira golf page', url: 'https://www.amendoeiraresort.com/en/golf/' }],
  },
  {
    id: 'monte-rei',
    name: 'Monte Rei',
    courses: ['monte-rei'],
    summary: 'A driving range, short-game areas and a putting green, improved as part of the 2026 course renovation, plus a Swing Studio for teaching and club fitting.',
    items: [
      { label: 'Practice', detail: 'Driving range, short-game areas and putting green; the practice facilities were improved in the 2026 renovation.' },
      { label: 'Swing Studio', detail: 'Indoor studio for teaching and club fitting.' },
    ],
    academy: 'monte-rei-golf-academy',
    sources: [
      { label: 'Monte Rei golf', url: 'https://www.monte-rei.com/en/golf/' },
      { label: 'Monte Rei Golf Academy', url: 'https://www.monte-rei.com/en/golf/golf-academy/' },
    ],
  },
  {
    id: 'pine-cliffs',
    name: 'Pine Cliffs',
    courses: ['pine-cliffs'],
    summary: 'A driving range used by the Pine Cliffs Golf Academy. Range balls are included in all the resort\'s unlimited-golf packages.',
    items: [
      { label: 'Driving range', detail: 'Range balls are included in every Unlimited Golf package; you can hire three clubs for the range for €7.' },
    ],
    academy: 'pine-cliffs-golf-academy',
    sources: [{ label: 'Pine Cliffs golf price list 2025/26 (PDF)', url: 'https://www.pinecliffs.com/wp-content/uploads/2025/10/PCR-GOLF-PRECARIO25-26-V3-B_.pdf' }],
  },
  {
    id: 'boavista',
    name: 'Boavista',
    courses: ['boavista'],
    summary: 'A short-game area with three greens (one for putting, one for chipping and one surrounded by bunkers) and a driving range.',
    items: [
      { label: 'Short game', detail: 'Three greens: one for putting, one for chipping and one surrounded by bunkers.' },
      { label: 'Driving range', detail: 'Temporarily closed for repair work (see note).' },
    ],
    notice: 'Boavista says its driving range is currently closed for repair work and will reopen when the work is finished. It gives no reopening date, so check with the club before you go.',
    academy: 'boavista-golf-academy',
    sources: [{ label: 'Boavista golf: about the course', url: 'https://www.boavistaresort.pt/en/Menu/Golf/About-the-Course.aspx' }],
  },
  {
    id: 'salgados',
    name: 'Salgados',
    courses: ['salgados'],
    summary: 'A short-game practice area with a putting green and a chipping green. The club also has golf simulators.',
    items: [
      { label: 'Short game', detail: 'A short-game practice area and a chipping green.' },
      { label: 'Putting', detail: 'A putting green.' },
      { label: 'Simulators', detail: 'Golf simulators, bookable online.' },
      { label: 'Driving range', detail: 'Not mentioned on the club\'s own website, although independent course listings say there is one. Ask the club when you book.' },
    ],
    sources: [{ label: 'Salgados Golf: the course', url: 'https://salgadosgolf.com/the-course' }],
  },
  {
    id: 'ombria',
    name: 'Ombria',
    courses: ['ombria'],
    summary: 'A chipping green and a putting green.',
    items: [
      { label: 'Short game', detail: 'A chipping green.' },
      { label: 'Putting', detail: 'A putting green.' },
    ],
    sources: [{ label: 'Ombria golf course', url: 'https://www.ombria.com/en/golf/golf-course/' }],
  },
]

export function getPracticeGround(courseSlug: string): PracticeGround | undefined {
  return PRACTICE_GROUNDS.find(g => g.courses.includes(courseSlug))
}

export const practicePageHref = (g: PracticeGround) =>
  g.pageCourse ? `/courses/${g.pageCourse}/practice-facilities` : null
