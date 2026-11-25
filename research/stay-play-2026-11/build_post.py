# "Stay and play golf in the Algarve" (resort golf packages). Built 24 Nov 2026. Official sources only, read 24 Nov 2026:
# - Vale do Lobo Play & Stay 2025/26 + 2026/27 PDF (sources/vdl_play_stay.pdf/.txt): per person, twin/double, 1-2 bed apartments,
#   breakfast not included (€16 pp/day), cancellation within 30 days = full charge. 2026/27 (1 Nov 2026 - 31 Oct 2027) 3 nights/2
#   rounds €450 (Nov 16-30, Dec, Jan, Feb) to €608 (Sep); 7/5 €1,089-1,467; 1/1 €188-253; split months are NOV and JUN; N/A 16 Jun-Aug (checked on the rendered PDF 25 Nov). Seasonal offers on 3/5/7
#   nights: a round per day + free buggy + TaylorMade set (subject to availability); promotional 1 free in 8 (Dec-Feb), 1 in 16
#   (Mar, Nov). Includes resort shuttle, Well beach club pool, weekly maid service, discounts.
# - Monte Rei packages pages (sources/montereiShort/Retreat/Winter): Short Stay from €577pp, 3 nights 3-bed linked villa, breakfast,
#   2 rounds Monte Rei with shared buggy + practice; Golfers Retreat from €1,242pp 7 nights 4 rounds; both based on 6 guests sharing
#   bedrooms, travel 1 Nov - 31 Dec 2026.
# - Conrad Algarve / Quinta do Lago 'Signature Quinta do Lago Golf Experience - 7 nights' (sources/qdl.txt): from €3,799 for double
#   occupancy, rates vary by season; Deluxe Room, breakfast, 5 rounds on QDL courses, shared buggy or electric trolley, range tokens,
#   transfers Conrad<->courses, 3 dinners at a QDL restaurant, spa thermal area. (Page text also says 'two rounds' in a later
#   paragraph; we use the 'What's included' list: five rounds.)
# - Viceroy at Ombria 'Golf & Wellness Getaway' (sources/ombria_gw.txt + offers list): from €550/night, 3 nights, breakfast, 2 rounds at
#   Ombria (buggy included), spa thermal area, welcome dinner, €100 resort credit. Whether rounds are per person isn't stated.
# - Dom Pedro 'Stay & Play - Vilamoura Golf Experience' (sources/dompedro.txt): Portobelo Vilamoura with breakfast, one round per person
#   per day at Old Course (premium), Millennium, Laguna, Pinhal, 1 free in 8 for groups up to 20, shuttle to courses. Min stays:
#   Nov-Apr 1 night/1 round; May-Oct 3 nights/3 rounds; 4 nights for Thu/Fri/Sat arrivals 1 May - 30 Sep. Price on request.
# - Penina 'Seven Night Golf Package' (sources/penina7.txt): min 7 nights, breakfast, 4 dinners, 5 rounds on any Penina course,
#   trolley + range token daily; max 2 golfers per room; handicap certificate for Championship (men 28, ladies 36). No price shown.
# - Pine Cliffs 'Exclusive Golf Experience' (sources/pinecliffsGolf.txt): all year, code GOF, min 2 nights, Hotel/Residence/Suites;
#   9 holes per person per day, 50 balls/day, 20% off equipment hire, 1 drink/day at clubhouse; golf for max 2 people; room rate.
# - AP Cabanas Beach & Nature golf packages 2027 PDF (sources/ap_golf_2027.pdf/.txt): all-inclusive, per person; 3n/2 GF from €565
#   (twin, 12-28 Feb 2027) to €770 (Jul-Aug); 5n/3 from €945; 7n/5 from €1,355. Rounds at Quinta da Ria/Quinta de Cima + Benamor,
#   Quinta do Vale or Castro Marim. 25% deposit, 75% 45 days before; free cancellation to 45 days.
# - Amendoeira offers page (sources/amendoeira.html): 'Enjoy unlimited golf, special seasonal rates' (offers load dynamically).
# - Pestana Carvoeiro Golf page: guests 'qualify as temporary members and benefit off the price of green fees'.
# Green fees for comparisons: web/scripts/data/prices-2026-27.json (VdL Dec €116; Monte Rei Nov/Dec €190).
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), 'near-hotels-2026-11'))
from near_lib import P, H2, H3, C, G, PRICES

