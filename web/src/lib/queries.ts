import { supabase } from './supabase'
import type { Course, CoursePrice, Hotel, Shop, Airport, GuidePost } from '@/types/database'
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

export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  const { data, error } = await supabase
    .from('hotels')
    .select('*, photos:hotel_photos(url, alt, is_hero, position)')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error || !data) return null
  return data
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

export async function getShopsNear(lat: number, lng: number, n = 5, radiusKm = 50): Promise<(Shop & { distance_km: number })[]> {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('active', true)

  if (error || !data) return []

  return data
    .map(s => ({ ...s, distance_km: haversineKm(lat, lng, s.lat, s.lng) }))
    .filter(s => s.distance_km <= radiusKm)
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, n)
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

// Active courses that have enough pricing data to warrant a standalone
// /courses/[slug]/green-fees page — a month-by-month visitor rate table,
// or at least a `price_from`.
export async function getCourseSlugsWithGreenFees(): Promise<string[]> {
  const { data: courses } = await supabase
    .from('courses')
    .select('id, slug, price_from')
    .eq('active', true)

  if (!courses?.length) {
    return MOCK_COURSES.filter(c => c.price_from != null).map(c => c.slug)
  }

  const { data: priceRows } = await supabase
    .from('course_prices')
    .select('course_id')
    .eq('rate_type', 'visitor')

  const priced = new Set((priceRows ?? []).map(r => r.course_id))
  return courses
    .filter(c => priced.has(c.id) || c.price_from != null)
    .map(c => c.slug)
}

export interface GreenFeeComparable {
  slug: string
  name: string
  town: string
  // Lowest visitor rate we can quote: cheapest standard month, else cheapest
  // twilight month (covers the twilight-only courses), else the course `price_from`.
  priceFrom: number
}

// Every course that has a /courses/[slug]/green-fees page, with a single
// comparable "from" price — used to list courses in a similar price bracket.
export async function getGreenFeeComparables(): Promise<GreenFeeComparable[]> {
  const { data: courses } = await supabase
    .from('courses')
    .select('id, slug, name, town, price_from')
    .eq('active', true)

  if (!courses?.length) {
    return MOCK_COURSES
      .filter(c => c.price_from != null)
      .map(c => ({ slug: c.slug, name: c.name, town: c.town, priceFrom: c.price_from as number }))
  }

  const { data: priceRows } = await supabase
    .from('course_prices')
    .select('course_id, price_eur, time_slot')
    .eq('rate_type', 'visitor')

  const standardMin = new Map<string, number>()
  const twilightMin = new Map<string, number>()
  for (const r of priceRows ?? []) {
    const bucket = r.time_slot === 'twilight' || r.time_slot === 'sunset' ? twilightMin : standardMin
    const cur = bucket.get(r.course_id)
    if (cur == null || r.price_eur < cur) bucket.set(r.course_id, r.price_eur)
  }

  const out: GreenFeeComparable[] = []
  for (const c of courses) {
    const price = standardMin.get(c.id) ?? twilightMin.get(c.id) ?? c.price_from
    if (price == null) continue
    out.push({ slug: c.slug, name: c.name, town: c.town, priceFrom: price })
  }
  return out
}

export async function getShopBySlug(slug: string): Promise<Shop | null> {
  const { data, error } = await supabase
    .from('shops')
    .select('*, course:courses(*)')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error || !data) return null
  return data
}

export async function getAllShopSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from('shops')
    .select('slug')
    .eq('active', true)
    .not('slug', 'is', null)

  return data?.map(s => s.slug as string) ?? []
}

export async function getPublishedGuidePosts(): Promise<GuidePost[]> {
  const { data, error } = await supabase
    .from('guide_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data
}

export async function getGuidePostBySlug(slug: string): Promise<GuidePost | null> {
  const { data, error } = await supabase
    .from('guide_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !data) return null
  return data
}

export async function getAllGuidePostSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from('guide_posts')
    .select('slug')
    .eq('published', true)

  return data?.map(p => p.slug as string) ?? []
}

export async function getRelatedGuidePosts(postId: string, categories: string[], limit = 3): Promise<GuidePost[]> {
  if (categories.length === 0) return []

  const { data, error } = await supabase
    .from('guide_posts')
    .select('*')
    .eq('published', true)
    .neq('id', postId)
    .overlaps('categories', categories)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return data
}
