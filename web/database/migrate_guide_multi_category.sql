-- Switch guide_posts from a single category to multiple categories

alter table guide_posts add column categories text[] not null default '{}';

update guide_posts set categories = array[category] where category is not null;

alter table guide_posts drop column category;
