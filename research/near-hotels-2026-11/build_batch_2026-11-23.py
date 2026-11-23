# Six 'Golf courses near <hotel>' drafts, built 23 Nov 2026 while the user was away (DRAFTS ONLY, not published).
# Status checks 23 Nov 2026: all six open under these names (Tivoli Carvoeiro last renovated 2017; Jupiter reviews Jul-Aug 2026).
# Locations: DB coordinates checked against OpenStreetMap (Tivoli Carvoeiro, Palm Gardens, Alvor Praia, Jupiter match;
# EPIC SANA and Four Seasons Vilamoura not in OSM, DB points plausible). Drive times: drive_batch_2026-11-23.json (Mapbox).
# Hotel facts (official sites, read 23 Nov 2026):
# - Tivoli Carvoeiro: tivolihotels.com 403; search summary of its official golf page: discounts at most Algarve golf courses
#   and the hotel can arrange tee times. Hedged as "its website says".
# - Pestana Palm Gardens (pestana.com/en/hotel/pestana-palm-gardens): "Pestana Palm Gardens Ocean & Golf Villas"; "just a
#   10-minute drive from Pestana Carvoeiro Golfe, where guests have exclusive access to benefits and discounts at the
#   prestigious Vale da Pinta and Gramacho golf courses" (details not given); Club House and Golf Academy; studios from €49/night
#   (incl. 10% Guest Club discount); gym, sauna, tennis free.
# - Pestana Alvor Praia (pestana.com/en/hotel/pestana-alvor-praia): "Premium Beach & Golf Resort", 5-star on the cliff above
#   Praia dos Três Irmãos with direct beach access by lift; "eight golf courses" nearby; minigolf; no golf discount stated.
# - Jupiter Albufeira (jupiteralbufeirahotel.com): no golf content; all-inclusive 24h (PLUS upgrade €16 pp/night); free daily
#   shuttle to Praia dos Pescadores and the town centre; parking €10/night Jun-Sep, €6 other months (free with PLUS).
# - EPIC SANA Algarve (sanahotels.com, read via fetch tool; direct download fails TLS): no golf content; free indoor and outdoor
#   parking; car rental with or without chauffeur; "40-minute drive to Faro International Airport".
# - Four Seasons Vilamoura (fourseasons-vilamoura.com): apartment resort (studios to three-bedroom); "golf course views where
#   you can step onto the championship course of Pinhal"; golf academy, PGA professional Peter Lester; golf co-ordinator
#   arranges "Tee times, club hire, buggy reservation"; golf-break savings €88-151 (studio), €96-193 (one-bed), €150-216 (two-bed)
#   depending on dates; Faro Airport "25km - about 30 minutes".
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from near_lib import *
DT = json.load(open(os.path.join(HERE, 'drive_batch_2026-11-23.json')))
SRC = os.path.join(HERE, 'sources')
HC = "The 18-hole courses ask for a handicap certificate, usually up to 28 for men and 36 for ladies."
HAND = lambda extra='': P(f"At the 18-hole courses, yes, usually up to 28 for men and 36 for ladies.{extra} See {G('do you need a handicap to play golf in the Algarve?', 'do-you-need-a-handicap-to-play-golf-in-the-algarve')}")
d = lambda k, s: DT[k][s][0]
air = lambda k: DT[k]['_airport']
built = {}

def hotel_block(name, lat, lng, text, perks, drive, km, url, rating=None):
    b = {'type': 'hotel', 'name': name, 'lat': lat, 'lng': lng, 'tier': 'Luxury', 'text': text, 'perks': perks, 'driveMin': drive, 'distanceKm': km, 'bookingUrl': url}
    if rating: b.update({'rating': rating, 'ratingSource': 'Booking.com'})
    return b

