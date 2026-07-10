import { supabase } from './supabase'
import type { Course, CoursePrice, Hotel, Shop, Airport } from '@/types/database'
import { MOCK_COURSES } from '@/data/courses'
import { FALLBACK_AIRPORTS } from '@/data/airports'

export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*, photos:course_photos(url, alt, is_hero, position)')
    .eq('active', true)
    .order('rating', { ascending: false })

  if (error || !data?.length) {
    console.error('getCourses error:', error?.message)
    return MOCK_COURSES
  }

  const mockBySlug = new Map(MOCK_COURSES.map(c => [c.slug, c]))
  return data.map(c => {
    const mock = mockBySlug.get(c.slug)
    if (!mock) return c
    const dbNonNull = Object.fromEntries(
      Object.entries(c).filter(([, v]) =>
        v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0)
      )
    )
    return { ...mock, ...dbNonNull }
  })
}

export async function getHotels(): Promise<Hotel[]> {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('active', true)
    .order('stars', { ascending: false })

  if (error) {
    console.error('getHotels error:', error.message)
    return []
  }
  return data ?? []
}

export async function getShops(): Promise<Shop[]> {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('active', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('getShops error:', error.message)
    return []
  }
  return data ?? []
}

export async function getCourseBySlug(slug: string): Promise<(Course & { prices: CoursePrice[] }) | null> {
  const { data: course, error } = await supabase
    .from('courses')
    .select('*, photos:course_photos(url, alt, is_hero, position), onsite_hotel:hotels!onsite_hotel_id(*)')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error || !course) {
    const mock = MOCK_COURSES.find(c => c.slug === slug)
    return mock ? { ...mock, prices: [] } : null
  }

  const { data: prices } = await supabase
    .from('course_prices')
    .select('*')
    .eq('course_id', course.id)
    .eq('rate_type', 'visitor')
    .order('month')
    .order('time_slot')

  const mock = MOCK_COURSES.find(c => c.slug === slug)
  const dbNonNull = Object.fromEntries(
    Object.entries(course).filter(([k, v]) => {
      if (v === null || v === undefined) return false
      if (Array.isArray(v) && v.length === 0) return false
      // Always prefer DB onsite_hotel (joined) over mock — even if mock had one
      return true
    })
  )
  return {
    ...mock,
    ...dbNonNull,
    prices: prices ?? [],
  } as Course & { prices: CoursePrice[] }
}

export async function getHotelsNear(lat: number, lng: number, radiusKm = 50): Promise<(Hotel & { distance_km: number })[]> {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('active', true)

  if (error || !data) return []

  return data
    .map(h => ({ ...h, distance_km: haversineKm(lat, lng, h.lat, h.lng) }))
    .filter(h => h.distance_km <= radiusKm)
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, 10)
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export async function getAirports(): Promise<Airport[]> {
  const { data, error } = await supabase
    .from('airports')
    .select('*')
    .eq('active', true)
    .order('code')

  if (error || !data?.length) return FALLBACK_AIRPORTS
  return data
}

export async function getCoursesNear(lat: number, lng: number, excludeId: string, n = 3): Promise<(Course & { distanceKm: number })[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*, photos:course_photos(url, alt, is_hero, position)')
    .eq('active', true)
    .neq('id', excludeId)

  const source = error || !data?.length
    ? MOCK_COURSES.filter(c => c.id !== excludeId)
    : data

  return source
    .map(c => ({ ...c, distanceKm: Math.round(haversineKm(lat, lng, c.lat, c.lng)) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, n)
}

export async function getAllCourseSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from('courses')
    .select('slug')
    .eq('active', true)

  if (data?.length) return data.map(c => c.slug)
  return MOCK_COURSES.map(c => c.slug)
}
