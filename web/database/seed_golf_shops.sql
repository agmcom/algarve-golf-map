-- Seed: Golf shops across the Algarve (retail, on-course pro shops, fitting)
-- Researched from official shop websites, Google Places, and course/resort sites (2026-07).
-- Run migrate_shop_slugs.sql first if the shops table doesn't have a `slug` column yet.

insert into shops (name, slug, town, region, location, address, brands, services, offers_rental, delivery_to_course, website, phone, course_id, active)
values
  ('Alvor Golf Shop', 'alvor-golf-shop', 'Alvor', 'west',
    ST_SetSRID(ST_MakePoint(-8.5890, 37.1276), 4326)::geography,
    'Quinta da Praia, Lt4, Loja 15, Alvor', '{}', '{repair,rental}', true, false,
    'https://alvorgolfshop.pt', '+351925215885', null, true),

  ('Lagos Golf Shop', 'lagos-golf-shop', 'Lagos', 'west',
    ST_SetSRID(ST_MakePoint(-8.676682, 37.108475), 4326)::geography,
    'R. José Ferreira Canelas, Loja 11, 8600-744 Lagos', '{}', '{rental}', true, true,
    'https://lagosgolfshop.com', '+351282082069', null, true),

  ('Sophie''s Golf Shop', 'sophies-golf-shop', 'Odiáxere', 'west',
    ST_SetSRID(ST_MakePoint(-8.653570, 37.150039), 4326)::geography,
    'EN125, Bloco 1, Loja A, 8600-250 Odiáxere', '{}', '{}', false, false,
    'https://sophiesgolfshop.com', null, null, true),

  ('Carvoeiro Golf Shop', 'carvoeiro-golf-shop', 'Carvoeiro', 'west',
    ST_SetSRID(ST_MakePoint(-8.468070, 37.100959), 4326)::geography,
    'R. dos Pescadores 131, Loja 3, 8400-512 Carvoeiro', '{Nike,Puma,Adidas,Ashworth,Wilson,FootJoy,TaylorMade}', '{repair,custom_fitting}', true, false,
    'https://carvoeiro-golf-shop.com', '+351916513275', null, true),

  ('18 Store Golf Shop', '18-store-golf-shop', 'Lagoa', 'west',
    ST_SetSRID(ST_MakePoint(-8.513933, 37.135310), 4326)::geography,
    'Encosta da Bela Vista, Lote 31 R/C Esq, 8400-663 Parchal', '{}', '{}', true, false,
    'https://18store.pt', '+351963097298', null, true),

  ('Golfers Paradise', 'golfers-paradise', 'Almancil', 'central',
    ST_SetSRID(ST_MakePoint(-8.031158, 37.083823), 4326)::geography,
    'R. Sacadura Cabral, Golfe Building, 8135-144 Almancil', '{}', '{}', false, false,
    'https://golfersparadise.pt', '+351289393006', null, true),

  ('Nevada Bob''s Golf – Almancil', 'nevada-bobs-almancil', 'Almancil', 'central',
    ST_SetSRID(ST_MakePoint(-8.057905, 37.099502), 4326)::geography,
    'Cruzamento das 4 Estradas, EN125, 8125-204 Quarteira', '{PXG,TaylorMade,Callaway,Titleist,Cleveland,Ping,XXIO,Srixon,Mizuno}', '{}', false, false,
    'https://nevadabobs.pt', '+351289090969', null, true),

  ('Nevada Bob''s Golf – Quinta do Lago', 'nevada-bobs-quinta-do-lago', 'Almancil', 'central',
    ST_SetSRID(ST_MakePoint(-8.026780, 37.066871), 4326)::geography,
    'Quinta de Vale Verde, R. Sacadura Cabral, 8135-106 Almancil', '{PXG,TaylorMade,Callaway,Titleist,Cleveland,Ping,XXIO,Srixon,Mizuno}', '{custom_fitting}', false, false,
    'https://nevadabobs.pt', '+351912515786', null, true),

  ('Nevada Bob''s Golf – Vila Sol', 'nevada-bobs-vila-sol', 'Quarteira', 'central',
    ST_SetSRID(ST_MakePoint(-8.093759, 37.090850), 4326)::geography,
    'Pestana Vila Sol Golf, 8125-307 Morgadinhos', '{PXG,TaylorMade,Callaway,Titleist,Cleveland,Ping,XXIO,Srixon,Mizuno}', '{}', false, false,
    'https://nevadabobs.pt', '+351910956619', (select id from courses where slug = 'vila-sol'), true),

  ('Blue Sky Golf Shop', 'blue-sky-golf-shop', 'Loulé', 'central',
    ST_SetSRID(ST_MakePoint(-8.041301, 37.127233), 4326)::geography,
    'Área 3, Campino de Baixo, 8100-272 Loulé', '{TaylorMade,Callaway,Wilson,Srixon,Powakaddy}', '{}', true, false,
    'https://blueskygolfshop.com', '+351915148729', null, true),

  ('Old Course Pro Shop', 'old-course-pro-shop', 'Vilamoura', 'central',
    ST_SetSRID(ST_MakePoint(-8.115804, 37.102050), 4326)::geography,
    'Volta do Medronho, 8125-548 Vilamoura', '{}', '{}', false, false,
    null, '+351289310341', (select id from courses where slug = 'vilamoura-old-course'), true),

  ('Vale do Lobo Golf Shop', 'vale-do-lobo-golf-shop', 'Vale do Lobo', 'central',
    ST_SetSRID(ST_MakePoint(-8.063977, 37.055278), 4326)::geography,
    '8135-864 Vale do Lobo', '{}', '{}', false, false,
    'https://www.valedolobo.com', '+351289353465', (select id from courses where slug = 'vale-do-lobo-ocean'), true),

  ('Pinheiros Altos Pro Shop', 'pinheiros-altos-pro-shop', 'Almancil', 'central',
    ST_SetSRID(ST_MakePoint(-8.008004, 37.047890), 4326)::geography,
    'Urbanização Pinheiros Altos, 8135-162 Almancil', '{}', '{}', false, false,
    'https://www.pinheirosaltos.com', '+351289359900', (select id from courses where slug = 'pinheiros-altos'), true),

  ('Salgados Golf Shop', 'salgados-golf-shop', 'Albufeira', 'central',
    ST_SetSRID(ST_MakePoint(-8.324137, 37.093248), 4326)::geography,
    'R. do Golfe, 8200-424 Guia, Albufeira', '{}', '{}', false, false,
    'https://www.salgadosgolf.com', '+351289583030', (select id from courses where slug = 'salgados'), true),

  ('Monte Rei Pro Shop', 'monte-rei-pro-shop', 'Vila Nova de Cacela', 'east',
    ST_SetSRID(ST_MakePoint(-7.549182, 37.208546), 4326)::geography,
    'Sítio do Pocinho - Sesmarias, 8901-907 Vila Nova de Cacela', '{Titleist}', '{custom_fitting}', false, false,
    'https://www.monte-rei.com', '+351281950960', (select id from courses where slug = 'monte-rei'), true),

  ('Benamor Golf Pro Shop', 'benamor-pro-shop', 'Tavira', 'east',
    ST_SetSRID(ST_MakePoint(-7.608826, 37.152050), 4326)::geography,
    'Quinta de Benamor, 8800-067 Conceição, Tavira', '{}', '{}', false, false,
    null, null, (select id from courses where slug = 'benamor'), true)

on conflict (slug) where slug is not null do nothing;
