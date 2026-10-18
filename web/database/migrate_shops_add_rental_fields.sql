-- Migration: dedicated-rental-provider fields for shops
-- Covers info a generic pro shop doesn't need but a dedicated club-rental
-- company does: where clubs are collected (when not a postal address, e.g.
-- an airport arrivals hall), which towns/resorts delivery covers, and price
-- detail that doesn't fit a single flat rental_price_per_day (tiers,
-- delivery-radius caveats, out-of-hours surcharges).
alter table shops add column if not exists rental_pickup_location text;
alter table shops add column if not exists rental_delivery_areas text[] default '{}';
alter table shops add column if not exists rental_price_notes text;
