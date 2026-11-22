# "Golf courses near Tivoli Alvor" (topic #27, sixth of the series). Built 22 Nov 2026.
# Sources:
# - Drive times: Mapbox Directions (no traffic) from the hotel's DB coordinates (37.1243314, -8.5779371), 22 Nov 2026;
#   airport origin -7.9660,37.0215 -> 61 min, 75 km.
# - Hotel: tivolihotels.com and minorhotels.com return 403. Minor Hotels press release (media.minorhotels.com, read
#   22 Nov 2026): "For golfers there are several courses close by"; Pluma Junior Club (4-12) with minigolf; hero photo =
#   official press-kit image "Tivoli_Alvor_Algarve_Resort_Pool_View_Hero_Shot" from the same media room. No golf desk,
#   shuttle or package found on official sources. All-inclusive levels, spa with indoor heated pool, shuttle to Alvor and the
#   beach, Booking.com 8.3, UK tour operators selling golf packages: our all-inclusive and hotels-near-penina guides.
# - Green fees: prices-2026-27.json (asserted). Penina from AlgarveGolf.net (club publishes no current rates). Slopes: FPG.
#   Walking: walking.ts. Alto facts (Cotton's last course, par 70, 5,432 m, handicap 36/36) and Penina facts (1966, first
#   course in the Algarve, club says Portuguese Open ten times, Resort Course no handicap): verified_course_facts.
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
prices = json.load(open(os.path.join(ROOT, 'web/scripts/data/prices-2026-27.json')))
def rng(slug, holes=18, slot='standard'):
    p = [r['price_eur'] for r in prices if r['slug'] == slug and r['holes'] == holes and r['time_slot'] == slot]
    return min(p), max(p)
EXPECT = {('alto-golf', 18, 'standard'): (75, 140), ('alto-golf', 18, 'twilight'): (50, 50), ('penina-championship', 18, 'standard'): (77, 110),
          ('penina-resort', 9, 'standard'): (28, 29), ('pestana-ferragudo', 18, 'standard'): (130, 230), ('vale-da-pinta', 18, 'standard'): (95, 180),
          ('gramacho', 18, 'standard'): (95, 180), ('morgado', 18, 'standard'): (82, 128), ('palmares', 18, 'standard'): (138, 183)}
for (s, h, t), v in EXPECT.items():
    assert rng(s, h, t) == v, (s, rng(s, h, t))

P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}
C = lambda name, slug: f'[{name}](/courses/{slug})'
G = lambda name, slug: f'[{name}](/guide/{slug})'
fee = lambda s, h=18: '€{} to €{}'.format(*rng(s, h))

c = []
c.append(P(f"Tivoli Alvor Algarve is a five-star all-inclusive resort just outside Alvor, and the closest golf course is {C('Alto Golf', 'alto-golf')}, about **5 minutes** away by car. The two Sir Henry Cotton courses at {C('Penina', 'penina-championship')} are about 16 minutes away, and {C('Pestana Ferragudo', 'pestana-ferragudo')}, Pestana's Carvoeiro courses, {C('Morgado', 'morgado')} and {C('Palmares', 'palmares')} are all within about half an hour. **Last checked: November 2026.**"))

c.append(H2("Golf courses closest to Tivoli Alvor"))
rows = [
    [C('Alto Golf', 'alto-golf'), '5 min (2.5 km)', '18 holes', fee('alto-golf')],
    [C('Penina Championship', 'penina-championship'), '16 min (10 km)', '18 holes', fee('penina-championship')],
    [C('Penina Resort Course', 'penina-resort'), '16 min (10 km)', '9 holes', '€{} to €{}'.format(*rng('penina-resort', 9))],
    [C('Pestana Ferragudo', 'pestana-ferragudo'), '21 min (10 km)', '18 holes', fee('pestana-ferragudo')],
    [f"{C('Vale da Pinta', 'vale-da-pinta')} and {C('Gramacho', 'gramacho')}", '24–25 min (16–17 km)', '18 holes', fee('gramacho')],
    [C('Morgado', 'morgado'), '26 min (17 km)', '18 holes', fee('morgado')],
    [C('Palmares', 'palmares'), '27 min (18 km)', '27 holes', fee('palmares')],
]
c.append({'type': 'table', 'caption': 'Drive times and green fees from Tivoli Alvor',
  'headers': ['Course', 'Drive from the hotel', 'Holes', 'Visitor green fee (2026/27)'], 'rows': rows,
  'note': "Not a complete list. Drive times without traffic (Mapbox), checked November 2026. Green fees are the lowest and highest standard visitor rates for the 2026/27 season, from each club's own online booking or Pestana's price list; Penina from AlgarveGolf.net, as the club publishes no current rates. Most 18-hole courses ask for a handicap certificate of up to 28 for men and 36 for ladies; Alto Golf accepts 36 for men too, Pestana's website gives 27 and 35 for Gramacho and Vale da Pinta, and the Penina Resort Course doesn't ask for one."})

