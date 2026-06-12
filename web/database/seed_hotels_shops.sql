-- ============================================================
-- Seed: Zones, Hotels, Shops  (provisional data)
-- ============================================================


-- ============================================================
-- ZONES
-- ============================================================

insert into zones (name, slug, center) values
  ('Lagos / Oeste',              'lagos-west',       make_point(-8.67, 37.10)),
  ('Portimão / Alvor',           'portimao-alvor',   make_point(-8.54, 37.13)),
  ('Carvoeiro / Lagoa',          'carvoeiro-lagoa',  make_point(-8.47, 37.09)),
  ('Albufeira',                  'albufeira',        make_point(-8.25, 37.09)),
  ('Vilamoura / Quarteira',      'vilamoura',        make_point(-8.12, 37.09)),
  ('Golden Triangle / Almancil', 'golden-triangle',  make_point(-8.02, 37.02)),
  ('Faro / Olhão',               'faro-olhao',       make_point(-7.93, 37.02)),
  ('Tavira / Este',              'tavira-east',      make_point(-7.65, 37.13));


-- ============================================================
-- HOTELS  (one per zone, golf-focused)
-- ============================================================

insert into hotels (
  name, slug, location, town, region, zone_id,
  stars, price_from,
  has_golf_package, has_shuttle, club_storage, club_cleaning, drying_room, early_breakfast, late_checkout,
  active, featured
)
select
  h.name, h.slug, make_point(h.lng, h.lat), h.town, h.region::algarve_region,
  z.id,
  h.stars, h.price_from,
  h.golf_pkg, h.shuttle, h.club_store, h.club_clean, h.drying, h.early_bkfst, h.late_co,
  true, h.featured
from (values
  -- name, slug, lng, lat, town, region, stars, price_from, golf_pkg, shuttle, club_store, club_clean, drying, early_bkfst, late_co, featured, zone_slug
  ('Palmares Beach House Hotel',          'palmares-beach-house',   -8.695, 37.106, 'Lagos',     'west',    5, 280, true,  true,  true,  true,  true,  true,  false, true,  'lagos-west'),
  ('Penina Hotel & Golf Resort',          'penina-hotel',           -8.561, 37.136, 'Portimão',  'west',    5, 200, true,  false, true,  true,  true,  true,  false, false, 'portimao-alvor'),
  ('Vila Vita Parc Resort & Spa',         'vila-vita-parc',         -8.484, 37.087, 'Lagoa',     'west',    5, 650, true,  true,  true,  true,  true,  true,  true,  true,  'carvoeiro-lagoa'),
  ('Pine Cliffs Residence',               'pine-cliffs-residence',  -8.213, 37.095, 'Albufeira', 'central', 5, 320, true,  true,  true,  true,  false, true,  true,  false, 'albufeira'),
  ('Anantara Vilamoura Algarve Resort',   'anantara-vilamoura',     -8.124, 37.092, 'Vilamoura', 'central', 5, 380, true,  true,  true,  true,  false, true,  false, true,  'vilamoura'),
  ('Conrad Algarve',                      'conrad-algarve',         -8.032, 37.023, 'Almancil',  'central', 5, 480, true,  true,  true,  true,  true,  true,  true,  true,  'golden-triangle'),
  ('Eva Senses Hotel',                    'eva-senses',             -7.935, 37.016, 'Faro',      'central', 4, 130, false, false, false, false, false, false, false, false, 'faro-olhao'),
  ('Monte Rei Golf & Country Club Hotel', 'monte-rei-hotel',        -7.471, 37.177, 'Tavira',    'east',    5, 390, true,  false, true,  true,  true,  true,  false, true,  'tavira-east')
) as h(name, slug, lng, lat, town, region, stars, price_from, golf_pkg, shuttle, club_store, club_clean, drying, early_bkfst, late_co, featured, zone_slug)
join zones z on z.slug = h.zone_slug;


-- ============================================================
-- HOTEL PHOTOS  (Pexels — provisional)
-- ============================================================

insert into hotel_photos (hotel_id, url, alt, position, is_hero)
select h.id,
  'https://images.pexels.com/photos/' || p.photo_id || '/pexels-photo-' || p.photo_id || '.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  p.alt, p.pos, p.hero
from (values
  ('palmares-beach-house',  '1591361',  'Luxury beach resort pool with ocean view',       0, true),
  ('penina-hotel',          '261102',   'Golf hotel exterior with palm trees',             0, true),
  ('vila-vita-parc',        '189296',   'Five-star resort infinity pool',                 0, true),
  ('pine-cliffs-residence', '594077',   'Clifftop resort with Atlantic ocean views',      0, true),
  ('anantara-vilamoura',    '261169',   'Five-star resort pool at sunset',                0, true),
  ('conrad-algarve',        '1134176',  'Luxury hotel lobby and pool area',               0, true),
  ('eva-senses',            '271618',   'Modern hotel with marina views',                 0, true),
  ('monte-rei-hotel',       '189293',   'Country club hotel surrounded by golf course',   0, true)
) as p(hotel_slug, photo_id, alt, pos, hero)
join hotels h on h.slug = p.hotel_slug;


-- ============================================================
-- SHOPS  (retail, pro shops, rental, fitting)
-- ============================================================

insert into shops (
  name, type, location, town, region,
  brands, services,
  offers_rental, rental_price_per_day, delivery_to_course,
  active
) values

(
  'Dom Pedro Victoria Pro Shop', 'pro_shop',
  make_point(-8.122, 37.094), 'Vilamoura', 'central',
  array['Titleist','FootJoy','Callaway'],
  array['repair','custom_fitting'],
  false, null, false, true
),

(
  'Quinta do Lago Pro Shop', 'pro_shop',
  make_point(-8.020, 37.011), 'Almancil', 'central',
  array['FootJoy','Titleist','Nike Golf'],
  array['repair','custom_fitting','lessons'],
  false, null, false, true
),

(
  'Golf Galaxy Algarve', 'retail',
  make_point(-8.246, 37.093), 'Albufeira', 'central',
  array['TaylorMade','Titleist','Ping','Callaway','Cobra'],
  array['repair','stringing'],
  false, null, false, true
),

(
  'Golf Center Portimão', 'retail',
  make_point(-8.538, 37.137), 'Portimão', 'west',
  array['Ping','Cobra','Wilson','Srixon'],
  array['repair'],
  false, null, false, true
),

(
  'West Algarve Golf Rental', 'rental',
  make_point(-8.676, 37.107), 'Lagos', 'west',
  array['Callaway','TaylorMade'],
  array[]::text[],
  true, 55, true, true
),


(
  'Algarve Golf Fitting Studio', 'fitting',
  make_point(-7.942, 37.019), 'Faro', 'central',
  array['TaylorMade','Ping','Titleist'],
  array['custom_fitting','video_analysis'],
  false, null, false, true
);
