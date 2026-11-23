# Shared builder for the 'Golf courses near <hotel>' series (topic #27). 23 Nov 2026.
# Course facts reuse what the earlier posts in the series verified:
# - green fees: web/scripts/data/prices-2026-27.json (min/max standard visitor rate for the season)
# - slopes: FPG back tees (web/src/data/course-ratings.ts); walking: web/src/data/walking.ts
# - designers/years/par/length: courses table + verified_course_facts (Alto 36/36, Penina facts, Pine Cliffs par 32, etc.)
# - pace/four-balls: web/src/data/pace.ts; Laguna free-buggy offer: buggy guide (vilamouragolf.com)
import json, os, urllib.request
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
PRICES = json.load(open(os.path.join(ROOT, 'web/scripts/data/prices-2026-27.json')))

def env():
    e = {}
    for line in open(os.path.join(ROOT, 'web/.env.local')):
        if '=' in line and not line.startswith('#'):
            k, v = line.strip().split('=', 1); e[k] = v.strip('"')
    return e

def rng(slug, holes=18, slot='standard'):
    p = [r['price_eur'] for r in PRICES if r['slug'] == slug and r['holes'] == holes and r['time_slot'] == slot]
    return (min(p), max(p)) if p else None

def fee(slug, holes=18):
    r = rng(slug, holes)
    return '€{}'.format(r[0]) if r[0] == r[1] else '€{} to €{}'.format(*r)

C = lambda name, slug: f'[{name}](/courses/{slug})'
G = lambda name, slug: f'[{name}](/guide/{slug})'
P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}

