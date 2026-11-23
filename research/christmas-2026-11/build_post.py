# "Golf in the Algarve at Christmas and New Year" (topic #100). Built 23 Nov 2026.
# User rule (23 Nov 2026): list ONLY courses where we confirmed online tee times on that day; never say a course is closed or
# show gaps, because no online availability may just mean full, not released yet, or phone-only.
# Data: gm1_holiday_2026-11-23.json (Golfmanager v1) + gm2_holiday_2026-11-23.jsonl (v2), checked 23 Nov 2026 on each club's own
# online booking. Amendoeira Faldo (no times even on a normal control day) and anything not checkable (Pestana, Penina, Benamor,
# Santo António, Pinheiros Altos) are left out of the day lists. Quinta da Ria's control day was empty, but positive days are kept.
# Events: Pine Cliffs official festive golf page (saved: pinecliffs_festive_2026-11-23.html); Quinta do Lago official events page
# (Junior Open 27-29 Dec 2026, Laranjal); Vilamoura International Golf Classic 9-16 Jan 2027 (our tournaments guide).
# December conditions: twilight guide (tee off by about 1.15pm in December for 18 holes), season guide (December among the
# cheapest and wettest months), December monthly post.
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), 'near-hotels-2026-11'))
from near_lib import P, H2, H3, C, G

gm1 = json.load(open(os.path.join(HERE, 'gm1_holiday_2026-11-23.json')))
gm2 = {}
for line in open(os.path.join(HERE, 'gm2_holiday_2026-11-23.jsonl')):
    d = json.loads(line); gm2[d['tenant']] = d['out']
DAYS = ['2026-12-24', '2026-12-25', '2026-12-26', '2026-12-31', '2027-01-01']
avail = {d: set() for d in DAYS}
for slug, row in gm1.items():
    if slug == 'amendoeira-faldo': continue
    for d in DAYS:
        if row.get(d) and row[d] != 'err': avail[d].add(slug)
V2 = {'valedolobo': {'vale-do-lobo-royal': 'ROYAL', 'vale-do-lobo-ocean': 'OCEAN'}, 'monterei': {'monte-rei': 'GF18 Direct'},
      'quintadolago': {'quinta-do-lago-south': 'QS - Web (18', 'quinta-do-lago-north': 'QN - Web (18', 'quinta-do-lago-laranjal': 'QL - Web (18'}}
for tenant, m in V2.items():
    for d in DAYS:
        for slug, key in m.items():
            if key in gm2[tenant].get(d, {}): avail[d].add(slug)

NAMES = {'vale-do-lobo-royal': 'Vale do Lobo Royal', 'vale-do-lobo-ocean': 'Vale do Lobo Ocean', 'quinta-do-lago-south': 'Quinta do Lago South',
 'quinta-do-lago-north': 'Quinta do Lago North', 'quinta-do-lago-laranjal': 'Quinta do Lago Laranjal', 'vilamoura-old-course': 'Vilamoura Old Course',
 'vilamoura-pinhal': 'Vilamoura Pinhal', 'vilamoura-laguna': 'Vilamoura Laguna', 'vilamoura-millennium': 'Vilamoura Millennium', 'monte-rei': 'Monte Rei',
 'ombria': 'Ombria', 'salgados': 'Salgados', 'amendoeira-oconnor': "Amendoeira O'Connor", 'morgado': 'Morgado', 'alamos': 'Alamos',
 'castro-marim': 'Castro Marim', 'palmares': 'Palmares', 'boavista': 'Boavista', 'quinta-do-vale': 'Quinta do Vale', 'espiche': 'Espiche',
 'quinta-da-ria': 'Quinta da Ria', 'quinta-de-cima': 'Quinta de Cima'}
ORDER = list(NAMES)  # rough east-west grouping order as written
def lst(d):
    s = [x for x in ORDER if x in avail[d]]
    links = [C(NAMES[x], x) for x in s]
    return ', '.join(links[:-1]) + ' and ' + links[-1], len(s)
every = [x for x in ORDER if all(x in avail[d] for d in DAYS)]
assert set(every) == {'vale-do-lobo-royal', 'vale-do-lobo-ocean', 'quinta-do-lago-north', 'amendoeira-oconnor', 'morgado', 'alamos', 'castro-marim'}, every
LBL = {'2026-12-24': 'Christmas Eve, 24 December', '2026-12-25': 'Christmas Day, 25 December', '2026-12-26': 'Boxing Day, 26 December',
       '2026-12-31': "New Year's Eve, 31 December", '2027-01-01': "New Year's Day, 1 January"}

