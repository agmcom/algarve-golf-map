-- ============================================================
-- update_courses_scraped.sql
-- Scraped course data: blurb, description, website, phone,
-- course_type, length_meters, handicap_required, driving_range,
-- caddie_service, dress_code
-- Generated: 2026-06-02
-- ============================================================


-- ── VILAMOURA ────────────────────────────────────────────────────────────────

update courses set
  blurb = 'The Algarve''s original championship layout, opened in 1969 and still one of the finest in Portugal.',
  description = 'Designed by Frank Pennink and set among mature umbrella pines, the Old Course is a timeless parkland classic. Rolling fairways, subtle elevation changes, and five par-5s reward strategic play over brute force. The course hosted multiple Portuguese Opens and was awarded Portugal''s Best Golf Course at the 2025 World Golf Awards. Maximum handicap 28 men / 36 ladies.',
  website = 'https://www.vilamouragolf.com/en/golf-courses/old-course/',
  phone = '+351 289 310 333',
  course_type = 'parkland',
  length_meters = 6254,
  handicap_required = 28,
  driving_range = false,
  dress_code = 'Collared shirt, tailored shorts or trousers, soft spikes required. No denim, t-shirts or beachwear.'
where slug = 'vilamoura-old-course';

update courses set
  blurb = 'A classic pine-lined parkland course refined by Robert Trent Jones Sr., home to the Vilamoura Golf Academy.',
  description = 'Originally designed by Frank Pennink in 1976 and later updated by Robert Trent Jones Sr., the Pinhal is a quintessential Algarve parkland layout. Umbrella pines frame every hole, elevation changes keep the game interesting, and the academy driving range makes it ideal for practising between rounds. Maximum handicap 28 men / 36 ladies.',
  website = 'https://www.vilamouragolf.com/en/golf-courses/pinhal/',
  phone = '+351 289 310 390',
  course_type = 'parkland',
  length_meters = 6353,
  handicap_required = 28,
  driving_range = true,
  dress_code = 'Collared shirt, tailored shorts or trousers, soft spikes required. No denim, t-shirts or beachwear.'
where slug = 'vilamoura-pinhal';

update courses set
  blurb = 'A links-flavoured layout with 79 bunkers and 11 water-influenced holes on Vilamoura''s open coastal plain.',
  description = 'Designed by Joseph Lee and opened in 1990, the Laguna breaks the Vilamoura mould with its exposed, water-rich character. Few trees leave the wind as a constant factor, while eleven holes border the course''s numerous lakes and an impressive 79 bunkers demand precision from tee to green. A refreshing change of pace from its pine-clad neighbours. Maximum handicap 28 men / 36 ladies.',
  website = 'https://www.vilamouragolf.com/en/golf-courses/laguna/',
  phone = '+351 289 310 180',
  course_type = 'links',
  length_meters = 6121,
  handicap_required = 28,
  driving_range = false,
  dress_code = 'Collared shirt, tailored shorts or trousers, soft spikes required. No denim, t-shirts or beachwear.'
where slug = 'vilamoura-laguna';

update courses set
  blurb = 'Vilamoura''s most modern layout — lush, tree-lined, and beautifully conditioned for all abilities.',
  description = 'The Millennium is Vilamoura''s newest parkland course, featuring wide fairways framed by mature trees and immaculate greens. Its approachable layout suits mid-to-high handicappers while still offering enough challenge to satisfy low markers. The course shares a relaxed clubhouse terrace with Laguna, overlooking the closing holes. Maximum handicap 28 men / 36 ladies.',
  website = 'https://www.vilamouragolf.com/en/golf-courses/millennium/',
  phone = '+351 289 310 188',
  course_type = 'parkland',
  length_meters = 6176,
  handicap_required = 28,
  driving_range = false,
  dress_code = 'Collared shirt, tailored shorts or trousers, soft spikes required. No denim, t-shirts or beachwear.'
where slug = 'vilamoura-millennium';

update courses set
  blurb = 'Europe''s first Ernie Els signature design — a private members'' club where a forecaddie is mandatory for every group.',
  description = 'The Els Club Vilamoura is Ernie Els'' first design in Europe, a redesign of the former Victoria Course that opened to founder members in July 2025. The championship par-72 layout stretches to 6,651 metres from the Palmer tees, weaving through cork oaks and umbrella pines with wide, strategic fairways. Access for visitors is extremely limited and only available through the hotel partner programme. A forecaddie is compulsory for every group of four.',
  website = 'https://www.elsclubvilamoura.com/',
  phone = '+351 289 320 100',
  course_type = 'parkland',
  length_meters = 6651,
  driving_range = false,
  caddie_service = true,
  dress_code = 'Smart golf attire required; collared shirt, soft spikes mandatory.'
