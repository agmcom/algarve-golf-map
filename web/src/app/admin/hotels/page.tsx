import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import HotelsAdminClient from './HotelsAdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminHotelsPage() {
  const { data: hotels, error } = await supabaseAdmin
    .from('hotels')
    .select('id,name,accommodation_type,town,region,google_rating,google_user_ratings_total,stars,active,featured,onsite')
    .order('accommodation_type')
    .order('name')

  if (error) {
    return (
      <div style={{ padding: 40, fontFamily: 'system-ui' }}>
        <p style={{ color: '#c00' }}>Error: {error.message}</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1a1a2e', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ color: '#aaa', fontSize: 13, textDecoration: 'none' }}>← Back to map</Link>
          <span style={{ color: '#555' }}>/</span>
          <Link href="/admin/courses" style={{ color: '#aaa', fontSize: 13, textDecoration: 'none' }}>Courses</Link>
          <span style={{ color: '#555' }}>/</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Hotels</span>
        </div>
        <span style={{ color: '#888', fontSize: 13 }}>{hotels?.length ?? 0} properties</span>
      </div>
      <HotelsAdminClient hotels={hotels ?? []} />
    </div>
  )
}
