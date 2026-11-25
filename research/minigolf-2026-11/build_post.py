# "Mini golf in the Algarve" (topic #92). Built 25 Nov 2026. DRAFT until user approves. Official pages read 25 Nov 2026 (sources/):
# - familygolfpark.pt: closed for maintenance, reopens 1 Feb 2027; two 18-hole courses (Via Áppia crazy golf, Via Lusitânia); prices page: adult
#   €18.50 / €19.50 two courses, junior 6-12 €14.50 / €15.50, one child 0-5 free per adult; 15% off online; seasonal hours (no year shown).
# - edenalvor.com: 18 holes, adult (13+) €13, child 5-12 €8, under 5 free, family 2+2 €35; contact page: open daily 10:00-22:00.
# - proputtinggarden.com: 9-hole junior course + 18-hole course; fees €3/8, €5/12, €4/10; last ticket by month.
# - quintadolago.com/en/golf/mini-golf: replicas of Augusta, Belfry, Sawgrass; hours shown 'Sunday to Thursday 9:00-17:30'; price not shown.
# - yardvdl.pt (partee.pt redirects there): mini golf at The Yard, Vale do Lobo; no price or mini golf hours. 18 holes by the sea = myguidealgarve listing.
# - krazyworld.com (planeia-o-teu-dia): 18-hole mini golf included in park entry; no ticket price/season in the page text.
# - Albufeira: own site (albufeiraminigolf.com) doesn't resolve -> GetYourGuide listing only (search results; site blocks automated reading).
# - Footgolf: algarvetennisandfitness.com says the club closed 17 Jun 2026. Penina footgolf brochure (dated 2025, linked from penina.com menu).
# - Vilamoura GetYourGuide link (t390162) removed: didn't open for the user on 25 Nov 2026 (park closed to 1 Feb 2027); recheck in February.
# - Hotels: facts from our own published hotel guides. GetYourGuide URLs come from search results.
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), 'near-hotels-2026-11'))
from near_lib import P, H2, H3, C, G
AFF = '?partner_id=L3NSZHI&utm_medium=platforms_and_communities&cmp=golf'
Y = lambda t, p: f'[{t}](https://www.getyourguide.com/{p}{AFF})'
ALB = Y('tickets on GetYourGuide', 'algarve-l66/albufeira-minigolf-adventure-park-t393303/')
ALV = Y('tickets on GetYourGuide', 'alvor-l2936/mini-golf-alvor-fun-for-eveveryone-t1113437/')
KRZ = Y('tickets on GetYourGuide', 'algarve-l66/algoz-entree-au-zoo-et-au-parc-d-activite-t192390/')
c = []
c.append(P("There's mini golf in several of the Algarve's main resorts, from a Roman-themed park in Vilamoura to a tropical garden in Alvor. This guide covers where to play, with prices and opening times from the venues' own websites where they publish them, plus footgolf. Two things to know before you go: **Family Golf Park in Vilamoura is closed until 1 February 2027**, and the footgolf club near Vale do Lobo has closed. **Last checked: 25 November 2026.**"))
c.append(H2("Mini golf in the Algarve at a glance"))
c.append({'type': 'table', 'caption': 'Where to play mini golf', 'headers': ['Venue', 'Where', 'Course', 'Adult price', 'Good to know'], 'rows': [
 ['Family Golf Park', 'Vilamoura', 'Two 18-hole courses', '€18.50 one course, €19.50 both', 'Closed until 1 February 2027'],
 ['MiniGolf Adventure Park', 'Albufeira', 'Ask the venue', 'See the booking page', 'Check opening times before you go'],
 ['Eden Alvor', 'Alvor', '18 holes', '€13', 'Daily, 10am to 10pm'],
 ['Pro Putting Garden', 'Lagos', '9-hole junior course and 18 holes', '€5 for 9, €12 for 18', 'Daily from 10am'],
 ['Quinta do Lago Mini Golf', 'Quinta do Lago', 'Copies of famous golf holes', 'Not shown on its page', 'Check Friday and Saturday hours'],
 ['The Yard', 'Vale do Lobo', 'Mini golf with a bar and grill', 'Not shown on its page', 'Contact the venue'],
 ['Krazy World', 'Algoz', '18 holes inside a family park', 'Included with park entry', 'Check the season and ticket price'],
], 'note': "Not a complete list. Prices and opening times from the venues' own websites, November 2026, and they can change with the season. We may earn a commission if you book through our GetYourGuide links."})

