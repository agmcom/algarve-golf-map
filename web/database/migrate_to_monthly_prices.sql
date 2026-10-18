-- ============================================================
-- Migration: season-based → month-based course prices
-- Run this against an existing DB that has the old schema.
-- Safe to run multiple times (uses DROP IF EXISTS + CREATE).
-- ============================================================

-- 1. Drop old table (all data will be re-seeded)
drop table if exists course_prices;

-- 2. Drop old enums no longer needed
drop type if exists price_season;
drop type if exists buggy_policy;

-- 3. Recreate price_time_slot with new values
drop type if exists price_time_slot;
create type price_time_slot as enum ('early_bird', 'standard', 'twilight', 'sunset');

-- 4. New rate_type enum (visitor = public / resident = hotel guest)
drop type if exists price_rate_type;
create type price_rate_type as enum ('visitor', 'resident');

-- 5. Recreate course_prices with monthly structure
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

-- 6. Re-apply public read policy
alter table course_prices enable row level security;
create policy "public can read course prices"
  on course_prices for select
  using (true);
