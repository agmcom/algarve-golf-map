// Refresh live pages after changing their data in Supabase, instead of redeploying.
//
//   node scripts/revalidate.mjs /guide/some-post /guide /sitemap.xml
//   node scripts/revalidate.mjs --all          (every page; use sparingly)
//
// Reads REVALIDATE_SECRET from web/.env.local. SITE_URL can override the target.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const envFile = path.join(here, '..', '.env.local')
const env = Object.fromEntries(
  readFileSync(envFile, 'utf8')
    .split('\n')
    .map(l => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/))
    .filter(Boolean)
    .map(m => [m[1], m[2].replace(/^['"]|['"]$/g, '')]),
)

const secret = process.env.REVALIDATE_SECRET ?? env.REVALIDATE_SECRET
if (!secret) {
  console.error('REVALIDATE_SECRET is missing from web/.env.local')
  process.exit(1)
}

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: node scripts/revalidate.mjs /path [/path ...]   or   --all')
  process.exit(1)
}

const body = args.includes('--all') ? { all: true } : { paths: args }
const site = process.env.SITE_URL ?? 'https://www.algarvegolfmap.com'

const res = await fetch(`${site}/api/revalidate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
  body: JSON.stringify(body),
})
const out = await res.json().catch(() => ({}))
console.log(res.status, JSON.stringify(out))
if (!res.ok) process.exit(1)
