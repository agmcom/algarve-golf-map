# "Golf stag do in the Algarve" (topic #65). Sources checked 18 Nov 2026 (copies in ../rain-2026-11/sources unless noted):
# - Google autocomplete (en-GB): 'portugal golf stag do', 'albufeira golf stag do', 'vilamoura golf stag do'; 'golf stag do
#   ideas/games/outfits'; 'bachelor party' gives nothing. SERP = stag companies + golf agencies, none explain club rules.
# - Vilamoura Golf rules-and-regulations: strict dress code (no sports shorts, beachwear, blue denim, cargo shorts, t-shirts;
#   'if you are not properly dressed you will not be allowed on the course'); access may be denied to people who don't present or
#   conduct themselves appropriately, cause disturbances, disturb other users, or are intoxicated; always paired into four-balls,
#   refusing pairing -> access denied, no refund; closed groups (not a multiple of 4) only if requested in advance and paying the
#   green fees needed to complete the four-ball. Booking-cancelation-policies: 2027 rounds 15 days (Jan Feb Jul Aug Nov Dec) / 45 days.
# - Vale do Lobo conditions: up to 12 golfers 48 h, over 12 golfers 21 days; 4-ball pairing; guests may follow players on course if
#   authorised by Golf Reception, same dress code, join only at 1st or 10th tee; collared shirts, golf trousers or tailored shorts.
# - Monte Rei booking policies: up to 4 -> 15 days, 5-23 -> 30 days, 24+ at events team's discretion; full payment; no refunds for
#   flights. Rules: pace 4h30; under-18s can't drive buggies.
# - Boavista terms: up to 4 -> 48 h, 5-15 -> 72 h, more than 15 -> 15 days; EUR2 fee; no beachwear, denims, training shoes,
#   t-shirts; own bag and clubs each; buggy max 2 players + 2 bags, nobody under 18 drives.
# - Espiche terms: up to 4 -> 72 h, 5-15 -> 15 days, 'More than 16 players' -> 30 days; t-shirts, jeans, trainers not allowed;
#   two players per buggy; 'Players are responsible for their own conduct at all times'.
# - Ombria rules PDF: up to 8 -> 5 days, 9-16 -> 15 days, more than 16 -> 30 days; no jeans, collar and sleeves (except ladies), no
#   swimming trunks / short bermudas; buggy only 18+; no alcohol except bought from the club, no personal coolers; staff may refuse
#   service to anyone apparently intoxicated; not following staff -> asked to leave without refund; pace 4h30; own clubs/bag.
# - Quinta do Lago / Quinta da Ria / Quinta do Vale conditions (golfmanager): pay in full when booking; check in 30 min before, late
#   may mean no play and no refund; not following course rules / ranger -> removal without refund. QdR and QdV: up to 7 players vs
#   8-23 players tables (QdR low 7d/30d, mid 15d/45d, high 15d/45d, summer 48h/15d; QdV low 7d/30d, mid 15d/45d, high 15d/45d).
#   Quinta do Vale: no swim shorts, collarless shirts, t-shirts, jeans, trainers, leggings; buggies only driven by licence holders.
# - Pine Cliffs Rules PDF: no denim, beachwear, tops, t-shirts or football style shirts; own bag; 9 holes in 2 h; pick up at double
#   par; no handicap -> red tees. Pine Cliffs 2026/2027 price list PDF: visitor 9 holes EUR79 high (1-20 Nov 2026, Feb-May 2027,
#   15 Sep-20 Nov 2027) / EUR59 low (21 Nov 2026-Jan 2027, Jun-14 Sep 2027); club hire 9 holes EUR30, golf shoes EUR18.
# - Salgados booking-engine notice: change clothes if wearing T-shirts, lounge, gym or beach wear, offensive items, clothes with
#   holes or in disrepair; closed shoes; keep up with the group in front; staff decisions final.
# - Reused from live guides (verified Oct-Nov 2026): Salgados EUR78 Jan/Jul/Aug, twilight EUR47, buggy EUR50, Callaway set + sleeve
#   EUR50; Balaia EUR50 day fee, asks for a handicap without a limit; Laguna/Millennium from EUR88, Laguna on Wheels; Amendoeira
#   EUR100 incl. buggy; drive times from Albufeira old town (Mapbox); minivan Faro->Albufeira EUR64, ->Vilamoura EUR44 (Oct 2026);
#   Albufeira 'the Strip' (Avenida Sa Carneiro), Vilamoura marina + casino; buggy EUR48 Benamor, EUR55 Pestana.
# - Rules of Golf: Stableford = Rule 21.1 (R&A). Texas scramble is an informal format, not in the Rules.
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}
card = lambda s: {'type': 'card', 'slug': s, 'refType': 'course', 'withPhoto': True}
c = []
c.append(P("A golf stag do in the Algarve works best when the golf is booked like a group trip, not added as an afterthought. Base yourselves in **Albufeira** if the nights out matter most, or **Vilamoura** if the golf does. Book tee times in four-balls and check each club's group cancellation deadline before you collect anyone's money. And make sure the group knows the dress code: matching stag T-shirts and fancy dress won't get you onto any of the courses whose dress codes we checked."))
c.append(P("This guide is for whoever is organising it. It covers where to stay, which courses suit a mixed group, the club rules that catch stag groups out, and what the golf costs per person. **Last checked: November 2026.**"))

