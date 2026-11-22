# "Golf courses near Vila Vita Parc" (topic #27, fourth of the series). Built 22 Nov 2026.
# Sources:
# - Drive times: Mapbox Directions (no traffic) from the hotel's DB coordinates (37.1018506, -8.3793266), 22 Nov 2026;
#   airport origin -7.9660,37.0215 -> 50 min, 57 km.
# - Hotel golf offer: Vila Vita Parc official golf page, backoffice.vilavitaparc.com/en/experiences/golf (vilavitaparc.com
#   returns 403), read 22 Nov 2026: "access to a broad selection of golf courses of all levels in the Algarve, with
#   preferential rates and conditions"; "Our resident golf pro will help you take your first steps or improve your golf
#   technique"; "Resort Golf Facilities: 9-hole pitch and putt, 18-hole putting green, 18-hole mini-golf, Driving range, Golf
#   simulator"; inquiries customerservice@vilavitaparc.com, +351 282 310 100. Hero = official aerial photo from the same site
#   (/sites/default/files/2021-02/VILA VITA Aerial-web (1).jpg). Booking.com 9.4-9.5: our earlier guides (use 9.4, latest).
# - Green fees: web/scripts/data/prices-2026-27.json (asserted). Slopes: FPG back tees. Walking: walking.ts. Course facts:
#   courses table; Gramacho / Vale da Pinta handicap 27 men / 35 ladies on pestanagolf.com (2026 scorecards say 28/36), so
#   we give both; Vale de Milho no handicap, 9 par-3 holes, €22 (official fees page).
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
prices = json.load(open(os.path.join(ROOT, 'web/scripts/data/prices-2026-27.json')))
def rng(slug, holes=18, slot='standard'):
    p = [r['price_eur'] for r in prices if r['slug'] == slug and r['holes'] == holes and r['time_slot'] == slot]
    return min(p), max(p)
EXPECT = {('salgados', 18, 'standard'): (78, 139), ('vale-de-milho', 9, 'standard'): (22, 22), ('silves', 18, 'standard'): (95, 180),
          ('amendoeira-faldo', 18, 'standard'): (100, 212), ('vale-da-pinta', 18, 'standard'): (95, 180),
          ('gramacho', 18, 'standard'): (95, 180), ('gramacho', 18, 'twilight'): (55, 55), ('pestana-ferragudo', 18, 'standard'): (130, 230)}
for (s, h, t), v in EXPECT.items():
    assert rng(s, h, t) == v, (s, rng(s, h, t))

P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}
C = lambda name, slug: f'[{name}](/courses/{slug})'
G = lambda name, slug: f'[{name}](/guide/{slug})'
fee = lambda s, h=18: '€{} to €{}'.format(*rng(s, h))
OC = "O" + chr(39) + "Connor"

c = []
c.append(P(f"Vila Vita Parc is a clifftop resort at Porches, between Armação de Pêra and Carvoeiro, with golf facilities of its own: a driving range, a golf simulator, a 9-hole pitch and putt, an 18-hole putting green and a resident pro. For full rounds, {C('Salgados', 'salgados')} is about **15 minutes** away, and {C('Silves', 'silves')}, the two {C('Amendoeira', 'amendoeira-faldo')} courses and Pestana's {C('Vale da Pinta', 'vale-da-pinta')} and {C('Gramacho', 'gramacho')} are all within about 20 minutes. **Last checked: November 2026.**"))