def m(slug, month):
    return [r['price_eur'] for r in PRICES if r['slug'] == slug and r['month'] == month and r['holes'] == 18 and r['time_slot'] == 'standard'][0]
assert m('vale-do-lobo-royal', 12) == 116 and m('monte-rei', 11) == 190 and m('monte-rei', 12) == 190

c = []
c.append(P("A stay and play package puts your room and your golf on one booking, usually at a resort with its own course. Several Algarve resorts sell them directly, from apartments at Vale do Lobo to all-inclusive stays near Tavira. This guide covers packages published on the resorts' own websites, what they include and what they cost, and how to tell whether a package beats booking the hotel and the golf separately. **Last checked: November 2026.**"))

c.append(H2("Stay and play packages at a glance"))
c.append({'type': 'table', 'caption': "Packages on the resorts' own websites",
  'headers': ['Resort', 'Package', 'Golf included', 'Price'],
  'rows': [
    [f"Vale do Lobo ({C('Royal', 'vale-do-lobo-royal')}, {C('Ocean', 'vale-do-lobo-ocean')})", '1 to 7 nights in an apartment', '1 round in 1 night, 2 in 3, 3 in 5 or 5 in 7', 'From €450 per person for 3 nights and 2 rounds'],
    [C('Monte Rei', 'monte-rei'), '3 or 7 nights in a villa, with breakfast', '2 or 4 rounds with a shared buggy', 'From €577 per person (3 nights, 6 sharing a villa)'],
    [f"Conrad Algarve ({C('Quinta do Lago', 'quinta-do-lago-south')})", '7 nights with breakfast and 3 dinners', '5 rounds with a buggy or electric trolley, and transfers', 'From €3,799 (“price for double occupancy”)'],
    [f"Viceroy at Ombria ({C('Ombria', 'ombria')})", '3 nights with breakfast and a dinner', '2 rounds with a buggy', 'From €550 a night'],
    [f"AP Cabanas, Cabanas de Tavira", '3, 5 or 7 nights, all-inclusive', '2 to 5 rounds on nearby courses', 'From €565 per person for 3 nights and 2 rounds'],
    [f"Dom Pedro Portobelo ({C('Vilamoura', 'vilamoura-old-course')})", 'From 1 night with breakfast', '1 round a day on the Vilamoura courses', 'On request'],
    [f"Penina Hotel ({C('Penina', 'penina-championship')})", '3 or 7 nights with breakfast and 2 or 4 dinners', '2 or 5 rounds', 'Not shown on the offer pages'],
    [C('Pine Cliffs', 'pine-cliffs'), 'From 2 nights', '9 holes per person a day', 'Not shown on the offer page (code GOF)'],
  ],
  'note': "Not a complete list. Prices and inclusions from each resort's own website or price list, checked November 2026; the lowest prices are for the cheapest dates and rooms. Prices change with dates and availability, so check with the resort."})

c.append(H2("Vale do Lobo: Play & Stay"))
c.append(P(f"Vale do Lobo publishes a detailed price list. Its Play & Stay package combines a one or two-bedroom apartment with golf at the resort, which has the {C('Royal', 'vale-do-lobo-royal')} and {C('Ocean', 'vale-do-lobo-ocean')} courses. The list doesn't say which course your rounds are on, so ask when you book. For the 2026/27 season, prices per person sharing are:"))
c.append({'type': 'table', 'caption': 'Vale do Lobo Play & Stay, 2026/27 (per person, sharing)',
  'headers': ['Nights / rounds', '16 Nov to Feb', 'March', 'April and May', '1 to 15 June', 'September', 'October'],
  'rows': [
    ['1 night / 1 round', '€188', '€215', '€237', '€230', '€250', '€253'],
    ['3 nights / 2 rounds', '€450', '€503', '€558', '€569', '€608', '€591'],
    ['5 nights / 3 rounds', '€712', '€791', '€880', '€908', '€967', '€928'],
    ['7 nights / 5 rounds', '€1,089', '€1,221', '€1,353', '€1,369', '€1,467', '€1,434'],
  ],
  'note': "From the club's Play & Stay price list for 1 November 2026 to 31 October 2027. 1 to 15 November costs the same as March. No price is listed from 16 June to the end of August."})
