"""Scan saved research files (club pages, terms, scorecard texts) for pace-of-play wording.
Writes pace-2026-11/scan_saved.txt. Usage: python3 pace-2026-11/scan_saved.py (from research/)."""
import os, re, html
KEY = re.compile(r'(?i)pace of play|ritmo de jogo|tempo de jogo|tempo (máximo|maximo)|playing time|time par|(\b[2-5] ?h(ou)?r?s? ?(and )?[0-5]?[05]? ?(min|m)?\b.{0,40}(18|9|nine|eighteen) holes)|((18|9) (holes|buracos).{0,60}\b[2-5] ?(h|hours|horas)\b)|\b[2-5]h[0-5][05]\b|play without (undue|unjustifiable) delay|double (the )?par|let .{0,30}play through|keep up with|ranger|marshal')
out = open('pace-2026-11/scan_saved.txt', 'w')
for root, _, files in os.walk('.'):
    if 'algarvegolf-reviews' in root or 'pace-2026-11' in root or 'backups' in root: continue
    for f in files:
        if not f.endswith(('.txt', '.html', '.json', '.tsv')): continue
        p = os.path.join(root, f)
        s = open(p, errors='ignore').read()
        if f.endswith('.html'):
            s = re.sub(r'(?is)<script.*?</script>|<style.*?</style>', ' ', s)
            s = html.unescape(re.sub(r'<[^>]+>', ' ', s))
        s = re.sub(r'\s+', ' ', s)
        seen = set()
        for m in KEY.finditer(s):
            k = m.start() // 300
            if k in seen: continue
            seen.add(k)
            out.write(f'[{p}] ...{s[max(0, m.start()-160): m.end()+200]}...\n')
