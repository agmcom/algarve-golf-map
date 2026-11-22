# "Golf courses near Dona Filipa Hotel" (topic #27, fifth of the series). Built 22 Nov 2026.
# Sources:
# - Drive times: Mapbox Directions (no traffic) from the hotel's DB coordinates (37.0505542, -8.064496), 22 Nov 2026;
#   airport origin -7.9660,37.0215 -> 31 min, 19 km.
# - Hotel (official site donafilipa-hotel.com, read 22 Nov 2026): /en/golf.html "the hotel offers guests the opportunity to
#   play on renowned courses such as Ombria, Vale do Lobo, Quinta do Lago, and Vilamoura. Additionally, the hotel provides
#   complimentary transfers to the golf courses included in the stays carefully curated for its guests." and "Free transfer
#   service for hotel guests: Dona Filipa Hotel offers a free transfer directly to our partner golf courses." San Lorenzo
#   listed "(Closed for Renovation)". /en/promotions.html: Short Break Golf Challenge (11-15 Feb 2027, min 4 nights);
#   International Amateur Tournament (28 Nov-5 Dec 2026, min 7); Spring Amateur Tournament (13-20 Mar 2027, min 7);
#   Multi-Course Golf Package (3, 5 or 7 nights); Vale do Lobo Amateur Week (24-30 Jan 2027, min 7); no prices shown.
#   Homepage: 200 m from the beach, private beach area with table service, kids' club, 154 rooms and suites.
#   Booking.com 7.9: our hotels-near-vale-do-lobo guide. Booking link = search URL as in that guide.
# - Green fees: prices-2026-27.json (asserted). Slopes: FPG back tees. Walking: walking.ts. Royal 16th: hole-guides.ts.
#   Vale do Lobo Sunset rate with shared buggy, from €76: our green-fee data and guides.
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
prices = json.load(open(os.path.join(ROOT, 'web/scripts/data/prices-2026-27.json')))
def rng(slug, holes=18, slot='standard'):
    p = [r['price_eur'] for r in prices if r['slug'] == slug and r['holes'] == holes and r['time_slot'] == slot]
    return min(p), max(p)
EXPECT = {('vale-do-lobo-royal', 18, 'standard'): (116, 171), ('vale-do-lobo-royal', 18, 'twilight'): (76, 101),
          ('quinta-do-lago-south', 18, 'standard'): (188, 264), ('quinta-do-lago-north', 18, 'standard'): (170, 242),
          ('pinheiros-altos', 18, 'standard'): (99, 122), ('quinta-do-lago-laranjal', 18, 'standard'): (170, 242),
          ('vila-sol', 18, 'standard'): (140, 215), ('vilamoura-pinhal', 18, 'standard'): (101, 144),
          ('vilamoura-old-course', 18, 'standard'): (215, 301), ('vilamoura-laguna', 18, 'standard'): (88, 136),
          ('ombria', 18, 'standard'): (85, 216)}
for (s, h, t), v in EXPECT.items():
    assert rng(s, h, t) == v, (s, rng(s, h, t))

P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}
C = lambda name, slug: f'[{name}](/courses/{slug})'
G = lambda name, slug: f'[{name}](/guide/{slug})'
fee = lambda s: '€{} to €{}'.format(*rng(s))

c = []
c.append(P(f"The Dona Filipa Hotel is inside the Vale do Lobo estate, about 200 metres from the beach, and the two Vale do Lobo courses, the {C('Royal', 'vale-do-lobo-royal')} and the {C('Ocean', 'vale-do-lobo-ocean')}, are about **2 minutes** away by car. {C('Quinta do Lago', 'quinta-do-lago-south')} and {C('Pinheiros Altos', 'pinheiros-altos')} are about 12 to 13 minutes away, and the hotel gives guests **free transfers to its partner golf courses**. **Last checked: November 2026.**"))

