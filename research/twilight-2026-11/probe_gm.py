"""Find when twilight rates start, from each club's own Golfmanager booking engine (v1).

For a few sample dates across the year, asks for the first tee time at or after
every half hour from 11:00 to 18:30 and records which rate names are offered.
The first tee time that offers a twilight-type rate is the twilight start that day.
Writes probe.json next to this script.
"""
import json, os, re, sys, time, urllib.request
HERE = os.path.dirname(os.path.abspath(__file__))
CLUBS_ALL = [('salgados',1),('espiche',1),('ombria',1),('morgadoalamos',1),('morgadoalamos',2),
         ('dompedro',2),('dompedro',3),('dompedro',4),('dompedro',5),('palmares',9),('boavista',1),
         ('castromarim',1),('quintadovale',1),('quintadaria',1),('quintadaria',2),('amendoeira',1),('amendoeira',2)]
# Salgados and Espiche were probed first (probe-salgados-espiche.log); the clubs below
# showed a twilight rate in the Oct 2026 price samples. The others sold none online at 16:30.
CLUBS = [('ombria',1),('morgadoalamos',1),('morgadoalamos',2)]
DATES = sys.argv[1:] or ['2026-12-02','2027-01-13','2027-02-17','2027-03-17','2027-04-14','2027-05-19','2027-06-16','2027-07-14','2027-08-18','2027-09-15','2027-10-13']
TW = re.compile(r'(?i)twil|sunset|tarde|afternoon')
out = {}
for tenant, rt in CLUBS:
    key = f'{tenant}_{rt}'; out[key] = {}
    for day in DATES:
        seen = {}
        for h in range(11*60, 19*60, 30):
            hhmm = f'{h//60:02d}:{h%60:02d}'
            url = f'https://{tenant}.golfmanager.com/ebookings/init.api?idResourceType={rt}&start={day}T{hhmm}:00'
            try:
                d = json.load(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'}), timeout=30))
            except Exception as e:
                continue
            av = d.get('availability')
            if not isinstance(av, list) or not av: continue
            a = av[0]
            if a['date'][:10] != day: continue
            seen[a['date'][11:16]] = {t['name'].strip(): t['price'] for t in a['types']}
            time.sleep(0.1)
        tw = sorted(s for s, r in seen.items() if any(TW.search(n) for n in r))
        nontw = sorted(s for s, r in seen.items() if not any(TW.search(n) for n in r))
        out[key][day] = {'first_twilight': tw[0] if tw else None,
                         'last_non_twilight': max([s for s in nontw if not tw or s < tw[0]], default=None),
                         'last_slot': max(seen) if seen else None,
                         'twilight_rates': {n: p for s in tw[:1] for n, p in seen[s].items() if TW.search(n)}}
        print(key, day, out[key][day], flush=True)
json.dump(out, open(os.path.join(HERE, 'probe-' + '-'.join(t for t,_ in CLUBS) + '.json'), 'w'), indent=1, ensure_ascii=False)
