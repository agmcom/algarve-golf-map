"""Update guide-post prose/tables after Pestana raised prices (checked 18 Nov 2026).
Old -> new: Gramacho/V.Pinta/Silves 93/145/167 -> 95/155/180; Alto 73/109/131 -> 75/115/140;
Vila Sol 130/182/200 -> 140/195/215; Ferragudo unchanged 130/200/230.
Twilight: Alto 45->50, Gramacho/VdP/Silves 50->55, Ferragudo 60->80 (from 13:30), Vila Sol 60.
2-player + buggy special: Jun-Aug Alto 154, G/VdP/S 184, Vila Sol 208, Ferragudo 220;
16-30 May & Sep: Alto 220, G/VdP/S 270, Vila Sol 300, Ferragudo 310.
Usage: python3 fix_posts.py posts.json [--apply]   (posts.json = dump of guide_posts with id,slug,content)
"""
import json, sys, os, urllib.request
posts = {r['slug']: r for r in json.load(open(sys.argv[1]))}
APPLY = '--apply' in sys.argv
ALTO = {1:2,2:6,3:9,4:9,5:6,6:2,7:2,8:2,9:6,10:9,11:6,12:2}  # Alto delta by month
MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
def eur(n): return f'€{n:,}'
def bump(cell, delta):
    if not cell.startswith('from €'): return cell
    return 'from ' + eur(int(cell[6:].replace(',', '')) + delta)

