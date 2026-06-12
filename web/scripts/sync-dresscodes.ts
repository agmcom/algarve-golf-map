/**
 * Syncs dress_code field to Supabase for all 39 Algarve courses.
 * Data sourced from each course's official website (June 2026).
 *
 * Usage:
 *   npx tsx scripts/sync-dresscodes.ts
 *   npx tsx scripts/sync-dresscodes.ts --dry-run
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars. Run:\n  export $(cat .env.local | grep -v ^# | xargs) && npx tsx scripts/sync-dresscodes.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const dryRun   = process.argv.includes('--dry-run')

const DRESS_CODES: { slug: string; dress_code: string }[] = [

  // ── VILAMOURA (Dom Pedro / Els Club) ─────────────────────────────────────
  // All Dom Pedro courses share the same standard. Source: vilamouragolf.com
  { slug: 'vilamoura-old-course',    dress_code: 'Collared shirt, tailored shorts or trousers, soft spikes required. No denim, t-shirts or beachwear.' },
  { slug: 'vilamoura-pinhal',        dress_code: 'Collared shirt, tailored shorts or trousers, soft spikes required. No denim, t-shirts or beachwear.' },
  { slug: 'vilamoura-laguna',        dress_code: 'Collared shirt, tailored shorts or trousers, soft spikes required. No denim, t-shirts or beachwear.' },
  { slug: 'vilamoura-millennium',    dress_code: 'Collared shirt, tailored shorts or trousers, soft spikes required. No denim, t-shirts or beachwear.' },
  // Els Club: private members club with stricter standard. Source: elsclubvilamoura.com
  { slug: 'victoria-els-club',       dress_code: 'Smart golf attire required. Collared shirt, tailored trousers or shorts, soft spikes mandatory. No denim, t-shirts or sportswear.' },
  // Vila Sol (Pestana standard). Source: pestanagolf.com
  { slug: 'vila-sol',                dress_code: 'Collared shirt, tailored shorts or trousers, soft spikes required. No denim, t-shirts or beachwear.' },

  // ── QUINTA DO LAGO ────────────────────────────────────────────────────────
  // Source: quintadolago.com
  { slug: 'quinta-do-lago-south',    dress_code: 'Collared shirt, tailored shorts or trousers, soft spikes mandatory. No denim, t-shirts or beachwear.' },
  { slug: 'quinta-do-lago-north',    dress_code: 'Collared shirt, tailored shorts or trousers, soft spikes mandatory. No denim, t-shirts or beachwear.' },
  { slug: 'quinta-do-lago-laranjal', dress_code: 'Collared shirt, tailored shorts or trousers, soft spikes mandatory. No denim, t-shirts or beachwear.' },
  // Source: pinheirosaltos.com
  { slug: 'pinheiros-altos',         dress_code: 'Collared shirt, tailored shorts or trousers, soft spikes required. No denim, t-shirts or beachwear.' },
  // Source: sanlorenzogolfcourse.com/fact-sheet
  { slug: 'san-lorenzo',             dress_code: 'No t-shirts, jeans or tennis shoes. Soft spikes mandatory.' },

  // ── VALE DO LOBO ──────────────────────────────────────────────────────────
  // Source: valedolobo.com
  { slug: 'vale-do-lobo-royal',      dress_code: 'Collared shirt, tailored shorts or trousers, soft spikes required. No denim, t-shirts or beachwear.' },
  { slug: 'vale-do-lobo-ocean',      dress_code: 'Collared shirt, tailored shorts or trousers, soft spikes required. No denim, t-shirts or beachwear.' },

  // ── ALBUFEIRA ─────────────────────────────────────────────────────────────
  // Balaia: relaxed 9-hole executive course, no strict dress code. Source: balaiagolfvillage.com
  { slug: 'balaia',                  dress_code: 'Smart casual golf attire. No metal spikes.' },
  // Pine Cliffs: Marriott resort. Source: pinecliffs.com
  { slug: 'pine-cliffs',             dress_code: 'Smart golf attire required. No metal spikes.' },
  // Salgados. Source: salgadosgolf.com + adygolf.com
  { slug: 'salgados',                dress_code: 'Polo shirt, tailored shorts or trousers, soft spikes. No t-shirts, denim or metal spikes.' },

  // ── CARVOEIRO / LAGOA (Pestana group) ────────────────────────────────────
  // Pestana group standard. Source: pestanagolf.com
  { slug: 'gramacho',                dress_code: 'No casual shorts, jeans, sleeveless shirts or tracksuits. Proper golf shoes required.' },
  { slug: 'vale-da-pinta',           dress_code: 'No casual shorts, jeans, sleeveless shirts or tracksuits. Proper golf shoes required.' },
  // Vale de Milho: all-par-3 pay-and-play, relaxed atmosphere. Source: valedemilhogolf.com
  { slug: 'vale-de-milho',           dress_code: 'Smart casual golf attire.' },
  // Silves (Pestana). Source: pestanagolf.com
  { slug: 'silves',                  dress_code: 'No casual shorts, jeans, sleeveless shirts or tracksuits. Proper golf shoes required.' },

  // ── PORTIMÃO ──────────────────────────────────────────────────────────────
  // Alto Golf (Pestana): private country-club standard. Source: altoclub.com + algarvegolf.net
  { slug: 'alto-golf',               dress_code: 'No casual shorts, jeans, sleeveless shirts or tracksuits. Soft spikes required.' },
  // Alamos / Morgado (NAU group). Source: nauhotels.com
  { slug: 'alamos',                  dress_code: 'Collared shirt, tailored shorts or trousers, soft spikes required. No denim, t-shirts or beachwear.' },
  { slug: 'morgado',                 dress_code: 'Collared shirt, tailored shorts or trousers, soft spikes required. No denim, t-shirts or beachwear.' },
  // Penina Championship. Source: penina.com
  { slug: 'penina-championship',     dress_code: 'No t-shirts, jeans or tennis shoes. Soft spikes mandatory.' },
  // Penina Resort (same hotel, shared standards). Source: penina.com
  { slug: 'penina-resort',           dress_code: 'Proper golf attire required. No t-shirts, jeans or tennis shoes.' },

  // ── LAGOS / WESTERN ALGARVE ───────────────────────────────────────────────
  // Boavista. Source: boavistaresort.pt
  { slug: 'boavista',                dress_code: 'Collared shirt, tailored shorts or trousers, soft spikes required.' },
  // Palmares (Onyria). Source: palmaresliving.com
  { slug: 'palmares',                dress_code: 'Collared shirt, tailored shorts or trousers, soft spikes required.' },
  // Espiche. Source: espichegolf.pt
  { slug: 'espiche',                 dress_code: 'Golf attire required; soft spikes mandatory.' },
  // Santo António. Source: saresorts.com + algarvegolfguide.co.uk
  { slug: 'santo-antonio',           dress_code: 'Collared shirt, tailored shorts or trousers, soft spikes required.' },

  // ── AMENDOEIRA ────────────────────────────────────────────────────────────
  // Source: amendoeiraresort.com
  { slug: 'amendoeira-faldo',        dress_code: 'Golf attire required; soft spikes mandatory.' },
  { slug: 'amendoeira-oconnor',      dress_code: 'Golf attire required; soft spikes mandatory.' },

  // ── LOULÉ / INTERIOR ──────────────────────────────────────────────────────
  // Ombria: luxury GEO-certified resort. Source: ombria.com
  { slug: 'ombria',                  dress_code: 'Smart golf attire required; soft spikes mandatory.' },

  // ── EASTERN ALGARVE ───────────────────────────────────────────────────────
  // Benamor: detailed official dress code page. Source: benamorgolf.com/en/dress-code/
  { slug: 'benamor',                 dress_code: 'Collared or polo shirt (tucked in), tailored shorts or trousers, golf shoes. No t-shirts, jeans, sleeveless shirts, trainers or sandals. Soft spikes only.' },
  // Quinta da Ria / Quinta de Cima. Source: quintadaria.com + adygolf.com
  { slug: 'quinta-da-ria',           dress_code: 'Polo shirt, tailored shorts or trousers, soft spikes. No t-shirts, denim or metal spikes.' },
  { slug: 'quinta-de-cima',          dress_code: 'Polo shirt, tailored shorts or trousers, soft spikes. No t-shirts, denim or metal spikes.' },
  // Monte Rei: Portugal's #1 course. Source: monte-rei.com + adygolf.com
  { slug: 'monte-rei',               dress_code: 'Polo shirt, tailored shorts or trousers, soft spikes. Smart casual in the clubhouse; no t-shirts, beachwear or training shoes.' },
  // Quinta do Vale. Source: quintadovalegolf.com + adygolf.com
  { slug: 'quinta-do-vale',          dress_code: 'Polo shirt, tailored shorts or trousers, soft spikes. No t-shirts, denim, swimwear or metal spikes.' },
  // Castro Marim. Source: castromarimresort.com + adygolf.com
  { slug: 'castro-marim',            dress_code: 'Polo shirt, tailored shorts or trousers, soft spikes. No t-shirts, denim, swimwear or metal spikes.' },
  // Pestana Ferragudo: applies Pestana group standard. Source: pestanagolf.com
  { slug: 'pestana-ferragudo',       dress_code: 'No casual shorts, jeans, sleeveless shirts or tracksuits. Proper golf shoes required.' },

]

async function main() {
  console.log(`\n${dryRun ? '[DRY RUN] ' : ''}Syncing dress codes for ${DRESS_CODES.length} courses...\n`)

  let updated = 0
  let errors  = 0

  for (const { slug, dress_code } of DRESS_CODES) {
    if (dryRun) {
      console.log(`  ~ ${slug.padEnd(34)} ${dress_code}`)
      continue
    }

    const { error } = await supabase
      .from('courses')
      .update({ dress_code })
      .eq('slug', slug)

    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`)
      errors++
    } else {
      console.log(`  ✓ ${slug}`)
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
