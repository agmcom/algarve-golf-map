-- ============================================================
-- fix_course_locations.sql
-- GPS coordinate verification for all 39 Algarve golf courses
--
-- Sources used:
--   - portugalgolf.net (primary — lists DMS coordinates per course)
--   - algarvegolfguide.co.uk (cross-reference)
--   - lecoingolf.fr, latlong.net, balaiagolf.com official
--
-- Coordinate format: make_point(lng, lat)
-- Generated: 2026-06-02
-- ============================================================


-- ── VILAMOURA CLUSTER ──────────────────────────────────────────────────────────

-- vilamoura-old-course
-- Source: portugalgolf.net  N 37º 6'5'' / W 8º 6'59'' → 37.1014, -8.1164
-- Current DB: 37.090, -8.115  ← WRONG (too far south, too far east)
update courses
set location = make_point(-8.1164, 37.1014)
where slug = 'vilamoura-old-course';

-- vilamoura-pinhal
-- Source: portugalgolf.net  N 37º 5'33'' / W 8º 6'42'' → 37.0927, -8.1117
-- Current DB: 37.087, -8.111  ← WRONG (latitude off by ~0.006)
update courses
set location = make_point(-8.1117, 37.0927)
where slug = 'vilamoura-pinhal';

-- vilamoura-laguna
-- Source: portugalgolf.net  N 37º 6'5'' / W 8º 6'59'' → 37.1016, -8.1166
-- Current DB: 37.091, -8.108  ← WRONG
update courses
set location = make_point(-8.1166, 37.1016)
where slug = 'vilamoura-laguna';

-- vilamoura-millennium
-- Source: algarvegolfguide.co.uk 37.1012, -8.1164
--         portugalgolf.net N 37º 6'28'' / W 8º 8'15'' → 37.1078, -8.1375
-- Note: algarvegolfguide.co.uk places Millennium closer to Laguna/Old Course
--       cluster; portugalgolf.net DMS gives a different position further west.
--       Using portugalgolf.net DMS value as primary.
-- Current DB: 37.089, -8.113  ← WRONG
update courses
set location = make_point(-8.1375, 37.1078)
where slug = 'vilamoura-millennium';

-- victoria-els-club (formerly Dom Pedro Victoria, now The Els Club Vilamoura)
-- Source: portugalgolf.net  N 37º 6'5'' / W 8º 8'39'' → 37.1016, -8.1444
-- Current DB: 37.093, -8.123  ← WRONG
update courses
set location = make_point(-8.1444, 37.1016)
where slug = 'victoria-els-club';


-- ── VILAMOURA EAST ────────────────────────────────────────────────────────────

-- vila-sol
-- Source: portugalgolf.net  N 37º 5'32'' / W 8º 5'41'' → 37.0923, -8.0948
-- Current DB: 37.097, -8.098  ← latitude wrong
update courses
set location = make_point(-8.0948, 37.0923)
where slug = 'vila-sol';


-- ── QUINTA DO LAGO / ALMANCIL CLUSTER ─────────────────────────────────────────

-- quinta-do-lago-south
-- Source: algarvegolfguide.co.uk  37.0332, -8.0116
--         portugalgolf.net  N 37º 2'44'' / W 8º 1'3'' → 37.0456, -8.0175
-- Note: algarvegolfguide gives the more precise clubhouse pin; portugalgolf
--       DMS appears to point toward the resort entrance. Using algarvegolfguide.
-- Current DB: 37.009, -8.022  ← WRONG (off by ~2.5 km south)
update courses
set location = make_point(-8.0116, 37.0332)
where slug = 'quinta-do-lago-south';

-- quinta-do-lago-north
-- Source: algarvegolfguide.co.uk  37.0345, -8.0098
-- Current DB: 37.014, -8.019  ← WRONG
update courses
set location = make_point(-8.0098, 37.0345)
where slug = 'quinta-do-lago-north';

-- quinta-do-lago-laranjal
-- Source: maptons.com (course-tagged map)  37.0595, -7.9982
-- Current DB: 37.010, -8.010  ← WRONG (off by ~5.5 km north-east — Laranjal
--             is in the Ludo valley east of the main resort)
update courses
set location = make_point(-7.9982, 37.0595)
where slug = 'quinta-do-lago-laranjal';

-- pinheiros-altos
-- Source: portugalgolf.net  N 37º 2'52'' / W 8º 0'28'' → 37.0478, -8.0078
-- Current DB: 37.007, -8.015  ← WRONG (off by ~4.5 km south)
update courses
set location = make_point(-8.0078, 37.0478)
where slug = 'pinheiros-altos';

-- san-lorenzo
-- Source: portugalgolf.net  N 37º 1'52'' / W 8º 0'41'' → 37.0313, -8.0116
-- Current DB: 37.030, -8.006  ← latitude roughly right, longitude off
update courses
set location = make_point(-8.0116, 37.0313)
where slug = 'san-lorenzo';


-- ── VALE DO LOBO ──────────────────────────────────────────────────────────────

