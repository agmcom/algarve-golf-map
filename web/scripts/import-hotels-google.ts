/**
 * Imports accommodation from Google Places API (New) into Supabase.
 * Covers hotels, resorts, vacation rentals and aparthotels across the Algarve.
 *
 * Usage:
 *   export $(cat .env.local | grep -v ^# | xargs) && npx tsx scripts/import-hotels-google.ts
 *   npx tsx scripts/import-hotels-google.ts --dry-run
 */

import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!
const PLACES_KEY   = process.env.GOOGLE_PLACES_API_KEY!

if (!SUPABASE_URL || !SERVICE_KEY || !PLACES_KEY) {
  console.error('Missing env vars. Run:\n  export $(cat .env.local | grep -v ^# | xargs) && npx tsx scripts/import-hotels-google.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const dryRun   = process.argv.includes('--dry-run')

// Grid of search points covering the Algarve coast + interior
const SEARCH_POINTS = [
  // Coast (west → east)
  { lat: 37.10, lng: -8.67, label: 'Lagos' },
  { lat: 37.05, lng: -8.78, label: 'Sagres/Vila do Bispo' },
  { lat: 37.13, lng: -8.54, label: 'Portimão/Alvor' },
  { lat: 37.09, lng: -8.47, label: 'Carvoeiro/Lagoa' },
  { lat: 37.10, lng: -8.36, label: 'Armação de Pêra' },
  { lat: 37.09, lng: -8.25, label: 'Albufeira' },
  { lat: 37.09, lng: -8.12, label: 'Vilamoura/Quarteira' },
  { lat: 37.02, lng: -8.02, label: 'Almancil/Quinta do Lago' },
  { lat: 37.02, lng: -7.93, label: 'Faro' },
  { lat: 37.04, lng: -7.84, label: 'Olhão' },
  { lat: 37.13, lng: -7.65, label: 'Tavira' },
  { lat: 37.19, lng: -7.42, label: 'Vila Real de Santo António' },
  // Interior
  { lat: 37.32, lng: -8.56, label: 'Monchique' },
  { lat: 37.19, lng: -8.44, label: 'Silves' },
  { lat: 37.14, lng: -8.02, label: 'Loulé' },
  { lat: 37.15, lng: -7.88, label: 'São Brás de Alportel' },
]

const ACCOMMODATION_TYPES: { type: string; label: string }[] = [
  { type: 'lodging',             label: 'hotel' },
  { type: 'resort_hotel',        label: 'resort' },
  { type: 'extended_stay_hotel', label: 'apartment' },
  { type: 'guest_house',         label: 'guest_house' },
  { type: 'cottage',             label: 'villa' },
  { type: 'bed_and_breakfast',   label: 'bb' },
]

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.location',
  'places.rating',
  'places.userRatingCount',
  'places.priceLevel',
  'places.websiteUri',
  'places.formattedAddress',
  'places.internationalPhoneNumber',
].join(',')

interface PlaceResult {
  id: string
  displayName: { text: string }
  location: { latitude: number; longitude: number }
  rating?: number
  userRatingCount?: number
  priceLevel?: string
  websiteUri?: string
  formattedAddress?: string
  internationalPhoneNumber?: string
}

function slugify(name: string, placeId: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) + '-' + placeId.slice(-6)
}

function inferRegion(lng: number): 'west' | 'central' | 'east' {
  if (lng < -8.3) return 'west'
  if (lng < -7.8) return 'central'
  return 'east'
}

function extractTown(address: string | undefined): string {
  if (!address) return ''
  // Format: "Street, PostalCode City, Portugal"
  const parts = address.split(',')
  if (parts.length >= 2) {
    const cityPart = parts[parts.length - 2].trim()
    // Remove postal code (e.g. "8125-901 Faro" → "Faro")
    return cityPart.replace(/^\d{4}-\d{3}\s*/, '').trim()
  }
  return ''
}

function makePointWKB(lng: number, lat: number): string {
  const buf = Buffer.alloc(25)
  buf.writeUInt8(1, 0)
  buf.writeUInt32LE(0x20000001, 1)
  buf.writeUInt32LE(4326, 5)
  buf.writeDoubleLE(lng, 9)
  buf.writeDoubleLE(lat, 17)
  return buf.toString('hex')
}