# ---------- 1. Tivoli Carvoeiro ----------
k = 'tivoli-carvoeiro'
S = ['vale-de-milho', 'vale-da-pinta', 'gramacho', 'pestana-ferragudo', 'silves', 'amendoeira-faldo', 'amendoeira-oconnor', 'penina-championship']
c = [P(f"Tivoli Carvoeiro is a five-star resort on the cliffs just east of Carvoeiro, and the nearest course, the 9-hole par-3 {C('Vale de Milho', 'vale-de-milho')}, is about **5 minutes** away. Pestana's two Carvoeiro courses, {C('Vale da Pinta', 'vale-da-pinta')} and {C('Gramacho', 'gramacho')}, are about 14 to 15 minutes away, and Pestana Ferragudo, Silves, Amendoeira and Penina are all within about half an hour. **Last checked: November 2026.**"),
     H2('Golf courses closest to Tivoli Carvoeiro'),
     course_table(DT[k], S, 'Drive times and green fees from Tivoli Carvoeiro', HC + " Pestana's website gives 27 and 35 for Gramacho and Vale da Pinta. Vale de Milho and the Penina Resort Course don't ask for one.")]
c += glance(S)
c += [H2('Golf at Tivoli Carvoeiro'),
      P("The hotel has a golf page on its official website, which says it offers guests discounts at most of the Algarve's golf courses and can arrange tee times. We couldn't read the page in full, so ask the hotel which courses the discounts cover and how they work when you book."),
      P(f"For the rest of the day, the resort sits on the clifftop above the sea, and Carvoeiro's beach and restaurants are close by. See {G('hotels near Pestana Carvoeiro golf', 'hotels-near-pestana-carvoeiro-golf')} for other places to stay nearby."),
      hotel_block('Tivoli Carvoeiro Algarve Resort', 37.0939326, -8.4602881, "A five-star clifftop resort just east of Carvoeiro, with Vale de Milho about 5 minutes away and the Pestana Carvoeiro courses about 15. The hotel says it offers discounts at most Algarve courses and can arrange tee times.",
                  ['Clifftop above the sea', 'Golf discounts and tee-time booking (ask for details)', 'Vale de Milho 5 minutes away'], d(k, 'vale-de-milho'), DT[k]['vale-de-milho'][1], 'https://www.booking.com/hotel/pt/tvalmansorcarveiro.html'),
      H2('Which course to play from Tivoli Carvoeiro'),
      P(f"**For the closest 18 holes,** Vale da Pinta and Gramacho are about a quarter of an hour away. Read {G('Gramacho vs Vale da Pinta', 'gramacho-vs-vale-da-pinta-which-pestana-carvoeiro-course-should-you-play')}."),
      P("**For a quick or beginner-friendly round,** Vale de Milho is 5 minutes away, costs €22 and doesn't ask for a handicap."),
      P(f"**For a challenge,** Amendoeira Faldo and Penina Championship have the highest slopes in the area. Compare {G('Amendoeira Faldo and O' + chr(39) + 'Connor', 'amendoeira-faldo-vs-o-connor-which-silves-golf-course-should-you-play')}."),
      H2('Getting there'),
      P(f"Tivoli Carvoeiro is about **{air(k)[0]} minutes and {air(k)[1]} km from Faro Airport** by car, without traffic. See {G('Faro Airport to Carvoeiro and Silves for golfers', 'faro-airport-to-carvoeiro-and-silves-for-golfers')}."),
      H2('Golf near Tivoli Carvoeiro: common questions'),
      H3('What is the closest golf course to Tivoli Carvoeiro?'), P(f"Vale de Milho, a 9-hole par-3 course about 5 minutes away. The closest 18-hole courses are Vale da Pinta and Gramacho, about {d(k,'vale-da-pinta')} to {d(k,'gramacho')} minutes away."),
      H3('Does Tivoli Carvoeiro offer golf discounts?'), P("Its website says guests get discounts at most of the Algarve's golf courses and that the hotel can arrange tee times. Ask for the details when you book."),
      H3('Do I need a handicap to play near Tivoli Carvoeiro?'), HAND(" Vale de Milho doesn't ask for one.")]
