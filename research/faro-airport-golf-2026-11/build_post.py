# "Golf near Faro Airport" (topic #70). Checked 18 Nov 2026 (copies in sources/):
# - Google autocomplete (en-GB): 'golf courses near faro airport', 'best/public golf courses near faro airport',
#   'golf resorts/hotels near faro airport', 'luggage storage faro airport', 'is there luggage storage at faro airport'.
# - Drive times: live guide faro-airport-to-algarve-golf-courses (Mapbox from the terminal, Nov 2026).
# - Prices: web/scripts/data/prices-2026-27.json (official sources; Pinheiros Altos = algarvegolf.net fallback, Sep 2026).
# - Twilight: live twilight guide (Vale do Lobo schedule 1pm mid-Nov to Jan ... 3.30pm; Sunset rate includes a shared buggy for
#   full-paying adults; Vila Sol 3.30pm EUR60, twilight buggy EUR40; Quinta do Lago and Vilamoura showed no online twilight rate);
#   daylight table from research/twilight-2026-11/sunset.json (latest tee time = last light - 4h30).
# - Faro Airport lockers: ANA 'Regulamento de utilizacao dos cacifos' 2026 (sources/FAO_RegUtiLockers_2026_PT.pdf): next to car
#   park P5 outside the terminal, 44 lockers + 1 payment terminal, sizes S/M/L/XL (XL 197 x 45 x 77.5 cm), 24 h, max 72 h, cards,
#   Google Pay, Apple Pay, app via QR; no perishables or high-value items; tariff shown at the lockers and on ANA's website. The only
#   published tariff found (ANA decision 4 Dec 2025) still lists the old 3-type lockers, so no price is quoted.
# - Clubhouse facilities: Vale do Lobo golf club page ('changing rooms, lockers'), Ombria clubhouse page ('changing rooms, lockers',
#   'Bag drop service'); Quinta do Lago clubhouses page (open 07:00-18:30), Pinheiros Altos and Vilamoura Golf clubhouse pages say
#   nothing about changing rooms/showers.
# - Cancellation: Quinta do Lago 7 days, same-day bookings non-refundable; Vale do Lobo 48 h (<=12 golfers); Vilamoura Golf and
#   Monte Rei don't refund for delayed or cancelled flights (../rain-2026-11/sources).
# - Ryanair bag drop closes 60 min before departure from 10 Nov 2026 (Which?, 12 Nov 2026).
# - Club hire at the airport: live guide hiring-golf-clubs-at-faro-airport (ClubsToHire arrivals-hall shop 07:00-23:00, extra
#   EUR25 05:30-07:00 and 23:00-00:30; MyCaddyMaster meeting point; Faro Golf Club Hire).
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}
card = lambda s: {'type': 'card', 'slug': s, 'refType': 'course', 'withPhoto': True}

prices = json.load(open(os.path.join(ROOT, 'web/scripts/data/prices-2026-27.json')))
def low(slug, slot='standard'):
    v = [r['price_eur'] for r in prices if r['slug'] == slug and r['time_slot'] == slot and r['holes'] == 18]
    return min(v) if v else None
lo = {s: low(s) for s in ['quinta-do-lago-laranjal', 'pinheiros-altos', 'quinta-do-lago-north', 'quinta-do-lago-south',
      'vale-do-lobo-royal', 'vila-sol', 'vilamoura-old-course', 'vilamoura-pinhal', 'vilamoura-laguna', 'ombria']}
assert lo == {'quinta-do-lago-laranjal': 170, 'pinheiros-altos': 99, 'quinta-do-lago-north': 170, 'quinta-do-lago-south': 188,
  'vale-do-lobo-royal': 116, 'vila-sol': 140, 'vilamoura-old-course': 215, 'vilamoura-pinhal': 101, 'vilamoura-laguna': 88,
  'ombria': 85}, lo
assert low('vale-do-lobo-royal', 'twilight') == 76 and low('vila-sol', 'twilight') == 60

