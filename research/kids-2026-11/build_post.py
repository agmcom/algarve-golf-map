# "Golf with kids in the Algarve" (topic #63). Built 24 Nov 2026.
# Junior green fees:
# - Online booking engines sampled Oct 2026 (research/prices-2026-10/raw): Vale do Lobo 'Junior U18' €66 (18), €33 (9 / twilight /
#   sunset); Monte Rei 'GF18 Junior' €114-147; Quinta do Lago 'Junior Web (18h)' €140; Vilamoura junior direct rates: Laguna and
#   Millennium €74-114, Pinhal €74-124, Old Course €130-182 (age not stated on the rate).
# - Official price lists: Santo António 2026 (sources/santo_antonio_rates_2026.png): 'Junior (18 & under)' 18 holes €25 special
#   offer / €32.50 public, 9 holes €15 / €22. Benamor green-fees page: 'Juniores' 18 holes €51 high, €47 mid, €36 low (morning),
#   €29 low afternoon; 9 holes €36/€34/€29 (no age given). Pine Cliffs 2026/27 (sources/pinecliffs_price_list_2026-27.png):
#   Junior Visitor 9 holes €50 high / €44 low, 18 holes €69 / €57; juniors up to 17. Vale de Milho fees page: juniors €15 for 9.
#   Balaia 2026-27: under-14 €40 (adult €55). Boavista 2026-27 tariff: under-17s get a discount (amount not published).
#   Pestana, Salgados, Espiche publish no junior rate (Salgados 2026 rates image has none).
# Age rules: Monte Rei rules: under 10 only with an official handicap or a Monte Rei pro's authorisation; up to 17 accompanied by
#   an adult; under 18 can't drive a buggy. Vale do Lobo conditions: under 12 must be accompanied by an adult. Balaia 2026-27:
#   no children under 7; 7-12 with an adult. Buggy driving: QdL and VdL 16+, Monte Rei, Ombria, Boavista, Benamor, Santo António 18+.
# Programmes (official pages read 24 Nov 2026): Quinta do Lago Junior Golf Academy, ages 5-10, Saturdays 10:00-11:30, part of a
#   €100/month multisport academy, not June-August. Vilamoura Golf Academy: summer golf camps for ages 6-18 in July and August;
#   weekly classes for under-21s. Pine Cliffs: 'Golf for Juniors' coaching July-August, Mon-Fri 15:00-17:00; December: one junior
#   (up to 17) at 50% per paying adult; Porto Pirata kids' club 6 months-8 years. Amendoeira: Kidz Club ages 4-12, free, July and
#   August; Junior Golf School (no details). Quinta do Lago Junior Open 27-29 Dec 2026 (events page).
# Simulator: Golf Studio Vilamoura 17 and under 50% off, 12 and under free with a paying adult (rainy-day guide).
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), 'near-hotels-2026-11'))
from near_lib import P, H2, H3, C, G

c = []
c.append(P("Golf in the Algarve works well as a family holiday: there are short courses where children can play without a handicap, academies that run junior lessons and summer camps, and several clubs charge juniors much less than adults. The catch is that the big 18-hole courses have rules on age, handicaps and buggies. This guide brings together what the clubs themselves publish. **Last checked: November 2026.**"))

c.append(H2("The best places to start: short courses"))
c.append(P(f"For young or new golfers, start on a short course. {C('Vale de Milho', 'vale-de-milho')} in Carvoeiro is a 9-hole par-3 course that doesn't ask for a handicap, and juniors pay **€15** for nine holes. At {C('Pine Cliffs', 'pine-cliffs')}, players without a handicap tee off from the red markers, and juniors up to 17 pay €44 to €50 for nine holes. The floodlit Academy course at Amendoeira is aimed at beginners and costs €16 for nine holes online. See {G('the Algarve’s par-3 and pitch and putt courses', 'the-algarve-s-best-par-3-golf-courses')} for all the short courses."))
c.append(P(f"{C('Balaia', 'balaia')} near Albufeira is another short par-3 course, with an under-14 rate of €40, but children under 7 can't play there and 7 to 12-year-olds must play with an adult."))

c.append(H2("Junior green fees"))
c.append({'type': 'table', 'caption': 'Junior rates published by the clubs',
  'headers': ['Course', 'Junior rate', 'Who counts as a junior'],
  'rows': [
    [C('Santo António', 'santo-antonio'), '€25 for 18 holes, €15 for 9 (special offer); public rate €32.50 and €22', '18 and under'],
    [C('Benamor', 'benamor'), '€29 to €51 for 18 holes, €29 to €36 for 9, depending on season and time', 'Not stated'],
    [C('Vale do Lobo Royal', 'vale-do-lobo-royal') + ' and ' + C('Ocean', 'vale-do-lobo-ocean'), '€66 for 18 holes, €33 for 9 or a late-afternoon round (online)', 'Under 18'],
    [C('Pine Cliffs', 'pine-cliffs'), '€44 to €50 for 9 holes, €57 to €69 for 18', 'Up to 17'],
    [C('Vale de Milho', 'vale-de-milho'), '€15 for 9 holes', 'Not stated'],
    [C('Balaia', 'balaia'), '€40', 'Under 14'],
    [f"{C('Vilamoura Laguna', 'vilamoura-laguna')}, {C('Millennium', 'vilamoura-millennium')} and {C('Pinhal', 'vilamoura-pinhal')}", '€74 to €124 for 18 holes (online)', 'Not stated'],
    [C('Monte Rei', 'monte-rei'), '€114 to €147 for 18 holes (online)', 'Not stated'],
    [f"Quinta do Lago ({C('South', 'quinta-do-lago-south')}, {C('North', 'quinta-do-lago-north')}, {C('Laranjal', 'quinta-do-lago-laranjal')})", '€140 for 18 holes (online)', 'Not stated'],
  ],
  'note': "From each club's own price list or online booking, 2026/27 season, checked October and November 2026. Not a complete list: Boavista gives under-17s a discount without publishing the amount, and Pestana's courses, Salgados and Espiche don't publish a junior rate, so ask when you book."})