c.append(H2("Golf courses closest to the Dona Filipa Hotel"))
rows = [
    [f"{C('Vale do Lobo Royal', 'vale-do-lobo-royal')} and {C('Ocean', 'vale-do-lobo-ocean')}", '2 min (0.7 km)', fee('vale-do-lobo-royal')],
    [f"{C('Quinta do Lago South', 'quinta-do-lago-south')} and {C('North', 'quinta-do-lago-north')}", '12 min (6.5 km)', '€170 to €264'],
    [C('Pinheiros Altos', 'pinheiros-altos'), '13 min (7 km)', fee('pinheiros-altos')],
    [C('Quinta do Lago Laranjal', 'quinta-do-lago-laranjal'), '16 min (9 km)', fee('quinta-do-lago-laranjal')],
    [C('Vila Sol', 'vila-sol'), '17 min (8 km)', fee('vila-sol')],
    [C('Vilamoura Pinhal', 'vilamoura-pinhal'), '19 min (11 km)', fee('vilamoura-pinhal')],
    [C('Vilamoura Old Course', 'vilamoura-old-course'), '21 min (12 km)', fee('vilamoura-old-course')],
    [f"{C('Vilamoura Laguna', 'vilamoura-laguna')} and {C('Millennium', 'vilamoura-millennium')}", '23 min (13 km)', fee('vilamoura-laguna')],
    [C('Ombria', 'ombria'), '29 min (23 km)', fee('ombria')],
]
c.append({'type': 'table', 'caption': 'Drive times and 18-hole green fees from the Dona Filipa Hotel',
  'headers': ['Course', 'Drive from the hotel', 'Visitor green fee, 18 holes (2026/27)'], 'rows': rows,
  'note': "Not a complete list. Drive times without traffic (Mapbox), checked November 2026. Green fees are the lowest and highest standard visitor rates for the 2026/27 season, from each club's own online booking or price list; Pinheiros Altos from AlgarveGolf.net, as the club publishes no rates. All these courses ask for a handicap certificate, up to 28 for men and 36 for ladies. San Lorenzo, the hotel's long-standing partner course, is closed for renovation until mid-2028."})

c.append(H2("The nearest courses at a glance"))
c.append(P("Slope ratings are from the Portuguese Golf Federation for the back tees: the higher the number, the harder the course for an average golfer."))
c.append(P(f"**{C('Vale do Lobo Royal', 'vale-do-lobo-royal')}** (par 72, 6,005 m, slope 133): home of the famous par-3 16th, played across a ravine towards the beach. Golf guides disagree on how hilly it is, with some climbs on the back nine. See the [Royal scorecard](/courses/vale-do-lobo-royal/scorecard) and [hole-by-hole guide](/courses/vale-do-lobo-royal/hole-by-hole)."))
c.append(P(f"**{C('Vale do Lobo Ocean', 'vale-do-lobo-ocean')}** (par 73, 6,122 m, slope 140): Sir Henry Cotton's original 1968 course, hillier than the Royal, so a buggy is advised. See the [Ocean hole-by-hole guide](/courses/vale-do-lobo-ocean/hole-by-hole)."))
c.append(P("Vale do Lobo's late-afternoon **Sunset rate** costs the same as its twilight rate, from €76 in winter, and includes a shared buggy for full-paying adults. The club asks golfers to finish 18 holes in 4 hours 30 minutes."))
c.append(P(f"**{C('Quinta do Lago South', 'quinta-do-lago-south')}** (par 72, 6,500 m, slope 139) and **{C('North', 'quinta-do-lago-north')}** (par 72, 6,140 m, slope 133): the South is the championship course and has hosted the Portuguese Open eight times; the North, redesigned in 2014, is a little more forgiving but hillier. See {G('Quinta do Lago South vs North', 'quinta-do-lago-south-vs-north-which-course-should-you-play')}."))
c.append(P(f"**{C('Pinheiros Altos', 'pinheiros-altos')}** (27 holes, slope up to 141): three nines played in pairs, with the lowest green fees of the courses nearest the hotel."))
c.append(P(f"**{C('Ombria', 'ombria')}** (par 71, 5,802 m, slope 132): a hilly course opened in 2023 in the countryside north of Loulé, about half an hour away. Its green fee includes a shared buggy, subject to availability."))

