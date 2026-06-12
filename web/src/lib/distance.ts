const FARO_LAT = 37.0144
const FARO_LNG = -7.9659
const ROAD_FACTOR = 1.35
const AVG_SPEED_KMH = 75

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function faroDistance(lat: number, lng: number): { km: number; mins: number } {
  const straight = haversineKm(lat, lng, FARO_LAT, FARO_LNG)
  const km = Math.round(straight * ROAD_FACTOR)
  const mins = Math.round((km / AVG_SPEED_KMH) * 60)
  return { km, mins }
}

export function formatDriveTime(mins: number): string {
  if (mins < 60) return `~${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `~${h}h` : `~${h}h ${m}m`
}

// [lng, lat] — Mapbox convention
export const FARO_COORDS: [number, number] = [FARO_LNG, FARO_LAT]

export function nearestCourses<T extends { id: string; lat: number; lng: number }>(
  lat: number,
  lng: number,
  excludeId: string,
  items: T[],
  n = 3
): (T & { distanceKm: number })[] {
  return items
    .filter(c => c.id !== excludeId)
    .map(c => ({ ...c, distanceKm: Math.round(haversineKm(lat, lng, c.lat, c.lng)) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, n)
}