c.append(P("Breakfast isn't included (it's €16 per person a day), and cancelling within 30 days of arrival costs the full price. The package includes the resort shuttle, access to the beach club pools (weather permitting) and discounts around the resort. On 3, 5 and 7-night stays the price list also offers seasonal extras, such as a round every day with a free buggy and a TaylorMade set, and group deals of one free place in eight from December to February, all subject to availability. Ask the golf reception which ones apply to your dates."))

c.append(H2("Monte Rei: Short Stay and Golfers Retreat"))
c.append(P(f"{C('Monte Rei', 'monte-rei')}, in the far east of the Algarve, sells packages in its villas. The **Short Stay** is three nights in a three-bedroom linked villa with breakfast and two rounds with a shared buggy, from **€577 per person**. The **Golfers Retreat** is seven nights with four rounds, from **€1,242 per person**. Both prices are based on six guests sharing bedrooms in the villa, for travel from 1 November 2026 to 31 December (the page doesn't give the year of the end date). Both include the practice facilities, the heated pool, the gym, the sauna and the steam rooms. See {G('hotels near Monte Rei', 'hotels-near-monte-rei-golf')} for other places to stay."))

c.append(H2("Conrad Algarve and Quinta do Lago: Signature Golf Experience"))
c.append(P(f"At the top end, Conrad Algarve and Quinta do Lago sell a seven-night package from **€3,799**, with rates that vary by season. The page calls this the “price for double occupancy”, so check whether it's per person or for the room. It includes a Deluxe Room with breakfast, five rounds on the Quinta do Lago courses ({C('South', 'quinta-do-lago-south')}, {C('North', 'quinta-do-lago-north')} and {C('Laranjal', 'quinta-do-lago-laranjal')}) with a shared buggy or electric trolley, five days of driving-range warm-up, transfers between the hotel and the courses, three dinners at a Quinta do Lago restaurant, and access to the spa's thermal area. See {G('golf courses near Conrad Algarve', 'golf-courses-near-conrad-algarve')}."))

c.append(H2("Viceroy at Ombria: Golf & Wellness Getaway"))
c.append(P(f"In the hills north of Loulé, Viceroy at Ombria has a three-night **Golf & Wellness Getaway** from **€550 a night**, with breakfast, two rounds at {C('Ombria', 'ombria')} with a buggy, access to the spa's thermal area, a welcome dinner and €100 of resort credit. The offer doesn't say whether the two rounds are per person or per room, so ask when you book."))

c.append(H2("AP Cabanas, near Tavira: all-inclusive golf packages"))
c.append(P(f"AP Cabanas Beach & Nature, in Cabanas de Tavira, sells all-inclusive packages with rounds on the courses nearby. Three nights with two rounds start at **€565 per person** sharing a room (12 to 28 February 2027) and reach €770 in July and August. One round is at {C('Quinta da Ria', 'quinta-da-ria')} or {C('Quinta de Cima', 'quinta-de-cima')}, and the other at {C('Benamor', 'benamor')}, {C('Quinta do Vale', 'quinta-do-vale')} or {C('Castro Marim', 'castro-marim')}. Five nights with three rounds start at €945, and seven nights with five rounds at €1,355. You pay 25% when you book and the rest 45 days before arrival. See {G('all-inclusive golf hotels in the Algarve', 'all-inclusive-golf-hotels-in-the-algarve')}."))

c.append(H2("Dom Pedro, Vilamoura: Vilamoura Golf Experience"))
c.append(P(f"Dom Pedro sells a stay and play package at its Portobelo hotel near the marina: breakfast, one round per person per day on the {C('Old Course', 'vilamoura-old-course')}, {C('Millennium', 'vilamoura-millennium')}, {C('Laguna', 'vilamoura-laguna')} or {C('Pinhal', 'vilamoura-pinhal')}, and a shuttle to the courses. From November to April you can book from one night, and from May to October from three nights (four for arrivals from Thursday to Saturday between 1 May and 30 September). Groups of up to 20 get one free place in eight. Prices depend on the dates and courses, so you have to ask for a quote."))

c.append(H2("Penina: three and seven-night golf packages"))
c.append(P(f"Penina Hotel & Golf Resort, near Portimão, has two golf packages with breakfast and a trolley and range token each day: at least three nights with two dinners and two rounds, or at least seven nights with four dinners and five rounds. These are per person, and the rounds can be on any of its courses. Golf is included for up to two golfers per room, and to play the {C('Championship course', 'penina-championship')} you need a handicap certificate (up to 28 for men and 36 for ladies). The offer pages don't show a price, so ask the hotel or check its booking page."))

