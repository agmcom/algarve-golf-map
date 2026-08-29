-- ============================================================
-- Guide posts (content hub — SEO articles linking into the map)
-- ============================================================

create table guide_posts (
  id              uuid primary key default gen_random_uuid(),

  title           text not null,
  slug            text not null unique,
  category        text not null,   -- course-guides / beginners / seasonal / planning / things-to-do

  excerpt         text,
  body            text,

  hero_image_url  text,
  hero_image_alt  text,

  published       boolean not null default false,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger guide_posts_updated_at
  before update on guide_posts
  for each row execute function set_updated_at();

create table guide_post_photos (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references guide_posts(id) on delete cascade,
  url         text not null,
  alt         text,
  position    int2 not null default 0,
  created_at  timestamptz not null default now()
);

alter table guide_posts enable row level security;
create policy "public can read published guide posts"
  on guide_posts for select
  using (published = true);

alter table guide_post_photos enable row level security;
create policy "public can read guide post photos"
  on guide_post_photos for select
  using (true);
