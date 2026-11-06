import type { CoursePrice } from '@/types/database'

// Verified buggy facts per course, from each club's own price list, rules or
// booking engine. Evidence for every entry: research/buggies-2026-11/buggy_findings.tsv.
// Only add what an official source states. Where it is silent, say "contact the course".

export const BUGGY_LAST_CHECKED = 'November 2026'

export type BuggyStatus =
  | 'priced' // hire price published and current
  | 'included' // green fee includes a buggy
  | 'available' // buggies exist, no current hire price published
  | 'none' // the club says it has no buggies
  | 'unconfirmed' // no official statement either way

export interface BuggySource {
  label: string
  url: string
}

export interface BuggyOffer {
  text: string
  until: string // ISO date; the offer is hidden after this date
}

export interface BuggyInfo {
  status: BuggyStatus
  summary: string // one complete sentence or two, also used on the green-fees page
  addOn?: number // 18-hole hire price, only when status is 'priced'
  rules?: string[]
  notes?: string[]
  offers?: BuggyOffer[]
  sources: BuggySource[]
}

const PESTANA_PRICES: BuggySource = { label: 'Pestana Golf price list', url: 'https://pestanagolf.com/price-list/' }
const PESTANA_NOTE = 'Pestana lists a twilight buggy at €40. A 9-hole buggy price is not published.'
const PESTANA: Omit<BuggyInfo, 'sources'> = {
  status: 'priced',
  addOn: 55,
  summary: 'Buggy hire costs €55 for 18 holes.',
  notes: [PESTANA_NOTE],
}

const PENINA: BuggyInfo = {
  status: 'available',
  summary: "Buggies are available. The club's last published price list (2024/25) showed €55 for 18 holes and €35 for 9, but it has expired, so contact the course for the current price.",
  rules: ['No more than two people in a buggy.', 'Buggies can be restricted because of the weather.'],
  sources: [{ label: 'Penina 2024/25 visitor price list', url: 'https://www.penina.com/media/4666496/2024_2025-pgc_visitors-price-list.pdf' }],
}

const QDL_NOT_INCLUDED = 'A buggy is not included in the green fee, and buggy hire is available. Contact the course for the price.'
const QDL_RULES = ['Buggies can be driven by players aged 16 and over.']
const QDL_WINTER: BuggyOffer = {
  text: 'Winter offer, 1 December to 31 January: €170 per person for two players sharing a buggy.',
  until: '2027-01-31',
}

const VDL: Omit<BuggyInfo, 'sources'> = {
  status: 'available',
  summary: 'Buggy hire is available, but the price is not published. Contact the course for the price. Adults paying the full Sunset green fee get a shared buggy included.',
  rules: [
    'A maximum of two people in a buggy.',
    'Players under 16 may not drive.',
    'Buggies can only be driven on the golf courses, never on public roads.',
  ],
}
const VDL_SOURCE: BuggySource = { label: 'Vale do Lobo 2026 etiquette and rules', url: 'https://www.valedolobo.com/wp-content/uploads/2026/03/2026_etiquette_rules-1.pdf' }

const VILAMOURA_RULES = [
  'Buggies must stay on the buggy paths, or in the rough where there are no paths.',
  'A maximum of two players and two club bags per buggy.',
  'Only the club’s own buggies are allowed on the course.',
  'The course manager can stop buggies being used when necessary to protect the course.',
]
const VILAMOURA_SOURCE: BuggySource = { label: 'Vilamoura Golf rules and regulations', url: 'https://www.vilamouragolf.com/en/rules-and-regulations/' }
const VILAMOURA: BuggyInfo = {
  status: 'available',
  summary: 'Buggies are available, but the hire price is not published. Contact the course for the price.',
  rules: VILAMOURA_RULES,
  sources: [VILAMOURA_SOURCE],
}

