export interface TownPage {
  slug: string
  label: string
  towns: string[]
  description: string
}

export const TOWN_PAGES: TownPage[] = [
  {
    slug: 'vilamoura',
    label: 'Vilamoura',
    towns: ['Vilamoura'],
    description:
      'Vilamoura is the Algarve\'s premier golf destination, home to five world-class courses set around a luxury marina and resort complex. With immaculate fairways, consistent year-round conditions, and a concentration of top-rated layouts within minutes of each other, Vilamoura is the first choice for serious golf visitors to Portugal.',
  },
  {
    slug: 'almancil',
    label: 'Almancil & The Golden Triangle',
    towns: ['Almancil · Golden Triangle', 'Almancil · Ria Formosa'],
    description:
      'The Golden Triangle — centred on Almancil between Faro and Vilamoura — is home to some of the Algarve\'s most exclusive golf courses, including the legendary Quinta do Lago layouts and Pinheiros Altos. This compact area offers championship-level golf alongside five-star resorts and fine dining, making it one of Europe\'s most sought-after golf destinations.',
  },
  {
    slug: 'vale-do-lobo',
    label: 'Vale do Lobo',
    towns: ['Vale do Lobo'],
    description:
      'Vale do Lobo is a prestigious private resort on the Algarve\'s southern coast, offering two outstanding golf courses cut through umbrella pines and clifftop terrain. The Royal Course\'s iconic par-3 over the ocean cliffs is one of the most photographed holes in European golf.',
  },
  {
    slug: 'albufeira',
    label: 'Albufeira',
    towns: ['Albufeira'],
    description:
      'Albufeira and its surrounding coastline offer a diverse range of golf experiences, from the dramatic clifftop holes of Pine Cliffs to the inland parkland of Salgados and Balaia. The area is well-served by resorts and short transfers from Faro Airport, making it a popular base for golf holidays on the central Algarve coast.',
  },
  {
    slug: 'carvoeiro',
    label: 'Carvoeiro',
    towns: ['Carvoeiro'],
    description:
      'Carvoeiro on the western central Algarve is home to the outstanding Pestana Golf Resort, with two acclaimed courses — Gramacho and Vale da Pinta — carved into ancient olive and carob terrain. The compact, hilly layouts and distinctive rock formations make this one of the most visually striking golf areas in the region.',
  },
  {
    slug: 'silves',
    label: 'Silves',
    towns: ['Silves'],
    description:
      'The inland area around historic Silves offers some of the Algarve\'s finest modern golf, led by the twin Amendoeira courses designed by Nick Faldo and Christy O\'Connor Jr. Set in rolling countryside away from the coast, this area rewards those seeking top-quality golf in a quieter, more scenic setting.',
  },
  {
    slug: 'portimao',
    label: 'Portimão',
    towns: ['Portimão'],
    description:
      'Portimão and its surroundings are home to some of the most varied golf in the western Algarve, including the historic Penina Championship Course — the first purpose-built golf course in Portugal — alongside Alto Golf, Morgado, and Alamos. The area suits players of all handicaps with a wide range of price points and course styles.',
  },
  {
    slug: 'lagos',
    label: 'Lagos',
    towns: ['Lagos'],
    description:
      'Lagos in the western Algarve offers a compelling trio of golf courses, including the spectacular 27-hole Palmares layout above Meia Praia beach and the sea-view hillside design of Boavista. This less-crowded corner of the Algarve delivers excellent golf with a more relaxed, authentic atmosphere.',
  },
  {
    slug: 'loule',
    label: 'Loulé',
    towns: ['Loulé'],
    description:
      'The Loulé municipality is home to Ombria Golf, a stunning modern course set in the foothills of the Serra do Caldeirão nature reserve. Designed by Architect Rui Paredes and managed by the Viceroy Ombria Resort, it represents a new standard in sustainable Algarve golf tourism.',
  },
  {
    slug: 'tavira',
    label: 'Tavira',
    towns: ['Tavira · East Algarve'],
    description:
      'The Tavira area in the eastern Algarve is home to a cluster of excellent and often less-busy courses including Monte Rei, Quinta da Ria, Quinta de Cima, and Benamor. With the Ria Formosa Natural Park nearby and a more traditional Portuguese character, this is the ideal destination for golfers who want quality courses without the western crowds.',
  },
  {
    slug: 'castro-marim',
    label: 'Castro Marim',
    towns: ['Castro Marim · East Algarve'],
    description:
      'Castro Marim, at the far eastern tip of the Algarve near the Spanish border, offers two fine golf courses in a peaceful, uncrowded setting. Castro Marim Golf and Quinta do Vale provide quality layouts with wide fairways and excellent value, often overlooked by visitors who don\'t venture beyond the central Algarve.',
  },
  {
    slug: 'vila-do-bispo',
    label: 'Vila do Bispo',
    towns: ['Vila do Bispo'],
    description:
      'Vila do Bispo at the southwestern tip of Portugal is home to Santo António Golf, a scenic 9-hole course near Sagres with Atlantic views and a remote, end-of-the-world atmosphere. It\'s a unique stop for golfers exploring the wild Costa Vicentina.',
  },
  {
    slug: 'ferragudo',
    label: 'Ferragudo',
    towns: ['Ferragudo'],
    description:
      'Ferragudo, a charming fishing village on the western Algarve coast, is home to Pestana Ferragudo Golf — a new course set on clifftop terrain overlooking the Arade estuary. With dramatic ocean views and easy access from Portimão, it is a welcome addition to the Algarve\'s golf offering.',
  },
]

const townToSlugMap = new Map<string, string>()
for (const page of TOWN_PAGES) {
  for (const t of page.towns) {
    townToSlugMap.set(t, page.slug)
  }
}

export function townSlug(town: string): string | null {
  return townToSlugMap.get(town) ?? null
}