c = []
c.append(P("The closest golf course to Faro Airport is [Quinta do Lago's Laranjal course](/courses/quinta-do-lago-laranjal), about **20 minutes** away by car. Within 35 minutes there are plenty more that take visitors, including the rest of Quinta do Lago, Pinheiros Altos, Vale do Lobo, Vila Sol, Vilamoura and Ombria. So a round on the day you land or the day you fly home is realistic, as long as you plan the timing and know what to do with your luggage."))
c.append(P("This guide covers the nearest courses, how to fit a round around your flight, where to leave suitcases, and hiring clubs at the airport. **Last checked: November 2026.**"))

c.append(H2("The closest golf courses to Faro Airport"))
c.append(P("None of the courses on our map is in Faro itself. The nearest are around Almancil, Vale do Lobo and Vilamoura, west of the airport along the coast:"))
c.append({'type': 'table', 'caption': 'Golf courses within 35 minutes of Faro Airport',
  'headers': ['Course', 'Drive', 'From (18 holes)', 'Twilight'],
  'rows': [
    ['[Quinta do Lago Laranjal](/courses/quinta-do-lago-laranjal)', '20 min', f"€{lo['quinta-do-lago-laranjal']}", 'Not online'],
    ['[Pinheiros Altos](/courses/pinheiros-altos)', '25 min', f"€{lo['pinheiros-altos']}", 'Ask the club'],
    ['[Quinta do Lago North](/courses/quinta-do-lago-north) and [South](/courses/quinta-do-lago-south)', '30 min', f"€{lo['quinta-do-lago-north']} (North), €{lo['quinta-do-lago-south']} (South)", 'Not online'],
    ['[Vale do Lobo Royal](/courses/vale-do-lobo-royal) and [Ocean](/courses/vale-do-lobo-ocean)', '30 min', f"€{lo['vale-do-lobo-royal']}", 'From €76'],
    ['[Vila Sol](/courses/vila-sol)', '30 min', f"€{lo['vila-sol']}", '€60 from 3.30pm'],
    ['[Vilamoura Old Course](/courses/vilamoura-old-course) and [Pinhal](/courses/vilamoura-pinhal)', '30 min', f"€{lo['vilamoura-pinhal']} (Pinhal), €{lo['vilamoura-old-course']} (Old Course)", 'Not online'],
    ['[Vilamoura Laguna](/courses/vilamoura-laguna) and [Millennium](/courses/vilamoura-millennium)', '35 min', f"€{lo['vilamoura-laguna']}", 'Not online'],
    ['[Ombria](/courses/ombria)', '35 min', f"€{lo['ombria']}", 'Ask the club'],
  ],
  'note': "Not a complete list. Drive times from the airport terminal without traffic (Mapbox), rounded to the nearest 5 minutes. 'From' = lowest visitor green fee in the 2026/27 season, from each club's own price list or online booking; Pinheiros Altos from AlgarveGolf.net (September 2026), as the club publishes no rates. 'Not online' = no twilight rate in the club's online booking on the dates we checked; ask the club. All these courses ask for a handicap certificate, usually up to 28 for men and 36 for ladies."})
c.append(P("All of these are open to visitors, so \"public\" in the sense that anyone can book a tee time. Two courses nearby aren't: [San Lorenzo](/guide/san-lorenzo-golf-course-closed-until-2028-where-to-play-instead) in Quinta do Lago is closed for renovation until 2028, and The Els Club in Vilamoura is a private members' club."))
c.append(P("**For the best value close to the airport,** [Vilamoura Laguna and Millennium](/guide/cheapest-golf-in-vilamoura) start at €88 and Ombria at €85, while Vale do Lobo's late-afternoon Sunset rate starts at €76 in winter, with a shared buggy included for full-paying adults. Laranjal is the closest but costs more, from €170. Our guide to [Quinta do Lago Laranjal vs Pinheiros Altos](/guide/quinta-do-lago-laranjal-vs-pinheiros-altos-which-course-should-you-play) compares the two nearest courses."))
c.append(card('quinta-do-lago-laranjal'))

