// "Golf near <town>" pages for popular places to stay that have no golf course of
// their own (or whose courses belong to a neighbouring town page). They share the
// /[town]/golf-courses route with the TOWN_PAGES in src/lib/towns.ts, but list the
// courses by drive time from the town centre instead of the courses in the town.
//
// Drive times: src/data/nearTownDriveTimes.ts (research/town-pages-2026-11/drive_times.py).
// If you change a town's lat/lng here, re-run that script so the times match.
// Copy supports **bold** and [text](/path). Facts are from our course data and
// verified_course_facts; keep drive-time wording in step with the generated times.

export interface NearTownPage {
  slug: string
  label: string
  lat: number
  lng: number
  intro: string[]
  // Town pages for the neighbouring courses, linked from the intro box.
  related: { label: string; href: string }[]
  // Guide posts to show, in order (only published ones appear).
  guides: string[]
  // Radius for "where to stay in <town>" hotels, from the town centre.
  hotelRadiusKm: number
}

export const NEAR_TOWN_PAGES: NearTownPage[] = [
  {
    slug: 'alvor',
    label: 'Alvor',
    lat: 37.1290, lng: -8.5935,
    intro: [
      "Alvor is a former fishing village on the Alvor estuary, just west of Portimão, and a handy base for the Sir Henry Cotton courses. [Alto Golf](/courses/alto-golf), Cotton's last design, opened in 1991 on the edge of the village and is about 5 minutes away by car. [Penina](/courses/penina-championship), the Algarve's first golf course, opened in 1966 and is about 15 minutes away on the road to Portimão.",
      "Penina also has a 9-hole [Resort course](/courses/penina-resort) that needs no handicap certificate, which suits beginners or a short round on arrival day. Within about 25 minutes you can also reach Pestana Ferragudo, Vale da Pinta and Gramacho near Carvoeiro, Morgado, and Palmares and Boavista near Lagos. To choose between the two closest, read [Alto Golf vs Penina](/guide/alto-golf-vs-penina-championship-which-portimao-course-should-you-play).",
    ],
    related: [{ label: 'Portimão golf courses', href: '/portimao/golf-courses' }, { label: 'Lagos golf courses', href: '/lagos/golf-courses' }],
    guides: [
      'alto-golf-vs-penina-championship-which-portimao-course-should-you-play',
      'faro-airport-to-portimao-and-alvor-for-golfers',
      'how-much-does-a-golf-trip-to-lagos-and-portimao-cost',
      'alamos-vs-morgado-which-portimao-golf-course-should-you-play',
    ],
    hotelRadiusKm: 3,
  },
  {
    slug: 'quarteira',
    label: 'Quarteira',
    lat: 37.0697, lng: -8.1003,
    intro: [
      "Quarteira is the seaside town next door to Vilamoura, and few places in the Algarve have more golf within a short drive. [Pestana Vila Sol](/courses/vila-sol), the [Old Course](/courses/vilamoura-old-course) and [Pinhal](/courses/vilamoura-pinhal) are about 10 minutes away, and Laguna, Millennium and the two [Vale do Lobo](/courses/vale-do-lobo-royal) courses about 15.",
      "Quinta do Lago and Pinheiros Altos, in the Golden Triangle, are about 20 minutes east. Quarteira has a long beachfront promenade and a mix of hotels and apartments, so it works well if you want a beach town with the Vilamoura courses on the doorstep.",
    ],
    related: [{ label: 'Vilamoura golf courses', href: '/vilamoura/golf-courses' }, { label: 'Vale do Lobo golf courses', href: '/vale-do-lobo/golf-courses' }, { label: 'Almancil golf courses', href: '/almancil/golf-courses' }],
    guides: [
      'faro-airport-to-vilamoura-with-golf-clubs',
      'vilamoura-old-course-vs-millennium-which-one-should-you-play',
      'vilamoura-laguna-vs-pinhal-which-course-should-you-play',
    ],
    hotelRadiusKm: 2.5,
  },
  {
    slug: 'armacao-de-pera',
    label: 'Armação de Pêra',
    lat: 37.1025, lng: -8.3575,
    intro: [
      "Armação de Pêra is a beach town between Albufeira and Carvoeiro. The closest course is [Salgados](/courses/salgados), about 10 minutes east, laid out around lakes next to the Salgados lagoon. [Amendoeira](/courses/amendoeira-faldo), with its Faldo and O'Connor Jr. courses, is about 15 minutes inland near Alcantarilha.",
      "Within about 20 minutes you can also reach the [Silves](/courses/silves) course and [Vale de Milho](/courses/vale-de-milho) in Carvoeiro, a 9-hole course that needs no handicap certificate. Vale da Pinta, Gramacho, Balaia and Pestana Ferragudo are about 25 minutes away. To choose between the two closest, read [Salgados vs Amendoeira](/guide/salgados-vs-amendoeira-which-golf-course-near-albufeira-should-you-play).",
    ],
    related: [{ label: 'Albufeira golf courses', href: '/albufeira/golf-courses' }, { label: 'Silves golf courses', href: '/silves/golf-courses' }, { label: 'Carvoeiro golf courses', href: '/carvoeiro/golf-courses' }],
    guides: [
      'salgados-vs-amendoeira-which-golf-course-near-albufeira-should-you-play',
      'cheapest-golf-near-albufeira',
      'faro-airport-to-carvoeiro-and-silves-for-golfers',
    ],
    hotelRadiusKm: 3,
  },
  {
    slug: 'praia-da-luz',
    label: 'Praia da Luz',
    lat: 37.0880, lng: -8.7280,
    intro: [
      "Praia da Luz is a small beach resort a few kilometres west of Lagos. [Boavista](/courses/boavista), on the hillside between Luz and Lagos, is about 10 minutes away by car. [Espiche](/courses/espiche), which opened in 2012 just inland at the village of Espiche, and [Santo António](/courses/santo-antonio) at Parque da Floresta, towards Sagres, are both about 15 minutes away.",
      "[Palmares](/courses/palmares), on the far side of Lagos by Meia Praia, and the Penina courses near Portimão are about 25 minutes away. To choose between the two closest, read [Boavista vs Espiche](/guide/boavista-vs-espiche-which-lagos-golf-course-should-you-play).",
    ],
    related: [{ label: 'Lagos golf courses', href: '/lagos/golf-courses' }, { label: 'Vila do Bispo golf courses', href: '/vila-do-bispo/golf-courses' }],
    guides: [
      'boavista-vs-espiche-which-lagos-golf-course-should-you-play',
      'palmares-vs-boavista-which-lagos-golf-course-should-you-play',
      'faro-airport-to-lagos-with-golf-clubs',
      'how-much-does-a-golf-trip-to-lagos-and-portimao-cost',
    ],
    hotelRadiusKm: 3,
  },
  {
    slug: 'monte-gordo',
    label: 'Monte Gordo',
    lat: 37.1801, lng: -7.4517,
    intro: [
      "Monte Gordo is the beach resort at the far eastern end of the Algarve, next to Vila Real de Santo António and the Spanish border. The nearest courses are [Quinta do Vale](/courses/quinta-do-vale), a Seve Ballesteros design, and [Castro Marim Golf](/courses/castro-marim), both about 20 minutes inland near Castro Marim.",
      "[Quinta da Ria](/courses/quinta-da-ria) and [Quinta de Cima](/courses/quinta-de-cima) near Vila Nova de Cacela, [Benamor](/courses/benamor) near Tavira and [Monte Rei](/courses/monte-rei), the Jack Nicklaus course in the hills, are all about 25 minutes away. The central Algarve courses around Quinta do Lago and Vilamoura are 50 minutes or more each way.",
    ],
    related: [{ label: 'Castro Marim golf courses', href: '/castro-marim/golf-courses' }, { label: 'Tavira golf courses', href: '/tavira/golf-courses' }],
    guides: [
      'castro-marim-vs-quinta-do-vale-which-east-algarve-course-should-you-play',
      'hotels-near-castro-marim-golf',
      'faro-airport-to-tavira-and-monte-rei-with-golf-clubs',
      'quinta-da-ria-vs-quinta-de-cima-which-tavira-course-should-you-play',
    ],
    hotelRadiusKm: 2.5,
  },
  {
    slug: 'olhos-de-agua',
    label: 'Olhos de Água',
    lat: 37.0905, lng: -8.1905,
    intro: [
      "Olhos de Água is a small beach village just east of Albufeira, with two short courses about 5 minutes away: [Pine Cliffs](/courses/pine-cliffs), a 9-hole clifftop course that needs no handicap certificate, and [Balaia](/courses/balaia), a 9-hole course of par 3s.",
      "For 18 holes, Laguna, Millennium and the Old Course in Vilamoura are about 15 minutes away, and Pinhal, Pestana Vila Sol and [Salgados](/courses/salgados) about 20 to 25. To choose between the two short courses, read [Balaia vs Pine Cliffs](/guide/balaia-vs-pine-cliffs-which-quick-round-near-albufeira-should-you-play).",
    ],
    related: [{ label: 'Albufeira golf courses', href: '/albufeira/golf-courses' }, { label: 'Vilamoura golf courses', href: '/vilamoura/golf-courses' }],
    guides: [
      'balaia-vs-pine-cliffs-which-quick-round-near-albufeira-should-you-play',
      'cheapest-golf-near-albufeira',
      'faro-airport-to-albufeira-with-golf-clubs',
    ],
    hotelRadiusKm: 2.5,
  },
  {
    slug: 'faro',
    label: 'Faro',
    lat: 37.0175, lng: -7.9340,
    intro: [
      "Faro is the Algarve's capital and home to its main airport, but there is no golf course in the city itself. The closest courses are west of Faro in the Golden Triangle: [Quinta do Lago Laranjal](/courses/quinta-do-lago-laranjal) is about 20 minutes away by car, [Pinheiros Altos](/courses/pinheiros-altos) about 25, and the Quinta do Lago North and South courses about 30.",
      "Vale do Lobo, Pestana Vila Sol and the Old Course and Pinhal in Vilamoura are about 30 minutes away. [San Lorenzo](/courses/san-lorenzo), also close by, is closed for renovation until mid-2028. Faro suits a short break or a round on the day you fly; for more golf on your doorstep, look at [Almancil](/almancil/golf-courses) or [Vilamoura](/vilamoura/golf-courses).",
    ],
    related: [{ label: 'Almancil golf courses', href: '/almancil/golf-courses' }, { label: 'Loulé golf courses', href: '/loule/golf-courses' }],
    guides: [
      'faro-airport-to-algarve-golf-courses',
      'faro-airport-to-quinta-do-lago-vale-do-lobo-with-golf-clubs',
      'hiring-golf-clubs-at-faro-airport',
    ],
    hotelRadiusKm: 2.5,
  },
  {
    slug: 'sagres',
    label: 'Sagres',
    lat: 37.0086, lng: -8.9400,
    intro: [
      "Sagres, at the south-western tip of the Algarve near Cape St Vincent, has no golf course of its own. The nearest is [Santo António](/courses/santo-antonio) at Parque da Floresta near Budens, a Pepe Gancedo course from 1987, about 20 minutes east by car.",
      "Beyond that, [Boavista](/courses/boavista) and [Espiche](/courses/espiche) near Lagos are about 35 minutes away, and [Palmares](/courses/palmares) about 50. If golf is the main reason for your trip, [Praia da Luz](/praia-da-luz/golf-courses) or [Lagos](/lagos/golf-courses) puts you closer to more courses.",
    ],
    related: [{ label: 'Vila do Bispo golf courses', href: '/vila-do-bispo/golf-courses' }, { label: 'Lagos golf courses', href: '/lagos/golf-courses' }],
    guides: [
      'boavista-vs-espiche-which-lagos-golf-course-should-you-play',
      'palmares-vs-boavista-which-lagos-golf-course-should-you-play',
      'faro-airport-to-lagos-with-golf-clubs',
    ],
    hotelRadiusKm: 3,
  },
]
