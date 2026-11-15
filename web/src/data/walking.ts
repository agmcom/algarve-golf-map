// "Walking the course": how walkable each course is, from the club or independent golf guides.
// Evidence: research/walkable-2026-11/walkability_findings.tsv and research/hilly-2026-11/hilly_findings.tsv.
// Wording matches the published Guide posts "algarve-golf-courses-you-can-walk" and
// "hilly-golf-courses-in-the-algarve". Only add a course when a source describes its terrain;
// courses without an entry show no section.

export const WALKING_LAST_CHECKED = 'November 2026'

// easy = flat or short, moderate = some slopes, buggy optional, hard = hilly, buggy advised
export type WalkLevel = 'easy' | 'moderate' | 'hard'

export interface WalkSource {
  label: string
  url: string
}

export interface WalkingInfo {
  level: WalkLevel
  label: string // short terrain tag shown as a pill
  summary: string
  sources: WalkSource[]
}

const tt = (slug: string): WalkSource => ({ label: 'Teetimes.pt', url: `https://www.teetimes.pt/golf-course/${slug}/` })
const W2G = (path: string): WalkSource => ({ label: 'Where2Golf', url: `https://www.where2golf.com/portugal/${path}/` })

export const WALKING: Record<string, WalkingInfo> = {
  // ── Easy: flat or short ──
  'salgados': {
    level: 'easy',
    label: 'Flat',
    summary: 'One of the easiest courses in the Algarve to walk. The club describes it as set on the flatlands behind Praia da Galé, Where2Golf says players generally walk it, and Teetimes.pt calls it totally flat, with a buggy optional. Flat doesn\'t mean easy, though: there\'s plenty of water, and the site is exposed to the wind.',
    sources: [
      { label: 'Salgados Golf Club', url: 'https://salgadosgolf.com/the-course' },
      W2G('salgados-golf-course'),
      tt('salgados'),
    ],
  },
  'penina-championship': {
    level: 'easy',
    label: 'Flat',
    summary: 'Teetimes.pt lists it as flat, with some gentle slopes on the approaches to the greens. The club mentions subtle slopes and raised greens.',
    sources: [
      { label: 'Penina Hotel & Golf Resort', url: 'https://www.penina.com/golf/golf-courses/sir-henry-cotton-championship-course/' },
      { label: 'Golfbreaks', url: 'https://www.golfbreaks.com/en-gb/holidays/alvor/penina-hotel-golf-resort/championship-course/' },
      tt('penina-championship'),
    ],
  },
  'quinta-do-lago-laranjal': {
    level: 'easy',
    label: 'Flat',
    summary: 'Teetimes.pt describes it as flat, with no severe slopes, and easy to walk. It\'s exposed, so expect to feel any breeze.',
    sources: [tt('laranjal')],
  },
  'vilamoura-millennium': {
    level: 'easy',
    label: 'Flat',
    summary: 'Teetimes.pt lists it as flat, with minor slopes.',
    sources: [tt('vilamoura-millennium')],
  },
  'amendoeira-oconnor': {
    level: 'easy',
    label: 'Flat',
    summary: 'The course stays down in the valley on flat terrain among orange groves, according to Teetimes.pt, unlike the Faldo course on the hillside. The online green fee includes a buggy, if one is available, so walking won\'t save you money here.',
    sources: [tt('amendoeira-oconnor'), { label: 'Amendoeira online booking', url: 'https://amendoeira.golfmanager.com/consumer/portal' }],
  },
  'vilamoura-laguna': {
    level: 'easy',
    label: 'Mostly flat',
    summary: 'Golfbreaks describes Laguna as a flatter, more open links-style layout than the pine-lined Vilamoura courses nearby.',
    sources: [{ label: 'Golfbreaks', url: 'https://www.golfbreaks.com/en-gb/holidays/vilamoura/laguna-golf-course/' }],
  },
  'quinta-da-ria': {
    level: 'easy',
    label: 'Gently rolling',
    summary: 'The club describes gently sloping terrain leading towards the Ria Formosa. Teetimes.pt mentions long rolling slopes and calls it a fairly flat course.',
    sources: [{ label: 'Quinta da Ria', url: 'https://www.quintadaria.com/' }, tt('quinta-ria')],
  },
  'quinta-de-cima': {
    level: 'easy',
    label: 'Gently rolling',
    summary: 'Gentle, long rolling fairways with few major inclines, according to Teetimes.pt, which calls it a fairly flat course.',
    sources: [tt('quinta-cima')],
  },
  'penina-resort': {
    level: 'easy',
    label: 'Short and flat',
    summary: 'A 9-hole course that Teetimes.pt lists as flat and easy walking. At 2,987 metres from the white tees, it\'s still a proper 9-hole course.',
    sources: [tt('penina-resort')],
  },
  'pine-cliffs': {
    level: 'easy',
    label: 'Short and flat',
    summary: 'A 9-hole course that Teetimes.pt describes as flat with slight rolling slopes. The club\'s price list has manual and electric trolleys but no buggies, so check with the course first if you might need to ride.',
    sources: [tt('pine-cliffs-golf'), { label: 'Pine Cliffs 2025/26 price list', url: 'https://www.pinecliffs.com/wp-content/uploads/2025/10/PCR-GOLF-PRECARIO25-26-V3-B_.pdf' }],
  },
  'vale-de-milho': {
    level: 'easy',
    label: 'Short',
    summary: 'At 926 metres, this is the shortest course we track and an easy round on foot. The club doesn\'t have buggies to hire, but it does offer trolleys.',
    sources: [{ label: 'Vale de Milho fees', url: 'https://valedemilhogolf.com/fees/' }],
  },

  // ── Moderate: some slopes, buggy optional ──
  'balaia': {
    level: 'moderate',
    label: 'Short, some slopes',
    summary: 'A short par-3 course, though Teetimes.pt notes it\'s hilly for a par 3. A pull trolley is on the club\'s price list.',
    sources: [tt('balaia'), { label: 'Balaia 2025/26 green-fee rates', url: 'https://www.balaiagolfvillage.com/media/f2qggqu4/golf-fees-2025-1.pdf' }],
  },
  'espiche': {
    level: 'moderate',
    label: 'Some slopes',
    summary: 'The club calls the course enjoyable to walk, while also mentioning elevation changes. Teetimes.pt says the back nine climbs into the hills, so it suits fit walkers best.',
    sources: [{ label: 'Espiche Golf', url: 'https://www.espichegolf.pt/en/golf/golf-course/' }, tt('espiche')],
  },
  'quinta-do-lago-south': {
    level: 'moderate',
    label: 'Some slopes',
    summary: 'Rolling fairways, and Teetimes.pt lists a buggy as optional.',
    sources: [tt('quinta-lago-south')],
  },
  'vilamoura-pinhal': {
    level: 'moderate',
    label: 'Some slopes',
    summary: 'The club mentions challenging elevation changes. Teetimes.pt says the undulation is mainly on the back nine, but still lists a buggy as optional.',
    sources: [{ label: 'Vilamoura Golf', url: 'https://www.vilamouragolf.com/en/golf-courses/pinhal/' }, tt('vilamoura-pinhal')],
  },
  'vilamoura-old-course': {
    level: 'moderate',
    label: 'Some slopes',
    summary: 'Teetimes.pt describes rolling fairways with some minor steep slopes, and says you only need a buggy if it\'s essential for you.',
    sources: [tt('vilamoura-old-course')],
  },
  'vila-sol': {
    level: 'moderate',
    label: 'Some slopes',
    summary: 'Mainly sweeping fairways, according to Teetimes.pt, which says you only need a buggy if it\'s essential for you.',
    sources: [tt('vila-sol')],
  },
  'vale-da-pinta': {
    level: 'moderate',
    label: 'Some slopes',
    summary: 'Rolling fairways. Teetimes.pt says you only need a buggy if it\'s essential for you.',
    sources: [tt('vale-pinta')],
  },
  'pinheiros-altos': {
    level: 'moderate',
    label: 'Some slopes',
    summary: 'Teetimes.pt says the Olives nine is flat, while the Pines and Corks nines are more undulating. It lists a buggy as needed only if it\'s essential for you.',
    sources: [tt('pinheiros-altos')],
  },
  'alto-golf': {
    level: 'moderate',
    label: 'Some slopes',
    summary: 'Teetimes.pt describes the course as undulating, with sloping greens, and lists a buggy as needed only if it\'s essential for you.',
    sources: [tt('alto')],
  },
  'vale-do-lobo-royal': {
    level: 'moderate',
    label: 'Some climbs',
    summary: 'Golf guides disagree here. Teetimes.pt mentions some steep climbs on the back nine, while Where2Golf says the course isn\'t particularly hilly and that players generally walk it, though it notes several slopes to climb and a few longish green-to-tee walks.',
    sources: [tt('vale-lobo-royal'), W2G('vale-do-lobo-golf-club-royal-course')],
  },

  // ── Hard: hilly, buggy advised ──
  'morgado': {
    level: 'hard',
    label: 'Hillier back nine',
    summary: 'Rolling terrain that gets hillier on the back nine, according to Teetimes.pt, which recommends a buggy.',
    sources: [tt('morgado')],
  },
  'alamos': {
    level: 'hard',
    label: 'Hillier back nine',
    summary: 'Teetimes.pt recommends a buggy because of the back nine.',
    sources: [tt('alamos')],
  },
  'silves': {
    level: 'hard',
    label: 'Hillier back nine',
    summary: 'Rolling fairways that aren\'t steep, according to Teetimes.pt, with more elevation change on the back nine. The same guide recommends a buggy.',
    sources: [tt('silves')],
  },
  'gramacho': {
    level: 'hard',
    label: 'Hilly',
    summary: 'Teetimes.pt describes hilly terrain, though the same guide says you only need a buggy if it\'s essential for you.',
    sources: [tt('gramacho')],
  },
  'santo-antonio': {
    level: 'hard',
    label: 'Hilly',
    summary: 'The club says its course runs over hills behind the village of Salema and recommends a buggy. Teetimes.pt describes severe slopes on and across most fairways, with rarely a flat lie.',
    sources: [{ label: 'Santo António golf page', url: 'https://www.saresorts.com/golf.html' }, tt('santo-antonio')],
  },
  'castro-marim': {
    level: 'hard',
    label: 'Hilly',
    summary: 'Hills and valleys. Teetimes.pt says the course is quite short in length but hard to walk, and calls a buggy essential. The club quotes a magazine\'s description of its "undulating contours".',
    sources: [{ label: 'Castro Marim Golfe', url: 'https://castromarimresort.com/en/golf' }, tt('castro-marim')],
  },
  'boavista': {
    level: 'hard',
    label: 'Hilly',
    summary: 'The front nine rises to a high tee at the 9th before the back nine drops into a valley of lakes, according to Teetimes.pt, which calls a buggy essential.',
    sources: [tt('boavista')],
  },
  'quinta-do-vale': {
    level: 'hard',
    label: 'Hilly',
    summary: 'The course sits in a natural valley above the Guadiana River. Teetimes.pt says the back nine is more undulating and calls a buggy essential.',
    sources: [tt('quinta-vale')],
  },
  'quinta-do-lago-north': {
    level: 'hard',
    label: 'Buggy advised',
    summary: 'Teetimes.pt calls a buggy essential on this course.',
    sources: [tt('quinta-lago-north')],
  },
  'vale-do-lobo-ocean': {
    level: 'hard',
    label: 'Buggy advised',
    summary: 'Where2Golf says parts of the Ocean course are hillier than the Royal, and Teetimes.pt says the back nine is more undulating and calls a buggy essential.',
    sources: [W2G('vale-do-lobo-golf-club-ocean-course'), tt('vale-lobo-ocean')],
  },
  'benamor': {
    level: 'hard',
    label: 'Hilly',
    summary: 'Very undulating fairways and prominent hills in parts of the course, according to Teetimes.pt, which recommends a buggy.',
    sources: [tt('benamor')],
  },
  'palmares': {
    level: 'hard',
    label: 'Hilly',
    summary: 'The club describes a course between ocean and hills, with the rolling hills of its Lagos nine. Teetimes.pt also notes real elevation change on the Alvor nine.',
    sources: [{ label: 'Palmares', url: 'https://www.palmaresliving.com/golf/golf-course/' }, tt('palmares')],
  },
  'ombria': {
    level: 'hard',
    label: 'Hilly',
    summary: 'Ombria sits in the hills north of Loulé, and the club\'s own hole notes mention a sharp descent, a sharp hillside and a high vantage point. The green fee includes a shared buggy, subject to availability.',
    sources: [{ label: 'Ombria', url: 'https://www.ombria.com/en/golf/golf-course/' }, tt('ombria-golf-course')],
  },
  'monte-rei': {
    level: 'hard',
    label: 'Hilly',
    summary: 'The course lies in the foothills of the Serra do Caldeirão. Where2Golf describes several slopes to climb and lists a golf cart as compulsory, and the club\'s online booking includes a buggy in the green fee.',
    sources: [W2G('monte-rei-golf-country-club-north-course'), { label: 'Monte Rei online booking', url: 'https://eu.golfmanager.com/monterei' }],
  },
  'amendoeira-faldo': {
    level: 'hard',
    label: 'Hilly',
    summary: 'The Faldo course climbs the hillside, in the words of Teetimes.pt, while its sister O\'Connor course stays in the valley. The online green fee includes a buggy, if one is available.',
    sources: [tt('amendoeira-faldo'), { label: 'Amendoeira online booking', url: 'https://amendoeira.golfmanager.com/consumer/portal' }],
  },
}

export function getWalkingInfo(slug: string): WalkingInfo | null {
  return WALKING[slug] ?? null
}
