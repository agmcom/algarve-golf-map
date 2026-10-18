-- Split handicap_required into handicap_required_men + handicap_required_ladies
-- Run in Supabase → SQL Editor

alter table courses
  add column handicap_required_men     int2,
  add column handicap_required_ladies  int2;

-- Migrate existing values to the men's column
update courses
set handicap_required_men = handicap_required
where handicap_required is not null;

-- Drop the old column
alter table courses drop column handicap_required;
