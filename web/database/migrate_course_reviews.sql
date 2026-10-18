-- ============================================================
-- Course reviews — submitted by golfers, confirmed by email,
-- approved manually in /admin/reviews before going live.
-- ============================================================

create table course_reviews (
  id                  uuid primary key default gen_random_uuid(),
  course_id           uuid not null references courses(id) on delete cascade,

  -- unverified → (email link clicked) → pending → approved / rejected
  status              text not null default 'unverified'
                      check (status in ('unverified', 'pending', 'approved', 'rejected')),

  -- Reviewer (email is private — never exposed publicly)
  reviewer_name       text not null,
  email               text not null,
  country             text,
  handicap            int2 check (handicap between 0 and 54),

  -- The round
  played_month        date not null,           -- always the 1st of the month
  group_type          text check (group_type in ('couple', 'friends', 'society', 'solo')),

  -- Ratings (1–5). Condition ratings are required, the rest optional.
  rating_overall      int2 not null check (rating_overall between 1 and 5),
  rating_greens       int2 not null check (rating_greens between 1 and 5),
  rating_fairways     int2 not null check (rating_fairways between 1 and 5),
  rating_tees_bunkers int2 not null check (rating_tees_bunkers between 1 and 5),
  rating_layout       int2 check (rating_layout between 1 and 5),
  rating_pace         int2 check (rating_pace between 1 and 5),
  rating_staff        int2 check (rating_staff between 1 and 5),
  rating_clubhouse    int2 check (rating_clubhouse between 1 and 5),
  rating_value        int2 check (rating_value between 1 and 5),

  -- Facts about the round
  round_time          text check (round_time in ('<4h', '4-4.5h', '4.5-5h', '>5h')),
  buggy_rule          text check (buggy_rule in ('fairways', '90-degree', 'paths-only', 'walked')),
  condition_flags     text[] not null default '{}',
  would_recommend     boolean not null,

  title               text not null check (char_length(title) between 3 and 120),
  body                text not null check (char_length(body) between 50 and 3000),

  -- Verification / moderation
  verify_token_hash   text,
  verify_expires_at   timestamptz,
  verified_at         timestamptz,
  approved_at         timestamptz,
  ip_hash             text,

  created_at          timestamptz not null default now()
);

create index course_reviews_course_status_idx on course_reviews (course_id, status, played_month desc);
create index course_reviews_status_idx        on course_reviews (status, created_at desc);
create index course_reviews_token_idx         on course_reviews (verify_token_hash);

-- One review per email, per course, per month played
create unique index course_reviews_one_per_month
  on course_reviews (course_id, lower(email), played_month)
  where status <> 'rejected';

-- No public access to the table itself — all writes go through the API with
-- the service role key, and public reads go through the view below.
alter table course_reviews enable row level security;

-- Public view: approved reviews only, no email / IP / token columns.
-- security_barrier + owner privileges let the anon key read it while the
-- underlying table stays locked.
create view course_reviews_public with (security_barrier = true) as
  select
    id, course_id, reviewer_name, country, handicap, played_month, group_type,
    rating_overall, rating_greens, rating_fairways, rating_tees_bunkers,
    rating_layout, rating_pace, rating_staff, rating_clubhouse, rating_value,
    round_time, buggy_rule, condition_flags, would_recommend,
    title, body, approved_at, created_at
  from course_reviews
  where status = 'approved';

grant select on course_reviews_public to anon, authenticated;
