/**
 * Imports hotels from OpenStreetMap (Overpass API) into Supabase.
 * Only inserts hotels that don't already exist (matched by name).
 *
 * Usage:
 *   export $(cat .env.local | grep -v ^# | xargs) && npx tsx scripts/import-hotels-overpass.ts
 *   npx tsx scripts/import-hotels-overpass.ts --dry-run
 */

import { createClient } from '@supabase/supabase-js'
import { execSync } from 'child_process'
import { writeFileSync, unlinkSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars. Run:\n  export $(cat .env.local | grep -v ^# | xargs) && npx tsx scripts/import-hotels-overpass.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const dryRun     = process.argv.includes('--dry-run')
const fromCache  = process.argv.includes('--from-cache')
const CACHE_FILE = '/var/folders/31/kvp75jwj2lx0m9tb6svb95480000gn/T/overpass-hotels-cache.json'

// Algarve bounding box: south, west, north, east
const BBOX = '36.9,-8.9,37.5,-7.3'

interface OverpassElement {
  id: number
  lat: number
  lon: number
  tags: Record<string, string>
}

// Builds PostGIS EWKB hex for a Point with SRID 4326 (little-endian)
function makePointWKB(lng: number, lat: number): string {
  const buf = Buffer.alloc(25)
  buf.writeUInt8(1, 0)             // byte order: little-endian
  buf.writeUInt32LE(0x20000001, 1) // WKB type Point with SRID flag
  buf.writeUInt32LE(4326, 5)       // SRID
  buf.writeDoubleLE(lng, 9)        // X = longitude
  buf.writeDoubleLE(lat, 17)       // Y = latitude
  return buf.toString('hex')
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function inferRegion(lng: number): 'west' | 'central' | 'east' {
  if (lng < -8.3) return 'west'
  if (lng < -7.8) return 'central'
  return 'east'
}

const SERVERS = [
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
]

async function fetchFromOverpass(type: string): Promise<OverpassElement[]> {
  const query = `[out:json];node["tourism"="${type}"](${BBOX});out;`
  const tmpFile = join(tmpdir(), `overpass-query-${Date.now()}.txt`)
  writeFileSync(tmpFile, query)

  for (const server of SERVERS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const raw = execSync(
          `/usr/bin/curl -s --max-time 90 -X POST ${server} --data-urlencode "data@${tmpFile}"`,
          { maxBuffer: 10 * 1024 * 1024, timeout: 100000 }
        ).toString()
        if (raw.startsWith('{')) {
          unlinkSync(tmpFile)
          const data = JSON.parse(raw) as { elements: OverpassElement[] }
          return data.elements
        }
        console.log(`  Server ${server} busy (attempt ${attempt}), retrying in 5s...`)
        await new Promise(r => setTimeout(r, 5000))
      } catch {
        console.log(`  Server ${server} error (attempt ${attempt}), retrying...`)
        await new Promise(r => setTimeout(r, 5000))
      }
    }
    console.log(`  Switching to next server...`)
  }

  unlinkSync(tmpFile)
  throw new Error('All Overpass servers failed')
}

async function main() {
  let toInsert: OverpassElement[]

  if (fromCache) {
    console.log(`Loading from cache: ${CACHE_FILE}`)
    const { readFileSync } = await import('fs')
    toInsert = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'))
    console.log(`  Loaded: ${toInsert.length} hotels`)
  } else {
    const TYPES = ['villa', 'chalet', 'apartment', 'resort', 'hostel', 'motel']
    console.log('Fetching accommodation from Overpass API...')
    const hotels = await fetchFromOverpass('hotel')
    await new Promise(r => setTimeout(r, 3000))
    const guestHouses = await fetchFromOverpass('guest_house')
    await new Promise(r => setTimeout(r, 3000))
    const extras: OverpassElement[] = []
    for (const type of TYPES) {
      console.log(`  Fetching ${type}s...`)
      const results = await fetchFromOverpass(type)
      extras.push(...results)
      await new Promise(r => setTimeout(r, 3000))
    }

    console.log(`  Hotels: ${hotels.length}`)
    console.log(`  Guest houses: ${guestHouses.length}`)
    console.log(`  Other types: ${extras.length}`)

    const allElements = [...hotels, ...guestHouses, ...extras]
    const seen = new Set<number>()
    const unique = allElements.filter(e => {
      if (seen.has(e.id)) return false
      seen.add(e.id)
      return true
    })

    const withName = unique.filter(e => e.tags.name)
    console.log(`  With name: ${withName.length} / ${unique.length}`)

    const { data: existing } = await supabase.from('hotels').select('slug')
    const existingSlugs = new Set((existing ?? []).map(h => h.slug))
    console.log(`  Already in Supabase: ${existingSlugs.size}`)

    toInsert = withName.filter(e => !existingSlugs.has(slugify(e.tags.name) + '-' + e.id))
    console.log(`  New hotels to insert: ${toInsert.length}`)
  }

  if (dryRun) {
    // Save raw data for offline import
    const cacheFile = join(tmpdir(), 'overpass-hotels-cache.json')
    writeFileSync(cacheFile, JSON.stringify(toInsert, null, 2))
    console.log(`\n  Data cached to: ${cacheFile}`)
    console.log('\n-- DRY RUN -- First 20:')
    toInsert.slice(0, 20).forEach(e => {
      const t = e.tags
      console.log(`  ${t.name} | ${t.stars ?? '?'}★ | ${t['addr:city'] ?? ''} | ${inferRegion(e.lon)}`)
    })
    return
  }

  // Insert in batches of 50
  const BATCH = 50
  let inserted = 0
  let errors = 0

  for (let i = 0; i < toInsert.length; i += BATCH) {
    const batch = toInsert.slice(i, i + BATCH)
    const rows = batch.map(e => {
      const t = e.tags
      const stars = t.stars ? parseInt(t.stars) : null
      return {
        name:            t.name,
        slug:            slugify(t.name) + '-' + e.id,
        location:        makePointWKB(e.lon, e.lat),
        town:            t['addr:city'] ?? t['addr:town'] ?? t['addr:municipality'] ?? '',
        region:          inferRegion(e.lon),
        stars:           isNaN(stars!) ? null : stars,
        website:         t.website ?? t['contact:website'] ?? null,
        phone:           t.phone ?? t['contact:phone'] ?? null,
        onsite:          false,
        has_golf_package: false,
        has_shuttle:     false,
        shuttle_courses: [],
        club_storage:    false,
        club_cleaning:   false,
        drying_room:     false,
        early_breakfast: false,
        late_checkout:   false,
        offers_rental:   false,
        amenities:       [],
        active:          true,
        featured:        false,
        review_count:    0,
      }
    })

    const { error } = await supabase.from('hotels').insert(rows)
    if (error) {
      console.error(`  Batch ${i / BATCH + 1} error:`, error.message)
      errors += batch.length
    } else {
      inserted += batch.length
      console.log(`  Inserted batch ${i / BATCH + 1} (${inserted} total)`)
    }
  }

  console.log(`\nDone. Inserted: ${inserted} | Errors: ${errors}`)
}

main().catch(console.error)