# slug -> (display name, holes label, price holes, glance paragraph)
COURSES = {
 'salgados': ('Salgados', '18 holes', 18, "**{L}** (par 72, 6,033 m, slope 129): flat and one of the easiest courses in the Algarve to walk, on the wetlands behind Praia da Galé, but with plenty of water and exposed to the wind. Twilight rounds start at €47."),
 'balaia': ('Balaia', '9 holes, all par 3', 9, "**{L}** (9 holes, par 27, 984 m): a short course of par 3s, €50 to play. The resort says a handicap is required, without giving a limit."),
 'pine-cliffs': ('Pine Cliffs', '9 holes', 9, "**{L}** (9 holes, par 32, 2,227 m): Martin Hawtree's clifftop course at Olhos de Água, famous for its 6th, the Devil's Parlour. No handicap needed: players without one tee off from the red markers."),
 'amendoeira-faldo': ('Amendoeira Faldo', '18 holes', 18, "**{L}** (par 72, 6,598 m, slope 142): Nick Faldo's course climbs the hillside and is one of the hardest in the area. The online green fee includes a buggy, if one is available."),
 'amendoeira-oconnor': ("Amendoeira O'Connor", '18 holes', 18, "**{L}** (par 72, 6,708 m, slope 136): Christy O'Connor Jr.'s sister course stays flat in the valley among orange groves, with the same buggy-included green fee."),
 'silves': ('Silves', '18 holes', 18, "**{L}** (par 70, 5,592 m, slope 120): a shorter, gentler Pestana course among orchards, with more slopes on the back nine, where a buggy is recommended."),
 'vale-da-pinta': ('Vale da Pinta', '18 holes', 18, "**{L}** (par 71, 6,127 m, slope 132): Pestana's Carvoeiro course with rolling fairways. Twilight is €55 from 3.30pm."),
 'gramacho': ('Gramacho', '18 holes', 18, "**{L}** (par 72, 6,107 m, slope 132): Pestana's hillier Carvoeiro course, next to Vale da Pinta. Twilight is €55 from 3.30pm."),
 'vale-de-milho': ('Vale de Milho', '9 holes, all par 3', 9, "**{L}** (9 holes, par 27, 926 m): a short par-3 course in Carvoeiro, €22 a round, with no handicap needed."),
 'pestana-ferragudo': ('Pestana Ferragudo', '18 holes', 18, "**{L}** (par 72, 5,841 m, slope 118): Pestana's newest course, opened in 2026, and one of the easiest 18-hole courses in the area on slope."),
 'alto-golf': ('Alto Golf', '18 holes', 18, "**{L}** (par 70, 5,432 m, slope 130): the last course Sir Henry Cotton designed. It accepts a handicap of up to 36 for men as well as ladies, so it suits higher handicappers. Twilight is €50."),
 'penina-championship': ('Penina Championship', '18 holes', 18, "**{L}** (par 73, 6,273 m, slope 143): Cotton's 1966 course, the first in the Algarve, which the club says has hosted the Portuguese Open ten times. Flat, but the hardest course in the area on slope."),
 'penina-resort': ('Penina Resort Course', '9 holes', 9, "**{L}** (9 holes, par 35, 2,987 m): a full-length nine beside the Championship course that doesn't ask for a handicap."),
 'morgado': ('Morgado', '18 holes', 18, "**{L}** (par 73, 6,581 m, slope 134): golfers describe its fairways as wide and forgiving; the back nine is hillier, so a buggy is recommended."),
 'alamos': ('Alamos', '18 holes', 18, "**{L}** (par 71, 5,710 m, slope 132): Morgado's sister course, which golfers find tighter and hillier."),
 'palmares': ('Palmares', '27 holes', 18, "**{L}** (27 holes, slope 129 to 134): Robert Trent Jones Jr.'s course between the sea and the hills at Lagos, with three nines and real elevation changes."),
 'vilamoura-pinhal': ('Vilamoura Pinhal', '18 holes', 18, "**{L}** (par 72, 6,353 m, slope 140): Frank Pennink's 1976 course through the pines, the toughest Vilamoura course on slope."),
 'vilamoura-old-course': ('Vilamoura Old Course', '18 holes', 18, "**{L}** (par 73, 6,254 m, slope 136): Pennink's 1969 original and Vilamoura's most famous course, lined with umbrella pines, and its most expensive round."),
 'vilamoura-laguna': ('Vilamoura Laguna', '18 holes', 18, "**{L}** (par 72, 6,121 m, slope 135): flatter and more open than the pine-lined courses, with plenty of water. Vilamoura Golf has a free shared buggy offer on Laguna for new bookings made by 31 December 2026."),
 'vilamoura-millennium': ('Vilamoura Millennium', '18 holes', 18, "**{L}** (par 72, 6,176 m, slope 130): Martin Hawtree's flat course with wide fairways, the easiest Vilamoura course on slope. Laguna and Millennium share the lowest green fees in Vilamoura, from €88."),
 'vila-sol': ('Vila Sol', '27 holes', 18, "**{L}** (27 holes, slope 135 to 137): Donald Steel's Pestana course just outside Vilamoura, with three nines played in pairs and a €60 twilight rate from 3.30pm."),
 'vale-do-lobo-royal': ('Vale do Lobo Royal', '18 holes', 18, "**{L}** (par 72, 6,005 m, slope 133): home of the famous clifftop par-3 16th. Vale do Lobo's Sunset rate, from €76 in winter, includes a shared buggy for full-paying adults."),
 'vale-do-lobo-ocean': ('Vale do Lobo Ocean', '18 holes', 18, "**{L}** (par 73, 6,122 m, slope 140): Sir Henry Cotton's original 1968 course, hillier than the Royal."),
}

def drive_times(lat, lng, slugs):
    e = env(); T = e['NEXT_PUBLIC_MAPBOX_TOKEN']; U = e['NEXT_PUBLIC_SUPABASE_URL']; K = e['SUPABASE_SERVICE_ROLE_KEY']
    cs = json.load(urllib.request.urlopen(urllib.request.Request(U + '/rest/v1/courses?select=slug,lat,lng', headers={'apikey': K, 'Authorization': 'Bearer ' + K})))
    pos = {c['slug']: (c['lat'], c['lng']) for c in cs}
    out = {}
    for s in slugs:
        clat, clng = pos[s]
        r = json.load(urllib.request.urlopen(f"https://api.mapbox.com/directions/v5/mapbox/driving/{lng},{lat};{clng},{clat}?overview=false&access_token={T}"))['routes'][0]
        out[s] = (round(r['duration'] / 60), round(r['distance'] / 1000))
    r = json.load(urllib.request.urlopen(f"https://api.mapbox.com/directions/v5/mapbox/driving/-7.9660,37.0215;{lng},{lat}?overview=false&access_token={T}"))['routes'][0]
    out['_airport'] = (round(r['duration'] / 60), round(r['distance'] / 1000))
    return out

