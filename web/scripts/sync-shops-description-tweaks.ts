/**
 * Light SEO touch-up: adds the missing town/"Algarve" mention to the 4
 * shop descriptions that didn't already name their location explicitly.
 * No new facts added — same content, just naming the place already implied
 * by the course/resort name.
 *
 * Usage:
 *   npx tsx scripts/sync-shops-description-tweaks.ts
 *   npx tsx scripts/sync-shops-description-tweaks.ts --dry-run
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars. Run:\n  export $(cat .env.local | grep -v ^# | xargs) && npx tsx scripts/sync-shops-description-tweaks.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const dryRun = process.argv.includes('--dry-run')

const UPDATES: { slug: string; description: string }[] = [
  {
    slug: 'monte-rei-pro-shop',
    description: 'Pro shop within the clubhouse at Monte Rei Golf & Country Club in Vila Nova de Cacela, Algarve, offering golf clubs, balls and equipment alongside branded apparel and footwear, with custom club-fitting appointments available.',
  },
  {
    slug: 'pinheiros-altos-pro-shop',
    description: 'Golf pro shop within the clubhouse at Pinheiros Altos Golf Resort in Almancil, Algarve, offering designer golf apparel and branded golf equipment; the golf reception desk is located inside the shop.',
  },
  {
    slug: 'salgados-golf-shop',
    description: 'Pro shop in the clubhouse at Salgados Golf Course in Albufeira, Algarve, offering golf accessories, equipment and apparel including golf balls, tees, towels, hats and performance clothing.',
  },
  {
    slug: 'nevada-bobs-silves',
    description: 'On-course Nevada Bob\'s Golf pro shop at Pestana Silves Golfe in Silves, Algarve.',
  },
]

async function main() {
  console.log(`${dryRun ? '[DRY RUN] ' : ''}Applying ${UPDATES.length} description tweaks...\n`)
  for (const { slug, description } of UPDATES) {
    if (dryRun) {
      console.log(`Would update ${slug}: "${description}"`)
      continue
    }
    const { error } = await supabase.from('shops').update({ description }).eq('slug', slug)
    console.log(error ? `✗ ${slug}: ${error.message}` : `✓ ${slug}`)
  }
}

main()