c.append(H2("Pine Cliffs: Exclusive Golf Experience"))
c.append(P(f"For something shorter, Pine Cliffs Resort near Albufeira runs an offer all year: stay at least two nights at the Pine Cliffs Hotel, Residence or Suites and each guest gets a 9-hole round on the {C('Pine Cliffs', 'pine-cliffs')} clifftop course every day, 50 practice balls a day, 20% off club hire and a drink at the clubhouse. Golf is included for up to two people per room. Book with the promotional code GOF."))

c.append(H2("Other resorts"))
c.append(P(f"Amendoeira Golf Resort mentions unlimited golf and seasonal rates on its offers page; ask the resort for the current offers at {C('Faldo', 'amendoeira-faldo')} and {C('O’Connor', 'amendoeira-oconnor')}. We couldn't find a current golf package on the Pestana pages we checked, but the group says guests at Pestana Carvoeiro Golf count as temporary members and get reduced green fees. Tour operators also sell stay and play holidays with flights included; compare what they include with the resort's own offer."))

c.append(H2("Is a package cheaper than booking separately?"))
c.append(P(f"It depends on your dates, so do the sum for your own trip: take the package price, subtract what the same rounds would cost, and compare what's left with the price of the accommodation on its own. Here are two examples using the prices above:"))
c.append(P(f"**Vale do Lobo in December.** Three nights and two rounds cost €450 per person. Two rounds at the resort's December online rate of €116 come to €232, which leaves €218 each for three nights in an apartment, or about €145 a night for two people sharing. Compare that with the price of an apartment on your dates, and remember that breakfast is extra."))
c.append(P(f"**Monte Rei in November or December.** The Short Stay costs €577 per person. Two rounds at the online rate of €190, which lists a buggy, come to €380. That leaves €197 each for three nights in a villa with breakfast, but the price is based on six people sharing."))
c.append(P(f"A package makes less sense if you want to play different courses each day, or if the golf included isn't what you'd choose. Pine Cliffs, for instance, includes nine holes, not 18. See {G('how much a golf trip to the Algarve costs', 'how-much-does-a-golf-trip-to-the-algarve-cost')} and {G('best value golf in the Algarve', 'best-value-golf-in-the-algarve')} to compare."))

c.append(H2("What to check before you book"))
c.append(P("**Per person or per room.** Some prices are per person sharing and others per room or per night. Some offers limit golf to two players per room."))
c.append(P(f"**Buggy and extras.** Vale do Lobo's seasonal extras and the Monte Rei and Ombria packages include a buggy, and the Conrad package a shared buggy or an electric trolley. If a package doesn't mention one, ask. See {G('golf buggy hire in the Algarve', 'golf-buggy-hire-in-the-algarve')}."))
c.append(P("**Handicap.** The package doesn't change the club's handicap rules. Penina, for example, asks for a certificate on its Championship course."))
c.append(P("**Tee times.** Several packages say rounds are subject to availability, so book your tee times as soon as the stay is confirmed."))
c.append(P("**Cancellation.** Read the terms before you pay: Vale do Lobo charges the full price within 30 days, and AP Cabanas charges 25% from 45 days before arrival and the full price within 15 days."))

c.append(H2("Stay and play in the Algarve: common questions"))
c.append(H3("What is a stay and play golf package?"))
c.append(P("A package that combines your accommodation with a set number of rounds of golf, booked together, usually at a resort with its own course."))
c.append(H3("What is the cheapest stay and play package in the Algarve?"))
c.append(P("Among the packages with published prices, Vale do Lobo's Play & Stay has the lowest per-person price in this guide: from €188 for one night and one round, or €450 for three nights and two rounds in winter, without breakfast."))
c.append(H3("Is there a stay and play package in Vilamoura?"))
c.append(P("Yes. Dom Pedro's Vilamoura Golf Experience includes a stay at its Portobelo hotel and one round a day on the Vilamoura courses. Prices are on request."))
c.append(H3("Are there all-inclusive stay and play packages?"))
c.append(P("Yes. AP Cabanas, near Tavira, sells all-inclusive packages with rounds at Quinta da Ria, Quinta de Cima and other courses in the east, from €565 per person for three nights and two rounds."))

json.dump(c, open(os.path.join(HERE, 'content.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