c.append(H2("Albufeira or Vilamoura?"))
c.append(P("**Albufeira** is the Algarve's party town, with its nightlife centred on \"the Strip\", Avenida Sá Carneiro in Montechoro. The nearest full 18-hole course, [Salgados](/courses/salgados), is 17 minutes from the old town, and there are two short 9-hole courses within 20 minutes. **Vilamoura** is quieter at night, with bars and restaurants around the marina and a casino, but it has more golf on the doorstep: five courses that take visitors."))
c.append({'type': 'table', 'caption': 'Courses within about 25 minutes of Albufeira',
  'headers': ['Course', 'Drive from Albufeira', 'Holes', 'From', 'Handicap'],
  'rows': [
    ['[Balaia](/courses/balaia)', '13 min', '9 (par 3)', '€50 day fee', 'Asked for, no limit published'],
    ['[Salgados](/courses/salgados)', '17 min', '18', '€78', '28 men, 36 ladies'],
    ['[Pine Cliffs](/courses/pine-cliffs)', '18 min', '9', '€59', 'Not needed (red tees)'],
    ['[Vilamoura Laguna](/courses/vilamoura-laguna) and [Millennium](/courses/vilamoura-millennium)', '24 min', '18', '€88', '28 men, 36 ladies'],
    ['[Amendoeira](/courses/amendoeira-faldo), buggy included', '25 min', '18', '€100', '28 men, 36 ladies'],
  ],
  'note': "Lowest visitor green fee for one round. Drive times from Albufeira old town without traffic (Mapbox). Pine Cliffs: 2026/27 price list; Balaia: 2025/26 price list; the others: each club's online booking, October 2026. Not a complete list: see Albufeira golf courses on our map for all of them."})
c.append(P("If you stay in Albufeira and want 18 holes, Salgados is the obvious choice: it's the nearest full course, it's flat, and it's one of the cheapest in this part of the Algarve. If you stay in Vilamoura, [Laguna](/courses/vilamoura-laguna) and [Millennium](/courses/vilamoura-millennium) are the cheapest of its courses. Our guides to the [cheapest golf near Albufeira](/guide/cheapest-golf-near-albufeira) and the [cheapest golf in Vilamoura](/guide/cheapest-golf-in-vilamoura) compare every course month by month, and [where to stay in the Algarve for golf](/guide/where-to-stay-in-the-algarve-for-golf) compares the other bases."))
c.append(card('salgados'))