c.append(H2("Golf courses closest to Vila Vita Parc"))
rows = [
    [C('Salgados', 'salgados'), '15 min (9 km)', '18 holes', fee('salgados')],
    [C('Vale de Milho', 'vale-de-milho'), '18 min (10 km)', '9 holes, all par 3', '€22'],
    [C('Silves', 'silves'), '18 min (11 km)', '18 holes', fee('silves')],
    [f"{C('Amendoeira Faldo', 'amendoeira-faldo')} and {C(OC, 'amendoeira-oconnor')}", '18 min (12 km)', '18 holes each', fee('amendoeira-faldo')],
    [C('Vale da Pinta', 'vale-da-pinta'), '20 min (12 km)', '18 holes', fee('vale-da-pinta')],
    [C('Gramacho', 'gramacho'), '22 min (13 km)', '18 holes', fee('gramacho')],
    [C('Pestana Ferragudo', 'pestana-ferragudo'), '25 min (17 km)', '18 holes', fee('pestana-ferragudo')],
    [f"{C('Penina Championship', 'penina-championship')} and {C('Resort', 'penina-resort')}", '29 min (24 km)', '18 and 9 holes', 'See course pages'],
]
c.append({'type': 'table', 'caption': 'Drive times and green fees from Vila Vita Parc',
  'headers': ['Course', 'Drive from the hotel', 'Holes', 'Visitor green fee (2026/27)'], 'rows': rows,
  'note': "Not a complete list. Drive times without traffic (Mapbox), checked November 2026. Green fees are the lowest and highest standard visitor rates for the 2026/27 season, from each club's own online booking or Pestana's price list. Vila Vita Parc says its guests get preferential rates at many Algarve courses, so ask the resort before booking direct. Most 18-hole courses ask for a handicap certificate of up to 28 for men and 36 for ladies; Pestana's website gives 27 and 35 for Gramacho and Vale da Pinta. Vale de Milho doesn't ask for one."})

c.append(H2("The nearest courses at a glance"))
c.append(P("Slope ratings are from the Portuguese Golf Federation for the back tees: the higher the number, the harder the course for an average golfer."))
c.append(P(f"**{C('Salgados', 'salgados')}** (par 72, 6,033 m, slope 129): flat and easy to walk, on the wetlands behind Praia da Galé, but with plenty of water and exposed to the wind. The cheapest 18-hole round near the resort, with twilight from €47."))
c.append(P(f"**{C('Amendoeira Faldo', 'amendoeira-faldo')}** (par 72, 6,598 m, slope 142) and **{C(OC, 'amendoeira-oconnor')}** (par 72, 6,708 m, slope 136): two 2008 courses side by side. The Faldo climbs the hillside and is the hardest near the resort; the O'Connor stays flat in the valley. The online green fee includes a buggy, if one is available."))
c.append(P(f"**{C('Silves', 'silves')}** (par 70, 5,592 m, slope 120): a shorter, gentler Pestana course among orchards, with more slopes on the back nine, where a buggy is recommended."))
c.append(P(f"**{C('Vale da Pinta', 'vale-da-pinta')}** (par 71, 6,127 m, slope 132) and **{C('Gramacho', 'gramacho')}** (par 72, 6,107 m, slope 132): Pestana's two Carvoeiro courses. Vale da Pinta has rolling fairways and Gramacho is hillier. Twilight is €55 from 3.30pm on both. Compare them in {G('Gramacho vs Vale da Pinta', 'gramacho-vs-vale-da-pinta-which-pestana-carvoeiro-course-should-you-play')}."))
c.append(P(f"**{C('Vale de Milho', 'vale-de-milho')}** (9 holes, par 27, 926 m): a short par-3 course in Carvoeiro, €22 a round, with no handicap needed. A good option for beginners in your group, alongside the resort's own pitch and putt."))
c.append(P(f"**{C('Pestana Ferragudo', 'pestana-ferragudo')}** (par 72, 5,841 m, slope 118): Pestana's newest course, opened in 2026, and the easiest 18 near the resort on slope. Read {G('Silves vs Pestana Ferragudo', 'silves-vs-pestana-ferragudo-the-established-course-and-the-brand-new-one')}."))

