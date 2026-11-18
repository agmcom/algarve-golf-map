"""Look for pace-of-play rules (round time, tee interval, marshals) on each club's official website.
Fetches the club's golf page(s), follows same-site links that look like terms, rules, FAQ,
booking, prices or PDFs (max 30 per club), and records every passage that mentions pace of play. Writes crawl/<club>.txt and crawl/summary.json.
Static HTML only; pages that need JavaScript may show nothing.
Usage: python3 crawl_clubs.py [club ...]"""
import json, os, re, subprocess, sys, html, urllib.request, urllib.parse
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, 'crawl')
os.makedirs(OUT, exist_ok=True)
CLUBS = {
 'pestana': ['https://pestanagolf.com/gramacho/', 'https://pestanagolf.com/vale-da-pinta/', 'https://pestanagolf.com/silves-golf/', 'https://pestanagolf.com/alto-golf/', 'https://pestanagolf.com/vila-sol/', 'https://pestanagolf.com/golf/'],
 'pestana-ferragudo': ['https://pestanaferragudo.com/'],
 'alto-golf': ['https://altoclub.com/'],
 'amendoeira': ['https://www.amendoeiraresort.com/en/golf/'],
 'balaia': ['https://www.balaiagolfvillage.com/en/balaia-golf-club/'],
 'benamor': ['https://www.benamorgolf.com/en/', 'https://www.benamorgolf.com/en/rules-etiquette', 'https://www.benamorgolf.com/en/dress-code'],
 'boavista': ['https://www.boavistaresort.pt/en/Menu/Golf/About-the-Course.aspx'],
 'castro-marim': ['https://castromarimresort.com/en/'],
 'espiche': ['https://www.espichegolf.pt/en/'],
 'monte-rei': ['https://www.monte-rei.com/en/golf/'],
 'morgado-alamos': ['https://www.morgadogolfhotel.com/en/morgado_golf.html', 'https://www.nauhotels.com/en/golf/alamos-golf'],
 'ombria': ['https://www.ombria.com/en/golf/golf-course/'],
 'palmares': ['https://www.palmaresliving.com/golf/golf-course/'],
 'penina': ['https://penina.com/golf/golf-courses/sir-henry-cotton-championship-course/sir-henry-cotton-championship-course-rules-specifications', 'https://penina.com/golf/golf-courses/resort-course', 'https://www.penina.com/golf/golf-courses/sir-henry-cotton-championship-course/'],
 'pine-cliffs': ['https://www.pinecliffs.com/en/golf-sports/golf/'],
 'pinheiros-altos': ['https://www.pinheirosaltos.com/'],
 'quinta-do-lago': ['https://www.quintadolago.com/en/golf/'],
 'salgados': ['https://salgadosgolf.com/'],
 'santo-antonio': ['https://www.saresorts.com/'],
 'vale-de-milho': ['https://valedemilhogolf.com/'],
}
LINK = re.compile(r'(?i)term|condi|polic|rule|regul|faq|cancel|book|reserv|etiquet|norma|green.?fee|tarif|price|prec|rate|info|golf|\.pdf')
KEY = re.compile(r'(?i)pace of play|speed of play|ritmo de jogo|tempo de jogo|tempo m[aá]ximo|time par|playing time|\b[2-5] ?h(ours?)? ?(and )?[0-5]?[05]? ?(min(utes)?)?\b.{0,25}(18|9|nine|eighteen)|(18|9)[- ](holes?|buracos).{0,50}\b[2-5] ?(h|hours|horas)\b|\b[2-5]h ?[0-5][05]|without (undue|unjustifiable) delay|double (the )?par|play through|keep up with|tee (time )?interval|minutes? between')

def get(url):
    r = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en'}), timeout=25)
    return r.read(), r.headers.get('Content-Type', ''), r.geturl()

def pdf_text(b):
    p = os.path.join(OUT, '_tmp.pdf'); open(p, 'wb').write(b)
    js = 'ObjC.import("PDFKit"); var d=$.PDFDocument.alloc.initWithURL($.NSURL.fileURLWithPath("%s")); d ? d.string.js : ""' % p
    try:
        return subprocess.run(['osascript', '-l', 'JavaScript', '-e', js], capture_output=True, text=True, timeout=60).stdout
    except Exception:
        return ''

def text_of(s):
    s = re.sub(r'(?is)<script.*?</script>|<style.*?</style>', ' ', s)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s)))

summary = {}
only = sys.argv[1:]
for club, starts in CLUBS.items():
    if only and club not in only:
        continue
    host = urllib.parse.urlparse(starts[0]).netloc.replace('www.', '')
    queue, seen, hits, fetched = list(starts), set(), [], []
    while queue and len(seen) < 30:
        u = queue.pop(0).split('#')[0]
        if u in seen:
            continue
        seen.add(u)
        try:
            b, ct, final = get(u)
        except Exception as e:
            fetched.append((u, 'ERR ' + str(e)[:60])); continue
        if 'pdf' in ct or u.lower().endswith('.pdf'):
            t = pdf_text(b)
        else:
            s = b.decode('utf-8', 'ignore'); t = text_of(s)
            if len(seen) <= 12:  # only expand links from the first pages
                for m in re.finditer(r'(?is)<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', s):
                    href = urllib.parse.urljoin(final, html.unescape(m.group(1))); label = text_of(m.group(2))
                    same = urllib.parse.urlparse(href).netloc.replace('www.', '') == host
                    if not same and not href.lower().endswith('.pdf'):
                        continue
                    if (LINK.search(href) or LINK.search(label)) and href not in seen and href not in queue:
                        queue.append(href)
        fetched.append((u, len(t)))
        for m in KEY.finditer(t):
            hits.append((u, t[max(0, m.start() - 250): m.start() + 350]))
    uniq, keys = [], set()
    for u, p in hits:
        k = p[200:320]
        if k not in keys:
            keys.add(k); uniq.append((u, p))
    with open(os.path.join(OUT, club + '.txt'), 'w') as f:
        f.write('FETCHED:\n' + '\n'.join(f'  {u} {n}' for u, n in fetched) + '\n\nHITS:\n')
        for u, p in uniq:
            f.write(f'\n[{u}]\n{p}\n')
    summary[club] = {'pages': len(fetched), 'hits': len(uniq)}
    print(club, summary[club], flush=True)
sp = os.path.join(OUT, 'summary.json')
old = json.load(open(sp)) if os.path.exists(sp) else {}
old.update(summary); json.dump(old, open(sp, 'w'), indent=1)