where slug = 'victoria-els-club';

update courses set
  blurb = 'A prestigious 27-hole Donald Steel parkland course weaving through a vast pine forest near Vilamoura.',
  description = 'Vila Sol was inaugurated in 1991 and designed by Donald Steel across 75 acres of natural Algarve landscape. Three nine-hole loops — Prime, Challenge, and Prestige — offer different levels of difficulty and can be combined in any pairing. Narrow pine-lined fairways and a beautiful driving range make this a favourite for both practice and competitive play. Maximum handicap 27 men / 35 ladies.',
  website = 'https://pestanagolf.com/clubhouses/clubhouse-vila-sol/',
  phone = '+351 289 300 505',
  course_type = 'parkland',
  handicap_required = 27,
  driving_range = true,
  dress_code = 'Collared shirt, tailored shorts or trousers, soft spikes required. No denim, t-shirts or beachwear.'
where slug = 'vila-sol';


-- ── QUINTA DO LAGO ───────────────────────────────────────────────────────────

update courses set
  blurb = 'Eight-time host of the Portuguese Open, the South Course is Quinta do Lago''s most storied championship test.',
  description = 'Set among umbrella pines, lakes, and wild flowers overlooking the Ria Formosa Natural Park, Quinta do Lago South is one of the Algarve''s most celebrated parkland courses. The front nine favours a draw through tight woodland while the back nine loops around the resort lake, demanding a fade. With a handicap ceiling of 24 for men, it is one of the stricter courses in the area. Caddie hire is available.',
  website = 'https://www.quintadolago.com/en/golf/golf-courses-south/',
  phone = '+351 289 390 700',
  course_type = 'parkland',
  length_meters = 6500,
  handicap_required = 24,
  driving_range = true,
  caddie_service = true,
  dress_code = 'Collared shirt, tailored shorts or trousers, soft spikes mandatory.'
where slug = 'quinta-do-lago-south';

update courses set
  blurb = 'Completely redesigned in 2014 by Beau Welling and Paul McGinley, the North Course sets a modern benchmark for Algarve golf.',
  description = 'A €9 million redesign led by architect Beau Welling with former European Ryder Cup captain Paul McGinley transformed this course into one of the region''s most dynamic layouts. Four tee options on every hole cater to all abilities, while strategic bunkering, undulating greens, and water hazards test even the lowest of handicappers. The course is open daily from 7:00 to 20:30.',
  website = 'https://www.quintadolago.com/en/golf/golf-courses-north/',
  phone = '+351 289 390 705',
  course_type = 'parkland',
  length_meters = 6140,
  handicap_required = 28,
  driving_range = true,
  dress_code = 'Collared shirt, tailored shorts or trousers, soft spikes mandatory.'
where slug = 'quinta-do-lago-north';

update courses set
  blurb = 'Winner of the 2011 Portuguese Travel Awards Best Golf Course, Laranjal was carved from an ancient orange grove.',
  description = 'Opened in 2009 on land that was once a working orange grove, the Laranjal is the most picturesque of the Quinta do Lago trio. Five par-5s, eight par-4s, and five par-3s roll through five lakes, cork oaks, umbrella pines, and the original orange trees. Penn A4 bentgrass greens provide fast, true putting surfaces year-round. The course covers 6,480 metres from the championship tees.',
  website = 'https://www.quintadolago.com/en/golf/golf-courses-laranjal/',
  phone = '+351 289 390 705',
  course_type = 'parkland',
  length_meters = 6480,
  driving_range = true,
  dress_code = 'Collared shirt, tailored shorts or trousers, soft spikes mandatory.'
where slug = 'quinta-do-lago-laranjal';

