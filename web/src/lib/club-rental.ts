/**
 * Verified club-hire details for /club-rental, checked on each provider's
 * official website on 2026-11-04. Only published facts go here: when a site
 * doesn't state something, say so rather than filling the gap.
 *
 * scripts/sync-rental-info.ts copies the structured fields to the `shops` table
 * so the individual shop pages stay in step.
 */

export type RentalInfo = {
  /** Hidden from /club-rental, e.g. when the provider may no longer be trading. */
  hidden?: boolean
  /** Text shown in the comparison table's price column. */
  price?: string
  /** One-day rate to store in shops.rental_price_per_day; null when not published. */
  pricePerDay?: number | null
  priceNotes?: string | null
  collect?: string
  delivery?: string
  /** Whether the provider offers any delivery (stored in shops.delivery_to_course). */
  delivers?: boolean
  deliveryAreas?: string[]
  sets?: string
  setTypes?: string[]
  summary?: string
}

export const RENTAL_CHECKED_LABEL = 'November 2026'

export const RENTAL_INFO: Record<string, RentalInfo> = {
  'clubstohire-faro-airport': {
    price: 'From €50 a week (company-wide headline, confirm for Faro)',
    pricePerDay: null,
    priceNotes: 'Company-wide headline: from €50 per set per week; confirm the Faro price when booking. Delivery charges may apply depending on location. Pre-booked out-of-hours service for €25 (05:30–07:00 and 23:00–00:30).',
    collect: 'Shop in the Faro Airport arrivals hall, 07:00–23:00 for pre-booked times',
    delivery: 'Hotels, resorts, villas and courses across the Algarve; charges may apply',
    delivers: true,
    deliveryAreas: ['Vilamoura', 'Quinta do Lago', 'Vale do Lobo', 'Almancil', 'Albufeira', 'Lagos', 'Carvoeiro', 'Alvor', 'Tavira'],
    sets: "Men's, ladies', left-handed; steel and graphite",
    setTypes: ['full_set', 'ladies', 'left_handed'],
    summary: 'Has its own shop in the arrivals hall, so you can collect your clubs as soon as you land and return them before you fly home. Brands include Callaway, TaylorMade, PXG, Cobra and Ping.',
  },
  'mycaddymaster-faro-airport': {
    price: 'Sets listed from €9.30 (headline: from €5 a day)',
    pricePerDay: null,
    priceNotes: 'The website headline says from €5 a day, while the lowest set price listed is €9.30, up to €21.80. Enter your dates for an exact price.',
    collect: 'Meeting point at Faro Airport',
    delivery: 'To the place of your choice; ask for any charge when booking',
    delivers: true,
    deliveryAreas: [],
    sets: "Men's, ladies', junior, left-handed",
    setTypes: ['full_set', 'ladies', 'junior', 'left_handed'],
    summary: 'Sets come in three packs: Evolution, Performance and Excellence. You can customise your bag online, then collect it at the airport or have it delivered. Brands include Callaway, TaylorMade, Cleveland, Cobra, XXIO and Ping.',
  },
  'faro-golf-club-hire': {
    price: 'Not published; ask for a quote',
    pricePerDay: null,
    priceNotes: 'No prices are published on the website; contact the company for a quote.',
    collect: 'Faro Airport',
    delivery: 'Not stated on its website; ask when booking',
    delivers: false,
    deliveryAreas: [],
    sets: "Men's and ladies'; right- and left-handed",
    setTypes: ['full_set', 'ladies', 'left_handed'],
    summary: 'Offers Ben Sayers, Callaway, Ping and TaylorMade sets for collection at the airport. Its website gives few details, so confirm prices and arrangements by phone.',
  },
  '18-store-golf-shop': {
    price: 'Live price for your dates',
    pricePerDay: null,
    priceNotes: 'Prices depend on the set and your dates, shown in the online booking tool. Online bookings of up to 14 days; email for longer rentals.',
    collect: 'Delivered to you',
    delivery: 'Free delivery and collection at your accommodation',
    delivers: true,
    deliveryAreas: [],
    sets: 'See live stock online',
    setTypes: ['full_set'],
    summary: 'Brings the clubs to your accommodation and collects them at the end, at no extra charge. Its online stock shows current sets from TaylorMade, Callaway, Cobra and Srixon, with availability for your dates.',
  },
  'blue-sky-golf-shop': {
    price: 'From €30 for 4 days',
    pricePerDay: null,
    priceNotes: 'Rental prices start from €30 for a 4-day rental. Check live prices for your dates online.',
    collect: 'Delivered to you',
    delivery: 'Free delivery to your accommodation, in half-hour slots from 06:00 to 22:00',
    delivers: true,
    deliveryAreas: [],
    sets: 'See live stock online',
    setTypes: [],
    summary: 'Delivers across several golf destinations from a stock of more than 1,000 sets. Brands include Callaway, Cobra, Ping, Srixon, TaylorMade, Titleist and XXIO. Enter your dates to see live availability and prices.',
  },
  'up-n-down-golf': {
    price: 'From €10 a day (pre-built); custom bags from €68',
    pricePerDay: 10,
    priceNotes: 'Pre-built sets from €10 a day. Build-your-own bags from €68. Example: Players Pack €75 for 1–3 days, €127 for 7 days. €20 extra for delivery to Tavira, Vila Real, Castro Marim, Alcoutim, Vila do Bispo and Aljezur.',
    collect: 'Delivered to you',
    delivery: 'Free to hotels, villas and resorts in most of the Algarve; €20 extra for far east and far west',
    delivers: true,
    deliveryAreas: ['Vilamoura', 'Quinta do Lago', 'Vale do Lobo', 'Loulé', 'Albufeira', 'Quarteira', 'Carvoeiro', 'Silves', 'Lagos', 'Faro'],
    sets: 'Choose each club yourself, or a pre-built bag',
    setTypes: ['full_set'],
    summary: 'You can choose each club in your bag, from driver to putter, or pick a pre-built set if you prefer. Clubs are delivered to your accommodation and collected at the end.',
  },
  'green-tee-vilamoura': {
    price: '€40 for 1 day; €70 for 7 days',
    pricePerDay: 40,
    priceNotes: 'Complete sets: 1 day €40, 3 days €60, 5 days €65, 7 days €70. Free delivery to hotels and villas within 25 km of Vilamoura.',
    collect: 'Office at Vilamoura Marina',
    delivery: 'Free to hotels and villas within 25 km of Vilamoura',
    delivers: true,
    deliveryAreas: [],
    sets: "Men's, ladies', left-handed; steel or graphite",
    setTypes: ['full_set', 'ladies', 'left_handed'],
    summary: 'Publishes a simple price list for 1, 3, 5 and 7 days, plus trolley and golf shoe hire. Sets include PING, Callaway, Titleist, TaylorMade, Wilson and Mizuno.',
  },
  'alvor-golf-shop': {
    price: '€25 for 1 day; €80 for 7 days',
    pricePerDay: 25,
    priceNotes: 'TaylorMade sets: €25 a day, €60 for 3 days, €80 a week. Trolleys also available.',
    collect: 'Shop in Alvor',
    delivery: 'Not stated on its website; ask when booking',
    delivers: false,
    deliveryAreas: [],
    sets: 'TaylorMade sets',
    setTypes: ['full_set'],
    summary: 'A golf shop in Alvor that hires TaylorMade sets, with pull, push and electric trolleys also available. A convenient option if you are staying nearby.',
  },
  'carvoeiro-golf-shop': {
    price: 'From €25 for 1 day; from €60 for 7 days',
    pricePerDay: 25,
    priceNotes: 'Sets from €25 a day and from €60 a week, plus €10 for each extra day. Newer sets cost up to €40 a day or €80 a week. Ask about long-stay discounts.',
    collect: 'Shop in Carvoeiro',
    delivery: 'Possible to your accommodation; ask for any charge',
    delivers: true,
    deliveryAreas: [],
    sets: "Men's, ladies', left-handed",
    setTypes: ['full_set', 'ladies', 'left_handed'],
    summary: 'Publishes prices for each set, from TaylorMade, Callaway and Srixon. Each hire comes with a free sleeve of balls per set. Reservations are by phone or email.',
  },
  'lagos-golf-shop': {
    price: "Men's sets from €50 for 3 days (headline: from €45)",
    pricePerDay: null,
    priceNotes: "Lowest men's set listed: €50 for 3 days, €60 for 5 days, €70 for 7 days, €10 per extra day. The website headline says from €45; enter your dates for an exact price.",
    collect: 'Delivered to you, or collect from the shop in Lagos',
    delivery: 'Free delivery and collection, every day 7am–10pm; the areas are shown on a map on its website',
    delivers: true,
    deliveryAreas: [],
    sets: "Men's sets listed, steel and graphite; the site also has a ladies' section",
    setTypes: ['full_set'],
    summary: 'A Lagos golf shop in business since 2004, with club hire from Titleist, TaylorMade, Callaway and Cobra. Clubs are delivered and collected free of charge, or you can collect them from the shop. It also repairs clubs.',
  },
  // Domain returned "410 Gone" and a parked-domain certificate on 2026-11-04.
  'lagos-golf-club-hire': { hidden: true },
}
