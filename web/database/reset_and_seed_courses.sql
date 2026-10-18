-- ============================================================
-- Algarve Golf Map — Reset courses + insert full 37-course set
-- Paste in Supabase → SQL Editor and run
-- ============================================================

-- Clear old test data (cascade removes dependent rows in course_prices, etc.)
truncate courses cascade;

-- ── Insert all 37 courses ─────────────────────────────────────────────────────

insert into courses (
  name, slug, town, region, location,
  holes, par, designer, year_opened,
  has_own_hotel, driving_range, caddie_service, pro_shop, restaurant,
  offers_rental, rental_brands, rental_price_per_round,
  price_from, featured, active,
  rating, review_count,
  tags, amenities, languages
) values

-- ── VILAMOURA ────────────────────────────────────────────────────────────────

('Vilamoura Old Course',    'vilamoura-old-course',    'Vilamoura', 'central', make_point(-8.115, 37.090),
  18, 73, 'Frank Pennink', 1969,
  false, false, false, false, false, false, '{}', null,
  null, true, true, 4.60, 489,
  ARRAY['Classic','Pine forest'], '{}', ARRAY['en','pt']),

('Vilamoura Pinhal',        'vilamoura-pinhal',        'Vilamoura', 'central', make_point(-8.111, 37.087),
  18, 71, 'Frank Pennink', 1976,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('Vilamoura Laguna',        'vilamoura-laguna',        'Vilamoura', 'central', make_point(-8.108, 37.091),
  18, 72, 'Joseph Lee', 1990,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('Vilamoura Millennium',    'vilamoura-millennium',    'Vilamoura', 'central', make_point(-8.113, 37.089),
  18, 72, null, 2000,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('Victoria (Els Club)',     'victoria-els-club',       'Vilamoura', 'central', make_point(-8.123, 37.093),
  18, 72, 'Arnold Palmer', 2004,
  false, false, false, false, false, false, '{}', null,
  null, false, false, null, 0,
  ARRAY['Private'], '{}', ARRAY['en','pt']),

('Vila Sol',                'vila-sol',                'Vilamoura', 'central', make_point(-8.098, 37.097),
  18, 72, 'Donald Steel', 1991,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

-- ── QUINTA DO LAGO ───────────────────────────────────────────────────────────

('Quinta do Lago South',    'quinta-do-lago-south',    'Almancil · Golden Triangle', 'central', make_point(-8.022, 37.009),
  18, 72, 'William Mitchell', 1974,
  false, false, false, false, false, false, '{}', null,
  null, true, true, 4.90, 538,
  ARRAY['Championship','Ria Formosa'], '{}', ARRAY['en','pt']),

('Quinta do Lago North',    'quinta-do-lago-north',    'Almancil · Golden Triangle', 'central', make_point(-8.019, 37.014),
  18, 72, 'William Mitchell', 1974,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('Quinta do Lago Laranjal', 'quinta-do-lago-laranjal', 'Almancil · Golden Triangle', 'central', make_point(-8.010, 37.010),
  18, 72, 'Jorge Santana da Silva', 2009,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('Pinheiros Altos',         'pinheiros-altos',         'Almancil · Golden Triangle', 'central', make_point(-8.015, 37.007),
  27, 72, null, 1992,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('San Lorenzo',             'san-lorenzo',             'Almancil · Ria Formosa', 'central', make_point(-8.006, 37.030),
  18, 72, 'Joseph Lee', 1988,
  false, false, false, false, false, false, '{}', null,
  null, true, true, 4.85, 326,
  ARRAY['Coastal','Nature reserve'], '{}', ARRAY['en','pt']),

-- ── VALE DO LOBO ─────────────────────────────────────────────────────────────

('Vale do Lobo Royal',      'vale-do-lobo-royal',      'Vale do Lobo', 'central', make_point(-8.040, 37.022),
  18, 72, 'Sir Henry Cotton / Rocky Roquemore', 1997,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  ARRAY['Clifftop','Sea view'], '{}', ARRAY['en','pt']),

('Vale do Lobo Ocean',      'vale-do-lobo-ocean',      'Vale do Lobo', 'central', make_point(-8.043, 37.025),
  18, 72, null, 1968,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

-- ── ALBUFEIRA ────────────────────────────────────────────────────────────────

('Balaia Golf Village',     'balaia',                  'Albufeira', 'central', make_point(-8.198, 37.105),
  9, 27, null, 1974,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  ARRAY['9 holes'], '{}', ARRAY['en','pt']),

('Pine Cliffs',             'pine-cliffs',             'Albufeira · Olhos de Água', 'central', make_point(-8.213, 37.093),
  9, 33, 'Sir Henry Cotton', 1992,
  true, false, false, true, true, false, '{}', null,
  null, false, true, 4.40, 211,
  ARRAY['Clifftop','9 holes','Sea view'], '{}', ARRAY['en','pt']),

('Salgados Golf',           'salgados',                'Albufeira', 'central', make_point(-8.250, 37.087),
  18, 72, 'Pedro de Vasconcelos', 1997,
  false, false, false, false, false, false, '{}', null,
  null, false, true, 4.20, 263,
  ARRAY['Links','Wetlands'], '{}', ARRAY['en','pt']),

-- ── CARVOEIRO / LAGOA ────────────────────────────────────────────────────────

('Gramacho',                'gramacho',                'Carvoeiro', 'central', make_point(-8.472, 37.116),
  18, 72, 'Ronald Fream', 1991,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('Vale da Pinta',           'vale-da-pinta',           'Carvoeiro', 'central', make_point(-8.468, 37.118),
  18, 71, 'Ronald Fream', 1992,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('Vale de Milho',           'vale-de-milho',           'Carvoeiro', 'central', make_point(-8.469, 37.102),
  9, 27, 'Dave Thomas', 1990,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  ARRAY['9 holes','Sea view'], '{}', ARRAY['en','pt']),

('Silves Golf',             'silves',                  'Silves', 'central', make_point(-8.445, 37.155),
  18, 72, null, null,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

-- ── PORTIMÃO ─────────────────────────────────────────────────────────────────

('Alto Golf',               'alto-golf',               'Portimão', 'west', make_point(-8.532, 37.167),
  18, 72, 'William Mitchell', 1991,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('Alamos Golf',             'alamos',                  'Portimão', 'west', make_point(-8.503, 37.174),
  18, 71, 'Ronald Fream', null,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('Morgado Golf',            'morgado',                 'Portimão', 'west', make_point(-8.501, 37.183),
  18, 73, 'Ronald Fream', 2003,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('Penina Championship',     'penina-championship',     'Portimão', 'west', make_point(-8.558, 37.134),
  18, 73, 'Sir Henry Cotton', 1966,
  true, true, false, true, true, false, '{}', null,
  null, false, true, 4.50, 357,
  ARRAY['Heritage','Parkland'], '{}', ARRAY['en','pt']),

('Penina Resort',           'penina-resort',           'Portimão', 'west', make_point(-8.558, 37.134),
  9, 35, 'Sir Henry Cotton', 1966,
  true, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  ARRAY['9 holes'], '{}', ARRAY['en','pt']),

-- ── LAGOS / OESTE ────────────────────────────────────────────────────────────

('Boavista Golf',           'boavista',                'Lagos', 'west', make_point(-8.689, 37.113),
  18, 71, 'Howard Swan', 2000,
  false, false, false, true, true, false, '{}', null,
  null, false, true, 4.30, 184,
  ARRAY['Hillside','Sea view'], '{}', ARRAY['en','pt']),

('Palmares Ocean & Lakes',  'palmares',                'Lagos · Meia Praia', 'west', make_point(-8.702, 37.109),
  27, 72, 'Robert Trent Jones Jr.', 1975,
  false, true, false, true, true, false, '{}', null,
  null, false, true, 4.70, 298,
  ARRAY['Ocean view','27 holes'], '{}', ARRAY['en','pt']),

('Espiche Golf',            'espiche',                 'Lagos', 'west', make_point(-8.709, 37.099),
  18, 71, null, 2009,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('Santo António Golf',      'santo-antonio',           'Vila do Bispo', 'west', make_point(-8.826, 37.093),
  18, 72, 'Pepe Gancedo', 1986,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

-- ── AMENDOEIRA ───────────────────────────────────────────────────────────────

('Amendoeira Faldo Course',      'amendoeira-faldo',    'Amendoeira · Silves', 'central', make_point(-8.448, 37.220),
  18, 72, 'Nick Faldo', 2008,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('Amendoeira O''Connor Jr Course', 'amendoeira-oconnor', 'Amendoeira · Silves', 'central', make_point(-8.445, 37.218),
  18, 72, 'Christy O''Connor Jr.', 2008,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

-- ── LOULÉ / INTERIOR ─────────────────────────────────────────────────────────

('Ombria Golf',             'ombria',                  'Loulé', 'central', make_point(-8.055, 37.197),
  18, 71, 'Jorge Santana da Silva', 2023,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  ARRAY['New','Award-winning'], '{}', ARRAY['en','pt']),

-- ── TAVIRA / ESTE ────────────────────────────────────────────────────────────

('Benamor Golf',            'benamor',                 'Tavira · East Algarve', 'east', make_point(-7.642, 37.153),
  18, 71, null, 2000,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('Quinta da Ria',           'quinta-da-ria',           'Tavira · East Algarve', 'east', make_point(-7.620, 37.163),
  18, 72, 'Rocky Roquemore', 2002,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('Quinta de Cima',          'quinta-de-cima',          'Tavira · East Algarve', 'east', make_point(-7.618, 37.161),
  18, 72, 'Rocky Roquemore', 2002,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('Monte Rei Golf & Country Club', 'monte-rei',         'Tavira · East Algarve', 'east', make_point(-7.469, 37.175),
  18, 72, 'Jack Nicklaus', 2007,
  true, true, true, true, true, false, '{}', null,
  null, true, true, 4.95, 412,
  ARRAY['Signature','Tour-grade'], '{}', ARRAY['en','pt']),

('Quinta do Vale',          'quinta-do-vale',          'Castro Marim · East Algarve', 'east', make_point(-7.552, 37.168),
  18, 71, 'Seve Ballesteros', 2007,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('Castro Marim Golf',       'castro-marim',            'Castro Marim · East Algarve', 'east', make_point(-7.449, 37.218),
  18, 72, null, 1993,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']),

('Pestana Ferragudo',       'pestana-ferragudo',       'Ferragudo', 'west', make_point(-8.527, 37.117),
  18, 72, null, null,
  false, false, false, false, false, false, '{}', null,
  null, false, true, null, 0,
  '{}', '{}', ARRAY['en','pt']);