update courses set
  blurb = 'A 27-hole luxury parkland resort set deep in the Ria Formosa nature reserve, bordering the unspoilt beaches of Quinta do Lago.',
  description = 'Pinheiros Altos sits in an exclusive corner of the Ria Formosa, offering three contrasting nine-hole loops — Corks, Pines, and Olives — each a par 36. The Pines nine is the most traditional parkland loop with dog-legs, elevation, and lakeside holes; the Corks and Olives nines add Mediterranean scrub and cork-oak backdrops. Two driving ranges and a fully equipped golf academy round out the facilities.',
  website = 'https://www.pinheirosaltos.com/',
  phone = '+351 289 359 900',
  course_type = 'parkland',
  length_meters = 6044,
  driving_range = true,
  dress_code = 'Collared shirt, tailored shorts or trousers, soft spikes required.'
where slug = 'pinheiros-altos';

update courses set
  blurb = 'One of the Algarve''s most exclusive courses, San Lorenzo hugs the Ria Formosa estuary in an unspoilt corner of Quinta do Lago.',
  description = 'Designed by Joseph Lee and Rocky Roquemore in 1988, San Lorenzo sits in the south-east corner of the Quinta do Lago estate, its fairways bounded by the Ria Formosa salt-water lagoons. The figure-of-eight layout weaves through undulating pine woodland with strategic water hazards and a stiff handicap ceiling of 28 for men. Tee times are spaced eight minutes apart to keep the round exclusive, and caddie hire is available on request.',
  website = 'https://sanlorenzogolfcourse.com/',
  phone = '+351 289 396 522',
  course_type = 'parkland',
  length_meters = 6238,
  handicap_required = 28,
  driving_range = true,
  caddie_service = true,
  dress_code = 'No t-shirts, jeans or tennis shoes. Soft spikes mandatory.'
where slug = 'san-lorenzo';


-- ── VALE DO LOBO ─────────────────────────────────────────────────────────────

update courses set
  blurb = 'Home to the Algarve''s most iconic hole — a 235-yard carry over three dramatic cliffs on the famous 16th.',
  description = 'The Royal Course at Vale do Lobo was designed by Rocky Roquemore on the footprint of Sir Henry Cotton''s original layout and reopened in 1997. Its rolling clifftop terrain, pine-lined fairways, and coastal lakes culminate in the legendary 16th hole, where the tee sits atop three crumbling sandstone cliffs above the Atlantic. At 6,059 metres par 72 it is both visually spectacular and technically demanding. Maximum handicap 24 men / 28 ladies.',
  website = 'https://www.valedolobo.com/en/golf-course/royal-golf-course/',
  phone = '+351 289 353 000',
  course_type = 'clifftop',
  length_meters = 6059,
  handicap_required = 24,
  driving_range = true,
  dress_code = 'Collared shirt, tailored shorts or trousers, soft spikes required.'
where slug = 'vale-do-lobo-royal';

update courses set
  blurb = 'A links-style coastal course rolling alongside the Ria Formosa nature reserve, with the Atlantic as a constant backdrop.',
  description = 'The Ocean Course comprises two original Sir Henry Cotton nine-hole layouts from 1968 and 1972, now combined into a single par-73 championship test of 6,137 metres. Undulating fairways descend gently towards the Atlantic, with classic links-style bunkering and exposed greens that pick up the coastal breeze. A 245-metre driving range is available to warm up before your round. Maximum handicap 24 men / 28 ladies.',
  website = 'https://www.valedolobo.com/en/golf-course/ocean-golf-course/',
  phone = '+351 289 353 000',
  course_type = 'links',
  length_meters = 6137,
  handicap_required = 24,
  driving_range = true,
  dress_code = 'Collared shirt, tailored shorts or trousers, soft spikes required.'
where slug = 'vale-do-lobo-ocean';


-- ── ALBUFEIRA AREA ───────────────────────────────────────────────────────────

update courses set
  blurb = 'A friendly 9-hole par-27 course perfect for beginners or short-game practice, set within the Balaia resort village.',
  description = 'Balaia Golf Club is an 9-hole, all par-3 layout inaugurated in 2001, sitting within the lush grounds of the Balaia Golf Village. Holes range from 58 to 160 metres, making it ideal for juniors, beginners, and golfers looking to sharpen distance control. A 40-bay driving range and golf academy are on site. No handicap certificate required.',
  website = 'https://www.balaiagolfvillage.com/en/balaia-golf-club/',
  phone = '+351 289 570 200',
  course_type = 'resort',
  driving_range = true,
  dress_code = 'Smart casual golf attire.'
where slug = 'balaia';