def course_table(dt, slugs, caption, extra_note=''):
    rows = []
    for s in sorted(slugs, key=lambda s: dt[s][0]):
        name, holes, ph, _ = COURSES[s]
        rows.append([C(name, s), f'{dt[s][0]} min ({dt[s][1]} km)', holes, fee(s, ph)])
    note = ("Not a complete list. Drive times without traffic (Mapbox), checked November 2026. Green fees are the lowest and highest standard visitor rates "
            "for the 2026/27 season, from each club's own online booking or price list, for the holes shown. " + extra_note).strip()
    return {'type': 'table', 'caption': caption, 'headers': ['Course', 'Drive from the hotel', 'Holes', 'Visitor green fee (2026/27)'], 'rows': rows, 'note': note}

def glance(slugs):
    out = [H2('The nearest courses at a glance'),
           P('Slope ratings are from the Portuguese Golf Federation for the back tees: the higher the number, the harder the course for an average golfer.')]
    for s in slugs:
        name, _, _, txt = COURSES[s]
        out.append(P(txt.replace('{L}', C(name, s))))
    return out

def save_draft(slug, title, excerpt, content, hero_path, hero_alt, seo_title, seo_desc):
    import time
    e = env(); U = e['NEXT_PUBLIC_SUPABASE_URL']; K = e['SUPABASE_SERVICE_ROLE_KEY']; H = {'apikey': K, 'Authorization': 'Bearer ' + K}
    name = f'hero/{slug}-{int(time.time()*1000)}.jpg'
    urllib.request.urlopen(urllib.request.Request(f'{U}/storage/v1/object/guide-images/{name}', data=open(hero_path, 'rb').read(), method='POST', headers={**H, 'Content-Type': 'image/jpeg'}))
    row = {'title': title, 'slug': slug, 'excerpt': excerpt, 'hero_image_url': f'{U}/storage/v1/object/public/guide-images/{name}', 'hero_image_alt': hero_alt,
           'published': False, 'categories': ['courses', 'hotels'], 'content': content}
    ex = json.load(urllib.request.urlopen(urllib.request.Request(U + f'/rest/v1/guide_posts?slug=eq.{slug}&select=id,published', headers=H)))
    if ex:
        assert not ex[0]['published']
        urllib.request.urlopen(urllib.request.Request(U + f'/rest/v1/guide_posts?id=eq.{ex[0]["id"]}', data=json.dumps(row).encode(), method='PATCH', headers={**H, 'Content-Type': 'application/json'}))
        pid = ex[0]['id']
    else:
        pid = json.load(urllib.request.urlopen(urllib.request.Request(U + '/rest/v1/guide_posts', data=json.dumps(row).encode(), method='POST', headers={**H, 'Content-Type': 'application/json', 'Prefer': 'return=representation'})))[0]['id']
    seo = os.path.join(ROOT, 'web/src/lib/guide-seo.ts'); s = open(seo).read()
    if f"'{slug}':" not in s:
        a = "export const GUIDE_SEO: Record<string, { title?: string; description?: string }> = {\n"
        b = a + f"  '{slug}': {{\n    title: {json.dumps(seo_title)},\n    description: {json.dumps(seo_desc)},\n  }},\n"
        s = s.replace(a, b, 1); open(seo, 'w').write(s)
    json.dump(content, open(os.path.join(HERE, slug + '.json'), 'w'), ensure_ascii=False, indent=1)
    return pid

def hero_from(src, dst):
    from PIL import Image
    im = Image.open(src).convert('RGB')
    r = max(1600 / im.width, 900 / im.height); im = im.resize((round(im.width * r), round(im.height * r)))
    l = (im.width - 1600) // 2; t = (im.height - 900) // 2
    im.crop((l, t, l + 1600, t + 900)).save(dst, 'JPEG', quality=88)
