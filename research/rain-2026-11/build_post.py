# "What happens if it rains on your Algarve golf trip?" (topic #47). Sources checked 18 Nov 2026 (copies in sources/):
# - Vale do Lobo booking conditions (valedolobo.golfmanager.com/system/page/condicoes): 48 h free cancellation up to 12 golfers,
#   weather closure: no indemnity; if course doesn't reopen same day -> rain voucher for remaining holes, 12 months; buggies may be restricted
# - Vilamoura Golf (Old Course, Millennium, Laguna, Pinhal) booking-cancelation-policies page: 2027 rounds free cancel 15 days
#   (Jan Feb Jul Aug Nov Dec) / 45 days (Mar-Jun, Sep, Oct); late = charged in full; no refunds for flights/illness, recommends insurance.
#   Rules & regulations: weather closure = no refund; rain voucher 'on an exceptional basis', personal, 1 year, ask reception immediately;
#   <9 holes -> 18-hole voucher, 9-17 -> 9-hole; twilight/9-hole -> 9-hole; low/mid-season vouchers not valid in high season; buggies can be banned
# - Quinta da Ria and Quinta do Vale booking conditions (golfmanager /system/page/conditions): free-cancellation tables 2027 by season;
#   same weather-closure voucher wording as Vale do Lobo (12 months)
# - Quinta do Lago terms (eu.golfmanager.com/quintadolago/consumer/page?name=terms, rendered; sources/gm2_quintadolago_terms.txt):
#   7 days free cancel, same-day bookings non-refundable, same weather voucher wording (12 months)
# - Monte Rei golf-booking-policies + course-rules-regulations pages: 15 days (<=4 players); no refunds for inclement weather;
#   'Rain and strong winds are not cause to close the course'; closed -> no refund, rain check vouchers if no more than 9 holes completed
# - Boavista booking terms (boavista.golfmanager.com/system/page/termosecondicoes): 48 h (<=4), EUR2 fee; closed day -> alternative day
#   or rain check voucher; closed after start: <5 holes -> 18-hole voucher, 5+ -> 9-hole voucher
# - Espiche terms (espiche.golfmanager.com/system/page/TermsConditions): 72 h (<=4), EUR2 fee; 'Refunds will only be considered if the
#   golf course is officially closed (i.e. weather conditions)'
# - Ombria Golf Rules & Regulations PDF (file name 2024, uploaded 2026/06): 5 days (<=8); thunderstorm buzzer, suspension reviewed every
#   15 min, no refund if still time to finish that day; heavy-rain suspension if 4+ greens flooded; buggies can be limited
# - Palmares 'Payment and cancellation terms - pre-payment (golf)': 15 days (Jan Feb Jul Aug Nov Dec) / 30 days (other months); no weather rule
# - Benamor online reservation terms: refund if cancelled 48 h+ before, less 5% admin fee (7% Amex); within 48 h no refund; no weather rule
# - Checked, nothing published on weather/cancellation (crawl_clubs.py, crawl/): Pestana courses + Ferragudo, Salgados, Penina,
#   Amendoeira, Morgado/Alamos, Castro Marim, Pine Cliffs, Pinheiros Altos, Santo Antonio, Balaia, Vale de Milho
# - Penina 2024/25 price list (research/twilight-2026-11/sources): 'Golf carts can be restricted due to weather conditions'
# - Golfscape (book.golfscape.com/login): cancellation policies defined by each course, shown at booking + confirmation email
# - AlgarveGolf.net terms: if unplayable, go to the course before your tee time to ask for a rain check or no-cost cancellation
# - Rain: IPMA climate normals 1991-2020, Faro (554) + Sagres (533), as used in the monthly series (days >= 1 mm)
# - Plan B: Salgados booking-engine notice (two Foresight Sports simulators in the clubhouse), web/src/data/practice.ts
#   (Quinta da Ria Foresight simulator + 5 covered bays, Santo António 4 covered tees, Pestana Golf Academy covered bays)
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}
c = []
c.append(P("Rain rarely stops play in the Algarve, and when it does, don't expect your money back. At the clubs we checked, a green fee isn't refunded just because it rains: if the course stays open, your booking stands. If the club **closes the course** because of the weather, you usually get a **rain voucher** to play the holes you missed on another day, typically within 12 months, rather than a refund. And free cancellation normally ends **days or weeks before** your tee time, so by the time a bad forecast appears it's usually too late to cancel for free."))

