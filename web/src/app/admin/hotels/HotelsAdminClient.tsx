'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deleteHotel } from './[id]/actions'

interface Hotel {
  id: string
  name: string
  accommodation_type: string
  town: string
  region: string
  google_rating: number | null
  google_user_ratings_total: number | null
  stars: number | null
  active: boolean
  featured: boolean
  onsite: boolean
}

const TYPE_LABELS: Record<string, string> = {
  hotel: 'Hotel', resort: 'Resort', apartment: 'Apartment',
  guest_house: 'Guest House', villa: 'Villa', bb: 'B&B',
}

const TYPE_COLORS: Record<string, string> = {
  hotel: '#dbeafe', resort: '#fce7f3', apartment: '#dcfce7',
  guest_house: '#fef9c3', villa: '#ede9fe', bb: '#ffedd5',
}

const ALL_TYPES = ['hotel', 'resort', 'apartment', 'guest_house', 'villa', 'bb']

export default function HotelsAdminClient({ hotels }: { hotels: Hotel[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(hotel: Hotel) {
    if (!confirm(`Delete "${hotel.name}"? This cannot be undone.`)) return
    setDeletingId(hotel.id)
    const res = await deleteHotel(hotel.id)
    if (res.ok) router.refresh()
    else { alert('Error: ' + (res as { ok: false; error: string }).error); setDeletingId(null) }
  }

  const filtered = useMemo(() => {
    return hotels.filter(h => {
      if (typeFilter !== 'all' && h.accommodation_type !== typeFilter) return false
      if (regionFilter !== 'all' && h.region !== regionFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!h.name.toLowerCase().includes(q) && !h.town.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [hotels, search, typeFilter, regionFilter])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: hotels.length }
    for (const h of hotels) c[h.accommodation_type] = (c[h.accommodation_type] ?? 0) + 1
    return c
  }, [hotels])

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 24px' }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or town…"
          style={{
            padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd',
            fontSize: 14, width: 240, boxSizing: 'border-box',
          }}
        />
        <select
          value={regionFilter}
          onChange={e => setRegionFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}
        >
          <option value="all">All regions</option>
          <option value="west">West Algarve</option>
          <option value="central">Central Algarve</option>
          <option value="east">East Algarve</option>
        </select>
      </div>

      {/* Type tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {['all', ...ALL_TYPES].map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            style={{
              padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: typeFilter === t ? 700 : 400,
              background: typeFilter === t ? '#1a1a2e' : '#fff',
              color: typeFilter === t ? '#fff' : '#555',
              boxShadow: '0 1px 3px rgba(0,0,0,.08)',
            }}
          >
            {t === 'all' ? 'All' : TYPE_LABELS[t]} ({counts[t] ?? 0})
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 100px 120px 80px 60px 60px 60px 130px',
          gap: 0,
          borderBottom: '1px solid #f0f0f0',
          padding: '10px 18px',
          background: '#fafafa',
        }}>
          {['Name', 'Type', 'Town', 'Rating', 'Active', 'Feat.', 'Onsite', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: '#aaa', fontSize: 14 }}>
            No results
          </div>
        )}

        {filtered.map((hotel, i) => (
          <div
            key={hotel.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 100px 120px 80px 60px 60px 60px 130px',
              alignItems: 'center',
              gap: 0,
              padding: '11px 18px',
              borderBottom: i < filtered.length - 1 ? '1px solid #f5f5f5' : 'none',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {!hotel.active && <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#ccc', marginRight: 8, verticalAlign: 'middle' }} />}
                {hotel.featured && <span style={{ fontSize: 9, background: '#fff3e0', color: '#e07b1a', padding: '2px 5px', borderRadius: 6, fontWeight: 700, marginRight: 6 }}>FEAT</span>}
                {hotel.name}
              </div>
            </div>
            <div>
              <span style={{
                fontSize: 11, padding: '3px 8px', borderRadius: 8, fontWeight: 600,
                background: TYPE_COLORS[hotel.accommodation_type] ?? '#f0f0f0',
                color: '#333',
              }}>
                {TYPE_LABELS[hotel.accommodation_type] ?? hotel.accommodation_type}
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#555' }}>{hotel.town}</div>
            <div style={{ fontSize: 13, color: '#555' }}>
              {hotel.google_rating != null ? `⭐ ${hotel.google_rating}` : '—'}
              {hotel.stars != null && <span style={{ marginLeft: 4, color: '#f59e0b' }}>{'★'.repeat(hotel.stars)}</span>}
            </div>
            <Dot on={hotel.active} />
            <Dot on={hotel.featured} />
            <Dot on={hotel.onsite} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
              <Link
                href={`/admin/hotels/${hotel.id}`}
                style={{
                  fontSize: 12, color: '#555', textDecoration: 'none',
                  padding: '4px 10px', borderRadius: 6,
                  border: '1px solid #e0e0e0', background: '#fff',
                  whiteSpace: 'nowrap',
                }}
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(hotel)}
                disabled={deletingId === hotel.id}
                style={{
                  fontSize: 12, padding: '4px 10px', borderRadius: 6,
                  border: '1px solid #fca5a5',
                  background: '#fff', color: deletingId === hotel.id ? '#ccc' : '#2B6090',
                  cursor: deletingId === hotel.id ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {deletingId === hotel.id ? '…' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: '#bbb', textAlign: 'center', marginTop: 16 }}>
        Showing {filtered.length} of {hotels.length} properties
      </p>
    </div>
  )
}

function Dot({ on }: { on: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: on ? '#22a06b' : '#e5e7eb' }} />
    </div>
  )
}
