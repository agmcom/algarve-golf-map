# "Rainy day in the Algarve: golf simulators and indoor things to do" (topics #32 + rainy-day ideas). Checked 20 Nov 2026.
# Sources (official sites, read 20 Nov 2026):
# - Golf Studio Vilamoura, golfstudio.pt: Benfarras, N125, 8125-017 Vilamoura; TrackMan private bays; "€29 / h", "+€9 / h each",
#   "Up to 8 players total"; 17 and under 50% off, 12 and under free with paying adult; play 9 or 18; Old Course Vilamoura in
#   TrackMan library (blog 13 May 2026); coaching; "open all year round"; +351 912 120 602. Opening hours NOT published.
# - Eden Alvor (ex-Golfland), edenalvor.com/price-list + /booking/simulator-room: Rua Serpa Pinto 1, Alvor; indoor TrackMan
#   simulator, 500+ courses; rental "price per hour €40 (up to 8 people)"; package "2h €120 Including 4 players. Extra player
#   €18" incl. a Golfland burger + 2 drinks per person; clubs free; open daily 10:00-22:00; +351 282 483 447.
# - Salgados, salgadosgolf.com/golf-simulators: "brand new indoor golf simulators", full 18-hole round, iconic courses, lounge with
#   food and beverages; no price/hours/brand published; booking via contact form (bookings@salgadosgolf.com).
# - Quinta da Ria, quintadaria.com/practice-facilities: Performance Center, Foresight simulator at the driving range; 5 covered
#   bays on artificial grass. Santo António: 4 covered practice tees (web/src/data/practice.ts). Pestana Golf Academy: covered
#   bays (practice.ts / academies.ts). Monte Rei: indoor Swing Studio for teaching and club fitting (practice.ts).
# - Dropped: Loulé TrackMan suite (Tripadvisor "no longer available", no operator site); bowling (no official site reachable);
#   Adega do Cantor / Quinta dos Vales (official sites unreachable).
# - Aquashow indoor park, aquashowpark.com (PT plan-your-visit page): every day 10:00-18:00; 2 h €30 / 3 h €35 normal (13-64),
#   child 6-12 €20/€25, senior 65+ €20/€25; prices subject to change; Volta do Parque 1, 8125-313 Quarteira; free parking.
# - Centro Ciência Viva do Algarve, ccvalg.pt: Rua Comandante Francisco Manuel, Faro; Mar-Dec Tue-Sun 10-13 and 14-17, closed
#   Mon; Jan-Feb Tue-Sat 10-13 and 14-18; closed 1 Jan, Easter Sunday, 1 May, 24/25/31 Dec; adult €5 (from 1 Jan 2026),
#   aquariums included.
# - Centro Ciência Viva de Lagos, lagos.cienciaviva.pt: Oct-Mar Tue-Sun 10-18, Apr-Sep daily 10-18; closed 24/25/31 Dec and
#   1 Jan; over 17 €6, 6-17 €3, family €15 (price table updated 13 Sep 2025).
# - Museu de Portimão, museudeportimao.pt/visitar/museu: 1 Sep-31 Jul Tue 14:30-18:00, Wed-Sun 10:00-18:00; closed Mondays and
#   national holidays; €3.
# - Forum Algarve, forumalgarve.net: over 100 shops, 5 cinema screens, 20+ restaurants, every day 10:00-23:00, 5 min from
#   Faro Airport. MAR Shopping Algarve, marshopping.com/algarve: Loulé, shops, Designer Outlet Algarve, IKEA, cinema.
#   AlgarveShopping, algarveshopping.pt: Guia, over 120 shops and restaurants.
# - Morgado do Quintão, morgadodoquintao.pt/en/wine-experiences: Wine Break "€30 pp · Mon–Sat, 11am–7pm"; Wine Tasting &
#   Vineyard Tour "Mon–Sat, 16:00 · 18+", booked online; site's footer says closed Saturday, so we say check when booking.
import json, os
# GetYourGuide affiliate links (user, 2026-11-20); URLs found via search restricted to getyourguide.com, 20 Nov 2026.
AFF = '?partner_id=L3NSZHI&utm_medium=platforms_and_communities&cmp=golf'
GYG_AQUASHOW = 'https://www.getyourguide.com/quarteira-l90216/aquashow-indoor-water-park-spa-eintrittskarten-t794312/' + AFF
GYG_CCV_FARO = 'https://www.getyourguide.com/algarve-l66/faro-algarve-life-sciences-center-museum-ticket-t428638/' + AFF
GYG_MORGADO = 'https://www.getyourguide.com/algarve-l66/lagoa-morgado-do-quintao-estate-lunch-and-wine-tasting-t371286/' + AFF
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
PRACTICE = open(os.path.join(ROOT, 'web/src/data/practice.ts')).read()
for t in ['5 covered bays', '4 covered practice tees', 'Covered hitting bays', 'Indoor studio for teaching and club fitting', 'Foresight golf simulator']:
    assert t in PRACTICE, t

