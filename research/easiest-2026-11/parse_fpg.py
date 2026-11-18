"""Parse the FPG national course rating table (HTML saved in sources/) into a TSV with the same
columns as research/fpg_course_ratings_2026-11.tsv, and diff the two to spot any re-rating."""
import re, html, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'sources', 'fpg_all_courses_2026-11-18.html')
s = open(src, encoding='utf-8').read()
body = s[s.find('<tbody>'):]
rows, course, sex = [], None, None
for tr in re.findall(r'(?is)<tr[^>]*>(.*?)</tr>', body):
    cells = [re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', c))).strip() for c in re.findall(r'(?is)<td[^>]*>(.*?)</td>', tr)]
    if len(cells) < 6: continue
    if cells[0]: course = cells[0]
    if cells[1]: sex = cells[1]
    tee, par, cr, slope = cells[2:6]
    if not tee or not slope.isdigit(): continue
    rows.append((course, sex, tee, par, cr, slope))
out = os.path.join(HERE, 'fpg_course_ratings_2026-11-18.tsv')
with open(out, 'w') as f:
    f.write('course\tsex\ttee\tpar\tcr\tslope\n')
    for r in rows: f.write('\t'.join(r) + '\n')
old = [tuple(l.rstrip('\n').split('\t')) for l in open(os.path.join(HERE, '..', 'fpg_course_ratings_2026-11.tsv'))][1:]
print('rows new', len(rows), 'old', len(old))
a, b = set(old), set(rows)
print('only in old:', sorted(a - b)[:20]); print('only in new:', sorted(b - a)[:20])