update courses set
  blurb = 'Nine spectacular cliff-top holes above the Atlantic, including the legendary par-3 Devil''s Parlour.',
  description = 'Pine Cliffs is a nine-hole clifftop course perched 60 metres above the Atlantic, designed by Martin Hawtree and set within a luxury Marriott resort. Six of the nine holes are par-3s, making it accessible to all handicaps, yet the 197-metre carry over the ravine on the sixth hole (Devil''s Parlour) never loses its drama. The course can be played as 18 holes by completing two loops.',
  website = 'https://www.pinecliffs.com/en/golf-sports/golf/',
  phone = '+351 289 500 113',
  course_type = 'clifftop',
  driving_range = false,
  dress_code = 'Smart golf attire required.'
where slug = 'pine-cliffs';

update courses set
  blurb = 'An undulating parkland course nestled beside the protected Salgados Lagoon nature reserve near Galé beach.',
  description = 'Salgados Golf opened in 1994 and was designed by Pedro Vasconcelos on flat coastal terrain behind the sands of Praia de Galé. Water hazards feature on virtually every hole and the adjacent Salgados Lagoon nature reserve brings outstanding birdlife to the round. At 6,140 metres par 72 it plays longer than its flat appearance suggests and precision is essential off the tee. Maximum handicap 28 men / 36 ladies.',
  website = 'https://salgadosgolf.com/',
  phone = '+351 289 591 111',
  course_type = 'parkland',
  length_meters = 6140,
  handicap_required = 28,
  driving_range = true,
  dress_code = 'Golf attire required; soft spikes mandatory.'
where slug = 'salgados';


-- ── CARVOEIRO / PESTANA COURSES ──────────────────────────────────────────────

update courses set
  blurb = 'A uniquely configured course with 27 greens and multiple tee options, co-designed by Nick Price and Ronald Fream.',
  description = 'Pestana Gramacho was co-designed by world number one golfer Nick Price and renowned architect Ronald Fream, opening alongside its sister course Vale da Pinta. The clever 27-green configuration means players can revisit the same holes with entirely different approach shots. Ancient carob, almond, and olive trees line the fairways while artfully positioned lakes and bunkers provide strategic challenge. Maximum handicap 28 men / 36 ladies.',
  website = 'https://pestanagolf.com/gramacho/',
  phone = '+351 282 340 900',
  course_type = 'parkland',
  length_meters = 6107,
  handicap_required = 28,
  driving_range = true,
  dress_code = 'No casual shorts, jeans, sleeveless shirts or tracksuits. Proper golf shoes required.'
where slug = 'gramacho';

update courses set
  blurb = 'Ancient olive, almond, and carob trees line a rolling Algarve valley on one of the region''s most atmospheric courses.',
  description = 'Designed by Ronald Fream and opened in 1992, Vale da Pinta is among the most characterful courses in the Algarve. Centuries-old olive and carob trees survive as living obstacles throughout the layout, while two lakes influence four holes and strategic dog-legs demand accurate driving. The course plays 6,127 metres par 71, with bent-grass greens that hold their pace year-round. Maximum handicap 27 men / 35 ladies.',
  website = 'https://pestanagolf.com/golf/#vale-da-pinta',
  phone = '+351 282 340 900',
  course_type = 'parkland',
  length_meters = 6127,
  handicap_required = 27,
  driving_range = true,
  dress_code = 'No casual shorts, jeans, sleeveless shirts or tracksuits. Proper golf shoes required.'
where slug = 'vale-da-pinta';

update courses set
  blurb = 'A short, fun par-27 nine-hole course in a picturesque valley above the Atlantic village of Carvoeiro.',
  description = 'Vale de Milho is a compact nine-hole par-3 course measuring just 846 metres, sitting on a hillside with views over the Atlantic near the village of Carvoeiro. All nine holes are par-3s ranging from 60 to 145 metres, making it a superb short-game arena for players of all abilities. A second nine-hole loop is available via a par-35 variation for juniors and groups looking for more variety.',
  website = 'https://valedemilhogolf.com/',
  phone = '+351 282 358 502',
  course_type = 'resort',
  driving_range = false,
  dress_code = 'Smart casual golf attire.'
where slug = 'vale-de-milho';

