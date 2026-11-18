# "The easiest golf courses in the Algarve" (topic #61). Checked 18 Nov 2026:
# - Ratings: FPG national course rating table, re-downloaded 18 Nov 2026 (sources/fpg_all_courses_2026-11-18.html,
#   parsed by parse_fpg.py) = identical to the 9 Nov copy; web/src/data/course-ratings.ts matches it for all 46 loops.
#   Tables below are generated from course-ratings.ts (junior Green/Purple tees excluded).
# - Par and lengths: official scorecards (research/scorecards-2026-11): Ferragudo 5,841 m (card also: handicap 28/36,
#   round max 4h30), Silves 5,592 m (28/36 on card), Benamor 5,497 m (official hole-by-hole page; DB says 5,456),
#   Quinta da Ria 6,053 m, Quinta de Cima 6,586 m, Salgados 6,033 m, Alto 5,432 m; Espiche 5,890 m (fact sheet);
#   Santo António ~5,700 m (no official card; third-party 5,712 m).
# - Handicap limits: Ferragudo + Silves cards 28/36; Benamor online terms 28/36; Salgados site 28/36; Alto card 36/36;
#   Quinta da Ria 36/36 (Robinson page + club FPG form, see verified_course_facts); Quinta de Cima: club publishes none
#   (third parties say 28/36, our DB says 36/36 -> unresolved, not stated); Santo António: none published.
#   No handicap: Pine Cliffs (red tees), Penina Resort, Vale de Milho. Balaia: handicap required, no limit.
# - Walking: web/src/data/walking.ts (sources inside). Vale do Lobo tee rule: valedolobo.golfmanager.com/system/page/condicoes.
import json, os, re, math
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..', '..')
s = open(os.path.join(ROOT, 'web/src/data/course-ratings.ts')).read()
R = {m.group(1): json.loads(m.group(2)) for m in re.finditer(r"^\s*'([a-z0-9-]+)':\s*(\[.*\]),\s*$", s, re.M)}
JUNIOR = {'Green', 'Purple'}
def tees(slug, sex):
    return [t[sex] | {'colour': t['colour'], 'loop': l['name']} for l in R[slug] for t in l['tees'] if t.get(sex) and t['colour'] not in JUNIOR]
def back(slug): return max(tees(slug, 'men'), key=lambda t: (t['slope'], t['cr']))
def rng(slug, sex):
    v = [t['slope'] for t in tees(slug, sex)]
    return f'{min(v)}–{max(v)}' if min(v) != max(v) else str(v[0])
NAMES = {
 'pestana-ferragudo': 'Pestana Ferragudo', 'silves': 'Silves Golf', 'benamor': 'Benamor Golf', 'quinta-da-ria': 'Quinta da Ria',
 'quinta-de-cima': 'Quinta de Cima', 'salgados': 'Salgados Golf', 'santo-antonio': 'Santo António Golf', 'alto-golf': 'Alto Golf',
 'espiche': 'Espiche Golf', 'vilamoura-millennium': 'Vilamoura Millennium'}
order = sorted(NAMES, key=lambda k: (back(k)['slope'], back(k)['cr']))
rows = []
for k in order:
    b = back(k)
    rows.append([f'[{NAMES[k]}](/courses/{k}/slope-rating)', f"**{b['slope']}**", f"{b['cr']} (par {b['par']})", rng(k, 'men'), rng(k, 'women')])

def ch(hi, slope, cr, par): return round(hi * slope / 113 + (cr - par))
fy = [t for t in tees('pestana-ferragudo', 'men') if t['colour'] == 'Yellow'][0]
ex_ferragudo = ch(18, fy['slope'], fy['cr'], fy['par'])
mr = back('monte-rei'); ex_monterei = ch(18, mr['slope'], mr['cr'], mr['par'])
assert (fy['slope'], fy['cr']) == (113, 67.7) and ex_ferragudo == 14 and ex_monterei == 27

P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}
card = lambda k: {'type': 'card', 'refType': 'course', 'slug': k, 'withPhoto': True}
c = []
c.append(P("Which are the **easiest golf courses in the Algarve**? On the official numbers, the course rating and slope rating the Portuguese Golf Federation (FPG) gives every course, the gentlest full-length course is **[Pestana Ferragudo](/courses/pestana-ferragudo)**, with a slope of **118** from its longest tees. [Silves](/courses/silves) (120) and [Benamor](/courses/benamor) (121) come next. But a low slope doesn't always mean an easy day out: some of the lowest-rated courses are among the hilliest in the Algarve, and the tees you play can change the numbers a lot."))
c.append(P("All ratings come from the FPG's national course rating table, which we downloaded again on 18 November 2026 and checked tee by tee against our own data. Clubs re-rate their courses from time to time, so the figures can change."))

