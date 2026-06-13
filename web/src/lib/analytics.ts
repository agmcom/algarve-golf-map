import { supabase } from './supabase'

export async function trackPageView(page: string, slug?: string) {
  try {
    const referrer = typeof document !== 'undefined' ? document.referrer || null : null
    await supabase.from('page_views').insert({ page, slug: slug ?? null, referrer })
  } catch {
    // never block the UI for analytics
  }
}

export async function trackFilter(filterKey: string, filterValue?: string) {
  try {
    await supabase.from('filter_events').insert({ filter_key: filterKey, filter_value: filterValue ?? null })
  } catch {
    // never block the UI for analytics
  }
}
