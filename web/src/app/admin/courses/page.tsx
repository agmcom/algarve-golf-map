import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'

function MissingKeyError({ message }: { message: string }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 520, background: '#fff', border: '1px solid #fcc', borderRadius: 16, padding: 40 }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>🔑</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#c00', margin: '0 0 12px' }}>Service role key required</h1>
        <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, margin: '0 0 20px' }}>
          The admin panel needs the Supabase <strong>service role key</strong> to bypass Row Level Security.
        </p>
        <ol style={{ fontSize: 14, color: '#333', lineHeight: 2, paddingLeft: 20, margin: '0 0 20px' }}>
          <li>Open your Supabase project dashboard</li>
          <li>Go to <strong>Project Settings → API</strong></li>
          <li>Copy the <strong>service_role</strong> key (not the anon key)</li>
          <li>Paste it in <code style={{ background: '#f4f4f4', padding: '2px 6px', borderRadius: 4 }}>.env.local</code>:<br />
            <code style={{ display: 'block', background: '#f4f4f4', padding: '8px 12px', borderRadius: 6, marginTop: 6, fontSize: 12 }}>
              SUPABASE_SERVICE_ROLE_KEY=eyJ…
            </code>
          </li>
          <li>Restart the dev server</li>
        </ol>
        <details style={{ fontSize: 12, color: '#aaa' }}>
          <summary style={{ cursor: 'pointer' }}>Technical error</summary>
          <pre style={{ marginTop: 8, padding: 10, background: '#f9f9f9', borderRadius: 6, overflow: 'auto', whiteSpace: 'pre-wrap' }}>{message}</pre>
        </details>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

function formatUpdatedAt(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 2)   return 'just now'
  if (diffMins < 60)  return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7)   return `${diffDays}d ago`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: diffDays > 365 ? 'numeric' : undefined })
}

export default async function AdminCoursesPage() {
  let courses, error
  try {
    const result = await supabaseAdmin
      .from('courses')
      .select('id, slug, name, town, region, active, featured, rating, holes, updated_at')
      .order('region')
      .order('name')
    courses = result.data
    error = result.error
  } catch (e: unknown) {
    return <MissingKeyError message={e instanceof Error ? e.message : String(e)} />
  }

  if (error) {
    return <MissingKeyError message={error.message} />
  }

  const byRegion: Record<string, typeof courses> = {}
  for (const c of courses ?? []) {
    if (!byRegion[c.region]) byRegion[c.region] = []
    byRegion[c.region].push(c)
  }

  const regionLabel: Record<string, string> = {
    west: 'West Algarve',
    central: 'Central Algarve',
    east: 'East Algarve',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1a1a2e', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ color: '#aaa', fontSize: 13, textDecoration: 'none' }}>← Back to map</Link>
          <span style={{ color: '#555' }}>/</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Admin — Golf Courses</span>
        </div>
        <span style={{ color: '#888', fontSize: 13 }}>{courses?.length ?? 0} courses</span>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        {['west', 'central', 'east'].map(region => {
          const list = byRegion[region] ?? []
          if (!list.length) return null
          return (
            <div key={region} style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: '#888', letterSpacing: '.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                {regionLabel[region]} — {list.length} courses
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {list.map(course => (
                  <Link
                    key={course.id}
                    href={`/admin/courses/${course.slug}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 18px', borderRadius: 10,
                      background: '#fff', border: '1px solid #e8e8e8',
                      textDecoration: 'none', color: 'inherit',
                      transition: 'border-color .15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: course.active ? '#22a06b' : '#ccc',
                        flexShrink: 0,
                      }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>
                          {course.name}
                          {course.featured && <span style={{ marginLeft: 8, fontSize: 10, background: '#fff3e0', color: '#e07b1a', padding: '2px 7px', borderRadius: 8, fontWeight: 700 }}>FEATURED</span>}
                        </div>
                        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{course.town} · {course.holes}h</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      {course.rating != null && (
                        <span style={{ fontSize: 13, color: '#555' }}>★ {course.rating.toFixed(1)}</span>
                      )}
                      <span style={{ fontSize: 11, color: '#bbb', textAlign: 'right' }}>
                        Updated<br />{formatUpdatedAt(course.updated_at)}
                      </span>
                      <span style={{ fontSize: 12, color: '#aaa' }}>Edit →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
