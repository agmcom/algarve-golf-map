# "Golf courses near W Algarve" (topic #27, second of the series). Built 21 Nov 2026.
# Sources:
# - Drive times: Mapbox Directions (no traffic) from the hotel's DB coordinates (37.0796637, -8.301115), 21 Nov 2026;
#   airport origin -7.9660,37.0215 -> 47 min, 50 km.
# - Green fees: web/scripts/data/prices-2026-27.json (asserted below). Slopes: FPG back tees, web/src/data/course-ratings.ts.
#   Walking: web/src/data/walking.ts. Course facts: courses table + verified_course_facts (Pine Cliffs designer Martin Hawtree,
#   par 32, Devil's Parlour = 6th; players without a handicap play from the red markers; Balaia "Handicap required", no limit).
#   Pine Cliffs 2 h per nine, no buggies on its price list: pace.ts / walking.ts. Salgados buggy €50 (18): buggies.ts.
# - W Algarve: marriott.com returns 403; no official golf offer found. Salgados official stay-and-play page (read 21 Nov 2026)
#   lists only its three on-site hotels: The Westin Salgados Beach Resort, Marriott Residences Salgados Resort and Algarve
#   Marriott Salgados Golf Resort & Spa. Booking.com 8.9 and clifftop above Praia da Galé: our hotels-near-salgados guide.
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
prices = json.load(open(os.path.join(ROOT, 'web/scripts/data/prices-2026-27.json')))
def rng(slug, holes=18, slot='standard'):
    p = [r['price_eur'] for r in prices if r['slug'] == slug and r['holes'] == holes and r['time_slot'] == slot]
    return min(p), max(p)
EXPECT = {('salgados', 18, 'standard'): (78, 139), ('salgados', 18, 'twilight'): (47, 99), ('balaia', 9, 'standard'): (50, 50),
          ('amendoeira-faldo', 18, 'standard'): (100, 212), ('amendoeira-oconnor', 18, 'standard'): (100, 212),
          ('pine-cliffs', 9, 'standard'): (59, 79), ('vilamoura-laguna', 18, 'standard'): (88, 136),
          ('silves', 18, 'standard'): (95, 180), ('gramacho', 18, 'standard'): (95, 180), ('vale-da-pinta', 18, 'standard'): (95, 180),
          ('vilamoura-old-course', 18, 'standard'): (215, 301)}
for (s, h, t), v in EXPECT.items():
    assert rng(s, h, t) == v, (s, rng(s, h, t))

P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}
C = lambda name, slug: f'[{name}](/courses/{slug})'
G = lambda name, slug: f'[{name}](/guide/{slug})'
fee = lambda s, h=18: '€{} to €{}'.format(*rng(s, h)) if rng(s, h)[0] != rng(s, h)[1] else '€{}'.format(rng(s, h)[0])

c = []
c.append(P(f"W Algarve sits on the cliffs above Praia da Galé, west of Albufeira, and the closest golf course is right next door: {C('Salgados', 'salgados')} is about **7 minutes** away by car. Within about 25 minutes you also have the two Amendoeira courses, designed by Nick Faldo and Christy O'Connor Jr., and two short 9-hole courses at Balaia and Pine Cliffs. The hotel has no course of its own. **Last checked: November 2026.**"))

c.append(H2("Golf courses closest to W Algarve"))
rows = [
    [C('Salgados', 'salgados'), '7 min (3 km)', '18 holes', fee('salgados')],
    [C('Balaia', 'balaia'), '19 min (11 km)', '9 holes, all par 3', fee('balaia', 9)],
    [f"{C('Amendoeira Faldo', 'amendoeira-faldo')} and {C(chr(79) + chr(39) + 'Connor', 'amendoeira-oconnor')}", '22 min (13 km)', '18 holes each', fee('amendoeira-faldo')],
    [C('Pine Cliffs', 'pine-cliffs'), '25 min (15 km)', '9 holes', fee('pine-cliffs', 9)],
    [f"{C('Vilamoura Laguna', 'vilamoura-laguna')} and {C('Millennium', 'vilamoura-millennium')}", '30 min (22 km)', '18 holes', fee('vilamoura-laguna')],
    [C('Vilamoura Old Course', 'vilamoura-old-course'), '31 min (23 km)', '18 holes', fee('vilamoura-old-course')],
    [C('Silves', 'silves'), '31 min (19 km)', '18 holes', fee('silves')],
    [f"{C('Vale da Pinta', 'vale-da-pinta')} and {C('Gramacho', 'gramacho')}", '31–33 min (25–26 km)', '18 holes', fee('gramacho')],
]
c.append({'type': 'table', 'caption': 'Drive times and green fees from W Algarve',
  'headers': ['Course', 'Drive from the hotel', 'Holes', 'Visitor green fee (2026/27)'], 'rows': rows,
  'note': "Not a complete list. Drive times without traffic (Mapbox), checked November 2026. Green fees are the lowest and highest standard visitor rates for the 2026/27 season, from each club's own online booking or price list, for the holes shown. The 18-hole courses ask for a handicap certificate, up to 28 for men and 36 for ladies; see the notes below for Balaia and Pine Cliffs."})

