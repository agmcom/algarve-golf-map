-- ============================================================
-- Algarve Golf Map — Database Schema
-- PostgreSQL / Supabase
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";
create extension if not exists "postgis";

-- ============================================================
-- ENUMS
-- ============================================================

create type algarve_region    as enum ('west', 'central', 'east');
create type course_difficulty as enum ('easy', 'moderate', 'challenging');
create type price_time_slot   as enum ('early_bird', 'standard', 'twilight', 'sunset');
create type price_rate_type   as enum ('visitor', 'resident');


-- ============================================================
-- HELPER
-- ============================================================

create or replace function make_point(lng float8, lat float8)
returns geography language sql immutable as $$
  select ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
$$;


-- ============================================================
-- ZONES  (for trip planner hotel recommendations)
-- ============================================================

create table zones (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,              -- "Golden Triangle / Almancil"
  slug        text not null unique,

  center      geography(Point, 4326) not null,
  center_lat  float8 generated always as (ST_Y(center::geometry)) stored,
  center_lng  float8 generated always as (ST_X(center::geometry)) stored,

  -- OTA deep-links pre-filtered to this area
  booking_url text,
  airbnb_url  text,

  created_at  timestamptz not null default now()
);


-- ============================================================
-- COURSES
-- ============================================================

create table courses (
  id              uuid primary key default gen_random_uuid(),

  -- Identity
  name            text not null,
  slug            text not null unique,
  blurb           text,
  description     text,

  -- Location
  location        geography(Point, 4326) not null,
  lat             float8 generated always as (ST_Y(location::geometry)) stored,
  lng             float8 generated always as (ST_X(location::geometry)) stored,
  address         text,
  town            text not null,
  region          algarve_region not null,

  -- Specs
  holes             int2 not null default 18,
  par               int2,
  length_meters     int4,
  difficulty        course_difficulty,
  course_type       text,               -- parkland / links / clifftop / heathland / desert
  designer          text,
  year_opened       int2,
  handicap_required int2,

  -- Facilities
  has_own_hotel   boolean not null default false,
  driving_range   boolean not null default false,
  putting_green   boolean not null default false,
  golf_academy    boolean not null default false,
  caddie_service  boolean not null default false,
  pro_shop        boolean not null default false,
  restaurant      boolean not null default false,
  dress_code      text,
  languages       text[] default '{}',

  -- Rental (clubs available at the course)
  offers_rental         boolean not null default false,
  rental_brands         text[] default '{}',
  rental_price_per_round int4,

  -- Pricing reference (full detail in course_prices)
  price_from      int4,

  -- Contact
  website         text,
  phone           text,
  email           text,
  booking_url     text,

  -- Display
  tags            text[] default '{}',
  amenities       text[] default '{}',
  featured        boolean not null default false,
  active          boolean not null default true,

  rating          float4,
  review_count    int4 default 0,

  course_map_url  text,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);


-- ============================================================
-- AIRPORTS
-- ============================================================

create table airports (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,   -- IATA code
  name          text not null,
  city          text not null,
  country       text not null default 'PT',
  lat           float8 not null,
  lng           float8 not null,
  road_factor   float4 not null default 1.3,
  avg_speed_kmh int2   not null default 90,
  active        boolean not null default true
);


-- ============================================================
-- COURSE PRICES
-- ============================================================

create table course_prices (
  id             uuid primary key default gen_random_uuid(),
  course_id      uuid not null references courses(id) on delete cascade,

  month          int2 not null check (month between 1 and 12),
  time_slot      price_time_slot not null default 'standard',
  holes          int2 not null default 18,
  rate_type      price_rate_type not null default 'visitor',

  price_eur      int4 not null,
  buggy_price    int4,            -- null = not available separately or already included
  buggy_included boolean not null default false,
  notes          text,

  unique (course_id, month, time_slot, holes, rate_type)
);


-- ============================================================
-- COURSE PHOTOS
-- ============================================================

create table course_photos (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references courses(id) on delete cascade,
  url         text not null,
  alt         text,
  position    int2 not null default 0,
  is_hero     boolean not null default false,
  created_at  timestamptz not null default now()
);