async function searchNearby(lat: number, lng: number, googleType: string): Promise<PlaceResult[]> {
  const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': PLACES_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({
      includedTypes: [googleType],
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 12000,
        },
      },
      maxResultCount: 20,
    }),
  })
  const data = await res.json() as { places?: PlaceResult[]; error?: { message: string } }
  if (data.error) throw new Error(`Places API error: ${data.error.message}`)
  return data.places ?? []
}

async function main() {
  console.log('Importing accommodation from Google Places API...\n')

  // Collect all results, deduplicate by place_id
  const seen = new Map<string, { place: PlaceResult; accommodationType: string }>()
  let totalCalls = 0

  for (const { type, label } of ACCOMMODATION_TYPES) {
    console.log(`Fetching ${label}s...`)
    let typeCount = 0

    for (const point of SEARCH_POINTS) {
      try {
        const results = await searchNearby(point.lat, point.lng, type)
        totalCalls++
        for (const place of results) {
          if (!seen.has(place.id)) {
            seen.set(place.id, { place, accommodationType: label })
            typeCount++
          }
        }
        await new Promise(r => setTimeout(r, 200))
      } catch (err) {
        console.error(`  Error at ${point.label}:`, err)
      }
    }
    console.log(`  Found ${typeCount} unique ${label}s`)
  }

  console.log(`\nTotal API calls: ${totalCalls} (~$${(totalCalls * 0.032).toFixed(2)})`)
  console.log(`Total unique places: ${seen.size}`)

  // Get existing place_ids to avoid duplicates
  const { data: existing } = await supabase.from('hotels').select('google_place_id')
  const existingPlaceIds = new Set((existing ?? []).map(h => h.google_place_id).filter(Boolean))
  console.log(`Already in Supabase: ${existingPlaceIds.size}`)

  const toInsert = [...seen.values()].filter(({ place }) => !existingPlaceIds.has(place.id))
  console.log(`New to insert: ${toInsert.length}`)

  if (dryRun) {
    const cachePath = join(tmpdir(), 'google-places-cache.json')
    writeFileSync(cachePath, JSON.stringify(toInsert, null, 2))
    console.log(`\nCache saved to: ${cachePath}`)
    console.log('\n-- DRY RUN -- First 20:')
    toInsert.slice(0, 20).forEach(({ place, accommodationType }) => {
      const town = extractTown(place.formattedAddress)
      console.log(`  [${accommodationType}] ${place.displayName.text} | ⭐${place.rating ?? '?'} (${place.userRatingCount ?? 0} reviews) | ${town}`)
    })
    return
  }

  // Insert in batches of 50
  const BATCH = 50
  let inserted = 0
  let errors = 0

  for (let i = 0; i < toInsert.length; i += BATCH) {
    const batch = toInsert.slice(i, i + BATCH)
    const rows = batch.map(({ place, accommodationType }) => ({
      name:                      place.displayName.text,
      slug:                      slugify(place.displayName.text, place.id),
      location:                  makePointWKB(place.location.longitude, place.location.latitude),
      town:                      extractTown(place.formattedAddress),
      region:                    inferRegion(place.location.longitude),
      google_place_id:           place.id,
      google_rating:             place.rating ?? null,
      google_user_ratings_total: place.userRatingCount ?? null,
      website:                   place.websiteUri ?? null,
      phone:                     place.internationalPhoneNumber ?? null,
      accommodation_type:        accommodationType,
      onsite:                    false,
      has_golf_package:          false,
      has_shuttle:               false,
      shuttle_courses:           [],
      club_storage:              false,
      club_cleaning:             false,
      drying_room:               false,
      early_breakfast:           false,
      late_checkout:             false,
      offers_rental:             false,
      amenities:                 [],
      active:                    true,
      featured:                  false,
      review_count:              0,
    }))

    const { error } = await supabase.from('hotels').insert(rows)
    if (error) {
      console.error(`  Batch ${Math.floor(i / BATCH) + 1} error:`, error.message)
      errors += batch.length
    } else {
      inserted += batch.length
      console.log(`  Inserted batch ${Math.floor(i / BATCH) + 1} (${inserted} total)`)
    }
  }

  console.log(`\nDone. Inserted: ${inserted} | Errors: ${errors}`)
}

main().catch(console.error)
