-- Migration: shops.rental_only + shops.retail_website, plus the shop data checked on 2026-11-05.
--
-- rental_only: the business hires clubs but has no golf shop to visit and buy from.
--   Golf shop lists and map pins leave these out; /club-rental still shows them.
-- retail_website: separate sales site, for shops whose main website is about hire only.

begin;

alter table shops
  add column if not exists rental_only boolean not null default false,
  add column if not exists retail_website text;

update shops set rental_only = true
where slug in (
  'blue-sky-golf-shop',
  'clubstohire-faro-airport',
  'faro-golf-club-hire',
  'green-tee-vilamoura',
  'lagos-golf-club-hire',
  'mycaddymaster-faro-airport',
  'up-n-down-golf'
);

-- Blue Sky: its old domain now redirects to a rental-only site.
update shops set
  website = 'https://blueskygolf-rental.com/',
  services = '{rental}',
  description = 'Golf club rental company based in Loulé, operating across Portugal and Spain, with more than 1,000 sets to choose from. Clubs are delivered to you and collected at the end of your hire.'
where slug = 'blue-sky-golf-shop';

-- Lagos Golf Shop: same address, phone and email, now on a new website.
update shops set website = 'https://www.golfclubsrentalalgarve.com/'
where slug = 'lagos-golf-shop';

-- 18 Store: 18store.pt covers hire only; clubs are sold on a separate site.
update shops set retail_website = 'https://18storegolfsales.com/'
where slug = '18-store-golf-shop';

-- Alvor: Saturday afternoon hours, from the official website.
update shops set opening_hours = 'Mon–Fri 9:30–13:00 & 15:00–18:30; Sat 9:30–13:00 & 15:00–17:00; Sun closed'
where slug = 'alvor-golf-shop';

commit;

select name, rental_only, retail_website, website from shops where active order by rental_only desc, name;
