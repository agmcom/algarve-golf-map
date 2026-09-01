import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getGuidePostBySlug, getAllGuidePostSlugs, getCourseBySlug, getHotelBySlug, getShopBySlug, getRelatedGuidePosts } from '@/lib/queries'
import type { GuideCardRefType } from '@/types/database'
import { CATEGORY_LABELS } from '@/lib/guideCategories'
import { renderInlineText } from '@/lib/richText'
import { SiteHeader } from '@/components/SiteHeader'

const BASE = 'https://www.algarvegolfmap.com'

const PEXELS_FALLBACK =
  'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop'

interface ResolvedCard {
  href: string
  icon: string
  title: string
  subtitle: string
  meta: string
  image: string | null
}

async function resolveCard(refType: GuideCardRefType, slug: string): Promise<ResolvedCard | null> {
  if (refType === 'course') {
    const c = await getCourseBySlug(slug)
    if (!c) return null
    return {
      href: `/courses/${c.slug}`,
      icon: '⛳',
      title: c.name,
      subtitle: `${c.town} · ${c.holes} holes${c.par ? ` · par ${c.par}` : ''}`,
      meta: c.price_from != null ? `from €${c.price_from}` : '',
      image: c.photos?.find(p => p.is_hero)?.url ?? c.photos?.[0]?.url ?? null,
    }
  }
  if (refType === 'hotel') {
    const h = await getHotelBySlug(slug)
    if (!h) return null
    return {
      href: `/hotels/${h.slug}`,
      icon: '🏨',
      title: h.name,
      subtitle: `${h.town}${h.stars ? ` · ${'★'.repeat(h.stars)}` : ''}`,
      meta: h.price_from != null ? `from €${h.price_from}/night` : '',
      image: h.photos?.find(p => p.is_hero)?.url ?? h.photos?.[0]?.url ?? null,
    }
  }
  const s = await getShopBySlug(slug)
  if (!s || !s.slug) return null
  return {
    href: `/shops/${s.slug}`,
    icon: '🛍️',
    title: s.name,
    subtitle: `${s.town}${s.offers_rental ? ' · Club rental' : ''}`,
    meta: '',
    image: s.photo_url ?? null,
  }
}

export async function generateStaticParams() {
  const slugs = await getAllGuidePostSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await getGuidePostBySlug(slug)
  if (!post) return {}

  const title = post.title
  const description = post.excerpt ?? `${post.title} — a guide from Algarve Golf Map.`
  const canonicalUrl = `${BASE}/guide/${slug}`
  const ogImages = post.hero_image_url
    ? [{ url: post.hero_image_url, width: 1400, height: 600, alt: post.hero_image_alt ?? post.title }]
    : []

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Algarve Golf Map',
      locale: 'en_GB',
      type: 'article',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map(i => i.url),
    },
  }
}

export default async function GuidePostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = await getGuidePostBySlug(slug)
  if (!post) notFound()

  const cardBlocks = post.content.filter(b => b.type === 'card')
  const cardEntries = await Promise.all(
    cardBlocks.map(async b => [`${b.refType}:${b.slug}`, await resolveCard(b.refType, b.slug)] as const)
  )
  const cardData = new Map(cardEntries)

  const relatedPosts = await getRelatedGuidePosts(post.id, post.categories)

  const pageUrl = `${BASE}/guide/${slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.hero_image_url ?? undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: 'Algarve Golf Map' },
    publisher: { '@type': 'Organization', name: 'Algarve Golf Map' },
    mainEntityOfPage: pageUrl,
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Guide', item: `${BASE}/guide` },
      { '@type': 'ListItem', position: 3, name: post.title, item: pageUrl },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/<\//g, '<\\/') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: 'var(--font-body)' }}>
        <SiteHeader showBackToMap />

        {/* Hero */}
        <div style={{ position: 'relative', height: 360, background: '#d4e6c3', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.hero_image_url ?? PEXELS_FALLBACK}
            alt={post.hero_image_alt ?? post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,.65) 0%, rgba(0,0,0,.1) 60%)',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '32px 32px 28px',
            maxWidth: 760, margin: '0 auto',
          }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {post.categories.map(c => (
                <span key={c} style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 10px',
                  borderRadius: 12, background: 'rgba(255,255,255,.2)',
                  color: '#fff', backdropFilter: 'blur(4px)',
                  letterSpacing: '.04em', textTransform: 'uppercase',
                }}>
                  {CATEGORY_LABELS[c] ?? c}
                </span>
              ))}
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.2 }}>
              {post.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: 28 }}>
            <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#6a6a6a' }}>
              <li><Link href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/guide" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Guide</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>{post.title}</li>
            </ol>
          </nav>

          {post.excerpt && (
            <p style={{ fontSize: 18, lineHeight: 1.6, color: '#555', margin: '0 0 32px', fontWeight: 500 }}>
              {post.excerpt}
            </p>
          )}

          <div>
            {post.content.map((block, i) => {
              if (block.type === 'heading') {
                const Tag = block.level === 3 ? 'h3' : 'h2'
                return (
                  <Tag key={i} style={{
                    fontSize: block.level === 3 ? 19 : 23, fontWeight: 700, color: '#222',
                    margin: '32px 0 14px', lineHeight: 1.3,
                  }}>
                    {block.text}
                  </Tag>
                )
              }
              if (block.type === 'paragraph') {
                return (
                  <p key={i} style={{ fontSize: 17, lineHeight: 1.75, color: '#333', margin: '0 0 20px' }}>
                    {renderInlineText(block.text)}
                  </p>
                )
              }
              if (block.type === 'image' && block.url) {
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={block.url}
                    alt={block.alt}
                    style={{ width: '100%', borderRadius: 14, display: 'block', margin: '8px 0 28px' }}
                  />
                )
              }
              if (block.type === 'card') {
                const card = cardData.get(`${block.refType}:${block.slug}`)
                if (!card) return null
                const showPhoto = block.withPhoto && card.image
                return (
                  <Link key={i} href={card.href} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: showPhoto ? 10 : '14px 16px', borderRadius: 14, margin: '8px 0 28px',
                    border: '1px solid #ebebeb', background: '#fff',
                    textDecoration: 'none', gap: 14,
                  }}>
                    {showPhoto && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.image!}
                        alt={card.title}
                        style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {card.icon} {card.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#6a6a6a', marginTop: 3 }}>
                        {card.subtitle}
                      </div>
                    </div>
                    {card.meta && (
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#222', flexShrink: 0, paddingRight: showPhoto ? 6 : 0 }}>{card.meta}</div>
                    )}
                  </Link>
                )
              }
              return null
            })}
          </div>

          <div style={{ marginTop: 48, paddingTop: 28, borderTop: '1px solid #ebebeb' }}>
            <Link
              href="/"
              style={{
                display: 'inline-block', padding: '12px 24px', borderRadius: 12,
                background: '#2B6090', color: '#fff', fontSize: 14, fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Explore golf courses on the map →
            </Link>
          </div>

          {relatedPosts.length > 0 && (
            <div style={{ marginTop: 44 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#222', margin: '0 0 16px' }}>Related Guides</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                {relatedPosts.map(related => (
                  <a
                    key={related.id}
                    href={`/guide/${related.slug}`}
                    style={{
                      display: 'flex', flexDirection: 'column', borderRadius: 14,
                      border: '1px solid #ebebeb', background: '#fff',
                      textDecoration: 'none', overflow: 'hidden',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={related.hero_image_url ?? PEXELS_FALLBACK}
                      alt={related.hero_image_alt ?? related.title}
                      style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#222', lineHeight: 1.35 }}>
                        {related.title}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
