import { timingSafeEqual } from 'node:crypto'
import { revalidatePath } from 'next/cache'

// Refreshes cached pages after their data changed in Supabase (e.g. a guide post edited by a
// script), so the change goes live without a new deployment. Every deployment starts the ISR
// cache from scratch, which is what drove ISR Writes towards the Hobby limit in November 2026.
//
// Usage (from web/): node scripts/revalidate.mjs /guide/some-post /guide /sitemap.xml
//                    node scripts/revalidate.mjs --all
//
// Body: { "paths": ["/guide/some-post", ...] } or { "all": true }. Pages regenerate on their
// next visit, and Vercel only bills a write when the regenerated page actually differs.

const MAX_PATHS = 100

function authorised(request: Request): boolean {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) return false
  const given = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  const a = Buffer.from(given)
  const b = Buffer.from(secret)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request: Request) {
  if (!authorised(request)) return Response.json({ ok: false, error: 'Unauthorised' }, { status: 401 })

  let body: { paths?: unknown; all?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'Body must be JSON' }, { status: 400 })
  }

  if (body.all === true) {
    revalidatePath('/', 'layout')
    return Response.json({ ok: true, revalidated: ['(all pages)'] })
  }

  const paths = Array.isArray(body.paths) ? body.paths : []
  const valid = paths.filter(
    (p): p is string => typeof p === 'string' && p.startsWith('/') && !p.startsWith('//') && p.length <= 1024,
  )
  if (valid.length === 0 || valid.length !== paths.length || valid.length > MAX_PATHS) {
    return Response.json(
      { ok: false, error: `Send 1–${MAX_PATHS} paths, each starting with "/"` },
      { status: 400 },
    )
  }

  for (const p of valid) revalidatePath(p)
  return Response.json({ ok: true, revalidated: valid })
}
