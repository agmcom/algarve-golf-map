-- ============================================================
-- Course reviews — extra optional fields:
-- tee time, difficulty for the reviewer's handicap,
-- clubs hired from the course itself, views & scenery rating.
-- Run after migrate_course_reviews.sql.
-- ============================================================

alter table course_reviews
  add column tee_time            text check (tee_time in ('morning', 'midday', 'twilight')),
  add column difficulty_for_hcp  text check (difficulty_for_hcp in ('easier', 'as-expected', 'harder')),
  add column hired_course_clubs  boolean,   -- hired clubs from the course's own pro shop (not an external rental shop)
  add column rating_club_hire    int2 check (rating_club_hire between 1 and 5),
  add column rating_views        int2 check (rating_views between 1 and 5);

-- Recreate the public view with the new columns (still no email / IP / token).
drop view course_reviews_public;

create view course_reviews_public with (security_barrier = true) as
  select
    id, course_id, reviewer_name, country, handicap, played_month, group_type,
    tee_time, difficulty_for_hcp,
    rating_overall, rating_greens, rating_fairways, rating_tees_bunkers,
    rating_layout, rating_views, rating_pace, rating_staff, rating_clubhouse, rating_value,
    hired_course_clubs, rating_club_hire,
    round_time, buggy_rule, condition_flags, would_recommend,
    title, body, approved_at, created_at
  from course_reviews
  where status = 'approved';

grant select on course_reviews_public to anon, authenticated;
