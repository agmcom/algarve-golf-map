/**
 * Fills in the 7 Nevada Bob's Golf locations left without a description in
 * scripts/sync-shops-info.ts. These are minimal, factual, on-course shop
 * descriptions (host course + resort) — no location-specific marketing copy
 * was found on the official site for these locations, so nothing beyond
 * confirmed facts is stated.
 *
 * Usage:
 *   npx tsx scripts/sync-shops-nbg-descriptions.ts
 *   npx tsx scripts/sync-shops-nbg-descriptions.ts --dry-run
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars. Run:\n  export $(cat .env.local | grep -v ^# | xargs) && npx tsx scripts/sync-shops-nbg-descriptions.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const dryRun = process.argv.includes('--dry-run')

const UPDATES: { slug: string; description: string }[] = [
  {
    slug: 'nevada-bobs-alto-golf',
    description: 'On-course Nevada Bob\'s Golf pro shop at Alto Golf, Portimão, part of the Nevada Bob\'s Golf retail network in the Algarve.',
  },
  {
    slug: 'nevada-bobs-gramacho',
    description: 'On-course Nevada Bob\'s Golf pro shop at Gramacho Golf Course, part of the Pestana Carvoeiro Resort in Carvoeiro.',
  },
  {
    slug: 'nevada-bobs-quinta-do-lago',
    description: 'Nevada Bob\'s Golf store in Quinta dos Coqueiros, on the road linking central Almancil to Quinta do Lago. Opened with its own club-fitting area alongside the retail floor.',
  },
  {
    slug: 'nevada-bobs-silves',
    description: 'On-course Nevada Bob\'s Golf pro shop at Pestana Silves Golfe.',
  },
  {
    slug: 'nevada-bobs-vale-da-pinta',
    description: 'On-course Nevada Bob\'s Golf pro shop at Vale da Pinta Golf Course, part of the Pestana Carvoeiro Resort in Carvoeiro.',
  },
  {
    slug: 'nevada-bobs-vila-sol',
    description: 'On-course Nevada Bob\'s Golf pro shop at Pestana Vila Sol Golf, Quarteira.',
  },
  {
    slug: 'nevada-bobs-quinta-da-ria',
    description: 'Pro shop at Quinta da Ria Golf Course, Vila Nova de Cacela, operated under the Nevada Bob\'s Golf brand.',
  },
]

async function main() {
  console.log(`${dryRun ? '[DRY RUN] ' : ''}Applying ${UPDATES.length} description updates...\n`)

  let ok = 0
  let failed = 0

  for (const { slug, description } of UPDATES) {
    if (dryRun) {
      console.log(`Would update ${slug}: "${description}"`)
      continue
    }
    const { error } = await supabase.from('shops').update({ description }).eq('slug', slug)
    if (error) {
      console.error(`✗ ${slug}: ${error.message}`)
      failed++
    } else {
      console.log(`✓ ${slug}`)
      ok++
    }
  }

  if (!dryRun) {
    console.log(`\nDone. ${ok} updated, ${failed} failed.`)
  }
}

main()
