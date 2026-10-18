-- ============================================================
-- RLS Policies — public read access for all content tables
-- ============================================================

-- Courses
alter table courses enable row level security;
create policy "public can read active courses"
  on courses for select
  using (active = true);

-- Course prices & photos (readable if the parent course is readable)
alter table course_prices enable row level security;
create policy "public can read course prices"
  on course_prices for select
  using (true);

alter table course_photos enable row level security;
create policy "public can read course photos"
  on course_photos for select
  using (true);

-- Hotels
alter table hotels enable row level security;
create policy "public can read active hotels"
  on hotels for select
  using (active = true);

alter table hotel_photos enable row level security;
create policy "public can read hotel photos"
  on hotel_photos for select
  using (true);

alter table hotel_courses enable row level security;
create policy "public can read hotel courses"
  on hotel_courses for select
  using (true);

-- Shops
alter table shops enable row level security;
create policy "public can read active shops"
  on shops for select
  using (active = true);

-- Academies
alter table academies enable row level security;
create policy "public can read active academies"
  on academies for select
  using (active = true);

-- Zones (always public)
alter table zones enable row level security;
create policy "public can read zones"
  on zones for select
  using (true);

-- Trips: owner only (phase 2 — no auth yet, skip for now)
-- alter table trips enable row level security;
-- alter table trip_days enable row level security;
