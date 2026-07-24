-- Migration: drop shops.type — categorization now comes from services/brands/course_id
alter table shops drop column if exists type;
drop type if exists shop_type;
