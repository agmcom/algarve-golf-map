# "Golf courses near Conrad Algarve" (topic #27, first of the 'golf near <hotel>' series). Built 21 Nov 2026.
# Sources:
# - Drive times: Mapbox Directions (driving, no traffic) from the hotel's DB coordinates (37.0632425, -8.0289784), run
#   21 Nov 2026; airport origin = terminal access road (-7.9660, 37.0215) as in scripts/build-faro-drive-times.mjs -> 26 min, 15.5 km.
# - Green fees: web/scripts/data/prices-2026-27.json (club online booking sampled Oct 2026; Pestana official list; Pinheiros
#   Altos from AlgarveGolf.net Sep 2026 as the club publishes none). Handicap limits from the courses table.
# - Conrad golf offer: Quinta do Lago official site, read 21 Nov 2026 (hilton.com returns 403):
#   /en/signature-quinta-do-lago-golf-experience-3-nights/ "As from €1,627*" double occupancy, rates vary by season; two rounds
#   on QDL courses, shared buggy or electric trolley, two days of range warm-up, complimentary transfers between Conrad and the
#   QDL courses, 10% on hotel restaurants and bars, one dinner. /en/golf-fitness-short-game-escape-stay-play-perfect-your-game-
#   at-conrad-algarve/ "From €1,361 per person, sharing a Deluxe Twin Room": three rounds at QdL, shared buggy or trolley,
#   complimentary golf transfers (minimum two players), golf fitness class, short-game lesson, three dinners.
#   Golf concierge + PGA pro + kids' club + Booking 9.0: our hotels-near-quinta-do-lago guide (checked Oct-Nov 2026).
# - Course notes: designers/year/par/length from courses table (designers verified 2026-11-01); slopes = FPG back tees
#   (web/src/data/course-ratings.ts); walking from web/src/data/walking.ts (Teetimes.pt / Where2Golf); Royal 16th from
#   hole-guides.ts (valedolobo.com); QdL South Portuguese Open, North 2014 redesign, Laranjal orange grove from our
#   hotels-near-quinta-do-lago guide; Vale do Lobo Sunset rate with shared buggy from our green-fees data/posts.
# - San Lorenzo closed to mid-2028: web/src/data/course-status.ts.
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
prices = json.load(open(os.path.join(ROOT, 'web/scripts/data/prices-2026-27.json')))
def rng(slug, slot='standard'):
    p = [r['price_eur'] for r in prices if r['slug'] == slug and r['holes'] == 18 and r['time_slot'] == slot]
    return min(p), max(p)
EXPECT = {'quinta-do-lago-south': (188, 264), 'quinta-do-lago-north': (170, 242), 'quinta-do-lago-laranjal': (170, 242),
          'pinheiros-altos': (99, 122), 'vale-do-lobo-royal': (116, 171), 'vale-do-lobo-ocean': (116, 171), 'vila-sol': (140, 215),
          'vilamoura-pinhal': (101, 144), 'vilamoura-old-course': (215, 301), 'vilamoura-laguna': (88, 136), 'vilamoura-millennium': (88, 136)}
for s, v in EXPECT.items():
    assert rng(s) == v, (s, rng(s))
assert 'closed on 19 October 2026' in open(os.path.join(ROOT, 'web/src/data/course-status.ts')).read()

P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}
C = lambda name, slug: f'[{name}](/courses/{slug})'
G = lambda name, slug: f'[{name}](/guide/{slug})'
fee = lambda s: '€{} to €{}'.format(*rng(s))

c = []
c.append(P(f"Conrad Algarve is on the edge of the Quinta do Lago estate near Almancil, in the area golfers call the Golden Triangle, so some of the Algarve's best-known courses are a few minutes' drive away. {C('Quinta do Lago North', 'quinta-do-lago-north')} and {C('South', 'quinta-do-lago-south')} are about 6 minutes from the hotel, {C('Pinheiros Altos', 'pinheiros-altos')} about 7, the two {C('Vale do Lobo', 'vale-do-lobo-royal')} courses about 8 and {C('Laranjal', 'quinta-do-lago-laranjal')} about 10. The hotel has no course of its own, but Quinta do Lago sells golf packages for Conrad guests that include transfers to its courses. **Last checked: November 2026.**"))

