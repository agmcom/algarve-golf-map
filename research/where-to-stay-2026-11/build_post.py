# Builds the "Where to stay in the Algarve for golf" guide post (content blocks JSON).
# Numbers come from base-summary.json (Mapbox drive times, 16 Nov 2026) and the DB price_from.
# Hotels are reused, verified blocks from published hotel posts (picked_hotels.json).
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(os.path.join(HERE, 'base-summary.json')))
H = json.load(open(sys.argv[1]))  # picked_hotels.json

def hotel(name, label, text=None, tier=None):
    b = {k: v for k, v in H[name].items() if not k.startswith('_')}
    for k in ('distanceKm', 'driveMin'):
        b.pop(k, None)
    b.pop('distanceLabel', None)
    b['locationLabel'] = label
    if text: b['text'] = text
    if tier: b['tier'] = tier
    return b

def base_link(slugs): return '/?base=' + ','.join(slugs)
P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}

ROWS = [
    ('vilamoura', '[Vilamoura](/vilamoura/golf-courses)', 'Most golf, marina evenings'),
    ('quarteira', '[Quarteira](/quarteira/golf-courses)', 'Most golf, beach town'),
    ('almancil', '[Almancil / Golden Triangle](/almancil/golf-courses)', 'Famous courses, luxury'),
    ('albufeira', '[Albufeira](/albufeira/golf-courses)', 'Nightlife, groups'),
    ('olhos-de-agua', '[Olhos de Água](/olhos-de-agua/golf-courses)', 'Short courses, quieter beach'),
    ('armacao-de-pera', '[Armação de Pêra](/armacao-de-pera/golf-courses)', 'Salgados and Amendoeira'),
    ('carvoeiro', '[Carvoeiro](/carvoeiro/golf-courses)', 'Quiet village, Pestana courses'),
    ('portimao', '[Portimão](/portimao/golf-courses)', 'Town life, western courses'),
    ('alvor', '[Alvor](/alvor/golf-courses)', 'Penina and Alto'),
    ('lagos', '[Lagos](/lagos/golf-courses)', 'Lower green fees, old town'),
    ('praia-da-luz', '[Praia da Luz](/praia-da-luz/golf-courses)', 'Quiet, far west'),
    ('tavira', '[Tavira](/tavira/golf-courses)', 'Quiet, historic, east'),
    ('monte-gordo', '[Monte Gordo](/monte-gordo/golf-courses)', 'Beach, far east'),
    ('faro', '[Faro](/faro/golf-courses)', 'Short stays, near the airport'),
]
rows = []
for slug, label, best in ROWS:
    s = S[slug]
    airport = '~10 min' if slug == 'faro' else f"~{s['airportMin']} min"
    rows.append([label, str(s['n15']), str(s['n30']), airport, f"€{s['cheap18']}", best])

c = []
c.append(P("The best place to stay for golf in the Algarve depends on how many courses you want to play and what you want from your evenings. If golf comes first, **Vilamoura, Quarteira and the Golden Triangle around Almancil** put the most courses within a short drive, and they are the closest bases to Faro Airport. **Albufeira** suits groups who want nightlife, **Carvoeiro and Tavira** are quieter, and **Lagos and Alvor** are the bases for the western courses, where green fees are often lower."))
c.append({'type': 'findYourBase', 'title': 'Already know which courses you want to play?',
          'text': 'Use **Find Your Base** on our map: tick the courses, choose how far you are happy to drive, and it shows the area where they all overlap, with the hotels inside it.',
          'buttonLabel': 'Find your base on the map'})

c.append(H2("The main golf bases compared"))
c.append({'type': 'table',
          'caption': 'Golf courses within a short drive of each base',
          'headers': ['Base', 'Courses ≤15 min', 'Courses ≤30 min', 'From Faro Airport', 'Cheapest 18 holes nearby', 'Best for'],
          'rows': rows,
          'note': "Drive times from each town centre without traffic (Mapbox, checked 16 November 2026), rounded to the nearest 5 minutes. Counts include 9-hole courses and leave out San Lorenzo (closed until mid-2028) and The Els Club (private). 'Cheapest' is the lowest visitor green fee we list for an 18-hole course within 30 minutes; prices change through the year."})
c.append(P("The numbers show why golfers keep coming back to the central Algarve: from Almancil, nine courses are within about 15 minutes. In the far west and east there are fewer courses close together, but they are usually cheaper and quieter. Summer traffic on the coast road can add a lot to these times, so in July and August allow extra."))

