/**
 * Corrects the "Hiring golf clubs at Faro Airport" guide with details checked on
 * each provider's website on 2026-11-04, and adds a comparison table.
 * Saves the current content to ../research/backups before writing.
 *
 * Usage:
 *   npx tsx scripts/update-faro-hire-guide.ts --dry-run
 *   npx tsx scripts/update-faro-hire-guide.ts
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars. Run:\n  export $(cat .env.local | grep -v ^# | xargs) && npx tsx scripts/update-faro-hire-guide.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const dryRun = process.argv.includes('--dry-run')
const SLUG = 'hiring-golf-clubs-at-faro-airport'

type Block = Record<string, unknown> & { text?: string }

// Each paragraph is found by its opening words and replaced in full.
const REPLACEMENTS: { startsWith: string; text: string }[] = [
  {
    startsWith: 'Most airlines flying into Faro',
    text: 'Most airlines flying into Faro charge separately for golf clubs. Online, expect roughly £35–£45 or €40–€45 each way on Jet2, Ryanair, easyJet, Aer Lingus and TAP, and more on some others, such as around €80 each way on Lufthansa unless clubs are part of your allowance. Over a return trip for two people that adds up quickly, before you factor in the risk of damage in the hold or a bag that misses a connection. Hiring locally removes the fee and the bulky travel cover. The trade-off is that you play a set you are not used to, which matters more to low handicappers than to the average holiday golfer. For a longer stay, or if you are very particular about your clubs, flying with them can still be worth it.',
  },
  {
    startsWith: 'The pattern is similar across all three',
    text: 'The process is similar with each company. You book before you travel, then either collect at the airport or arrange delivery where it is offered. A typical bag includes a driver, irons, a wedge, a putter and a carry bag, but the exact contents vary, so check what is included when you book. Ladies\' and left-handed sets are widely offered, while junior sets are less common. You normally return the clubs to the same place before your flight home.',
  },
  {
    startsWith: 'Three rental companies collect',
    text: 'Three rental companies offer collection at Faro Airport. ClubsToHire and MyCaddyMaster also offer delivery. Faro Golf Club Hire\'s website doesn\'t mention delivery, so ask if you need it.',
  },
  {
    startsWith: 'Pickup is in the **arrivals hall**',
    text: 'Pickup is at its shop in the **arrivals hall**, so you can collect your clubs as soon as you land. It is open from 07:00 to 23:00 for pre-booked times, with out-of-hours collection from 05:30 to 07:00 and from 23:00 to 00:30 for an extra €25. Sets include Callaway, TaylorMade, PXG, Cobra and Ping, with men\'s, ladies\' and left-handed options. The company\'s headline price is from €50 per set per week, but that is not specific to Faro, so confirm your price when you book. It also delivers to hotels, resorts, villas and courses across the Algarve, and charges may apply depending on your location.',
  },
  {
    startsWith: "MyCaddyMaster's counter",
    text: 'MyCaddyMaster uses a meeting point at the airport, which has been listed as **Cafe PAUL in the departures terminal**, so check your booking confirmation. Its sets come in three packs: Evolution, Performance and Excellence. The website headline says from €5 a day, while the set prices it lists run from €9.30 to €21.80, so enter your dates to see the exact price. Brands include Callaway, TaylorMade, Srixon, Cleveland, Cobra, XXIO and Ping, and men\'s, ladies\', junior and left-handed sets are offered. Clubs can also be delivered to the place of your choice.',
  },
  {
    startsWith: 'Faro Golf Club Hire works on',
    text: 'Faro Golf Club Hire offers collection at Faro Airport, with Ben Sayers, Callaway, Ping and TaylorMade sets, and options for men and women and for right- and left-handed players. Its website doesn\'t publish prices or delivery details, so phone for a quote and to confirm the arrangements.',
  },
  {
    startsWith: 'As a rough guide, a standard rental set',
    text: 'Prices depend on the company, the set and how long you hire for. At the airport, MyCaddyMaster lists sets from €9.30 to €21.80, ClubsToHire advertises from €50 a week across its locations, and Faro Golf Club Hire gives quotes on request. Elsewhere in the Algarve, shops that publish prices charge from €25 to €40 for one day and about €60 to €80 for a week. Compare that with around €80 return to fly a golf bag on Ryanair or about £84 on easyJet. Hiring for a week often costs about the same as flying with your own clubs, and sometimes less. Check the live price and any delivery charge when you book.',
  },
  {
    startsWith: 'For a trip of a week or less',
    text: 'For a trip of a week or less, hiring clubs at Faro Airport is often the simpler choice, and it can also be cheaper: there is no travel cover to carry, no sports-equipment fee each way and no risk of damage in the hold. ClubsToHire is the easiest to reach on arrival, and MyCaddyMaster has a wide range of sets, including junior options. If you don\'t need to collect at the airport, our [golf club hire comparison](/club-rental) includes companies that deliver to your accommodation.',
  },
]

const COMPARISON_TABLE = {
  type: 'table',
  caption: 'Golf club hire at Faro Airport compared',
  headers: ['Company', 'Where to collect', 'Published price', 'Delivery'],
  rows: [
    ['[ClubsToHire](/shops/clubstohire-faro-airport)', 'Shop in arrivals hall', 'From €50 a week (company-wide headline)', 'Yes; charges may apply'],
    ['[MyCaddyMaster](/shops/mycaddymaster-faro-airport)', 'Airport meeting point', 'Sets listed from €9.30', 'Yes'],
    ['[Faro Golf Club Hire](/shops/faro-golf-club-hire)', 'Faro Airport', 'Quote on request', 'Not stated; ask'],
  ],
  note: 'Checked on company websites in November 2026. Prices can change, so confirm when you book.',
}

const TABLE_AFTER = 'Three rental companies offer collection'

async function main() {
  const { data: post, error } = await supabase
    .from('guide_posts')
    .select('id, content')
    .eq('slug', SLUG)
    .single()
  if (error || !post) throw new Error(error?.message ?? 'Guide not found')

  const content = post.content as Block[]
  const updated = content.map(block => ({ ...block }))

  for (const { startsWith, text } of REPLACEMENTS) {
    const matches = updated.filter(block => block.type === 'paragraph' && block.text?.startsWith(startsWith))
    if (matches.length !== 1) throw new Error(`Expected 1 paragraph starting "${startsWith}", found ${matches.length}`)
    console.log(`\n--- WAS\n${matches[0].text}\n+++ NOW\n${text}`)
    matches[0].text = text
  }

  if (updated.some(block => block.type === 'table')) throw new Error('Guide already has a table')
  const tableIndex = updated.findIndex(block => block.text?.startsWith(TABLE_AFTER))
  if (tableIndex === -1) throw new Error('Table position not found')
  updated.splice(tableIndex + 1, 0, COMPARISON_TABLE)
  console.log(`\nTable added after block ${tableIndex}.`)

  if (dryRun) {
    console.log('\nDry run: nothing written.')
    return
  }

  mkdirSync('../research/backups', { recursive: true })
  writeFileSync(`../research/backups/${SLUG}-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(content, null, 2))

  const { error: updateError } = await supabase
    .from('guide_posts')
    .update({ content: updated, updated_at: new Date().toISOString() })
    .eq('id', post.id)
  if (updateError) throw new Error(updateError.message)
  console.log('\nDone.')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
