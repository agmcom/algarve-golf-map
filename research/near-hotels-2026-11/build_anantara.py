# "Golf courses near Anantara Vilamoura" (topic #27, seventh of the series). Built 22 Nov 2026.
# Sources:
# - Location: our DB had rounded coordinates (37.092, -8.124); OpenStreetMap Nominatim gives the hotel at 37.1029688,
#   -8.1416517 (Avenida dos Descobrimentos, 8125-309). Drive times: Mapbox Directions (no traffic) from that point,
#   22 Nov 2026; airport origin -7.9660,37.0215 -> 35 min, 27 km.
# - Hotel: anantara.com pages return 403; official fact sheet PDF (anantara.com/uploads/.../anantara-vilamoura-algarve-
#   resort_factsheet_en.pdf, read 22 Nov 2026): rooms and suites "with privileged views of ... the stunning Victoria golf
#   course"; Deluxe Golf View Room, Golf View Suite, Presidential Golf View Suite; "A Golf Expert can provide golf-lovers with
#   personalised coaching or a tailor-made match"; Anantara Spa with views over golf greens; indoor pool; 280 rooms and
#   suites; +351 289 317 000, vilamoura@anantara-hotels.com. The 2023 golf package PDF is out of date, so not used.
# - Victoria course = The Els Club Vilamoura, private members' club; Victoria Golf Resort & Spa hotel guests can book with
#   conditions (web/src/data/course-status.ts) — Anantara guests are not named, so we say ask the hotel.
# - Green fees: prices-2026-27.json (asserted). Slopes: FPG. Walking: walking.ts. Vilamoura Golf rules: pace.ts.
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
prices = json.load(open(os.path.join(ROOT, 'web/scripts/data/prices-2026-27.json')))
def rng(slug, holes=18, slot='standard'):
    p = [r['price_eur'] for r in prices if r['slug'] == slug and r['holes'] == holes and r['time_slot'] == slot]
    return min(p), max(p)
EXPECT = {('vilamoura-laguna', 18, 'standard'): (88, 136), ('vilamoura-millennium', 18, 'standard'): (88, 136),
          ('vilamoura-old-course', 18, 'standard'): (215, 301), ('vilamoura-pinhal', 18, 'standard'): (101, 144),
          ('vila-sol', 18, 'standard'): (140, 215), ('vila-sol', 18, 'twilight'): (60, 60), ('pine-cliffs', 9, 'standard'): (59, 79),
          ('balaia', 9, 'standard'): (50, 50), ('vale-do-lobo-royal', 18, 'standard'): (116, 171)}
for (s, h, t), v in EXPECT.items():
    assert rng(s, h, t) == v, (s, rng(s, h, t))
assert 'Guests of the Victoria Golf Resort & Spa hotel can book' in open(os.path.join(ROOT, 'web/src/data/course-status.ts')).read()

P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}
C = lambda name, slug: f'[{name}](/courses/{slug})'
G = lambda name, slug: f'[{name}](/guide/{slug})'
fee = lambda s, h=18: '€{} to €{}'.format(*rng(s, h))

c = []
c.append(P(f"Anantara Vilamoura Algarve Resort looks out over the course that used to be called Victoria, now The Els Club Vilamoura, and the Vilamoura courses you can book are all close: {C('Laguna', 'vilamoura-laguna')} and {C('Millennium', 'vilamoura-millennium')} are about **4 minutes** away by car, the {C('Old Course', 'vilamoura-old-course')} about 7 and {C('Pinhal', 'vilamoura-pinhal')} about 10. {C('Vila Sol', 'vila-sol')} is about 12 minutes away. **Last checked: November 2026.**"))

