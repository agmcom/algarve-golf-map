# Update of 'The Algarve's best par-3 golf courses' (same slug), 23 Nov 2026. Original saved as original_post_backup.json.
# Sources (official, read 23 Nov 2026 unless noted):
# - Vale de Milho: valedemilhogolf.com + /fees/: "a 9-hole par 3 course for adults"; 9 holes €22 (juniors €15); hours winter
#   (Oct-Apr) 9:00-17:00, May 8:30-17:00, summer 8:00-18:00; trolleys and clubs for hire, no buggies. DB: 926 m, Dave Thomas,
#   1990; no handicap needed (verified_course_facts). Club expects a few lessons (our earlier guides).
# - Balaia: balaiagolfclub.com price list 2026-27 (balaia_fees_2026-27.pdf, updated 2026-10-29): €55 counter rate for 9/18
#   holes, €45 resort guests, €40 under-14s; reception 8:00-18:00; no spectators, caddies or companions on the course; no
#   children under 7; 7-12 with an adult; each golfer needs own clubs and bag. Course page: 9-hole executive course, par 27.
#   DB 984 m. Handicap: resort guest guide said "Handicap required" (no limit); 2026-27 rules don't mention it -> "check".
# - Amendoeira Academy: amendoeiraresort.com/en/golf/ "Pitch & Putt - Academy Course", "the only floodlit 9-hole golf course
#   in Portugal", 9-hole par 3; €16 visitor 9 holes on amendoeira.golfmanager.com (checked 23 Nov 2026); night golf by
#   contacting the resort (our night-golf guide).
# - Quinta da Ria: quintadaria.com/practice-facilities "The 9-hole pitch-and-putt academy course is the newest addition";
#   "Please book your tee time at the golf reception before play"; "Max. 6 players per flight"; price not published.
# - Pine Cliffs: 9 holes, par 32, 2,227 m, 4 par 3s; Devil's Parlour 6th, 197 m carry (club); no handicap -> red tees;
#   €59-79 (2026/27 price list); December 12:00-15:00 €43 for 9 holes (festive page).
# - Vila Vita Parc: backoffice.vilavitaparc.com golf page lists a 9-hole pitch and putt among resort golf facilities; access
#   for non-residents not stated.
# - Drive times: Mapbox (Albufeira old town 37.0885,-8.2503; Vilamoura marina 37.0745,-8.1170), 23 Nov 2026:
#   Albufeira -> Balaia 12, Pine Cliffs 18, Amendoeira 25, Vale de Milho 38; Vilamoura -> Pine Cliffs 23, Balaia 25,
#   Amendoeira 39, Vale de Milho 53.
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), 'near-hotels-2026-11'))
from near_lib import P, H2, H3, C, G, rng
assert rng('balaia', 9) == (55, 55) and rng('vale-de-milho', 9) == (22, 22) and rng('pine-cliffs', 9) == (59, 79)

c = []
c.append(P("A par-3 course is the quickest way to play golf in the Algarve: Balaia's scorecard, for example, allows 1 hour 35 minutes for nine holes, a round costs far less than on a championship course, and short holes are the easiest place to take a beginner. The Algarve has a handful of them, from a floodlit academy course you can play at night to a clifftop nine with one of the region's best-known holes. This guide covers each one, with prices from the clubs' own price lists, and which is closest if you're staying in Albufeira or Vilamoura. **Last checked: November 2026.**"))

c.append(H2("Par-3 and pitch and putt courses at a glance"))
c.append({'type': 'table', 'caption': 'Short courses in the Algarve',
  'headers': ['Course', 'Where', 'Holes', 'Visitor price', 'Handicap'],
  'rows': [
    [C('Vale de Milho', 'vale-de-milho'), 'Carvoeiro', '9, all par 3', '€22', 'Not needed'],
    [C('Balaia', 'balaia'), 'Albufeira', '9, all par 3 (par 27)', '€55', 'Ask the club'],
    [f"Amendoeira Academy (at {C('Amendoeira', 'amendoeira-faldo')})", 'Near Silves', '9, all par 3, floodlit', '€16 online', 'Not published'],
    [f"Quinta da Ria Academy (at {C('Quinta da Ria', 'quinta-da-ria')})", 'Near Tavira', '9, pitch and putt', 'Ask the club', 'Ask the club'],
    [C('Pine Cliffs', 'pine-cliffs'), 'Olhos de Água, Albufeira', '9 (4 par 3s, par 32)', '€59 to €79', 'Not needed (red tees)'],
  ],
  'note': "Prices from each club's own price list or online booking for the 2026/27 season, checked November 2026. Balaia's €55 covers 9 or 18 holes; resort guests pay €45 and under-14s €40."})

c.append(H2("Vale de Milho, Carvoeiro"))
c.append(P(f"{C('Vale de Milho', 'vale-de-milho')} is a 9-hole par-3 course of 926 metres on the edge of Carvoeiro, designed by Dave Thomas and opened in 1990. It's one of the cheapest rounds in the Algarve at **€22** for nine holes (€15 for juniors), and you don't need a handicap, although the club expects you to have had a few lessons. It's open every day from 9am to 5pm in winter and from 8am to 6pm in summer. There are no buggies, but you can hire trolleys and clubs."))
c.append({'type': 'card', 'refType': 'course', 'slug': 'vale-de-milho', 'withPhoto': True})

