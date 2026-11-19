# "How long does a round of golf take in the Algarve?" (topic #53). Checked 18-19 Nov 2026.
# - Official targets: web/src/data/pace.ts (club rules, booking terms and scorecards; sources listed there). The script asserts
#   that every target quoted here is in pace.ts.
# - Check-in / starter: Quinta do Lago, Quinta da Ria, Quinta do Vale booking conditions (check in 30 min before; late = may
#   lose the tee time, no refund); Pestana scorecards (report to the starter at least 5 min before or lose the tee time).
# - Four-balls: Vilamoura Golf rules (always paired into four-balls), Vale do Lobo conditions (flights made up as 4-balls),
#   Benamor rules (flights made up as 4-balls), Pestana scorecards (four-balls at peak times). Pine Cliffs: 2- and 3-balls
#   have priority over four-balls.
# - Golfers' reviews: research/algarvegolf-reviews/reviews.json (2,578 AlgarveGolf.net reviews, scraped 17 Sep 2026, mostly
#   2022-2025). reviews_pace.py + strict count: 112 reviews explicitly complain of slow play or rounds of 5 hours or more;
#   among them marshals/rangers mentioned in 28, groups/societies/corporate days in 24, busy course in 18. Opinions only;
#   no course is named as slow because keyword counts per course are too noisy.
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
PACE = open(os.path.join(ROOT, 'web/src/data/pace.ts')).read()
P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}
L = lambda name, slug: f'[{name}](/courses/{slug})'

for t in ["target: '4h40 for 18 holes'", "target: '4h30 for 18 holes'", "target: 'About 4h30 for 18 holes'", "target: '4h20 for 18 holes'",
          "target: '2h20 for 9 holes'", "target: '2 hours for 9 holes'", "target: 'Under 2 hours for 9 holes'", '12 minutes between tee times',
          'Tee times are 10 minutes apart', 'maximum of 2 hours 14 minutes']:
    assert t in PACE, t

c = []
c.append(P("Most Algarve clubs that publish a target expect **18 holes to take between 4 hours 20 minutes and 4 hours 40 minutes**, and 4 hours 30 minutes is the most common figure. Nine holes should take about 2 hours. On a busy day it can take longer: rounds of five hours or more are one of the complaints golfers make most often in reviews of Algarve courses."))
c.append(P("This guide shows the official pace-of-play targets course by course, why rounds run slow, and how to plan your day around your tee time. **Last checked: November 2026.**"))

c.append(H2("Official pace-of-play targets"))
c.append(P("These are the times the clubs set in their own rules, booking terms or scorecards:"))
c.append({'type': 'table', 'caption': 'How long the clubs expect a round to take',
  'headers': ['Course', '18 holes', '9 holes'],
  'rows': [
    [f"Vilamoura Golf: {L('Old Course', 'vilamoura-old-course')}, {L('Pinhal', 'vilamoura-pinhal')}, {L('Laguna', 'vilamoura-laguna')}, {L('Millennium', 'vilamoura-millennium')}", '4h40', '–'],
    [f"{L('Vale do Lobo Royal', 'vale-do-lobo-royal')} and {L('Ocean', 'vale-do-lobo-ocean')}", '4h30', '–'],
    [f"Quinta do Lago: {L('South', 'quinta-do-lago-south')}, {L('North', 'quinta-do-lago-north')}, {L('Laranjal', 'quinta-do-lago-laranjal')}", 'About 4h30', '2h14 maximum'],
    [L('Monte Rei', 'monte-rei'), '4h30', '–'],
    [L('Ombria', 'ombria'), '4h30', '2h15'],
    [f"Pestana: {L('Gramacho', 'gramacho')}, {L('Vale da Pinta', 'vale-da-pinta')}, {L('Silves', 'silves')}, {L('Vila Sol', 'vila-sol')}, {L('Ferragudo', 'pestana-ferragudo')}", '4h30', '–'],
    [f"{L('Quinta da Ria', 'quinta-da-ria')} and {L('Quinta de Cima', 'quinta-de-cima')}", '4h20', '2h10'],
    [L('Quinta do Vale', 'quinta-do-vale'), '–', '2h20 maximum'],
    [L('Pine Cliffs', 'pine-cliffs') + ' (9-hole course)', '–', '2h'],
    [L('Balaia', 'balaia') + ' (9-hole par-3 course)', '3h10 on the scorecard', 'Under 2h'],
  ],
  'note': "Source: each club's rules, booking conditions or official scorecard, checked November 2026; '–' means the club doesn't give a figure. Some clubs, such as Benamor, Castro Marim, Salgados and Boavista, set pace-of-play rules without a target time, and others publish nothing. Each course page on our site shows what its club says."})
