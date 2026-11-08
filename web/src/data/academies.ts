// Golf academies and teaching programmes in the Algarve.
// Every fact here comes from the academy's or resort's own website, price-list PDF or
// booking engine — see research/academies/academies_findings.md for the source of each line.
// Rule: never invent. If a price isn't published, leave it out and the page shows
// "Price on request". Prices carry the season they were published for.

export const ACADEMIES_LAST_CHECKED = '2026-11-08'
export const ACADEMIES_LAST_CHECKED_LABEL = 'November 2026'

export type PriceStatus =
  | 'current'   // published for the current season
  | 'dated'     // the newest list the academy publishes, but from an earlier year
  | 'undated'   // published on the official site with no season shown
  | 'expired'   // the published list has an end date that has passed
  | 'none'      // no prices published

export interface PriceRow { label: string; price: string }
export interface PriceGroup { title: string; note?: string; rows: PriceRow[] }
export interface Programme { name: string; detail: string; price?: string }
export interface TeamMember { name: string; role: string; bio?: string }

export interface Academy {
  slug: string
  name: string
  /** Course slug the academy is based at (used for location and hero photo). */
  baseCourse: string
  /** Every course the academy serves. */
  courses: string[]
  /** One-line summary for cards and meta descriptions. */
  tagline: string
  /** About paragraphs, paraphrased from the official site. */
  about: string[]
  facilities: string[]
  technology: string[]
  team: TeamMember[]
  programmes: Programme[]
  priceGroups: PriceGroup[]
  /** Cheapest single private lesson, for cards and the course-page block. */
  lessonFrom?: { price: number; duration: string }
  beginnerProgramme: boolean
  juniors: boolean
  priceStatus: PriceStatus
  priceSource?: { label: string; url: string }
  priceNote?: string
  contact: { phone?: string; email?: string; website: string; booking?: string }
}