c.append(H2("Balaia, Albufeira"))
c.append(P(f"{C('Balaia', 'balaia')} is a 9-hole, par-27 course of short par 3s inside the Balaia Golf Village resort, about 12 minutes from Albufeira's old town. On the club's 2026-27 price list a round costs **€55**, €45 for resort guests and €40 for under-14s, and the reception is open from 8am to 6pm. The resort's guest information has said a handicap is required, without giving a limit, while the 2026-27 rules don't mention one, so ask the club if you're a beginner."))
c.append(P("A few house rules are worth knowing: every golfer needs their own clubs and bag, as sharing isn't allowed, children under 7 can't play and 7 to 12-year-olds must play with an adult, and spectators and non-playing companions aren't allowed on the course. There's a practice range next to the clubhouse."))
c.append({'type': 'card', 'refType': 'course', 'slug': 'balaia', 'withPhoto': True})

c.append(H2("Amendoeira Academy course, near Silves"))
c.append(P(f"Between the Faldo and O'Connor courses at {C('Amendoeira Golf Resort', 'amendoeira-faldo')}, the 9-hole par-3 Academy course is, the resort says, **the only floodlit 9-hole course in Portugal**. It's aimed at beginners, and a visitor's nine holes cost **€16** on the resort's online booking, which only shows daytime tee times. To play under the lights, contact the resort. See {G('night golf in the Algarve', 'night-golf-in-the-algarve')} for the details."))

c.append(H2("Quinta da Ria Academy, near Tavira"))
c.append(P(f"In the east, {C('Quinta da Ria', 'quinta-da-ria')} has added a 9-hole pitch-and-putt academy course to its practice facilities. Book a tee time at the golf reception before you play; groups can be up to six players. The club doesn't publish a price for it, so ask when you book."))

c.append(H2("Pine Cliffs: a short course with a famous par 3"))
c.append(P(f"{C('Pine Cliffs', 'pine-cliffs')} isn't an all-par-3 course: four of its nine holes are par 3s and the rest short par 4s, for a par of 32 over 2,227 metres. It's here for the **Devil's Parlour**, the par-3 6th, which the club describes as a 197-metre carry over a ravine on the clifftop. You don't need a handicap, as players without one tee off from the red markers, and nine holes cost €59 to €79 on the 2026/27 price list. In December there's a festive rate of €43 for nine holes between 12pm and 3pm."))
c.append({'type': 'card', 'refType': 'course', 'slug': 'pine-cliffs', 'withPhoto': True})

c.append(H2("Par 3 golf near Albufeira and Vilamoura"))
c.append(P("**From Albufeira**, Balaia is the closest, about 12 minutes from the old town, followed by Pine Cliffs at about 18 and the Amendoeira Academy course at about 25. Vale de Milho is about 38 minutes away."))
c.append(P(f"**From Vilamoura**, there's no par-3 or pitch and putt course in the resort itself. The nearest short courses are Pine Cliffs, about 23 minutes from the marina, and Balaia, about 25. If you'd rather play 18 holes nearby, Millennium is the easiest Vilamoura course on slope: see {G('the cheapest golf in Vilamoura', 'cheapest-golf-in-vilamoura')}."))

c.append(H2("Pitch and putt in the Algarve"))
c.append(P("Pitch and putt courses are shorter still than par-3 courses, with holes you can play with a wedge and a putter. We didn't find a stand-alone public pitch and putt course in the Algarve; the closest things are the academy courses at Amendoeira and Quinta da Ria above, which are both short par-3 layouts built for beginners and short-game practice. Vila Vita Parc lists a 9-hole pitch and putt among its resort golf facilities, but doesn't say whether non-residents can play."))
c.append(P(f"For more short rounds, see [the Algarve’s 9-hole courses](/algarve-9-hole-courses), which also covers Penina's full-length Resort Course, and {G('the easiest golf courses in the Algarve', 'the-easiest-golf-courses-in-the-algarve')}."))

c.append(H2("Par 3 golf in the Algarve: common questions"))
c.append(H3("What is the cheapest par 3 course in the Algarve?"))
c.append(P("The Amendoeira Academy course, at €16 for a daytime round on its online booking, followed by Vale de Milho in Carvoeiro at €22 for nine holes."))
c.append(H3("Is there a par 3 course in Vilamoura?"))
c.append(P("No. The nearest are Pine Cliffs, about 23 minutes from Vilamoura marina, and Balaia, about 25."))
c.append(H3("Do I need a handicap to play a par 3 course in the Algarve?"))
c.append(P(f"Not at Vale de Milho or Pine Cliffs. Amendoeira doesn't publish a requirement for its Academy course, and Balaia's guest information has said one is required, so check with the club. See {G('do you need a handicap to play golf in the Algarve?', 'do-you-need-a-handicap-to-play-golf-in-the-algarve')}"))
c.append(H3("Can you play golf at night in the Algarve?"))
c.append(P("Yes, on the floodlit Amendoeira Academy course. Night rounds have to be booked directly with the resort."))

json.dump(c, open(os.path.join(HERE, 'content.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
