# "Golf courses near Hilton Vilamoura" (topic #27, third of the series). Built 22 Nov 2026.
# Sources:
# - Drive times: Mapbox Directions (no traffic) from the hotel's DB coordinates (37.0931655, -8.1116104), 22 Nov 2026;
#   Pinhal 0.1 km (hotel overlooks it), airport origin -7.9660,37.0215 -> 30 min, 24 km.
# - Green fees: web/scripts/data/prices-2026-27.json (asserted). Slopes: FPG back tees (course-ratings.ts). Walking: walking.ts.
#   Designers/years/par/length: courses table. Vilamoura Golf rules (4h40, four-balls, handicap 28/36): pace.ts + our guides.
#   Laguna free shared buggy offer: our buggy guide (vilamouragolf.com offer, checked Nov 2026; "Laguna on Wheels" still listed
#   on /en/special-offers/ on 22 Nov 2026).
# - Hotel: hilton.com 403. Vilamoura Golf official site (read 22 Nov 2026) lists "Hilton – As Cascatas Golf Resort & Spa" on
#   /en/accommodation/ and As Cascatas on /en/stay-play/ ("A prestigious collection of apartments overlooking the Pinhal Golf
#   Course"); Stay & Play is a request form (rounds, courses), no published package price. Booking.com 8.5, 7Seven Spa:
#   our earlier guides. Vilamoura International Golf Classic 9-16 Jan 2027 package at the Hilton: our tournaments guide
#   (organiser's page, checked Nov 2026).
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
prices = json.load(open(os.path.join(ROOT, 'web/scripts/data/prices-2026-27.json')))
def rng(slug, holes=18, slot='standard'):
    p = [r['price_eur'] for r in prices if r['slug'] == slug and r['holes'] == holes and r['time_slot'] == slot]
    return min(p), max(p)
EXPECT = {('vilamoura-pinhal', 18, 'standard'): (101, 144), ('vilamoura-old-course', 18, 'standard'): (215, 301),
          ('vila-sol', 18, 'standard'): (140, 215), ('vila-sol', 18, 'twilight'): (60, 60),
          ('vilamoura-laguna', 18, 'standard'): (88, 136), ('vilamoura-millennium', 18, 'standard'): (88, 136),
          ('vale-do-lobo-royal', 18, 'standard'): (116, 171), ('pine-cliffs', 9, 'standard'): (59, 79), ('quinta-do-lago-laranjal', 18, 'standard'): (170, 242)}
for (s, h, t), v in EXPECT.items():
    assert rng(s, h, t) == v, (s, rng(s, h, t))
assert "target: '4h40 for 18 holes'" in open(os.path.join(ROOT, 'web/src/data/pace.ts')).read()

P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}
C = lambda name, slug: f'[{name}](/courses/{slug})'
G = lambda name, slug: f'[{name}](/guide/{slug})'
fee = lambda s, h=18: '€{} to €{}'.format(*rng(s, h))

c = []
c.append(P(f"Hilton Vilamoura As Cascatas Golf Resort & Spa overlooks the {C('Pinhal', 'vilamoura-pinhal')} course, so the first tee is practically on the doorstep. The {C('Old Course', 'vilamoura-old-course')} and {C('Vila Sol', 'vila-sol')} are about 5 and 6 minutes away by car, and {C('Laguna', 'vilamoura-laguna')} and {C('Millennium', 'vilamoura-millennium')} about 7, which puts five of the Algarve's best-known courses within a few minutes of the hotel. **Last checked: November 2026.**"))

