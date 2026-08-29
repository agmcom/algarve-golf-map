'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { redirect } from 'next/navigation'

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function createPost(_prevState: { error: string } | null, formData: FormData) {
  const title = (formData.get('title') as string | null)?.trim()
  const categories = formData.getAll('categories') as string[]

  if (!title) return { error: 'Title is required' }

  const baseSlug = slugify(title) || 'post'
  let slug = baseSlug
  let attempt = 1

  // Ensure slug is unique
  while (true) {
    const { data } = await supabaseAdmin.from('guide_posts').select('id').eq('slug', slug).maybeSingle()
    if (!data) break
    attempt += 1
    slug = `${baseSlug}-${attempt}`
  }

  const { data: post, error } = await supabaseAdmin
    .from('guide_posts')
    .insert({ title, slug, categories, published: false })
    .select('id')
    .single()

  if (error || !post) return { error: error?.message ?? 'Could not create post' }

  redirect(`/admin/guide/${post.id}`)
}
