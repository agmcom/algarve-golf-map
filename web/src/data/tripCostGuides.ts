// Which "How much does a golf trip to X cost" Guide post each course links to.
// Courses not listed link to the general Algarve guide.

export interface TripCostGuide {
  place: string
  href: string
}

const guide = (place: string, slug: string): TripCostGuide => ({ place, href: `/guide/how-much-does-a-golf-trip-to-${slug}-cost` })

const ALBUFEIRA = guide('Albufeira', 'albufeira')
const QUINTA_DO_LAGO = guide('Quinta do Lago', 'quinta-do-lago')
const VALE_DO_LOBO = guide('Vale do Lobo', 'vale-do-lobo')
const VILAMOURA = guide('Vilamoura', 'vilamoura')
const MONTE_REI = guide('Monte Rei', 'monte-rei')
const LAGOS_PORTIMAO = guide('Lagos and Portimão', 'lagos-and-portimao')
export const GENERAL_TRIP_COST_GUIDE = guide('the Algarve', 'the-algarve')

const BY_COURSE: Record<string, TripCostGuide> = {
  salgados: ALBUFEIRA,
  'amendoeira-faldo': ALBUFEIRA,
  'amendoeira-oconnor': ALBUFEIRA,
  balaia: ALBUFEIRA,
  'pine-cliffs': ALBUFEIRA,
  'quinta-do-lago-south': QUINTA_DO_LAGO,
  'quinta-do-lago-north': QUINTA_DO_LAGO,
  'quinta-do-lago-laranjal': QUINTA_DO_LAGO,
  'vale-do-lobo-royal': VALE_DO_LOBO,
  'vale-do-lobo-ocean': VALE_DO_LOBO,
  'vilamoura-old-course': VILAMOURA,
  'vilamoura-pinhal': VILAMOURA,
  'vilamoura-laguna': VILAMOURA,
  'vilamoura-millennium': VILAMOURA,
  'monte-rei': MONTE_REI,
  'quinta-de-cima': MONTE_REI,
  'castro-marim': MONTE_REI,
  'alto-golf': LAGOS_PORTIMAO,
  morgado: LAGOS_PORTIMAO,
  alamos: LAGOS_PORTIMAO,
  boavista: LAGOS_PORTIMAO,
  espiche: LAGOS_PORTIMAO,
  palmares: LAGOS_PORTIMAO,
  'penina-championship': LAGOS_PORTIMAO,
  'penina-resort': LAGOS_PORTIMAO,
  'santo-antonio': LAGOS_PORTIMAO,
}

export function tripCostGuideFor(slug: string): TripCostGuide {
  return BY_COURSE[slug] ?? GENERAL_TRIP_COST_GUIDE
}