c.append(H2("The nearest courses at a glance"))
c.append(P("Slope ratings are from the Portuguese Golf Federation for the back tees: the higher the number, the harder the course for an average golfer."))
c.append(P(f"**{C('Alto Golf', 'alto-golf')}** (par 70, 5,432 m, slope 130): the last course Sir Henry Cotton designed, run by Pestana. It's one of the few full-length courses that accepts a **handicap of up to 36 for men as well as ladies**, so it suits higher handicappers. Undulating, with sloping greens. Twilight is €50. See the [Alto Golf scorecard](/courses/alto-golf/scorecard)."))
c.append(P(f"**{C('Penina Championship', 'penina-championship')}** (par 73, 6,273 m, slope 143): Cotton's 1966 course, the first in the Algarve, which the club says has hosted the Portuguese Open ten times. Flat, but the hardest course near the hotel on slope. See the [Penina hole-by-hole guide](/courses/penina-championship/hole-by-hole)."))
c.append(P(f"**{C('Penina Resort Course', 'penina-resort')}** (9 holes, par 35, 2,987 m): a full-length nine beside the Championship course that **doesn't ask for a handicap**, so it's a good start for newer golfers."))
c.append(P(f"**{C('Pestana Ferragudo', 'pestana-ferragudo')}** (par 72, 5,841 m, slope 118): Pestana's newest course, opened in 2026, and the easiest 18 near the hotel on slope."))
c.append(P(f"**{C('Morgado', 'morgado')}** (par 73, 6,581 m, slope 134): golfers describe its fairways as wide and forgiving, and the back nine is hillier, so a buggy is recommended. Golfers find its sister course, {C('Alamos', 'alamos')}, tighter; it's about 31 minutes from the hotel. See {G('Alamos vs Morgado', 'alamos-vs-morgado-which-portimao-golf-course-should-you-play')}."))
c.append(P(f"**{C('Palmares', 'palmares')}** (27 holes, slope 129 to 134): Robert Trent Jones Jr.'s course between the sea and the hills at Lagos, with three nines and real elevation changes."))

c.append(H2("Golf at Tivoli Alvor"))
c.append(P("Tivoli Alvor doesn't have its own golf course, and we didn't find a golf desk, golf shuttle or golf package on its official websites, which only say there are several courses close by. UK golf tour operators do sell packages here with rounds at nearby courses, so compare those with booking your rounds directly with the clubs."))
c.append(P(f"As an all-inclusive resort, it suits a family holiday with a few rounds: there's a spa with an indoor heated pool, the Pluma Junior Club for children aged 4 to 12, with its own minigolf, and a complimentary shuttle into Alvor and down to the beach. See {G('all-inclusive golf hotels in the Algarve', 'all-inclusive-golf-hotels-in-the-algarve')} for what all-inclusive covers for golfers."))
c.append({'type': 'hotel', 'name': 'Tivoli Alvor Algarve – All Inclusive Resort', 'lat': 37.1243314, 'lng': -8.5779371, 'tier': 'All-inclusive',
  'text': "A five-star all-inclusive resort near Alvor, rated **8.3 on Booking.com**, with Alto Golf about 5 minutes away and the Penina courses about 16.",
  'perks': ['All-inclusive', 'Spa with indoor pool', "Pluma Junior Club (ages 4–12)", 'Shuttle to Alvor town and beach', 'Alto Golf 5 minutes away'],
  'rating': 8.3, 'ratingSource': 'Booking.com', 'driveMin': 5, 'distanceKm': 2.5,
  'bookingUrl': 'https://www.booking.com/hotel/pt/tivoli-alvor-algarve-resort.html'})

c.append(H2("Which course to play from Tivoli Alvor"))
c.append(P(f"**For the shortest drive,** Alto Golf is 5 minutes away. Compare it with Penina in {G('Alto Golf vs Penina Championship', 'alto-golf-vs-penina-championship-which-portimao-course-should-you-play')}."))
c.append(P(f"**For history,** play the Penina Championship course. If you're choosing between Penina's two courses, read {G('Penina Championship vs Penina Resort', 'penina-championship-vs-penina-resort-which-course-should-you-play')}."))
c.append(P("**For a higher handicap,** Alto Golf accepts up to 36 for men, and the Penina Resort Course doesn't ask for a handicap at all."))
c.append(P(f"**For more choices nearby,** see our page on [golf near Alvor](/alvor/golf-courses), which covers every course within half an hour of the town, and {G('hotels near Penina', 'hotels-near-penina-golf-resort')} for other places to stay."))

c.append(H2("Getting there"))
c.append(P(f"Tivoli Alvor is about **1 hour and 75 km from Faro Airport** by car, without traffic. See {G('Faro Airport to Portimão and Alvor for golfers', 'faro-airport-to-portimao-and-alvor-for-golfers')} for taxis, transfers and car hire."))

c.append(H2("Golf near Tivoli Alvor: common questions"))
c.append(H3("What is the closest golf course to Tivoli Alvor?"))
c.append(P("Alto Golf, about 5 minutes away by car. The Penina Championship and Resort courses are about 16 minutes away."))
c.append(H3("Does Tivoli Alvor have a golf course?"))
c.append(P("No. It has a minigolf course for children in its junior club, but no full golf course. The nearest is Alto Golf."))
c.append(H3("Does Tivoli Alvor sell golf packages?"))
c.append(P("We didn't find one on its official websites, but UK golf tour operators sell packages at the resort with rounds at nearby courses."))
c.append(H3("Do I need a handicap to play near Tivoli Alvor?"))
c.append(P(f"At most 18-hole courses, yes, usually up to 28 for men and 36 for ladies. Alto Golf accepts 36 for men too, and the Penina Resort Course doesn't ask for one. See {G('do you need a handicap to play golf in the Algarve?', 'do-you-need-a-handicap-to-play-golf-in-the-algarve')}"))

json.dump(c, open(os.path.join(HERE, 'tivolialvor.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
