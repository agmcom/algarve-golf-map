/**
 * Syncs blurbs from MOCK_COURSES to Supabase.
 * Only updates rows where the DB blurb is null (won't overwrite manual edits).
 *
 * Usage:
 *   npx tsx scripts/sync-blurbs.ts
 *   npx tsx scripts/sync-blurbs.ts --force   ← overwrites even non-null blurbs
 */

import { createClient } from '@supabase/supabase-js'
import { MOCK_COURSES } from '../src/data/courses'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars. Run: source .env.local && npx tsx scripts/sync-blurbs.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const force    = process.argv.includes('--force')

async function main() {
  const toSync = MOCK_COURSES.filter(c => c.blurb)

  console.log(`\nSyncing ${toSync.length} blurbs to Supabase${force ? ' (--force: overwriting existing)' : ' (skipping non-null)'}...\n`)

  let updated = 0
  let skipped = 0

  for (const course of toSync) {
    if (!force) {
      // Check if the DB already has a blurb
      const { data } = await supabase
        .from('courses')
        .select('blurb')
        .eq('slug', course.slug)
        .single()

      if (data?.blurb) {
        console.log(`  ⤼ skip  ${course.slug}`)
        skipped++
        continue
      }
    }

    const { error } = await supabase
      .from('courses')
      .update({ blurb: course.blurb })
      .eq('slug', course.slug)

    if (error) {
      console.error(`  ✗ error ${course.slug}: ${error.message}`)
    } else {
      console.log(`  ✓ done  ${course.slug}`)
      updated++
    }
  }

  console.log(`\nDone. Updated: ${updated}  Skipped: ${skipped}\n`)
}

main()