built[k] = dict(slug='golf-courses-near-tivoli-carvoeiro', title='Golf courses near Tivoli Carvoeiro', content=c,
  excerpt='Vale de Milho is 5 minutes from Tivoli Carvoeiro, and the Pestana Carvoeiro courses about 15. Drive times, green fees, course notes and the hotel’s golf discounts.',
  hero=os.path.join(SRC, 'tivoli_carvoeiro_official.jpg'), alt='The clifftop pool at Tivoli Carvoeiro, above a cove and the sea',
  seo=('Golf courses near Tivoli Carvoeiro: Vale de Milho, Gramacho and more', 'Vale de Milho is 5 minutes from Tivoli Carvoeiro and the Pestana Carvoeiro courses about 15. Drive times, green fees, course notes and golf discounts.'))

# ---------- 2. Pestana Palm Gardens ----------
k = 'pestana-palm-gardens'
S = ['vale-de-milho', 'gramacho', 'vale-da-pinta', 'pestana-ferragudo', 'silves', 'amendoeira-faldo', 'amendoeira-oconnor', 'penina-championship']
c = [P(f"Pestana Palm Gardens is a resort of villas and apartments on the coast just east of Carvoeiro, and Pestana's own Carvoeiro courses, {C('Gramacho', 'gramacho')} and {C('Vale da Pinta', 'vale-da-pinta')}, are about **12 minutes** away. The 9-hole par-3 {C('Vale de Milho', 'vale-de-milho')} is about 3 minutes away, and Pestana Ferragudo, Silves and Amendoeira are all within about 25. **Last checked: November 2026.**"),
     H2('Golf courses closest to Pestana Palm Gardens'),
     course_table(DT[k], S, 'Drive times and green fees from Pestana Palm Gardens', HC + " Pestana's website gives 27 and 35 for Gramacho and Vale da Pinta. Vale de Milho doesn't ask for one.")]
c += glance(S)
c += [H2('Golf at Pestana Palm Gardens'),
      P("Pestana calls the resort Pestana Palm Gardens Ocean & Golf Villas, and its website says guests get **exclusive benefits and discounts at Vale da Pinta and Gramacho**, Pestana's two Carvoeiro courses about 10 minutes away, which also have a clubhouse and a golf academy. The page doesn't say what the discounts are, so ask the resort when you book, at palm.gardens@pestana.com."),
      P("Studios start from about €49 a night on Pestana's website, with its Guest Club discount, which makes it one of the more affordable ways to stay near the Pestana courses. There's a gym, sauna and tennis court, free for guests."),
      hotel_block('Pestana Palm Gardens', 37.093067, -8.457309, "Villas and apartments on the coast near Carvoeiro, with guest benefits and discounts at Pestana's Vale da Pinta and Gramacho courses, about 12 minutes away.",
                  ['Guest discounts at Vale da Pinta and Gramacho', 'Studios, apartments and villas', 'Gym, sauna and tennis', 'Vale de Milho 3 minutes away'], d(k, 'gramacho'), DT[k]['gramacho'][1], 'https://www.booking.com/hotel/pt/pestana-palm-gardens.html'),
      H2('Which course to play from Pestana Palm Gardens'),
      P(f"**For the guest discounts,** play Vale da Pinta and Gramacho. Read {G('Gramacho vs Vale da Pinta', 'gramacho-vs-vale-da-pinta-which-pestana-carvoeiro-course-should-you-play')}."),
      P("**For a quick or beginner-friendly round,** Vale de Milho is 3 minutes away, costs €22 and doesn't ask for a handicap."),
      P(f"**For more Pestana golf,** Silves and the new Pestana Ferragudo are about 20 minutes away. See {G('Silves vs Pestana Ferragudo', 'silves-vs-pestana-ferragudo-the-established-course-and-the-brand-new-one')}."),
      H2('Getting there'),
      P(f"Pestana Palm Gardens is about **{air(k)[0]} minutes and {air(k)[1]} km from Faro Airport** by car, without traffic. See {G('Faro Airport to Carvoeiro and Silves for golfers', 'faro-airport-to-carvoeiro-and-silves-for-golfers')} and {G('hotels near Pestana Carvoeiro golf', 'hotels-near-pestana-carvoeiro-golf')}."),
      H2('Golf near Pestana Palm Gardens: common questions'),
      H3('Which golf courses are near Pestana Palm Gardens?'), P("Vale de Milho is about 3 minutes away, Gramacho and Vale da Pinta about 12, Pestana Ferragudo about 21 and Silves about 22."),
      H3('Do Pestana Palm Gardens guests get golf discounts?'), P("Pestana says guests get exclusive benefits and discounts at Vale da Pinta and Gramacho, without giving the details on its website. Ask the resort when you book."),
      H3('Do I need a handicap to play near Pestana Palm Gardens?'), HAND(" Vale de Milho doesn't ask for one.")]
