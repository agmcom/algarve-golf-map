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
    title: 'Golf club hire at Faro Airport: rental options compared',
    description: 'The golf club rental companies at Faro Airport (FAO): where to find each one, what they stock, roughly what it costs and how to book before you fly.',
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
}