TW4 = "[Gramacho](/courses/gramacho), [Vale da Pinta](/courses/vale-da-pinta) and [Silves](/courses/silves)"
R = {  # slug: [(block, old, new)]  — plain text replacements inside paragraph/heading text or table cells
 'cheapest-golf-near-albufeira': [(3, '€130', '€140')],
 'cheapest-golf-in-vilamoura': [(4, '€130', '€140'), (4, '€200', '€215'),
   (10, "starts at €130", "starts at €140"),
   (10, "costs €182 from June to August, which is **€91 each** with the buggy included, or €265 for two from 16 to 31 May and in September", "costs €208 from June to August, which is **€104 each** with the buggy included, or €300 for two from 16 to 30 May and in September")],
 'algarve-golf-season-best-time-to-play-golf': [(1, "about €93 in the low season against €167 at peak", "about €95 in the low season against €180 at peak")],
 'gramacho-vs-vale-da-pinta-which-pestana-carvoeiro-course-should-you-play': [(12, "**€93**", "**€95**")],
 'silves-vs-pestana-ferragudo-the-established-course-and-the-brand-new-one': [(10, "**€93**", "**€95**")],
 'hotels-near-ferragudo-golf-course': [(28, "Twilight rounds from 15:30 cost €60", "Twilight rounds from 13:30 cost €80")],
 'vila-sol-vs-vilamoura-old-course-which-should-you-play': [(7, "**€130** in December, January and June to August, €182 in most spring and autumn months and €200 at peak", "**€140** in December, January and June to August, €195 in most spring and autumn months and €215 at peak")],
 'west-vs-east-algarve-which-side-is-better-for-golf': [(7, "the cheapest 18-hole round in the area from €73", "the cheapest 18-hole round in the area from €75")],
 'the-cheapest-golf-courses-in-the-algarve': [
   (15, "costs **€73** in December, January and June to August, €109 in November, February, May and September, and €131 in March, April and October. Twilight rounds from 3pm are only €45.", "costs **€75** in December, January and June to August, €115 in November, February, May and September, and €140 in March, April and October. Twilight rounds from 3pm are only €50."),
   (14, "5. Alto Golf, Alvor: from €73", "6. Alto Golf, Alvor: from €75"),
   (16, "6. Boavista, Lagos: from €74", "5. Boavista, Lagos: from €74"),
   (35, "**€35 at Santo António** (from 1:30pm), **€45 at Alto Golf** (from 3pm), **€47 at Salgados**, **€50 at Pestana's " + TW4 + "**, and **€54 at Espiche** in summer. Even Pestana's [Vila Sol](/courses/vila-sol) and the new [Pestana Ferragudo](/courses/pestana-ferragudo), which start at €130 for a standard round, offer twilight for €60.",
        "**€35 at Santo António** (from 1:30pm), **€47 at Salgados**, **€50 at Alto Golf** (from 3pm), **€54 at Espiche** in summer and **€55 at Pestana's " + TW4 + "**. Pestana's [Vila Sol](/courses/vila-sol) and the new [Pestana Ferragudo](/courses/pestana-ferragudo), which start at €140 and €130 for a standard round, offer twilight for €60 and €80. Our [twilight golf guide](/guide/twilight-golf-in-the-algarve) has the start times and how much daylight you get each month.")],
 'alto-golf-vs-penina-championship-which-portimao-course-should-you-play': [(9, "**€73** in December, January and June to August, €109 in November, February, May and September, and €131 in March, April and October. Twilight rounds from 3pm are €45", "**€75** in December, January and June to August, €115 in November, February, May and September, and €140 in March, April and October. Twilight rounds from 3pm are €50")],
 'hotels-near-silves-golf': [(23, "**€93** in December, January and June to August, rising to €167 at peak, with twilight rounds for €50", "**€95** in December, January and June to August, rising to €180 at peak, with twilight rounds for €55")],
 'hotels-near-pestana-carvoeiro-golf': [
   (26, "**€93 for 18 holes in low season** (December, January and June to August), €145 in high season (November, February, May and September) and €167 in premium season (March, April and October). Twilight rounds from 3.30pm cost €50, and a buggy is €55. The Gramacho course page shows lower seasonal rates, so check the price when you book.", "**€95 for 18 holes in low season** (December, January and June to August), €155 in high season (November, February, May and September) and €180 in premium season (March, April and October). Twilight rounds from 3.30pm cost €55, and a buggy is €55."),
   (27, "two players with a shared buggy from €44 each, also valid at Silves Golf", "two players with a shared buggy for €184 from June to August (€92 each), also valid at Silves Golf")],
 'where-to-stay-in-the-algarve-for-golf': [],  # handled below (row-specific)
 'best-value-golf-in-the-algarve': [
   (9, "In every case, it costs less than two green fees on their own, so the buggy effectively comes free and you save on top.", "In every case it costs less than two green fees plus a buggy, and at most courses less than two green fees on their own, so the buggy effectively comes free."),
   (11, "two standard green fees at Gramacho cost €186 from June to August, before you add a €55 buggy. The special is €160 for both of you with the buggy. In the second half of May and in September, two green fees cost €290 against a special of €234.", "two standard green fees at Gramacho cost €190 from June to August, before you add a €55 buggy. The special is €184 for both of you with the buggy. In the second half of May and in September, two green fees cost €310 against a special of €270. At Alto Golf in summer the special is €4 more than two green fees, but it includes the €55 buggy."),
   (23, "costs from €130, or €91 each with Pestana's summer special for two", "costs from €140, or €104 each with Pestana's summer special for two"),
   (32, "Pestana's are €45 to €60 from 3pm or 3:30pm, with a twilight buggy at €40", "Pestana's are €50 to €80, from 1:30pm at Ferragudo and 3pm or 3:30pm at its other courses, with a twilight buggy at €40. See our [twilight golf guide](/guide/twilight-golf-in-the-algarve)")],
 'how-much-does-a-golf-trip-to-the-algarve-cost': [
   (0, "**from about €711 to €1,752 per person**", "**from about €713 to €1,752 per person**"),
   (10, "Value trip: from about €711 per person", "Value trip: from about €713 per person"),
   (32, "cost €311 in January and €495 in April", "cost €313 in January and €504 in April"),
   (33, "a twilight rate of €45 from 15:00, against €73 to €131", "a twilight rate of €50 from 15:00, against €75 to €140")],
 'how-much-does-a-golf-trip-to-lagos-and-portimao-cost': [
   (10, "more than €131 a round", "more than €140 a round"),
   (28, "a twilight rate at Alto Golf of €45 from 15:00, against €73 to €131", "a twilight rate at Alto Golf of €50 from 15:00, against €75 to €140")],
}
# Monthly posts: Gramacho/Alto table rows + twilight prose
MONTH_TW = {}
for i, m in enumerate(MONTHS, 1):
    R.setdefault(f'algarve-golf-in-{m.lower()}', [])
