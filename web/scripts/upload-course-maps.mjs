/**
 * upload-course-maps.mjs
 *
 * Downloads course map images from their source URLs, uploads them to
 * Supabase Storage (bucket: course-maps), and updates course_map_url
 * in the courses table.
 *
 * For PDF sources, Puppeteer is used to screenshot the first page.
 *
 * Usage:
 *   node scripts/upload-course-maps.mjs
 *
 * Requires:
 *   NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local
const envPath = resolve(__dirname, '../.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => l.split('=').map(s => s.trim()))
)

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL']
const SERVICE_KEY  = env['SUPABASE_SERVICE_ROLE_KEY']

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// ── Course map sources ────────────────────────────────────────────────────────
// type: 'image' → fetch directly
// type: 'pdf'   → screenshot with Puppeteer (requires: npm i puppeteer)

const SOURCES = [
  { slug: 'vilamoura-old-course',    type: 'image', url: 'https://www.teetimes.pt/slideshow/pictures/course/39/portugal-golf-vilamoura-old-course-cmap.webp' },
  { slug: 'vilamoura-pinhal',        type: 'image', url: 'https://www.teetimes.pt/slideshow/pictures/course/40/portugal-golf-vilamoura-pinhal-cmap.webp' },
  { slug: 'vilamoura-laguna',        type: 'image', url: 'https://www.teetimes.pt/slideshow/pictures/course/41/portugal-golf-vilamoura-laguna-cmap.webp' },
  { slug: 'vilamoura-millennium',    type: 'image', url: 'https://www.teetimes.pt/slideshow/pictures/course/42/portugal-golf-vilamoura-millennium-cmap.webp' },
  { slug: 'vila-sol',                type: 'image', url: 'https://www.teetimes.pt/slideshow/pictures/course/38/portugal-golf-vila-sol-cmap.webp' },
  { slug: 'quinta-do-lago-south',    type: 'image', url: 'https://www.teetimes.pt/slideshow/pictures/course/37/portugal-golf-quinta-lago-south-cmap.webp' },
  { slug: 'quinta-do-lago-north',    type: 'image', url: 'https://www.teetimes.pt/slideshow/pictures/course/36/portugal-golf-quinta-lago-north-cmap.webp' },
  { slug: 'quinta-do-lago-laranjal', type: 'image', url: 'https://www.teetimes.pt/slideshow/pictures/course/98/portugal-golf-laranjal-cmap.webp' },
  { slug: 'pinheiros-altos',         type: 'image', url: 'https://www.teetimes.pt/slideshow/pictures/course/48/portugal-golf-pinheiros-altos-cmap.webp' },
  { slug: 'san-lorenzo',             type: 'image', url: 'https://www.teetimes.pt/slideshow/pictures/course/47/portugal-golf-san-lorenzo-cmap.webp' },
  { slug: 'vale-do-lobo-royal',      type: 'image', url: 'https://www.valedolobo.com/wp-content/uploads/2024/05/Map_royal_course-scaled.webp' },
  { slug: 'vale-do-lobo-ocean',      type: 'image', url: 'https://www.valedolobo.com/wp-content/uploads/2024/05/ff8f8924531fa250ff7555113bc8a3b2.png' },
  { slug: 'balaia',                  type: 'image', url: 'https://www.algarvepackage.com/slideshow/pictures/course/50/portugal-golf-balaia-cmap.webp' },
  { slug: 'pine-cliffs',             type: 'image', url: 'https://www.algarvepackage.com/slideshow/pictures/course/49/portugal-golf-pine-cliffs-golf-cmap.webp' },
  { slug: 'salgados',                type: 'image', url: 'https://www.algarvepackage.com/slideshow/pictures/course/32/portugal-golf-salgados-cmap.webp' },
  { slug: 'gramacho',                type: 'image', url: 'https://www.algarvepackage.com/slideshow/pictures/course/30/portugal-golf-gramacho-cmap.webp' },
  { slug: 'vale-da-pinta',           type: 'image', url: 'https://www.algarvepackage.com/slideshow/pictures/course/29/portugal-golf-vale-pinta-cmap.webp' },
  { slug: 'silves',                  type: 'image', url: 'https://www.algarvepackage.com/slideshow/pictures/course/31/portugal-golf-silves-cmap.webp' },
  { slug: 'alto-golf',               type: 'image', url: 'https://www.algarvepackage.com/slideshow/pictures/course/28/portugal-golf-alto-cmap.webp' },
  { slug: 'alamos',                  type: 'image', url: 'https://www.algarvepackage.com/slideshow/pictures/course/26/portugal-golf-alamos-cmap.webp' },
  { slug: 'morgado',                 type: 'image', url: 'https://www.algarvepackage.com/slideshow/pictures/course/25/portugal-golf-morgado-cmap.webp' },
  { slug: 'ombria',                  type: 'image', url: 'https://www.ombria.com/static/images/ombria_maps/golf-desktop-2.svg' },
  { slug: 'benamor',                 type: 'image', url: 'http://www.benamorgolf.com/upload/photologue/photos/Course%20Map.png' },
  { slug: 'monte-rei',               type: 'image', url: 'https://www.monte-rei.com/media/1592/coursemap.jpg' },
  { slug: 'quinta-da-ria',           type: 'pdf',   url: 'https://www.quintadaria.com/wp-content/uploads/2024/12/QdR_course_guide-compressed.pdf' },
  { slug: 'quinta-de-cima',          type: 'pdf',   url: 'https://www.quintadaria.com/wp-content/uploads/2024/12/QdC_course_guide-compressed.pdf' },
]

const BUCKET = 'course-maps'

// ── Helpers ───────────────────────────────────────────────────────────────────

function mimeAndExt(url) {
  if (url.endsWith('.webp')) return { mime: 'image/webp', ext: 'webp' }
  if (url.endsWith('.png'))  return { mime: 'image/png',  ext: 'png' }
  if (url.endsWith('.svg'))  return { mime: 'image/svg+xml', ext: 'svg' }
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return { mime: 'image/jpeg', ext: 'jpg' }
  return { mime: 'image/webp', ext: 'webp' }
}

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AlgarveGolfMap/1.0)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return Buffer.from(await res.arrayBuffer())
}

async function screenshotPdf(url) {
  let puppeteer
  try {
    puppeteer = await import('puppeteer')
  } catch {
    throw new Error('puppeteer not installed — run: npm install puppeteer')
  }
  const browser = await puppeteer.default.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 900 })
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
  const buffer = await page.screenshot({ type: 'jpeg', quality: 90, fullPage: false })
  await browser.close()
  return Buffer.from(buffer)
}

async function uploadToStorage(slug, buffer, mime, ext) {
  const path = `${slug}.${ext}`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: mime, upsert: true })
  if (error) throw new Error(`Storage upload failed for ${slug}: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

async function updateCourseMapUrl(slug, publicUrl) {
  const { error } = await supabase
    .from('courses')
    .update({ course_map_url: publicUrl })
    .eq('slug', slug)
  if (error) throw new Error(`DB update failed for ${slug}: ${error.message}`)
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nUploading course maps to Supabase Storage (bucket: ${BUCKET})\n`)

  const results = { ok: [], failed: [] }

  for (const source of SOURCES) {
    process.stdout.write(`  ${source.slug.padEnd(28)} `)
    try {
      let buffer, mime, ext

      if (source.type === 'pdf') {
        buffer = await screenshotPdf(source.url)
        mime = 'image/jpeg'
        ext  = 'jpg'
      } else {
        buffer = await downloadImage(source.url)
        ;({ mime, ext } = mimeAndExt(source.url))
      }

      const publicUrl = await uploadToStorage(source.slug, buffer, mime, ext)
      await updateCourseMapUrl(source.slug, publicUrl)

      console.log(`✓  ${publicUrl}`)
      results.ok.push(source.slug)
    } catch (err) {
      console.log(`✗  ${err.message}`)
      results.failed.push({ slug: source.slug, error: err.message })
    }
  }

  console.log(`\n── Summary ──────────────────────────────`)
  console.log(`  ✓ ${results.ok.length} uploaded`)
  console.log(`  ✗ ${results.failed.length} failed`)
  if (results.failed.length > 0) {
    results.failed.forEach(f => console.log(`    - ${f.slug}: ${f.error}`))
  }
  console.log()
}

main().catch(err => { console.error(err); process.exit(1) })