c.append(H2("Booking golf for a stag group"))
c.append(P("**Tee times come in fours.** Courses send players out in four-balls, so a group of 8 needs two tee times in a row and a group of 12 needs three. If your numbers don't divide by four, expect to be paired with other golfers. Vilamoura Golf is the strictest we found: it always pairs players into four-balls, and if anyone refuses to be paired, they aren't allowed to play and don't get a refund. It only guarantees a group of its own if you ask in advance and pay the green fees needed to fill the four-ball."))
c.append(P("**Groups have longer cancellation deadlines.** Free cancellation for a big group can end a month or more before you play. These are the published deadlines at some clubs:"))
c.append({'type': 'table', 'caption': 'Free cancellation by group size at some Algarve clubs',
  'headers': ['Club', 'Small groups', 'Larger groups'],
  'rows': [
    ['[Vale do Lobo](/courses/vale-do-lobo-royal)', 'Up to 12 golfers: 48 hours', 'Over 12 golfers: 21 days'],
    ['[Monte Rei](/courses/monte-rei)', 'Up to 4 players: 15 days', '5 to 23 players: 30 days. 24 or more: at the club\'s discretion'],
    ['[Boavista](/courses/boavista)', 'Up to 4 players: 48 hours', '5 to 15 players: 72 hours. More than 15: 15 days'],
    ['[Espiche](/courses/espiche)', 'Up to 4 players: 72 hours', '5 to 15 players: 15 days. More than 16: 30 days'],
    ['[Ombria](/courses/ombria)', 'Up to 8 players: 5 days', '9 to 16 players: 15 days. More than 16: 30 days'],
    ['[Quinta da Ria](/courses/quinta-da-ria) and [Quinta de Cima](/courses/quinta-de-cima)', 'Up to 7 players: 48 hours to 15 days, by season', '8 to 23 players: 15 to 45 days, by season'],
    ['[Quinta do Vale](/courses/quinta-do-vale)', 'Up to 7 players: 7 or 15 days, by season', '8 to 23 players: 30 or 45 days, by season'],
    ['Vilamoura Golf ([Laguna](/courses/vilamoura-laguna), [Millennium](/courses/vilamoura-millennium), [Pinhal](/courses/vilamoura-pinhal), [Old Course](/courses/vilamoura-old-course))', '15 days in January, February, July, August, November and December; 45 days in other months (2027 rounds)', 'No separate group deadline published'],
  ],
  'note': "Source: each club's published booking conditions, checked 18 November 2026. Some clubs also charge a small cancellation fee. Check the conditions shown when you book, as they can change."})
c.append(P("**Expect to pay up front.** Quinta do Lago, Quinta da Ria and Quinta do Vale take full payment when you book, and Monte Rei asks for full payment to guarantee a booking. Monte Rei and Vilamoura Golf both say they don't refund for delayed or cancelled flights, so it's worth telling everyone to get travel insurance. If it rains, see [what happens if it rains on your Algarve golf trip](/guide/what-happens-if-it-rains-on-your-algarve-golf-trip)."))
c.append(P("**Collect names and handicaps early.** Some clubs ask for each player's handicap when you book, and you'll need them anyway to split the group into four-balls. Our guide to [how to book tee times in the Algarve](/guide/how-to-book-tee-times-in-the-algarve) explains how each course takes bookings."))

c.append(H2("Dress codes: what the stag can't wear"))
c.append(P("This is the part of the planning that's easiest to overlook. Matching T-shirts and fancy dress are popular on stag dos, but every club whose dress code we checked either bans T-shirts on the course or asks for a collared shirt, and some say so in very plain terms:"))
c.append(P("- **Vilamoura Golf:** no sports shorts, beachwear, blue denim, cargo shorts or T-shirts. Its rules say that if you're not properly dressed, you won't be allowed on the course.\n- **Pine Cliffs:** no denim, beachwear, tops, T-shirts or **football-style shirts**.\n- **Salgados:** players wearing T-shirts, lounge, gym or beach wear, **offensive items**, or clothes with holes will need to change before they play.\n- **Quinta do Vale:** no swim shorts, shirts without a collar, T-shirts, jeans, trainers or leggings.\n- **Ombria:** shirts must have a collar and sleeves (except for ladies), and no jeans, swimming trunks or short Bermudas."))
c.append(P("What works everywhere is a **collared golf shirt**, golf trousers or tailored shorts, and **golf shoes with soft spikes**. If you want the group to match on the course, order printed collared polos rather than T-shirts, and keep the design clean, since Salgados, for one, asks players with offensive items to change. Save the fancy dress for the evening."))
c.append(P("Trainers aren't allowed at clubs such as Boavista, Espiche and Quinta do Vale, so anyone without golf shoes should hire a pair. Pine Cliffs, for example, hires golf shoes for €18."))