c.append(P(f"Vale do Lobo's junior rate is one of the best deals on a championship course: €66 for 18 holes, against €116 or more for adults. Santo António, in the far west, is the cheapest junior round we found on an 18-hole course."))

c.append(H2("Age rules on the big courses"))
c.append(P(f"**Minimum ages and supervision.** {C('Monte Rei', 'monte-rei')} only allows children under 10 on the course if they have an official handicap or a Monte Rei professional has approved them, and juniors up to 17 must play with an adult. Vale do Lobo asks for children under 12 to be accompanied by an adult. Balaia doesn't allow children under 7."))
c.append(P(f"**Handicaps.** Most 18-hole courses ask players for a handicap certificate, usually up to 28 for men and 36 for ladies, so check the rules for juniors when you book. If your child doesn't have one yet, stick to Vale de Milho, Pine Cliffs or the Penina Resort Course. See {G('do you need a handicap to play golf in the Algarve?', 'do-you-need-a-handicap-to-play-golf-in-the-algarve')}"))
c.append(P(f"**Driving the buggy.** Teenagers can't drive a buggy everywhere: Quinta do Lago and Vale do Lobo allow it from 16, while Monte Rei, Ombria, Boavista, Benamor and Santo António set 18 as the minimum age. See {G('golf buggy hire in the Algarve', 'golf-buggy-hire-in-the-algarve')}"))

c.append(H2("Junior lessons and camps"))
c.append(P(f"**Vilamoura Golf Academy** runs summer golf camps for 6 to 18-year-olds in July and August, and weekly classes for young golfers under 21."))
c.append(P(f"**Pine Cliffs** has a junior coaching programme in July and August, Monday to Friday from 3pm to 5pm, and in December one junior up to 17 plays at half price with each paying adult."))
c.append(P(f"**Quinta do Lago** runs a Junior Golf Academy for 5 to 10-year-olds on Saturday mornings outside the summer months, and hosts a Junior Open on the Laranjal course from 27 to 29 December 2026."))
c.append(P(f"**Amendoeira** has a Junior Golf School, and its free Kidz Club for 4 to 12-year-olds runs in July and August, which helps if only some of the family play."))
c.append(P(f"For private lessons, most academies teach children too: see [Algarve golf academies](/golf-academies) and {G('golf lessons in the Algarve', 'golf-lessons-in-the-algarve')}."))

c.append(H2("On a rainy day"))
c.append(P(f"Golf Studio Vilamoura's indoor TrackMan simulators give 17 and under 50% off, and children of 12 and under play free with a paying adult. See {G('golf simulators and rainy-day ideas', 'rainy-day-in-the-algarve-golf-simulators-and-indoor-things-to-do')}."))

c.append(H2("Where to stay with children"))
c.append(P(f"Some golf hotels have kids' clubs, so one parent can play while the children are looked after. Pine Cliffs has the Porto Pirata club for children from 6 months to 8 years, and Conrad Algarve and the Dona Filipa Hotel have kids' clubs too. See {G('golf courses near Conrad Algarve', 'golf-courses-near-conrad-algarve')}, {G('golf courses near the Dona Filipa Hotel', 'golf-courses-near-dona-filipa-hotel')} and {G('where to stay in the Algarve for golf', 'where-to-stay-in-the-algarve-for-golf')}."))

c.append(H2("Golf with kids in the Algarve: common questions"))
c.append(H3("Can children play golf in the Algarve without a handicap?"))
c.append(P("Yes, on short courses such as Vale de Milho and Pine Cliffs, and on the Penina Resort Course. Most 18-hole courses ask for a handicap certificate."))
c.append(H3("Which Algarve golf course is cheapest for juniors?"))
c.append(P("Among the courses that publish junior rates, Vale de Milho (€15 for nine holes) and Santo António (€15 for nine or €25 for 18 on its special-offer rate) are the cheapest."))
c.append(H3("Are there junior golf camps in the Algarve?"))
c.append(P("Yes. Vilamoura Golf Academy runs summer camps for 6 to 18-year-olds in July and August, and Pine Cliffs has junior coaching in the summer months."))
c.append(H3("Can a 16-year-old drive a golf buggy in the Algarve?"))
c.append(P("At Quinta do Lago and Vale do Lobo, yes. At Monte Rei, Ombria, Boavista, Benamor and Santo António you have to be 18."))

json.dump(c, open(os.path.join(HERE, 'content.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks')
