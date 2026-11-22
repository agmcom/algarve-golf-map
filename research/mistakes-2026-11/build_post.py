# "Common mistakes on an Algarve golf trip" (topic #44). Built 20 Nov 2026.
# Every fact below is taken from one of our own published guides or data files, which carry the official sources:
# - Handicap: do-you-need-a-handicap guide (28 men / 36 ladies at QdL, Vilamoura, Ombria, Monte Rei; Alto, QdR, QdC 36;
#   WHS index up to 54; Penina Resort no handicap; Balaia requires one).
# - Season / booking: season guide + tee-times guide (spring and October busiest; Easter fortnight; Vilamoura 15/30/45-day
#   cancellation; Vale do Lobo 48 h).
# - Bases: where-to-stay guide (9 courses within ~15 min of Almancil; Lagos to Vilamoura/QdL about an hour; summer traffic).
# - Car hire: car-hire guide (A22 toll-free since 1 Jan 2025, confirmed by Infraestruturas de Portugal; estate for 2-3 bags,
#   people carrier for a four-ball; credit card deposit).
# - Airlines: no fee figures quoted (2026-11-20 recheck of Condor did not match our older post). Jet2 advice to book clubs with
#   the flight is from Jet2's own guidance in our Jet2 post.
# - Check-in / four-balls / pace: web/src/data/pace.ts + pace post.
# - Buggies: buggy guide (Quinta do Vale licence rule; QdL 16; Monte Rei/Ombria/Boavista 18; weather restrictions).
# - Twilight: twilight guide (Nov-Feb tee off by about 1.15pm in December).
# - Rain: rain guide (no refund for rain if course open; voucher if closed; free cancellation ends days or weeks before).
# - Status: web/src/data/course-status.ts (San Lorenzo closed 19 Oct 2026 to mid-2028; Els Club private).
# - Departure day: golf-near-faro-airport guide (Ryanair bag drop 60 min since 10 Nov 2026; ANA lockers by P5).
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
PACE = open(os.path.join(ROOT, 'web/src/data/pace.ts')).read()
STATUS = open(os.path.join(ROOT, 'web/src/data/course-status.ts')).read()
assert 'closed on 19 October 2026' in STATUS and 'mid-2028' in STATUS and 'private members club' in STATUS
assert "target: '4h40 for 18 holes'" in PACE

P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}
G = lambda name, slug: f'[{name}](/guide/{slug})'
C = lambda name, slug: f'[{name}](/courses/{slug})'

c = []
c.append(P("Most things that go wrong on an Algarve golf trip are easy to avoid if you know about them before you go: a handicap certificate left at home, a tee time lost because you arrived late, a twilight round that runs out of light. Here are common mistakes to avoid, what the clubs' own rules say, and where to find more detail in our other guides. **Last checked: November 2026.**"))

c.append(H2("Before you book"))
c.append(H3("1. Not checking the handicap rules"))
c.append(P(f"Many 18-hole courses ask for an official handicap certificate. Quinta do Lago, Vilamoura, Ombria and Monte Rei, for example, set a maximum of 28 for men and 36 for ladies. Having a certificate isn't always enough: under the World Handicap System an index can go up to 54, so a new golfer may hold one and still be over the course limit. Bring proof of your index, on your phone and on paper. If you don't have a handicap yet, there are courses that don't ask for one, such as the 9-hole {C('Penina Resort', 'penina-resort')} course. See {G('do you need a handicap to play golf in the Algarve?', 'do-you-need-a-handicap-to-play-golf-in-the-algarve')}"))
c.append(H3("2. Booking tee times too late in spring and October"))
c.append(P(f"Spring and October are the busiest months for golf in the Algarve, and green fees are at their highest. Morning tee times at the best-known courses go first, and the Easter fortnight is the busiest stretch of spring. If your dates are fixed, book your tee times when you book your flights. Outside those months, last-minute rounds are often possible. See {G('how to book tee times in the Algarve', 'how-to-book-tee-times-in-the-algarve')} and {G('the best time to play golf in the Algarve', 'algarve-golf-season-best-time-to-play-golf')}."))
c.append(H3("3. Not reading the cancellation terms"))
c.append(P(f"Free cancellation often ends long before you play. At Vilamoura Golf it ends 15 to 45 days before your round, depending on the month, while Vale do Lobo allows free cancellation up to 48 hours before. After the deadline, clubs such as Vilamoura Golf, Monte Rei and Palmares charge late cancellations and no-shows in full, and they say they don't refund a round because your flight was delayed or cancelled. If your dates might change, check the terms before you pay, and consider travel insurance."))
c.append(H3("4. Choosing a base that's too far from your courses"))
c.append(P(f"The Algarve is longer than it looks on a map. From Almancil, nine courses are within about 15 minutes, but from Lagos, Vilamoura and Quinta do Lago are about an hour away, and summer traffic on the coast road can add a lot to any drive. Pick your base around the courses you want to play, not the other way round. See {G('where to stay in the Algarve for golf', 'where-to-stay-in-the-algarve-for-golf')}."))
c.append({'type': 'findYourBase', 'title': 'Already know which courses you want to play?', 'text': 'Tick them in **Find Your Base** on our map and it shows the area where they all overlap, with the hotels inside it.', 'buttonLabel': 'Find your base on the map'})
c.append(H3("5. Leaving the golf bag until the airport"))
c.append(P(f"Most airlines charge for golf clubs as a separate item, and adding them at the airport usually costs more than adding them online in advance. Some airlines, such as Jet2, also have limited space for sports equipment and advise booking your clubs at the same time as your flights. We cover the rules airline by airline in our guides, for example {G('Ryanair', 'ryanair-golf-clubs-what-it-costs-to-fly-with-your-own-set-to-the-algarve')}, {G('easyJet', 'golf-clubs-on-easyjet-rules-sizes-and-what-it-actually-costs')} and {G('Jet2', 'jet2-golf-clubs-fees-weight-limits-and-why-you-shouldn-t-leave-booking-late')}. If you'd rather not fly with clubs at all, see {G('hiring golf clubs at Faro Airport', 'hiring-golf-clubs-at-faro-airport')}."))
c.append(H3("6. Hiring a car that's too small, or budgeting for tolls"))
c.append(P(f"A golf bag is long and rigid, so the shape of the boot matters as much as its size. An estate car suits two or three golfers with bags, and a people carrier suits a four-ball. You'll usually need a credit card for the deposit. And ignore older guides that add motorway tolls to your budget: the A22, the motorway along the Algarve, has been toll-free since 1 January 2025. See {G('Faro car hire for golfers', 'faro-car-hire-for-golfers')}."))
c.append(H3("7. Booking a course that's closed or private"))
c.append(P(f"{C('San Lorenzo', 'san-lorenzo')} closed on 19 October 2026 for a major renovation and isn't due to reopen until mid-2028, and {C('The Els Club Vilamoura', 'victoria-els-club')} is a private members' club. Its only published route for visitors is a stay at the Victoria Golf Resort & Spa, which closed on 15 October 2026 for a renovation and is due to reopen as Fairmont Vilamoura in 2028. Each course page on our site shows a notice when a course is closed, private or has a facility out of action. See {G('San Lorenzo closed until 2028: where to play instead', 'san-lorenzo-golf-course-closed-until-2028-where-to-play-instead')}."))

