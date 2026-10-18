import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import HotelEditForm from './HotelEditForm'

export const dynamic = 'force-dynamic'

export default async function HotelEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: hotel, error } = await supabaseAdmin
    .from('hotels')
    .select('id,name,accommodation_type,town,region,website,phone,google_rating,google_user_ratings_total,stars,active,featured,onsite,has_golf_package,has_shuttle,club_storage,club_cleaning,drying_room,early_breakfast,late_checkout,offers_rental,google_place_id')
    .eq('id', id)
    .single()

  if (error || !hotel) notFound()

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1a1a2e', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/admin/hotels" style={{ color: '#aaa', fontSize: 13, textDecoration: 'none' }}>← Hotels</Link>
        <span style={{ color: '#555' }}>/</span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{hotel.name}</span>
      </div>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>
        <HotelEditForm hotel={hotel} />
      </div>
    </div>
  )
}