P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}
G = lambda name, slug: f'[{name}](/guide/{slug})'
C = lambda name, slug: f'[{name}](/courses/{slug})'

c = []
c.append(P(f"A wet day doesn't have to mean no golf. The Algarve has indoor golf simulators where you can play a full round or work on your swing, and several clubs have covered practice bays. If you'd rather have a break from golf, there are science centres, museums, an indoor water park and shopping centres with cinemas. Here's what's open when it rains, with prices from the places' own websites. **Last checked: November 2026.**"))
c.append(P(f"First, check whether your round is really off. Rain rarely closes Algarve courses for long, and if the club does close the course, you usually get a rain voucher rather than a refund. Our guide to {G('what happens if it rains on your Algarve golf trip', 'what-happens-if-it-rains-on-your-algarve-golf-trip')} explains each club's rules. For the forecast and weather warnings, the official source is [IPMA](https://www.ipma.pt/en/), Portugal's weather institute."))

c.append(H2("Golf simulators in the Algarve"))
c.append({'type': 'table', 'caption': 'Indoor golf simulators',
  'headers': ['Where', 'What you get', 'Price'],
  'rows': [
    ['[Golf Studio Vilamoura](https://www.golfstudio.pt/), on the N125 at Benfarras, near Vilamoura', 'Private TrackMan bays: play 9 or 18 holes on virtual courses, or practise. Coaching and club fitting', '€29 an hour, plus €9 an hour for each extra player, up to 8 players'],
    ['[Eden Alvor](https://edenalvor.com/booking/simulator-room/), in the centre of Alvor', 'A TrackMan simulator room with more than 500 virtual courses. Clubs free, or bring your own', '€40 an hour for up to 8 people; 2 hours with food and drinks for 4 from €120'],
    [f"{C('Salgados', 'salgados')}, Guia, near Albufeira", 'New indoor simulators at the golf club, with full 18-hole rounds and a lounge with food and drinks', 'Not published; contact the club'],
    [f"{C('Quinta da Ria', 'quinta-da-ria')}, near Tavira", 'A Foresight golf simulator in the Performance Center at the driving range', 'Not published; ask the club'],
  ],
  'note': "Source: each venue's own website, checked November 2026. Golf Studio Vilamoura, Salgados and Quinta da Ria don't publish opening hours, so book or phone ahead."})
c.append(H3("Golf Studio Vilamoura"))
c.append(P("A purpose-built indoor golf studio with private TrackMan bays, on the N125 at Benfarras, near Vilamoura, with private parking. You book by the hour, and you can play full rounds on virtual courses, including the Vilamoura Old Course, which the studio added to its TrackMan library in May 2026, or practise with ball-flight and club data. It's €29 an hour, with €9 an hour added for each extra player and up to 8 players in all. Juniors aged 17 and under get 50% off, and children of 12 and under play free with a paying adult. It also offers lessons, club fitting and indoor competitions. Book online through its website or on +351 912 120 602."))
c.append(H3("Eden Alvor"))
c.append(P("Eden Alvor, the former Golfland in the centre of Alvor, has an indoor TrackMan simulator room where you can play more than 500 of the world's best-known courses or practise with full club and ball data. The room costs €40 an hour for up to 8 people, and clubs are free, or you can bring your own if they're clean. A 2-hour package for 4 players costs €120, including a burger and two drinks each, with €18 for each extra player. Eden is open every day from 10am to 10pm, and you can book on its website or on +351 282 483 447. It's handy if you're staying in Alvor or Portimão, near Alto Golf and Penina."))
c.append(H3("Salgados"))
c.append(P(f"{C('Salgados', 'salgados')} golf club, between Albufeira and Armação de Pêra, has new indoor golf simulators where you can play a full 18-hole round on well-known courses from around the world, with a simulator lounge serving food and drinks. The club doesn't publish prices or opening hours, so contact it through the form on its simulators page or at bookings@salgadosgolf.com."))
c.append(H3("Quinta da Ria"))
c.append(P(f"{C('Quinta da Ria', 'quinta-da-ria')}, near Tavira in the east, has a Foresight golf simulator in the Performance Center at its driving range, which measures ball speed, distance and other shot data. Ask the club about prices and availability."))

c.append(H2("Practise under cover"))
c.append(P("If it's showery rather than pouring, a covered range bay lets you keep hitting balls. Covered bays we know of include:"))
c.append(P(f"**{C('Quinta da Ria', 'quinta-da-ria')}:** 5 covered bays on artificial grass, alongside the 70 grass bays of its 300-metre range."))
c.append(P(f"**{C('Santo António', 'santo-antonio')}:** 4 covered practice tees, next to 10 open-air ones, in the far west near Vila do Bispo."))
c.append(P(f"**Pestana Golf Academy:** covered hitting bays at Pestana's main academy. See the [Pestana Golf Academy](/golf-academies/pestana-golf-academy) page."))
c.append(P(f"A rainy day is also a good time for a lesson or a club fitting indoors. {C('Monte Rei', 'monte-rei')} has an indoor Swing Studio for teaching and fitting, and Golf Studio Vilamoura has a coaching suite. See our guides to [Algarve golf academies](/golf-academies), [driving ranges](/guide/driving-ranges-in-the-algarve) and [golf shops](/shops), several of which offer fitting."))

