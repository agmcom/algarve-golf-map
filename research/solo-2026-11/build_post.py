# "Solo golf in the Algarve" (topic #67). Built 25 Nov 2026. DRAFT until user approves.
# One-player booking, read on each club's own public booking page/engine, 25 Nov 2026 (no bookings made):
# - solo_v1_2026-11-25.json: Golfmanager v1, 17 courses, 5 dates (2, 5, 16 Dec 2026; 10 Feb, 10 Mar 2027): every tee time sampled had a
#   rate with min=1 ('types'[2]). Benamor + Pine Cliffs: init.api for 16 Dec, standard visitor rate min=1.
# - solo_v2_2026-11-25.json: Vale do Lobo, Quinta do Lago, Monte Rei: standard rate has no minimum/'multiple' (pair offers show multiple=2).
#   VdL Royal/Ocean and QdL North/South were on sale with one place left. QdL 'Winter Offer Desk' = multiple 2 (170 v 172).
# - pestana_2026-11-25.json: book.pestanagolf.com, 'Number of golfers: 1', tee times at all six Algarve courses.
# Pairing rules re-read live 25 Nov 2026: sources/r_*.html (Vilamoura, Monte Rei, Benamor, Vale do Lobo, Espiche, Boavista); Ombria rules PDF
#   (2024, rain-2026-11/sources/ombria_rules.txt); Pestana scorecard/site rules ('During busy golfing periods, the way to play will be four
#   ball'); Pine Cliffs + Vilamoura: 'A single player has no priority'.
# Buggy prices: solo_v1, 16 Dec (Quinta de Cima 2 Dec). Costs: our trip-cost guide (hotel €89/night, car €37.50 pp shared for 5 days, Oct 2026).
# Societies: golfforgreys.com/faqs (guest at up to 3 events a year, €75 membership, FPG €90, €5 entry, four-balls), 6golfealgarve.com
#   (visitors welcome, €10 entry, up to 3 competitions a calendar year). Solos Holidays: 11-18 Sep 2027 from £2,498, 5 rounds, own room.
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), 'near-hotels-2026-11'))
from near_lib import P, H2, H3, C, G
v1 = json.load(open(os.path.join(HERE, 'solo_v1_2026-11-25.json')))
assert len(v1) == 17
for k, rows in v1.items():
    r = [x for x in rows if 'types' in x]
    assert r and all(any(t[2] == 1 and not t[5] for t in x['types']) for x in r), k
NF = "No pairing rule found on the pages we checked"
c = []
c.append(P("Yes, you can play golf in the Algarve on your own. When we checked the clubs' own booking pages, the courses we could test online all offered tee times to one player. What changes from club to club is whether you'll play alone or be put with other golfers, and how much more you pay without someone to share the buggy, the room and the car. **Last checked: 25 November 2026.**"))