c.append(H2("Which base suits your trip?"))
c.append(H3("You want to play as many courses as possible"))
c.append(P(f"Stay in **Vilamoura, Quarteira or Almancil**. From Quarteira, {S['quarteira']['n15']} courses are within about 15 minutes, including the four Vilamoura Golf courses, Pestana Vila Sol and the two Vale do Lobo courses, and {S['quarteira']['n30']} are within half an hour. See [golf near Quarteira](/quarteira/golf-courses) and the [Vilamoura golf courses](/vilamoura/golf-courses)."))
c.append(H3("Luxury and the best-known courses"))
c.append(P("Stay in the **Golden Triangle**, the area between Almancil, Quinta do Lago and Vale do Lobo. It has the Algarve's best-known courses, including [Quinta do Lago South](/courses/quinta-do-lago-south) and the clifftop holes of [Vale do Lobo Royal](/courses/vale-do-lobo-royal), and five-star hotels and resort villas. Expect some of the highest green fees in the region: Quinta do Lago South starts at €188. See the [hotels near Quinta do Lago](/guide/hotels-near-quinta-do-lago-golf) and [hotels near Vale do Lobo](/guide/hotels-near-vale-do-lobo-golf)."))
c.append(H3("A golf trip on a budget"))
c.append(P("Look west to **Lagos and Praia da Luz**, or east to **Tavira**. Around Lagos, [Santo António](/courses/santo-antonio) starts at €57, [Espiche](/courses/espiche) at €65 and [Boavista](/courses/boavista) at €74. In the east, [Benamor](/courses/benamor) starts at €66 and [Quinta do Vale](/courses/quinta-do-vale) at €67. You'll have fewer courses within a short drive, so plan two or three rounds rather than six. Our guide to [the best-value golf in the Algarve](/guide/best-value-golf-in-the-algarve) has more ideas."))
c.append(H3("A short break or a weekend"))
c.append(P(f"Stay close to the airport. Almancil and Vilamoura are around {S['almancil']['airportMin']}–{S['vilamoura']['airportMin']} minutes from Faro Airport, so you can play on the day you land. [Faro](/faro/golf-courses) itself has no course, but Quinta do Lago Laranjal is about 20 minutes from the city. Our [golf weekend in the Algarve](/guide/golf-weekend-in-the-algarve) guide plans three nights and two rounds from four different bases."))
c.append(H3("Nightlife and group trips"))
c.append(P(f"**Albufeira** is the Algarve's party town. Its nightlife is centred on \"the Strip\", Avenida Sá Carneiro in the Montechoro area, about 3 km east of the old town. The closest courses are [Balaia](/courses/balaia), about 15 minutes away, and [Salgados](/courses/salgados) and [Pine Cliffs](/courses/pine-cliffs), about 20, with the Vilamoura courses around 25. If you'd rather have restaurants and bars than clubs, **Vilamoura's marina** is busy in the evenings and has a casino. For tips on organising a society or a group, read [golf trips for groups](/guide/algarve-golf-trips-for-groups-and-golf-societies)."))
c.append(H3("Peace and quiet"))
c.append(P("**Tavira** is a historic town on the river Gilão and is much quieter than the central resorts, with [Benamor](/courses/benamor) about 15 minutes away and the two Quinta da Ria courses about 20. **Carvoeiro** is a small cliffside village with Gramacho, Vale da Pinta and Vale de Milho all within about 15 minutes. **Praia da Luz** is a small resort west of Lagos, about 10 minutes from Boavista."))
c.append(H3("Golfers with non-golfing partners, families or beginners"))
c.append(P("Pick a base with a short course that needs no handicap certificate, so everyone can play. [Pine Cliffs](/courses/pine-cliffs) (9 holes) is next to [Olhos de Água](/olhos-de-agua/golf-courses), the 9-hole [Penina Resort](/courses/penina-resort) course is about 15 minutes from [Alvor](/alvor/golf-courses), and [Vale de Milho](/courses/vale-de-milho), a 9-hole par-3 course, is in Carvoeiro. [Balaia](/courses/balaia), another 9-hole par-3 course near Albufeira, does ask for a handicap. For lessons, see the [Algarve golf academies](/golf-academies)."))
c.append(H3("Without a car"))
c.append(P("The easiest way is to stay at a resort with its own course, so the first tee is a walk away: see our list of [Algarve hotels with a golf course on site](/guide/algarve-hotels-with-a-golf-course-on-site). The train line along the coast stops in the centre of Lagos, Faro and Tavira, but Albufeira's station is several kilometres outside the town, and most courses are a taxi ride from the nearest station. For getting from the airport, see [Faro Airport to the Algarve golf courses](/guide/faro-airport-to-algarve-golf-courses)."))

c.append(H2("The bases one by one"))
c.append(P("A few well-rated hotels in each base, all checked for our other hotel guides. Prices are the lowest we found for a recent date and change with the season, so check your own dates."))

