/**
 * Syncs facility flags to Supabase for all 37 Algarve courses.
 * Data verified from each course's official website (June 2026).
 *
 * Fields updated:
 *   driving_range  – dedicated driving range on site
 *   pro_shop       – pro shop / golf retail in clubhouse
 *   restaurant     – restaurant or bar with food service
 *   has_own_hotel  – hotel physically on the golf property
 *   caddie_service – caddies available for hire
 *   offers_rental  – club hire / equipment rental available
 *
 * Usage:
 *   npx tsx scripts/sync-facilities.ts
 *   npx tsx scripts/sync-facilities.ts --dry-run
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars. Run:\n  export $(cat .env.local | grep -v ^# | xargs) && npx tsx scripts/sync-facilities.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const dryRun   = process.argv.includes('--dry-run')

type Facilities = {
  slug:           string
  driving_range:  boolean
  pro_shop:       boolean
  restaurant:     boolean
  has_own_hotel:  boolean
  caddie_service: boolean
  offers_rental:  boolean
}

const FACILITIES: Facilities[] = [

  // ── VILAMOURA (Dom Pedro / Els Club group) ───────────────────────────────
  // All four Dom Pedro courses share the same complex and its full facilities.
  // Driving range is the shared Pinhal Academy complex; all courses have access.
  // Sources: vilamouragolf.com individual course pages + portugal-live.net
  { slug: 'vilamoura-old-course',    driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  { slug: 'vilamoura-pinhal',        driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  { slug: 'vilamoura-laguna',        driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  { slug: 'vilamoura-millennium',    driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  // Els Club Vilamoura: redesigned private members club; forecaddie compulsory.
  // High-end retail boutique confirmed; no driving range at course; no club hire (members only).
  // Source: elsclubvilamoura.com
  { slug: 'victoria-els-club',       driving_range: false, pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: true,  offers_rental: false },
  // Vila Sol (Pestana): 27-hole parkland; dedicated driving range + L'Olive restaurant.
  // Source: pestanagolf.com/clubhouses/clubhouse-vila-sol
  { slug: 'vila-sol',                driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },

  // ── QUINTA DO LAGO ────────────────────────────────────────────────────────
  // All three QDL courses share the estate's full practice and clubhouse facilities.
  // South: caddie hire explicitly offered. North and Laranjal: no caddie service listed.
  // The Conrad Algarve and Magnolia Hotel are on the estate but are separate entities.
  // Sources: quintadolago.com
  { slug: 'quinta-do-lago-south',    driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: true,  offers_rental: true  },
  { slug: 'quinta-do-lago-north',    driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  { slug: 'quinta-do-lago-laranjal', driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  // Pinheiros Altos: two driving ranges, full academy, pro shop, restaurant confirmed.
  // Royal Algarve hotel project is not yet operational (still developing).
  // Source: pinheirosaltos.com
  { slug: 'pinheiros-altos',         driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  // San Lorenzo: exclusive course with caddie hire on request; new clubhouse expected 2027.
  // Dona Filipa Hotel is a "sister hotel" — a separate entity, not on-site at the course.
  // Source: sanlorenzogolfcourse.com + leadingcourses.com
  { slug: 'san-lorenzo',             driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: true,  offers_rental: true  },

  // ── VALE DO LOBO ──────────────────────────────────────────────────────────
  // Both courses share the Nevada Bob's pro shop and Spikes Restaurant & Bar.
  // 245m driving range confirmed on Ocean course page; shared with Royal.
  // Source: valedolobo.com
  { slug: 'vale-do-lobo-royal',      driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  { slug: 'vale-do-lobo-ocean',      driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },

  // ── ALBUFEIRA ─────────────────────────────────────────────────────────────
  // Balaia: driving range and "Clubhouse & Pro Shop" confirmed; restaurant not listed.
  // Source: balaiagolfvillage.com
  { slug: 'balaia',                  driving_range: true,  pro_shop: true,  restaurant: false, has_own_hotel: false, caddie_service: false, offers_rental: true  },
  // Pine Cliffs: driving range with 9 flag positions confirmed (search 2025).
  // Sheraton Pine Cliffs Resort hotel on site.
  // Source: pinecliffs.com + algarvepackage.com
  { slug: 'pine-cliffs',             driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: true,  caddie_service: false, offers_rental: true  },
  // Salgados: driving range, pro shop, restaurant confirmed; €3.2m upgrade announced Dec 2024.
  // Partner hotels (Marriott, Westin) are off-site.
  // Source: salgadosgolf.com + glencorgolf.com
  { slug: 'salgados',                driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },

  // ── CARVOEIRO / LAGOA (Pestana group) ────────────────────────────────────
  // Gramacho and Vale da Pinta share the same Pestana Carvoeiro clubhouse facilities.
  // "Taco, buggy and trolley hire" explicitly stated on pestanagolf.com.
  // Source: pestanagolf.com/gramacho
  { slug: 'gramacho',                driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  { slug: 'vale-da-pinta',           driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  // Vale de Milho: compact 9-hole par-3; "6 Clubhouse" with food & drinks confirmed.
  // No driving range; no dedicated pro shop (basic clubhouse only). Club hire available.
  // Source: valedemilhogolf.com
  { slug: 'vale-de-milho',           driving_range: false, pro_shop: false, restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  // Silves (Pestana): no driving range per official page; pro shop and restaurant confirmed.
  // Source: pestanagolf.com + algarverealestate.com
  { slug: 'silves',                  driving_range: false, pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },

  // ── PORTIMÃO ──────────────────────────────────────────────────────────────
  // Alto Golf (Pestana): no driving range on site; pro shop, restaurant (Thyme) confirmed.
  // Club hire confirmed on search. Private country-club feel.
  // Source: altoclub.com + glencorgolf.com
  { slug: 'alto-golf',               driving_range: false, pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  // Alamos (NAU): 2 practice tees, pro shop, restaurant confirmed.
  // Shares the dual driving range/practice complex with Morgado.
  // Source: nauhotels.com/en/golf/alamos-golf
  { slug: 'alamos',                  driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  // Morgado (NAU): 2 driving ranges, pro shop, restaurant confirmed. Hotel on site.
  // Source: nauhotels.com/nau-morgado-golf-country-club + findagolfbreak.com
  { slug: 'morgado',                 driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: true,  caddie_service: false, offers_rental: true  },
  // Penina Championship: largest driving range in Portugal (70 bays). Hotel Penina on site.
  // Club hire available subject to availability.
  // Source: penina.com + cpg.golf/travel-club
  { slug: 'penina-championship',     driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: true,  caddie_service: false, offers_rental: true  },
  // Penina Resort: 9-hole warm-up loop; shares all championship course facilities.
  // Source: penina.com/golf/golf-courses/resort-course
  { slug: 'penina-resort',           driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: true,  caddie_service: false, offers_rental: true  },

  // ── LAGOS / WESTERN ALGARVE ───────────────────────────────────────────────
  // Boavista: driving range confirmed (temporarily closed for repairs but exists).
  // Boavista Hotel inaugurated July 2025 — luxury boutique hotel on the golf property.
  // Source: boavistaresort.pt + theportugalnews.com (2025-07-23)
  { slug: 'boavista',                driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: true,  caddie_service: false, offers_rental: true  },
  // Palmares: driving range with sea views confirmed. Palmares Beach House Hotel on site.
  // RCR-designed clubhouse with two dining experiences. Club hire confirmed.
  // Source: palmaresliving.com/golf/clubhouse + glencorgolf.com
  { slug: 'palmares',                driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: true,  caddie_service: false, offers_rental: true  },
  // Espiche: driving range confirmed (teetimes.pt Espiche Driving Range listing).
  // Pro shop, Gecko Restaurant confirmed. No hotel on site (future development planned).
  // Source: espichegolf.pt + algarverealestate.com
  { slug: 'espiche',                 driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  // Santo António: driving range, pro shop (Spike Bar & Restaurant), club/shoe hire confirmed.
  // SA Resorts offers villas/spa — villa accommodation, not a hotel.
  // Source: algarvegolfguide.co.uk + portugalgolf.net
  { slug: 'santo-antonio',           driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },

  // ── AMENDOEIRA ────────────────────────────────────────────────────────────
  // Both courses share the resort's large clubhouse (restaurant, bar, pro shop) and driving range.
  // Accommodation is apartments and villas — not a hotel.
  // Source: amendoeiraresort.com + golfbreaks.com
  { slug: 'amendoeira-faldo',        driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  { slug: 'amendoeira-oconnor',      driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },

  // ── LOULÉ / INTERIOR ──────────────────────────────────────────────────────
  // Ombria: GEO-certified; no driving range (by sustainable design brief — confirmed).
  // Pro shop and restaurant (with panoramic views) confirmed. Viceroy hotel on site.
  // Club hire confirmed ("premium rentals service" on ombria.com).
  // Source: ombria.com + portugalgolf.net + glencorgolf.com
  { slug: 'ombria',                  driving_range: false, pro_shop: true,  restaurant: true,  has_own_hotel: true,  caddie_service: false, offers_rental: true  },

  // ── EASTERN ALGARVE ───────────────────────────────────────────────────────
  // Benamor: all four main facilities confirmed explicitly on the official website.
  // Source: benamorgolf.com
  { slug: 'benamor',                 driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  // Quinta da Ria and Quinta de Cima share the same clubhouse and practice facilities.
  // Source: quintadaria.com
  { slug: 'quinta-da-ria',           driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  { slug: 'quinta-de-cima',          driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  // Monte Rei: Portugal's #1 course; dedicated Pro Shop page on official site.
  // Caddie master service confirmed (every group receives a caddie master).
  // Luxury hotel villas on site.
  // Source: monte-rei.com + todays-golfer.com
  { slug: 'monte-rei',               driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: true,  caddie_service: true,  offers_rental: true  },
  // Quinta do Vale: putting green confirmed; driving range not explicitly confirmed.
  // Pro shop and restaurant confirmed on official site.
  // Source: quintadovalegolf.com
  { slug: 'quinta-do-vale',          driving_range: false, pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  // Castro Marim: two driving ranges confirmed; pro shop, restaurant confirmed.
  // Source: glencorgolf.com + algarverealestate.com + mycaddymaster.com
  { slug: 'castro-marim',            driving_range: true,  pro_shop: true,  restaurant: true,  has_own_hotel: false, caddie_service: false, offers_rental: true  },
  // Pestana Ferragudo: new soft-opening course (June 2026). Boutique hotel on site confirmed.
  // Restaurant/bar at clubhouse confirmed. No driving range listed. Club hire unconfirmed.
  // Source: pestanaferragudo.com
  { slug: 'pestana-ferragudo',       driving_range: false, pro_shop: true,  restaurant: true,  has_own_hotel: true,  caddie_service: false, offers_rental: false },

]

async function main() {
  console.log(`\n${dryRun ? '[DRY RUN] ' : ''}Syncing facilities for ${FACILITIES.length} courses...\n`)

  let updated = 0
  let errors  = 0

  for (const f of FACILITIES) {
    const { slug, ...fields } = f

    if (dryRun) {
      const flags = Object.entries(fields)
        .filter(([, v]) => v)
        .map(([k]) => k.replace('_', ' ').replace('has own hotel', 'hotel').replace('offers rental', 'rental').replace('caddie service', 'caddie').replace('driving range', 'range').replace('pro shop', 'shop'))
        .join(' · ')
      console.log(`  ~ ${slug.padEnd(32)} ${flags || '(none)'}`)
      continue
    }

    const { error } = await supabase
      .from('courses')
      .update(fields)
      .eq('slug', slug)

    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`)
      errors++
    } else {
      const flags = [
        fields.driving_range  ? 'range'  : '     ',
        fields.pro_shop       ? 'shop'   : '    ',
        fields.restaurant     ? 'rest'   : '    ',
        fields.has_own_hotel  ? 'hotel'  : '     ',
        fields.caddie_service ? 'caddie' : '      ',
        fields.offers_rental  ? 'rental' : '',
      ].join(' ')
      console.log(`  ✓ ${slug.padEnd(34)} ${flags}`)
      updated++
    }
  }

  if (dryRun) {
    console.log('\n[DRY RUN] No changes written.\n')
  } else {
    console.log(`\nDone. Updated: ${updated}  Errors: ${errors}\n`)
  }
}

main()
