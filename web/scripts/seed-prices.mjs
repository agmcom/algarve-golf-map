// Replace all visitor green fees in course_prices with the rows in scripts/data/prices-2026-27.json.
// Usage: node --env-file=.env.local scripts/seed-prices.mjs
//
// The data file is built by research/prices-2026-10/build_prices.py from each club's own
// published price list or online booking engine; each row's `notes` names its source.
// Unlike the old version, this deletes the existing visitor rows first, so re-running it
// never duplicates prices.

import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (node --env-file=.env.local …)')

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const DATA = JSON.parse(readFileSync(new URL('./data/prices-2026-27.json', import.meta.url), 'utf8'))

async function main() {
  console.log(`Seeding ${DATA.length} price rows…`)

  // 1. Map slugs to course ids; refuse to run if any slug is unknown
  const { data: courses, error: cErr } = await supabase.from('courses').select('id, slug')
  if (cErr) { console.error('Failed to fetch courses:', cErr.message); process.exit(1) }
  const slugToId = Object.fromEntries(courses.map(c => [c.slug, c.id]))
  const missing = [...new Set(DATA.map(r => r.slug).filter(s => !slugToId[s]))]
  if (missing.length) { console.error('Slugs not found in DB:', missing.join(', ')); process.exit(1) }

  const rows = DATA.map(({ slug, ...r }) => ({ course_id: slugToId[slug], rate_type: 'visitor', ...r }))

  // 2. Delete the existing visitor rows
  const { error: dErr } = await supabase.from('course_prices').delete().eq('rate_type', 'visitor')
  if (dErr) { console.error('Delete failed:', dErr.message); process.exit(1) }
  console.log('✓ Old visitor rows deleted.')

  // 3. Insert in batches of 100
  let inserted = 0
  const BATCH = 100
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error } = await supabase.from('course_prices').insert(batch)
    if (error) { console.error(`Batch ${i}–${i + BATCH} failed:`, error.message); process.exit(1) }
    inserted += batch.length
    process.stdout.write(`\r  ${inserted}/${rows.length} rows inserted`)
  }
  console.log(`\n✓ Done — ${inserted} rows inserted.`)

  // 4. price_from on courses = cheapest standard rate (twilight-only courses get null)
  const mins = {}
  for (const r of rows) if (r.time_slot === 'standard') mins[r.course_id] = Math.min(mins[r.course_id] ?? Infinity, r.price_eur)
  let updated = 0
  for (const id of new Set(rows.map(r => r.course_id))) {
    const { error } = await supabase.from('courses').update({ price_from: mins[id] ?? null }).eq('id', id)
    if (!error) updated++
  }
  console.log(`✓ Updated price_from on ${updated} courses (standard rates only).`)
}

main()
