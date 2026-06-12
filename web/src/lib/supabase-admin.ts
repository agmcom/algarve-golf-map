import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in .env.local — get it from Supabase dashboard → Project Settings → API')
  }
  return createClient(url, key, { auth: { persistSession: false } })
}

export const supabaseAdmin = {
  from: (...args: Parameters<ReturnType<typeof getAdminClient>['from']>) => getAdminClient().from(...args)
}
