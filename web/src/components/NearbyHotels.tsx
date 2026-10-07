'use client'

import { useState } from 'react'
import { countByTypeGroup, typeGroupOf, type HotelListItem, type HotelTypeGroup } from '@/lib/hotels'
import { HotelCard } from './HotelCard'
import { HotelTypeFilter } from './HotelTypeFilter'

const PAGE_SIZE = 10

// Course page list: every nearby place to stay, closest first (on-site hotel on top),
// filterable by type and revealed ten at a time.
export function NearbyHotels({ hotels, onsiteHotelId }: {
  hotels: HotelListItem[]
  onsiteHotelId: string | null
}) {
  const [group, setGroup] = useState<HotelTypeGroup | 'all'>('all')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const filtered = group === 'all' ? hotels : hotels.filter(h => typeGroupOf(h.accommodation_type) === group)
  const shown = filtered.slice(0, visible)
  const remaining = filtered.length - shown.length

  function changeGroup(g: HotelTypeGroup | 'all') {
    setGroup(g)
    setVisible(PAGE_SIZE)
  }

  return (
    <div>
      <HotelTypeFilter value={group} onChange={changeGroup} total={hotels.length} counts={countByTypeGroup(hotels)} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {shown.map(hotel => (
          <HotelCard key={hotel.id} hotel={hotel} isOnsiteForCourse={hotel.id === onsiteHotelId} />
        ))}
      </div>
      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setVisible(v => v + PAGE_SIZE)}
          style={{
            display: 'block', width: '100%', marginTop: 12, padding: '11px 0', borderRadius: 12,
            border: '1px solid #dcdcdc', background: '#fff', color: '#222',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Show {Math.min(remaining, PAGE_SIZE)} more ({remaining} left)
        </button>
      )}
    </div>
  )
}