const RIA_WINTER: BuggyOffer[] = [
  { text: 'Winter offer, December 2026: €120 for one player with a buggy, or €220 for two players sharing one.', until: '2026-12-31' },
  { text: 'Winter offer, January 2027: €125 for one player with a buggy, or €230 for two players sharing one.', until: '2027-01-31' },
]
const RIA_SOURCE: BuggySource = { label: 'Quinta da Ria special offers', url: 'https://www.quintadaria.com/special-offers/' }

export const BUGGIES: Record<string, BuggyInfo> = {
  'alto-golf': { ...PESTANA, sources: [PESTANA_PRICES] },
  gramacho: {
    ...PESTANA,
    rules: ['The 90-degree rule always applies.', 'Whoever hires the buggy is liable for it under the hire agreement.'],
    sources: [PESTANA_PRICES, { label: 'Pestana Gramacho club rules', url: 'https://pestanagolf.com/gramacho/' }],
  },
  'vale-da-pinta': { ...PESTANA, sources: [PESTANA_PRICES] },
  silves: { ...PESTANA, sources: [PESTANA_PRICES] },
  'vila-sol': { ...PESTANA, sources: [PESTANA_PRICES] },
  'pestana-ferragudo': {
    status: 'available',
    summary: 'Buggies are available, as Pestana sells rates that include one, but Ferragudo is not on its buggy hire price table. Contact the course for the price.',
    sources: [PESTANA_PRICES],
  },
  salgados: {
    status: 'priced',
    addOn: 50,
    summary: 'Buggy hire costs €50 for 18 holes or €40 for 9 holes.',
    notes: ['The club publishes these prices as valid until 31 December 2026.'],
    sources: [{ label: 'Salgados Golf rates and policies', url: 'https://salgadosgolf.com/rates-2' }],
  },
  benamor: {
    status: 'priced',
    addOn: 48,
    summary: 'Buggy hire costs €48 for 18 holes or €36 for 9 holes.',
    sources: [{ label: 'Benamor Golf rentals', url: 'https://www.benamorgolf.com/en/rentals/' }],
  },
  boavista: {
    status: 'priced',
    addOn: 45,
    summary: 'Buggy hire costs €45. The club’s tariff does not say whether this is for 18 or 9 holes, so check when you book.',
    rules: ['A maximum of two players and two golf bags per buggy.', 'No one under 18 may drive a buggy hired at the course.'],
    sources: [
      { label: 'Boavista golf tariff', url: 'https://www.boavistaresort.pt/en/Menu/Golf/Tariff.aspx' },
      { label: 'Boavista golf rules', url: 'https://www.boavistaresort.pt/Files/Golf/G%20Rules%20UK.pdf' },
    ],
  },
  'santo-antonio': {
    status: 'priced',
    addOn: 40,
    summary: 'Buggy hire costs €40 for 18 holes or €25 for 9 holes.',
    notes: ['The club lists a buggy as recommended and says its buggies do not have GPS.'],
    sources: [{ label: 'Santo António golf page and 2026 rates', url: 'https://www.saresorts.com/golf.html' }],
  },
  'castro-marim': {
    status: 'priced',
    addOn: 45,
    summary: 'Buggy hire costs €45 for 18 holes or €28 for 9 holes.',
    sources: [{ label: 'Castro Marim 2026 public price list', url: 'https://castromarimresort.com/wp-content/uploads/2026/01/RACK-RATE-PUBLIC-2026-act.pdf' }],
  },
  'penina-championship': PENINA,
  'penina-resort': PENINA,
  ombria: {
    status: 'included',
    summary: 'A shared buggy is included in the green fee, subject to availability.',
    rules: [
      'You must be 18 or over to use a buggy.',
      'A second buggy may be charged if you do not want to share.',
      'Whoever hires the buggy is responsible for any damage or loss.',
      'The club can limit buggy access to the course at any time.',
    ],
    sources: [{ label: 'Ombria rules and regulations', url: 'https://www.ombria.com/uploads/files/F_OMB_Golf_RulesRegulaions_2024.pdf' }],
  },
  'monte-rei': {
    status: 'included',
    summary: 'A buggy is listed as part of the standard and twilight green fees.',
    rules: ['Players under 18 may not drive a buggy.'],
    sources: [
      { label: 'Monte Rei online booking', url: 'https://eu.golfmanager.com/monterei' },
      { label: 'Monte Rei course rules', url: 'https://www.monte-rei.com/en/course-rules-regulations/' },
    ],
  },
  'amendoeira-faldo': {
    status: 'included',
    summary: 'The online green fee includes a buggy, if one is available.',
    sources: [{ label: 'Amendoeira online booking', url: 'https://amendoeira.golfmanager.com/consumer/portal' }],
  },
  'amendoeira-oconnor': {
    status: 'included',
    summary: 'The online green fee includes a buggy, if one is available.',
    sources: [{ label: 'Amendoeira online booking', url: 'https://amendoeira.golfmanager.com/consumer/portal' }],
  },
  'quinta-do-lago-south': {
    status: 'available',
    summary: QDL_NOT_INCLUDED,
    rules: QDL_RULES,
    sources: [{ label: 'Quinta do Lago South Course and online booking', url: 'https://www.quintadolago.com/en/golf/golf-courses-south/' }],
  },
  'quinta-do-lago-north': {
    status: 'available',
    summary: QDL_NOT_INCLUDED,
    rules: QDL_RULES,
    offers: [QDL_WINTER],
    sources: [{ label: 'Quinta do Lago North Course and online booking', url: 'https://www.quintadolago.com/en/golf/golf-courses-north/' }],
  },
  'quinta-do-lago-laranjal': {
    status: 'available',
    summary: QDL_NOT_INCLUDED,
    rules: QDL_RULES,
    offers: [QDL_WINTER],
    sources: [{ label: 'Quinta do Lago Laranjal Course and online booking', url: 'https://www.quintadolago.com/en/golf/golf-courses-laranjal/' }],
  },
  'vale-do-lobo-ocean': { ...VDL, sources: [VDL_SOURCE, { label: 'Vale do Lobo online booking', url: 'https://eu.golfmanager.com/valedolobo' }] },
  'vale-do-lobo-royal': { ...VDL, sources: [VDL_SOURCE, { label: 'Vale do Lobo online booking', url: 'https://eu.golfmanager.com/valedolobo' }] },
  'vilamoura-old-course': VILAMOURA,
  'vilamoura-millennium': VILAMOURA,
  'vilamoura-pinhal': VILAMOURA,
  'vilamoura-laguna': {
    ...VILAMOURA,
    offers: [{
      text: 'Laguna on Wheels: a free shared buggy on new bookings made by 31 December 2026, for play from 19 October 2026 to 31 December 2027. Not valid 1 April to 31 May or 16 September to 18 October 2027.',
      until: '2026-12-31',
    }],
    sources: [VILAMOURA_SOURCE, { label: 'Laguna on Wheels offer', url: 'https://www.vilamouragolf.com/en/offers/laguna-wheels/' }],
  },
  palmares: {
    status: 'available',
    summary: 'Buggies are available, but the hire price is not published. Contact the course at golf@palmaresresort.com for the price. Some online rates include a shared buggy, if one is available.',
    sources: [{ label: 'Palmares online booking', url: 'https://palmares.golfmanager.com/consumer/portal' }],
  },
  espiche: {
    status: 'available',
    summary: 'Buggies are available, but a separate hire price is not published. Contact the course for the price. The online booking system sells rates that include a buggy, and their prices vary by date.',
    sources: [{ label: 'Espiche online booking', url: 'https://espiche.golfmanager.com/consumer/home' }],
  },
  'quinta-da-ria': {
    status: 'available',
    summary: 'Buggies are available, but a separate hire price is not published. Contact the course for the price.',
    offers: RIA_WINTER,
    sources: [RIA_SOURCE],
  },
  'quinta-de-cima': {
    status: 'available',
    summary: 'Buggies are available, but a separate hire price is not published. Contact the course for the price.',
    offers: RIA_WINTER,
    sources: [RIA_SOURCE, { label: 'Quinta de Cima online booking', url: 'https://quintadaria.golfmanager.com/consumer/home' }],
  },
  'quinta-do-vale': {
    status: 'available',
    summary: 'Buggies are available, but a separate hire price is not published. Contact the course for the price.',
    offers: [{ text: 'Special offer until 30 November 2026: €130 for one player with a buggy, or €225 for two players sharing one.', until: '2026-11-30' }],
    sources: [{ label: 'Quinta do Vale special offers', url: 'https://www.quintadovalegolf.com/special-offers/' }],
  },
  morgado: {
    status: 'available',
    summary: 'Buggies are available, but the current price is not published. Contact the course for the price and to check whether your rate includes one.',
    sources: [{ label: 'NAU Morgado golf course', url: 'https://www.nauhotels.com/en/golf/morgado-golf-course' }],
  },
  alamos: {
    status: 'available',
    summary: 'Buggies are available, but the current price is not published. Contact the course for the price and to check whether your rate includes one.',
    sources: [{ label: 'Morgado and Álamos online booking', url: 'https://morgadoalamos.golfmanager.com/consumer/home' }],
  },
  'pinheiros-altos': {
    status: 'unconfirmed',
    summary: 'We could not find current buggy details from an official source. Contact the course for availability and prices.',
    sources: [],
  },
  'vale-de-milho': {
    status: 'none',
    summary: 'The club does not have buggies to hire, but it does offer trolleys.',
    sources: [{ label: 'Vale de Milho fees', url: 'https://valedemilhogolf.com/fees/' }],
  },
  'pine-cliffs': {
    status: 'unconfirmed',
    summary: 'The club’s price list has manual and electric trolleys but no buggies. Contact the course to check before you play.',
    sources: [{ label: 'Pine Cliffs 2025/26 price list', url: 'https://www.pinecliffs.com/wp-content/uploads/2025/10/PCR-GOLF-PRECARIO25-26-V3-B_.pdf' }],
  },
  balaia: {
    status: 'unconfirmed',
    summary: 'The club’s price list has a pull trolley but no buggies. Contact the course to check before you play.',
    sources: [{ label: 'Balaia 2025/26 green-fee rates', url: 'https://www.balaiagolfvillage.com/media/f2qggqu4/golf-fees-2025-1.pdf' }],
  },
}

export function getBuggyInfo(slug: string): BuggyInfo | null {
  return BUGGIES[slug] ?? null
}

export function activeOffers(info: BuggyInfo, now: Date = new Date()): BuggyOffer[] {
  const today = now.toISOString().slice(0, 10)
  return (info.offers ?? []).filter(o => o.until >= today)
}

// Replaces the buggy fields on price rows with the verified facts above, because the
// values stored with the prices did not all come from official sources.
export function applyBuggyFacts(slug: string, prices: CoursePrice[]): CoursePrice[] {
  const info = getBuggyInfo(slug)
  return prices.map(p => ({
    ...p,
    buggy_included: info?.status === 'included',
    buggy_price: info?.status === 'priced' ? info.addOn ?? null : null,
  }))
}

export function buggySentence(slug: string): string {
  return getBuggyInfo(slug)?.summary ?? 'Contact the course about buggies.'
}

export function buggyFaqAnswer(slug: string): string {
  const info = getBuggyInfo(slug)
  if (!info) return 'Contact the course about buggies.'
  if (info.status === 'included') return `Yes. ${info.summary}`
  if (info.status === 'priced' || info.status === 'none') return `No. ${info.summary}`
  return info.summary
}
