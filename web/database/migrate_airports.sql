-- ============================================================
-- AIRPORTS
-- ============================================================

create table if not exists airports (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,   -- IATA code
  name          text not null,
  city          text not null,
  country       text not null default 'PT',
  lat           float8 not null,
  lng           float8 not null,
  road_factor   float4 not null default 1.3,   -- straight-line to road distance multiplier
  avg_speed_kmh int2   not null default 90,    -- average road speed for travel time estimate
  active        boolean not null default true
);

insert into airports (code, name, city, country, lat, lng, road_factor, avg_speed_kmh) values
  ('FAO', 'Faro Airport',    'Faro',    'PT',  37.0144, -7.9659, 1.35,  75),
  ('LIS', 'Lisbon Airport',  'Lisbon',  'PT',  38.7742, -9.1342, 1.30, 110),
  ('SVQ', 'Seville Airport', 'Seville', 'ES',  37.4180, -5.8931, 1.25, 100)
on conflict (code) do nothing;