REPL_ANY = [  # applied to every block of the monthly posts
 ("€35 at Santo António, €45 at Alto Golf and €47 at [Salgados](/courses/salgados), and €50 at Pestana's [Gramacho](/courses/gramacho) and [Silves](/courses/silves)",
  "€35 at Santo António, €47 at [Salgados](/courses/salgados) and €50 at Alto Golf, and €55 at Pestana's [Gramacho](/courses/gramacho) and [Silves](/courses/silves)"),
 ("€35 at Santo António, €45 at Alto Golf and €47 at [Salgados](/courses/salgados), and Pestana's [Gramacho](/courses/gramacho) and [Silves](/courses/silves) courses offer them at €50",
  "€35 at Santo António, €47 at [Salgados](/courses/salgados) and €50 at Alto Golf, and Pestana's [Gramacho](/courses/gramacho) and [Silves](/courses/silves) courses offer them at €55"),
 ("€35 at Santo António and €45 at Alto Golf, and Pestana's " + TW4 + " courses offer them at €50", "€35 at Santo António and €50 at Alto Golf, and Pestana's " + TW4 + " courses offer them at €55"),
 ("€35 at Santo António and €45 at Alto Golf, and €50 at Pestana's " + TW4, "€35 at Santo António and €50 at Alto Golf, and €55 at Pestana's " + TW4),
 ("€35 at Santo António and €45 at Alto Golf this March, and €50 at Pestana's " + TW4, "€35 at Santo António and €50 at Alto Golf this March, and €55 at Pestana's " + TW4),
 ("Gramacho to €93, from €145", "Gramacho to €95, from €155"),
 ("Gramacho costs €93 against €167 in spring", "Gramacho costs €95 against €180 in spring"),
 ("Gramacho charges €145 in May against €167 in March and April", "Gramacho charges €155 in May against €180 in March and April"),
]
GRAM = {1:95,2:155,3:180,4:180,5:155,6:95,7:95,8:95,9:155,10:180,11:155,12:95}
ALTOP = {1:75,2:115,3:140,4:140,5:115,6:75,7:75,8:75,9:115,10:140,11:115,12:75}

changed = {}
def touch(slug): changed[slug] = posts[slug]
problems = []
for slug, reps in R.items():
    if slug not in posts: problems.append(('missing post', slug)); continue
    c = posts[slug]['content']
    for bi, old, new in reps:
        b = c[bi]
        if b['type'] == 'table':
            hit = False
            for row in b['rows']:
                for j, cell in enumerate(row):
                    if cell == old and not hit: row[j] = new; hit = True
            if not hit: problems.append((slug, bi, old[:50]))
        else:
            if b['text'].count(old) != 1: problems.append((slug, bi, old[:60])); continue
            b['text'] = b['text'].replace(old, new)
        touch(slug)
    if slug.startswith('algarve-golf-in-'):
        mi = MONTHS.index(slug.split('-')[-1].capitalize()) + 1
        for b in c:
            if b['type'] in ('paragraph', 'heading'):
                for old, new in REPL_ANY:
                    if old in b['text']: b['text'] = b['text'].replace(old, new); touch(slug)
            if b['type'] == 'table':
                for row in b['rows']:
                    if row[0].startswith('[Gramacho]'):
                        row[2], row[3] = f'€{GRAM[mi]}', '€95–€180'; touch(slug)
                    if row[0].startswith('[Alto Golf]'):
                        row[2], row[3] = f'€{ALTOP[mi]}', '€75–€140'; touch(slug)

# Cheapest-courses ranking: Boavista (€74) now ranks above Alto (€75): swap heading+paragraph pairs 14-15 and 16-17
c = posts['the-cheapest-golf-courses-in-the-algarve']['content']
assert c[14]['text'].startswith('6. Alto') and c[16]['text'].startswith('5. Boavista')
c[14:18] = [c[16], c[17], c[14], c[15]]