update courses set
  blurb = 'A parkland jewel at the foot of the Monchique mountains, with exceptional year-round conditions and precision-testing greens.',
  description = 'Silves Golf is a Pestana-operated parkland course that opened in 2006 on gently hilly terrain near the ancient Moorish town of Silves. Panoramic views over orange and olive groves accompany a layout that rewards accuracy over power, with a standout selection of par-3s and four memorable par-5s. The course plays 5,615 metres par 70 and is praised for its consistently excellent conditioning. Maximum handicap 24 men / 28 ladies.',
  website = 'https://pestanagolf.com/golf/#silves-golf',
  phone = '+351 282 440 130',
  course_type = 'parkland',
  length_meters = 5615,
  handicap_required = 24,
  driving_range = false,
  dress_code = 'Golf attire required; no t-shirts, denim or tennis shoes.'
where slug = 'silves';


-- ── PORTIMÃO / WEST CENTRAL ──────────────────────────────────────────────────

update courses set
  blurb = 'Sir Henry Cotton''s final Algarve design — a par-70 parkland challenge that spans two valleys with a legendary 604-metre par-5.',
  description = 'Alto Golf was designed by Sir Henry Cotton and inaugurated in 1991, making it his last course in the Algarve. The par-70 layout spans two gently sloping valleys and includes the Sir Henry Cotton Challenge — a 604-metre par-5 described as one of the longest in Europe — which demands three long, accurate shots to avoid the lake and hold the angled green. From the back tees the course plays 6,125 metres.',
  website = 'https://altoclub.com/',
  phone = '+351 282 460 870',
  course_type = 'parkland',
  length_meters = 6125,
  driving_range = false,
  dress_code = 'Golf attire required; soft spikes mandatory.'
where slug = 'alto-golf';

update courses set
  blurb = 'A wide, generous links-inspired parkland course in a tranquil valley north of Portimão, with flat bunkers and large greens.',
  description = 'Set in a peaceful valley 4 km north of Portimão, Alamos Golf was designed by Russell Talley (European Golf Design) and opened in 2006. Narrower fairways than its sister course Morgado wind between native trees with views across a reservoir to the Serra de Monchique. The par-71 layout stretches 5,710 metres and shares a dual driving range and practice complex with Morgado as part of the NAU Golf & Country Club. Maximum handicap 28 men / 36 ladies.',
  website = 'https://www.nauhotels.com/en/golf/alamos-golf',
  phone = '+351 282 788 075',
  course_type = 'parkland',
  length_meters = 5710,
  handicap_required = 28,
  driving_range = true,
  dress_code = 'Golf attire required; soft spikes mandatory.'
where slug = 'alamos';

update courses set
  blurb = 'A scenic highland parkland course in a calm valley near Portimão, with generous fairways and large putting surfaces.',
  description = 'Morgado Golf occupies a serene valley north of Portimão and plays 6,399 metres par 73 from the championship tees. The layout was inspired by Scotland''s links tradition — wide, flat fairways, deep pot bunkers, and large undulating greens that test putting from all angles. Exceptional practice facilities including a driving range and putting greens complement the round. Maximum handicap 24 men / 28 ladies.',
  website = 'https://www.morgadogolfhotel.com/en/morgado_golf.html',
  phone = '+351 282 402 150',
  course_type = 'parkland',
  length_meters = 6399,
  handicap_required = 24,
  driving_range = true,
  dress_code = 'Collared shirt, tailored shorts or trousers, soft spikes required. No denim, t-shirts or beachwear.'
where slug = 'morgado';

update courses set
  blurb = 'The Algarve''s first 18-hole course, designed by Sir Henry Cotton and host of ten Portuguese Opens.',
  description = 'The Sir Henry Cotton Championship Course at Penina was designed by the three-time British Open champion himself and opened in 1966, the first of its kind in the Algarve. Set among rice paddies converted into water hazards and streams, the flat but deceptive par-73 layout plays 6,273 metres from the white tees. The course has hosted the Portuguese Open ten times and remains one of the region''s most prestigious rounds. Maximum handicap 28 men / 36 ladies.',
  website = 'https://www.penina.com/golf/golf-courses/sir-henry-cotton-championship-course/',
  phone = '+351 282 420 200',
  course_type = 'parkland',
  length_meters = 6273,
  handicap_required = 28,
  driving_range = true,
  dress_code = 'No t-shirts, jeans or tennis shoes. Soft spikes mandatory.'
where slug = 'penina-championship';