c.append(H2("On the day"))
c.append(H3("8. Arriving just before your tee time"))
c.append(P(f"Quinta do Lago, Quinta da Ria and Quinta do Vale ask you to check in 30 minutes before your tee time, and say that if you're late you may lose it without a refund. At Pestana's courses you must report to the starter at least 5 minutes before, or you lose your tee time. Allow time to park, pay, collect a buggy and warm up."))
c.append(H3("9. Expecting to play as a two-ball"))
c.append(P(f"Algarve tee times are usually for groups of four, and clubs fill them. Vilamoura Golf always pairs players into four-balls, and Vale do Lobo and Benamor make up flights as four-balls, so if you book as a couple, expect to play with two other golfers and at a four-ball pace. Most clubs that publish a target allow between 4 hours 20 minutes and 4 hours 40 minutes for 18 holes. See {G('how long does a round of golf take in the Algarve?', 'how-long-does-a-round-of-golf-take-in-the-algarve')}"))
c.append(H3("10. Assuming anyone can drive the buggy"))
c.append(P(f"The rules differ from club to club. Quinta do Lago and Vale do Lobo let you drive from 16, while Monte Rei, Ombria and Boavista set 18 as the minimum age, and {C('Quinta do Vale', 'quinta-do-vale')} says only driving licence holders may drive its buggies. Buggies are also often subject to availability, and clubs can stop them going out after heavy rain. Book one with your tee time if you need it. See {G('golf buggy hire in the Algarve', 'golf-buggy-hire-in-the-algarve')}."))
c.append(H3("11. Booking a twilight round too late in winter"))
c.append(P(f"Twilight green fees can cost less than half the standard price, but from November to February the sun sets between about 5.15pm and 6.15pm. In December you need to tee off by about 1.15pm to finish 18 holes before dark, so a 3.30pm twilight tee time leaves enough light for about nine holes. See {G('twilight golf in the Algarve', 'twilight-golf-in-the-algarve')}."))
c.append(H3("12. Expecting a refund if it rains"))
c.append(P(f"At the clubs we checked, a green fee isn't refunded because it rains: if the course stays open, your booking stands. If the club closes the course, you usually get a rain voucher to play the missed holes another day, not your money back. At Vilamoura Golf, for example, you have to ask for the voucher at reception straight after play is stopped. See {G('what happens if it rains on your Algarve golf trip', 'what-happens-if-it-rains-on-your-algarve-golf-trip')}."))

c.append(H2("On the way home"))
c.append(H3("13. Cutting it fine on the day you fly"))
c.append(P(f"A morning round before an afternoon or evening flight works well from the courses nearest the airport, but plan backwards from your airline's bag drop deadline, not your departure time. Ryanair, for example, closes bag drop 60 minutes before departure. Allow time to change, pack your clubs, return the hire car and queue. Faro Airport also has self-service luggage lockers next to car park P5, with lockers big enough for a golf bag. See {G('golf near Faro Airport', 'golf-near-faro-airport')}."))

c.append(H2("Common questions"))
c.append(H3("Do I need a handicap certificate to play golf in the Algarve?"))
c.append(P("At many 18-hole courses, yes, usually with a maximum of 28 for men and 36 for ladies. Some short courses, such as the 9-hole Penina Resort course, don't ask for one. Check each course's rules before you book."))
c.append(H3("Are there tolls on the Algarve motorway?"))
c.append(P("No. The A22, which runs along the Algarve from Lagos to the Spanish border, has been toll-free since 1 January 2025. You'll still pay tolls on other motorways, such as the A2 towards Lisbon."))
c.append(H3("How early should I book tee times?"))
c.append(P("For spring and October, as early as you can, ideally when you book your flights. In the quieter months, last-minute rounds are often possible through the clubs' own booking pages."))
c.append(H3("How early should I arrive for my tee time?"))
c.append(P("At least 30 minutes before at clubs such as Quinta do Lago, Quinta da Ria and Quinta do Vale, which say you may lose a late tee time without a refund. Allow more if you want to warm up."))

json.dump(c, open(os.path.join(HERE, 'content.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
