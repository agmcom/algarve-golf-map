import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import { CATEGORY_LABELS } from '@/lib/guideCategories'

export { CATEGORY_LABELS }

function MissingKeyError({ message }: { message: string }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 520, background: '#fff', border: '1px solid #fcc', borderRadius: 16, padding: 40 }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>🔑</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#c00', margin: '0 0 12px' }}>Service role key required</h1>
        <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, margin: '0 0 20px' }}>
          The admin panel needs the Supabase <strong>service role key</strong> to bypass Row Level Security.
        </p>
        <details style={{ fontSize: 12, color: '#aaa' }}>
          <summary style={{ cursor: 'pointer' }}>Technical error</summary>
          <pre style={{ marginTop: 8, padding: 10, background: '#f9f9f9', borderRadius: 6, overflow: 'auto', whiteSpace: 'pre-wrap' }}>{message}</pre>
        </details>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

function formatUpdatedAt(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 2)   return 'just now'
  if (diffMins < 60)  return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7)   return `${diffDays}d ago`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: diffDays > 365 ? 'numeric' : undefined })
}

export default async function AdminGuidePage() {
  let posts, error
  try {
    const result = await supabaseAdmin
      .from('guide_posts')
      .select('id, title, slug, categories, published, hero_image_url, updated_at')
      .order('updated_at', { ascending: false })
    posts = result.data
    error = result.error
  } catch (e: unknown) {
    return <MissingKeyError message={e instanceof Error ? e.message : String(e)} />
  }

  if (error) {
    return <MissingKeyError message={error.message} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1a1a2e', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ color: '#aaa', fontSize: 13, textDecoration: 'none' }}>← Back to map</Link>
          <span style={{ color: '#555' }}>/</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Admin — Guide</span>
        </div>
        <span style={{ color: '#888', fontSize: 13 }}>{posts?.length ?? 0} posts</span>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <Link
            href="/admin/guide/new"
            style={{
              padding: '10px 20px', borderRadius: 8, background: '#1a1a2e', color: '#fff',
              fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}
          >
            + New post
          </Link>
        </div>

        {!posts?.length && (
          <div style={{ textAlign: 'center', color: '#999', padding: '60px 0', fontSize: 14 }}>
            No posts yet — click &ldquo;New post&rdquo; to write the first one.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {posts?.map(post => (
            <Link
              key={post.id}
              href={`/admin/guide/${post.id}`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 18px', borderRadius: 10,
                background: '#fff', border: '1px solid #e8e8e8',
                textDecoration: 'none', color: 'inherit',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: post.published ? '#22a06b' : '#ccc',
                  flexShrink: 0,
                }} title={post.published ? 'Published' : 'Draft'} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>
                    {post.title || <span style={{ color: '#bbb', fontStyle: 'italic' }}>Untitled</span>}
                  </div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                    {(post.categories?.length ? post.categories : ['—']).map((c: string) => CATEGORY_LABELS[c] ?? c).join(' · ')}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 8,
                  background: post.published ? '#f0fdf4' : '#f5f5f5',
                  color: post.published ? '#166534' : '#888',
                }}>
                  {post.published ? 'PUBLISHED' : 'DRAFT'}
                </span>
                <span style={{ fontSize: 11, color: '#bbb', textAlign: 'right' }}>
                  Updated<br />{formatUpdatedAt(post.updated_at)}
                </span>
                <span style={{ fontSize: 12, color: '#aaa' }}>Edit →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
