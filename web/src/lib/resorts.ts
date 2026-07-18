export interface ResortPage {
  slug: string
  label: string
  hotelSlug: string
  courseSlugs: string[]
  description: string
}

export const RESORT_PAGES: ResortPage[] = [
  {
    slug: 'quinta-do-lago',
    label: 'Quinta do Lago',
    hotelSlug: 'hotel-quinta-do-lago',
    courseSlugs: ['quinta-do-lago-south', 'quinta-do-lago-north', 'quinta-do-lago-laranjal'],
    description:
      'Quinta do Lago is the flagship estate of the Golden Triangle, pairing the five-star Hotel Quinta do Lago with three championship courses — South, North, and Laranjal — reachable on foot from the hotel. The South Course has hosted the Portuguese Open nine times, making this one of the most complete golf resort bases in continental Europe.',
  },
  {
    slug: 'vale-do-lobo',
    label: 'Vale do Lobo',
    hotelSlug: 'dona-filipa-hotel',
    courseSlugs: ['vale-do-lobo-ocean', 'vale-do-lobo-royal'],
    description:
      'The five-star Dona Filipa Hotel sits within the exclusive Vale do Lobo estate, a two-minute walk from the beach and with complimentary transfers to the legendary San Lorenzo course. The estate\'s own Royal and Ocean courses complete 36 holes of parkland golf, with the Royal\'s clifftop finishing stretch among the most photographed in European golf.',
  },
  {
    slug: 'penina',
    label: 'Penina Hotel & Golf Resort',
    hotelSlug: 'penina-hotel',
    courseSlugs: ['penina-championship', 'penina-resort'],
    description:
      'Penina Hotel & Golf Resort is built around Portugal\'s first purpose-built golf course, Sir Henry Cotton\'s 1966 Championship layout, on a 360-acre parkland estate near Portimão. The five-star hotel adds a 9-hole Academy Course for warm-ups and beginners, six dining venues, and a golf academy on the same historic grounds.',
  },
  {
    slug: 'monte-rei',
    label: 'Monte Rei',
    hotelSlug: 'monte-rei-hotel',
    courseSlugs: ['monte-rei'],
    description:
      'Monte Rei pairs villa and apartment residences on a private 1,000-acre eastern Algarve estate with a Jack Nicklaus Signature course widely ranked the best in Portugal. The estate is also home to Vistas by Rui Silvestre, a Michelin-starred restaurant, making it one of the region\'s most exclusive golf-and-dining destinations.',
  },
  {
    slug: 'palmares',
    label: 'Palmares',
    hotelSlug: 'palmares-beach-house',
    courseSlugs: ['palmares'],
    description:
      'The boutique five-star Palmares Beach House Hotel sits between the 27th green and the driving range of the Palmares course, overlooking Meia Praia beach and Lagos Bay. Robert Trent Jones Jr.\'s 27-hole redesign spans clifftop and lakeside terrain, giving guests direct access to one of the western Algarve\'s most scenic layouts.',
  },
  {
    slug: 'amendoeira-golf-resort',
    label: 'Amendoeira Golf Resort',
    hotelSlug: 'amendoeira-golf-resort',
    courseSlugs: ['amendoeira-faldo', 'amendoeira-oconnor'],
    description:
      'Amendoeira Golf Resort near Silves offers self-catering apartments and villas alongside two acclaimed 18-hole courses — Nick Faldo\'s par-72 design and Christy O\'Connor Jr.\'s more forgiving companion layout. Two pools, six tennis courts, and a full sports club make it a self-sufficient base away from the coast.',
  },
  {
    slug: 'nau-morgado',
    label: 'NAU Morgado Golf & Country Club',
    hotelSlug: 'nau-morgado-golf-country-club',
    courseSlugs: ['morgado', 'alamos'],
    description:
      'The 4-star NAU Morgado Golf & Country Club sits in the hills above Portimão between two contrasting courses: Ronald Fream\'s par-73 Morgado layout and the more secluded Alamos Golf. All 98 rooms have balconies overlooking the fairways, with a golf academy at the clubhouse for guests fine-tuning their game.',
  },
  {
    slug: 'boavista-golf-spa-resort',
    label: 'Boavista Golf & Spa Resort',
    hotelSlug: 'boavista-golf-spa-resort',
    courseSlugs: ['boavista'],
    description:
      'Boavista Golf & Spa Resort is a five-star holiday village on the hills above Lagos, pairing townhouse and apartment accommodation with an 18-hole course carved into the hillside above the town. Howard Swan\'s design mixes rocky Algarvian terrain and cork-oak woodland with sweeping sea views, complemented by an indoor spa, sauna, and steam room back at the resort.',
  },
  {
    slug: 'ombria',
    label: 'Ombria Algarve',
    hotelSlug: 'viceroy-ombria',
    courseSlugs: ['ombria'],
    description:
      'The Viceroy at Ombria Algarve is a luxury eco-resort in the hills near Querença, built alongside one of the Algarve\'s newest and most acclaimed courses. Opened in 2023 and designed by Jorge Santana da Silva, Ombria Golf traces the protected Barrocal landscape of carob and olive trees, winning multiple European design awards in its first season.',
  },
  {
    slug: 'balaia-golf-village',
    label: 'Balaia Golf Village Resort',
    hotelSlug: 'balaia-golf-village',
    courseSlugs: ['balaia'],
    description:
      'Balaia Golf Village Resort is a 4-star, self-catering hillside estate near Albufeira built around a relaxed 9-hole, par-3 course — ideal for beginners, families, or a low-pressure afternoon round. Six outdoor pools, two restaurants, and a spa round out one of the most family-friendly golf resorts on the central Algarve coast.',
  },
  {
    slug: 'castro-marim-golf-resort',
    label: 'Castro Marim Golf Resort',
    hotelSlug: 'castro-marim-golf-club',
    courseSlugs: ['castro-marim'],
    description:
      'Castro Marim Golfe & Country Club is a 230-hectare resort at the far eastern edge of the Algarve, between the Guadiana River and the Atlantic near the Spanish border. Private village houses with hot tubs or fireplaces sit alongside an 18-hole, par-72 course dating to 1993 — a quieter, less-crowded alternative to the central Algarve resorts.',
  },
  {
    slug: 'robinson-quinta-da-ria',
    label: 'Robinson Club Quinta da Ria',
    hotelSlug: 'robinson-quinta-da-ria',
    courseSlugs: ['quinta-da-ria', 'quinta-de-cima'],
    description:
      'Robinson Club Quinta da Ria is a 4-star all-inclusive beach and golf resort in the unspoiled eastern Algarve, set between its own two Rocky Roquemore-designed courses, Quinta da Ria and Quinta de Cima. Several holes run directly alongside the Ria Formosa natural park, and every room has balconies over either the fairways or the reserve.',
  },
  {
    slug: 'victoria-golf-resort',
    label: 'Victoria Golf Resort & Spa',
    hotelSlug: 'victoria-golf-resort',
    courseSlugs: ['victoria-els-club'],
    description:
      'Victoria Golf Resort & Spa is a five-star, 260-room hotel in Vilamoura directly adjacent to the Arnold Palmer-designed Els Club course, a former host of the Portugal Masters now run as a private members club. Guests of the hotel get an exclusive daily tee-time arrangement on the course, alongside four pools and four restaurants.',
  },
  {
    slug: 'pestana-carvoeiro',
    label: 'Pestana Carvoeiro Golf Resort',
    hotelSlug: 'pestana-gramacho-residences',
    courseSlugs: ['gramacho'],
    description:
      'Pestana Gramacho Residences is a 4-star golf aparthotel within 500 metres of the Gramacho clubhouse at the Pestana Carvoeiro resort near Carvoeiro. Ronald Fream\'s par-72 Gramacho course winds through natural valleys and rocky Algarve terrain, with a shuttle bus connecting residence guests to the wider Pestana course network.',
  },
  {
    slug: 'pine-cliffs',
    label: 'Pine Cliffs Resort',
    hotelSlug: 'pine-cliffs-residence',
    courseSlugs: ['pine-cliffs'],
    description:
      'Pine Cliffs Resort is a five-star Luxury Collection property perched on the red sandstone cliffs above Praia da Falésia near Albufeira, with direct beach access via a cliffside lift. Its own 9-hole, par-33 course — designed by Sir Henry Cotton — is famous for the Devil\'s Parlour, a par-3 played clean over the clifftop edge.',
  },
]

const hotelToResortSlugMap = new Map<string, string>()
const courseToResortSlugMap = new Map<string, string>()
for (const resort of RESORT_PAGES) {
  hotelToResortSlugMap.set(resort.hotelSlug, resort.slug)
  for (const courseSlug of resort.courseSlugs) {
    courseToResortSlugMap.set(courseSlug, resort.slug)
  }
}

export function resortSlugForHotel(hotelSlug: string): string | null {
  return hotelToResortSlugMap.get(hotelSlug) ?? null
}

export function resortSlugForCourse(courseSlug: string): string | null {
  return courseToResortSlugMap.get(courseSlug) ?? null
}
