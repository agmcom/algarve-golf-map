-- Add an explicit "is a handicap certificate required?" flag, so a missing
-- max-handicap number no longer reads as "no handicap needed".
--   true  = a handicap is required (limits in handicap_required_men/ladies, if published)
--   false = no handicap required
--   null  = not verified
-- Run in Supabase → SQL Editor

alter table courses
  add column if not exists handicap_required boolean;

-- Every course with a published limit requires a handicap
update courses
set handicap_required = true
where handicap_required_men is not null or handicap_required_ladies is not null;

-- Verified 2026-10-26 against official sources:
-- Balaia: resort guest guide says "Handicap required", no limit published
update courses set handicap_required = true  where slug = 'balaia';
-- Penina Resort Course: official page says "Not required"
update courses set handicap_required = false where slug = 'penina-resort';
-- Pine Cliffs: local rule 1, players without a handicap play from the red tees
update courses set handicap_required = false where slug = 'pine-cliffs';
-- Vale de Milho: no handicap requirement
update courses set handicap_required = false where slug = 'vale-de-milho';
