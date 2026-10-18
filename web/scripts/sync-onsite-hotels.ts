/**
 * Comprehensive onsite hotel sync:
 *  1. Insert 8 new onsite hotels (Viceroy, Hotel QdL, Balaia, Castro Marim,
 *     Robinson, Dona Filipa, Victoria, Pestana Gramacho)
 *  2. Update 4 existing hotels missing description/amenities/website
 *  3. Set onsite_hotel_id + has_own_hotel=true on all 22 affected courses
 *  4. Fix booking_url 404s (search.html → searchresults.html)
 *
 * PREREQUISITE: Run database/migrate_onsite_hotel_fk.sql in Supabase SQL Editor first.
 *
 * Usage:
 *   export $(cat .env.local | grep -v ^# | xargs)
 *   npx tsx scripts/sync-onsite-hotels.ts
 *   npx tsx scripts/sync-onsite-hotels.ts --dry-run
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars. Run: export $(cat .env.local | grep -v ^# | xargs)')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const dryRun   = process.argv.includes('--dry-run')

// ─── WKB point encoder (PostGIS EWKB, SRID 4326) ──────────────────────────

function makePointWKB(lng: number, lat: number): string {
  const buf = Buffer.alloc(25)
  buf.writeUInt8(1, 0)
  buf.writeUInt32LE(0x20000001, 1)
  buf.writeUInt32LE(4326, 5)
  buf.writeDoubleLE(lng, 9)
  buf.writeDoubleLE(lat, 17)
  return buf.toString('hex')
}

// ─── 1. New onsite hotels to insert ───────────────────────────────────────

const NEW_HOTELS = [
  {
    slug: 'viceroy-ombria',
    name: 'Viceroy at Ombria Algarve',
    description: 'A luxury eco-resort nestled in the hills near Querença, Loulé, the Viceroy at Ombria Algarve emphasises sustainability and integration with the natural Algarve landscape. Accommodation ranges from rooms with private terraces to two-bedroom residences with private pools or jacuzzis, all adjacent to the award-winning Ombria Golf course.',
    town: 'Loulé',
    region: 'central',
    lat: 37.199, lng: -8.044,
    stars: 5,
    price_from: 445,
    website: 'https://www.viceroyhotelsandresorts.com/ombria-algarve',
    amenities: ['Spa & wellness', 'Multiple pools', 'Restaurants & bars', 'Fitness centre', "V Team Kids' Club", 'Hiking & biking trails'],
    has_golf_package: true,
    onsite: true,
    active: true,
    featured: true,
    accommodation_type: 'hotel',
    booking_url: 'https://www.booking.com/searchresults.html?ss=Viceroy%20at%20Ombria%20Algarve',
  },
  {
    slug: 'hotel-quinta-do-lago',
    name: 'Hotel Quinta do Lago',
    description: 'A Leading Hotels of the World member since 1988, Hotel Quinta do Lago is a five-star property set within the prestigious Quinta do Lago estate with direct pedestrian access to all three golf courses. Its 141 rooms and suites, two restaurants, spa, and indoor pool make it the definitive base for the Golden Triangle.',
    town: 'Almancil',
    region: 'central',
    lat: 37.010, lng: -8.020,
    stars: 5,
    price_from: 400,
    website: 'https://www.hotelquintadolago.com',
    amenities: ['Spa', 'Indoor & outdoor pools', '2 restaurants', 'Tennis', 'Fitness centre', 'Direct golf access'],
    has_golf_package: true,
    onsite: true,
    active: true,
    featured: true,
    accommodation_type: 'hotel',
    booking_url: 'https://www.booking.com/searchresults.html?ss=Hotel%20Quinta%20do%20Lago',
  },
  {
    slug: 'balaia-golf-village',
    name: 'Balaia Golf Village Resort',
    description: 'A 4-star golf resort built around the 9-hole Balaia Golf Village course, with 508 apartments and studios spread across a hillside estate near Albufeira. Six outdoor pools, two restaurants, two poolside bars, and a spa make it ideal for golfers who want self-catering flexibility with resort amenities.',
    town: 'Albufeira',
    region: 'central',
    lat: 37.0929, lng: -8.2074,
    stars: 4,
    price_from: 69,
    website: 'https://www.balaiagolfvillage.com',
    amenities: ['6 outdoor pools', '2 restaurants', '2 bars', 'Spa', 'Self-catering apartments', 'Direct golf access'],
    has_golf_package: true,
    onsite: true,
    active: true,
    featured: false,
    accommodation_type: 'resort',
    booking_url: 'https://www.booking.com/searchresults.html?ss=Balaia%20Golf%20Village%20Resort',
  },
  {
    slug: 'castro-marim-golf-club',
    name: 'Castro Marim Golfe & Country Club',
    description: "A 230-hectare golf resort in the far-eastern Algarve, set between the Guadiana River and the Atlantic Ocean near the Spanish border. The resort offers 75 air-conditioned accommodations and private village houses — all with private hot tubs or fireplaces — alongside a 27-hole course, three pools, a kids' club, and a clubhouse restaurant with Atlantic views.",
    town: 'Castro Marim',
    region: 'east',
    lat: 37.2359, lng: -7.4693,
    stars: null,
    price_from: 95,
    website: 'https://castromarimresort.com',
    amenities: ['3 outdoor pools', "Kids' club", 'Clubhouse restaurant', 'Village houses with hot tubs', '27-hole course', 'Private estate setting'],
    has_golf_package: true,
    onsite: true,
    active: true,
    featured: false,
    accommodation_type: 'resort',
    booking_url: 'https://www.booking.com/searchresults.html?ss=Castro%20Marim%20Golfe%20%26%20Country%20Club',
  },
  {
    slug: 'robinson-quinta-da-ria',
    name: 'Robinson Club Quinta da Ria',
    description: "A 4-star all-inclusive beach and golf resort in the unspoiled eastern Algarve, situated between the Quinta da Ria and Quinta de Cima golf courses. All 259 rooms have balconies overlooking either the fairways or the Ria Formosa nature reserve. The all-inclusive package covers meals at two restaurants, three pools, a spa, gym, tennis courts, and a kids' club.",
    town: 'Tavira',
    region: 'east',
    lat: 37.162, lng: -7.558,
    stars: 4,
    price_from: null,
    website: 'https://www.robinson.com/en/en/resort-holiday/portugal/quinta-da-ria/',
    amenities: ['All-inclusive', '3 pools', 'Spa & gym', '2 restaurants', "Kids' club", 'Tennis courts'],
    has_golf_package: true,
    onsite: true,
    active: true,
    featured: false,
    accommodation_type: 'resort',
    booking_url: 'https://www.booking.com/searchresults.html?ss=Robinson%20Club%20Quinta%20da%20Ria',
  },
  {
    slug: 'dona-filipa-hotel',
    name: 'Dona Filipa Hotel',
    description: 'A five-star beachfront hotel within the exclusive Vale do Lobo estate, the Dona Filipa Hotel is one of the Algarve\'s most storied golf resorts. Guests enjoy exclusive access to the legendary San Lorenzo Golf Course via complimentary transfer, two-minute walk to Vale do Lobo beach, and a pool with Atlantic views. The hotel boasts tennis courts, a spa, and acclaimed dining.',
    town: 'Almancil · Vale do Lobo',
    region: 'central',
    lat: 37.052, lng: -8.017,
    stars: 5,
    price_from: 220,
    website: 'https://www.donafilipa-hotel.com',
    amenities: ['Beachfront location', 'Outdoor pool', 'Tennis courts', 'Spa & wellness', 'Exclusive San Lorenzo access', 'Restaurant & bar'],
    has_golf_package: true,
    onsite: true,
    active: true,
    featured: true,
    accommodation_type: 'hotel',
    booking_url: 'https://www.booking.com/hotel/pt/dona-filipa.html',
  },
  {
    slug: 'victoria-golf-resort',
    name: 'Victoria Golf Resort & Spa',
    description: 'A luxury 260-room hotel directly adjacent to The Els Club Vilamoura — the Algarve\'s first private members\' golf club. Managed by Accor, the Victoria Golf Resort & Spa features four outdoor pools, four restaurants, a spa, a kids\' club, a fitness centre, and an exclusive arrangement giving guests a daily tee time on the Els Club course.',
    town: 'Vilamoura',
    region: 'central',
    lat: 37.1016, lng: -8.1444,
    stars: 5,
    price_from: null,
    website: 'https://www.victoriaresortvilamoura.com',
    amenities: ['4 outdoor pools', '4 restaurants & bars', 'Spa', "Kids' club", 'Direct Els Club access', 'Fitness centre'],
    has_golf_package: true,
    onsite: true,
    active: true,
    featured: true,
    accommodation_type: 'hotel',
    booking_url: 'https://www.booking.com/searchresults.html?ss=Victoria%20Golf%20Resort%20%26%20Spa%20Vilamoura',
  },
  {
    slug: 'pestana-gramacho-residences',
    name: 'Pestana Gramacho Residences',
    description: 'A 4-star golf aparthotel within 500 metres of the Gramacho clubhouse in the Pestana Carvoeiro golf resort. The 57 studios, T1 and T2 apartments all have balconies overlooking the fairways and fully equipped kitchens. Guests enjoy two outdoor pools, an indoor pool, sauna, fitness centre, and a shuttle bus to all Pestana courses.',
    town: 'Carvoeiro',
    region: 'central',
    lat: 37.1248, lng: -8.4875,
    stars: 4,
    price_from: 161,
    website: 'https://www.pestana.com/en/hotel/pestana-gramacho-residences',
    amenities: ['2 outdoor pools', '1 indoor pool', 'Sauna', 'Fitness centre', 'Golf views', 'Shuttle to Pestana courses'],
    has_golf_package: true,
    onsite: true,
    active: true,
    featured: false,
    accommodation_type: 'hotel',
    booking_url: 'https://www.booking.com/searchresults.html?ss=Pestana%20Gramacho%20Residences',
  },
]

// ─── 2. Existing hotels to update (descriptions + amenities + website) ─────

const EXISTING_HOTEL_UPDATES: Record<string, { description: string; amenities: string[]; website: string }> = {
  'pine-cliffs-residence': {
    description: 'Perched on the red sandstone cliffs above Praia da Falésia, Pine Cliffs Resort is a five-star Luxury Collection property (Marriott International) with direct beach access via a cliffside lift. The resort offers suites and apartments, a world-class spa, and 13 dining venues.',
    amenities: ['Serenity Spa', '8 swimming pools', 'Private beach access', '13 restaurants & bars', 'Tennis club', "Porto Pirata kids' club"],
    website: 'https://www.pinecliffs.com',
  },
  'penina-hotel': {
    description: "The Algarve's original five-star hotel, Penina Hotel & Golf Resort sits on a 360-acre parkland estate that Sir Henry Cotton transformed from rice paddies by planting over 360,000 trees. Its rooms and suites, six dining venues, and championship golf pedigree make it one of Portugal's most storied golf resorts.",
    amenities: ['Outdoor pool', '6 dining venues', 'Tennis courts', 'Fitness centre & spa', "Kids' club", 'Golf academy'],
    website: 'https://www.penina.com',
  },
  'monte-rei-hotel': {
    description: 'Set on a private 1,000-acre estate in the Eastern Algarve, Monte Rei offers villa and apartment residences in traditional Portuguese architecture with modern luxury finishes. The estate is home to Vistas by Rui Silvestre, a Michelin-starred restaurant, and the Jack Nicklaus Signature course ranked #1 in Portugal.',
    amenities: ['Vistas Rui Silvestre (Michelin-starred)', 'Swimming pool', 'Tennis courts', 'Gym & sauna', 'Golf academy', 'Concierge service'],
    website: 'https://www.monte-rei.com',
  },
  'palmares-beach-house': {
    description: 'A boutique 5-star property set between the 27th green and the driving range of the 27-hole Palmares course, overlooking Meia Praia beach and Lagos Bay. With 22 rooms and suites, a restaurant, and a pool, it offers an intimate and scenic base for golfers exploring the western Algarve.',
    amenities: ['Restaurant', 'Swimming pool', 'Lounge bar', 'Golf course views', 'Beach proximity'],
    website: 'https://www.palmaresliving.com',
  },
}

// ─── 3. Course → hotel slug mapping ───────────────────────────────────────
// key = course slug, value = hotel slug (used to look up hotel id after insert)

const COURSE_TO_HOTEL: Record<string, string> = {
  // Existing hotels in DB
  'pine-cliffs':           'pine-cliffs-residence',
  'penina-championship':   'penina-hotel',
  'penina-resort':         'penina-hotel',
  'monte-rei':             'monte-rei-hotel',
  'palmares':              'palmares-beach-house',
  'amendoeira-faldo':      'amendoeira-golf-resort-IadWnw',
  'amendoeira-oconnor':    'amendoeira-golf-resort-IadWnw',
  'morgado':               'nau-morgado-golf-country-club-c-7S-s',
  'alamos':                'nau-morgado-golf-country-club-c-7S-s',
  'boavista':              'boavista-golf-spa-resort-PbtXsI',
  // New hotels
  'ombria':                'viceroy-ombria',
  'quinta-do-lago-south':  'hotel-quinta-do-lago',
  'quinta-do-lago-north':  'hotel-quinta-do-lago',
  'quinta-do-lago-laranjal': 'hotel-quinta-do-lago',
  'balaia':                'balaia-golf-village',
  'castro-marim':          'castro-marim-golf-club',
  'quinta-da-ria':         'robinson-quinta-da-ria',
  'quinta-de-cima':        'robinson-quinta-da-ria',
  'vale-do-lobo-ocean':    'dona-filipa-hotel',
  'vale-do-lobo-royal':    'dona-filipa-hotel',
  'victoria-els-club':     'victoria-golf-resort',
  'gramacho':              'pestana-gramacho-residences',
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${'─'.repeat(60)}`)
  console.log('  Onsite Hotels Sync')
  console.log(`  Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`)
  console.log(`${'─'.repeat(60)}\n`)

  // ── Step 1: Insert new hotels ──────────────────────────────────────────

  console.log('Step 1: Inserting new onsite hotels...\n')
  const insertedSlugs = new Set<string>()

  // Check which slugs already exist
  const { data: existing } = await supabase
    .from('hotels')
    .select('slug')
    .in('slug', NEW_HOTELS.map(h => h.slug))

  const existingSlugs = new Set((existing ?? []).map(h => h.slug))

  for (const hotel of NEW_HOTELS) {
    if (existingSlugs.has(hotel.slug)) {
      console.log(`  ⤼ skip  ${hotel.slug} (already exists)`)
      continue
    }

    const { lat, lng, ...hotelWithoutLatLng } = hotel
    const row = {
      ...hotelWithoutLatLng,
      location: makePointWKB(lng, lat),
      review_count: 0,
    } as Record<string, unknown>

    if (dryRun) {
      console.log(`  ~ dry   ${hotel.slug}`)
      insertedSlugs.add(hotel.slug)
      continue
    }

    const { error } = await supabase.from('hotels').insert(row as never)
    if (error) {
      console.error(`  ✗ error ${hotel.slug}: ${error.message}`)
    } else {
      console.log(`  ✓ done  ${hotel.slug}`)
      insertedSlugs.add(hotel.slug)
    }
  }

  // ── Step 2: Update existing hotels with description/amenities/website ──

  console.log('\nStep 2: Updating existing hotels with descriptions...\n')

  for (const [slug, updates] of Object.entries(EXISTING_HOTEL_UPDATES)) {
    if (dryRun) {
      console.log(`  ~ dry   ${slug}`)
      continue
    }
    const { error } = await supabase
      .from('hotels')
      .update(updates)
      .eq('slug', slug)
    if (error) {
      console.error(`  ✗ error ${slug}: ${error.message}`)
    } else {
      console.log(`  ✓ done  ${slug}`)
    }
  }

  // ── Step 3: Build hotel slug → UUID map ────────────────────────────────

  console.log('\nStep 3: Building hotel UUID map...\n')

  const allSlugs = [...new Set(Object.values(COURSE_TO_HOTEL))]
  const { data: hotelRows, error: hotelErr } = await supabase
    .from('hotels')
    .select('id, slug')
    .in('slug', allSlugs)

  if (hotelErr || !hotelRows) {
    console.error('Failed to fetch hotel UUIDs:', hotelErr?.message)
    process.exit(1)
  }

  const hotelIdBySlug = new Map(hotelRows.map(h => [h.slug, h.id]))

  // Verify all slugs resolved
  let missing = false
  for (const slug of allSlugs) {
    if (!hotelIdBySlug.has(slug)) {
      console.error(`  ✗ missing hotel slug: ${slug}`)
      missing = true
    } else {
      console.log(`  ✓ ${slug} → ${hotelIdBySlug.get(slug)}`)
    }
  }
  if (missing && !dryRun) {
    console.error('\nAborted: some hotels could not be resolved. Did you run Step 1 without --dry-run?')
    process.exit(1)
  }

  // ── Step 4: Update courses with onsite_hotel_id + has_own_hotel ────────

  console.log('\nStep 4: Linking courses to hotels...\n')

  for (const [courseSlug, hotelSlug] of Object.entries(COURSE_TO_HOTEL)) {
    const hotelId = hotelIdBySlug.get(hotelSlug)
    if (!hotelId) continue

    if (dryRun) {
      console.log(`  ~ dry   ${courseSlug} → ${hotelSlug}`)
      continue
    }

    const { error } = await supabase
      .from('courses')
      .update({ onsite_hotel_id: hotelId, has_own_hotel: true })
      .eq('slug', courseSlug)

    if (error) {
      console.error(`  ✗ error ${courseSlug}: ${error.message}`)
    } else {
      console.log(`  ✓ done  ${courseSlug} → ${hotelSlug}`)
    }
  }

  // ── Step 5: Fix booking URLs (search.html → searchresults.html) ────────

  console.log('\nStep 5: Fixing booking URLs...\n')

  if (!dryRun) {
    // Fetch all hotels with broken booking URLs
    const { data: broken, error: brokenErr } = await supabase
      .from('hotels')
      .select('id, name, booking_url')
      .like('booking_url', '%/search.html%')

    if (brokenErr) {
      console.error('Failed to fetch broken URLs:', brokenErr.message)
    } else {
      console.log(`  Found ${broken?.length ?? 0} hotels with /search.html`)

      for (const hotel of (broken ?? [])) {
        const fixed = hotel.booking_url!.replace('/search.html', '/searchresults.html')
        const { error } = await supabase
          .from('hotels')
          .update({ booking_url: fixed })
          .eq('id', hotel.id)
        if (error) {
          console.error(`  ✗ error ${hotel.name}: ${error.message}`)
        }
      }
      console.log(`  ✓ Fixed ${broken?.length ?? 0} booking URLs`)
    }
  } else {
    console.log('  ~ dry   (would fix all /search.html → /searchresults.html)')
  }

  console.log(`\n${'─'.repeat(60)}`)
  console.log(`  Done! ${dryRun ? '(dry run — no changes made)' : ''}`)
  console.log(`${'─'.repeat(60)}\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