c.append(H2("Can one person book a tee time, and will you be paired?"))
c.append(P("This table shows what we found on each club's booking page, and what its rules say about joining golfers together."))
L = lambda *xs: ', '.join(C(n, s) for n, s in xs)
c.append({'type': 'table', 'caption': 'Booking alone at Algarve golf courses',
 'headers': ['Course', 'One player online', "What the club's rules say"],
 'rows': [
  ['Vilamoura: ' + L(('Old Course', 'vilamoura-old-course'), ('Pinhal', 'vilamoura-pinhal'), ('Laguna', 'vilamoura-laguna'), ('Millennium', 'vilamoura-millennium')), 'Yes', 'Always paired into groups of four; refuse and you can’t play or get a refund'],
  ['Vale do Lobo: ' + L(('Royal', 'vale-do-lobo-royal'), ('Ocean', 'vale-do-lobo-ocean')), 'Yes', 'Expect to be paired, with a similar handicap when possible'],
  [C('Benamor', 'benamor'), 'Yes', 'Expect to be paired, with a similar handicap when possible'],
  [C('Espiche', 'espiche'), 'Yes', 'The club can pair golfers into four-balls'],
  [C('Ombria', 'ombria'), 'Yes', 'You may be asked to join others to make a group of four'],
  [C('Boavista', 'boavista'), 'Yes', 'The club can group four players per tee time'],
  ['Pestana: ' + L(('Alto', 'alto-golf'), ('Gramacho', 'gramacho'), ('Vale da Pinta', 'vale-da-pinta'), ('Silves', 'silves'), ('Ferragudo', 'pestana-ferragudo'), ('Vila Sol', 'vila-sol')), 'Yes', 'The published club rules say four-balls in busy periods'],
  [C('Monte Rei', 'monte-rei'), 'Yes', 'Not normally paired, but can be when busy; always 15 April to 15 May and 15 September to 15 October 2027'],
  [C('Pine Cliffs', 'pine-cliffs'), 'Yes', 'A single player has no priority; no pairing rule found'],
  ['Quinta do Lago: ' + L(('South', 'quinta-do-lago-south'), ('North', 'quinta-do-lago-north'), ('Laranjal', 'quinta-do-lago-laranjal')), 'Yes', NF],
  [L(('Salgados', 'salgados'), ('Amendoeira Faldo', 'amendoeira-faldo'), ("O'Connor", 'amendoeira-oconnor'), ('Morgado', 'morgado'), ('Alamos', 'alamos'), ('Palmares', 'palmares')), 'Yes', NF],
  [L(('Castro Marim', 'castro-marim'), ('Quinta da Ria', 'quinta-da-ria'), ('Quinta de Cima', 'quinta-de-cima'), ('Quinta do Vale', 'quinta-do-vale')), 'Yes', NF],
 ],
 'note': "“Yes” means the club's booking page or booking data offered a visitor rate to one player, on sample dates between 25 November 2026 and 10 March 2027. We didn't complete any bookings, and a club can change its rules or limit single bookings on some days. We didn't test Penina, Pinheiros Altos, Santo António, Balaia or Vale de Milho: contact the club."})
c.append(P("If we didn't find a pairing rule, don't assume you'll play alone. Ask the club when you book."))

c.append(H2("If you'd rather play alone"))
c.append(P(f"**Monte Rei** is the clearest option: its rules say it isn't its policy to pair players, except when it's busy and in the two periods in the table. It's also one of the most expensive rounds in the Algarve. See {C('Monte Rei', 'monte-rei')}."))
c.append(P("**Ask about paying for the empty places.** Vilamoura only guarantees a group of your own if you ask in advance and pay the green fees needed to complete the four, which is costly for one player."))
c.append(P("**Remember who has priority.** Vilamoura's and Pine Cliffs' rules say a single player has no priority on the course, so you can't expect groups in front to let you through just because you're on your own."))

c.append(H2("If you'd like company"))
c.append(P("**Choose a tee time with places already taken.** Many clubs' booking pages show how many places are left at each time. If there are one, two or three, someone may already be booked. On Benamor's page, for example, we saw tee times with a single place left."))
c.append(P("**Play with a society.** These two Algarve societies welcome visiting golfers:"))
c.append(P("**6 Golfe Society**, based at Vale de Milho in Carvoeiro, says anyone visiting the Algarve can join its competitions. Visitors pay the visitor green fee shown on its calendar and a €10 entry fee, and can play up to three competitions a year before joining."))
c.append(P("**Golf for Greys** runs weekly tournaments across the region and is open to all ages. You can play up to three events a year as a guest before joining (€75 a year). Groups go out as four-balls and the entry fee is €5, plus the green fee. Members have priority if an event is full."))
c.append(P(f"For more, see the societies in {G('long-stay golf in the Algarve', 'long-stay-golf-in-the-algarve')}."))
c.append(P(f"**Enter a tournament.** Some amateur events sell packages with a single-room price. The Vilamoura International Golf Classic in January 2027 costs €1,715 in a single room, against €1,313 sharing. See {G('golf tournaments in the Algarve', 'golf-tournaments-in-the-algarve')}."))
c.append(P(f"**Take a lesson.** A playing lesson is another way to get on the course with someone. See [Algarve golf academies](/golf-academies)."))
c.append(P("**Join an organised trip.** Solos Holidays, a tour operator for solo travellers, lists a week at Morgado from 11 to 18 September 2027 with five rounds and your own room, from £2,498. Check with the operator what's included."))

