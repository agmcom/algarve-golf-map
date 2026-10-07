import type { AccommodationType, Hotel, HotelService, HotelServiceKey } from '@/types/database'

// ── Type filter groups ─────────────────────────────────────────────────────────
// Shared by course pages and Find Your Base so both filter the same way.

export type HotelTypeGroup = 'hotels' | 'self_catering' | 'bnb'

export const TYPE_GROUPS: { key: HotelTypeGroup; label: string; types: AccommodationType[] }[] = [
  { key: 'hotels',        label: 'Hotels & resorts',     types: ['hotel', 'resort'] },
  { key: 'self_catering', label: 'Villas & apartments',  types: ['villa', 'apartment'] },
  { key: 'bnb',           label: 'B&Bs & guest houses',  types: ['bb', 'guest_house'] },
]

export function typeGroupOf(type: AccommodationType | undefined): HotelTypeGroup | null {
  if (!type) return null
  return TYPE_GROUPS.find(g => g.types.includes(type))?.key ?? null
}

export function countByTypeGroup(hotels: Pick<Hotel, 'accommodation_type'>[]): Record<HotelTypeGroup, number> {
  const counts: Record<HotelTypeGroup, number> = { hotels: 0, self_catering: 0, bnb: 0 }
  for (const h of hotels) {
    const g = typeGroupOf(h.accommodation_type)
    if (g) counts[g]++
  }
  return counts
}

export const TYPE_LABEL: Record<AccommodationType, string> = {
  hotel: 'Hotel',
  resort: 'Resort',
  apartment: 'Apartments',
  villa: 'Villa',
  bb: 'B&B',
  guest_house: 'Guest house',
  hostel: 'Hostel',
  camping: 'Camping',
}

// ── Services ───────────────────────────────────────────────────────────────────
// Golf services lead; general amenities follow. Only confirmed services exist,
// so nothing here ever renders a "no".

const SERVICE_META: Record<HotelServiceKey, { label: string; golf: boolean; order: number }> = {
  golf_shuttle:     { label: 'Golf shuttle',      golf: true,  order: 1 },
  golf_package:     { label: 'Golf packages',     golf: true,  order: 2 },
  onsite_golf:      { label: 'Golf on site',      golf: true,  order: 3 },
  tee_time_booking: { label: 'Tee-time booking',  golf: true,  order: 4 },
  club_storage:     { label: 'Club storage',      golf: true,  order: 5 },
  club_rental:      { label: 'Club hire',         golf: true,  order: 6 },
  breakfast_time:   { label: 'Breakfast',         golf: false, order: 7 },
  parking:          { label: 'Parking',           golf: false, order: 8 },
  airport_transfer: { label: 'Airport transfer',  golf: false, order: 9 },
  spa:              { label: 'Spa',               golf: false, order: 10 },
  late_checkout:    { label: 'Late check-out',    golf: false, order: 11 },
  restaurant_bar:   { label: 'Restaurant',        golf: false, order: 12 },
}

export function isGolfService(s: HotelService): boolean {
  return SERVICE_META[s.service]?.golf ?? false
}

export function sortServices(services: readonly HotelService[] | undefined): HotelService[] {
  return [...(services ?? [])]
    .filter(s => SERVICE_META[s.service])
    .sort((a, b) => SERVICE_META[a.service].order - SERVICE_META[b.service].order)
}

// Short chip text, e.g. "Free golf shuttle", "Breakfast from 07:00", "Free parking"
export function serviceLabel(s: HotelService): string {
  const base = SERVICE_META[s.service].label
  if (s.service === 'breakfast_time' && s.detail) {
    const start = s.detail.match(/\d{1,2}:\d{2}/)?.[0]
    return start ? `Breakfast from ${start}` : base
  }
  if (s.is_paid === false && (s.service === 'golf_shuttle' || s.service === 'parking' || s.service === 'airport_transfer')) {
    return `Free ${base.toLowerCase()}`
  }
  return base
}

// ── Lean list item ─────────────────────────────────────────────────────────────
// Only what a card renders, so long nearby lists stay light in the page payload.

export type HotelListItem = Pick<Hotel,
  'id' | 'name' | 'accommodation_type' | 'stars' | 'town' | 'lat' | 'lng' |
  'google_rating' | 'google_user_ratings_total' | 'booking_url' | 'services'
> & { distance_km: number }

export function toHotelListItem(h: Hotel & { distance_km: number }): HotelListItem {
  return {
    id: h.id, name: h.name, accommodation_type: h.accommodation_type, stars: h.stars, town: h.town,
    lat: h.lat, lng: h.lng, google_rating: h.google_rating ?? null,
    google_user_ratings_total: h.google_user_ratings_total ?? null,
    booking_url: h.booking_url, distance_km: h.distance_km,
    services: (h.services ?? []).map(s => ({ service: s.service, detail: s.detail, is_paid: s.is_paid })),
  }
}

// Some imported town values are postcodes or fragments ("08") — only show real place names
export function displayTown(town: string | null | undefined): string | null {
  return town && /[a-zà-ú]{3}/i.test(town) ? town : null
}

// ── Links & ratings ────────────────────────────────────────────────────────────

export function bookingUrl(hotel: Pick<Hotel, 'name' | 'booking_url'>): string {
  return hotel.booking_url
    ?? `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name + ' Algarve')}`
}

export function formatReviewCount(n: number | null | undefined): string | null {
  if (!n) return null
  return n.toLocaleString('en-GB')
}