c.append(H2("Golf courses closest to Hilton Vilamoura"))
rows = [
    [C('Vilamoura Pinhal', 'vilamoura-pinhal'), 'Next to the hotel', fee('vilamoura-pinhal')],
    [C('Vilamoura Old Course', 'vilamoura-old-course'), '5 min (2.6 km)', fee('vilamoura-old-course')],
    [C('Vila Sol', 'vila-sol'), '6 min (2.7 km)', fee('vila-sol')],
    [f"{C('Vilamoura Laguna', 'vilamoura-laguna')} and {C('Millennium', 'vilamoura-millennium')}", '7 min (3.7 km)', fee('vilamoura-laguna')],
    [f"{C('Vale do Lobo Royal', 'vale-do-lobo-royal')} and {C('Ocean', 'vale-do-lobo-ocean')}", '19 min (10 km)', fee('vale-do-lobo-royal')],
    [C('Pine Cliffs', 'pine-cliffs') + ' (9 holes)', '20 min (12 km)', '€{} to €{}'.format(*rng('pine-cliffs', 9)) + ' for 9 holes'],
    [C('Quinta do Lago Laranjal', 'quinta-do-lago-laranjal'), '21 min (15 km)', fee('quinta-do-lago-laranjal')],
]
c.append({'type': 'table', 'caption': 'Drive times and 18-hole green fees from Hilton Vilamoura',
  'headers': ['Course', 'Drive from the hotel', 'Visitor green fee, 18 holes (2026/27)'], 'rows': rows,
  'note': "Not a complete list. Drive times without traffic (Mapbox), checked November 2026. Green fees are the lowest and highest standard visitor rates for the 2026/27 season, from each club's own online booking or Pestana's price list. All the 18-hole courses ask for a handicap certificate, up to 28 for men and 36 for ladies. The Els Club, about 16 minutes away, is a private members' club."})

c.append(H2("The nearest courses at a glance"))
c.append(P("Slope ratings are from the Portuguese Golf Federation for the back tees: the higher the number, the harder the course for an average golfer. Pinhal, the Old Course, Laguna and Millennium are all run by Vilamoura Golf, which allows 4 hours 40 minutes for a round and pairs players into four-balls."))
c.append(P(f"**{C('Vilamoura Pinhal', 'vilamoura-pinhal')}** (par 72, 6,353 m, slope 140): Frank Pennink's 1976 course through the pines, right beside the hotel. The toughest of the Vilamoura courses on slope, with most of its slopes on the back nine. See the [Pinhal hole-by-hole guide](/courses/vilamoura-pinhal/hole-by-hole)."))
c.append(P(f"**{C('Vilamoura Old Course', 'vilamoura-old-course')}** (par 73, 6,254 m, slope 136): Pennink's original 1969 design and Vilamoura's most famous course, lined with umbrella pines. Also the most expensive round in Vilamoura. See the [Old Course scorecard](/courses/vilamoura-old-course/scorecard) and [hole-by-hole guide](/courses/vilamoura-old-course/hole-by-hole)."))
c.append(P(f"**{C('Vila Sol', 'vila-sol')}** (27 holes, slope 135 to 137): Donald Steel's 1991 course, run by Pestana, with three nines played in pairs and mainly sweeping fairways. Its twilight rate is €60 from 3.30pm."))
c.append(P(f"**{C('Vilamoura Laguna', 'vilamoura-laguna')}** (par 72, 6,121 m, slope 135): Joseph Lee's 1990 course, flatter and more open than the pine-lined courses, with plenty of water. Vilamoura Golf is offering a free shared buggy on Laguna for new bookings made by 31 December 2026, for play until the end of 2027 outside its busiest periods; see {G('golf buggy hire', 'golf-buggy-hire-in-the-algarve')}."))
c.append(P(f"**{C('Vilamoura Millennium', 'vilamoura-millennium')}** (par 72, 6,176 m, slope 130): Martin Hawtree's 2000 course, flat with wide fairways, and the easiest of the Vilamoura courses on slope. Laguna and Millennium share the lowest green fees in Vilamoura, from €88. See {G('the cheapest golf in Vilamoura', 'cheapest-golf-in-vilamoura')}."))

