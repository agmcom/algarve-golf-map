-- Seed: additional Nevada Bob's Golf "Powered by NBG" pro shops at Algarve courses
-- Researched from nevadabobs.pt store pages + course/resort listings (2026-07).
-- Follow-up to seed_golf_shops.sql after confirming Nevada Bob's operates ~9 Algarve
-- locations, not the 3 originally captured.

insert into shops (name, slug, type, town, region, location, address, brands, services, offers_rental, delivery_to_course, website, phone, course_id, active)
values
  ('Nevada Bob''s Golf – Silves', 'nevada-bobs-silves', 'pro_shop', 'Silves', 'west',
    ST_SetSRID(ST_MakePoint(-8.4271493, 37.1679481), 4326)::geography,
    'Pestana Silves Golfe, Vila Fria, 8300-044 Poço Fundo', '{PXG,TaylorMade,Callaway,Titleist,Cleveland,Ping,XXIO,Srixon,Mizuno}', '{}', false, false,
    'https://nevadabobs.pt', '+351282440130', (select id from courses where slug = 'silves'), true),

  ('Nevada Bob''s Golf – Alto Golf', 'nevada-bobs-alto-golf', 'pro_shop', 'Portimão', 'west',
    ST_SetSRID(ST_MakePoint(-8.5656447, 37.1266031), 4326)::geography,
    'Quinta Alto do Vale, 8501-906 Alvor', '{PXG,TaylorMade,Callaway,Titleist,Cleveland,Ping,XXIO,Srixon,Mizuno}', '{}', false, false,
    'https://nevadabobs.pt', '+351282340900', (select id from courses where slug = 'alto-golf'), true),

  ('Nevada Bob''s Golf – Gramacho', 'nevada-bobs-gramacho', 'pro_shop', 'Carvoeiro', 'west',
    ST_SetSRID(ST_MakePoint(-8.4876835, 37.1249219), 4326)::geography,
    'Gramacho Golf Course, 8401-908 Carvoeiro', '{PXG,TaylorMade,Callaway,Titleist,Cleveland,Ping,XXIO,Srixon,Mizuno}', '{}', false, false,
    'https://nevadabobs.pt', '+351282340900', (select id from courses where slug = 'gramacho'), true),

  ('Nevada Bob''s Golf – Vale da Pinta', 'nevada-bobs-vale-da-pinta', 'pro_shop', 'Carvoeiro', 'west',
    ST_SetSRID(ST_MakePoint(-8.4775821, 37.1324019), 4326)::geography,
    'Empreendimento Vale da Pinta, 8400-143 Estombar', '{PXG,TaylorMade,Callaway,Titleist,Cleveland,Ping,XXIO,Srixon,Mizuno}', '{}', false, false,
    'https://nevadabobs.pt', '+351282340900', (select id from courses where slug = 'vale-da-pinta'), true),

  ('Nevada Bob''s Golf – Quinta da Ria', 'nevada-bobs-quinta-da-ria', 'pro_shop', 'Vila Nova de Cacela', 'east',
    ST_SetSRID(ST_MakePoint(-7.5644366, 37.1566014), 4326)::geography,
    'Quinta da Ria, Campo de Golfe, 8900-057 Vila Nova de Cacela', '{PXG,TaylorMade,Callaway,Titleist,Cleveland,Ping,XXIO,Srixon,Mizuno}', '{}', false, false,
    'https://nevadabobs.pt', '+351282340900', (select id from courses where slug = 'quinta-da-ria'), true)

on conflict (slug) where slug is not null do nothing;
