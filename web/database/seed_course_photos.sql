-- Seed course hero photos
-- Generated 2026-06-02
-- Source: official course websites (og:image / hero banner images)

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'vilamoura-old-course'),
  'https://www.vilamouragolf.com/wp-content/uploads/2026/03/oldcourse-photos.jpg',
  'Vilamoura Old Course — scenic fairway and mature pine trees',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'vilamoura-pinhal'),
  'https://www.vilamouragolf.com/wp-content/uploads/2025/01/pinhal-photos-1.jpg',
  'Vilamoura Pinhal Course — tree-lined fairway through the pine forest',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'vilamoura-laguna'),
  'https://www.vilamouragolf.com/wp-content/uploads/2025/01/laguna-photos-2.jpg',
  'Vilamoura Laguna Course — water feature alongside a green fairway',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'vilamoura-millennium'),
  'https://www.vilamouragolf.com/wp-content/uploads/2025/01/millennium-photos-2.jpg',
  'Vilamoura Millennium Course — championship fairway with bunkers',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'victoria-els-club'),
  'https://www.elsclubvilamoura.com/wp-content/uploads/2024/11/full.png',
  'Victoria by Els Club Vilamoura — panoramic view of the championship course',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'vila-sol'),
  'https://pestanagolf.com/wp-content/uploads/2023/03/CH_VILASOL_IMG_1_F.jpg',
  'Vila Sol Golf Course — lush fairway lined with umbrella pines',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'quinta-do-lago-south'),
  'https://d14k3pdvyik68f.cloudfront.net/uploads/media/6b9c3b2fbaa1d5174ba324e2724dd525.jpg',
  'Quinta do Lago South Course — sweeping fairway view across the natural park',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'quinta-do-lago-north'),
  'https://d14k3pdvyik68f.cloudfront.net/uploads/media/7f971c161e7522a4f0ca8064626acdab_S3CgwVc.jpg',
  'Quinta do Lago North Course — fairway with views over the Ria Formosa',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'quinta-do-lago-laranjal'),
  'https://d14k3pdvyik68f.cloudfront.net/uploads/media/b3080cd0441eb569e9cfa02d8ad6ceb9.jpg',
  'Quinta do Lago Laranjal Course — cork oak trees framing a sunlit fairway',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'pinheiros-altos'),
  'https://www.pinheirosaltos.com/media/3099349/jjw-pinheiros-altos-golf-course-olives-hole-08.jpg',
  'Pinheiros Altos Golf — Olives Course hole 8 with ancient olive trees',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'san-lorenzo'),
  'https://www.sanlorenzogolfcourse.com/media/244134/san-lorenzo-golf-banner-hole-6-view.jpg',
  'San Lorenzo Golf Course — hole 6 with views over the Ria Formosa lagoon',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'vale-do-lobo-royal'),
  'https://www.valedolobo.com/wp-content/uploads/2024/03/20231116_LG_LiasonLTDPhotoShoot_EDT_063_FHD-1.webp',
  'Vale do Lobo Royal Golf Course — dramatic clifftop hole overlooking the Atlantic Ocean',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'vale-do-lobo-ocean'),
  'https://www.valedolobo.com/wp-content/uploads/2024/05/20170310_VDL_GeneralGolf_010_CCV-scaled.webp',
  'Vale do Lobo Ocean Golf Course — coastal fairway with golden sandy cliffs',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'balaia'),
  'https://www.balaiagolfvillage.com/media/dzzh0gad/golf_jj.jpg',
  'Balaia Golf Club — aerial view of the 9-hole course with Atlantic coast backdrop',
  0,
  true
);