ev = ', '.join(C(NAMES[x], x) for x in every[:-1]) + ' and ' + C(NAMES[every[-1]], every[-1])
c = []
c.append(P(f"Yes, you can play golf in the Algarve at Christmas and New Year. When we checked the clubs' own online booking in late November, these courses had tee times on **every** day from Christmas Eve to New Year's Day: {ev}. Many more had tee times on at least some of the holidays. **Last checked: 23 November 2026.**"))
c.append(P("**How to read this guide:** we only list a course on a day when its own online booking showed tee times for that day. If a course isn't listed for a day, it doesn't mean it's closed: it may be fully booked, not yet open for booking online, or taking bookings by phone. If the course you want isn't listed, contact the club directly."))

c.append(H2("Courses with online tee times on each holiday"))
for d in DAYS:
    t, n = lst(d)
    c.append(H3(LBL[d]))
    c.append(P(f"{t}."))
c.append(P("Availability changes as tee times are booked, so check the club's own booking page for your date."))

c.append(H2("Christmas golf events"))
c.append(P(f"**{C('Pine Cliffs', 'pine-cliffs')}** has a festive programme on its 9-hole clifftop course. Through December, a round between 12pm and 3pm costs €43 for 9 holes or €53 for 18, with a pull trolley included, and juniors up to 17 play at half price with a paying adult. On **24 December** there's a Christmas Golf Class at 9am (€20) and a Christmas Family Tournament from 11am, a 9-hole Texas scramble for teams of two (€54 for adult guests, €44 for juniors). Registration for both closes on 23 December at 2pm. The same special rates run from 1 to 31 January, between 12pm and 2pm."))
c.append(P(f"**Quinta do Lago** hosts its Junior Open on the {C('Laranjal', 'quinta-do-lago-laranjal')} course from 27 to 29 December 2026, for young golfers in several age groups."))
c.append(P(f"Straight after the holidays, the **Vilamoura International Golf Classic** runs from 9 to 16 January 2027 on the Vilamoura courses. See {G('golf tournaments in the Algarve', 'golf-tournaments-in-the-algarve')} for this and other amateur events."))

c.append(H2("What golf is like in late December"))
c.append(P(f"**Short days.** In late December the sun sets before 5.30pm, so to finish 18 holes before dark you need to tee off by about 1.15pm. A twilight tee time leaves enough light for about nine holes. See {G('twilight golf in the Algarve', 'twilight-golf-in-the-algarve')}."))
c.append(P(f"**Low-season prices.** December and January are among the cheapest months for green fees and hotels, which makes the holidays good value for golf. See {G('Algarve golf in December', 'algarve-golf-in-december')} and {G('the best time to play golf in the Algarve', 'algarve-golf-season-best-time-to-play-golf')}."))
c.append(P(f"**Some rain.** December and January have the highest risk of rain of the year. Read {G('what happens if it rains on your golf trip', 'what-happens-if-it-rains-on-your-algarve-golf-trip')} for the clubs' rain and cancellation rules."))

c.append(H2("Tips for booking golf over the holidays"))
c.append(P("**Book early.** Tee times on the holidays can fill up, so book as soon as your dates are fixed, through the club's own booking page."))
c.append(P("**Check the cancellation terms.** Free cancellation often ends days or weeks before your round, so check the deadline before you pay."))
c.append(P(f"**Ask the club if your course isn't listed.** Clubs such as Pestana's courses, Penina and Benamor use other booking systems we couldn't check, and others may take holiday bookings by phone. See {G('how to book tee times in the Algarve', 'how-to-book-tee-times-in-the-algarve')} for each club's booking details."))

c.append(H2("Christmas and New Year golf: common questions"))
c.append(H3("Are Algarve golf courses open on Christmas Day?"))
c.append(P(f"Many are. When we checked, {lst('2026-12-25')[0]} all had tee times online for 25 December."))
c.append(H3("Can I play golf on New Year's Day in the Algarve?"))
c.append(P(f"Yes. Courses with online tee times on 1 January included Vale do Lobo, Quinta do Lago North and Laranjal, the Vilamoura Old Course and Pinhal, Monte Rei and Ombria."))
c.append(H3("Are there Christmas golf tournaments in the Algarve?"))
c.append(P("Pine Cliffs runs a Christmas Family Tournament and a Christmas Golf Class on 24 December, and Quinta do Lago hosts a Junior Open from 27 to 29 December."))
c.append(H3("Is golf cheaper in the Algarve at Christmas?"))
c.append(P("Usually, yes. December is low season, so green fees are lower than in spring and autumn, and Pine Cliffs has special festive rates."))

json.dump(c, open(os.path.join(HERE, 'content.json'), 'w'), ensure_ascii=False, indent=1)
for d in DAYS: print(d, lst(d)[1])
print(len(c), 'blocks; every day:', every)
