'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export type SaveResult = { ok: true } | { ok: false; error: string }

export async function saveCourse(slug: string, _prevState: SaveResult | null, formData: FormData): Promise<SaveResult> {
  const str  = (key: string) => (formData.get(key) as string | null)?.trim() || null
  const num  = (key: string) => { const v = str(key); return v ? Number(v) : null }
  const bool = (key: string) => formData.has(key)
  const arr  = (key: string) => {
    const v = str(key)
    return v ? v.split(',').map(s => s.trim()).filter(Boolean) : []
  }

  const payload = {
    name:                   formData.get('name') as string,
    blurb:                  str('blurb'),
    description:            str('description'),
    town:                   formData.get('town') as string,
    region:                 formData.get('region') as string,
    address:                str('address'),

    holes:                  num('holes') ?? 18,
    par:                    num('par'),
    length_meters:          num('length_meters'),
    course_type:            str('course_type'),
    difficulty:             str('difficulty'),
    designer:               str('designer'),
    year_opened:            num('year_opened'),
    handicap_required_men:     num('handicap_required_men'),
    handicap_required_ladies:  num('handicap_required_ladies'),

    has_own_hotel:          bool('has_own_hotel'),
    driving_range:          bool('driving_range'),
    caddie_service:         bool('caddie_service'),
    pro_shop:               bool('pro_shop'),
    restaurant:             bool('restaurant'),
    dress_code:             str('dress_code'),
    languages:              arr('languages'),

    offers_rental:          bool('offers_rental'),
    rental_brands:          arr('rental_brands'),
    rental_price_per_round: num('rental_price_per_round'),

    price_from:             num('price_from'),
    website:                str('website'),
    phone:                  str('phone'),
    email:                  str('email'),
    booking_url:            str('booking_url'),

    tags:                   arr('tags'),
    amenities:              arr('amenities'),
    featured:               bool('featured'),
    active:                 bool('active'),
    rating:                 num('rating'),
    review_count:           num('review_count') ?? 0,
    course_map_url:         str('course_map_url'),
  }

  const { error } = await supabaseAdmin
    .from('courses')
    .update(payload)
    .eq('slug', slug)

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/courses/${slug}`)
  revalidatePath('/admin/courses')
  revalidatePath('/')
  return { ok: true }
}

export async function saveHeroPhoto(courseSlug: string, _prevState: SaveResult | null, formData: FormData): Promise<SaveResult> {
  const url = (formData.get('hero_url') as string | null)?.trim()
  const alt = (formData.get('hero_alt') as string | null)?.trim() || null

  if (!url) return { ok: false, error: 'URL is required' }

  const { data: course } = await supabaseAdmin
    .from('courses')
    .select('id')
    .eq('slug', courseSlug)
    .single()

  if (!course) return { ok: false, error: 'Course not found' }

  // Remove existing hero, then insert new one
  await supabaseAdmin
    .from('course_photos')
    .delete()
    .eq('course_id', course.id)
    .eq('is_hero', true)

  const { error } = await supabaseAdmin
    .from('course_photos')
    .insert({ course_id: course.id, url, alt, position: 0, is_hero: true })

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/courses/${courseSlug}`)
  revalidatePath('/')
  return { ok: true }
}