update courses set
  blurb = 'A relaxed, beginner-friendly 9-hole course across the road from the Penina Hotel — no handicap certificate required.',
  description = 'The Penina Resort Course is a gentler nine-hole, par-35 loop located across the road from the flagship hotel, originally conceived by Sir Henry Cotton as a warm-up loop for the championship layout. At 1,851 metres it plays quickly and is ideal for families, beginners, or golfers wanting a leisurely evening round. No handicap certificate is required. Penina''s acclaimed driving range, two chipping greens, and practice bunker are shared by both courses.',
  website = 'https://www.penina.com/golf/golf-courses/resort-course/',
  phone = '+351 282 420 200',
  course_type = 'resort',
  length_meters = 1851,
  driving_range = true,
  dress_code = 'Proper golf attire required; no t-shirts, jeans or tennis shoes.'
where slug = 'penina-resort';


-- ── LAGOS / WESTERN ALGARVE ──────────────────────────────────────────────────

update courses set
  blurb = 'A modern par-71 course above Lagos with Atlantic and Monchique mountain views, designed by Howard Swan.',
  description = 'Boavista Golf opened in 2002 close to the town of Lagos and offers two distinct sections: a resort nine threading through the residential complex and a country nine that climbs through rolling cork-oak terrain. Designed by Howard Swan, the par-71 layout plays 6,053 metres from the championship tees. A quality practice ground with three full-size chipping greens rounds out the facilities.',
  website = 'https://www.boavistaresort.pt/en/Menu/Golf/About-the-Course.aspx',
  phone = '+351 282 000 111',
  course_type = 'parkland',
  length_meters = 6053,
  driving_range = true,
  dress_code = 'Collared shirt, tailored shorts or trousers, soft spikes required.'
where slug = 'boavista';

update courses set
  blurb = 'Three nine-hole loops — parkland, lakes, and links — with sweeping Atlantic views, redesigned by Robert Trent Jones Jr.',
  description = 'Palmares was originally established in the 1970s and underwent a full redesign by Robert Trent Jones Jr., reopening as a 27-hole layout with the Alvor, Lagos, and Praia nines. The Praia nine offers spectacular ocean and estuary vistas in a genuine links style, while the other two loops wind through parkland and lake-side terrain. A 300-yard driving range with elevated tees and sea views is one of the best practice facilities in the region. Total championship length 6,514 metres par 72. Maximum handicap 28 men / 36 ladies.',
  website = 'https://www.palmaresliving.com/golf/golf-course/',
  phone = '+351 282 790 500',
  course_type = 'links',
  length_meters = 6514,
  handicap_required = 28,
  driving_range = true,
  caddie_service = true,
  dress_code = 'Collared shirt, tailored shorts or trousers, soft spikes required.'
where slug = 'palmares';

update courses set
  blurb = 'An eco-friendly parkland course with vineyard and mountain views in the unspoilt western Algarve countryside.',
  description = 'Espiche Golf opened in 2012 as an eco-resort course, designed by South African architect Peter Sauerman across 5,890 metres par 72. The parkland layout integrates seamlessly into the indigenous Algarve landscape with views of local vineyards and the distant Monchique Mountains. A recently renovated grass-tee driving range, short-game area, and putting green complete the practice facilities. Maximum handicap 28 men / 36 ladies.',
  website = 'https://www.espichegolf.pt/en/',
  phone = '+351 282 688 250',
  course_type = 'parkland',
  length_meters = 5890,
  handicap_required = 28,
  driving_range = true,
  dress_code = 'Golf attire required; soft spikes mandatory.'
where slug = 'espiche';

update courses set
  blurb = 'The most westerly course in the Algarve — an undulating 18-hole test stretching over the hills behind the fishing village of Salema.',
  description = 'Santo António Golf sits in a secluded valley above the Atlantic fishing village of Salema near Lagos, making it the most westerly course in the Algarve. The par-71 layout plays 5,712 metres through undulating countryside that has hosted the prestigious European Challenge Tour. A full golf academy with driving range, putting green, and PGA professional on site makes this a superb destination for golfers of all abilities.',
  website = 'https://www.saresorts.com/',
  phone = '+351 282 690 054',
  course_type = 'parkland',
  length_meters = 5712,
  driving_range = true,
  dress_code = 'Golf attire required.'
where slug = 'santo-antonio';


-- ── SILVES / ALCANTARILHA ────────────────────────────────────────────────────