built[k] = dict(slug='golf-courses-near-pestana-palm-gardens', title='Golf courses near Pestana Palm Gardens', content=c,
  excerpt='Gramacho and Vale da Pinta are 12 minutes from Pestana Palm Gardens, where guests get Pestana golf benefits and discounts. Drive times, green fees and course notes.',
  hero=os.path.join(SRC, 'pestana_palm_gardens_official.jpg'), alt='Pestana Palm Gardens villas and gardens above the sea near Carvoeiro',
  seo=('Golf courses near Pestana Palm Gardens: Gramacho and Vale da Pinta', 'Gramacho and Vale da Pinta are 12 minutes from Pestana Palm Gardens, with guest golf benefits. Drive times, green fees and course notes.'))

# ---------- 3. Pestana Alvor Praia ----------
k = 'pestana-alvor-praia'
S = ['alto-golf', 'penina-championship', 'penina-resort', 'pestana-ferragudo', 'vale-da-pinta', 'gramacho', 'morgado', 'palmares']
c = [P(f"Pestana Alvor Praia is a five-star hotel on the cliff above Praia dos Três Irmãos, just outside Alvor, with a lift down to the beach. The closest golf course is Pestana's own {C('Alto Golf', 'alto-golf')}, about **6 minutes** away by car, and the two Sir Henry Cotton courses at {C('Penina', 'penina-championship')} are about 18. **Last checked: November 2026.**"),
     H2('Golf courses closest to Pestana Alvor Praia'),
     course_table(DT[k], S, 'Drive times and green fees from Pestana Alvor Praia', HC + " Alto Golf accepts 36 for men too, Pestana's website gives 27 and 35 for Gramacho and Vale da Pinta, and the Penina Resort Course doesn't ask for one.")]
c += glance(S)
c += [H2('Golf at Pestana Alvor Praia'),
      P("Pestana calls the hotel a Premium Beach & Golf Resort, and its website mentions eight golf courses in the area. It doesn't publish a golf discount or golf shuttle for this hotel, so ask when you book whether it can arrange tee times, especially at Pestana's own Alto Golf, Vale da Pinta, Gramacho and Ferragudo courses. The hotel itself has a minigolf course and a children's playground."),
      P(f"Pestana's sister hotels in Alvor and the Tivoli Alvor resort are close by. Our page on [golf near Alvor](/alvor/golf-courses) lists every course within half an hour of the town, and {G('golf courses near Tivoli Alvor', 'golf-courses-near-tivoli-alvor')} covers the neighbouring resort."),
      hotel_block('Pestana Alvor Praia', 37.121406, -8.579579, "A five-star clifftop hotel above Praia dos Três Irmãos with a lift to the beach, about 6 minutes from Alto Golf and 18 from Penina.",
                  ['Clifftop with lift to the beach', 'Alto Golf 6 minutes away', 'Minigolf', 'Pools'], d(k, 'alto-golf'), DT[k]['alto-golf'][1], 'https://www.booking.com/hotel/pt/pestanaalvorpraia.html'),
      H2('Which course to play from Pestana Alvor Praia'),
      P(f"**For the shortest drive,** Alto Golf is 6 minutes away. Compare it with Penina in {G('Alto Golf vs Penina Championship', 'alto-golf-vs-penina-championship-which-portimao-course-should-you-play')}."),
      P(f"**For history,** play the Penina Championship course; see {G('Penina Championship vs Penina Resort', 'penina-championship-vs-penina-resort-which-course-should-you-play')}."),
      P("**For a higher handicap,** Alto Golf accepts up to 36 for men, and the Penina Resort Course doesn't ask for a handicap."),
      H2('Getting there'),
      P(f"Pestana Alvor Praia is about **1 hour and {air(k)[1]} km from Faro Airport** by car, without traffic. See {G('Faro Airport to Portimão and Alvor for golfers', 'faro-airport-to-portimao-and-alvor-for-golfers')}."),
      H2('Golf near Pestana Alvor Praia: common questions'),
      H3('What is the closest golf course to Pestana Alvor Praia?'), P("Alto Golf, about 6 minutes away by car. The Penina Championship and Resort courses are about 18 minutes away."),
      H3('Does Pestana Alvor Praia have a golf course?'), P("No, only a minigolf course. Pestana runs the nearby Alto Golf course."),
      H3('Do I need a handicap to play near Pestana Alvor Praia?'), HAND(" Alto Golf accepts 36 for men too, and the Penina Resort Course doesn't ask for one.")]