-- Pine Cliffs blocks automated requests (HTTP 403); skipping

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'salgados'),
  'https://salgadosgolf.com/wp-content/uploads/2025/12/x-Salgados-13th-0042_D-copyweb-1024x575.jpg',
  'Salgados Golf Course — the 13th hole with coastal lagoon in the background',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'gramacho'),
  'https://pestanagolf.com/wp-content/uploads/2023/03/IMG_GRAMACHO_LISTA_F.jpg',
  'Gramacho Golf Course — rolling Algarve hills with well-manicured fairways',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'vale-da-pinta'),
  'https://pestanagolf.com/wp-content/uploads/2023/03/IMG_PINTA_LISTA_F.jpg',
  'Vale da Pinta Golf Course — ancient carob trees lining a wide fairway',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'vale-de-milho'),
  'https://valedemilhogolf.com/wp-content/uploads/2025/03/golf-vale-de-milho-915x610.jpg',
  'Vale de Milho Golf — compact 9-hole course near Carvoeiro with sea views',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'silves'),
  'https://pestanagolf.com/wp-content/uploads/2023/03/IMG_SILVES_LISTA_F.jpg',
  'Silves Golf Course — parkland-style fairways surrounded by orange groves',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'alto-golf'),
  'https://altoclub.com/hs-fs/hubfs/594919558.jpg?width=1024&height=685&name=594919558.jpg',
  'Alto Golf Course — panoramic view over the course towards the Algarve hills',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'alamos'),
  'https://assets.milestoneinternet.com/cdn-cgi/image/width=1800,height=600,f=auto/highgate-hotels/nau-hotels/siteimages/nau-hotels-and-resorts-alamos-golf-course.jpg',
  'Álamos Golf Course — 18-hole parkland course with Serra de Monchique views',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'morgado'),
  'https://assets.milestoneinternet.com/cdn-cgi/image/f=auto/highgate-hotels/nau-hotels/siteimages/nau-morgado-golf-country-club-world-class-golf-course.jpg',
  'Morgado Golf Course — championship layout surrounded by traditional tree species',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'penina-championship'),
  'https://www.penina.com/media/19384/Penina_Golf_17th_Hole.jpg',
  'Penina Sir Henry Cotton Championship Course — the iconic 17th hole',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'penina-resort'),
  'https://www.penina.com/media/19439/Championship-9.jpg',
  'Penina Resort Course — sunset over the 9th hole at Penina Hotel & Golf Resort',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'boavista'),
  'https://www.boavistaresort.pt/Images/Golf/Banner/04.jpg',
  'Boavista Golf Course — oceanfront fairway in Lagos, western Algarve',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'palmares'),
  'https://www.palmaresliving.com/wp-content/uploads/2025/04/slider-golf-palmares-1-min.jpg',
  'Palmares Golf Course — coastal links-style hole with Lagos Bay in the background',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'espiche'),
  'https://www.espichegolf.pt/wp-content/uploads/2024/07/EG_GOLF-53-scaled.jpg',
  'Espiche Golf Course — natural Algarve landscape with rolling fairways near Lagos',
  0,
  true
);

-- Santo Antonio (saresorts.com) blocks automated requests (HTTP 403); skipping

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'amendoeira-faldo'),
  'https://www.amendoeiraresort.com/uploads/info_landing/AGR_Faldo_13Tee_2.jpg',
  'Amendoeira Faldo Course — 13th tee with dramatic views across the Algarve countryside',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'amendoeira-oconnor'),
  'https://www.amendoeiraresort.com/uploads/info_landing/AGR_Oconner_Tee_18.jpg',
  'Amendoeira O''Connor Jnr. Course — 18th tee with sweeping course panorama',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'ombria'),
  'https://www.ombria.com/uploads/media/5dfe79a39cc4e67beabdbff53207be4e_fLXekq8.png',
  'Ombria Resort Golf Course — signature hole through natural cork oak landscape',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'benamor'),
  'https://www.benamorgolf.com/upload/photologue/photos/Foto_Website.png',
  'Benamor Golf Course — scenic fairway overlooking the Tavira coastline',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'quinta-da-ria'),
  'https://www.quintadaria.com/wp-content/uploads/2026/05/Foto-1.jpg',
  'Quinta da Ria Golf Course — coastal hole with views over the Ria Formosa nature park',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'quinta-de-cima'),
  'https://www.quintadaria.com/wp-content/uploads/2024/10/Golf_Quinta_de_Cima.jpg',
  'Quinta de Cima Golf Course — well-maintained parkland fairway in the eastern Algarve',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'monte-rei'),
  'https://www.monte-rei.com/media/2480/220608_monterei-day1_0075-edit_hg.jpg',
  'Monte Rei Golf & Country Club — Jack Nicklaus Signature Course hole with natural scrubland',
  0,
  true
);

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'quinta-do-vale'),
  'https://www.quintadovalegolf.com/wp-content/uploads/2025/07/Foto-1-3.jpg',
  'Quinta do Vale Golf Resort — scenic fairway in the Castro Marim region',
  0,
  true
);

-- Castro Marim site content truncated on fetch; skipping

insert into course_photos (course_id, url, alt, position, is_hero)
values (
  (select id from courses where slug = 'pestana-ferragudo'),
  'https://pestanaferragudo.com/wp-content/uploads/2025/05/clubhouse.png',
  'Pestana Ferragudo Golf — clubhouse and course landscape near Ferragudo village',
  0,
  true
);