c.append(H2("What it costs to travel alone"))
c.append(P("**The buggy.** Some clubs sell one rate for a player with a buggy and another for two players sharing. These are the online prices we saw for 18 holes in December 2026:"))
c.append({'type': 'table', 'caption': 'Green fee and buggy, per person, December 2026',
 'headers': ['Course', 'One player, own buggy', 'Two sharing, each', 'Extra for playing alone'],
 'rows': [
  [C('Salgados', 'salgados'), '€113', '€96.50', '€16.50'],
  [C('Espiche', 'espiche'), '€85', '€68.50', '€16.50'],
  [C('Boavista', 'boavista'), '€85', '€72.50', '€12.50'],
  [C('Quinta do Vale', 'quinta-do-vale'), '€92', '€79.50', '€12.50'],
  [C('Quinta da Ria', 'quinta-da-ria'), '€120', '€110', '€10'],
  [C('Quinta de Cima', 'quinta-de-cima'), '€120', '€110', '€10'],
  [C('Palmares', 'palmares'), '€105', '€105', 'None'],
 ],
 'note': "Examples from the clubs' own online booking, checked on 25 November 2026 for dates in December 2026. Not a complete list. Prices change with the date and the offer."})
c.append(P(f"You can also save the buggy altogether: see {G('Algarve golf courses you can walk', 'algarve-golf-courses-you-can-walk')} and {G('golf buggy hire in the Algarve', 'golf-buggy-hire-in-the-algarve')}. Check too that an offer isn't sold in pairs: Quinta do Lago's winter offer was only on sale for two players when we checked."))
c.append(P(f"**The room and the car.** These are usually the biggest extras. In the mid-range example in our {G('trip cost guide', 'how-much-does-a-golf-trip-to-the-algarve-cost')}, half a room for five nights costs from €222.50 and half a small hire car about €37.50. Paying for both alone adds about **€260** to the trip."))

c.append(H2("Where to stay and how to get around"))
c.append(P(f"Basing yourself close to several courses keeps transport costs down when there's nobody to split them with. From Vilamoura's marina, 13 courses are within about 30 minutes. Some hotels run free golf shuttles, and a taxi from the marina to the Old Course should cost about €10 to €15 each way. See {G('where to stay in the Algarve for golf', 'where-to-stay-in-the-algarve-for-golf')}, {G('golf transfers without a car', 'algarve-golf-transfers-without-a-car')} and {G('Faro car hire for golfers', 'faro-car-hire-for-golfers')}."))
c.append(P(f"Before you book, check the handicap rules: you'll usually need proof of your own handicap. See {G('do you need a handicap to play golf in the Algarve?', 'do-you-need-a-handicap-to-play-golf-in-the-algarve')}"))

c.append(H2("Solo golf in the Algarve: common questions"))
c.append(H3("Can I book a tee time for one person in the Algarve?"))
c.append(P("Yes. The clubs whose online booking we tested, including Vilamoura, Vale do Lobo, Quinta do Lago, Monte Rei and Pestana's courses, offered tee times to one player."))
c.append(H3("Will I be paired with other golfers?"))
c.append(P("Often. Vilamoura always pairs players into fours, and Vale do Lobo and Benamor tell you to expect it. Monte Rei doesn't normally pair players outside its busy periods."))
c.append(H3("Can I refuse to be paired?"))
c.append(P("Not at Vilamoura: its rules say that a player who refuses can't play and won't get a refund. Elsewhere, ask before you pay."))
c.append(H3("Can visitors play with a golf society in the Algarve?"))
c.append(P("Yes. 6 Golfe Society and Golf for Greys both let non-members play up to three events a year."))
json.dump(c, open(os.path.join(HERE, 'content.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
if __name__ == '__main__' and '--save' in sys.argv:
    from near_lib import save_draft
    print(save_draft('solo-golf-in-the-algarve', 'Solo golf in the Algarve: booking, pairing and costs',
      "Which clubs let one player book online, where you'll be paired with other golfers, what it costs to play alone and how to find people to play with.",
      c, os.path.join(HERE, 'hero.jpg'), 'A lone golfer playing beside the water at Monte Rei',
      'Solo golf in the Algarve: booking, pairing and costs', "Travelling alone? Which Algarve golf clubs let one player book online, where you'll be paired into a four, buggy costs for one, and societies to join."))