c.append(H2("How we ranked them"))
c.append(P("**Slope rating** measures how much harder a course is for an average club golfer than for a scratch golfer, on a scale from 55 to 155, where 113 is standard difficulty. **Course rating** is the score a scratch golfer is expected to shoot. Both depend on the tees, so to compare like with like we use each course's longest men's tees, the same basis as our guide to [the hardest golf courses in the Algarve](/guide/the-hardest-golf-courses-in-the-algarve). The last two columns show the range across all the tees each course has rated, for men and for women."))

c.append(H2("The 10 lowest-rated 18-hole courses in the Algarve"))
c.append({'type': 'table', 'caption': "18-hole Algarve courses with the lowest slope ratings",
  'headers': ['Course', 'Slope, longest tees', 'Course rating', 'Men, all tees', 'Women, all tees'],
  'rows': rows,
  'note': "Source: FPG national course rating table, checked 18 November 2026. Junior tees are not included. Click a course for the ratings of every tee and a course handicap calculator. San Lorenzo (closed until 2028) and the private Els Club are left out."})
c.append(P("Every other 18-hole course in the Algarve is rated 132 or higher from its longest tees. You'll find the full table in [the hardest golf courses in the Algarve](/guide/the-hardest-golf-courses-in-the-algarve)."))

f = back('pestana-ferragudo'); si = back('silves'); be = back('benamor')
c.append(H2("The three easiest full-length courses"))
c.append(H3(f"1. Pestana Ferragudo: slope {f['slope']}"))
c.append(P(f"[Pestana Ferragudo](/courses/pestana-ferragudo), near Ferragudo across the river from Portimão, opened in 2026 and is the newest course in the Algarve. From its white tees it plays 5,841 metres, par 72, with a slope of **{f['slope']}** and a course rating of {f['cr']}, more than a shot under par. From the yellow tees it's rated **113**, exactly standard difficulty. The handicap limit on its scorecard is 28 for men and 36 for ladies."))
c.append(card('pestana-ferragudo'))
c.append(H3(f"2. Silves Golf: slope {si['slope']}"))
c.append(P(f"[Silves Golf](/courses/silves), one of Pestana's courses, is a short par 70 of 5,592 metres from the white tees, with a slope of **{si['slope']}** and a course rating of {si['cr']}. Its scorecard sets a handicap limit of 28 for men and 36 for ladies. The numbers flatter it a little on foot, though: Teetimes.pt describes rolling fairways with more climbing on the back nine and recommends a buggy."))
c.append(H3(f"3. Benamor: slope {be['slope']}"))
c.append(P(f"[Benamor](/courses/benamor) near Tavira, laid out from Sir Henry Cotton's plans, measures 5,497 metres, par 71, from the white tees on the club's own hole-by-hole page, with a slope of **{be['slope']}** and a course rating of {be['cr']}. Its booking terms ask for a handicap of 28 for men and 36 for ladies. Like Silves, it's easier on the scorecard than on the legs: Teetimes.pt calls the fairways very undulating and recommends a buggy."))

c.append(H2("Four more at 128 or 129"))
c.append(P("Four courses sit close behind, and they couldn't be more different:"))
c.append(P("[Quinta da Ria](/courses/quinta-da-ria) (128) near Vila Nova de Cacela is laid out on gently sloping ground running down towards the Ria Formosa, and accepts handicaps up to 36 for men and ladies. Its sister course [Quinta de Cima](/courses/quinta-de-cima) (129) is the longest course on this list at 6,586 metres from the white tees, but also fairly flat. We couldn't find a handicap limit published by the club for Quinta de Cima, so check when you book."))
c.append(P("[Salgados](/courses/salgados) (129) near Albufeira is one of the easiest courses in the Algarve to walk, but it has plenty of water and is exposed to the wind. Its handicap limit is 28 for men and 36 for ladies. [Santo António](/courses/santo-antonio) (129) near Salema is the opposite: the club itself recommends a buggy for its hills, and it doesn't publish a handicap limit."))
c.append(card('salgados'))