c.append(H2("Golf at Vila Vita Parc"))
c.append(P("The resort's own golf facilities are a **driving range, a golf simulator, a 9-hole pitch and putt, an 18-hole putting green** and an 18-hole mini-golf course, and its **resident golf pro** gives lessons for beginners and improving players. Vila Vita Parc also says its guests get **preferential rates and conditions** at a broad selection of Algarve courses, so ask the resort to book your rounds rather than booking direct. Contact the resort at customerservice@vilavitaparc.com or +351 282 310 100."))
c.append(P("For a partner who doesn't play, the resort has a spa, wellness activities and pools, set in clifftop gardens above the sea."))
c.append({'type': 'hotel', 'name': 'Vila Vita Parc', 'lat': 37.1018506, 'lng': -8.3793266, 'tier': 'Luxury',
  'text': "A five-star clifftop resort at Porches, rated **9.4 on Booking.com**, with its own driving range, golf simulator, pitch and putt and resident pro, and preferential green fees at Algarve courses.",
  'perks': ['Preferential rates at Algarve courses', 'Driving range and golf simulator', 'Pitch and putt and putting green', 'Resident golf pro', 'Spa'],
  'rating': 9.4, 'ratingSource': 'Booking.com', 'driveMin': 15, 'distanceKm': 8.5,
  'bookingUrl': 'https://www.booking.com/hotel/pt/vila-vita-parc-resort-spa.html'})

c.append(H2("Which course to play from Vila Vita Parc"))
c.append(P(f"**For the closest 18 holes,** Salgados is 15 minutes away and the cheapest. Read {G('Salgados vs Amendoeira', 'salgados-vs-amendoeira-which-golf-course-near-albufeira-should-you-play')} if you're choosing between the two."))
c.append(P(f"**For a challenge,** the Amendoeira Faldo course has the highest slope near the resort. Compare it with its sister course in {G('Amendoeira Faldo vs ' + OC, 'amendoeira-faldo-vs-o-connor-which-silves-golf-course-should-you-play')}."))
c.append(P("**For a relaxed round,** Silves and Pestana Ferragudo are the gentlest 18-hole courses nearby, and Vale de Milho or the resort's pitch and putt suit beginners."))
c.append(P(f"**For a change of scene,** the Sir Henry Cotton courses at Penina are about half an hour west. See {G('hotels near Pestana Carvoeiro golf', 'hotels-near-pestana-carvoeiro-golf')} for other places to stay in the area."))

c.append(H2("Getting there"))
c.append(P(f"Vila Vita Parc is about **50 minutes and 57 km from Faro Airport** by car, without traffic. See {G('Faro Airport to Carvoeiro and Silves for golfers', 'faro-airport-to-carvoeiro-and-silves-for-golfers')} for taxis, transfers and car hire, and {G('Faro car hire for golfers', 'faro-car-hire-for-golfers')} for which cars fit golf bags."))

c.append(H2("Golf near Vila Vita Parc: common questions"))
c.append(H3("Does Vila Vita Parc have a golf course?"))
c.append(P("Not an 18-hole course, but it has a 9-hole pitch and putt, an 18-hole putting green, a driving range, a golf simulator and a resident pro. The nearest full course is Salgados, about 15 minutes away."))
c.append(H3("What golf courses are near Vila Vita Parc?"))
c.append(P("Salgados, Silves, the two Amendoeira courses, Vale da Pinta, Gramacho and the 9-hole Vale de Milho are all within about 22 minutes, and Pestana Ferragudo about 25."))
c.append(H3("Does Vila Vita Parc offer golf discounts?"))
c.append(P("The resort says its guests get preferential rates and conditions at a broad selection of Algarve courses. Ask the resort to arrange your tee times."))
c.append(H3("Do I need a handicap to play near Vila Vita Parc?"))
c.append(P(f"At the 18-hole courses, yes, usually up to 28 for men and 36 for ladies. Vale de Milho and the resort's own pitch and putt are fine for golfers without one. See {G('do you need a handicap to play golf in the Algarve?', 'do-you-need-a-handicap-to-play-golf-in-the-algarve')}"))

json.dump(c, open(os.path.join(HERE, 'vilavita.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