# Best value: buggy table (sorted by green fee + buggy) and special table, area table
c = posts['best-value-golf-in-the-algarve']['content']
rows = c[4]['rows']
for r in rows:
    if r[0] == '[Alto Golf](/courses/alto-golf)': r[1], r[3] = '€75', '€130'
    if r[0].startswith('[Gramacho]'): r[1], r[3] = '€95', '€150'
    if r[0] == '[Vila Sol](/courses/vila-sol)': r[1], r[3] = '€140', '€195'
rows.sort(key=lambda r: int(r[3].strip('€')))
c[10]['rows'] = [
 ['[Alto Golf](/courses/alto-golf)', '€154', '€77', '€220', '€110'],
 ['[Gramacho](/courses/gramacho), [Vale da Pinta](/courses/vale-da-pinta), [Silves](/courses/silves)', '€184', '€92', '€270', '€135'],
 ['[Vila Sol](/courses/vila-sol)', '€208', '€104', '€300', '€150'],
 ['[Pestana Ferragudo](/courses/pestana-ferragudo)', '€220', '€110', '€310', '€155']]
c[10]['headers'] = ['Course', 'June to August', 'Each', '16 to 30 May and September', 'Each']
for r in c[25]['rows']:
    if r[1] == '[Alto Golf](/courses/alto-golf)': r[2] = '€75'
    if r[1].startswith('[Gramacho]'): r[2] = '€95'

# Where to stay: cheapest 18 holes within 30 min (recomputed from drive times + new price_from)
c = posts['where-to-stay-in-the-algarve-for-golf']['content']
fix = {'[Carvoeiro](/carvoeiro/golf-courses)': '€75', '[Portimão](/portimao/golf-courses)': '€74', '[Alvor](/alvor/golf-courses)': '€74'}
for r in c[3]['rows']:
    if r[0] in fix: assert r[4] == '€73'; r[4] = fix[r[0]]
touch('where-to-stay-in-the-algarve-for-golf')

# Trip cost posts: Alto is in the value trip (Algarve) and all three Lagos/Portimão trips
c = posts['how-much-does-a-golf-trip-to-the-algarve-cost']['content']
for r in c[2]['rows']:
    r[1] = bump(r[1], ALTO[MONTHS.index(r[0]) + 1])
t = c[12]['rows']
t[0][1:] = ['€75', '€140']; t[4][1:] = ['€313', '€504']; t[8][1:] = ['from about €713', 'from about €904']
c = posts['how-much-does-a-golf-trip-to-lagos-and-portimao-cost']['content']
for r in c[2]['rows']:
    d = ALTO[MONTHS.index(r[0]) + 1]; r[1:] = [bump(x, d) for x in r[1:]]
for r in c[9]['rows']:
    r[1] = f'€{ALTOP[MONTHS.index(r[0]) + 1]}'
t = c[16]['rows']
t[0][1:] = ['€296'] * 3; t[1][1:] = ['€475'] * 3
t[5][1:] = ['from about €666', 'from about €806', 'from about €949']
t[6][1:] = ['from about €845', 'from about €985', 'from about €1,128']
for s in ['the-cheapest-golf-courses-in-the-algarve', 'best-value-golf-in-the-algarve', 'how-much-does-a-golf-trip-to-the-algarve-cost', 'how-much-does-a-golf-trip-to-lagos-and-portimao-cost']: touch(s)

print('problems:', problems)
print('posts changed:', len(changed)); [print(' ', s) for s in changed]
json.dump({s: p['content'] for s, p in changed.items()}, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'new_content.json'), 'w'), ensure_ascii=False, indent=1)
if APPLY and not problems:
    U = os.environ['NEXT_PUBLIC_SUPABASE_URL']; K = os.environ['SUPABASE_SERVICE_ROLE_KEY']
    for s, p in changed.items():
        req = urllib.request.Request(f"{U}/rest/v1/guide_posts?id=eq.{p['id']}", method='PATCH', data=json.dumps({'content': p['content']}).encode(),
            headers={'apikey': K, 'Authorization': 'Bearer ' + K, 'Content-Type': 'application/json'})
        urllib.request.urlopen(req)
    print('applied')