c.append(H2("Golf courses closest to Conrad Algarve"))
rows = [
    [C('Quinta do Lago South', 'quinta-do-lago-south'), '6 min (2.6 km)', fee('quinta-do-lago-south')],
    [C('Quinta do Lago North', 'quinta-do-lago-north'), '6 min (2.6 km)', fee('quinta-do-lago-north')],
    [C('Pinheiros Altos', 'pinheiros-altos'), '7 min (3.1 km)', fee('pinheiros-altos')],
    [C('Vale do Lobo Royal', 'vale-do-lobo-royal'), '8 min (4 km)', fee('vale-do-lobo-royal')],
    [C('Vale do Lobo Ocean', 'vale-do-lobo-ocean'), '8 min (4 km)', fee('vale-do-lobo-ocean')],
    [C('Quinta do Lago Laranjal', 'quinta-do-lago-laranjal'), '10 min (4.9 km)', fee('quinta-do-lago-laranjal')],
    [C('Vila Sol', 'vila-sol'), '18 min (10 km)', fee('vila-sol')],
    [C('Vilamoura Pinhal', 'vilamoura-pinhal'), '21 min (13 km)', fee('vilamoura-pinhal')],
    [C('Vilamoura Old Course', 'vilamoura-old-course'), '22 min (14 km)', fee('vilamoura-old-course')],
    [f"{C('Vilamoura Laguna', 'vilamoura-laguna')} and {C('Millennium', 'vilamoura-millennium')}", '25 min (15 km)', fee('vilamoura-laguna')],
]
c.append({'type': 'table', 'caption': 'Drive times and 18-hole green fees from Conrad Algarve',
  'headers': ['Course', 'Drive from the hotel', 'Visitor green fee, 18 holes (2026/27)'], 'rows': rows,
  'note': "Not a complete list. Drive times without traffic (Mapbox), checked November 2026. Green fees are the lowest and highest standard visitor rates for the 2026/27 season, from each club's own online booking or price list; Pinheiros Altos from AlgarveGolf.net, as the club publishes no rates. All these courses ask for a handicap certificate, up to 28 for men and 36 for ladies."})
c.append(P(f"{C('San Lorenzo', 'san-lorenzo')}, about 10 minutes away inside Quinta do Lago, closed on 19 October 2026 for a major renovation and isn't due to reopen until mid-2028. See {G('where to play instead', 'san-lorenzo-golf-course-closed-until-2028-where-to-play-instead')}."))

c.append(H2("The nearest courses at a glance"))
c.append(P("Slope ratings are from the Portuguese Golf Federation for the back tees: the higher the number, the harder the course for an average golfer. Each course page has the full table for every tee."))
c.append(P(f"**{C('Quinta do Lago South', 'quinta-do-lago-south')}** (par 72, 6,500 m, slope 139): the championship course, which has hosted the Portuguese Open eight times. Rolling fairways, with a buggy optional. A buggy isn't included in the standard green fee."))
c.append(P(f"**{C('Quinta do Lago North', 'quinta-do-lago-north')}** (par 72, 6,140 m, slope 133): redesigned in 2014 by Beau Welling with Paul McGinley and a little more forgiving than the South, but hillier, so a buggy is a good idea."))
c.append(P(f"**{C('Quinta do Lago Laranjal', 'quinta-do-lago-laranjal')}** (par 72, 6,480 m, slope 136): opened in 2009 on a former orange grove, with its own clubhouse. Flat and easy to walk, but open to the wind."))
c.append(P(f"**{C('Pinheiros Altos', 'pinheiros-altos')}** (27 holes, slope up to 141): three nines, Pines, Corks and Olives, played in different pairs. The Olives nine is flat and the other two are more undulating. It has the highest slope of the courses nearest the hotel, and the lowest green fees."))
c.append(P(f"**{C('Vale do Lobo Royal', 'vale-do-lobo-royal')}** (par 72, 6,005 m, slope 133): home of the famous par-3 16th, played across a ravine towards the beach. See the [Royal scorecard](/courses/vale-do-lobo-royal/scorecard) and [hole-by-hole guide](/courses/vale-do-lobo-royal/hole-by-hole)."))
c.append(P(f"**{C('Vale do Lobo Ocean', 'vale-do-lobo-ocean')}** (par 73, 6,122 m, slope 140): the original Henry Cotton course from 1968, hillier than the Royal, with a buggy advised. See the [Ocean hole-by-hole guide](/courses/vale-do-lobo-ocean/hole-by-hole)."))
c.append(H2("Golf at Conrad Algarve"))
c.append(P("Conrad Algarve is one of Quinta do Lago's two partner hotels, and it has a **golf concierge** who can book your rounds, as well as lessons with the hotel's PGA-qualified professional. Breakfast starts at 7am, which suits an early tee time."))
c.append(P("Quinta do Lago itself sells golf packages at Conrad. These are the two listed on its website in November 2026:"))
c.append(P("**Signature Quinta do Lago Golf Experience:** three nights at Conrad from €1,627 for two people sharing, with two rounds on the Quinta do Lago courses, a shared buggy or electric trolley, two days of range balls to warm up, **free transfers between the hotel and the courses**, 10% off at the hotel's restaurants and bars and one dinner. There are also 5- and 7-night versions, and prices change with the season."))
c.append(P("**Stay, Play & Perfect Your Game:** three nights from €1,361 per person sharing a Deluxe Twin Room, with three rounds at Quinta do Lago, a shared buggy or trolley, free golf transfers for two or more players, a golf fitness class, a short-game lesson and three dinners."))
c.append(P("See the [Quinta do Lago special offers page](https://www.quintadolago.com/en/special-offers/) for the current packages. If you book the hotel and the golf separately, compare the cost: Quinta do Lago's standard green fees alone run from €170 to €264 a round, and a buggy isn't included."))
c.append({'type': 'hotel', 'name': 'Conrad Algarve', 'lat': 37.0632425, 'lng': -8.0289784, 'tier': 'Luxury',
  'text': "A five-star hotel on the edge of Quinta do Lago, rated **9.0 on Booking.com**. Golf concierge, lessons with a PGA professional and Quinta do Lago golf packages with transfers to the courses.",
  'perks': ['Golf concierge', 'Lessons with a PGA golf pro', 'Quinta do Lago golf packages with transfers', 'Conrad Spa', "Kids' club (ages 3–12)"],
  'rating': 9, 'ratingSource': 'Booking.com', 'driveMin': 6, 'distanceKm': 2.6, 'breakfast': '07:00–11:00',
  'bookingUrl': 'https://www.booking.com/hotel/pt/conrad-algarve.html'})