-- ============================================================
-- HOTELS  (golf-focused only)
-- ============================================================

create table hotels (
  id              uuid primary key default gen_random_uuid(),

  name            text not null,
  slug            text not null unique,
  description     text,

  -- Location
  location        geography(Point, 4326) not null,
  lat             float8 generated always as (ST_Y(location::geometry)) stored,
  lng             float8 generated always as (ST_X(location::geometry)) stored,
  address         text,
  town            text not null,
  region          algarve_region not null,
  zone_id         uuid references zones(id) on delete set null,

  -- Hotel specs
  stars           int2 check (stars between 1 and 5),
  price_from      int4,                  -- EUR per night, low season

  -- Golf services for guests
  has_golf_package      boolean not null default false,
  golf_package_desc     text,
  has_shuttle           boolean not null default false,
  shuttle_courses       text[] default '{}',   -- course names served by shuttle
  club_storage          boolean not null default false,
  club_cleaning         boolean not null default false,
  drying_room           boolean not null default false,
  early_breakfast       boolean not null default false,  -- available from ~6am
  late_checkout         boolean not null default false,
  offers_rental         boolean not null default false,  -- club rental for guests

  -- Contact
  website         text,
  phone           text,
  booking_url     text,

  -- Display
  amenities       text[] default '{}',   -- ['pool','spa','tennis','beach',…]
  active          boolean not null default true,
  featured        boolean not null default false,

  rating          float4,
  review_count    int4 default 0,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table hotel_photos (
  id          uuid primary key default gen_random_uuid(),
  hotel_id    uuid not null references hotels(id) on delete cascade,
  url         text not null,
  alt         text,
  position    int2 not null default 0,
  is_hero     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Hotels ↔ Courses: partner agreements / preferred rates
create table hotel_courses (
  hotel_id          uuid not null references hotels(id) on delete cascade,
  course_id         uuid not null references courses(id) on delete cascade,
  discount_percent  int2,
  notes             text,
  primary key (hotel_id, course_id)
);


-- ============================================================
-- SHOPS  (retail, pro shops, rental, fitting)
-- Pro shops linked to their course via course_id
-- ============================================================

create table shops (
  id          uuid primary key default gen_random_uuid(),

  name        text not null,
  slug        text unique,
  description text,

  -- Location
  location    geography(Point, 4326) not null,
  lat         float8 generated always as (ST_Y(location::geometry)) stored,
  lng         float8 generated always as (ST_X(location::geometry)) stored,
  address     text,
  town        text not null,
  region      algarve_region not null,

  -- Link to course (if pro_shop or rental on-site at a course)
  course_id   uuid references courses(id) on delete set null,

  -- Stock & services
  brands      text[] default '{}',
  services    text[] default '{}',   -- ['repair','custom_fitting','stringing','lessons']

  -- Rental fields (relevant when type = 'rental' or offers_rental = true)
  offers_rental         boolean not null default false,
  rental_price_per_day  int4,
  rental_set_types      text[] default '{}',  -- ['full_set','half_set','ladies','junior','left_handed']
  delivery_to_course    boolean not null default false,

  -- Dedicated rental-provider fields (e.g. airport-based or delivery-only
  -- companies whose core business is rental, not a shop with an address)
  rental_pickup_location text,               -- free text; where clubs are collected, when not `address`
  rental_delivery_areas  text[] default '{}', -- towns/resorts named as delivery coverage
  rental_price_notes     text,               -- tiers, delivery-radius caveats, surcharges

  -- Contact
  website     text,
  phone       text,
  email       text,

  -- Practical / profile info
  opening_hours     text,
  google_maps_url   text,
  instagram_url     text,
  facebook_url      text,
  parking           text,
  languages_spoken  text[] default '{}',
  accepts_trade_in  boolean,
  fitting_technology text,

  -- Photo
  photo_url   text,
  photo_alt   text,

  active      boolean not null default true,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);


-- ============================================================
-- ACADEMIES  (separate table, linked to course if on-site)
-- ============================================================

create table academies (
  id          uuid primary key default gen_random_uuid(),

  name        text not null,
  slug        text not null unique,
  description text,

  -- Location
  location    geography(Point, 4326) not null,
  lat         float8 generated always as (ST_Y(location::geometry)) stored,
  lng         float8 generated always as (ST_X(location::geometry)) stored,
  address     text,
  town        text not null,
  region      algarve_region not null,

  -- Link to course (if the academy belongs to a course)
  course_id   uuid references courses(id) on delete set null,

  -- Staff
  head_pro    text,
  languages   text[] default '{}',   -- instruction languages: ['en','es','de']

  -- Lesson types
  private_lessons   boolean not null default true,
  group_lessons     boolean not null default false,
  clinics           boolean not null default false,
  video_analysis    boolean not null default false,

  -- Pricing
  price_per_hour    int4,    -- EUR, private lesson
  price_per_day     int4,    -- EUR, full day clinic

  -- Facilities
  short_game_area   boolean not null default false,
  indoor_facility   boolean not null default false,

  -- Contact
  website     text,
  phone       text,
  booking_url text,

  active      boolean not null default true,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);


-- ============================================================
-- TRIPS  (planner — phase 2)
-- ============================================================

create table trips (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid,

  name        text not null default 'My Algarve Golf Trip',
  start_date  date,
  end_date    date,
  players     int2 not null default 1,
  budget_eur  int4,
  notes       text,

  share_token text unique default encode(gen_random_bytes(8), 'hex'),
  is_public   boolean not null default false,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table trip_days (
  id          uuid primary key default gen_random_uuid(),
  trip_id     uuid not null references trips(id) on delete cascade,

  date        date,
  position    int2 not null default 0,
  course_id   uuid references courses(id) on delete set null,
  hotel_id    uuid references hotels(id) on delete set null,
  notes       text,

  created_at  timestamptz not null default now()
);


-- ============================================================
-- INDEXES
-- ============================================================

-- Spatial (GIST)
create index on courses   using gist(location);
create index on hotels    using gist(location);
create index on shops     using gist(location);
create index on academies using gist(location);
create index on zones     using gist(center);

-- Filter
create index on courses(region);
create index on courses(active)   where active = true;
create index on courses(featured) where featured = true;
create index on hotels(region);
create index on hotels(zone_id);
create index on hotels(active)    where active = true;
create index on shops(region);
create index on shops(type);
create index on shops(course_id);
create index on academies(region);
create index on academies(course_id);

-- Price / photo
create index on course_prices(course_id);
create index on course_prices(season);
create index on course_photos(course_id);
create index on hotel_photos(hotel_id);

-- Trips
create index on trip_days(trip_id);
create index on trips(share_token);


-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger courses_updated_at   before update on courses   for each row execute function set_updated_at();
create trigger hotels_updated_at    before update on hotels    for each row execute function set_updated_at();
create trigger shops_updated_at     before update on shops     for each row execute function set_updated_at();
create trigger academies_updated_at before update on academies for each row execute function set_updated_at();
create trigger trips_updated_at     before update on trips     for each row execute function set_updated_at();


-- ============================================================
-- EXAMPLE QUERIES
-- ============================================================

-- Insert a course:
-- insert into courses (name, slug, town, region, location, holes, ...)
-- values ('Monte Rei', 'monte-rei', 'Tavira', 'east', make_point(-7.469, 37.175), 18, ...);

-- Pro shop + academy linked to a course:
-- insert into shops (name, type, town, region, location, course_id, ...)
-- values ('Quinta do Lago Pro Shop', 'pro_shop', 'Almancil', 'central', make_point(-8.022, 37.009), '<course_uuid>', ...);

-- insert into academies (name, slug, town, region, location, course_id, head_pro, ...)
-- values ('Quinta do Lago Golf Academy', 'qdl-academy', 'Almancil', 'central', make_point(-8.022, 37.009), '<course_uuid>', 'John Smith', ...);

-- Hotels in a zone within 25 km of all selected courses:
-- select h.name, h.stars, h.price_from, z.name as zone
-- from hotels h join zones z on h.zone_id = z.id
-- where ST_DWithin(h.location, make_point(-8.12, 37.09), 25000)
--   and ST_DWithin(h.location, make_point(-8.02, 37.01), 25000)
-- order by h.stars desc;