def base_section(title, slug, text, find_slugs, hotels):
    c.append(H3(title))
    s = S[slug]
    c.append(P(text))
    c.append({'type': 'findYourBase', 'text': 'Open Find Your Base with these courses already ticked to see hotels in the area where they overlap.', 'courseSlugs': find_slugs, 'buttonLabel': 'Show hotels for these courses'})
    c.extend(hotels)

base_section("Vilamoura and Quarteira", 'vilamoura',
    f"Vilamoura is built around its marina, with the four Vilamoura Golf courses and Pestana Vila Sol all within about 15 minutes. Quarteira, its beach-town neighbour, is just as close to the courses. From Vilamoura's marina, {S['vilamoura']['n30']} courses are within 30 minutes. More in [golf near Quarteira](/quarteira/golf-courses) and [golf hotels near Vilamoura](/guide/golf-hotels-near-vilamoura).",
    ['vilamoura-old-course', 'vilamoura-pinhal', 'vilamoura-laguna', 'vilamoura-millennium', 'vila-sol'],
    [hotel("Dom José Beach Hotel", "On the beach in Quarteira", "A three-star beach hotel in Quarteira, rated **8.9 on Booking.com** and from about €61 a night in October. It has no golf services of its own, but Pinhal is about 13 minutes away and the Old Course about 15, and breakfast starts at 7.30am."),
     hotel("Hilton Vilamoura As Cascatas Golf Resort & Spa", "Next to the Pinhal course, Vilamoura", "A five-star resort overlooking the Pinhal course and one of Vilamoura Golf's official partner hotels, rated **8.5 on Booking.com** and from about €112 a night in October. The Old Course is about 5 minutes away."),
     hotel("Tivoli Marina Vilamoura Algarve Resort", "Between the marina and the beach, Vilamoura")])

base_section("Almancil and the Golden Triangle", 'almancil',
    "Quinta do Lago's three courses, Pinheiros Altos and the two Vale do Lobo courses are all about 10 minutes from Almancil, and Vilamoura is around 15–20. The area is known for five-star hotels and resort villas, but there are simpler apartments too. More in [hotels near Quinta do Lago](/guide/hotels-near-quinta-do-lago-golf).",
    ['quinta-do-lago-south', 'quinta-do-lago-north', 'quinta-do-lago-laranjal', 'pinheiros-altos', 'vale-do-lobo-royal', 'vale-do-lobo-ocean'],
    [hotel("WOT Algarve Soul", "Almancil side of the Golden Triangle"),
     hotel("Vilar do Golf", "Beside Quinta do Lago South"),
     hotel("Conrad Algarve", "Between Quinta do Lago and Vale do Lobo")])

base_section("Albufeira and Olhos de Água", 'albufeira',
    "Albufeira has the most hotels and nightlife in the Algarve. The short courses at Balaia and Pine Cliffs are closest, with Salgados and the Vilamoura courses within about 25 minutes. Olhos de Água, a quieter beach village just to the east, is the better pick if you want to be closer to Vilamoura. More in [golf near Olhos de Água](/olhos-de-agua/golf-courses) and the [cheapest golf near Albufeira](/guide/cheapest-golf-near-albufeira).",
    ['balaia', 'pine-cliffs', 'salgados', 'vilamoura-laguna', 'vilamoura-millennium'],
    [hotel("Alfagar Village", "Santa Eulália, east Albufeira"),
     hotel("PortoBay Blue Ocean", "Clifftop near Olhos de Água", "A clifftop hotel just west of Pine Cliffs, rated **9.2 on Booking.com** and from about €113 a night. It is not adults-only, but it has a lounge area reserved for adults and a calm, couple-friendly feel. Breakfast starts at 7.30am."),
     hotel("Pine Cliffs Ocean Suites, a Luxury Collection Resort & Spa", "Inside the Pine Cliffs resort", "Suites and apartments at the Pine Cliffs resort, which has its own 9-hole clifftop course that needs no handicap. All rooms interconnect, which makes it popular with families, and guests get free access to the resort's Oasis Thermal area.")])

base_section("Carvoeiro and Armação de Pêra", 'carvoeiro',
    "Carvoeiro is a small cliffside village, with Gramacho, Vale da Pinta and the 9-hole Vale de Milho all within about 15 minutes and Pestana Ferragudo about 15–20. A little further east, Armação de Pêra is the closest town to Salgados and Amendoeira. More in [golf near Armação de Pêra](/armacao-de-pera/golf-courses) and [hotels near Vale de Milho](/guide/hotels-near-vale-de-milho-golf).",
    ['gramacho', 'vale-da-pinta', 'vale-de-milho', 'pestana-ferragudo', 'salgados', 'amendoeira-faldo'],
    [hotel("Pestana Palm Gardens", "Clifftop in Carvoeiro"),
     hotel("Tivoli Carvoeiro Algarve Resort", "Short walk from Carvoeiro village", "A five-star clifftop resort a short walk from Carvoeiro village, rated **8.6 on Booking.com**, with sea views, a full spa and indoor and outdoor pools. UK golf tour operators sell packages here that include rounds at Gramacho and Vale da Pinta."),
     hotel("Vila Vita Parc", "Clifftop near Porches and Armação de Pêra")])

