-- Seed: dedicated golf club rental companies (not retail shops, not on-course
-- pro shops) — businesses whose core service is club hire, across the
-- Algarve. Researched from each company's own website (2026-08). Fields with
-- no confirmed source are left null/empty, not guessed.
-- Requires migrate_shops_add_rental_fields.sql to have been run first.

insert into shops (
  name, slug, town, region, location, address,
  brands, services, offers_rental, rental_price_per_day, rental_set_types,
  delivery_to_course, rental_pickup_location, rental_delivery_areas, rental_price_notes,
  website, phone, email, opening_hours, course_id, active
)
values
  ('ClubsToHire', 'clubstohire-faro-airport', 'Faro', 'central',
    ST_SetSRID(ST_MakePoint(-7.9659, 37.0144), 4326)::geography, null,
    '{Callaway,TaylorMade,PXG,Cobra,Ping}', '{rental}', true, null,
    '{full_set,ladies,left_handed}', true,
    'Arrivals Hall, Faro Airport (FAO)',
    '{Vilamoura,Quinta do Lago,Vale do Lobo,Almancil,Albufeira,Lagos,Carvoeiro,Alvor,Tavira}',
    'Delivery charges may apply depending on distance. Out-of-hours pickup (05:30–07:00) available on request for a €25 surcharge.',
    'https://www.clubstohire.com/locations/faro-algarve/', '+351924190242',
    'faro@clubstohire.com', 'Daily 07:00–23:00 (pre-booked)',
    null, true),

  ('MyCaddyMaster', 'mycaddymaster-faro-airport', 'Faro', 'central',
    ST_SetSRID(ST_MakePoint(-7.9659, 37.0144), 4326)::geography, null,
    '{Callaway,TaylorMade,Cleveland,Cobra,XXIO,Srixon,Ping}', '{rental}', true, 5,
    '{full_set,ladies,junior,left_handed}', true,
    'Cafe PAUL, Departures Terminal, Faro Airport (FAO)',
    '{}',
    'Tiered packages: Evolution €9.30–14.50/day, Performance €10.60–21.80/day, Excellence €17.00–21.80/day.',
    'https://www.mycaddymaster.com/en/golf-destinations/hire-golf-clubs-faro-airport.html',
    null, null, null, null, true),

  ('Faro Golf Club Hire', 'faro-golf-club-hire', 'Faro', 'central',
    ST_SetSRID(ST_MakePoint(-7.9659, 37.0144), 4326)::geography, null,
    '{Ben Sayers,Callaway,Ping,TaylorMade}', '{rental}', true, null,
    '{full_set,ladies,left_handed}', true,
    'Faro Airport (FAO)',
    '{}', null,
    'https://www.farogolfclubhire.net/', '+351916053420', null,
    'Pickup/drop-off in 30-min slots, 00:00–23:30', null, true),

  ('Lagos Golf Club Hire', 'lagos-golf-club-hire', 'Lagos', 'west',
    ST_SetSRID(ST_MakePoint(-8.676, 37.107), 4326)::geography, null,
    '{TaylorMade,Ping,Callaway,Ben Sayers}', '{rental}', true, null,
    '{full_set,ladies,junior}', true,
    null,
    '{Lagoa,Lagos}',
    'Core coverage is Lagoa–Lagos (Western Algarve); free delivery also offered to hotels/villas anywhere in the Algarve.',
    'https://www.lagosgolfclubhire.com/', '+351969180644',
    'info@lagosgolfclubhire.com', null, null, true),

  ('Up''N''Down Golf', 'up-n-down-golf', 'Silves', 'central',
    ST_SetSRID(ST_MakePoint(-8.4386, 37.1897), 4326)::geography, null,
    '{TaylorMade,Titleist}', '{rental}', true, 9,
    '{}', true,
    null,
    '{Vilamoura,Quarteira,Albufeira,Carvoeiro,Faro,Quinta do Lago,Lagos}',
    'From €9–15/day depending on customisation; weekly €93–113; prebuilt bags from €130/14 days.',
    'https://upndowngolf.co.uk/', '+351925580348',
    'hello@upndowngolf.co.uk', null, null, true),

  ('Green-Tee', 'green-tee-vilamoura', 'Vilamoura', 'central',
    ST_SetSRID(ST_MakePoint(-8.1235, 37.0790), 4326)::geography,
    'Edifício Vilamarina, Loja 22, Marina de Vilamoura, 8125-401 Vilamoura',
    '{TaylorMade,Titleist,Callaway,Ping,Wilson,Mizuno}', '{rental}', true, 25,
    '{full_set,left_handed}', true,
    null,
    '{}',
    'Free delivery within 25km of Vilamoura.',
    'https://www.green-tee.pt/', '+351910895339',
    'info@green-tee.pt', null, null, true);