c.append(H2("Behaviour, drink and pace of play"))
c.append(P("Clubs expect groups to keep up and behave, and several say in their rules that they can turn you away or send you off without a refund:"))
c.append(P("- **Vilamoura Golf** can refuse entry to anyone who doesn't behave appropriately, causes a disturbance, disturbs other players, or turns up drunk.\n- **Ombria** doesn't allow any alcohol on the course except drinks bought from the club, so no coolers or your own cans. Staff can refuse to serve anyone who seems drunk, and players who don't follow staff instructions are asked to leave without a refund.\n- **Quinta do Lago, Quinta da Ria and Quinta do Vale** say that not following the course rules or the ranger's instructions can mean being removed from the course without a refund."))
c.append(P("**Pace of play is enforced too.** Ombria and Monte Rei expect 18 holes in 4 hours 30 minutes. At Pine Cliffs, nine holes should take 2 hours, and players must pick up once they reach double par on a hole. Salgados expects you to keep up with the group in front."))
c.append(P("**Don't be late.** Quinta do Lago, Quinta da Ria and Quinta do Vale ask you to check in 30 minutes before your tee time, and if you're late you may lose your slot without a refund. After a big night, an early tee time is the one most likely to go wrong, so think about the timing when you book."))

c.append(H2("Buggies and hire clubs"))
c.append(P("**A buggy takes two.** Vilamoura Golf and Boavista allow two players and two bags per buggy, so a group of eight needs four. Book them with the tee times. Among clubs that publish prices, a buggy for 18 holes costs €48 at Benamor, €50 at Salgados and €55 at Pestana's courses, so about €25 each for two players sharing. [Laguna](/courses/vilamoura-laguna)'s Laguna on Wheels offer includes a shared buggy on new bookings made by 31 December 2026, with some dates excluded. See our [golf buggy hire guide](/guide/golf-buggy-hire-in-the-algarve)."))
c.append(P("**Check who can drive.** Boavista, Monte Rei and Ombria don't let anyone under 18 drive a buggy, and Quinta do Vale only lets driving licence holders drive one."))
c.append(P("**Everyone needs their own clubs.** Boavista, Ombria and Pine Cliffs all say each player must have their own bag and clubs, so two players can't share a set. Salgados hires a premium Callaway set with a sleeve of balls for €50 for 18 holes, and Pine Cliffs hires a full set for €30 for nine holes. For a big group, flying everyone's clubs can cost more than hiring: compare prices in our [golf club hire comparison](/club-rental) and our guide to [hiring golf clubs at Faro Airport](/guide/hiring-golf-clubs-at-faro-airport)."))

c.append(H2("When not everyone plays golf"))
c.append(P("Most stag groups mix keen golfers, occasional players and people who've never played. That matters, because most 18-hole courses in the Algarve ask for a **handicap certificate**, usually up to 28 for men and 36 for ladies. Anyone without one can't normally play there on their own."))
c.append(P("Near Albufeira, [Pine Cliffs](/courses/pine-cliffs) is the course everyone can play: it's a 9-hole clifftop course, and players without a handicap can play from the red tees. [Balaia](/courses/balaia) is an easy 9-hole par-3 course, but it asks for a handicap, so check with the club first. Further west, [Penina Resort](/courses/penina-resort) near Portimão and [Vale de Milho](/courses/vale-de-milho) in Carvoeiro are also 9-hole courses that don't need one. Our guide to [handicap rules in the Algarve](/guide/do-you-need-a-handicap-to-play-golf-in-the-algarve) covers every course."))
c.append(P("**Non-golfers who want to come along** should ask the club first. Vale do Lobo, for example, lets players' guests follow them on the course if Golf Reception agrees, as long as they follow the same dress code and join only at the 1st or 10th tee."))
c.append(H3("Formats that suit a mixed group"))
c.append(P("A full medal round with everyone counting every shot is slow, and no fun for beginners. Two formats work better for a stag group:"))
c.append(P("- **Texas scramble:** everyone in the four-ball tees off, the team picks the best shot, and everyone plays the next shot from there. It's an informal team format, not part of the Rules of Golf, but it keeps the weaker players in the game and the round moving.\n- **Stableford:** each player scores points on each hole against their handicap, and once you can't score any more points on a hole, you can pick up. It's an official format in the Rules of Golf, and it fits clubs that want you to pick up, such as Pine Cliffs at double par."))
c.append(P("Whatever format you play, each player still has to meet the course's own handicap rule."))