base_section("Portimão and Alvor", 'portimao',
    "Portimão and Alvor are the bases for the Sir Henry Cotton courses: [Alto Golf](/courses/alto-golf) is about 5 minutes from both, and [Penina](/courses/penina-championship) about 15–20. Pestana Ferragudo is about 15 minutes from Portimão, Gramacho and Vale da Pinta about 20, Morgado about 25 and Álamos about 30. More in [golf near Alvor](/alvor/golf-courses) and [hotels near Penina](/guide/hotels-near-penina-golf-resort).",
    ['alto-golf', 'penina-championship', 'morgado', 'alamos', 'pestana-ferragudo'],
    [hotel("Jupiter Marina Hotel", "On Portimão marina", "A stylish hotel on Portimão marina, with a spa, a rooftop bar and a free shuttle to Praia da Rocha beach. It scores **9.0 on Booking.com**, unusually high for the price, and breakfast starts at 7.30am. Parking is paid."),
     hotel("RR Alvor Baía Resort", "In Alvor"),
     hotel("Penina Hotel & Golf Resort", "On the Penina course", "The Algarve's original golf resort, with the 18-hole Championship and the 9-hole Resort course on site. The Championship course was designed by Sir Henry Cotton. Penina's \"Best Available Rate for Golfers\" includes **a complimentary round every day** on one of its courses (a handicap certificate is needed for the Championship course). Breakfast starts at 7am.")])

base_section("Lagos and Praia da Luz", 'lagos',
    "Lagos has a lively old town and a marina, with Boavista about 10 minutes away and Palmares and Espiche about 20. Praia da Luz is quieter and closer to Boavista, Espiche and Santo António. Green fees here are among the lowest in the Algarve, but Vilamoura and Quinta do Lago are about an hour away. More in [golf near Praia da Luz](/praia-da-luz/golf-courses) and [hotels near Boavista](/guide/hotels-near-boavista-golf).",
    ['boavista', 'palmares', 'espiche', 'santo-antonio'],
    [hotel("Hotel Marina Rio", "Opposite Lagos marina"),
     hotel("Belavista da Luz", "In Praia da Luz"),
     hotel("Palmares Beach House Hotel", "On the Palmares resort")])

base_section("Tavira and the east", 'tavira',
    "Tavira is the base for the eastern courses: Benamor about 15 minutes away, Quinta da Ria and Quinta de Cima about 20, and Quinta do Vale and Castro Marim about 25–30. Monte Rei, the Jack Nicklaus course, is about 35 minutes from Tavira and closer to Monte Gordo. More in [golf near Monte Gordo](/monte-gordo/golf-courses) and [hotels near Quinta da Ria](/guide/hotels-near-quinta-da-ria-golf).",
    ['benamor', 'quinta-da-ria', 'quinta-de-cima', 'quinta-do-vale', 'castro-marim', 'monte-rei'],
    [hotel("Hotel Don Rodrigues", "In Tavira"),
     hotel("OZADI Tavira Hotel", "Edge of Tavira, towards Benamor", "A four-star hotel on the edge of Tavira, rated **9.0 on Booking.com** from more than 3,700 reviews and from about €77 a night in November. Benamor is about 6 minutes away, and it has two pools and free parking."),
     hotel("Pousada Convento Tavira", "Centre of Tavira")])

c.append(H3("Faro"))
c.append(P("Faro is the Algarve's capital and the airport is on the edge of the city, but there is no golf course in Faro itself. It works for a night before an early flight or a short city break with a round at [Quinta do Lago Laranjal](/courses/quinta-do-lago-laranjal), about 20 minutes away. For hotels in the city, see [golf near Faro](/faro/golf-courses)."))

c.append(H2("Plan the rest of your trip"))
c.append(P("Once you've picked a base, compare green fees in the [full list of Algarve golf courses](/courses), check [how to get from Faro Airport to your base with clubs](/guide/faro-airport-to-algarve-golf-courses), and if you're not bringing your own set, read our [club rental guide](/club-rental)."))
c.append({'type': 'findYourBase', 'title': 'Still not sure where to stay?',
          'text': 'Tick the courses you want to play in **Find Your Base** and the map shows the best area to stay, with the hotels inside it.',
          'buttonLabel': 'Find your base on the map'})

json.dump(c, open(os.path.join(HERE, 'content.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
