/**
 * Generates Booking.com search URLs for all hotels that don't have a booking_url.
 * Uses hotel name as the search query — redirects directly to the hotel page if found,
 * otherwise shows search results. Stay22 can tag these links automatically.
 *
 * Future improvement: replace with direct hotel page URLs for better accuracy.
 *
 * Usage:
 *   npx tsx scripts/sync-hotel-booking-urls.ts
 *   npx tsx scripts/sync-hotel-booking-urls.ts --dry-run
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const dryRun = process.argv.includes('--dry-run')

function bookingSearchUrl(name: string): string {
  return `https://www.booking.com/search.html?ss=${encodeURIComponent(name)}`
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  const { data: hotels, error } = await supabase
    .from('hotels')
    .select('id, name, booking_url')
    .is('booking_url', null)

  if (error || !hotels) {
    console.error('Error fetching hotels:', error?.message)
    process.exit(1)
  }

  console.log(`Found ${hotels.length} hotels without booking_url`)
  if (dryRun) console.log('-- DRY RUN --\n')

  let updated = 0
  let failed = 0

  for (const hotel of hotels) {
    const url = bookingSearchUrl(hotel.name)

    if (dryRun) {
      console.log(`  ${hotel.name}\n  → ${url}\n`)
      continue
    }

    const { error: updateError } = await supabase
      .from('hotels')
      .update({ booking_url: url })
      .eq('id', hotel.id)

    if (updateError) {
      console.error(`  FAIL: ${hotel.name} — ${updateError.message}`)
      failed++
    } else {
      updated++
      if (updated % 50 === 0) console.log(`  ${updated}/${hotels.length} updated...`)
    }
  }

  if (!dryRun) {
    console.log(`\nDone: ${updated} updated, ${failed} failed`)
  }
}

main()