-- vale-do-lobo-royal
-- Source: portugalgolf.net  N 37º 3'19'' / W 8º 3'50'' → 37.0554, -8.0641
-- Current DB: 37.022, -8.040  ← WRONG (off by ~3.7 km south)
update courses
set location = make_point(-8.0641, 37.0554)
where slug = 'vale-do-lobo-royal';

-- vale-do-lobo-ocean
-- Source: portugalgolf.net  N 37º 3'33'' / W 8º 3'31'' → 37.0594, -8.0586
-- Current DB: 37.025, -8.043  ← WRONG
update courses
set location = make_point(-8.0586, 37.0594)
where slug = 'vale-do-lobo-ocean';


-- ── ALBUFEIRA AREA ────────────────────────────────────────────────────────────

-- balaia
-- Source: balaiagolf.com official website  N 37º 5'34'' / W 8º 12'26'' → 37.0929, -8.2074
-- Current DB: 37.105, -8.198  ← WRONG (off by ~1.5 km north)
update courses
set location = make_point(-8.2074, 37.0929)
where slug = 'balaia';

-- pine-cliffs
-- Source: algarvegolfguide.co.uk  37.0926, -8.1834
-- Current DB: 37.093, -8.213  ← longitude wrong (off by ~2.7 km west)
update courses
set location = make_point(-8.1834, 37.0926)
where slug = 'pine-cliffs';

-- salgados
-- Source: algarvegolfguide.co.uk  37.0910, -8.3152
--         portugalgolf.net N 37º 5'35'' / W 8º 19'26'' → 37.0931, -8.3239
-- Note: Two close sources bracket around 37.092, -8.315. Using algarvegolfguide.
-- Current DB: 37.087, -8.250  ← longitude wrong (off by ~6.5 km east)
update courses
set location = make_point(-8.3152, 37.0910)
where slug = 'salgados';


-- ── CARVOEIRO / PESTANA AREA ──────────────────────────────────────────────────

-- gramacho
-- Source: portugalgolf.net  N 37º 7'29'' / W 8º 29'14'' → 37.1248, -8.4875
-- Current DB: 37.116, -8.472  ← both slightly off
update courses
set location = make_point(-8.4875, 37.1248)
where slug = 'gramacho';

-- vale-da-pinta
-- Source: portugalgolf.net  N 37º 7'57'' / W 8º 28'39'' → 37.1325, -8.4608
-- Current DB: 37.118, -8.468  ← both slightly off
update courses
set location = make_point(-8.4608, 37.1325)
where slug = 'vale-da-pinta';

-- vale-de-milho
-- Source: portugalgolf.net  N 37º 6'1'' / W 8º 26'58'' → 37.1003, -8.4496
-- Current DB: 37.102, -8.469  ← longitude off
update courses
set location = make_point(-8.4496, 37.1003)
where slug = 'vale-de-milho';


-- ── SILVES ────────────────────────────────────────────────────────────────────

-- silves
-- Source: portugalgolf.net  N 37º 9'57'' / W 8º 25'28'' → 37.1661, -8.4246
--         lecoingolf.fr confirms: 37.16610, -8.42450
-- Current DB: 37.155, -8.445  ← both off
update courses
set location = make_point(-8.4246, 37.1661)
where slug = 'silves';


-- ── PORTIMÃO / ALVOR AREA ─────────────────────────────────────────────────────

-- alto-golf
-- Source: portugalgolf.net  N 37º 7'35'' / W 8º 33'57'' → 37.1266, -8.5658
-- Current DB: 37.167, -8.532  ← both off
update courses
set location = make_point(-8.5658, 37.1266)
where slug = 'alto-golf';

-- alamos
-- Source: portugalgolf.net  N 37º 12'2'' / W 8º 33'55'' → 37.2006, -8.5655
-- Current DB: 37.174, -8.503  ← both off
update courses
set location = make_point(-8.5655, 37.2006)
where slug = 'alamos';

-- morgado
-- Source: portugalgolf.net  N 37º 11'47'' / W 8º 34'0'' → 37.1964, -8.5668
-- Current DB: 37.183, -8.501  ← both off
update courses
set location = make_point(-8.5668, 37.1964)
where slug = 'morgado';

-- penina-championship
-- Source: portugalgolf.net  N 37º 9'40'' / W 8º 34'52'' → 37.1611, -8.5811
-- Current DB: 37.134, -8.558  ← both off (~3 km south)
update courses
set location = make_point(-8.5811, 37.1611)
where slug = 'penina-championship';

-- penina-resort
-- Resort and Championship courses share the same Penina Hotel complex.
-- Using same coordinates as Championship course.
-- Source: portugalgolf.net  N 37º 9'40'' / W 8º 34'52'' → 37.1611, -8.5811
-- Current DB: 37.134, -8.558  ← WRONG
update courses
set location = make_point(-8.5811, 37.1611)
where slug = 'penina-resort';


-- ── LAGOS AREA ────────────────────────────────────────────────────────────────