c.append(H2("Playing on the day you arrive"))
c.append(P("A round on arrival day usually means an afternoon tee time, so a twilight rate is worth looking for. The catch is daylight: Vale do Lobo, for example, asks golfers to finish 18 holes in 4 hours 30 minutes, so in winter you need to start early enough to finish before dark:"))
c.append({'type': 'table', 'caption': 'Latest tee time to finish 18 holes before dark',
  'headers': ['Months', 'Last light', 'Tee off by'],
  'rows': [
    ['November to January', 'About 5.45–6.05pm', 'About 1.15–1.35pm'],
    ['February and March', 'About 6.40–7.05pm', 'About 2.05–2.35pm'],
    ['April to August', 'About 8.30–9.25pm', 'About 4–4.50pm'],
    ['September and October', 'About 7.20–8.05pm', 'About 2.50–3.35pm'],
  ],
  'note': "Last light is the end of civil twilight, about half an hour after sunset, calculated for Vilamoura on the 15th of each month (Portugal time). Tee-off time = last light minus 4 hours 30 minutes. See our twilight guide for each month."})
c.append(P("So in winter, a flight landing in the late morning leaves little margin for 18 holes once you've collected your bags and driven to the course. Nine holes, or a session on the range, may be the better plan. [Vale do Lobo](/courses/vale-do-lobo-royal)'s twilight rate starts at 1pm from mid-November to January, and [Vila Sol](/courses/vila-sol)'s at 3.30pm all year. Our [twilight golf guide](/guide/twilight-golf-in-the-algarve) has the start times and prices for every club that publishes them."))
c.append(P("**Leave a margin for delays.** Clubs don't refund a tee time because your flight was late: Vilamoura Golf and Monte Rei say so in their booking terms. Quinta do Lago refunds cancellations made up to 7 days before you play, and bookings made on the day can't be refunded; Vale do Lobo allows free cancellation up to 48 hours before for up to 12 golfers. So book an arrival-day tee time with a few hours to spare after your scheduled landing."))

c.append(H2("Playing on the day you fly home"))
c.append(P("A morning round before an evening flight works well from the courses nearest the airport. Work backwards from your airline's **bag drop deadline**, not your departure time. Ryanair, for example, closes bag drop 60 minutes before departure since 10 November 2026, earlier than the 40 minutes it used before. Check the deadline on your own booking."))
c.append({'type': 'table', 'caption': 'Example: an 18:00 flight with checked golf clubs',
  'headers': ['Step', 'Time'],
  'rows': [
    ['Bag drop closes (60 minutes before)', '17:00'],
    ['Arrive at the airport, allowing an hour for queues and returning a hire car', '16:00'],
    ['Leave the course (up to 35 minutes\' drive)', '15:25'],
    ['Finish your round, allowing about 30 minutes to change and pack your clubs', 'About 15:00'],
    ['Tee off (18 holes in 4 hours 30 minutes)', 'By about 10:30'],
  ],
  'note': "An example only, with our own allowances for queues, changing and packing. Busy summer days, a longer drive or a slow round all need more time."})
c.append(P("**Pack your travel cover before you go.** Leave the travel cover in the car and pack your clubs at the course, so you're not doing it on the pavement outside departures. Make sure they're dry and clean, with the shoes in a separate bag."))
c.append(P("**Ask about changing rooms.** Vale do Lobo and Ombria list changing rooms and lockers on their websites, and Ombria also mentions a bag drop service. The other clubs near the airport don't say on their websites, so ask when you book whether you can change, shower and leave your luggage at the clubhouse."))

