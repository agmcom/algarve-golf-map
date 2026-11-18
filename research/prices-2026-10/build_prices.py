"""Build the 2026/27 monthly green-fee table from official sources.

Rule for every course: the lowest price any visitor can book for one 18-hole round
(9 holes for the 9-hole courses) on their own: no junior, member, resident,
multi-round, multi-player or buggy-package rates. Open-to-all special offers count.
Twilight is kept separately where the club sells one.

Sources, in order of preference:
  1. The club's published price list (PDF or web page).
  2. The club's own online booking engine (Golfmanager), sampled every Wednesday
     for the next 12 months; the month's figure is the lowest price seen.
  3. Clubs that publish neither: the September 2026 algarvegolf.net figures, labelled as such.

Writes prices_2026-27.json: [{slug, month, time_slot, holes, price_eur, buggy_price, buggy_included, notes}]
"""
import json, math, re, collections

ROWS = []
def add(slug, month, slot, holes, price, buggy=None, incl=False, src=''):
    # price_eur is whole euros; round up so a "from" price is never understated
    ROWS.append(dict(slug=slug, month=month, time_slot=slot, holes=holes, price_eur=math.ceil(price),
                     buggy_price=buggy, buggy_included=incl, notes=f'source: {src}'))

ALL = range(1, 13)

# ── 1. Published price lists ────────────────────────────────────────────────
# Pestana Golf price list (pestanagolf.com/pt-pt/precario). First checked 26 Oct 2026; re-checked 18 Nov 2026,
# when Pestana had raised most rates (page saved at raw/pestana/precario-2026-11-18.html).
# Alta: Nov Feb May Sep · Baixa: Dec Jan Jun Jul Aug · Premium: Mar Apr Oct. Buggy €55 (18h), twilight buggy €40.
PESTANA = {'alta': [11, 2, 5, 9], 'baixa': [12, 1, 6, 7, 8], 'premium': [3, 4, 10]}
pestana = {  # slug: (alta, baixa, premium, twilight, buggy)
    'pestana-ferragudo': (200, 130, 230, 80, None),
    'gramacho':          (155, 95, 180, 55, 55),
    'vale-da-pinta':     (155, 95, 180, 55, 55),
    'silves':            (155, 95, 180, 55, 55),
    'alto-golf':         (115, 75, 140, 50, 55),
    'vila-sol':          (195, 140, 215, 60, 55),
}
for slug, (alta, baixa, prem, twi, buggy) in pestana.items():
    for season, price in (('alta', alta), ('baixa', baixa), ('premium', prem)):
        for m in PESTANA[season]:
            add(slug, m, 'standard', 18, price, buggy, src='Pestana Golf official price list')
            add(slug, m, 'twilight', 18, twi, None, src='Pestana Golf official price list')

# Santo António 2026 golf rates PDF: "special offers" open to all visitors.
for m in ALL:
    add('santo-antonio', m, 'standard', 18, 68 if m in (3, 4, 5, 9, 10) else 57, 40, src='Santo António official 2026 rates')
    add('santo-antonio', m, 'twilight', 18, 35, None, src='Santo António official 2026 rates')

# Benamor official green-fees page, internet rate (cheapest adult rate).
# High 16 Sep–30 Nov & 16 Feb–15 May €103 · Mid 1–15 Feb, 16–31 May, 1–15 Sep €95 · Low Dec–Jan, Jun–Aug €66 (€59 afternoon).
BEN = {1: 66, 2: 95, 3: 103, 4: 103, 5: 95, 6: 66, 7: 66, 8: 66, 9: 95, 10: 103, 11: 103, 12: 66}
for m, p in BEN.items():
    add('benamor', m, 'standard', 18, p, src='Benamor official green-fee page (internet rate)')
    if p == 66:
        add('benamor', m, 'twilight', 18, 59, src='Benamor official green-fee page (internet rate)')

# Pine Cliffs 2025/26 price list, visitor 9 holes. High: 1–20 Nov, Feb–May, 15 Sep–Oct €76 · Low €57.
for m in ALL:
    add('pine-cliffs', m, 'standard', 9, 76 if m in (2, 3, 4, 5, 10) else 57, src='Pine Cliffs official 2025/26 price list')

# Balaia 2025–26 green-fee rates PDF: visitor daily fee €50 (unlimited play that day).
for m in ALL:
    add('balaia', m, 'standard', 9, 50, src='Balaia official 2025-26 rates (day fee)')

# Vale de Milho fees page: 9 holes €22.
for m in ALL:
    add('vale-de-milho', m, 'standard', 9, 22, src='Vale de Milho official fees page')

