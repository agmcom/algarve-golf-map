-- Migration: add slug column to shops (needed for individual shop landing pages)
alter table shops add column if not exists slug text;
create unique index if not exists shops_slug_idx on shops (slug) where slug is not null;
