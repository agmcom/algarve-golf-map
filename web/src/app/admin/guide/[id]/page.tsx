import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { GuidePostEditForm } from './GuidePostEditForm'

export const dynamic = 'force-dynamic'

export default async function EditGuidePostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [{ data: post }, { data: courses }, { data: hotels }, { data: shops }] = await Promise.all([
    supabaseAdmin
      .from('guide_posts')
      .select('id, title, slug, categories, excerpt, content, hero_image_url, hero_image_alt, published')
      .eq('id', id)
      .single(),
    supabaseAdmin.from('courses').select('slug, name, town').eq('active', true).order('name'),
    supabaseAdmin.from('hotels').select('slug, name, town').eq('active', true).order('name'),
    supabaseAdmin.from('shops').select('slug, name, town').eq('active', true).not('slug', 'is', null).order('name'),
  ])

  if (!post) notFound()

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1a1a2e', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/admin/guide" style={{ color: '#aaa', fontSize: 13, textDecoration: 'none' }}>← Back to guide</Link>
          <span style={{ color: '#555' }}>/</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{post.title || 'Untitled post'}</span>
        </div>
        {post.published && (
          <Link href={`/guide/${post.slug}`} target="_blank" style={{ color: '#aaa', fontSize: 13, textDecoration: 'none' }}>
            View live page →
          </Link>
        )}
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' }}>
        <GuidePostEditForm
          post={post}
          referenceOptions={{
            course: courses ?? [],
            hotel: hotels ?? [],
            shop: shops ?? [],
          }}
        />
      </div>
    </div>
  )
}
