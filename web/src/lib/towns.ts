export interface TownPage {
  slug: string
  label: string
  towns: string[]
  description: string
  // Longer hand-written copy shown under the description; supports **bold** and [text](/path).
  more?: string[]
}

export const TOWN_PAGES: TownPage[] = [
  {
    slug: 'vilamoura',
    label: 'Vilamoura',
    towns: ['Vilamoura'],
    description:
      'Vilamoura has five golf courses around the marina town: the Old Course, Pinhal, Laguna and Millennium, run together as Vilamoura Golf, plus Pestana Vila Sol. The Old Course, designed by Frank Pennink, opened in 1969 and is one of the oldest in the Algarve; Millennium, by Martin Hawtree, opened in 2000 and is the newest of the five.',
    more: [
      "The five courses suit different games. The [Old Course](/courses/vilamoura-old-course), remodelled by Martin Hawtree and reopened in 1997, plays through mature umbrella pines and was named Portugal's Best Golf Course at the 2025 World Golf Awards. [Pinhal](/courses/vilamoura-pinhal), the second course built in Vilamoura in 1976, is the classic pine-lined option, while [Laguna](/courses/vilamoura-laguna) is open and exposed, with lakes beside eleven of its eighteen holes and the wind much more of a factor.",
      "For higher handicappers, [Millennium](/courses/vilamoura-millennium) is the most forgiving of the five: flat, easy to walk and wide open on the back nine. The four Vilamoura Golf courses set a handicap limit of 28 for men and 36 for ladies, and the club's rules let beginners and higher handicappers play with the course manager's permission, so ask well before your trip. [Pestana Vila Sol](/courses/vila-sol), a Donald Steel design from 1991, is slightly stricter at 27 and 35. For head-to-head comparisons, read [Old Course vs Millennium](/guide/vilamoura-old-course-vs-millennium-which-one-should-you-play) and [Laguna vs Pinhal](/guide/vilamoura-laguna-vs-pinhal-which-course-should-you-play).",
    ],
  },
  {
    slug: 'almancil',
    label: 'Almancil & The Golden Triangle',
    towns: ['Almancil · Golden Triangle', 'Almancil · Ria Formosa'],
    description:
      'Almancil sits at the heart of the Golden Triangle, between Faro and Vilamoura. Its courses are the three Quinta do Lago layouts — South, North and Laranjal — plus Pinheiros Altos and San Lorenzo, all close to the Ria Formosa. The Quinta do Lago South and North courses date from 1974 and are among the most expensive rounds in the Algarve.',
    more: [
      "[Quinta do Lago South](/courses/quinta-do-lago-south) has hosted the Portuguese Open eight times and is still regarded as one of the toughest rounds in the Algarve. [North](/courses/quinta-do-lago-north) was rebuilt from scratch in 2014 by Beau Welling with former Ryder Cup captain Paul McGinley, adding four sets of tees on every hole, which makes it the more forgiving choice. [Laranjal](/courses/quinta-do-lago-laranjal), the youngest of the three, opened in 2009 on a former orange grove and is one of the best-reviewed courses on our map.",
      "Next door, [Pinheiros Altos](/courses/pinheiros-altos) offers 27 holes as three interchangeable nines, although recent player reviews flag patchy conditioning, and [San Lorenzo](/courses/san-lorenzo) runs along the edge of the Ria Formosa lagoon. When we last checked, San Lorenzo was operating from temporary facilities after a fire destroyed its clubhouse, with access usually through partner hotels. Quinta do Lago requires a handicap certificate, except when you play with one of the teaching professionals at its Paul McGinley Academy.",
    ],
  },
  {
    slug: 'vale-do-lobo',
    label: 'Vale do Lobo',
    towns: ['Vale do Lobo'],
    description:
      'Vale do Lobo is a coastal resort west of Quinta do Lago with two 18-hole courses, the Ocean and the Royal. Sir Henry Cotton designed the original layout, which opened in 1968, and the Royal Course, designed by Rocky Roquemore from Cotton\'s original drawings, followed in 1997.',
    more: [
      "The [Royal Course](/courses/vale-do-lobo-royal) builds to its 16th hole, a 235-yard par 3 played from a tee on top of sandstone cliffs above the Atlantic and one of the most photographed holes in Europe. The [Ocean Course](/courses/vale-do-lobo-ocean) is the original: two Cotton nines from 1968 and 1972, later joined into an 18-hole par 73 that moves through mature woodland towards the coast. It is the gentler walk of the two.",
      "Both courses charge the same green fees and set a handicap limit of 28 for men and 36 for ladies. The five-star Dona Filipa Hotel sits inside the estate, within walking distance of both first tees, and offers transfers to neighbouring San Lorenzo. The three Quinta do Lago courses are a short drive east. Read [Royal vs Ocean](/guide/vale-do-lobo-royal-vs-vale-do-lobo-ocean-which-course-should-you-play) for a closer comparison.",
    ],
  },
  {
    slug: 'albufeira',
    label: 'Albufeira',
    towns: ['Albufeira'],
    description:
      'Albufeira has three courses of its own: Salgados, an 18-hole layout by Pedro de Vasconcelos that opened in 1997 beside the Salgados lagoon, and two 9-hole courses — Pine Cliffs, by Martin Hawtree, on the clifftops at Olhos de Água, and Balaia. Pine Cliffs does not require a handicap. For more choice, the Vilamoura and Vale do Lobo courses are a short drive east.',
    more: [
      "[Salgados](/courses/salgados) is about as flat as Algarve golf gets, routed through wetlands and lagoons, and easy to walk; its handicap limit is 28 for men and 36 for ladies. The two short courses are very different. [Pine Cliffs](/courses/pine-cliffs) sits on sandstone cliffs above Olhos de Água and is built around the Devil's Parlour, a par 3 the club describes as a 197-metre carry over a ravine. [Balaia](/courses/balaia) is an all-par-3 nine inside the Balaia Golf Village resort, with no hole longer than 160 metres.",
      "If you have no handicap, Pine Cliffs lets you play from the red tees. Balaia's guest information says a handicap is required, without giving a limit, so check before you book. Albufeira is also a practical base for the Vilamoura courses and for [Amendoeira](/courses/amendoeira-faldo), both within about 25 minutes, and Amendoeira's floodlit nine-hole Academy course is the only place in the Algarve to play [golf at night](/guide/night-golf-in-the-algarve). Can't decide between the short courses? Read [Balaia vs Pine Cliffs](/guide/balaia-vs-pine-cliffs-which-quick-round-near-albufeira-should-you-play).",
    ],
  },
  {
    slug: 'carvoeiro',
    label: 'Carvoeiro',
    towns: ['Carvoeiro'],
    description:
      'Carvoeiro is home to Pestana\'s Gramacho and Vale da Pinta courses, both designed by Ronald Fream in the early 1990s, with later work on Gramacho by Nick Price. Alongside them is Vale de Milho, a 9-hole par-3 course that needs no handicap and is one of the cheapest rounds in the Algarve.',
    more: [
      "[Gramacho](/courses/gramacho) has 18 fairways but 27 greens, so several holes can be played to a different green on different days. It has hosted the Portuguese Ladies Open and is the more approachable of the two Pestana courses. [Vale da Pinta](/courses/vale-da-pinta) is the stronger test, with ancient olive and carob trees in play and dog-legs that punish an inaccurate drive. Both set a handicap limit of 27 for men and 35 for ladies, slightly stricter than the usual Algarve 28 and 36.",
      "[Vale de Milho](/courses/vale-de-milho) was laid out in 1990 by Ryder Cup player Dave Thomas. It is under a kilometre long, with sea views from several tees, and while it needs no handicap, the club expects you to know basic golf etiquette. Pestana Gramacho Residences, a golf aparthotel about 500 metres from the Gramacho clubhouse, is the closest place to stay. Read [Gramacho vs Vale da Pinta](/guide/gramacho-vs-vale-da-pinta-which-pestana-carvoeiro-course-should-you-play) to choose between the Pestana courses.",
    ],
  },
  {
    slug: 'silves',
    label: 'Silves',
    towns: ['Silves'],
    description:
      'The countryside around Silves, inland from the coast, has three 18-hole courses: the two Amendoeira courses, designed by Nick Faldo and Christy O\'Connor Jr. and opened in 2008, and Pestana Silves, which opened in 2006.',
    more: [
      "The [Faldo Course](/courses/amendoeira-faldo) is desert-style, with cacti and scrub in place of rough and crushed limestone in its bunkers, and was named Portugal's Best Golf Course at the 2016 World Golf Awards. The [O'Connor Course](/courses/amendoeira-oconnor) is greener and more traditional, routed through a valley with lakes on several holes; it is shorter and generally more forgiving off the tee. Both share a clubhouse, practice facilities and the on-site Amendoeira Golf Resort.",
      "Amendoeira's academy is one of the best equipped in Portugal, and its nine-hole par-3 Academy course is, according to the resort, the only floodlit course in the country (see [night golf in the Algarve](/guide/night-golf-in-the-algarve)). [Pestana Silves](/courses/silves) plays a par 70 over gently hilly terrain with views over orange and olive groves, and is well regarded for its conditioning; its handicap limit is stricter, at 24 for men and 28 for ladies. In July and August it runs hotter inland around Silves than on the coast, so book an early tee time.",
    ],
  },
  {
    slug: 'portimao',
    label: 'Portimão',
    towns: ['Portimão'],
    description:
      'Portimão has the widest choice of golf in the western Algarve. Penina\'s Championship Course, designed by Sir Henry Cotton, opened in 1966 as the first course built in the Algarve; the resort also has the 9-hole Resort Course, which needs no handicap. Alto Golf in Alvor and the twin Morgado and Alamos courses inland complete the line-up.',
    more: [
      "[Penina Championship](/courses/penina-championship) was built by Sir Henry Cotton on former rice paddies and has hosted the Portuguese Open several times; recent reviews mention uneven conditioning alongside signs of new investment. The nine-hole [Resort Course](/courses/penina-resort) across the road needs no handicap and can be played twice from different tees as an 18-hole round, and Penina's academy has a large natural-grass driving range.",
      "In the hills north of Portimão, [Morgado](/courses/morgado) and [Alamos](/courses/alamos) share a designer, a clubhouse and the NAU Morgado hotel. Morgado has wide fairways and little rough and hosted the Open de Portugal from 2017 to 2019, so it suits higher handicappers; Alamos is shorter, tighter and hillier, with fast, contoured greens. [Alto Golf](/courses/alto-golf) in Alvor, a William Mitchell design from 1991, has tight, tree-lined fairways that golfers say punish a wayward shot. Read [Alamos vs Morgado](/guide/alamos-vs-morgado-which-portimao-golf-course-should-you-play) and [Penina Championship vs Resort](/guide/penina-championship-vs-penina-resort-which-course-should-you-play) for more detail.",
    ],
  },
  {
    slug: 'lagos',
    label: 'Lagos',
    towns: ['Lagos'],
    description:
      'Lagos has three courses: Palmares, a 27-hole Robert Trent Jones Jr. design above Meia Praia beach; Boavista, by Howard Swan, which opened in 2002 on the edge of town; and Espiche, the newest of the three, which opened in 2012 west of Lagos.',
    more: [
      "[Palmares](/courses/palmares) spreads three nines, Alvor, Lagos and Praia, across the slopes above Meia Praia, with the Praia nine closest to links golf and views over the bay. [Boavista](/courses/boavista) climbs through cork-oak woodland, with sea views from the higher holes and a demanding finish either side of a ravine; its handicap limit is 27 for men and 34 for ladies. Both have a hotel on site.",
      "[Espiche](/courses/espiche), by South African architect Peter Sauerman, sits inland in a protected landscape with views towards the Serra de Monchique. Its fairways follow the natural contours and the rough is penal, so it rewards straight hitting, and regular players rate how quiet it is as one of its best features. In summer the afternoon breeze is strongest on this western stretch of coast, so book a morning tee time if you'd rather avoid the wind. Read [Boavista vs Espiche](/guide/boavista-vs-espiche-which-lagos-golf-course-should-you-play) to compare the two.",
    ],
  },
  {
    slug: 'loule',
    label: 'Loulé',
    towns: ['Loulé'],
    description:
      'Ombria, in the hills north of Loulé, opened in April 2023. Designed by Portuguese architect Jorge Santana da Silva, it is part of the Ombria resort and holds GEO Foundation certification for sustainable golf.',
    more: [
      "The course was built on a former fruit farm and plays over undulating terrain with several climbs, so consider a buggy. Ombria sets a handicap limit of 28 for men and 36 for ladies and asks for your name, nationality and handicap on every booking. The Viceroy at Ombria Algarve hotel sits beside the course, with rooms and residences that have private pools.",
      "Although it is in the hills, Ombria is within about 25 minutes by car of the Vilamoura, Vale do Lobo and Quinta do Lago courses, so it pairs easily with a stay on the coast.",
    ],
  },
  {
    slug: 'tavira',
    label: 'Tavira',
    towns: ['Tavira · East Algarve'],
    description:
      'The Tavira area has four courses: Monte Rei, a Jack Nicklaus design that opened in 2007; the sister courses Quinta da Ria and Quinta de Cima, both by Rocky Roquemore; and Benamor, near Tavira town. Monte Rei is one of the most expensive rounds in the Algarve, while Benamor is among the most affordable 18-hole courses in the east.',
    more: [
      "[Monte Rei](/courses/monte-rei), on a private estate near Vila Nova de Cacela, was ranked Portugal's number one course for 15 years in a row, until Terras da Comporta overtook it in the 2026 rankings. [Quinta da Ria](/courses/quinta-da-ria) and [Quinta de Cima](/courses/quinta-de-cima) share an estate inside the Ria Formosa Natural Park and use bentgrass on tees, fairways and greens. Ria is the shorter and more scenic of the two, with lagoon views; Cima is longer, and the resort calls it its championship course.",
      "[Benamor](/courses/benamor), close to Tavira, is one of the shortest 18-hole courses in the region at about 5,500 metres from the white tees, and players describe it as well suited to higher handicaps, though it is hilly in places. Handicap rules vary more here than in most of the Algarve: Quinta da Ria allows a maximum of 24 for men and 28 for ladies, while Quinta de Cima allows 36 for everyone. Monte Rei and the Robinson Club Quinta da Ria both have hotels on site. Read [Quinta da Ria vs Quinta de Cima](/guide/quinta-da-ria-vs-quinta-de-cima-which-tavira-course-should-you-play) to compare the sister courses.",
    ],
  },
  {
    slug: 'castro-marim',
    label: 'Castro Marim',
    towns: ['Castro Marim · East Algarve'],
    description:
      'Castro Marim, at the eastern end of the Algarve near the Spanish border, has two courses: Castro Marim Golfe & Country Club, designed by Terry Murray and opened in 2001, and Quinta do Vale, designed by Seve Ballesteros and opened in 2007.',
    more: [
      "[Quinta do Vale](/courses/quinta-do-vale), one of Seve Ballesteros's last designs, winds through a valley with views over the Guadiana River towards Spain and has an unusual balance of six par 3s, six par 4s and six par 5s. [Castro Marim](/courses/castro-marim) has 27 holes in three nines, Atlantic, Guadiana and Grouse, that can be combined in any pairing; the Grouse nine was added in 2008.",
      "Quinta do Vale sets a handicap limit of 24 for men and 28 for ladies, stricter than the usual Algarve 28 and 36, while Castro Marim asks for a handicap certificate but does not publish a maximum, so check with the club before you book. Castro Marim has its own resort, with village houses and a clubhouse restaurant, and its resident professional offers some of the lowest-priced lessons we found in the Algarve. The Tavira courses, including Monte Rei, are within about 20 minutes. Read [Castro Marim vs Quinta do Vale](/guide/castro-marim-vs-quinta-do-vale-which-east-algarve-course-should-you-play) for a closer look.",
    ],
  },
  {
    slug: 'vila-do-bispo',
    label: 'Vila do Bispo',
    towns: ['Vila do Bispo'],
    description:
      'Vila do Bispo, in the far south-west of the Algarve near Sagres, has one course: Santo António Golf at Budens, formerly Parque da Floresta, an 18-hole design by Pepe Gancedo. It is the westernmost course in the Algarve and one of the most affordable 18-hole rounds in the region.',
    more: [
      "It is the most remote course in the region and the furthest from Faro Airport, a little over an hour by car, so it suits golfers staying in the western Algarve rather than a day trip from the centre. The course plays 5,712 metres to a par of 71, with a driving range, putting green and golf academy on site.",
      "The three Lagos courses, Espiche, Boavista and Palmares, are all within about 25 minutes. In summer the afternoon breeze is strongest on this western stretch of coast, so book a morning tee time if you'd rather avoid the wind.",
    ],
  },
  {
    slug: 'ferragudo',
    label: 'Ferragudo',
    towns: ['Ferragudo'],
    description:
      'Ferragudo, across the Arade river from Portimão, is home to Pestana Ferragudo, an 18-hole course that opened in 2026. The Portimão and Carvoeiro courses are a short drive away.',
    more: [
      "Pestana Ferragudo opened on 1 September 2026 and plays 5,841 metres to a par of 73 through parkland terrain, as part of a residential development in the village. Being so new, it has no track record yet on conditioning or pace of play. Its handicap limit is 28 for men and 36 for ladies.",
      "Ferragudo is a convenient base for the western central Algarve: the two Pestana courses at Carvoeiro, Alto Golf in Alvor and the Penina courses are all within about 15 minutes by car. Read [Silves vs Pestana Ferragudo](/guide/silves-vs-pestana-ferragudo-the-established-course-and-the-brand-new-one) to see how it compares with an established course nearby.",
    ],
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
