'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export type SaveResult = { ok: true } | { ok: false; error: string }

const BUCKET = 'guide-images'

async function ensureBucket() {
  await supabaseAdmin.storage.createBucket(BUCKET, { public: true }).catch(() => {})
}

function extFromFile(file: File): string {
  const fromName = file.name.split('.').pop()
  if (fromName && fromName.length <= 5) return fromName.toLowerCase()
  return file.type.split('/').pop() ?? 'jpg'
}

export async function savePost(id: string, _prevState: SaveResult | null, formData: FormData): Promise<SaveResult> {
  const str = (key: string) => (formData.get(key) as string | null)?.trim() || null

  let content: unknown = []
  try {
    content = JSON.parse((formData.get('content') as string | null) ?? '[]')
  } catch {
    return { ok: false, error: 'Could not read the article content — try reloading the page' }
  }

  const payload = {
    title:      formData.get('title') as string,
    slug:       formData.get('slug') as string,
    categories: formData.getAll('categories') as string[],
    excerpt:    str('excerpt'),
    content,
    published:  formData.has('published'),
  }

  const { error } = await supabaseAdmin.from('guide_posts').update(payload).eq('id', id)
  if (error) return { ok: false, error: error.message }

  revalidatePath('/admin/guide')
  revalidatePath(`/admin/guide/${id}`)
  revalidatePath(`/guide/${payload.slug}`)
  revalidatePath('/guide')
  revalidatePath('/sitemap.xml')
  return { ok: true }
}

export async function deletePost(id: string): Promise<SaveResult> {
  const { error } = await supabaseAdmin.from('guide_posts').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/guide')
  return { ok: true }
}

function isValidImageUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export async function saveHeroImage(id: string, _prevState: SaveResult | null, formData: FormData): Promise<SaveResult> {
  const file = formData.get('hero_file') as File | null
  const url = (formData.get('hero_url') as string | null)?.trim() || null
  const alt = (formData.get('hero_alt') as string | null)?.trim() || null

  let finalUrl: string

  if (file && file.size > 0) {
    await ensureBucket()
    const path = `hero/${id}-${Date.now()}.${extFromFile(file)}`
    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: true })
    if (uploadError) return { ok: false, error: uploadError.message }
    finalUrl = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
  } else if (url) {
    if (!isValidImageUrl(url)) return { ok: false, error: 'That doesn\'t look like a valid image URL' }
    finalUrl = url
  } else {
    return { ok: false, error: 'Choose a file or paste an image link' }
  }

  const { error } = await supabaseAdmin
    .from('guide_posts')
    .update({ hero_image_url: finalUrl, hero_image_alt: alt })
    .eq('id', id)

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/admin/guide/${id}`)
  revalidatePath('/guide')
  return { ok: true }
}

export type UploadImageResult = { ok: true; url: string } | { ok: false; error: string }

export async function uploadContentImage(id: string, formData: FormData): Promise<UploadImageResult> {
  const file = formData.get('file') as File | null
  const url = (formData.get('url') as string | null)?.trim() || null

  if (url) {
    if (!isValidImageUrl(url)) return { ok: false, error: 'That doesn\'t look like a valid image URL' }
    return { ok: true, url }
  }

  if (!file || file.size === 0) return { ok: false, error: 'Choose an image file or paste a link' }

  await ensureBucket()

  const path = `content/${id}-${Date.now()}.${extFromFile(file)}`
  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type })

  if (uploadError) return { ok: false, error: uploadError.message }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)
  return { ok: true, url: data.publicUrl }
}