built[k] = dict(slug='golf-courses-near-pestana-alvor-praia', title='Golf courses near Pestana Alvor Praia', content=c,
  excerpt='Alto Golf is 6 minutes from Pestana Alvor Praia and Penina 18. Drive times, green fees, handicap rules and course notes for the courses near this Alvor clifftop hotel.',
  hero=os.path.join(SRC, 'pestana_alvor_praia_official.jpg'), alt='Aerial view of Pestana Alvor Praia and its pool above the beach at Alvor',
  seo=('Golf courses near Pestana Alvor Praia: Alto Golf, Penina and more', 'Alto Golf is 6 minutes from Pestana Alvor Praia and Penina 18. Drive times, green fees, handicap rules and course notes.'))

# ---------- 4. Jupiter Albufeira ----------
k = 'jupiter-albufeira'
S = ['balaia', 'pine-cliffs', 'salgados', 'vilamoura-laguna', 'vilamoura-millennium', 'vilamoura-old-course', 'amendoeira-faldo', 'amendoeira-oconnor']
c = [P(f"Jupiter Albufeira is a family all-inclusive hotel in Montechoro, east of Albufeira's old town, and two short courses are close by: {C('Balaia', 'balaia')} is about **8 minutes** away and {C('Pine Cliffs', 'pine-cliffs')} about 13. For 18 holes, {C('Salgados', 'salgados')} and the Vilamoura courses {C('Laguna', 'vilamoura-laguna')} and {C('Millennium', 'vilamoura-millennium')} are about 19 minutes away. **Last checked: November 2026.**"),
     H2('Golf courses closest to Jupiter Albufeira'),
     course_table(DT[k], S, 'Drive times and green fees from Jupiter Albufeira', HC + " Pine Cliffs doesn't ask for one, and Balaia asks for one without giving a limit.")]
