# "Golf courses near Tivoli Marina Vilamoura" (topic #27). Built 22 Nov 2026.
# Checks first: still open under this name (no closure/rebrand found 22 Nov 2026; last renovation reopened 2023).
# Location: DB coordinates match OpenStreetMap (37.0743595, -8.1202792); DB town fixed Faro -> Vilamoura.
# Sources:
# - Drive times: Mapbox Directions (no traffic) from the DB coordinates (37.074277, -8.1198056), 22 Nov 2026; airport origin
#   -7.9660,37.0215 -> 39 min, 27 km.
# - Hotel golf: official golf page exists (tivolihotels.com/en/tivoli-marina-vilamoura/golf) but returns 403 to us; search
#   summary of it: the team can help with golf arrangements and arrange transfers to the courses on request. Golf package
#   sellers (Your Golf Travel, Kuoni) list a free shuttle to the Vilamoura courses and a golf desk: labelled as theirs.
#   Not on Vilamoura Golf's Stay & Play list (checked 22 Nov 2026). Booking.com 8.9 from 1,600+ reviews, between the marina
#   and the beach, pools, spa: our golf-hotels-near-vilamoura guide.
# - Green fees: prices-2026-27.json (asserted). Slopes: FPG. Vilamoura Golf rules: pace.ts.
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
prices = json.load(open(os.path.join(ROOT, 'web/scripts/data/prices-2026-27.json')))
def rng(slug, holes=18, slot='standard'):
    p = [r['price_eur'] for r in prices if r['slug'] == slug and r['holes'] == holes and r['time_slot'] == slot]
    return min(p), max(p)
EXPECT = {('vilamoura-pinhal', 18, 'standard'): (101, 144), ('vilamoura-laguna', 18, 'standard'): (88, 136),
          ('vilamoura-old-course', 18, 'standard'): (215, 301), ('vila-sol', 18, 'standard'): (140, 215), ('vila-sol', 18, 'twilight'): (60, 60),
          ('vale-do-lobo-royal', 18, 'standard'): (116, 171), ('vale-do-lobo-royal', 18, 'twilight'): (76, 101), ('pine-cliffs', 9, 'standard'): (59, 79)}
for (s, h, t), v in EXPECT.items():
    assert rng(s, h, t) == v, (s, rng(s, h, t))

P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}
C = lambda name, slug: f'[{name}](/courses/{slug})'
G = lambda name, slug: f'[{name}](/guide/{slug})'
fee = lambda s, h=18: '€{} to €{}'.format(*rng(s, h))

c = []
c.append(P(f"Tivoli Marina Vilamoura sits between Vilamoura's marina and the beach, and the town's golf courses are a short drive inland: {C('Pinhal', 'vilamoura-pinhal')} is about **10 minutes** away by car, {C('Laguna', 'vilamoura-laguna')}, {C('Millennium', 'vilamoura-millennium')} and the {C('Old Course', 'vilamoura-old-course')} about 12, and {C('Vila Sol', 'vila-sol')} about 15. Vale do Lobo is about 23 minutes away. **Last checked: November 2026.**"))

c.append(H2("Golf courses closest to Tivoli Marina Vilamoura"))
rows = [
    [C('Vilamoura Pinhal', 'vilamoura-pinhal'), '10 min (4 km)', '18 holes', fee('vilamoura-pinhal')],
    [f"{C('Vilamoura Laguna', 'vilamoura-laguna')} and {C('Millennium', 'vilamoura-millennium')}", '12 min (6 km)', '18 holes', fee('vilamoura-laguna')],
    [C('Vilamoura Old Course', 'vilamoura-old-course'), '12 min (6 km)', '18 holes', fee('vilamoura-old-course')],
    [C('Vila Sol', 'vila-sol'), '15 min (7 km)', '27 holes', fee('vila-sol')],
    [f"{C('Vale do Lobo Royal', 'vale-do-lobo-royal')} and {C('Ocean', 'vale-do-lobo-ocean')}", '23 min (11 km)', '18 holes', fee('vale-do-lobo-royal')],
    [C('Pine Cliffs', 'pine-cliffs'), '26 min (14 km)', '9 holes', fee('pine-cliffs', 9)],
    [f"{C('Quinta do Lago Laranjal', 'quinta-do-lago-laranjal')} and {C('North', 'quinta-do-lago-north')}", '28–29 min (15–18 km)', '18 holes', '€170 to €242'],
]
c.append({'type': 'table', 'caption': 'Drive times and green fees from Tivoli Marina Vilamoura',
  'headers': ['Course', 'Drive from the hotel', 'Holes', 'Visitor green fee (2026/27)'], 'rows': rows,
  'note': "Not a complete list. Drive times without traffic (Mapbox), checked November 2026; the marina area gets busy in summer, so allow extra time. Green fees are the lowest and highest standard visitor rates for the 2026/27 season, from each club's own online booking or price list, for the holes shown. The 18-hole courses ask for a handicap certificate of up to 28 for men and 36 for ladies. The Els Club in Vilamoura is a private members' club."})

