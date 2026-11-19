"""Count AlgarveGolf.net reviews (research/algarvegolf-reviews/reviews.json, scraped 2026-09-17) that talk about pace of play,
and pull out round times golfers mention. Writes pace-2026-11/reviews_pace.json + prints a summary. Opinions, not official data."""
import json, re, collections
R = json.load(open('algarvegolf-reviews/reviews.json'))
SLOW = re.compile(r'(?i)\bslow(ly)?\b|\bwait(ed|ing)?\b(?! staff)|\bqueue|\bbacked up|\bhold[- ]?ups?\b|5 ?(hrs?|hours)|five hours|six hours|over 5|marshal')
FAST = re.compile(r'(?i)\b(good|great|excellent|quick|fast|decent|nice|steady) pace|no (waiting|delays|hold ?ups)|didn.t have to wait|no waits?\b|under 4 ?(hrs|hours)')
TIME = re.compile(r'(?i)\b(\d(?:[.,]\d+|½| ?1/2| and a half)?)\s*(?:hrs?|hours)\b')
rows = collections.defaultdict(lambda: {'n': 0, 'slow': 0, 'fast': 0, 'times': [], 'years': collections.Counter()})
for r in R:
    s = r['our_slug']; t = r.get('review') or r.get('Review') or ''
    d = rows[s]; d['n'] += 1; d['years'][(r.get('date') or r.get('Date') or '')[:4]] += 1
    if SLOW.search(t): d['slow'] += 1
    if FAST.search(t): d['fast'] += 1
    for m in TIME.finditer(t):
        v = m.group(1).replace(',', '.').replace('½', '.5').replace(' 1/2', '.5').replace('1/2', '.5').replace(' and a half', '.5')
        try:
            v = float(v)
        except ValueError:
            continue
        ctx = t[max(0, m.start() - 80): m.end() + 40]
        if 3 <= v <= 7 and re.search(r'(?i)round|play|took|took us|game|18|hole|course', ctx):
            d['times'].append(v)
out = {}
for s, d in sorted(rows.items(), key=lambda kv: -kv[1]['slow'] / max(kv[1]['n'], 1)):
    out[s] = {'reviews': d['n'], 'mention_slow': d['slow'], 'mention_good_pace': d['fast'], 'round_times_mentioned': sorted(d['times']),
              'years': dict(sorted(d['years'].items()))}
    print(f"{s:26} n={d['n']:3} slow={d['slow']:3} ({100*d['slow']/d['n']:4.1f}%) goodpace={d['fast']:3} times={sorted(d['times'])}")
tot = sum(d['n'] for d in rows.values()); sl = sum(d['slow'] for d in rows.values()); fa = sum(d['fast'] for d in rows.values())
alltimes = [x for d in rows.values() for x in d['times']]
print('TOTAL', tot, 'slow', sl, f'{100*sl/tot:.1f}%', 'good pace', fa, 'times mentioned', len(alltimes), collections.Counter(alltimes).most_common())
json.dump(out, open('pace-2026-11/reviews_pace.json', 'w'), indent=1)