c += glance(S)
c += [H2('Golf at Jupiter Albufeira'),
      P("Jupiter Albufeira doesn't offer golf services: its website has no golf desk, golf discounts or golf shuttle. It's a hotel for a family holiday with a few rounds, so you'll book tee times directly with the clubs and need a hire car or taxi to get there."),
      P("Two practical points for golfers: the hotel's free shuttle only goes to Praia dos Pescadores and the town centre, and parking costs €10 a night from June to September and €6 in other months, unless you book the All-Inclusive PLUS upgrade, which includes it. The standard all-inclusive covers meals and selected drinks at the hotel, a kids' club and a rooftop bar."),
      hotel_block('Jupiter Albufeira Hotel – Family & Fun', 37.0998678, -8.2281563, "A family all-inclusive hotel in Montechoro, about 8 minutes from Balaia and 19 from Salgados and the Vilamoura courses. No golf services, but a free shuttle to the beach and town.",
                  ['All-inclusive 24h', "Kids' club and water park", 'Free shuttle to beach and town', 'Balaia 8 minutes away'], d(k, 'balaia'), DT[k]['balaia'][1], 'https://www.booking.com/hotel/pt/jupiter-albufeira-hotel.en-gb.html'),
      H2('Which course to play from Jupiter Albufeira'),
      P(f"**For a quick round,** Balaia and Pine Cliffs are 9-hole courses within about a quarter of an hour. Read {G('Balaia vs Pine Cliffs', 'balaia-vs-pine-cliffs-which-quick-round-near-albufeira-should-you-play')}."),
      P(f"**For 18 holes,** Salgados is the cheapest nearby, from €78, and Laguna and Millennium start at €88. See {G('the cheapest golf near Albufeira', 'cheapest-golf-near-albufeira')}."),
      P(f"**Without a car,** see {G('Algarve golf without a car', 'algarve-golf-transfers-without-a-car')} for taxis and transfers."),
      H2('Getting there'),
      P(f"Jupiter Albufeira is about **{air(k)[0]} minutes and {air(k)[1]} km from Faro Airport** by car, without traffic. See {G('Faro Airport to Albufeira with golf clubs', 'faro-airport-to-albufeira-with-golf-clubs')}."),
      H2('Golf near Jupiter Albufeira: common questions'),
      H3('What is the closest golf course to Jupiter Albufeira?'), P("Balaia, a 9-hole par-3 course about 8 minutes away. Pine Cliffs is about 13 minutes away, and the closest 18-hole courses, Salgados, Laguna and Millennium, are about 19."),
      H3('Does Jupiter Albufeira offer golf packages?'), P("No. Its website doesn't mention golf services, so book your rounds directly with the clubs."),
      H3('Do I need a handicap to play near Jupiter Albufeira?'), HAND(" Pine Cliffs doesn't ask for one.")]
built[k] = dict(slug='golf-courses-near-jupiter-albufeira', title='Golf courses near Jupiter Albufeira', content=c,
  excerpt='Balaia is 8 minutes from Jupiter Albufeira and Pine Cliffs 13, with Salgados and Vilamoura about 19. Drive times, green fees and tips for golfers at this all-inclusive hotel.',
  hero=os.path.join(SRC, 'jupiter_official.jpg'), alt='The pool and towers of Jupiter Albufeira Hotel in Montechoro',
  seo=('Golf courses near Jupiter Albufeira: Balaia, Pine Cliffs and more', 'Balaia is 8 minutes from Jupiter Albufeira and Pine Cliffs 13, with Salgados and Vilamoura about 19. Drive times, green fees and tips for golfers.'))

# ---------- 5. EPIC SANA Algarve ----------
k = 'epic-sana'
S = ['pine-cliffs', 'balaia', 'vilamoura-laguna', 'vilamoura-millennium', 'vilamoura-old-course', 'vilamoura-pinhal', 'vila-sol', 'salgados']
c = [P(f"EPIC SANA Algarve is a five-star hotel above Praia da Falésia, between Albufeira and Vilamoura, and the closest course is the 9-hole {C('Pine Cliffs', 'pine-cliffs')}, about **7 minutes** away by car. The Vilamoura courses {C('Laguna', 'vilamoura-laguna')} and {C('Millennium', 'vilamoura-millennium')} are about 14 minutes away, and the {C('Old Course', 'vilamoura-old-course')} about 17. **Last checked: November 2026.**"),
     H2('Golf courses closest to EPIC SANA Algarve'),
     course_table(DT[k], S, 'Drive times and green fees from EPIC SANA Algarve', HC + " Pine Cliffs doesn't ask for one, and Balaia asks for one without giving a limit.")]
