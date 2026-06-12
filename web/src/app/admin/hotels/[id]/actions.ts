'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export type SaveResult = { ok: true } | { ok: false; error: string }

export async function saveHotel(id: string, _prevState: SaveResult | null, formData: FormData): Promise<SaveResult> {
  const str  = (key: string) => (formData.get(key) as string | null)?.trim() || null
  const num  = (key: string) => { const v = str(key); return v ? Number(v) : null }
  const bool = (key: string) => formData.has(key)

  const payload = {
    name:                      formData.get('name') as string,
    accommodation_type:        formData.get('accommodation_type') as string,
    town:                      str('town') ?? '',
    region:                    formData.get('region') as string,
    website:                   str('website'),
    phone:                     str('phone'),
    google_rating:             num('google_rating'),
    stars:                     num('stars'),
    active:                    bool('active'),
    featured:                  bool('featured'),
    onsite:                    bool('onsite'),
    has_golf_package:          bool('has_golf_package'),
    has_shuttle:               bool('has_shuttle'),
    club_storage:              bool('club_storage'),
    club_cleaning:             bool('club_cleaning'),
    drying_room:               bool('drying_room'),
    early_breakfast:           bool('early_breakfast'),
    late_checkout:             bool('late_checkout'),
    offers_rental:             bool('offers_rental'),
  }

  const { error } = await supabaseAdmin.from('hotels').update(payload).eq('id', id)
  if (error) return { ok: false, error: error.message }

  revalidatePath('/admin/hotels')
  return { ok: true }
}

export async function deleteHotel(id: string): Promise<SaveResult> {
  const { error } = await supabaseAdmin.from('hotels').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/hotels')
  return { ok: true }
}