update courses set
  blurb = 'A championship Nick Faldo design rewarding tactical play across 6,578 metres of Mediterranean parkland.',
  description = 'The Faldo Course at Amendoeira Golf Resort was designed by Sir Nick Faldo and features rocky outcrops, Mediterranean scrub, and strategically bunkered greens across a par-72 layout measuring 6,578 metres. A demanding but fair test that prioritises shot placement over raw distance, it regularly features on lists of the Algarve''s best courses. On-site facilities include a full driving range, short-game area, and high-tech performance centre. Maximum handicap 28 men / 36 ladies.',
  website = 'https://www.amendoeiraresort.com/en/golf/',
  phone = '+351 282 320 800',
  course_type = 'parkland',
  length_meters = 6578,
  handicap_required = 28,
  driving_range = true,
  dress_code = 'Golf attire required; soft spikes mandatory.'
where slug = 'amendoeira-faldo';

update courses set
  blurb = 'A welcoming resort layout designed by Christy O''Connor Jr., offering variety and playability for all handicap levels.',
  description = 'The O''Connor Jnr Course at Amendoeira was designed by Christy O''Connor Jr. and opened in 2008. At 6,273 metres par 72 from the white tees, it is slightly shorter and more forgiving than the Faldo Course next door, making it popular with mid- and high-handicappers. Four tee options accommodate golfers of all abilities, and the course shares Amendoeira''s excellent practice facilities and clubhouse. Maximum handicap 28 men / 36 ladies.',
  website = 'https://www.amendoeiraresort.com/en/golf/',
  phone = '+351 282 320 800',
  course_type = 'parkland',
  length_meters = 6273,
  handicap_required = 28,
  driving_range = true,
  dress_code = 'Golf attire required; soft spikes mandatory.'
where slug = 'amendoeira-oconnor';

update courses set
  blurb = 'An award-winning sustainable course by Jorge Santana da Silva, weaving through ancient cork oaks in the hills above Loulé.',
  description = 'Ombria opened in April 2023 to immediate acclaim, winning Best New Golf Course at the World Golf Awards. Designed by Jorge Santana da Silva with an unwavering GEO-certified sustainability ethos, the par-71 course plays 5,802 metres through a spectacular inland landscape of ancient rivers, indigenous trees, and cork-oak woodland. The resort is managed by Viceroy Hotels & Resorts. No driving range on site.',
  website = 'https://www.ombria.com/en/golf/golf-course/',
  phone = '+351 289 413 900',
  course_type = 'parkland',
  length_meters = 5802,
  driving_range = false,
  dress_code = 'Golf attire required.'
where slug = 'ombria';


-- ── EASTERN ALGARVE ──────────────────────────────────────────────────────────

update courses set
  blurb = 'Sir Henry Cotton''s posthumous masterpiece — an 18-hole parkland course with views to the Atlantic near Tavira.',
  description = 'Benamor Golf, near Tavira, was designed by Sir Henry Cotton and completed posthumously after his death in 1987, opening to play in 2000. The par-71 layout plays 5,456 metres across gently undulating terrain with views to the Atlantic and inland to the Serra do Caldeirão hills. Strategic bunkering and occasional water hazards keep the round engaging without ever being overwhelming. A driving range is available on site. Maximum handicap 28 men / 36 ladies.',
  website = 'https://www.benamorgolf.com/en/',
  phone = '+351 281 320 880',
  course_type = 'parkland',
  length_meters = 5456,
  handicap_required = 28,
  driving_range = true,
  dress_code = 'Golf attire required; soft spikes mandatory.'
where slug = 'benamor';

update courses set
  blurb = 'An 18-hole bentgrass course nestled within the Ria Formosa Natural Park, between the Atlantic and the Guadiana River.',
  description = 'Quinta da Ria was designed by Rocky Roquemore and opened in March 2002 on 660,000 m² of gently sloping land inside the Ria Formosa Natural Park. The par-72 layout plays 6,053 metres from the championship tees, with panoramic views of the Atlantic and the eastern Algarve hills. Bentgrass is used throughout, from tees and fairways to greens. A practice facility with driving range is available. Maximum handicap 24 men / 28 ladies.',
  website = 'https://www.quintadaria.com/',
  phone = '+351 281 950 580',
  course_type = 'parkland',
  length_meters = 6053,
  handicap_required = 24,
  driving_range = true,
  dress_code = 'Collared shirt, tailored shorts or trousers, soft spikes required.'
