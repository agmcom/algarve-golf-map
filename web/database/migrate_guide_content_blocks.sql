-- Switch guide_posts body (plain text) to an ordered list of content blocks
-- (headings, paragraphs, inline photos) stored as jsonb, so articles get
-- real H2/H3 structure and photos placed exactly where the author wants them.

alter table guide_posts add column content jsonb not null default '[]'::jsonb;

update guide_posts
set content = case
  when body is not null and body <> '' then jsonb_build_array(jsonb_build_object('type', 'paragraph', 'text', body))
  else '[]'::jsonb
end;

alter table guide_posts drop column body;

-- Photos now live inline inside `content` blocks instead of a separate gallery
drop table if exists guide_post_photos;