-- boavista
-- Source: portugalgolf.net  N 37º 5'44'' / W 8º 42'11'' → 37.0956, -8.7033
-- Current DB: 37.113, -8.689  ← both off (~2 km north)
update courses
set location = make_point(-8.7033, 37.0956)
where slug = 'boavista';

-- palmares
-- Source: portugalgolf.net  N 37º 7'36'' / W 8º 38'28'' → 37.1267, -8.6413
-- Current DB: 37.109, -8.702  ← both off (longitude off by ~6 km east)
update courses
set location = make_point(-8.6413, 37.1267)
where slug = 'palmares';

-- espiche
-- Source: portugalgolf.net  N 37º 7'22'' / W 8º 45'9'' → 37.1228, -8.7525
-- Current DB: 37.099, -8.709  ← both off
update courses
set location = make_point(-8.7525, 37.1228)
where slug = 'espiche';


-- ── FAR WEST ──────────────────────────────────────────────────────────────────

-- santo-antonio (Parque da Floresta / Santo António Golf, Budens)
-- Source: portugalgolf.net  N 37º 5'6'' / W 8º 50'24'' → 37.0851, -8.8402
-- Current DB: 37.093, -8.826  ← both off
update courses
set location = make_point(-8.8402, 37.0851)
where slug = 'santo-antonio';


-- ── AMENDOEIRA RESORT ─────────────────────────────────────────────────────────

-- amendoeira-faldo
-- Source: portugalgolf.net  N 37º 8'53'' / W 8º 22'1'' → 37.1481, -8.3670
-- Current DB: 37.220, -8.448  ← WRONG (off by ~8 km north!)
update courses
set location = make_point(-8.3670, 37.1481)
where slug = 'amendoeira-faldo';

-- amendoeira-oconnor
-- Both Faldo and O'Connor Jnr courses are within the same resort at Alcantarilha.
-- No distinct official GPS coordinates found for the O'Connor course separately.
-- Using resort-level coordinates from latlong.net: 37.1468, -8.3587
-- (very close to Faldo; both courses share entry at Morgado da Lameira)
-- Current DB: 37.218, -8.445  ← WRONG (same 8-km north error as Faldo)
update courses
set location = make_point(-8.3587, 37.1468)
where slug = 'amendoeira-oconnor';


-- ── LOULÉ INLAND ──────────────────────────────────────────────────────────────

-- ombria
-- Source: portugalgolf.net  N 37º 11'34'' / W 8º 0'35'' → 37.1928, -8.0099
-- Current DB: 37.197, -8.055  ← longitude off by ~4.5 km
update courses
set location = make_point(-8.0099, 37.1928)
where slug = 'ombria';


-- ── EASTERN ALGARVE (TAVIRA / VRSA) ───────────────────────────────────────────

-- benamor
-- Source: algarvegolfguide.co.uk  37.1457, -7.6351
-- Current DB: 37.153, -7.642  ← close but both slightly off
update courses
set location = make_point(-7.6351, 37.1457)
where slug = 'benamor';

-- quinta-da-ria
-- Source: portugalgolf.net  N 37º 9'23'' / W 7º 34'1'' → 37.1566, -7.5671
-- Current DB: 37.163, -7.620  ← longitude off
update courses
set location = make_point(-7.5671, 37.1566)
where slug = 'quinta-da-ria';

-- quinta-de-cima
-- Source: portugalgolf.net  N 37º 10'3'' / W 7º 33'1'' → 37.1677, -7.5505
-- Current DB: 37.161, -7.618  ← longitude off
update courses
set location = make_point(-7.5505, 37.1677)
where slug = 'quinta-de-cima';

-- monte-rei
-- Source: portugalgolf.net  N 37º 12'30'' / W 7º 32'57'' → 37.2085, -7.5492
-- Current DB: 37.175, -7.469  ← both off
update courses
set location = make_point(-7.5492, 37.2085)
where slug = 'monte-rei';

-- quinta-do-vale
-- Source: algarvegolfguide.co.uk  37.2509, -7.4703
-- Current DB: 37.168, -7.552  ← both off (~9 km south)
update courses
set location = make_point(-7.4703, 37.2509)
where slug = 'quinta-do-vale';

-- castro-marim
-- Source: portugalgolf.net  N 37º 14'9'' / W 7º 28'9'' → 37.2359, -7.4693
-- Current DB: 37.218, -7.449  ← both off
update courses
set location = make_point(-7.4693, 37.2359)
where slug = 'castro-marim';


-- ── NEW COURSE (SOFT OPENING JUNE 2026) ───────────────────────────────────────

-- pestana-ferragudo
-- Source: portugalgolf.net  N 37º 8'5'' / W 8º 29'49'' → 37.1347, -8.4969
-- Note: course listed as "Soft Opening June 2026" — coordinates from official
--       listing, located between Carvoeiro and Ferragudo village.
-- Current DB: 37.117, -8.527  ← both off
update courses
set location = make_point(-8.4969, 37.1347)
where slug = 'pestana-ferragudo';