c.append(H2("The nearest courses at a glance"))
c.append(P("Slope ratings are from the Portuguese Golf Federation for the back tees: the higher the number, the harder the course for an average golfer."))
c.append(P(f"**{C('Salgados', 'salgados')}** (par 72, 6,033 m, slope 129): a 1994 Pedro de Vasconcelos design on the flat wetlands behind Praia da Galé. One of the easiest courses in the Algarve to walk, but there's plenty of water and it's exposed to the wind. Twilight rounds start at €47 and an 18-hole buggy costs €50. See the [Salgados scorecard](/courses/salgados/scorecard)."))
c.append(P(f"**{C('Amendoeira Faldo', 'amendoeira-faldo')}** (par 72, 6,598 m, slope 142): Nick Faldo's course climbs the hillside and is the hardest of the courses near the hotel. The online green fee includes a buggy, if one is available."))
c.append(P(f"**{C(chr(79) + chr(39) + 'Connor', 'amendoeira-oconnor')}** (par 72, 6,708 m, slope 136): the sister course at Amendoeira, by Christy O'Connor Jr., stays down in the valley on flat ground among orange groves, with the same buggy-included green fee. Compare the two in {G('Amendoeira Faldo vs O' + chr(39) + 'Connor', 'amendoeira-faldo-vs-o-connor-which-silves-golf-course-should-you-play')}."))
c.append(P(f"**{C('Balaia', 'balaia')}** (9 holes, par 27, 984 m): a short course of par 3s near Albufeira, €50 to play. The resort's guest information says a handicap is required, without giving a limit, so check with the club if you've only just started."))
c.append(P(f"**{C('Pine Cliffs', 'pine-cliffs')}** (9 holes, par 32, 2,227 m): a Martin Hawtree course on the cliffs at Olhos de Água, famous for its 6th hole, the Devil's Parlour, played across the clifftop. You don't need a handicap: players without one tee off from the red markers. The club allows 2 hours for nine holes and lists trolleys but no buggies on its price list. Compare it with Balaia in {G('Balaia vs Pine Cliffs', 'balaia-vs-pine-cliffs-which-quick-round-near-albufeira-should-you-play')}."))

c.append(H2("Golf at W Algarve"))
c.append(P("W Algarve doesn't have its own course, and we couldn't find a golf package on its official website. Salgados sells stay-and-play packages only with the three Marriott hotels on its own estate, The Westin Salgados Beach Resort, Marriott Residences Salgados Resort and Algarve Marriott Salgados Golf Resort & Spa, so as a W guest you book your rounds directly with the clubs. Ask the hotel when you book whether it can arrange tee times or transport to the courses."))
c.append({'type': 'hotel', 'name': 'W Algarve', 'lat': 37.0796637, 'lng': -8.301115, 'tier': 'Luxury',
  'text': "A five-star resort on the cliffs above Praia da Galé, rated **8.9 on Booking.com**, with Salgados about 7 minutes away and Amendoeira about 22.",
  'perks': ['Clifftop above Praia da Galé', 'Five-star resort', 'Spa', 'Salgados 7 minutes away'],
  'rating': 8.9, 'ratingSource': 'Booking.com', 'driveMin': 7, 'distanceKm': 3.3,
  'bookingUrl': 'https://www.booking.com/hotel/pt/w-hotels-algarve.html'})

c.append(H2("Which course to play from W Algarve"))
c.append(P(f"**For the shortest drive,** Salgados is next door and has the lowest green fees of the 18-hole courses in the table. Read {G('Salgados vs Amendoeira', 'salgados-vs-amendoeira-which-golf-course-near-albufeira-should-you-play')} if you're choosing between the two."))
c.append(P(f"**For a two-course day out,** Amendoeira has the Faldo and O'Connor courses side by side, about 22 minutes away."))
c.append(P(f"**For a quick round,** Balaia and Pine Cliffs are 9-hole courses within 25 minutes. See {G('the cheapest golf near Albufeira', 'cheapest-golf-near-albufeira')} for more ideas."))
c.append(P(f"**For more variety,** Vilamoura and the Pestana courses near Carvoeiro and Silves are about half an hour away."))

c.append(H2("Getting there"))
c.append(P(f"W Algarve is about **47 minutes and 50 km from Faro Airport** by car, without traffic. Our guide to {G('Faro Airport to Albufeira with golf clubs', 'faro-airport-to-albufeira-with-golf-clubs')} compares taxis, transfers and car hire, and {G('Faro car hire for golfers', 'faro-car-hire-for-golfers')} covers which cars fit golf bags. For other hotels in the area, see {G('hotels near Salgados golf course', 'hotels-near-salgados-golf-course')}."))

c.append(H2("Golf near W Algarve: common questions"))
c.append(H3("What is the closest golf course to W Algarve?"))
c.append(P("Salgados, about 7 minutes away by car. Balaia, a 9-hole par-3 course, is about 19 minutes away, and the two Amendoeira courses about 22."))
c.append(H3("Does W Algarve have its own golf course?"))
c.append(P("No. The nearest course is Salgados, on the neighbouring Herdade dos Salgados estate."))
c.append(H3("Does W Algarve sell golf packages?"))
c.append(P("We couldn't find one on its official website, and Salgados' own stay-and-play packages are for its three on-site Marriott hotels. Book rounds directly with the clubs, and ask the hotel about tee times and transport."))
c.append(H3("Do I need a handicap to play near W Algarve?"))
c.append(P(f"At the 18-hole courses, yes: they ask for a certificate of up to 28 for men and 36 for ladies. At Pine Cliffs you don't need one, and Balaia asks for one without giving a limit. See {G('do you need a handicap to play golf in the Algarve?', 'do-you-need-a-handicap-to-play-golf-in-the-algarve')}"))

json.dump(c, open(os.path.join(HERE, 'w.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