c.append(H2("How often does it rain in the Algarve?"))
c.append(P("Not often. Even in the wettest months, it rains on about one day in four, and from June to August it hardly rains at all. These are the official long-term averages from IPMA, Portugal's weather service:"))
c.append({'type': 'table', 'caption': 'Average rainy days and rainfall by month',
  'headers': ['Month', 'Rainy days, Faro', 'Rainy days, Sagres', 'Rainfall, Faro'],
  'rows': [
    ['[January](/guide/algarve-golf-in-january)', '6', '7', '49 mm'],
    ['[February](/guide/algarve-golf-in-february)', '5', '6', '42 mm'],
    ['[March](/guide/algarve-golf-in-march)', '6', '6', '47 mm'],
    ['[April](/guide/algarve-golf-in-april)', '5', '6', '39 mm'],
    ['[May](/guide/algarve-golf-in-may)', '4', '4', '26 mm'],
    ['[June](/guide/algarve-golf-in-june)', '1', '1', '5 mm'],
    ['[July](/guide/algarve-golf-in-july)', 'Less than 1', 'Less than 1', '1 mm'],
    ['[August](/guide/algarve-golf-in-august)', 'Less than 1', 'Less than 1', '3 mm'],
    ['[September](/guide/algarve-golf-in-september)', '2', '3', '22 mm'],
    ['[October](/guide/algarve-golf-in-october)', '6', '7', '56 mm'],
    ['[November](/guide/algarve-golf-in-november)', '7', '8', '76 mm'],
    ['[December](/guide/algarve-golf-in-december)', '7', '8', '90 mm'],
  ],
  'note': 'Source: IPMA climate normals 1991–2020 for Faro (centre and east) and Sagres (west). A rainy day is one with at least 1 mm of rain. Each month links to our guide to Algarve golf in that month.'})
c.append(P("November and December are the wettest months, with about seven or eight rainy days. A rainy day here means one with at least 1 mm of rain, not necessarily a whole day of it. If you can choose your dates, see [the best time to play golf in the Algarve](/guide/algarve-golf-season-best-time-to-play-golf)."))

c.append(H2("What the clubs' booking terms say"))
c.append(P("Every club sets its own rules, so these are examples from clubs that publish their booking conditions, not a rule for every course:"))
c.append({'type': 'table', 'caption': 'Free cancellation and weather closures at some Algarve clubs',
  'headers': ['Club', 'Free cancellation (small groups)', 'If the weather closes the course'],
  'rows': [
    ['[Vale do Lobo](/courses/vale-do-lobo-royal) (Royal and Ocean)', 'Up to 48 hours before, for up to 12 golfers', 'Rain voucher for the remaining holes if the course doesn\'t reopen the same day, valid 12 months'],
    ['Vilamoura Golf ([Old Course](/courses/vilamoura-old-course), [Millennium](/courses/vilamoura-millennium), [Laguna](/courses/vilamoura-laguna), [Pinhal](/courses/vilamoura-pinhal))', '15 days before for rounds in January, February, July, August, November and December; 45 days in other months (2027 rounds)', 'No refund. A rain voucher may be given as an exception, valid 1 year'],
    ['Quinta do Lago ([South](/courses/quinta-do-lago-south), [North](/courses/quinta-do-lago-north), [Laranjal](/courses/quinta-do-lago-laranjal))', 'Up to 7 days before. Bookings made on the day can\'t be refunded', 'Voucher for the remaining holes if the course doesn\'t reopen the same day, valid 12 months'],
    ['[Monte Rei](/courses/monte-rei)', 'Up to 15 days before, for up to 4 players', 'No refund. Rain check voucher if you\'ve played no more than 9 holes'],
    ['[Boavista](/courses/boavista)', 'Up to 48 hours before, for up to 4 players (€2 fee)', 'Another day or a rain check voucher. If play stops: 18-hole voucher under 5 holes played, 9-hole voucher after'],
    ['[Espiche](/courses/espiche)', 'Up to 72 hours before, for up to 4 players (€2 fee)', 'Refunds only considered if the course is officially closed, for example because of the weather'],
    ['[Ombria](/courses/ombria)', 'Up to 5 days before, for up to 8 players', 'No refund if there is still time to finish your round that day'],
    ['[Palmares](/courses/palmares)', '15 days before for rounds in January, February, July, August, November and December; 30 days in other months', 'Not stated'],
    ['[Benamor](/courses/benamor)', 'Up to 48 hours before, less a 5% fee (7% with American Express)', 'Not stated'],
    ['[Quinta da Ria](/courses/quinta-da-ria) and [Quinta de Cima](/courses/quinta-de-cima)', '48 hours (mid-June to August) to 15 days, by season, for up to 7 players', 'Voucher for the remaining holes if the course doesn\'t reopen the same day, valid 12 months'],
    ['[Quinta do Vale](/courses/quinta-do-vale)', '7 days (January, mid-June to August, December) or 15 days (other months), for up to 7 players', 'Voucher for the remaining holes if the course doesn\'t reopen the same day, valid 12 months'],
  ],
  'note': "Source: each club's published booking conditions, checked 18 November 2026. Larger groups have longer deadlines. Check the conditions shown when you book, as they can change."})
