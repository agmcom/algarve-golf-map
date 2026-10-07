import type { Hotel } from '@/types/database'
import { type HotelListItem, TYPE_LABEL, displayTown, bookingUrl, formatReviewCount, isGolfService, serviceLabel, sortServices } from '@/lib/hotels'
import { distanceToMinutes } from '@/lib/travel'

// ── Shared pieces (also used by the Find Your Base panel) ─────────────────────

export function HotelRating({ hotel }: { hotel: Pick<Hotel, 'google_rating' | 'google_user_ratings_total'> }) {
  if (hotel.google_rating == null) return null
  const count = formatReviewCount(hotel.google_user_ratings_total)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#4a4a4a', whiteSpace: 'nowrap' }}>
      <span style={{ color: '#f5a623' }}>★</span>
      <strong style={{ color: '#222' }}>{hotel.google_rating.toFixed(1)}</strong>
      {count && <span style={{ color: '#8a8a8a' }}>({count} Google reviews)</span>}
    </span>
  )
}

export function OnsiteBadge() {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10,
      background: '#edf7f2', color: '#22a06b', border: '1px solid #c3e6cb',
      flexShrink: 0, whiteSpace: 'nowrap',
    }}>
      ⛳ On-site
    </span>
  )
}

// Golf services first (green), then a few general amenities (grey)
export function ServiceChips({ hotel, maxOther = 4 }: { hotel: Pick<Hotel, 'services'>; maxOther?: number }) {
  const services = sortServices(hotel.services)
  if (services.length === 0) return null
  const golf = services.filter(isGolfService)
  const other = services.filter(s => !isGolfService(s)).slice(0, maxOther)
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {golf.map(s => (
        <span key={s.service} title={s.detail ?? undefined} style={chip(true)}>⛳ {serviceLabel(s)}</span>
      ))}
      {other.map(s => (
        <span key={s.service} title={s.detail ?? undefined} style={chip(false)}>{serviceLabel(s)}</span>
      ))}
    </div>
  )
}

export function CheckAvailabilityLabel() {
  return (
    <span style={{
      display: 'inline-block', padding: '8px 14px', borderRadius: 8,
      background: '#2B6090', color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      Check availability →
    </span>
  )
}

// ── Course-page card ──────────────────────────────────────────────────────────

export function HotelCard({ hotel, isOnsiteForCourse }: { hotel: HotelListItem; isOnsiteForCourse: boolean }) {
  const type = hotel.accommodation_type ? TYPE_LABEL[hotel.accommodation_type] : null
  const minutes = distanceToMinutes(hotel.distance_km)

  return (
    <a
      href={bookingUrl(hotel)}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: 12, padding: '14px 16px', borderRadius: 14,
        border: '1px solid #ebebeb', background: '#fff', textDecoration: 'none',
      }}
    >
      <div style={{ flex: '1 1 260px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{ minWidth: 0, fontSize: 15, fontWeight: 700, color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {hotel.name}
          </span>
          {isOnsiteForCourse && <OnsiteBadge />}
        </div>
        <div style={{ fontSize: 12, color: '#6a6a6a' }}>
          {[
            type,
            displayTown(hotel.town),
            isOnsiteForCourse ? 'At the course' : `${hotel.distance_km.toFixed(1)} km · ~${Math.max(minutes, 1)} min drive`,
          ].filter(Boolean).join(' · ')}
        </div>
        <HotelRating hotel={hotel} />
        <ServiceChips hotel={hotel} />
      </div>
      <CheckAvailabilityLabel />
    </a>
  )
}

function chip(golf: boolean): React.CSSProperties {
  return {
    fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999,
    background: golf ? '#edf7f2' : '#f4f4f4',
    color: golf ? '#1d7a52' : '#4a4a4a',
    border: `1px solid ${golf ? '#c3e6cb' : '#ebebeb'}`,
    whiteSpace: 'nowrap',
  }
}