c.append(H2("Golf courses closest to Anantara Vilamoura"))
rows = [
    [f"{C('Vilamoura Laguna', 'vilamoura-laguna')} and {C('Millennium', 'vilamoura-millennium')}", '4 min (1.8 km)', '18 holes', fee('vilamoura-laguna')],
    [C('Vilamoura Old Course', 'vilamoura-old-course'), '7 min (3.3 km)', '18 holes', fee('vilamoura-old-course')],
    [C('Vilamoura Pinhal', 'vilamoura-pinhal'), '10 min (5.4 km)', '18 holes', fee('vilamoura-pinhal')],
    [C('Vila Sol', 'vila-sol'), '12 min (6.3 km)', '27 holes', fee('vila-sol')],
    [C('Pine Cliffs', 'pine-cliffs'), '15 min (7.5 km)', '9 holes', fee('pine-cliffs', 9)],
    [C('Balaia', 'balaia'), '17 min (10 km)', '9 holes, all par 3', '€50'],
    [f"{C('Vale do Lobo Royal', 'vale-do-lobo-royal')} and {C('Ocean', 'vale-do-lobo-ocean')}", '25 min (17 km)', '18 holes', fee('vale-do-lobo-royal')],
]
c.append({'type': 'table', 'caption': 'Drive times and green fees from Anantara Vilamoura',
  'headers': ['Course', 'Drive from the hotel', 'Holes', 'Visitor green fee (2026/27)'], 'rows': rows,
  'note': "Not a complete list. Drive times without traffic (Mapbox), checked November 2026. Green fees are the lowest and highest standard visitor rates for the 2026/27 season, from each club's own online booking or price list, for the holes shown. The 18-hole courses ask for a handicap certificate of up to 28 for men and 36 for ladies; Pine Cliffs doesn't ask for one."})
c.append(P(f"**The course next to the hotel is private.** The former Victoria course is now {C('The Els Club Vilamoura', 'victoria-els-club')}, a private members' club. Its guest page lets guests of the neighbouring Victoria Golf Resort & Spa hotel book a round, with conditions, but doesn't mention Anantara, so ask the hotel before you count on playing it."))

c.append(H2("The nearest courses at a glance"))
c.append(P("Slope ratings are from the Portuguese Golf Federation for the back tees: the higher the number, the harder the course for an average golfer. The four Vilamoura courses are run by Vilamoura Golf, which allows 4 hours 40 minutes for a round and pairs players into four-balls."))
c.append(P(f"**{C('Vilamoura Laguna', 'vilamoura-laguna')}** (par 72, 6,121 m, slope 135): flatter and more open than the pine-lined Vilamoura courses, with plenty of water. Vilamoura Golf is offering a free shared buggy on Laguna for new bookings made by 31 December 2026, for play until the end of 2027 outside its busiest periods."))
c.append(P(f"**{C('Vilamoura Millennium', 'vilamoura-millennium')}** (par 72, 6,176 m, slope 130): Martin Hawtree's flat course with wide fairways, the easiest of the Vilamoura courses on slope. Laguna and Millennium share the lowest green fees in Vilamoura, from €88."))
c.append(P(f"**{C('Vilamoura Old Course', 'vilamoura-old-course')}** (par 73, 6,254 m, slope 136): Frank Pennink's 1969 course through the umbrella pines, Vilamoura's most famous and most expensive round. See the [Old Course scorecard](/courses/vilamoura-old-course/scorecard) and [hole-by-hole guide](/courses/vilamoura-old-course/hole-by-hole)."))
c.append(P(f"**{C('Vilamoura Pinhal', 'vilamoura-pinhal')}** (par 72, 6,353 m, slope 140): the toughest Vilamoura course on slope, with most of its slopes on the back nine. See the [Pinhal hole-by-hole guide](/courses/vilamoura-pinhal/hole-by-hole)."))
c.append(P(f"**{C('Vila Sol', 'vila-sol')}** (27 holes, slope 135 to 137): Donald Steel's Pestana course, with three nines played in pairs and a €60 twilight rate from 3.30pm."))
c.append(P(f"**{C('Pine Cliffs', 'pine-cliffs')}** (9 holes, par 32): a short clifftop course at Olhos de Água that doesn't ask for a handicap, about 15 minutes away. Its 6th, the Devil's Parlour, is played across the clifftop."))

