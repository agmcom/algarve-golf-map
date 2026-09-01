import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'

async function getStats() {
  const [pvRes, feRes] = await Promise.all([
    supabaseAdmin.from('page_views').select('page, slug, created_at').order('created_at', { ascending: false }).limit(5000),
    supabaseAdmin.from('filter_events').select('filter_key, filter_value, created_at').order('created_at', { ascending: false }).limit(5000),
  ])

  const pageViews: { page: string; slug: string | null; created_at: string }[] = pvRes.data ?? []
  const filterEvents: { filter_key: string; filter_value: string | null; created_at: string }[] = feRes.data ?? []

  // Group page views
  const pvGroups: Record<string, number> = {}
  for (const row of pageViews) {
    const key = row.slug ? `${row.page}/${row.slug}` : row.page
    pvGroups[key] = (pvGroups[key] ?? 0) + 1
  }
  const pvSorted = Object.entries(pvGroups).sort((a, b) => b[1] - a[1])

  // Group filter events
  const feGroups: Record<string, number> = {}
  for (const row of filterEvents) {
    const key = row.filter_value ? `${row.filter_key}: ${row.filter_value}` : row.filter_key
    feGroups[key] = (feGroups[key] ?? 0) + 1
  }
  const feSorted = Object.entries(feGroups).sort((a, b) => b[1] - a[1])

  // Totals and today
  const today = new Date().toISOString().slice(0, 10)
  const pvToday = pageViews.filter(r => r.created_at.slice(0, 10) === today).length
  const pvTotal = pageViews.length

  return { pvSorted, feSorted, pvToday, pvTotal, filterTotal: filterEvents.length }
}

export default async function AdminStatsPage() {
  const { pvSorted, feSorted, pvToday, pvTotal, filterTotal } = await getStats()

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, sans-serif', padding: '40px 48px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111', margin: 0 }}>Statistics</h1>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/admin/courses" style={{ fontSize: 13, color: '#2B6090', textDecoration: 'none', fontWeight: 500 }}>Courses</Link>
            <Link href="/admin/hotels" style={{ fontSize: 13, color: '#2B6090', textDecoration: 'none', fontWeight: 500 }}>Hotels</Link>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          <StatCard label="Page views today" value={pvToday} />
          <StatCard label="Page views total" value={pvTotal} />
          <StatCard label="Filter uses total" value={filterTotal} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Page views */}
          <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '.06em' }}>
              Page views
            </h2>
            {pvSorted.length === 0 ? (
              <p style={{ color: '#999', fontSize: 13 }}>No data yet</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {pvSorted.map(([page, count]) => (
                    <tr key={page} style={{ borderBottom: '1px solid #f3f3f3' }}>
                      <td style={{ padding: '8px 0', fontSize: 13, color: '#333' }}>{page}</td>
                      <td style={{ padding: '8px 0', fontSize: 13, color: '#111', fontWeight: 600, textAlign: 'right' }}>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Filter events */}
          <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '.06em' }}>
              Most used filters
            </h2>
            {feSorted.length === 0 ? (
              <p style={{ color: '#999', fontSize: 13 }}>No data yet</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {feSorted.map(([filter, count]) => (
                    <tr key={filter} style={{ borderBottom: '1px solid #f3f3f3' }}>
                      <td style={{ padding: '8px 0', fontSize: 13, color: '#333' }}>{filter}</td>
                      <td style={{ padding: '8px 0', fontSize: 13, color: '#111', fontWeight: 600, textAlign: 'right' }}>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, padding: '20px 24px' }}>
      <div style={{ fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#111' }}>{value.toLocaleString()}</div>
    </div>
  )
}