c.append(H2("Golf at Hilton Vilamoura"))
c.append(P("Vilamoura Golf lists Hilton Vilamoura As Cascatas among the hotels on its own website, and its Stay & Play service puts together packages with your choice of rounds and courses at these hotels. It doesn't publish fixed package prices, so you send a request through the form on the [Vilamoura Golf Stay & Play page](https://www.vilamouragolf.com/en/stay-play/). The resort has hotel rooms and apartments, which suit a group, and the 7Seven Spa for after the round."))
c.append(P(f"In January the hotel is also the base for the **Vilamoura International Golf Classic**, a week-long amateur event on the Vilamoura courses, sold as a package with seven nights at the Hilton. See {G('golf tournaments in the Algarve', 'golf-tournaments-in-the-algarve')} for dates, prices and handicap limits."))
c.append({'type': 'hotel', 'name': 'Hilton Vilamoura As Cascatas Golf Resort & Spa', 'lat': 37.0931655, 'lng': -8.1116104, 'tier': 'On-site',
  'text': "A five-star resort of hotel rooms and apartments overlooking the Pinhal course, rated **8.5 on Booking.com**, with the Old Course about 5 minutes away.",
  'perks': ['Overlooks the Pinhal course', 'Listed on Vilamoura Golf Stay & Play', 'Apartments and hotel rooms', '7Seven Spa'],
  'rating': 8.5, 'ratingSource': 'Booking.com', 'driveMin': 1, 'distanceKm': 0.1,
  'bookingUrl': 'https://www.booking.com/hotel/pt/hilton-vilamoura.html'})

c.append(H2("Which course to play from Hilton Vilamoura"))
c.append(P(f"**For the classic Vilamoura round,** play the Old Course. Read {G('Vilamoura Old Course vs Millennium', 'vilamoura-old-course-vs-millennium-which-one-should-you-play')} or {G('Vila Sol vs the Old Course', 'vila-sol-vs-vilamoura-old-course-which-should-you-play')} if you're choosing."))
c.append(P(f"**For the shortest walk,** Pinhal is next to the hotel. Compare it with Laguna in {G('Vilamoura Laguna vs Pinhal', 'vilamoura-laguna-vs-pinhal-which-course-should-you-play')}."))
c.append(P(f"**For value,** Laguna and Millennium start at €88, and Vila Sol's twilight rate is €60."))
c.append(P(f"**For a change of scene,** Vale do Lobo and Quinta do Lago are about 20 minutes away, and the short Pine Cliffs course on the cliffs at Olhos de Água about 20."))

c.append(H2("Getting there"))
c.append(P(f"Hilton Vilamoura is about **30 minutes and 24 km from Faro Airport** by car, without traffic. See {G('Faro Airport to Vilamoura with golf clubs', 'faro-airport-to-vilamoura-with-golf-clubs')} for taxis, transfers and car hire, and {G('golf hotels near Vilamoura', 'golf-hotels-near-vilamoura')} for other places to stay."))

c.append(H2("Golf near Hilton Vilamoura: common questions"))
c.append(H3("Which golf course is next to Hilton Vilamoura?"))
c.append(P("Vilamoura Pinhal. The hotel overlooks the course, and the Old Course is about 5 minutes away by car."))
c.append(H3("How many golf courses are near Hilton Vilamoura?"))
c.append(P("Pinhal, the Old Course, Laguna, Millennium and Vila Sol are all within about 7 minutes by car, and Vale do Lobo and Quinta do Lago are about 20 minutes away."))
c.append(H3("Does Hilton Vilamoura sell golf packages?"))
c.append(P("Vilamoura Golf's Stay & Play service lists the hotel and puts together packages with rounds on its courses, on request. Ask Vilamoura Golf or the hotel for a quote for your dates."))
c.append(H3("Do I need a handicap to play near Hilton Vilamoura?"))
c.append(P(f"Yes. The Vilamoura courses and Vila Sol ask for a handicap certificate of up to 28 for men and 36 for ladies. See {G('do you need a handicap to play golf in the Algarve?', 'do-you-need-a-handicap-to-play-golf-in-the-algarve')}"))

json.dump(c, open(os.path.join(HERE, 'hilton.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
