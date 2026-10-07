-- ============================================================
-- Hotel services for golfers — only confirmed services are stored.
-- A row exists only when the hotel's own website (or Google) states
-- the service; no row means "not shown", never "no".
-- Every row keeps the exact quote and page it came from.
-- ============================================================

create table hotel_services (
  id          uuid primary key default gen_random_uuid(),
  hotel_id    uuid not null references hotels(id) on delete cascade,

  service     text not null check (service in (
                'golf_package',       -- golf packages or green-fee discounts
                'golf_shuttle',       -- transport to golf courses
                'club_storage',       -- golf club / bag storage
                'breakfast_time',     -- breakfast opening time (detail holds the hours)
                'tee_time_booking',   -- tee times / green fees booked by the hotel
                'onsite_golf',        -- course, putting green or practice area on site
                'club_rental',        -- golf club hire at the hotel
                'parking',
                'airport_transfer',
                'late_checkout',      -- late check-out or luggage storage
                'spa',                -- spa or massage
                'restaurant_bar'
              )),

  detail      text,                   -- shown to users, e.g. 'Free shuttle to San Lorenzo Golf Course'
  is_paid     boolean,                -- true = extra cost or on request; null = not stated
  quote       text not null,          -- exact sentence from the source (evidence, admin only)
  source_url  text not null,
  checked_at  date not null default current_date,

  unique (hotel_id, service)
);

create index hotel_services_hotel_id_idx on hotel_services (hotel_id);

alter table hotel_services enable row level security;
create policy "public can read hotel services"
  on hotel_services for select
  using (true);