export const ACADEMIES: Academy[] = [
  {
    slug: 'vilamoura-golf-academy',
    name: 'Vilamoura Golf Academy',
    baseCourse: 'vilamoura-pinhal',
    courses: ['vilamoura-pinhal', 'vilamoura-old-course', 'vilamoura-laguna', 'vilamoura-millennium'],
    tagline: 'PGA coaching at the Pinhal course, with lesson packs, a handicap certificate programme and short themed schools.',
    about: [
      'The Vilamoura Golf Academy is based at the Pinhal course and teaches golfers of every age and level, from beginners to advanced players. Lessons are given by PGA teaching professionals, one to one or in small groups of up to four.',
      'Alongside private lessons it runs short themed programmes through the year, such as a Ladies Golf School, a Couples Golf Experience, a two-day Short Game Focus and a five-day Handicap Golf Certificate. Every lesson pack includes a nine-hole game with the professional.',
      'Guests at the resort\'s official hotels get 15% off lesson prices.',
    ],
    facilities: ['Driving range, putting green and chipping area at each Vilamoura course', 'Academy base at the Pinhal course'],
    technology: ['TrackMan', 'Flightscope', 'Titleist and Callaway custom fitting', 'TPI golf fitness screening', 'Golphin lightweight junior clubs'],
    team: [],
    programmes: [
      { name: 'Handicap Golf Certificate', detail: 'Five days, Monday to Friday, combining on-course practice and classroom sessions.', price: '€899 + €170 handicap fee' },
      { name: 'Ladies Golf School', detail: 'Three days, Tuesday to Thursday, on set dates: private and group instruction plus unlimited golf on three courses.', price: '€659' },
      { name: 'Couples Golf Experience', detail: 'Two days with more than 8 hours of coaching, video swing analysis, a playing lesson and unlimited afternoon golf.', price: '€759 for two' },
      { name: 'Short Game Focus', detail: 'Two days, 8 hours in small groups: putting, green reading, chipping, pitching and bunker play.', price: '€259' },
      { name: 'Junior lessons and summer camps', detail: 'Weekly after-school classes for under-21s, and summer camps for ages 6 to 18 in July and August.' },
    ],
    priceGroups: [
      { title: 'Private lessons', rows: [
        { label: '30 minutes', price: '€55' },
        { label: '1 hour', price: '€81' },
        { label: 'Technology lesson, 30 minutes', price: '€75' },
        { label: 'Technology lesson, 1 hour', price: '€115' },
      ] },
      { title: 'Lessons on the course (per hour, plus green fee)', rows: [
        { label: '1 person', price: '€81' },
        { label: '2 people', price: '€89' },
        { label: '3–4 people', price: '€98' },
      ] },
      { title: 'Lesson packs (valid 6 months, include a 9-hole game with the pro)', rows: [
        { label: '5 hours, 1 person', price: '€370' },
        { label: '5 hours, 2 people', price: '€490' },
        { label: '10 hours, 1 person', price: '€669' },
        { label: '10 hours, 2 people', price: '€888' },
      ] },
      { title: 'Group classes (total price)', rows: [
        { label: '2 people, 1 hour', price: '€108' },
        { label: '3–4 people, 1 hour', price: '€170' },
        { label: '5–8 people, 1 hour', price: '€245' },
        { label: 'Family class (3–6 people), 1 hour', price: '€38 per person' },
      ] },
      { title: 'Fitting and fitness', rows: [
        { label: 'Custom fitting (Callaway / Titleist), 1 hour', price: '€60' },
        { label: 'TPI physical screen and workout, 1 hour', price: '€80' },
      ] },
    ],
    lessonFrom: { price: 55, duration: '30 min' },
    beginnerProgramme: true,
    juniors: true,
    priceStatus: 'current',
    priceSource: { label: 'Vilamoura Golf Academy rates, 1 January – 31 December 2026', url: 'https://www.vilamouragolf.com/wp-content/uploads/2026/02/Direct-Rate-Golf-Lesson-2026.pdf' },
    contact: { phone: '+351 924 151 458', email: 'academy@vilamouragolf.com', website: 'https://vilamouragolf.com/en/academy/' },
  },
  {
    slug: 'quinta-do-lago-golf-academy',
    name: 'Quinta do Lago Golf Academy (Paul McGinley Academy)',
    baseCourse: 'quinta-do-lago-north',
    courses: ['quinta-do-lago-north', 'quinta-do-lago-south', 'quinta-do-lago-laranjal'],
    tagline: 'The only Paul McGinley Academy in the world, with a TaylorMade Performance Centre and a team of PGA professionals.',
    about: [
      'Quinta do Lago is home to the only Paul McGinley Academy in the world, founded in 2011 by the captain of Europe\'s winning 2014 Ryder Cup team. It is open every day from 8:00 to 18:00.',
      'The academy offers one-to-one lessons on the full swing or short game with computer analysis, golf schools from half a day to five days, and on-course playing lessons. There are junior programmes, camps and workshops, and a Junior Golf Club with weekly lessons all year.',
      'Club fitting takes place at the TaylorMade Performance Centre, and a golf-specific fitness service is run with The Campus.',
    ],
    facilities: ['TaylorMade Performance Centre for custom fitting', 'Practice facilities at the Quinta do Lago courses'],
    technology: ['Launch monitor and ball-flight analysis', 'Computer swing analysis'],
    team: [
      { name: 'Callum Burgess', role: 'Head Golf Professional' },
      { name: 'Tomás Carlota', role: 'Golf Professional' },
      { name: 'Ionut Tatar', role: 'Senior Golf Coordinator' },
      { name: 'Gaston Mendez', role: 'Senior Golf Coordinator and Junior Golf Specialist' },
      { name: 'Alessia Fasciola', role: 'Junior Golf Assistant' },
    ],
    programmes: [
      { name: 'Golf schools', detail: 'Programmes from half a day to five days.' },
      { name: 'Playing lessons', detail: 'Nine holes on the course with a professional (about 2 hours 30 minutes).' },
      { name: 'Junior Golf Club', detail: 'Weekly lessons all year round for children of all levels.' },
    ],
    priceGroups: [
      { title: 'Lessons (as shown in the resort\'s booking system)', note: 'Prices for 2 or more players are shown per player in the booking system. Confirm when you book.', rows: [
        { label: '30 minutes, 1 player', price: '€60' },
        { label: '30 minutes, 2 or more players', price: '€50' },
        { label: '50 minutes, 1 player', price: '€95' },
        { label: '50 minutes, 2 players', price: '€75' },
        { label: '50 minutes, 3 players', price: '€65' },
        { label: '50 minutes, 4 players', price: '€55' },
      ] },
      { title: '9-hole playing lesson', rows: [
        { label: '1 player', price: '€300' },
        { label: '2 players', price: '€250' },
        { label: '3 players', price: '€190' },
      ] },
    ],
    lessonFrom: { price: 60, duration: '30 min' },
    beginnerProgramme: true,
    juniors: true,
    priceStatus: 'current',
    priceSource: { label: 'Quinta do Lago online booking (Golf Academy), checked November 2026', url: 'https://eu.golfmanager.com/quintadolago/consumer/book?area=1' },
    priceNote: 'Golf school prices are not published.',
    contact: { website: 'https://www.quintadolago.com/en/golf/academy/', booking: 'https://eu.golfmanager.com/quintadolago/consumer/book?area=1' },
  },
  {
    slug: 'pinheiros-altos-golf-academy',
    name: 'Pinheiros Altos Golf Academy',
    baseCourse: 'pinheiros-altos',
    courses: ['pinheiros-altos'],
    tagline: 'Three British PGA professionals, a Titleist fitting centre and 3- and 5-day packages that include clubs and green fees.',
    about: [
      'The Pinheiros Altos Golf Academy sits on the Quinta do Lago estate, about 15 minutes from Faro airport. It is run by three British PGA professionals who have taught in the Algarve for more than a decade, from complete beginners to accomplished players.',
      'Every lesson includes unlimited balls, V1 video analysis and club hire, so you don\'t need to bring anything. Visitors can also use the practice ground on their own for a day fee of €25, or €15 after 13:30.',
    ],
    facilities: ['Three fully equipped teaching bays', 'Titleist custom fit centre, including Vokey wedge fitting', 'Practice ground for up to 30 players', 'Two practice putting greens', 'Chipping and bunker area', 'Private training area for groups'],
    technology: ['V1 video analysis', 'Flightscope'],
    team: [
      { name: 'Ross Sutherland', role: 'Head Professional', bio: 'British PGA professional since 2001 and qualified Titleist custom club fitter.' },
      { name: 'Kenny Fairbairn', role: 'Head of Tuition', bio: 'British PGA professional since 1995, teaching in Portugal since the end of that year.' },
      { name: 'Peter Ashdown', role: 'PGA Professional', bio: 'Former Portuguese National Champion; club repair specialist and custom fitter. Runs the junior clinics.' },
    ],
    programmes: [
      { name: '3-day package', detail: '7 hours of tuition (2 hours a day plus 1 hour on the course). Includes clubs, balls, video analysis and green fee.', price: '€600 (1 person), €695 (2), €795 (3)' },
      { name: '5-day package', detail: '12 hours of tuition, with 2 hours on the course with the professional on day 5. Includes clubs, balls, video analysis and green fee.', price: '€1,000 (1 person), €1,100 (2), €1,250 (3)' },
      { name: 'Junior clinics', detail: 'Holiday clinics for ages 4 to 15, maximum 8 children, clubs and balls provided.', price: '€25' },
    ],
    priceGroups: [
      { title: 'Private lessons, visitors', rows: [
        { label: '30 minutes, 1 person', price: '€55' },
        { label: '30 minutes, 2 people', price: '€60' },
        { label: '1 hour, 1 person', price: '€90' },
        { label: '1 hour, 2 people', price: '€100' },
      ] },
      { title: 'Lessons on the course, visitors (green fee included)', rows: [
        { label: '5 holes / 1 hour, 1 person', price: '€115' },
        { label: '9 holes / 2 hours, 1 person', price: '€220' },
        { label: '18 holes, 1 person', price: '€430' },
        { label: '9 holes / 2 hours, 2 people', price: '€280' },
      ] },
      { title: 'Juniors (12 and under)', rows: [
        { label: '30 minutes', price: '€50' },
        { label: '1 hour', price: '€80' },
      ] },
    ],
    lessonFrom: { price: 55, duration: '30 min' },
    beginnerProgramme: true,
    juniors: true,
    priceStatus: 'current',
    priceSource: { label: 'Pinheiros Altos Golf Academy website, checked November 2026', url: 'https://pinheirosaltosgolfacademy.com/' },
    contact: { phone: '+351 919 816 038', email: 'kennyfgolf@hotmail.com', website: 'https://pinheirosaltosgolfacademy.com/' },
  },
  {
    slug: 'espiche-golf-academy',
    name: 'Espiche Golf Academy',
    baseCourse: 'espiche',
    courses: ['espiche'],
    tagline: 'Four professionals near Lagos, TrackMan lessons from €40 and a 10-week beginners package.',
    about: [
      'Espiche Golf Academy is near Lagos in the western Algarve and is open to members and visitors. Lessons are tailored to each golfer, from clear and patient teaching of the basics for beginners to swing and course-strategy work for experienced players.',
      'The practice ground was renewed in early 2025 with a new academy cabin.',
    ],
    facilities: ['Driving range for up to 29 players, on natural grass and mats', '400 m² putting green', '800 m² chipping area', 'Academy cabin (opened early 2025)', 'Club repair: regripping, reshafting, loft and lie'],
    technology: ['TrackMan', 'Callaway and Ping custom fitting', 'HackMotion sensor and video analysis'],
    team: [
      { name: 'Fraser Cramb', role: 'Golf Professional', bio: 'PGA-trained in Scotland after a scholarship at Gleneagles; lessons and custom fitting with TrackMan.' },
      { name: 'João Tomáz', role: 'Golf Professional', bio: 'Coach since 2013 with a sports-science background in biomechanics; R&A rules training and club-fitting certification.' },
      { name: 'Pedro Lencart', role: 'Golf Professional', bio: 'Former Portuguese national team player and three-time national champion; professional since 2021, coaching since 2025.' },
      { name: 'Gonçalo Pinto', role: 'Golf Professional', bio: 'Assistant national coach with the Portuguese Golf Federation; former Portuguese Professional Champion.' },
    ],
    programmes: [
      { name: 'Beginners package (with João)', detail: '20 one-hour sessions over 10 weeks, covering the fundamentals.', price: '€500' },
      { name: 'Golf Experience (with João)', detail: 'A 90-minute introduction to putting, short game and long game.', price: '€90 per person' },
      { name: 'Group lessons', detail: 'Drop in weekly or join for the month.', price: '€20 per week, €70 per month' },
      { name: 'Junior academy', detail: 'Fun lessons to build the fundamentals.', price: '€70 per month' },
    ],
    priceGroups: [
      { title: 'Private lessons', note: 'Pay for 5 lessons and get the 6th free.', rows: [
        { label: '30 minutes', price: '€40' },
        { label: '60 minutes', price: '€65' },
        { label: '60 minutes, shared (2 people)', price: '€75' },
        { label: 'Playing lesson, 2 hours', price: '€120 + green fee' },
      ] },
      { title: 'Custom club fitting', rows: [
        { label: 'With club purchase', price: 'Free' },
        { label: 'Without purchase, per hour', price: '€50' },
      ] },
    ],
    lessonFrom: { price: 40, duration: '30 min' },
    beginnerProgramme: true,
    juniors: true,
    priceStatus: 'current',
    priceSource: { label: 'Espiche Golf Academy flyer, 2026', url: 'https://www.espichegolf.pt/wp-content/uploads/2026/04/Espiche-Golf-Academy-Flyer.pdf' },
    contact: { phone: '+351 910 400 231', email: 'fraser.cpgolf@gmail.com', website: 'https://www.espichegolf.pt/en/golf/golf-academy/' },
  },
  {
    slug: 'pestana-golf-academy',
    name: 'Pestana Golf Academy',
    baseCourse: 'gramacho',
    courses: ['gramacho', 'vale-da-pinta', 'silves', 'alto-golf', 'vila-sol'],
    tagline: 'Lessons and 3- or 5-day schools across the Pestana courses, taught in English and German.',
    about: [
      'The Pestana Golf Academy teaches golfers of all ages and levels across the Pestana courses, with private lessons, beginners and advanced schools, and playing lessons. Pestana describes its main academy as the largest of its academies in the Algarve, with covered bays, 8 target greens, a chipping area, bunkers and a large putting green.',
      'Lessons on the published price list are given by John Gasper, a fully qualified PGA professional, in English and German. Ask which course your lesson will be at when you book.',
    ],
    facilities: ['Covered hitting bays', '8 target greens', 'Chipping area and practice bunkers', 'Large putting green'],
    technology: [],
    team: [{ name: 'John Gasper', role: 'PGA Professional', bio: 'Fully qualified golf professional; lessons in English and German.' }],
    programmes: [
      { name: 'Beginners school', detail: '1 hour 30 minutes a day, minimum 2 people.', price: '3 days €162.50 pp, 5 days €250 pp' },
      { name: 'Advanced players school', detail: '2 hours a day, minimum 2 people.', price: '3 days €212.50 pp, 5 days €325 pp' },
      { name: 'Platzreife school', detail: 'Five 2-hour sessions towards a golf licence, as listed on the price list (Platzreife / GVB).', price: '€650 (1 person), €850 (2), €950 (3)' },
    ],
    priceGroups: [
      { title: 'Private lessons', rows: [
        { label: '30 minutes', price: '€35' },
        { label: '1 hour', price: '€65' },
        { label: '1 hour, 2 people', price: '€75' },
        { label: '1 hour, 3 or more people', price: '€95' },
      ] },
      { title: 'On the course (green fee included)', rows: [
        { label: '9 holes, 1 person', price: '€180' },
        { label: '9 holes, 2 people', price: '€190' },
      ] },
      { title: 'Juniors', rows: [
        { label: '30 minutes (up to 8 years old)', price: '€35' },
        { label: '1 hour, 2 juniors (up to 18)', price: '€55' },
      ] },
    ],
    lessonFrom: { price: 35, duration: '30 min' },
    beginnerProgramme: true,
    juniors: true,
    priceStatus: 'dated',
    priceSource: { label: 'Pestana Golf Academy price list, 2024 (the latest it publishes)', url: 'https://pestanagolf.com/wp-content/uploads/2024/09/Academy-Lessons-Pricelist_Gasper_2024_-Price-for-guests.pdf' },
    contact: { phone: '+351 282 340 440', email: 'golf.academy@pestana.com', website: 'https://pestanagolf.com/golf/#academia' },
  },
  {
    slug: 'penina-golf-academy',
    name: 'Penina Golf Academy',
    baseCourse: 'penina-championship',
    courses: ['penina-championship', 'penina-resort'],
    tagline: 'A natural-grass range 80 metres wide, 5-day clinics with clubs included, and a professional who learned from Sir Henry Cotton.',
    about: [
      'Penina describes its practice ground as one of the best in the region: an all-natural Bermuda grass range 80 metres wide, with target greens, a chipping green and a practice bunker. The academy has two PGA professionals.',
      'Its ambassador and professional, José Lourenço, has worked at Penina for more than 50 years and learned his trade with Sir Henry Cotton, the founder of Algarve golf.',
      'The 5-day clinics include clubs, a hand trolley and unlimited range balls, and end with a game on the course with the professional. The nine-hole Resort Course needs no handicap, so you can take what you learn straight onto a real course.',
    ],
    facilities: ['80 m wide natural Bermuda grass driving range', 'Target greens', 'Chipping green and practice bunker', 'Putting green', 'Pro shop', 'Nine-hole Resort Course and Academy Course'],
    technology: ['Video analysis (in clinics)'],
    team: [{ name: 'José Lourenço', role: 'Ambassador and Professional', bio: 'More than 50 years at Penina; learned with Sir Henry Cotton.' }],
    programmes: [
      { name: 'Beginners Golf Clinic', detail: '5 days, 1 hour a day: full swing, short game, putting, rules and etiquette, video analysis and a game on the course with the pro. Clubs, trolley and range balls included.', price: '€284 pp for 4–8 people, €355 pp for 1–3 (2024/25)' },
      { name: 'Advanced Players Golf Clinic', detail: '3 or 5 days: short game, long game, video analysis and a competition day.', price: '3 days €217 pp, 5 days €293 pp for 4–8 people (2024/25)' },
      { name: 'Junior Golf Clinic (ages 7–16)', detail: '5 days, 1 hour a day, ending with a game on the course and a certificate.', price: '€189 pp for 4–8 children (2024/25)' },
    ],
    priceGroups: [
      { title: 'Private lessons with José Lourenço', rows: [
        { label: '30 minutes, junior', price: '€30' },
        { label: '30 minutes', price: '€40' },
        { label: '1 hour', price: '€65' },
      ] },
    ],
    lessonFrom: { price: 40, duration: '30 min' },
    beginnerProgramme: true,
    juniors: true,
    priceStatus: 'expired',
    priceSource: { label: 'Penina Golf Academy 2024/2025 brochure (rates 1 Nov 2024 – 31 Oct 2025)', url: 'https://www.penina.com/media/4666036/pgh-golf-academy-2024-25.pdf' },
    priceNote: 'Penina has not published rates for the current season yet. These are the last published prices, so ask for current ones.',
    contact: { phone: '+351 282 420 223', email: 'penina-golf@jjwhotels.com', website: 'https://www.penina.com/golf/penina-golf-academy/' },
  },
  {
    slug: 'castro-marim-golf-academy',
    name: 'Castro Marim Golf Academy',
    baseCourse: 'castro-marim',
    courses: ['castro-marim'],
    tagline: 'Lessons with Peter O\'Connor, son of Ryder Cup legend Christy O\'Connor Senior, from €30.',
    about: [
      'Castro Marim\'s teaching is led by Peter O\'Connor, from the famous O\'Connor golf family and son of Ryder Cup legend Christy O\'Connor Senior. He coaches beginners, handicap golfers and low handicappers, and has worked as a professional in Ireland, the Bahamas, Germany, Italy and Portugal.',
      'The academy offers golf clinics, group lessons and short-game lessons, as well as nine- and 18-hole playing lessons.',
    ],
    facilities: [],
    technology: [],
    team: [{ name: 'Peter O\'Connor', role: 'Golf Professional', bio: 'Son of Christy O\'Connor Senior; experienced with beginners through to low handicappers.' }],
    programmes: [
      { name: 'Golf clinics and group lessons', detail: 'Clinics, groups and short-game lessons. Ask the club for details.' },
    ],
    priceGroups: [
      { title: 'Lessons', rows: [
        { label: '30 minutes', price: '€30' },
        { label: '1 hour', price: '€60' },
        { label: '3 × 30-minute lessons', price: '€80' },
        { label: '5 × 30-minute lessons', price: '€140' },
        { label: '9-hole playing lesson', price: '€75 + green fee' },
        { label: '18-hole playing lesson', price: '€135 + green fee' },
      ] },
    ],
    lessonFrom: { price: 30, duration: '30 min' },
    beginnerProgramme: false,
    juniors: false,
    priceStatus: 'undated',
    priceSource: { label: 'Castro Marim Golfe academy page ("special rates"), checked November 2026', url: 'https://castromarimresort.com/en/golf/academy/' },
    contact: { phone: '+351 281 510 340', email: 'info@castromarimgolfe.com', website: 'https://castromarimresort.com/en/golf/academy/' },
  },
  {
    slug: 'benamor-golf-lessons',
    name: 'Benamor Golf lessons and clinics',
    baseCourse: 'benamor',
    courses: ['benamor'],
    tagline: 'Lessons, 9-hole course lessons and group clinics with coach Miguel Ribeiro near Tavira.',
    about: [
      'Benamor offers private lessons, course lessons and group clinics with golf coach Miguel Ribeiro, plus special programmes for adults and juniors.',
      'Its "Learn to Play" beginner package is an intensive programme on the fundamentals, with the option of getting a Portuguese federation membership (Green Card) at the end. Its price is on request.',
    ],
    facilities: ['Driving range'],
    technology: [],
    team: [{ name: 'Miguel Ribeiro', role: 'Golf Coach' }],
    programmes: [
      { name: '"Learn to Play" beginner package', detail: 'Intensive programme on the fundamentals, with the possibility of a federation membership (Green Card).' },
      { name: 'Group clinics', detail: 'For groups of 4 to 30 people.', price: '€35 pp (4–10), €30 pp (11–20), €25 pp (21–30)' },
    ],
    priceGroups: [
      { title: 'Lessons, non-members', note: 'Benamor does not state the lesson length for adults (junior lessons are 1 hour).', rows: [
        { label: '1 person', price: '€65' },
        { label: '2 people', price: '€80' },
        { label: '3 lessons', price: '€180' },
        { label: '6 lessons', price: '€330' },
        { label: 'Junior (1 hour)', price: '€40' },
      ] },
      { title: 'Course lessons, 9 holes / 2 hours', rows: [
        { label: '1 person', price: '€130' },
        { label: '2 people', price: '€160' },
        { label: '3 people', price: '€220' },
        { label: '4 people', price: '€280' },
      ] },
    ],
    lessonFrom: { price: 65, duration: 'lesson' },
    beginnerProgramme: true,
    juniors: true,
    priceStatus: 'undated',
    priceSource: { label: 'Benamor Golf lessons and clinics page, checked November 2026', url: 'https://www.benamorgolf.com/en/golf-lessons-clinics/' },
    contact: { phone: '+351 281 320 880', website: 'https://www.benamorgolf.com/en/golf-lessons-clinics/' },
  },
  {
    slug: 'amendoeira-golf-academy',
    name: 'Amendoeira Golf Academy',
    baseCourse: 'amendoeira-oconnor',
    courses: ['amendoeira-oconnor', 'amendoeira-faldo'],
    tagline: 'TrackMan, BodiTrak and SAM PuttLab, at most five students per teacher, and Portugal\'s only floodlit nine-hole course.',
    about: [
      'The Amendoeira Golf Academy runs programmes for men, women and juniors, from beginners to touring professionals. Every programme keeps to a maximum of five students per teacher.',
      'As well as technique, the instructors cover the mental game, equipment evaluation and fitting, nutrition and fitness. After a lesson you get a personalised video comparing your swing with a professional\'s, with the drills to work on.',
      'The nine-hole par-3 Academy Course, between the Faldo and O\'Connor Jnr courses, is the only floodlit nine-hole course in Portugal and is well suited to beginners.',
    ],
    facilities: ['Nine-hole par-3 floodlit Academy Course', 'Driving range', 'Practice putting greens', 'Long and short game practice areas'],
    technology: ['TrackMan', 'V1 video analysis', 'BodiTrak', 'SAM PuttLab'],
    team: [],
    programmes: [
      { name: 'Golf schools', detail: 'Half-day, one, two, three and five-day schools.' },
      { name: 'Private lessons', detail: 'Individual, shared or playing lessons on the course.' },
      { name: 'Junior golf school', detail: 'Programmes for young golfers.' },
      { name: 'Corporate clinics', detail: 'Clinics for company groups.' },
    ],
    priceGroups: [],
    beginnerProgramme: true,
    juniors: true,
    priceStatus: 'none',
    contact: { phone: '+351 282 320 671', website: 'https://www.amendoeiraresort.com/en/golf/' },
  },
  {
    slug: 'monte-rei-golf-academy',
    name: 'Monte Rei Golf Academy',
    baseCourse: 'monte-rei',
    courses: ['monte-rei'],
    tagline: 'Tailored tuition from PGA professionals and a Swing Studio for teaching and club fitting.',
    about: [
      'Monte Rei Golf & Country Club offers teaching and practice facilities for members, guests and visitors. Its PGA professionals tailor tuition programmes to each golfer, whatever their age or ability.',
      'There is a light tuition programme for people who have never played as well as for existing golfers. The Swing Studio has teaching and club-fitting technology, so swings can be viewed and adjusted and equipment matched to your swing.',
    ],
    facilities: ['Practice facility', 'Swing Studio'],
    technology: ['Swing Studio teaching and club-fitting technology'],
    team: [],
    programmes: [
      { name: 'Golf tuition programme', detail: 'A light programme for beginners and existing golfers, hosted at the academy by Monte Rei\'s PGA professionals.' },
      { name: 'Club fitting', detail: 'Equipment matched to your swing in the Swing Studio.' },
    ],
    priceGroups: [],
    beginnerProgramme: true,
    juniors: false,
    priceStatus: 'none',
    contact: { website: 'https://www.monte-rei.com/en/golf/golf-academy/' },
  },
  {
    slug: 'vale-do-lobo-golf-academy',
    name: 'Vale do Lobo Golf Academy',
    baseCourse: 'vale-do-lobo-royal',
    courses: ['vale-do-lobo-royal', 'vale-do-lobo-ocean'],
    tagline: 'Practice areas and coaching for beginners near the resort reception, plus holiday junior academies.',
    about: [
      'The Vale do Lobo Golf Academy has a netted area and a grass short-game area with bunkers, used for warming up and for beginners\' lessons with the resort\'s golf professionals. There is also a putting green next to the clubhouse.',
      'In the school holidays the resort runs Junior Golf Academy weeks for children with some experience of the game.',
    ],
    facilities: ['Netted practice area', 'Grass short-game area with bunkers', 'Putting green next to the clubhouse'],
    technology: [],
    team: [],
    programmes: [
      { name: 'Junior Golf Academy', detail: 'Holiday weeks (for example 26–30 October 2026, 14:00–16:00) for children with some golf experience.' },
    ],
    priceGroups: [],
    beginnerProgramme: false,
    juniors: true,
    priceStatus: 'none',
    contact: { phone: '+351 289 353 465', website: 'https://www.valedolobo.com/en/resort/services-facilities/golf-academy/' },
  },
  {
    slug: 'palmares-golf-academy',
    name: 'Palmares Golf Academy',
    baseCourse: 'palmares',
    courses: ['palmares'],
    tagline: 'A 300-yard range in a coastal valley and coaching from the coach of European Tour player Ricardo Santos.',
    about: [
      'The Palmares Golf Academy, near Lagos, offers coaching for every level, from beginners to experienced players, combining one-to-one instruction with its practice facilities.',
      'The professional, Almerindo Sequeira, has been a PGA Portugal professional since 1996 and is the coach of Ricardo Santos, a European Tour player since 2009.',
    ],
    facilities: ['300-yard driving range in a natural valley', 'Short-game areas', 'Putting greens'],
    technology: [],
    team: [{ name: 'Almerindo Sequeira', role: 'PGA Portugal Professional', bio: 'PGA professional since 1996; Level IV coach (Portuguese Golf Federation and PGA Europe); coach of Ricardo Santos.' }],
    programmes: [],
    priceGroups: [],
    beginnerProgramme: false,
    juniors: false,
    priceStatus: 'none',
    contact: { website: 'https://www.palmaresliving.com/golf/golf-academy/' },
  },
  {
    slug: 'morgado-golf-academy',
    name: 'Morgado Golf Academy',
    baseCourse: 'morgado',
    courses: ['morgado', 'alamos'],
    tagline: 'Two natural-grass practice tees with 35 bays each, 10 target greens and programmes from beginners to professionals.',
    about: [
      'The Morgado do Reguengo Golf Academy, beside the Morgado and Álamos courses near Portimão, has personalised programmes and lessons for every level, from beginners to elite players and professionals.',
      'Its practice ground has two natural-grass tees with room for 35 players each, ten target greens marked every 50 metres, two chipping greens with bunkers, and several putting greens.',
    ],
    facilities: ['Two natural-grass practice tees, 35 bays each', '10 target greens with 50 m markers', 'Two chipping greens with practice bunkers', 'Putting greens at each tee and next to the 1st tee of Álamos', 'Two warm-up zones near the clubhouse'],
    technology: [],
    team: [],
    programmes: [],
    priceGroups: [],
    beginnerProgramme: false,
    juniors: false,
    priceStatus: 'none',
    contact: { phone: '+351 282 402 150', email: 'info@golfedomorgado.com', website: 'https://www.nauhotels.com/en/golf/golf-academy' },
  },
  {
    slug: 'pine-cliffs-golf-academy',
    name: 'Pine Cliffs Golf Academy',
    baseCourse: 'pine-cliffs',
    courses: ['pine-cliffs'],
    tagline: 'PGA instruction for beginners and experienced players at Pine Cliffs Resort, plus a summer junior camp.',
    about: [
      'The Pine Cliffs Golf Academy helps beginners and more experienced players improve their technique with qualified PGA instructors. The golf shop at the Pine Cliffs Golf and Country Club handles bookings for both the course and the academy.',
      'In July and August there is a junior golf camp for ages 7 to 18, Monday to Friday from 15:00 to 17:00.',
    ],
    facilities: ['Driving range'],
    technology: [],
    team: [],
    programmes: [
      { name: 'Junior Golf Camp (ages 7–18)', detail: 'July and August, Monday to Friday, 15:00–17:00.', price: '€60 per session, €130 for 3, €170 for 5 (2025)' },
    ],
    priceGroups: [],
    beginnerProgramme: false,
    juniors: true,
    priceStatus: 'none',
    contact: { phone: '+351 289 500 113', email: 'golf.algarve@pinecliffs.com', website: 'https://www.pinecliffs.com/en/golf-sports/golf/' },
  },
  {
    slug: 'quinta-da-ria-golf-lessons',
    name: 'Quinta da Ria and Quinta do Vale golf lessons',
    baseCourse: 'quinta-da-ria',
    courses: ['quinta-da-ria', 'quinta-de-cima', 'quinta-do-vale'],
    tagline: 'Lessons with PGA professional Mickael Carvalho, big grass ranges and two nine-hole academy courses in the eastern Algarve.',
    about: [
      'Quinta da Ria (with Quinta de Cima) near Tavira and Quinta do Vale near Castro Marim offer lessons with PGA professional Mickael Carvalho, who tailors each session to the golfer: swing mechanics, course management and precision, with practice drills and feedback.',
      'Both resorts have a nine-hole short-game academy course and large grass driving ranges. Quinta da Ria also has a Foresight golf simulator at its range.',
    ],
    facilities: [
      'Quinta da Ria: 300 m driving range with 70 grass bays and 5 covered bays',
      'Quinta da Ria: nine-hole pitch-and-putt academy course',
      'Quinta da Ria: chipping area with bunker and putting greens at both courses',
      'Quinta do Vale: driving range for up to 95 players',
      'Quinta do Vale: nine-hole academy course with seven short-game teaching areas in peak season',
    ],
    technology: ['Foresight golf simulator (Quinta da Ria)'],
    team: [{ name: 'Mickael Carvalho', role: 'PGA Professional' }],
    programmes: [],
    priceGroups: [],
    beginnerProgramme: false,
    juniors: false,
    priceStatus: 'none',
    contact: { website: 'https://www.quintadaria.com/practice-facilities/' },
  },
]

export function getAcademy(slug: string): Academy | undefined {
  return ACADEMIES.find(a => a.slug === slug)
}

export function academyForCourse(courseSlug: string): Academy | undefined {
  return ACADEMIES.find(a => a.courses.includes(courseSlug))
}

export const PRICE_STATUS_LABEL: Record<PriceStatus, string> = {
  current: 'Current published prices',
  dated: 'Latest published prices (from an earlier year)',
  undated: 'Prices as published (no season shown)',
  expired: 'Last published prices (season ended)',
  none: 'Price on request',
}
