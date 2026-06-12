import type { Airport } from '@/types/database'

export const FALLBACK_AIRPORTS: Airport[] = [
  { id: 'fao', code: 'FAO', name: 'Faro Airport',    city: 'Faro',    country: 'PT', lat: 37.0144, lng: -7.9659, road_factor: 1.35, avg_speed_kmh: 75,  active: true },
  { id: 'lis', code: 'LIS', name: 'Lisbon Airport',  city: 'Lisbon',  country: 'PT', lat: 38.7742, lng: -9.1342, road_factor: 1.30, avg_speed_kmh: 110, active: true },
  { id: 'svq', code: 'SVQ', name: 'Seville Airport', city: 'Seville', country: 'ES', lat: 37.4180, lng: -5.8931, road_factor: 1.25, avg_speed_kmh: 100, active: true },
]