c.append(P("**Your course isn't in the table?** For the other Algarve courses, we couldn't find enough published information about what happens if it rains or when you can cancel for free, so we've left them out rather than guess. That includes Pestana's courses (Gramacho, Vale da Pinta, Silves, Alto Golf, Vila Sol and Pestana Ferragudo), Salgados, Penina, Amendoeira, Morgado and Alamos, Castro Marim and Pine Cliffs. If you're booking one of them, ask the club about its cancellation and rain policy before you pay."))
c.append(P("Vilamoura Golf spells out how its rain vouchers work. If play is stopped and you've played **fewer than 9 holes** of an 18-hole round, you get an 18-hole voucher; if you've played **9 or more**, a 9-hole voucher. Twilight and 9-hole rounds get a 9-hole voucher. The vouchers are personal, can't be transferred, and those issued in the low or mid season can't be used in high season. You have to ask for one at reception straight after play is stopped."))
c.append(P("[Boavista](/courses/boavista) is the most generous on paper. If the course is closed on the day you're due to play, you're first offered another day, or a rain check voucher if you can't make it. If it closes after you've started, you get an 18-hole voucher if you've played fewer than 5 holes and a 9-hole voucher after that. [Monte Rei](/courses/monte-rei) gives a rain check voucher only if you've completed no more than 9 holes, and says plainly that rain and strong winds are not reasons to close the course."))
c.append(P("Vale do Lobo, Quinta do Lago, Quinta da Ria and Quinta do Vale use almost the same wording: the club decides when to close the course and when it's safe to reopen, it pays no compensation for the closure, and a voucher is only issued in what they call extreme situations, when the course doesn't reopen that day. At [Ombria](/courses/ombria), play is suspended with a buzzer during thunderstorms and the situation is checked every 15 minutes; if there's still time to finish your round that day, there's no refund. Ombria also suspends play for heavy rain when at least four greens are flooded."))

c.append(H2("If it's raining but the course is open"))
c.append(P("This is the case that catches most golfers out. None of the booking conditions we read gives you a refund because it's raining while the course is open. Once the free cancellation deadline has passed, Vale do Lobo says the booking \"cannot be cancelled, altered or refunded\", and Vilamoura Golf, Monte Rei and Palmares charge late cancellations and no-shows in full. Monte Rei says it gives no refunds \"in the event of inclement weather\", and Vilamoura Golf, Monte Rei and Palmares all say they don't refund for delayed or cancelled flights or injuries, and recommend travel insurance."))
c.append(P("So if the forecast is wet, your choice is usually to play in waterproofs, or to talk to the club before your tee time and ask whether it will move your booking. Some clubs may help, but it's their decision."))

c.append(H2("Buggies after heavy rain"))
c.append(P("To protect the course, clubs can restrict buggies when it's wet. Vale do Lobo and Vilamoura Golf both say they can restrict or ban buggies because of the weather, Ombria can limit buggies at any time, and Penina's price list warns that golf carts can be restricted due to weather conditions. That can mean keeping to the paths or no buggies at all, which matters if you rely on one. Ask the club when you check in, or call ahead if you can't walk the course. Our [golf buggy hire guide](/guide/golf-buggy-hire-in-the-algarve) has more."))

c.append(H2("If you booked through an agency or website"))
c.append(P("Booking through a tee-time website usually doesn't change the rules: the course's own policy applies. Golfscape, for example, says each course defines its cancellation policy, which is shown when you book and in your confirmation email. AlgarveGolf.net says that if a course is unplayable, you must go to the course before your tee time to ask for a rain check or a free cancellation, and that refunds and rain checks depend on each course's policy. See our guide to [booking tee times in the Algarve](/guide/how-to-book-tee-times-in-the-algarve)."))

c.append(H2("What to do on a rainy golf day"))
c.append(P("**Before you book:** read the cancellation deadline. If your dates might change, a club with a short deadline, such as 48 hours at Vale do Lobo, Boavista or Benamor, is more flexible than one that asks for 15 or 45 days."))
c.append(P("**On the day:** don't just stay away. Call the club or go to reception before your tee time and ask whether the course is open and whether buggies are allowed. A no-show is normally charged in full."))
c.append(P("**If play is stopped:** go to reception straight away and ask for a rain voucher. Check how many holes it covers, how long it's valid and whether you can use it in a different season."))
c.append(P("**Pack for it:** waterproofs, a spare glove, an umbrella and a towel. Most of the Algarve's rain falls between October and April."))

c.append(H2("Rainy day plan B"))
c.append(P("If you'd rather not play in the rain, some clubs have places to keep practising under cover. [Salgados](/courses/salgados) has two Foresight Sports golf simulators in its clubhouse. [Quinta da Ria](/courses/quinta-da-ria/practice-facilities) has a Foresight simulator and five covered bays at its driving range, and [Santo António](/courses/santo-antonio/practice-facilities) has four covered practice tees. The Pestana Golf Academy has covered hitting bays too. See our list of [Algarve driving ranges](/driving-ranges) for more."))

c.append(H2("Frequently asked questions"))
c.append(H3("Can you play golf in the rain in the Algarve?"))
c.append(P("Yes. A course stays open in the rain unless the club decides to close it because of the weather, and the club also decides when to reopen."))
c.append(H3("Do you get a refund if it rains?"))
c.append(P("Not usually. At the clubs we checked, you don't get a refund because of rain. If the club closes the course, you may get a rain voucher to play the missed holes another day, normally within a year."))
c.append(H3("What is the rainiest month in the Algarve?"))
c.append(P("November and December, with about seven rainy days in Faro and eight in Sagres. December has the most rain in Faro, about 90 mm on average. July and August have almost none."))

json.dump(c, open(os.path.join(HERE, 'content.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