c.append(H2("Golf at the Dona Filipa Hotel"))
c.append(P("The hotel's website names Vale do Lobo, Quinta do Lago, Vilamoura and Ombria among the courses its guests play, and says it offers a **free transfer to its partner golf courses** for hotel guests. Its golf stays are sold as packages on its own website:"))
c.append(P("**Multi-Course Golf Package:** 3, 5 or 7 nights, with rounds on different Algarve courses and the hotel as your base."))
c.append(P("**Tournament weeks:** the International Amateur Tournament (28 November to 5 December 2026), the Vale do Lobo Amateur Week (24 to 30 January 2027), the Short Break Golf Challenge (11 to 15 February 2027, minimum 4 nights) and the Spring Amateur Tournament (13 to 20 March 2027), each with a minimum 7-night stay unless stated."))
c.append(P("The hotel doesn't publish package prices on its promotions page, so check them in its online booking for your dates, or contact it at info@hoteldonafilipa.pt or +351 289 100 980. For non-golfers, there's a kids' club, a wellness centre, tennis courts and a private area on Vale do Lobo beach."))
c.append({'type': 'hotel', 'name': 'Dona Filipa Hotel', 'lat': 37.0505542, 'lng': -8.064496, 'tier': 'On-site',
  'text': "A five-star hotel inside Vale do Lobo, about 200 metres from the beach and 2 minutes from the Royal and Ocean courses, rated **7.9 on Booking.com**. Free transfers to its partner golf courses and golf packages for 3 to 7 nights.",
  'perks': ['Free transfers to partner golf courses', 'Golf and tournament packages', "Kids' club", 'Private beach area', 'Tennis courts'],
  'rating': 7.9, 'ratingSource': 'Booking.com', 'driveMin': 2, 'distanceKm': 0.7,
  'bookingUrl': 'https://www.booking.com/searchresults.html?ss=Dona%20Filipa%20Hotel%20Vale%20do%20Lobo'})

c.append(H2("Which course to play from the Dona Filipa"))
c.append(P(f"**For the classic round,** play the Royal and its clifftop 16th. Read {G('Vale do Lobo Royal vs Ocean', 'vale-do-lobo-royal-vs-vale-do-lobo-ocean-which-course-should-you-play')} if you're choosing between the two."))
c.append(P("**For value,** take Vale do Lobo's Sunset rate with a shared buggy, or play Pinheiros Altos, from €99."))
c.append(P(f"**For a change of scene,** the Vilamoura courses are about 20 minutes away, and Laguna and Millennium start at €88. See {G('the cheapest golf in Vilamoura', 'cheapest-golf-in-vilamoura')}."))

c.append(H2("Getting there"))
c.append(P(f"The Dona Filipa Hotel is about **30 minutes and 19 km from Faro Airport** by car, without traffic. See {G('Faro Airport to Quinta do Lago and Vale do Lobo with golf clubs', 'faro-airport-to-quinta-do-lago-vale-do-lobo-with-golf-clubs')} for taxis and transfers, and {G('hotels near Vale do Lobo golf', 'hotels-near-vale-do-lobo-golf')} for other places to stay."))

c.append(H2("Golf near the Dona Filipa Hotel: common questions"))
c.append(H3("Which golf course is next to the Dona Filipa Hotel?"))
c.append(P("Vale do Lobo: the Royal and Ocean courses are about 2 minutes away by car, inside the same estate."))
c.append(H3("Does the Dona Filipa Hotel offer golf transfers?"))
c.append(P("Yes. Its website says hotel guests get a free transfer to its partner golf courses, and names Vale do Lobo, Quinta do Lago, Vilamoura and Ombria among the courses its guests play."))
c.append(H3("Can I still play San Lorenzo from the Dona Filipa?"))
c.append(P(f"Not for now. San Lorenzo, the hotel's long-standing partner course, closed on 19 October 2026 for a renovation and is due to reopen in mid-2028. See {G('where to play instead', 'san-lorenzo-golf-course-closed-until-2028-where-to-play-instead')}."))
c.append(H3("Do I need a handicap to play near the Dona Filipa?"))
c.append(P(f"Yes. All the nearby courses ask for a handicap certificate of up to 28 for men and 36 for ladies. See {G('do you need a handicap to play golf in the Algarve?', 'do-you-need-a-handicap-to-play-golf-in-the-algarve')}"))

json.dump(c, open(os.path.join(HERE, 'donafilipa.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
