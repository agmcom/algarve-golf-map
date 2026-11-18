# Pine Cliffs 2026/27 price list (research/prices-2026-10/raw/pine-cliffs/): visitor 9 holes €59 low / €79 high,
# 18 holes €84 / €103; resort guests 9 holes €55 / €67, 18 holes €77 / €92. Patches the live guide posts that quoted 2025/26.
# Reads all-posts-before.json (backup), prints PATCH payloads to fixed/<slug>.json.
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
FIX = {
 'cheapest-golf-near-albufeira': [
  ('["[Pine Cliffs](/courses/pine-cliffs)", "18 min", "9", "€57", "Most months"]', '["[Pine Cliffs](/courses/pine-cliffs)", "18 min", "9", "€59", "Most months"]'),
  ('Balaia and Pine Cliffs: 2025/26 price lists.', 'Balaia: 2025/26 price list. Pine Cliffs: 2026/27 price list.'),
  ('Nine holes cost **€57** for most of the year and €76 in February to May and October.', 'Nine holes cost **€59** for most of the year and €79 from February to May and from mid-September to 20 November.'),
  ('or nine holes at Pine Cliffs from €57.', 'or nine holes at Pine Cliffs from €59.'),
 ],
 'cheapest-golf-in-vilamoura': [
  ('Pine Cliffs: 2025/26 price list.', 'Pine Cliffs: 2026/27 price list.'),
  ('["[Pine Cliffs](/courses/pine-cliffs)", "25 min", "9", "€57"]', '["[Pine Cliffs](/courses/pine-cliffs)", "25 min", "9", "€59"]'),
  ('from €57 for nine holes, and players', 'from €59 for nine holes, and players'),
  ('with nine holes from €57.', 'with nine holes from €59.'),
 ],
 'hotels-near-pine-cliffs-golf-course': [
  ('(see the price table further down)', '(see the green fees further down)'),
  ("On the resort's 2025/26 price list, 9 holes cost visitors **€57 in low season and €76 in high season**, and 18 holes (the loop played twice) cost €80 and €99. Resort guests pay €53 and €64 for 9 holes, and €74 and €88 for 18.",
   "On the resort's 2026/27 price list, 9 holes cost visitors **€59 in low season and €79 in high season**, and 18 holes (the loop played twice) cost €84 and €103. Resort guests pay €55 and €67 for 9 holes, and €77 and €92 for 18."),
 ],
 'the-10-best-algarve-golf-courses-for-seniors': [
  ('Green fees start from **€57**.', 'Green fees start from **€59**.'),
 ],
 'the-cheapest-golf-courses-in-the-algarve': [
  ('Albufeira: €57 to €76.**', 'Albufeira: €59 to €79.**'),
 ],
 'best-value-golf-in-the-algarve': [
  ('[Pine Cliffs](/courses/pine-cliffs) from €57.', '[Pine Cliffs](/courses/pine-cliffs) from €59.'),
 ],
}
os.makedirs(os.path.join(HERE, 'fixed'), exist_ok=True)
for p in json.load(open(os.path.join(HERE, 'all-posts-before.json'))):
    if p['slug'] not in FIX: continue
    t = json.dumps(p['content'], ensure_ascii=False)
    for a, b in FIX.pop(p['slug']):
        assert t.count(a) == 1, (p['slug'], a, t.count(a))
        t = t.replace(a, b)
    json.dump({'content': json.loads(t)}, open(os.path.join(HERE, 'fixed', p['slug'] + '.json'), 'w'), ensure_ascii=False)
    print('ok', p['slug'])
assert not FIX, FIX