c.append(H2("Mini golf in Vilamoura: Family Golf Park"))
c.append(P("Family Golf Park has two 18-hole courses in landscaped gardens: **Via Áppia**, a crazy golf course about the Roman Empire, and **Via Lusitânia**, about the Romans in the Iberian Peninsula. An adult pays €18.50 for one course or €19.50 for both, and juniors aged 6 to 12 pay €14.50 or €15.50. One child aged up to 5 plays free with each paying adult, and the park takes 15% off online. If you buy both courses, you can play the second within 15 days."))
c.append(P(f"The park's website says it's closed for maintenance and reopens on **1 February 2027**. Its price page lists opening hours of 10am to 6pm in February and March and 10am to 7pm from April to June, with late opening in July and August, although the page doesn't give a year. The last entry for 18 holes is an hour and a half before closing. See [the park's prices](https://familygolfpark.pt/prices/)."))
c.append(H2("Mini golf in Albufeira: MiniGolf Adventure Park"))
c.append(P(f"The mini golf in Albufeira is on Rua de Dunfermline. We couldn't open the park's own website, so check prices and opening times before you go: see {ALB}."))
c.append(H2("Mini golf in Alvor: Eden Alvor"))
c.append(P(f"Eden Alvor has an 18-hole course in a tropical garden with more than 2,000 plants and animated characters including King Kong and Baz the Talking Tree. A round takes about 45 minutes. Adults and teenagers from 13 pay **€13**, children from 5 to 12 pay €8 and under-fives play free. A family ticket for two adults and two children costs **€35**. Eden Alvor opens daily from 10am to 10pm and has a restaurant, a spa and a golf simulator. See [Eden Alvor's price list](https://edenalvor.com/price-list/) or {ALV}."))
c.append(H2("Mini golf in Lagos: Pro Putting Garden"))
c.append(P("Pro Putting Garden is by the city walls, about three minutes on foot from the centre of Lagos, with parking. It has a 9-hole junior course and a full 18-hole course for more serious putting. Adults pay €5 for 9 holes or **€12 for 18**, children up to 12 pay €3 or €8, and over-65s pay €4 or €10. It opens daily at 10am, with the last ticket at 5pm in November, December, January and February, 8pm in March to May and October, 9pm in June and September and 10pm in July and August. See [Pro Putting Garden](https://www.proputtinggarden.com/green-fee)."))
c.append(H2("Mini golf in Quinta do Lago and Vale do Lobo"))
c.append(P(f"**Quinta do Lago Mini Golf** has miniature versions of famous holes from courses such as Augusta, The Belfry and Sawgrass, opposite the driving range. Its page lists opening times of 9am to 5.30pm from Sunday to Thursday, and doesn't mention Friday or Saturday, so check before you go: see [Quinta do Lago Mini Golf](https://www.quintadolago.com/en/golf/mini-golf/). It's an easy stop after a round on the {C('Quinta do Lago courses', 'quinta-do-lago-south')}."))
c.append(P("**The Yard** in Vale do Lobo combines mini golf with a beer garden and grill. Its website doesn't show mini golf prices, so contact [The Yard](https://yardvdl.pt/) first."))
c.append(H2("Mini golf at Krazy World, Algoz"))
c.append(P(f"Krazy World, a family park with animals and pools in Algoz, includes its 18-hole mini golf with park entry. Opening depends on the season, so check the [park's website](https://krazyworld.com/planeia-o-teu-dia/) or {KRZ}."))
c.append(H2("Mini golf in Carvoeiro, Tavira and other towns"))
c.append(P("We didn't find a public mini golf course with an up-to-date website in Carvoeiro or Tavira. From Carvoeiro, Krazy World in Algoz and Eden Alvor are two options."))
c.append(H2("Hotels with mini golf"))
c.append(P(f"Some hotels have a mini golf course for guests. Vila Vita Parc lists an 18-hole mini golf course among its resort facilities, and Pestana Alvor Praia and Martinhal Quinta do Lago have mini golf too. Tivoli Alvor has one for children in its junior club. Ask the hotel about access and charges. See {G('golf courses near Vila Vita Parc', 'golf-courses-near-vila-vita-parc')}, {G('near Pestana Alvor Praia', 'golf-courses-near-pestana-alvor-praia')} and {G('near Tivoli Alvor', 'golf-courses-near-tivoli-alvor')}."))
c.append(H2("Footgolf in the Algarve"))
c.append(P(f"**Penina** in Portimão has a footgolf course. Its brochure, dated 2025, lists €15 for 9 holes, €20 for 18 and €2 to hire a ball, with play after 2pm in winter and after 4pm in summer, booked in advance. There's a dress code: a collared polo shirt, shorts, high socks and football boots without high studs or trainers; swimming trunks and jeans aren't allowed. Check the current price with {C('Penina', 'penina-resort')}."))
c.append(P("**The Algarve Tennis & Fitness Club footgolf course near Vale do Lobo has closed.** The club's website says it shut on 17 June 2026, although some guides still list it."))
c.append(H2("More golf for families"))
c.append(P(f"Want to try the real thing? See {G('golf with kids in the Algarve', 'golf-with-kids-in-the-algarve')}, {G('par-3 and pitch and putt courses', 'the-algarve-s-best-par-3-golf-courses')} and {G('golf simulators and rainy-day ideas', 'rainy-day-in-the-algarve-golf-simulators-and-indoor-things-to-do')}."))
c.append(H2("Mini golf in the Algarve: common questions"))
c.append(H3("Is mini golf in Vilamoura open in winter?"))
c.append(P("Not this winter until February: Family Golf Park says it's closed for maintenance and reopens on 1 February 2027."))
c.append(H3("How much does mini golf cost in the Algarve?"))
c.append(P("At the venues that publish prices, an adult pays from €12 to €18.50 for 18 holes: €12 at Pro Putting Garden in Lagos, €13 at Eden Alvor and €18.50 at Family Golf Park in Vilamoura."))
c.append(H3("Where can I play mini golf in the evening?"))
c.append(P("Eden Alvor opens until 10pm every day. In July and August, Pro Putting Garden sells its last ticket at 10pm and Family Golf Park's price page lists opening until midnight or 1am."))
c.append(H3("Where can I play footgolf in the Algarve?"))
c.append(P("Penina Hotel & Golf Resort lists footgolf, by prior booking. The course at Algarve Tennis & Fitness Club, near Vale do Lobo, has closed."))
json.dump(c, open(os.path.join(HERE, 'content.json'), 'w'), ensure_ascii=False, indent=1); print(len(c), 'blocks')
if '--save' in sys.argv:
    from near_lib import save_draft
    print(save_draft('mini-golf-in-the-algarve', 'Mini golf in the Algarve: where to play and what it costs', "Mini golf and crazy golf in Vilamoura, Albufeira, Alvor, Lagos and more, with prices, opening times and what's closed, plus footgolf.", c,
      os.path.join(HERE, 'hero.jpg'), 'Colourful mini golf putters around a hole', 'Mini golf in the Algarve: Vilamoura, Albufeira, Alvor, Lagos',
      "Mini golf and crazy golf in the Algarve: prices and opening times in Vilamoura, Alvor, Lagos, Albufeira and more, what's closed this winter, and footgolf."))
