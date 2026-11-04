/**
 * Copies the verified club-hire details in src/lib/club-rental.ts to the
 * `shops` table so the individual shop pages match /club-rental.
 * Hidden providers are left untouched.
 *
 * Usage:
 *   npx tsx scripts/sync-rental-info.ts --dry-run
 *   npx tsx scripts/sync-rental-info.ts
 */

import { createClient } from '@supabase/supabase-js'
import { RENTAL_INFO } from '../src/lib/club-rental'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars. Run:\n  export $(cat .env.local | grep -v ^# | xargs) && npx tsx scripts/sync-rental-info.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const dryRun = process.argv.includes('--dry-run')

async function main() {
  for (const [slug, info] of Object.entries(RENTAL_INFO)) {
    if (info.hidden) {
      console.log(`SKIP ${slug} (hidden)`)
      continue
    }

    const data = {
      rental_price_per_day: info.pricePerDay ?? null,
      rental_price_notes: info.priceNotes ?? null,
      delivery_to_course: info.delivers ?? false,
      rental_delivery_areas: info.deliveryAreas ?? [],
      rental_set_types: info.setTypes ?? [],
    }

    const { data: current, error: readError } = await supabase
      .from('shops')
      .select(Object.keys(data).join(','))
      .eq('slug', slug)
      .single()
    if (readError || !current) throw new Error(`${slug}: ${readError?.message ?? 'not found'}`)

    const before = current as unknown as Record<string, unknown>
    const changes = Object.entries(data).filter(([key, value]) => JSON.stringify(before[key]) !== JSON.stringify(value))
    console.log(`\n${slug}: ${changes.length} change(s)`)
    for (const [key, value] of changes) {
      console.log(`  ${key}\n    was: ${JSON.stringify(before[key])}\n    now: ${JSON.stringify(value)}`)
    }

    if (!dryRun && changes.length > 0) {
      const { error } = await supabase.from('shops').update(Object.fromEntries(changes)).eq('slug', slug)
      if (error) throw new Error(`${slug}: ${error.message}`)
    }
  }
  console.log(dryRun ? '\nDry run: nothing written.' : '\nDone.')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
