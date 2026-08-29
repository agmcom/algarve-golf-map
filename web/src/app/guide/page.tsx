import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedGuidePosts } from '@/lib/queries'
import { CATEGORY_LABELS } from '@/lib/guideCategories'
import { SiteHeader } from '@/components/SiteHeader'

const BASE = 'https://www.algarvegolfmap.com'
const TITLE = 'Algarve Golf Guide — Tips & Advice for Playing in the Algarve'
const DESCRIPTION =
  'Practical guides for planning a golf trip to the Algarve — the best time to play, course advice, hotels, transport, and what to pack.'

const PEXELS_FALLBACK =
  'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=640&h=400&fit=crop'

export const revalidate = 3600

export function generateMetadata(): Metadata {
  const url = `${BASE}/guide`
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url,
      siteName: 'Algarve Golf Map',
      type: 'website',
    },
  }
}

export default async function GuideIndexPage() {
  const posts = await getPublishedGuidePosts()
  const pageUrl = `${BASE}/guide`

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Guide', item: pageUrl },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: 'var(--font-body)' }}>
        <SiteHeader showBackToMap />

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: 16 }}>
            <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#6a6a6a' }}>
              <li><Link href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>Guide</li>
            </ol>
          </nav>

          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#222', margin: '0 0 12px' }}>{TITLE}</h1>
          <p style={{ maxWidth: 700, fontSize: 16, lineHeight: 1.7, color: '#444', margin: '0 0 40px' }}>
            {DESCRIPTION}
          </p>

          {posts.length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', fontSize: 14, padding: '60px 0' }}>
              New guides are on the way — check back soon.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {posts.map(post => (
              <a
                key={post.id}
                href={`/guide/${post.slug}`}
                style={{
                  display: 'flex', flexDirection: 'column', borderRadius: 16,
                  border: '1px solid #ebebeb', background: '#fff',
                  textDecoration: 'none', overflow: 'hidden',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.hero_image_url ?? PEXELS_FALLBACK}
                  alt={post.hero_image_alt ?? post.title}
                  style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                />
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {post.categories.map(c => (
                      <span key={c} style={{
                        fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 10,
                        background: '#eef4f8', color: '#2B6090', textTransform: 'uppercase', letterSpacing: '.04em',
                      }}>
                        {CATEGORY_LABELS[c] ?? c}
                      </span>
                    ))}
                  </div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#222', margin: 0, lineHeight: 1.35 }}>
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p style={{ fontSize: 13, color: '#6a6a6a', lineHeight: 1.6, margin: 0 }}>
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