c += glance(S)
c += [H2('Golf at EPIC SANA Algarve'),
      P("EPIC SANA's website doesn't list golf services such as a golf desk, discounts or a golf shuttle, so book tee times directly with the clubs. It does offer free indoor and outdoor parking and car rental with or without a driver, which makes the Vilamoura courses easy to reach."),
      P("After the round, there's the hotel's Sayanna spa, and Praia da Falésia is within walking distance."),
      hotel_block('EPIC SANA Algarve', 37.0897305, -8.1668423, "A five-star hotel above Praia da Falésia, about 7 minutes from Pine Cliffs and 14 from Laguna and Millennium. Free parking and car rental with or without a driver.",
                  ['Above Praia da Falésia', 'Free indoor and outdoor parking', 'Car rental with or without a driver', 'Spa'], d(k, 'pine-cliffs'), DT[k]['pine-cliffs'][1], 'https://www.booking.com/hotel/pt/epic-sana-algarve.html'),
      H2('Which course to play from EPIC SANA'),
      P("**For a quick round,** Pine Cliffs is 7 minutes away and doesn't ask for a handicap."),
      P(f"**For value,** Laguna and Millennium start at €88. See {G('the cheapest golf in Vilamoura', 'cheapest-golf-in-vilamoura')}."),
      P(f"**For the classic round,** the Vilamoura Old Course is 17 minutes away. Read {G('Vilamoura Old Course vs Millennium', 'vilamoura-old-course-vs-millennium-which-one-should-you-play')}."),
      H2('Getting there'),
      P(f"EPIC SANA Algarve is about **{air(k)[0]} minutes and {air(k)[1]} km from Faro Airport** by car, without traffic. See {G('Faro Airport to Albufeira with golf clubs', 'faro-airport-to-albufeira-with-golf-clubs')}."),
      H2('Golf near EPIC SANA Algarve: common questions'),
      H3('What is the closest golf course to EPIC SANA Algarve?'), P("Pine Cliffs, a 9-hole course about 7 minutes away. The closest 18-hole courses are Laguna and Millennium in Vilamoura, about 14 minutes away."),
      H3('Does EPIC SANA offer golf packages?'), P("Its website doesn't mention golf packages or golf services, so book your rounds directly with the clubs."),
      H3('Do I need a handicap to play near EPIC SANA?'), HAND(" Pine Cliffs doesn't ask for one.")]
built[k] = dict(slug='golf-courses-near-epic-sana-algarve', title='Golf courses near EPIC SANA Algarve', content=c,
  excerpt='Pine Cliffs is 7 minutes from EPIC SANA Algarve, and Laguna and Millennium in Vilamoura about 14. Drive times, green fees and course notes for golfers staying at Falésia.',
  hero=os.path.join(SRC, 'epic_sana_official.jpg'), alt='The pools, cabanas and pine trees at EPIC SANA Algarve',
  seo=('Golf courses near EPIC SANA Algarve: Pine Cliffs, Vilamoura and more', 'Pine Cliffs is 7 minutes from EPIC SANA Algarve, and Laguna and Millennium about 14. Drive times, green fees and course notes.'))

# ---------- 6. Four Seasons Vilamoura ----------
k = 'four-seasons-vilamoura'
S = ['vilamoura-pinhal', 'vilamoura-old-course', 'vila-sol', 'vilamoura-laguna', 'vilamoura-millennium', 'vale-do-lobo-royal', 'vale-do-lobo-ocean', 'pine-cliffs']
c = [P(f"Four Seasons Vilamoura is an independent apartment resort in the middle of Vilamoura, with views over the {C('Pinhal', 'vilamoura-pinhal')} course, whose clubhouse is about **5 minutes** away by car. The {C('Old Course', 'vilamoura-old-course')} is about 8 minutes away, {C('Vila Sol', 'vila-sol')} about 9, and {C('Laguna', 'vilamoura-laguna')} and {C('Millennium', 'vilamoura-millennium')} about 10. It isn't part of the Four Seasons hotel brand. **Last checked: November 2026.**"),
     H2('Golf courses closest to Four Seasons Vilamoura'),
     course_table(DT[k], S, 'Drive times and green fees from Four Seasons Vilamoura', HC + " Pine Cliffs doesn't ask for one.")]