c.append(H2("Golf at Anantara Vilamoura"))
c.append(P("Many of the resort's rooms and suites, including its Golf View rooms and suites, look over the fairways of the neighbouring course. The hotel's fact sheet says its **Golf Expert** can give personalised coaching or set up a tailor-made match. It doesn't publish a current golf package on its fact sheet, so ask the hotel what it can arrange for your dates, at vilamoura@anantara-hotels.com or +351 289 317 000."))
c.append(P(f"For after the round, there's the Anantara Spa, an indoor pool and a gym. If you're comparing hotels in the area, see {G('golf hotels near Vilamoura', 'golf-hotels-near-vilamoura')}."))
c.append({'type': 'hotel', 'name': 'Anantara Vilamoura Algarve Resort', 'lat': 37.1029688, 'lng': -8.1416517, 'tier': 'Luxury',
  'text': "A five-star resort overlooking the fairways of The Els Club, with Laguna and Millennium about 4 minutes away and the Old Course about 7. Its Golf Expert offers coaching and arranges matches.",
  'perks': ['Golf View rooms and suites', 'Golf Expert for coaching and matches', 'Anantara Spa', 'Indoor pool'],
  'driveMin': 4, 'distanceKm': 1.8,
  'bookingUrl': 'https://www.booking.com/hotel/pt/anantara-vilamoura.html'})

c.append(H2("Which course to play from Anantara Vilamoura"))
c.append(P(f"**For the classic Vilamoura round,** play the Old Course. Read {G('Vilamoura Old Course vs Millennium', 'vilamoura-old-course-vs-millennium-which-one-should-you-play')} if you're choosing."))
c.append(P(f"**For value,** Laguna and Millennium are the closest courses and the cheapest, from €88. See {G('the cheapest golf in Vilamoura', 'cheapest-golf-in-vilamoura')}."))
c.append(P(f"**For a challenge,** Pinhal has the highest slope in Vilamoura. Compare it with Laguna in {G('Vilamoura Laguna vs Pinhal', 'vilamoura-laguna-vs-pinhal-which-course-should-you-play')}."))
c.append(P("**For a quick round,** Pine Cliffs and Balaia are 9-hole courses within about 17 minutes."))

c.append(H2("Getting there"))
c.append(P(f"Anantara Vilamoura is about **35 minutes and 27 km from Faro Airport** by car, without traffic. See {G('Faro Airport to Vilamoura with golf clubs', 'faro-airport-to-vilamoura-with-golf-clubs')} for taxis, transfers and car hire."))

c.append(H2("Golf near Anantara Vilamoura: common questions"))
c.append(H3("Which golf course is next to Anantara Vilamoura?"))
c.append(P("The former Victoria course, now The Els Club Vilamoura, a private members' club. The closest courses you can book as a visitor are Laguna and Millennium, about 4 minutes away."))
c.append(H3("Can Anantara guests play The Els Club?"))
c.append(P("The club's guest page offers rounds to guests of the Victoria Golf Resort & Spa hotel, with conditions, and doesn't mention Anantara. Ask the hotel before you book."))
c.append(H3("Does Anantara Vilamoura offer golf lessons?"))
c.append(P("Yes. Its Golf Expert offers personalised coaching and can arrange a tailor-made match. You can also book lessons at the Vilamoura Golf academy; see [Algarve golf academies](/golf-academies)."))
c.append(H3("Do I need a handicap to play near Anantara Vilamoura?"))
c.append(P(f"At the 18-hole courses, yes: up to 28 for men and 36 for ladies. Pine Cliffs doesn't ask for one. See {G('do you need a handicap to play golf in the Algarve?', 'do-you-need-a-handicap-to-play-golf-in-the-algarve')}"))

json.dump(c, open(os.path.join(HERE, 'anantara.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