c.append(H2("The nearest courses at a glance"))
c.append(P("Slope ratings are from the Portuguese Golf Federation for the back tees: the higher the number, the harder the course for an average golfer. The four Vilamoura courses are run by Vilamoura Golf, which allows 4 hours 40 minutes for a round and pairs players into four-balls."))
c.append(P(f"**{C('Vilamoura Pinhal', 'vilamoura-pinhal')}** (par 72, 6,353 m, slope 140): Frank Pennink's 1976 course through the pines, the closest to the hotel and the toughest of the Vilamoura courses on slope. See the [Pinhal hole-by-hole guide](/courses/vilamoura-pinhal/hole-by-hole)."))
c.append(P(f"**{C('Vilamoura Old Course', 'vilamoura-old-course')}** (par 73, 6,254 m, slope 136): Pennink's 1969 original and Vilamoura's most famous course, lined with umbrella pines, and its most expensive round. See the [Old Course scorecard](/courses/vilamoura-old-course/scorecard)."))
c.append(P(f"**{C('Vilamoura Laguna', 'vilamoura-laguna')}** (par 72, 6,121 m, slope 135) and **{C('Millennium', 'vilamoura-millennium')}** (par 72, 6,176 m, slope 130): the two flatter, more open courses, sharing a clubhouse and the lowest green fees in Vilamoura, from €88. Millennium is the easiest on slope, and Laguna has a free shared buggy offer for new bookings made by 31 December 2026."))
c.append(P(f"**{C('Vila Sol', 'vila-sol')}** (27 holes, slope 135 to 137): Donald Steel's Pestana course just outside Vilamoura, with three nines played in pairs and a €60 twilight rate from 3.30pm."))
c.append(P(f"**{C('Vale do Lobo', 'vale-do-lobo-royal')}** (Royal: par 72, slope 133; Ocean: par 73, slope 140): about 23 minutes east, home of the Royal's famous clifftop 16th. Its Sunset rate, from €76 in winter, includes a shared buggy for full-paying adults."))

c.append(H2("Golf at Tivoli Marina Vilamoura"))
c.append(P("The hotel has a golf page on its official website, which says its team can help with golf arrangements and arrange transfers to the courses on request. Golf package sellers also list a golf desk and a free shuttle to the Vilamoura courses here, but shuttles can depend on the package you buy, so ask the hotel which courses it serves and at what times before you rely on it."))
c.append(P(f"It's a big resort that suits golfers travelling with non-golfing partners or family, with the beach, pools, a spa and the marina's restaurants on the doorstep. For other hotels in the area, see {G('golf hotels near Vilamoura', 'golf-hotels-near-vilamoura')}."))
c.append({'type': 'hotel', 'name': 'Tivoli Marina Vilamoura Algarve Resort', 'lat': 37.074277, 'lng': -8.1198056, 'tier': 'Luxury',
  'text': "A big five-star resort between the marina and the beach, rated **8.9 on Booking.com** from more than 1,600 reviews, with Pinhal about 10 minutes away and the Old Course about 12.",
  'perks': ['Between the marina and the beach', 'Golf arrangements and transfers on request', 'Large resort pools', 'Spa'],
  'rating': 8.9, 'ratingSource': 'Booking.com', 'driveMin': 10, 'distanceKm': 4,
  'bookingUrl': 'https://www.booking.com/hotel/pt/tivolimarinavilamoura.html'})

c.append(H2("Which course to play from Tivoli Marina"))
c.append(P(f"**For the classic round,** play the Old Course. Read {G('Vilamoura Old Course vs Millennium', 'vilamoura-old-course-vs-millennium-which-one-should-you-play')} or {G('Vila Sol vs the Old Course', 'vila-sol-vs-vilamoura-old-course-which-should-you-play')} if you're choosing."))
c.append(P(f"**For value,** Laguna and Millennium start at €88, and Vila Sol's twilight rate is €60. See {G('the cheapest golf in Vilamoura', 'cheapest-golf-in-vilamoura')}."))
c.append(P(f"**For a change of scene,** Vale do Lobo and Quinta do Lago are under half an hour east."))

c.append(H2("Getting there"))
c.append(P(f"Tivoli Marina Vilamoura is about **40 minutes and 27 km from Faro Airport** by car, without traffic. See {G('Faro Airport to Vilamoura with golf clubs', 'faro-airport-to-vilamoura-with-golf-clubs')} for taxis, transfers and car hire."))

c.append(H2("Golf near Tivoli Marina Vilamoura: common questions"))
c.append(H3("What is the closest golf course to Tivoli Marina Vilamoura?"))
c.append(P("Vilamoura Pinhal, about 10 minutes away by car, followed by Laguna, Millennium and the Old Course at about 12 minutes."))
c.append(H3("Does Tivoli Marina Vilamoura have a golf shuttle?"))
c.append(P("Its golf page says the team can arrange transfers to the courses on request, and package sellers list a free shuttle to the Vilamoura courses. Check the details with the hotel, as shuttles can depend on your package."))
c.append(H3("Can I walk to a golf course from Tivoli Marina?"))
c.append(P("Not really. The courses are inland from the marina, and the closest, Pinhal, is about 4 km away by road."))
c.append(H3("Do I need a handicap to play near Tivoli Marina Vilamoura?"))
c.append(P(f"Yes. The Vilamoura courses, Vila Sol and Vale do Lobo ask for a handicap certificate of up to 28 for men and 36 for ladies. See {G('do you need a handicap to play golf in the Algarve?', 'do-you-need-a-handicap-to-play-golf-in-the-algarve')}"))

json.dump(c, open(os.path.join(HERE, 'tivolimarina.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