c += glance(S)
c += [H2('Golf at Four Seasons Vilamoura'),
      P("The resort's website describes golf-course views and says you can step onto the Pinhal course from the resort. It has a **golf co-ordinator who arranges tee times, club hire and buggies**, and a golf academy with a PGA professional, Peter Lester."),
      P("Its golf breaks are sold through its own golf website, and the resort lists the savings against booking separately: from €88 to €151 in a studio, €96 to €193 in a one-bedroom apartment and €150 to €216 in a two-bedroom apartment, depending on your dates. Accommodation runs from studios to three-bedroom apartments, which suits a group or family."),
      hotel_block('Four Seasons Vilamoura', 37.089264, -8.10909, "An independent apartment resort overlooking the Pinhal course, with a golf co-ordinator for tee times, club hire and buggies, a golf academy and golf breaks.",
                  ['Overlooks the Pinhal course', 'Golf co-ordinator for tee times and buggies', 'Golf academy with a PGA pro', 'Studios to three-bedroom apartments'], d(k, 'vilamoura-pinhal'), DT[k]['vilamoura-pinhal'][1], 'https://www.booking.com/hotel/pt/four-seasons-vilamoura.html'),
      H2('Which course to play from Four Seasons Vilamoura'),
      P(f"**For the shortest trip,** Pinhal is next to the resort. Compare it with Laguna in {G('Vilamoura Laguna vs Pinhal', 'vilamoura-laguna-vs-pinhal-which-course-should-you-play')}."),
      P(f"**For the classic round,** the Old Course is about 8 minutes away. Read {G('Vila Sol vs the Old Course', 'vila-sol-vs-vilamoura-old-course-which-should-you-play')}."),
      P(f"**For value,** Laguna and Millennium start at €88, and Vila Sol's twilight rate is €60. See {G('the cheapest golf in Vilamoura', 'cheapest-golf-in-vilamoura')}."),
      H2('Getting there'),
      P(f"Four Seasons Vilamoura is about **{air(k)[0]} minutes and {air(k)[1]} km from Faro Airport** by car, without traffic. See {G('Faro Airport to Vilamoura with golf clubs', 'faro-airport-to-vilamoura-with-golf-clubs')} and {G('golf hotels near Vilamoura', 'golf-hotels-near-vilamoura')}."),
      H2('Golf near Four Seasons Vilamoura: common questions'),
      H3('Which golf course is next to Four Seasons Vilamoura?'), P("Vilamoura Pinhal. The resort overlooks the course, and its clubhouse is about 5 minutes away by car."),
      H3('Is Four Seasons Vilamoura part of the Four Seasons hotel brand?'), P("No. It's an independent apartment resort with a similar name."),
      H3('Does Four Seasons Vilamoura sell golf packages?'), P("Yes. Its golf co-ordinator arranges tee times, club hire and buggies, and the resort sells golf breaks with savings that depend on your apartment and dates."),
      H3('Do I need a handicap to play near Four Seasons Vilamoura?'), HAND()]
built[k] = dict(slug='golf-courses-near-four-seasons-vilamoura', title='Golf courses near Four Seasons Vilamoura', content=c,
  excerpt='Four Seasons Vilamoura overlooks the Pinhal course, with the Old Course, Vila Sol, Laguna and Millennium within 10 minutes. Drive times, green fees and golf breaks.',
  hero=os.path.join(SRC, 'four_seasons_vilamoura_official.jpg'), alt='The pool and apartment buildings at Four Seasons Vilamoura',
  seo=('Golf courses near Four Seasons Vilamoura: Pinhal, Old Course and more', 'Four Seasons Vilamoura overlooks Pinhal, with the Old Course, Vila Sol, Laguna and Millennium within 10 minutes. Drive times, green fees and golf breaks.'))

if __name__ == '__main__':
    res = {}
    for k, b in built.items():
        hero = b['hero']
        if not b.get('already_hero'):
            tmp = os.path.join(SRC, b['slug'] + '_hero.jpg'); hero_from(hero, tmp); hero = tmp
        pid = save_draft(b['slug'], b['title'], b['excerpt'], b['content'], hero, b['alt'], *b['seo'])
        res[k] = (pid, b['slug']); print(k, pid, b['slug'], len(b['content']), 'blocks')
    json.dump(res, open(os.path.join(HERE, 'batch_2026-11-23_ids.json'), 'w'), indent=1)
