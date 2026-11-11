// Search-result title and description for guide posts whose on-page title or excerpt is
// too long for Google (titles ~60 chars, descriptions ~155). Keyed by post slug.
// The visible headline and excerpt on the site are unchanged. Posts not listed here
// fall back to their own title and excerpt (see guide/[slug]/page.tsx).
export const GUIDE_SEO: Record<string, { title?: string; description?: string }> = {
  'beginner-golf-holidays-in-portugal': {
    title: 'Beginner golf holidays in Portugal: plan your first trip',
    description: 'Plan a beginner golf holiday in the Algarve: where to play without a handicap, golf schools, the best resorts, when to go and what to do about clubs.',
  },
  'golf-lessons-in-the-algarve': {
    title: 'Golf lessons in the Algarve: academies and prices',
  },
  'do-you-need-a-handicap-to-play-golf-in-the-algarve': {
    description: 'Most Algarve courses ask for a handicap of 28 (men) or 36 (ladies). The exact rules, the courses that don\'t need one, and how to get a handicap first.',
  },
  'hotels-near-vale-do-lobo-golf': {
    title: 'Hotels near Vale do Lobo golf: 8 best places to stay',
    description: 'Where to stay to play Vale do Lobo\'s Royal and Ocean courses: the resort\'s villas, the Dona Filipa Hotel and six well-rated hotels within 15 minutes.',
  },
  'hotels-near-balaia-golf-village': {
    title: 'Hotels near Balaia Golf Village: 9 best in Albufeira',
    description: 'Where to stay to play Balaia, Albufeira\'s par-3 course: the resort apartments plus eight well-rated hotels within 13 minutes, from about €50 a night.',
  },
  'hotels-near-vale-de-milho-golf': {
    title: 'Hotels near Vale de Milho golf: 10 best in Carvoeiro',
    description: 'Where to stay to play Vale de Milho in Carvoeiro: 10 well-rated hotels within about 10 minutes, from €50 apartments to boutique B&Bs.',
  },
  'hotels-near-penina-golf-resort': {
    title: 'Hotels near Penina Golf Resort: 6 best places to stay',
    description: 'Where to stay to play Penina: the resort hotel with its free daily round, a top-rated B&B overlooking the course and four Alvor hotels within 20 minutes.',
  },
  'hotels-near-pine-cliffs-golf-course': {
    title: 'Hotels near Pine Cliffs golf course: 10 best places to stay',
    description: 'Where to stay to play Pine Cliffs: the three Luxury Collection hotels on the resort plus seven well-rated alternatives nearby, from about €50 a night.',
  },
  'hotels-near-ferragudo-golf-course': {
    title: 'Hotels near Ferragudo golf course: 11 best places to stay',
    description: 'There\'s no hotel at Ferragudo golf course yet. The 11 best places to stay nearby, from Pestana\'s golf apartments to luxury resorts, with drive times.',
  },
  'how-to-plan-a-golf-trip-to-the-algarve': {
    description: 'Step by step: flights, transfers or car hire, choosing your courses, picking a base, and whether to bring or rent your clubs for an Algarve golf trip.',
  },
  'algarve-hotels-with-a-golf-course-on-site': {
    description: 'The 14 Algarve hotels built on the same estate as a golf course, from Monte Rei to Penina, grouped by region with real prices and booking links.',
  },
  'the-10-best-algarve-golf-courses-for-seniors': {
    description: 'Flat terrain, buggy access, relaxed handicap limits and good value: 10 Algarve golf courses that suit senior golfers, checked against real course data.',
  },
  'silves-vs-pestana-ferragudo-the-established-course-and-the-brand-new-one': {
    title: 'Silves vs Pestana Ferragudo: which course should you play?',
    description: 'Same operator, very different ages: Silves, open since 2006 and known for its conditioning, against the brand-new Pestana Ferragudo. How they compare.',
  },
  'castro-marim-vs-quinta-do-vale-which-east-algarve-course-should-you-play': {
    title: 'Castro Marim vs Quinta do Vale: which should you play?',
    description: 'Minutes apart near the Spanish border: a Seve Ballesteros design against three flexible nines with their own resort. How the east Algarve pair compares.',
  },
  'quinta-do-lago-laranjal-vs-pinheiros-altos-which-course-should-you-play': {
    title: 'Laranjal vs Pinheiros Altos: which course should you play?',
    description: 'Two Golden Triangle courses at a similar green fee that have taken very different paths. An honest comparison of Laranjal and Pinheiros Altos.',
  },
  'vilamoura-laguna-vs-pinhal-which-course-should-you-play': {
    description: 'Same price, minutes apart, but open, water-laced Laguna and pine-lined Pinhal play very differently. How Vilamoura\'s other pair compares.',
  },
  'penina-championship-vs-penina-resort-which-course-should-you-play': {
    title: 'Penina Championship vs Resort: which course should you play?',
    description: 'The 1966 course that put the Algarve on the golfing map against a relaxed nine-hole loop across the road. How Penina\'s two courses compare.',
  },
  'gramacho-vs-vale-da-pinta-which-pestana-carvoeiro-course-should-you-play': {
    title: 'Gramacho vs Vale da Pinta: which Carvoeiro course to play?',
    description: 'Same resort, same architect, a year apart, but very different reputations. How Carvoeiro\'s crowd-pleaser and its tougher test compare.',
  },
  'quinta-da-ria-vs-quinta-de-cima-which-tavira-course-should-you-play': {
    title: 'Quinta da Ria vs Quinta de Cima: which Tavira course?',
    description: 'Same designer, estate and all-inclusive hotel near Tavira, but Quinta de Cima is the championship test and the numbers back it up. How the two compare.',
  },
  'vilamoura-old-course-vs-millennium-which-one-should-you-play': {
    title: 'Vilamoura Old Course vs Millennium: which should you play?',
    description: 'One designer touched both, thirty years apart, but they play nothing alike. How the Old Course and the Millennium differ and which suits your game.',
  },
  'balaia-vs-pine-cliffs-which-quick-round-near-albufeira-should-you-play': {
    title: 'Balaia vs Pine Cliffs: which nine holes near Albufeira?',
    description: 'Which quick nine-hole round near Albufeira fits you: the budget, no-pressure par-3 at Balaia or the bucket-list clifftop hole at Pine Cliffs.',
  },
  'quinta-do-lago-south-vs-north-which-course-should-you-play': {
    description: 'Same designer, estate and hotel, but South carries the Portuguese Open history and North had a €9 million rebuild. How the two courses compare.',
  },
  'boavista-vs-espiche-which-lagos-golf-course-should-you-play': {
    title: 'Boavista vs Espiche: which Lagos golf course to play?',
    description: 'Two western Algarve favourites near Lagos that test different parts of your game. How hillside Boavista and tightly wooded Espiche compare.',
  },
  'amendoeira-faldo-vs-o-connor-which-silves-golf-course-should-you-play': {
    title: 'Amendoeira Faldo vs O\'Connor: which course should you play?',
    description: 'Two 18-hole courses at the same Silves resort by two major winners. How the desert-style Faldo Course and the water-laced O\'Connor Course compare.',
  },
  'algarve-golf-in-january': {
    title: 'Algarve weather in January for golf: what to expect',
    description: 'Golf in the Algarve in January: highs of 16°C, about six rainy days, sunset from 5.25pm and some of the cheapest green fees of the year.',
  },
  'algarve-golf-in-february': {
    title: 'Algarve weather in February for golf: what to expect',
    description: 'Golf in the Algarve in February: highs of 17°C, about five rainy days, sunset after 6pm by the end of the month, and green fees on the rise.',
  },
  'algarve-golf-in-march': {
    title: 'Algarve weather in March for golf: what to expect',
    description: 'Golf in the Algarve in March: highs of 19°C, about six rainy days, light until nearly 8pm after the clocks change, and peak green fees at most courses.',
  },
  'algarve-golf-in-april': {
    title: 'Algarve weather in April for golf: what to expect',
    description: 'Golf in the Algarve in April: highs of 21°C, about five rainy days, light until after 8pm and the year\'s highest green fees on almost every course.',
  },
  'algarve-golf-in-may': {
    title: 'Algarve weather in May for golf: what to expect',
    description: 'Golf in the Algarve in May: highs of 23°C, about four rainy days, light until after 8.40pm and peak green fees at most courses. What to expect.',
  },
  'algarve-golf-in-june': {
    title: 'Algarve weather in June for golf: what to expect',
    description: 'Golf in the Algarve in June: highs of 27°C, almost no rain, light until 9pm, and green fees falling to low-season levels on many courses.',
  },
  'algarve-golf-in-july': {
    title: 'Algarve weather in July for golf: what to expect',
    description: 'Golf in the Algarve in July: highs of 29°C, no rain, sunrise around 6.15am and some of the lowest green fees of the year. How to beat the heat.',
  },
  'algarve-golf-in-august': {
    title: 'Algarve weather in August for golf: what to expect',
    description: 'Golf in the Algarve in August: highs of 29°C, almost no rain, sunrise around 6.40am and low summer green fees. When to tee off to beat the heat.',
  },
  'algarve-golf-in-september': {
    title: 'Algarve weather in September for golf: what to expect',
    description: 'Golf in the Algarve in September: highs of 26°C, about two rainy days, sunset from 8pm to 7.20pm, and green fees moving back towards autumn peak.',
  },
  'algarve-golf-in-october': {
    title: 'Algarve weather in October for golf: what to expect',
    description: 'Golf in the Algarve in October: highs of 23°C, about six rainy days, earlier sunsets after the clocks go back, and autumn peak green fees.',
  },
  'algarve-golf-in-november': {
    title: 'Algarve weather in November for golf: what to expect',
    description: 'Golf in the Algarve in November: highs of 20°C, about seven rainy days, sunset around 5.20pm, and green fees starting to fall. What to expect.',
  },
  'algarve-golf-in-december': {
    title: 'Algarve weather in December for golf: what to expect',
    description: 'Golf in the Algarve in December: highs of 17°C, about seven rainy days, sunset around 5.20pm and the cheapest green fees of the year on most courses.',
  },
  'salgados-vs-amendoeira-which-golf-course-near-albufeira-should-you-play': {
    title: 'Salgados vs Amendoeira: which golf course near Albufeira?',
    description: 'Salgados by the beach or Amendoeira\'s Faldo and O\'Connor courses inland: green fees, handicap, practice facilities and which round suits you.',
  },
  'the-algarve-s-best-par-3-golf-courses': {
    description: 'The Algarve\'s all par-3 courses, plus one clifftop course with a famous exception: short, beginner-friendly rounds with real par, length and price.',
  },
  'the-best-ocean-view-golf-courses-in-the-algarve': {
    description: 'Six Algarve courses where the Atlantic is part of the round, from clifftop par 3s to fairways that run along the sand. Where to find real ocean views.',
  },
  'vale-do-lobo-royal-vs-vale-do-lobo-ocean-which-course-should-you-play': {
    title: 'Vale do Lobo Royal vs Ocean: which course should you play?',
    description: 'Same resort and hotel, but one is a clifftop showpiece and the other classic coastal parkland. How Vale do Lobo\'s Royal and Ocean courses compare.',
  },
  'alamos-vs-morgado-which-portimao-golf-course-should-you-play': {
    title: 'Alamos vs Morgado: which Portimão course should you play?',
    description: 'Same designer, resort and hotel near Portimão, but the two courses play nothing alike. What separates Alamos and Morgado and which suits your handicap.',
  },
  'hiring-golf-clubs-at-faro-airport': {
    title: 'Golf club hire at Faro Airport: 3 options and prices',
    description: 'Compare 3 ways to hire golf clubs at Faro Airport: where to collect, published prices and sets, plus how hire compares with airline golf-bag fees.',
  },
  'the-10-best-algarve-golf-courses-for-beginners': {
    title: 'The 8 best Algarve golf courses for beginners',
    description: 'The 8 Algarve golf courses that genuinely suit beginners, from par-3 nines with no handicap needed to forgiving 18s, with handicap rules and practice facilities.',
  },
  'algarve-golf-season-best-time-to-play-golf': {
    title: 'Algarve golf season: the best time to play golf',
    description: 'Month by month in the Algarve: course crowds, green fees, hotel prices, temperatures, daylight and rain, plus the best months for a golf trip.',
  },
  'lufthansa-golf-clubs-included-in-your-allowance-unless-you-re-on-a-light-fare': {
    title: 'Lufthansa golf clubs: free in your allowance, except Light',
    description: 'Lufthansa usually lets golf clubs travel within your baggage allowance, except on the Light fare. How the rules work and what you pay if you don\'t qualify.',
  },
  'tui-airways-golf-clubs-why-you-can-t-just-add-them-online': {
    title: 'TUI Airways golf clubs: fees and how to book them',
    description: 'TUI won\'t let you add golf clubs online: it\'s by phone, with limited space per flight. What it costs on a Faro flight and why timing matters.',
  },
  'aer-lingus-golf-clubs-free-in-business-here-s-what-economy-pays': {
    title: 'Aer Lingus golf clubs: what it costs in Economy',
  },
  'eurowings-golf-clubs-one-flat-fee-no-online-discount-to-chase': {
    title: 'Eurowings golf clubs: one flat fee, no online discount',
  },
  'transavia-and-golf-clubs-the-one-airline-that-makes-you-call-ahead': {
    title: 'Transavia golf clubs: fees, 15kg limit and calling ahead',
    description: 'Transavia\'s golf clubs policy is stricter than most: a 15kg limit and an expectation that you register your clubs in advance. What to know before you fly.',
  },
  'wizz-air-golf-clubs-why-the-price-can-swing-so-much': {
    title: 'Wizz Air golf clubs: why the price can swing so much',
    description: 'Wizz Air prices golf clubs dynamically, so the fee varies by route and how early you book. What drives the price and how to avoid the higher end.',
  },
  'flying-tap-air-portugal-with-golf-clubs-the-rules-have-changed': {
    title: 'TAP Air Portugal golf clubs: the rules have changed',
    description: 'TAP Air Portugal used to carry golf clubs free, but that promotion is gone. What decides whether you pay now, and roughly how much.',
  },
  'british-airways-and-golf-clubs-when-it-s-free-and-when-it-isn-t': {
    title: 'British Airways golf clubs: when it\'s free and when it isn\'t',
    description: 'British Airways has no separate golf clubs fee: whether it\'s free depends on your fare and baggage allowance. How to work out which applies to you.',
  },
  'jet2-golf-clubs-fees-weight-limits-and-why-you-shouldn-t-leave-booking-late': {
    title: 'Jet2 golf clubs: fees, weight limits and booking',
  },
  'ryanair-golf-clubs-what-it-costs-to-fly-with-your-own-set-to-the-algarve': {
    title: 'Ryanair golf clubs: what it costs to fly to the Algarve',
  },
  'san-lorenzo-golf-course-closed-until-2028-where-to-play-instead': {
    title: 'San Lorenzo golf closed until 2028: where to play instead',
    description: 'San Lorenzo closed for renovation on 19 October 2026 and is due back in mid-2028. The nearest alternatives, from Quinta do Lago South to the Old Course.',
  },
  'vila-sol-vs-vilamoura-old-course-which-should-you-play': {
    title: 'Vila Sol vs Vilamoura Old Course: which should you play?',
    description: 'Seven minutes apart near Vilamoura: the 1969 Old Course, Portugal\'s best in 2025, against Pestana\'s 27-hole Vila Sol at a lower green fee. How they compare.',
  },
  'palmares-vs-boavista-which-lagos-golf-course-should-you-play': {
    title: 'Palmares vs Boavista: which Lagos golf course to play?',
    description: '27 seaside holes above Meia Praia against a hillside course for around half the green fee. How Palmares and Boavista compare, and which suits your trip.',
  },
  'alto-golf-vs-penina-championship-which-portimao-course-should-you-play': {
    title: 'Alto Golf vs Penina: which Portimão course should you play?',
    description: 'Henry Cotton\'s first Algarve course against his last, 15 minutes apart: Penina\'s long par 73 or Alto Golf\'s shorter, cheaper par 70. How they compare.',
  },
  'benamor-vs-quinta-da-ria-which-tavira-golf-course-should-you-play': {
    title: 'Benamor vs Quinta da Ria: which Tavira course should you play?',
    description: 'Eleven minutes apart near Tavira: short, good-value Benamor among old olive trees, or Quinta da Ria inside the Ria Formosa Natural Park. How they compare.',
  },
  'santo-antonio-vs-palmares-which-western-algarve-course-should-you-play': {
    title: 'Santo António vs Palmares: which west Algarve course?',
    description: 'The Algarve\'s westernmost course from €57 against 27 seaside holes at Palmares from €138. How Santo António and Palmares compare for a trip to the far west.',
  },
  'the-cheapest-golf-courses-in-the-algarve': {
    title: 'Cheapest golf courses in the Algarve: 2026/27 green fees',
    description: 'The Algarve\'s cheapest 18-hole courses, from €57 at Santo António, plus nine-hole rounds from €22 and twilight deals, ranked on official 2026/27 prices.',
  },
  'hotels-near-palmares-golf': {
    title: 'Hotels near Palmares golf: 7 best places to stay',
    description: 'Where to stay to play Palmares in Lagos: the resort\'s own boutique hotel and apartments, plus five well-rated hotels within 15 minutes of the course.',
  },
  'hotels-near-boavista-golf': {
    title: 'Hotels near Boavista golf: 10 best places to stay',
    description: 'Where to stay to play Boavista in Lagos: the resort\'s own five-star village, a golf-friendly country hotel and eight well-rated hotels within 10 minutes.',
  },
  'hotels-near-espiche-golf': {
    title: 'Hotels near Espiche golf: 8 best places to stay',
    description: 'Espiche has no hotel of its own. The 8 best places to stay nearby, from Praia da Luz and Burgau to the Boavista resort, with real drive times.',
  },
  'hotels-near-ombria-golf': {
    title: 'Hotels near Ombria golf: 8 best places to stay',
    description: 'Where to stay to play Ombria, inland from Loulé: the Viceroy hotel on the course, a country house in Querença and six well-rated hotels in Loulé.',
  },
  'hotels-near-santo-antonio-golf': {
    title: 'Hotels near Santo António golf: 8 best places to stay',
    description: 'Where to stay to play Santo António near Salema: the course\'s own villas, a top-rated beach village in Salema and six options in Burgau and Praia da Luz.',
  },
  'hotels-near-amendoeira-golf': {
    title: 'Hotels near Amendoeira golf: 10 best places to stay',
    description: 'Where to stay to play Amendoeira\'s Faldo and O\'Connor courses: the resort\'s own apartments and villas plus nine well-rated hotels and guest houses nearby.',
  },
  'hotels-near-silves-golf': {
    title: 'Hotels near Pestana Silves golf: 10 best places to stay',
    description: 'There\'s no hotel at Pestana Silves golf. The 10 best places to stay nearby, from guest houses in historic Silves to the Amendoeira resort.',
  },
  'hotels-near-castro-marim-golf': {
    title: 'Hotels near Castro Marim and Quinta do Vale golf',
    description: 'Where to stay to play Castro Marim and Quinta do Vale: the golf resort\'s own villas plus nine well-rated hotels from Altura to Vila Real de Santo António.',
  },
  'hotels-near-benamor-golf': {
    title: 'Hotels near Benamor golf: 10 best places to stay',
    description: 'Where to stay to play Benamor near Tavira: ten well-rated hotels within 13 minutes, from golf-friendly hotels to a Pousada in a former convent.',
  },
  'cheapest-golf-in-vilamoura': {
    title: 'Cheapest golf in Vilamoura: green fees compared',
  },
  'the-hardest-golf-courses-in-the-algarve': {
    title: 'Hardest golf courses in the Algarve: official slope ratings',
  },
  'best-value-golf-in-the-algarve': {
    title: 'Best value golf in the Algarve: what your green fee buys',
  },
  'golf-tournaments-in-the-algarve': {
    title: 'Golf tournaments in the Algarve 2026/27: amateur events',
    description: 'Amateur golf tournaments in the Algarve for 2026/27 that visitors can enter: dates, courses, handicap limits and entry prices, from Vilamoura to Penina.',
  },
  'all-inclusive-golf-hotels-in-the-algarve': {
    title: 'All-inclusive golf hotels in the Algarve: where to stay',
    description: 'All-inclusive hotels near Algarve golf courses, from Albufeira and Alvor to Lagos and Tavira: what all-inclusive covers (not green fees) and drive times.',
  },
  'algarve-golf-trips-for-groups-and-golf-societies': {
    title: 'Algarve golf trips for groups and societies: villas and tips',
    description: 'Plan an Algarve golf trip for a group or golf society: golf villas and apartments near the courses, tee times, buggies, minivans and organiser tips.',
  },
  'how-to-book-tee-times-in-the-algarve': {
    title: 'How to book Algarve tee times: club, booking site or agency',
    description: 'How to book golf in the Algarve: online with the club, on booking sites, via agencies or your hotel. When to book and the cancellation rules to check.',
  },
  'golf-weekend-in-the-algarve': {
    title: 'Golf weekend in the Algarve: where to stay and what it costs',
    description: 'Plan a golf weekend in the Algarve yourself: 4 bases near Faro Airport, 2 courses and 3 hotels in each, and the cost per person by month. Not a package.',
  },
  'hotels-near-quinta-da-ria-golf': {
    title: 'Hotels near Quinta da Ria and Quinta de Cima golf',
    description: 'Where to stay to play Quinta da Ria and Quinta de Cima: the all-inclusive Robinson between both courses, plus nine well-rated hotels nearby.',
  },
}