c.append(H2("Low slope doesn't always mean easy"))
c.append(P("The slope rating measures how hard it is to score, not how hard it is to get round. Several of the lowest-rated courses are hilly: Teetimes.pt recommends a buggy at Silves and Benamor, and Santo António's own website does too. If you'd rather walk, [Salgados](/courses/salgados), [Quinta da Ria](/courses/quinta-da-ria), [Quinta de Cima](/courses/quinta-de-cima) and [Vilamoura Millennium](/courses/vilamoura-millennium) combine a low slope with gentle terrain. See [Algarve golf courses you can walk](/guide/algarve-golf-courses-you-can-walk) and [the hilliest courses](/guide/hilly-golf-courses-in-the-algarve)."))
c.append(P("Wind and water matter too. A flat seaside course like Salgados can play much harder on a windy day than its rating suggests."))

c.append(H2("Choose your tees, but check the club's rules"))
c.append(P("Moving forward a set of tees can make as much difference as choosing a lower-rated course. At [Vilamoura Millennium](/courses/vilamoura-millennium/slope-rating), for example, the men's slope runs from 130 from the white tees down to 116 from the red tees. Every course on our site has a slope rating page showing all its tees."))
c.append(P("You can't always pick any tee you like, though. Clubs set their own rules: Vale do Lobo's booking conditions, for example, say men play from the yellow tees and ladies from the red, and only players with a handicap of 9 or less may use the white tees, with the starter's permission. Ask which tees you can use when you book."))
c.append(H3("What it means for your handicap"))
c.append(P(f"Under the World Handicap System, your course handicap is your Handicap Index multiplied by the slope and divided by 113, plus the difference between the course rating and par. A golfer with a Handicap Index of 18 gets a course handicap of **{ex_ferragudo}** from the yellow tees at Pestana Ferragudo (slope 113, course rating 67.7, par 72), against **{ex_monterei}** from the longest tees at Monte Rei, the Algarve's hardest course. Each course's slope rating page has a calculator."))

c.append(H2("Easiest to get onto: handicap rules"))
c.append(P("If you don't have a handicap, or yours is high, the rating matters less than the club's rules. Most Algarve courses ask for a handicap certificate, usually up to 28 for men and 36 for ladies. Among the courses in our table, [Alto Golf](/courses/alto-golf) and [Quinta da Ria](/courses/quinta-da-ria) accept handicaps up to 36 for men and ladies. Three courses need no handicap at all: [Penina Resort](/courses/penina-resort), [Vale de Milho](/courses/vale-de-milho) and [Pine Cliffs](/courses/pine-cliffs), where players without a handicap play from the red tees. Our guide to [handicap rules in the Algarve](/guide/do-you-need-a-handicap-to-play-golf-in-the-algarve) has the details for every course."))

c.append(H2("Short courses"))
c.append(P("Some 9-hole courses are rated as two loops of nine. [Balaia](/courses/balaia), a par-3 course near Albufeira, has the lowest slope in the Algarve: 83 to 84 for men. [Pine Cliffs](/courses/pine-cliffs), a 9-hole clifftop course, is rated 102 to 107 for men, and [Penina Resort](/courses/penina-resort) 116 to 122. [Vale de Milho](/courses/vale-de-milho) in Carvoeiro, a 9-hole par-3 course, has no FPG rating. See [the Algarve's 9-hole courses](/algarve-9-hole-courses)."))

c.append(H2("Frequently asked questions"))
c.append(H3("What is the easiest golf course in the Algarve?"))
c.append(P(f"On the official ratings, Pestana Ferragudo is the easiest 18-hole course, with a slope of {f['slope']} from its longest tees and 113 from the yellow tees. Silves ({si['slope']}) and Benamor ({be['slope']}) come next. Among short courses, Balaia, a 9-hole par-3 course, has the lowest slope in the Algarve at 84."))
c.append(H3("Which Algarve golf course is best for beginners?"))
c.append(P("The slope is only part of the answer: handicap rules, terrain and practice facilities matter as much. Our guide to [the best Algarve golf courses for beginners](/guide/the-10-best-algarve-golf-courses-for-beginners) looks at all of them."))
c.append(H3("Is a low slope rating good for a high handicapper?"))
c.append(P("Yes. The lower the slope, the fewer extra shots a higher-handicap golfer is expected to need compared with a scratch player, so your course handicap will be lower and the course should feel more manageable."))
c.append(P("Want to compare courses yourself? Open the [Algarve golf course map](/) to filter by difficulty, price and handicap."))

json.dump(c, open(os.path.join(HERE, 'content.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks'); [print(r) for r in rows]
