-- Migration: add richer profile fields to shops
-- Contact / practical info
alter table shops add column if not exists email text;
alter table shops add column if not exists opening_hours text;
alter table shops add column if not exists google_maps_url text;
alter table shops add column if not exists instagram_url text;
alter table shops add column if not exists facebook_url text;
alter table shops add column if not exists parking text;

-- Shopper-relevant attributes
alter table shops add column if not exists languages_spoken text[] default '{}';
alter table shops add column if not exists accepts_trade_in boolean;
alter table shops add column if not exists fitting_technology text;

-- Photo (single hero image for now — matches shop page's single-image use)
alter table shops add column if not exists photo_url text;
alter table shops add column if not exists photo_alt text;