c.append(H2("Other things to do indoors"))
c.append(H3("Aquashow indoor water park, Quarteira"))
c.append(P(f"A climate-controlled indoor water park with pools, slides and a spa area, close to Vilamoura and Quarteira. It's open every day from 10am to 6pm. Tickets for 2 hours cost €30 for adults aged 13 to 64 and €20 for children aged 6 to 12 and seniors over 65, and 3-hour tickets cost €35 and €25. Children under 12 must be with a paying adult, and the spa is for over-13s. Parking is free. Prices can change, so check the [Aquashow website](https://aquashowpark.com/) before you go. You can also [book Aquashow Indoor tickets on GetYourGuide]({GYG_AQUASHOW})."))
c.append(H3("Science centres in Faro and Lagos"))
c.append(P(f"The **[Centro Ciência Viva do Algarve](https://www.ccvalg.pt/)** in Faro has hands-on science exhibitions and aquariums. Adults pay €5. It's open Tuesday to Sunday from 10am to 1pm and 2pm to 5pm from March to December, and Tuesday to Saturday from 10am to 1pm and 2pm to 6pm in January and February. It's closed on Mondays and on 24, 25 and 31 December and 1 January. Tickets are also sold on [GetYourGuide]({GYG_CCV_FARO})."))
c.append(P("The **[Centro Ciência Viva de Lagos](https://lagos.cienciaviva.pt/)** is a science centre in the middle of Lagos, with activities for visitors of all ages. It's open from 10am to 6pm, Tuesday to Sunday from October to March and every day from April to September, and closed on 24, 25 and 31 December and 1 January. Adults pay €6, children aged 6 to 17 €3, and a family ticket is €15."))
c.append(H3("Museu de Portimão"))
c.append(P("Portimão's museum is in a former canning factory, and its main exhibition, Portimão, Território e Identidade, tells the story of the town and the area around it. From September to July it's open on Tuesdays from 2.30pm to 6pm and from Wednesday to Sunday from 10am to 6pm. It's closed on Mondays and public holidays. A standard ticket is €3. See the [museum website](https://www.museudeportimao.pt/)."))
c.append(H3("Shopping centres and cinemas"))
c.append(P("**[Forum Algarve](https://www.forumalgarve.net/)**, on the edge of Faro and about 5 minutes from the airport, has more than 100 shops, over 20 restaurants and a 5-screen cinema, and is open every day from 10am to 11pm. **[MAR Shopping Algarve](https://www.marshopping.com/algarve/)** in Loulé has shops, the Designer Outlet Algarve, IKEA, restaurants and a cinema. **[AlgarveShopping](https://www.algarveshopping.pt/)** at Guia, near Albufeira and Salgados, has more than 120 shops and restaurants."))
c.append(H3("A wine tasting"))
c.append(P(f"**[Morgado do Quintão](https://morgadodoquintao.pt/en/wine-experiences)**, a wine estate in the Silves area, lists a self-serve Wine Break with a flight of its wines at €30 a person, from 11am to 7pm, and a wine tasting and vineyard tour at 4pm, for over-18s. Both are booked online, and its lunch with wine tasting is also on [GetYourGuide]({GYG_MORGADO}). Its website lists them from Monday to Saturday but also shows the estate closed on Saturdays, so check the day when you book. If you're tasting, leave the car and take a taxi: see our guide to {G('getting around without a car', 'algarve-golf-transfers-without-a-car')}."))
c.append(P(f"If your hotel has a spa or an indoor pool, a rainy afternoon is a good moment to use it. And if you're planning ahead, our guide to {G('the best time to play golf in the Algarve', 'algarve-golf-season-best-time-to-play-golf')} shows which months are wettest."))

c.append(H2("Rainy day in the Algarve: common questions"))
c.append(H3("Are there golf simulators in the Algarve?"))
c.append(P("Yes. Golf Studio Vilamoura has private TrackMan bays from €29 an hour, Eden Alvor has a TrackMan room at €40 an hour for up to 8 people, Salgados golf club has indoor simulators with a lounge, and Quinta da Ria has a Foresight simulator at its driving range."))
c.append(H3("Do you get a refund if it rains on your golf day?"))
c.append(P(f"Not usually. If the course stays open, your booking stands. If the club closes the course, you normally get a rain voucher to play the missed holes another day. See {G('what happens if it rains', 'what-happens-if-it-rains-on-your-algarve-golf-trip')}."))
c.append(H3("What can you do near Faro Airport on a rainy day?"))
c.append(P("Forum Algarve, about 5 minutes from the airport, has shops, restaurants and a cinema, and the Centro Ciência Viva in Faro has science exhibitions and aquariums. MAR Shopping Algarve in Loulé is a short drive away."))

json.dump(c, open(os.path.join(HERE, 'content.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