c.append(H2("Where to leave your luggage"))
c.append(P("If you've hired a car, the simplest place for your suitcases is the boot, as long as everything fits alongside the golf bags. Otherwise, Faro Airport has **self-service luggage lockers**, run by the airport operator ANA. According to its 2026 rules:"))
c.append(P("**Where:** next to car park P5, outside the terminal building. There are 44 lockers."))
c.append(P("**Sizes:** small, medium, large and extra large. The extra-large lockers are 197 cm high, 45 cm wide and 77.5 cm deep, so they're big enough for a golf bag."))
c.append(P("**Opening hours and limits:** available 24 hours a day, for up to 72 hours. After that, extra daily charges apply."))
c.append(P("**Payment:** by card, Google Pay, Apple Pay or through an app reached with a QR code, at the payment terminal by the lockers. The prices are shown at the lockers and on ANA's website."))
c.append(P("**Not allowed:** food or other perishables. ANA also advises against leaving valuables, as it isn't liable for theft or damage."))
c.append(P("We couldn't find the current locker prices published online, so check them at the lockers. Private luggage-storage services also advertise drop-off points in and around Faro, but we haven't checked them."))

c.append(H2("Hiring clubs at the airport"))
c.append(P("If you'd rather not fly with clubs at all, three companies offer collection at Faro Airport. [ClubsToHire](/shops/clubstohire-faro-airport) has a shop in the arrivals hall, open from 07:00 to 23:00 for pre-booked collections, with earlier and later times for an extra €25. [MyCaddyMaster](/shops/mycaddymaster-faro-airport) uses a meeting point at the airport, and [Faro Golf Club Hire](/shops/faro-golf-club-hire) quotes on request. You normally return the clubs at the same place before your flight. Our guide to [hiring golf clubs at Faro Airport](/guide/hiring-golf-clubs-at-faro-airport) compares them."))

c.append(H2("Getting there and staying nearby"))
c.append(P("A metered taxi to Quinta do Lago or Vale do Lobo costs about €20–30 each way, or from about €34 for a pre-booked car; to Vilamoura, about €25–35 by taxi or from about €35 pre-booked. A hire car makes a round on arrival or departure day easier, as your luggage can stay in the boot. See [Faro Airport to Quinta do Lago and Vale do Lobo with golf clubs](/guide/faro-airport-to-quinta-do-lago-vale-do-lobo-with-golf-clubs), [Faro Airport to Vilamoura](/guide/faro-airport-to-vilamoura-with-golf-clubs) and [Faro car hire for golfers](/guide/faro-car-hire-for-golfers)."))
c.append(P("Looking for a golf hotel close to the airport? Our guides to [hotels near Quinta do Lago](/guide/hotels-near-quinta-do-lago-golf), [hotels near Vale do Lobo](/guide/hotels-near-vale-do-lobo-golf) and [hotels near Ombria](/guide/hotels-near-ombria-golf) cover the closest areas, and [where to stay in the Algarve for golf](/guide/where-to-stay-in-the-algarve-for-golf) compares every base."))

c.append(H2("Golf near Faro Airport: common questions"))
c.append(H3("What is the closest golf course to Faro Airport?"))
c.append(P("Quinta do Lago's Laranjal course, about 20 minutes by car. Pinheiros Altos is about 25 minutes away, and Quinta do Lago North and South, Vale do Lobo, Vila Sol and the Vilamoura Old Course and Pinhal are all about 30 minutes."))
c.append(H3("Are there public golf courses near Faro Airport?"))
c.append(P("Yes. Every course in our table takes visitors, and you can book a tee time without being a member, although most ask for a handicap certificate. The Els Club in Vilamoura is private, and San Lorenzo is closed until 2028."))
c.append(H3("Is there luggage storage at Faro Airport?"))
c.append(P("Yes. ANA runs self-service lockers next to car park P5, outside the terminal, open 24 hours for up to 72 hours. The largest lockers are big enough for a golf bag."))
c.append(H3("Can I play golf on the day I fly home?"))
c.append(P("Yes, if your flight is in the afternoon or evening. Work back from your airline's bag drop deadline: for an 18:00 flight, teeing off by about 10.30am at a course near the airport leaves time to change, pack and drive back."))

out = []
for b in c:
    out.append(b)
c = out
json.dump(c, open(os.path.join(HERE, 'content.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