c.append(H2("Which course to play from Conrad"))
c.append(P(f"**Not sure between the two Quinta do Lago classics?** Read {G('Quinta do Lago South vs North', 'quinta-do-lago-south-vs-north-which-course-should-you-play')}."))
c.append(P(f"**For better value nearby,** Pinheiros Altos starts at about €99 and Vale do Lobo at €116, both within about 8 minutes. Vale do Lobo also has a cheaper late-afternoon rate, from €76. Compare {G('Laranjal and Pinheiros Altos', 'quinta-do-lago-laranjal-vs-pinheiros-altos-which-course-should-you-play')} or {G('Vale do Lobo Royal and Ocean', 'vale-do-lobo-royal-vs-vale-do-lobo-ocean-which-course-should-you-play')}."))
c.append(P(f"**For a change of scene,** the four Vilamoura courses and Vila Sol are 20 to 25 minutes away. Laguna and Millennium are among the cheapest rounds in the area, from €88. See {G('the cheapest golf in Vilamoura', 'cheapest-golf-in-vilamoura')}."))

c.append(H2("Getting there"))
c.append(P(f"Conrad Algarve is about **25 minutes and 16 km from Faro Airport** by car, without traffic. Our guide to {G('Faro Airport to Quinta do Lago and Vale do Lobo with golf clubs', 'faro-airport-to-quinta-do-lago-vale-do-lobo-with-golf-clubs')} compares taxis, transfers and car hire. If you'd rather not fly with your clubs, see {G('hiring golf clubs at Faro Airport', 'hiring-golf-clubs-at-faro-airport')}."))
c.append(P(f"For other places to stay in the area, see {G('hotels near Quinta do Lago golf', 'hotels-near-quinta-do-lago-golf')} and {G('hotels near Vale do Lobo golf', 'hotels-near-vale-do-lobo-golf')}."))

c.append(H2("Golf near Conrad Algarve: common questions"))
c.append(H3("Does Conrad Algarve have its own golf course?"))
c.append(P("No. It's a partner hotel of Quinta do Lago, whose North and South courses are about 6 minutes away by car, and Laranjal about 10."))
c.append(H3("What is the closest golf course to Conrad Algarve?"))
c.append(P("Quinta do Lago North and South, about 6 minutes away, followed by Pinheiros Altos at about 7 minutes and the two Vale do Lobo courses at about 8."))
c.append(H3("Does Conrad Algarve offer golf transfers?"))
c.append(P("Quinta do Lago's golf packages at Conrad include free transfers between the hotel and the Quinta do Lago courses (for two or more players on the Stay, Play & Perfect Your Game package). If you book golf separately, ask the hotel's golf concierge."))
c.append(H3("Do I need a handicap to play near Conrad Algarve?"))
c.append(P(f"Yes, at all the nearby 18-hole courses: they ask for a handicap certificate of up to 28 for men and 36 for ladies. See {G('do you need a handicap to play golf in the Algarve?', 'do-you-need-a-handicap-to-play-golf-in-the-algarve')}"))

json.dump(c, open(os.path.join(HERE, 'conrad.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