where slug = 'quinta-da-ria';

update courses set
  blurb = 'The championship sibling of Quinta da Ria — a demanding bentgrass layout playing over 6,500 metres from the back tees.',
  description = 'Quinta de Cima was designed by Rocky Roquemore and opened in July 2002 alongside Quinta da Ria on the same parkland estate. From the championship tees it plays 6,586 metres par 72 and is regarded as the more exacting of the two courses, with bentgrass fairways, tees, roughs, and greens throughout. A creek crosses several fairways creating strategic water hazards. Maximum handicap 36 for all players.',
  website = 'https://www.quintadaria.com/quinta-de-cima/',
  phone = '+351 281 950 580',
  course_type = 'parkland',
  length_meters = 6586,
  handicap_required = 36,
  driving_range = true,
  dress_code = 'Collared shirt, tailored shorts or trousers, soft spikes required.'
where slug = 'quinta-de-cima';

update courses set
  blurb = 'The finest course in Portugal according to multiple rankings — a Jack Nicklaus Signature layout in the eastern Algarve.',
  description = 'Monte Rei''s North Course is a Jack Nicklaus Signature design that opened in 2007 and is consistently ranked as Portugal''s number one golf course. The par-72 championship layout plays 6,567 metres (7,182 yards) from the tournament tees, with water in play on eleven of the eighteen holes and dramatic views of the rolling Serra do Caldeirão hills. Every guest receives a buggy and complimentary range balls, and caddie hire is available.',
  website = 'https://www.monte-rei.com/en/golf/',
  phone = '+351 281 950 950',
  course_type = 'parkland',
  length_meters = 6567,
  driving_range = true,
  caddie_service = true,
  dress_code = 'Smart golf attire required.'
where slug = 'monte-rei';

update courses set
  blurb = 'A Severiano Ballesteros design beside the Guadiana River, packed with creative dog-legs and six par-5s.',
  description = 'Quinta do Vale was designed by the late Severiano Ballesteros and plays 6,206 metres par 72 in the far eastern Algarve, minutes from the Spanish border. The layout features an unusual balance of six par-3s, six par-4s, and six par-5s, with multiple dog-legs, wide strategic fairways, and water hazards that showcase Ballesteros''s creative instincts. Stunning views over the Guadiana River complete the experience. Maximum handicap 24 men / 28 ladies.',
  website = 'https://www.quintadovalegolf.com/',
  phone = '+351 281 531 615',
  course_type = 'parkland',
  length_meters = 6206,
  handicap_required = 24,
  driving_range = false,
  dress_code = 'Golf attire required.'
where slug = 'quinta-do-vale';

update courses set
  blurb = 'Twenty-seven holes across three nine-hole loops near the Spanish border — Atlantic, Grouse, and Guadiana.',
  description = 'Castro Marim Golfe & Country Club is a 27-hole resort designed by Terry Murray and opened in 2001 near the ancient castle town of Castro Marim. Three distinct nine-hole courses — the Atlantic, the Grouse, and the Guadiana — can be combined in any pairing to produce varied 18-hole rounds. The combined championship layout reaches 6,282 metres par 72. Maximum handicap 24 men / 28 ladies.',
  website = 'https://castromarimresort.com/en/',
  phone = '+351 281 510 330',
  course_type = 'parkland',
  length_meters = 6282,
  handicap_required = 24,
  driving_range = false,
  dress_code = 'Golf attire required.'
where slug = 'castro-marim';


-- ── PESTANA FERRAGUDO ────────────────────────────────────────────────────────

update courses set
  blurb = 'Pestana''s brand-new sustainable 18-hole course in Ferragudo, soft-opening in mid-2026.',
  description = 'Pestana Ferragudo is the newest course in the Algarve, a sustainable 18-hole layout designed by Gonçalo Salazar de Sousa, Rui Pinto Gonçalves, and Miguel Passos de Almeida near the village of Ferragudo. Maintained exclusively with reclaimed water, the course embodies a modern eco-resort philosophy with landscape integration at its core. The course was scheduled for a soft opening in June 2026; full details are available via the official website.',
  website = 'https://pestanaferragudo.com/',
  course_type = 'resort',
  driving_range = false
where slug = 'pestana-ferragudo';
