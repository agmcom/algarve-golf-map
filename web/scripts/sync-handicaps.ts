/**
 * Syncs handicap_required_men and handicap_required_ladies to Supabase.
 * Data sourced from official course websites and adygolf.com (June 2026).
 *
 * null = no handicap certificate required (par-3 / pay-and-play courses)
 *        or limit not publicly specified (private members clubs).
 *
 * Usage:
 *   npx tsx scripts/sync-handicaps.ts
 *   npx tsx scripts/sync-handicaps.ts --dry-run
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars. Run:\n  export $(cat .env.local | grep -v ^# | xargs) && npx tsx scripts/sync-handicaps.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const dryRun   = process.argv.includes('--dry-run')

type HC = { slug: string; men: number | null; ladies: number | null }

const HANDICAPS: HC[] = [

  // ── VILAMOURA ─────────────────────────────────────────────────────────────
  // Source: vilamouragolf.com/en/rules-and-regulations/ (verified)
  { slug: 'vilamoura-old-course',    men: 28, ladies: 36 },
  { slug: 'vilamoura-pinhal',        men: 28, ladies: 36 },
  { slug: 'vilamoura-laguna',        men: 28, ladies: 36 },
  { slug: 'vilamoura-millennium',    men: 28, ladies: 36 },
  // Els Club: private members club, visitor access extremely limited — no public limit.
  { slug: 'victoria-els-club',       men: null, ladies: null },
  // Vila Sol (Pestana). Source: pestanagolf.com
  { slug: 'vila-sol',                men: 27, ladies: 35 },

  // ── QUINTA DO LAGO ────────────────────────────────────────────────────────
  // Source: adygolf.com/quinta-do-lago-south.php (verified direct fetch)
  { slug: 'quinta-do-lago-south',    men: 24, ladies: 28 },
  // Source: quintadolago.com general policy / resort FAQ
  { slug: 'quinta-do-lago-north',    men: 28, ladies: 36 },
  // Laranjal same restriction as South. Source: adygolf.com/laranjal.php
  { slug: 'quinta-do-lago-laranjal', men: 24, ladies: 28 },
  // Source: pinheirosaltos.com + where2golf.com
  { slug: 'pinheiros-altos',         men: 28, ladies: 36 },
  // Source: sanlorenzogolfcourse.com / leadingcourses.com
  { slug: 'san-lorenzo',             men: 28, ladies: 36 },

  // ── VALE DO LOBO ──────────────────────────────────────────────────────────
  // Source: adygolf.com/vale-do-lobo-royal.php (verified direct fetch): men 24, ladies 28
  { slug: 'vale-do-lobo-royal',      men: 24, ladies: 28 },
  { slug: 'vale-do-lobo-ocean',      men: 24, ladies: 28 },

  // ── ALBUFEIRA ─────────────────────────────────────────────────────────────
  // Balaia: 9-hole all-par-3, no handicap restriction. Source: balaiagolfvillage.com
  { slug: 'balaia',                  men: null, ladies: null },
  // Pine Cliffs: 9-hole resort course, accessible to all. Source: 1golf.eu
  { slug: 'pine-cliffs',             men: 36,   ladies: 36 },
  // Source: adygolf.com/salgados.php
  { slug: 'salgados',                men: 28, ladies: 36 },

  // ── CARVOEIRO / LAGOA (Pestana group) ────────────────────────────────────
  // Source: pestanagolf.com / where2golf.com — Gramacho men 27, ladies 35
  { slug: 'gramacho',                men: 27, ladies: 35 },
  { slug: 'vale-da-pinta',           men: 27, ladies: 35 },
  // Vale de Milho: all-par-3, no handicap restriction. Source: valedemilhogolf.com
  { slug: 'vale-de-milho',           men: null, ladies: null },
  // Silves (Pestana). Source: pestanagolf.com + update_courses_scraped.sql
  { slug: 'silves',                  men: 24, ladies: 28 },

  // ── PORTIMÃO ──────────────────────────────────────────────────────────────
  // Alto Golf (Pestana). Source: algarvegolf.net/altogolf + portugalgolf.net
  { slug: 'alto-golf',               men: 28, ladies: 36 },
  // Alamos (NAU): weekday men 36, weekend men 28 — using the stricter (28). Source: nauhotels.com
  { slug: 'alamos',                  men: 28, ladies: 36 },
  // Morgado (NAU). Source: update_courses_scraped.sql + morgado description
  { slug: 'morgado',                 men: 24, ladies: 28 },
  // Penina Championship. Source: penina.com/golf/golf-courses/rules-specifications
  { slug: 'penina-championship',     men: 28, ladies: 36 },
  // Penina Resort: no handicap restriction confirmed. Source: penina.com
  { slug: 'penina-resort',           men: null, ladies: null },

  // ── LAGOS / WESTERN ALGARVE ───────────────────────────────────────────────
  // Boavista. Source: adygolf.com/boavista.php + 1golf.eu
  { slug: 'boavista',                men: 27, ladies: 34 },
  // Palmares (Onyria). Source: 1golf.eu/en/club/palmares-golf-resort
  { slug: 'palmares',                men: 28, ladies: 36 },
  // Espiche. Source: 1golf.eu/en/club/espiche-golf
  { slug: 'espiche',                 men: 28, ladies: 36 },
  // Santo António. Source: portugalgolf.net/en/golf-courses/santo-antonio
  { slug: 'santo-antonio',           men: 28, ladies: 36 },

  // ── AMENDOEIRA ────────────────────────────────────────────────────────────
  // Source: where2golf.com + amendoeiraresort.com
  { slug: 'amendoeira-faldo',        men: 28, ladies: 36 },
  { slug: 'amendoeira-oconnor',      men: 28, ladies: 36 },

  // ── LOULÉ / INTERIOR ──────────────────────────────────────────────────────
  // Ombria: strict sustainable resort. Source: adygolf.com/ombria.php + portugolf.com
  { slug: 'ombria',                  men: 24, ladies: 30 },

  // ── EASTERN ALGARVE ───────────────────────────────────────────────────────
  // Benamor. Source: benamorgolf.com (rules & etiquette page)
  { slug: 'benamor',                 men: 28, ladies: 36 },
  // Quinta da Ria. Source: adygolf.com/quinta-da-ria.php (men 24, ladies 28)
  { slug: 'quinta-da-ria',           men: 24, ladies: 28 },
  // Quinta de Cima: "Maximum handicap 36 for all players" per official description.
  { slug: 'quinta-de-cima',          men: 36, ladies: 36 },
  // Monte Rei: Portugal's #1 course. Source: adygolf.com/monte-rei.php + golfsunholidays.com
  { slug: 'monte-rei',               men: 24, ladies: 32 },
  // Quinta do Vale. Source: update_courses_scraped.sql + adygolf.com/quinta-do-vale.php
  { slug: 'quinta-do-vale',          men: 24, ladies: 28 },
  // Castro Marim. Source: adygolf.com/castro-marim.php (confirmed men 24, ladies 28)
  { slug: 'castro-marim',            men: 24, ladies: 28 },
  // Pestana Ferragudo: new course, applies Pestana group standard.
  { slug: 'pestana-ferragudo',       men: 28, ladies: 36 },

]

async function main() {
  console.log(`\n${dryRun ? '[DRY RUN] ' : ''}Syncing handicaps for ${HANDICAPS.length} courses...\n`)

  let updated = 0
  let errors  = 0

  for (const { slug, men, ladies } of HANDICAPS) {
    if (dryRun) {
      const m = men    != null ? `men ${men}`       : 'men —  '
      const l = ladies != null ? `ladies ${ladies}` : 'ladies —'
      console.log(`  ~ ${slug.padEnd(34)} ${m.padEnd(8)}  ${l}`)
      continue
    }

    const { error } = await supabase
      .from('courses')
      .update({ handicap_required_men: men, handicap_required_ladies: ladies })
      .eq('slug', slug)

    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`)
      errors++
    } else {
      const m = men    != null ? `men ${men}`       : 'men —  '
      const l = ladies != null ? `ladies ${ladies}` : 'ladies —'
      console.log(`  ✓ ${slug.padEnd(34)} ${m.padEnd(8)}  ${l}`)
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