c.append(P("Vilamoura Golf is the only one we found that allows more than 4 hours 30 minutes, with 4 hours 40 minutes for 18 holes. Quinta da Ria and Quinta de Cima are the strictest, with 2 hours 10 minutes for each nine. Monte Rei also spaces its tee times 12 minutes apart, and Ombria and Boavista 10 minutes apart."))

c.append(H2("What golfers say"))
c.append(P("We read through a large number of golfers' reviews of Algarve courses. Many of them complain about slow play or rounds of five hours or more, about many different courses. These are golfers' own experiences, not measurements, but three explanations come up again and again:"))
c.append(P("**No marshal or ranger in sight.** Groups waiting on every tee, with nobody on the course to move slow players on."))
c.append(P("**Playing behind a society, a tournament or a corporate day.** Big groups, sometimes of beginners or playing off the back tees, hold up everyone behind them."))
c.append(P("**A busy course.** Golfers playing at the busiest times of year mention waiting at every hole. Spring and autumn are the Algarve's high season for golf, when green fees are also at their highest."))
c.append(P("The good news is in the reviews too: some golfers note that, after slow first holes, the groups spread out and they got round in just over 4 hours."))

c.append(H2("Why a round can take longer"))
c.append(P("**Everyone plays in four-balls.** Algarve tee times are usually for groups of four, and clubs fill them up. Vilamoura Golf always pairs players into four-balls, Vale do Lobo and Benamor make up flights as four-balls, and Pestana's courses switch to four-balls at peak times. A four-ball is slower than a two-ball, so expect a four-ball pace even if you book as a couple."))
c.append(P("**Tee times are close together.** With groups starting every 10 to 12 minutes, one slow group affects everyone behind it."))

c.append(H2("How to get round faster"))
c.append(P("**Book an early tee time.** The first groups of the day have nobody in front of them, so they set their own pace."))
c.append(P("**Avoid the busiest weeks if you can.** Our guide to [the best time to play golf in the Algarve](/guide/algarve-golf-season-best-time-to-play-golf) shows how the seasons work."))
c.append(P("**Pick up when the hole is gone.** Pine Cliffs, for example, makes players pick up their ball once they reach double par on a hole. Playing Stableford, where you can pick up once you can't score, does the same job."))
c.append(P("**Let faster groups through.** Pestana's, Vilamoura Golf's and Benamor's rules all ask you to let the group behind play through if you're holding them up or there's a free hole ahead."))
c.append(P("**Play nine holes.** If you're short of time or energy, a 9-hole round takes about 2 hours. Pine Cliffs, Balaia, Penina Resort and Vale de Milho are 9-hole courses; see [the Algarve's 9-hole courses](/algarve-9-hole-courses)."))

c.append(H2("Planning your day"))
c.append(P("Add the time before and after the round to the round itself. Quinta do Lago, Quinta da Ria and Quinta do Vale ask you to **check in 30 minutes before** your tee time, and say that if you're late you may lose it without a refund. At Pestana's courses you must report to the starter at least 5 minutes before your tee time, or you lose it."))
c.append(P("So for a 4h30 round, allow about **5 hours from check-in to the 18th green**, plus time to warm up, get to the course and have lunch. If you're playing late in the day, check the light: our [twilight golf guide](/guide/twilight-golf-in-the-algarve) shows the latest tee time each month that still lets you finish 18 holes, and our guide to [golf near Faro Airport](/guide/golf-near-faro-airport) works through a round on the day you fly home."))

c.append(H2("Pace of play in the Algarve: common questions"))
c.append(H3("How long does 18 holes take in the Algarve?"))
c.append(P("Clubs that publish a target allow between 4 hours 20 minutes and 4 hours 40 minutes, most often 4 hours 30 minutes. On busy days, golfers report rounds of five hours or more."))
c.append(H3("How long does 9 holes take?"))
c.append(P("About 2 hours. Pine Cliffs allows 2 hours, Quinta da Ria 2 hours 10 minutes for each nine and Quinta do Vale up to 2 hours 20 minutes."))
c.append(H3("Is slow play a problem in the Algarve?"))
c.append(P("It can be on busy days. It's one of the complaints that comes up most often in golfers' reviews, usually blamed on missing marshals, big groups or a packed tee sheet. An early tee time is the simplest way to avoid it."))
c.append(H3("Will I be paired with other golfers?"))
c.append(P("Probably, if you book fewer than four. Most clubs fill tee times as four-balls. Vilamoura Golf, for example, always does, and only guarantees a group of its own if you ask in advance and pay for the missing places. See [how to book tee times in the Algarve](/guide/how-to-book-tee-times-in-the-algarve)."))

json.dump(c, open(os.path.join(HERE, 'content.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