c.append(H2("Example: three nights in Albufeira, two rounds"))
c.append(P("Here's one way to fit the golf around a three-night stag do in Albufeira. It's just an example: you could swap either round for a course in Vilamoura."))
c.append(P("- **Day 1, arrive:** Faro Airport to Albufeira by minivan. In October 2026 we found pre-booked minivans for about €64 per vehicle each way. If you land early, Salgados sells twilight rounds from €47 in January, July and August.\n- **Day 2, the main round:** 18 holes at Salgados, with a late-morning tee time.\n- **Day 3, the short round:** nine holes at Pine Cliffs, which everyone can play, with or without a handicap.\n- **Day 4:** home."))
c.append({'type': 'table', 'caption': 'Golf cost per person: January, July or August',
  'headers': ['Item', 'Per person'],
  'rows': [
    ['Salgados green fee, 18 holes', '€78'],
    ['Buggy at Salgados, shared by two (€50)', '€25'],
    ['Pine Cliffs green fee, 9 holes', '€59'],
    ['**Golf total**', '**€162**'],
    ['Club hire at both courses, if needed', '€80'],
    ['**Total with hire clubs**', '**€242**'],
  ],
  'note': "Salgados: online booking, October 2026 (lowest rate, January, July and August); buggy and Callaway club hire (€50) from its published prices. Pine Cliffs: 2026/27 price list, low-season visitor rate (21 November 2026 to 31 January 2027 and 1 June to 14 September 2027); €79 in high season; club hire €30 for nine holes. Not included: flights, accommodation, transfers, food and drink."})
c.append(P("In spring and autumn the same two rounds cost more: Salgados goes up to €139 and Pine Cliffs to €79. For the rest of the trip, see [how much a golf trip to Albufeira costs](/guide/how-much-does-a-golf-trip-to-albufeira-cost) and [Faro Airport to Albufeira with golf clubs](/guide/faro-airport-to-albufeira-with-golf-clubs). If you're staying in Vilamoura instead, minivans from the airport were about €44 when we checked; see [Faro Airport to Vilamoura with golf clubs](/guide/faro-airport-to-vilamoura-with-golf-clubs)."))

c.append(H2("Booking through a stag company?"))
c.append(P("Stag-party companies often sell golf as one activity among many. That's fine, but check exactly what you're buying before you pay: **which course**, **how many holes**, whether it's a **par-3 course** or a full 18-hole course, and whether clubs, buggies and transfers are included. Then check that course's handicap rule and dress code against your group, as the rules above still apply."))

c.append(H2("Golf stag do in the Algarve: common questions"))
c.append(H3("Is Albufeira or Vilamoura better for a golf stag do?"))
c.append(P("Albufeira has the bigger nightlife, with Salgados and two short courses within about 20 minutes. Vilamoura has more golf close by, with five courses that take visitors, and quieter evenings around the marina. If the golf is the main event, Vilamoura is easier; if the nights out are, Albufeira."))
c.append(H3("Can we wear matching stag shirts on the course?"))
c.append(P("Not if they're T-shirts: Vilamoura Golf, Pine Cliffs, Salgados, Quinta do Vale and Boavista are among the clubs that don't allow them. Printed collared golf polos are the safer choice, as long as the design isn't offensive."))
c.append(H3("Can people who don't play golf join a golf stag do?"))
c.append(P("Yes, on the right course. Pine Cliffs near Albufeira lets players without a handicap play from the red tees, and Penina Resort and Vale de Milho don't need one either. Most 18-hole courses ask for a handicap certificate."))
c.append(H3("How far ahead should we book?"))
c.append(P("As early as you can for a big group, but check the cancellation deadline first: at some clubs, free cancellation for groups ends 30 days or more before you play."))
c.append(P("**Organising a bigger group or a golf society?** Our guide to [Algarve golf trips for groups and golf societies](/guide/algarve-golf-trips-for-groups-and-golf-societies) covers resort villas, minivans and booking several tee times together, and [golf transfers without a car](/guide/algarve-golf-transfers-without-a-car) explains how to get the group to the course and back."))

# the guide renderer has no lists: split '- ' bullet paragraphs into one paragraph per item
out = []
for b in c:
    if b['type'] == 'paragraph' and b['text'].startswith('- '):
        out += [P(x[2:]) for x in b['text'].split('\n')]
    else:
        out.append(b)
c = out
json.dump(c, open(os.path.join(HERE, 'content.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