# ── 2. Club's own Golfmanager booking engine ────────────────────────────────
GM_SRC = "club's own online booking, sampled Oct 2026"
V1 = {  # slug: (raw file, standard regex, twilight regex or None, buggy_included)
    'vilamoura-old-course': ('gm_dompedro_2', r'^GF Direct Old Course$', None, False),
    'vilamoura-laguna':     ('gm_dompedro_3', r'^GF Direct Laguna$', None, False),
    'vilamoura-millennium': ('gm_dompedro_4', r'^GF Direct Millennium$', None, False),
    'vilamoura-pinhal':     ('gm_dompedro_5', r'^GF Direct Pinhal$', None, False),
    # Ombria's 'Twilight Online' sampled dearer than its standard rate, so it is not used.
    'ombria':               ('gm_ombria_1', r'^Green fee\+buggy \(online\)$', None, True),
    'palmares':             ('gm_palmares_9', r'^GF18 Online\s*$', None, False),
    'boavista':             ('gm_boavista_1', r'^GF 18 HOLES Web$', None, False),
    'espiche':              ('gm_espiche_1', r'^Visitor - 18 holes$', r'^Visitor - Twilight$', False),
    'quinta-da-ria':        ('gm_quintadaria_1', r'^GF Online Visitor - 18 RIA\s*$', None, False),
    'quinta-de-cima':       ('gm_quintadaria_2', r'^GF Online Special Offer - 18 CIMA\s*$', None, False),
    'quinta-do-vale':       ('gm_quintadovale_1', r'^GF Online Rate - 18$', None, False),
    'castro-marim':         ('gm_castromarim_1', r'^GF 18 Visitor\s*$|^GF 18 VISITOR SPC ONLINE\s*$', None, False),
    # Morgado/Alamos twilight appeared on only 1-5 sampled dates, too few to publish.
    'morgado':              ('gm_morgadoalamos_1', r'^GF 18 Desk/ Online Desconto MO\s*$', None, False),
    'alamos':               ('gm_morgadoalamos_2', r'^GF 18 Desk/ Online Desconto AL\s*$', None, False),
    'salgados':             ('gm_salgados_1', r'^18 Holes Online$', r'^Twilight Online$', False),
    'amendoeira-faldo':     ('gm_amendoeira_1', r'(?i)^GF 18H online FC|^GF 18H (Summer|Winter|Easter) Special Vis FC', None, False),
    'amendoeira-oconnor':   ('gm_amendoeira_2', r'(?i)^GF 18H online OC|^GF 18H (Summer|Winter|Easter) Special Vis OC', None, False),
}
V2 = {  # slug: (raw file, standard regex, twilight regex)
    'vale-do-lobo-royal':      ('gm2_valedolobo_1', r'^ROYAL \| Web \| 18 holes$', r'^ROYAL \| (Twilight|Sunset) \| Web$'),
    'vale-do-lobo-ocean':      ('gm2_valedolobo_1', r'^OCEAN \| Web \| 18 holes$', r'^OCEAN \| (Twilight|Sunset) \| Web$'),
    'monte-rei':               ('gm2_monterei_1', r'^GF18 Direct$', r'^GF18 Twilight$'),
    'quinta-do-lago-laranjal': ('gm2_quintadolago_7', r'^QL - (Web \(18h\)|Winter Offer Desk \(Web\))$', None),
    'quinta-do-lago-north':    ('gm2_quintadolago_7', r'^QN - (Web \(18h\)|Winter Offer Desk \(Web\))$', None),
    'quinta-do-lago-south':    ('gm2_quintadolago_7', r'^QS - (Web \(18h\)|Winter Offer Desk \(Web\))$', None),
}

def month_of(date): return int(date[5:7])

for slug, (f, std, twi, incl) in V1.items():
    data = json.load(open(f'raw/{f}.json'))
    best = collections.defaultdict(dict)
    for o in data:
        for name, price in (o.get('rates') or {}).items():
            if not price or price <= 0: continue
            m = month_of(o['date'])
            for slot, rx in (('standard', std), ('twilight', twi)):
                if rx and re.search(rx, name):
                    best[slot][m] = min(best[slot].get(m, 1e9), price)
    for slot in ('standard', 'twilight'):
        for m, p in sorted(best[slot].items()):
            add(slug, m, slot, 18, p, None, incl if slot == 'standard' else (incl and 'buggy' in slot), src=GM_SRC)

for slug, (f, std, twi) in V2.items():
    data = json.load(open(f'raw/{f}.json'))
    best = collections.defaultdict(dict)
    for day, rates in data.items():
        if not isinstance(rates, dict) or 'error' in rates: continue
        m = month_of(day)
        for name, slots in rates.items():
            for price in slots.values():
                if not price or price <= 0: continue
                for slot, rx in (('standard', std), ('twilight', twi)):
                    if rx and re.search(rx, name):
                        best[slot][m] = min(best[slot].get(m, 1e9), price)
    for slot in ('standard', 'twilight'):
        for m, p in sorted(best[slot].items()):
            add(slug, m, slot, 18, p, src=GM_SRC)

# ── 3. No current official prices: keep September 2026 algarvegolf.net rows ─
FALLBACK = ['penina-championship', 'penina-resort', 'san-lorenzo', 'pinheiros-altos']
old = json.load(open('old_prices.json'))
for r in old:
    if r['slug'] in FALLBACK:
        add(r['slug'], r['month'], r['time_slot'], r['holes'], r['price_eur'], r['buggy_price'], r['buggy_included'],
            src='algarvegolf.net, Sep 2026 (club publishes no current rates)')

json.dump(ROWS, open('prices_2026-27.json', 'w'), indent=1, ensure_ascii=False)
by = collections.defaultdict(lambda: collections.defaultdict(dict))
for r in ROWS: by[r['slug']][r['time_slot']][r['month']] = r['price_eur']
for slug in sorted(by):
    s = by[slug].get('standard', {}); t = by[slug].get('twilight', {})
    fmt = lambda d: ' '.join(f'{m}:{int(d[m]) if d[m] == int(d[m]) else d[m]}' for m in sorted(d))
    print(f'{slug:24} std[{len(s)}] {fmt(s)}')
    if t: print(f'{"":24} twi[{len(t)}] {fmt(t)}')
