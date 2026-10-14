import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getGuidePostBySlug, getAllGuidePostSlugs, getCourseBySlug, getHotelBySlug, getShopBySlug, getRelatedGuidePosts } from '@/lib/queries'
import type { GuideBlock, GuideCardRefType, GuideHotelBlock } from '@/types/database'
import { CATEGORY_LABELS } from '@/lib/guideCategories'
import { renderInlineText } from '@/lib/richText'
import { SiteHeader } from '@/components/SiteHeader'
import { SocialLinks } from '@/components/SocialLinks'
import { ShareButtons } from '@/components/ShareButtons'
import { GuideHotelMap } from '@/components/GuideHotelMap'

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

  // Hotel list: numbered in article order; each gets an anchor id the map pins reuse
  const hotelBlocks = post.content.filter((b): b is GuideHotelBlock => b.type === 'hotel')
  const hotelNumber = new Map(hotelBlocks.map((b, i) => [b, i + 1]))
  const mapBlock = post.content.find(b => b.type === 'hotelMap')
  const mapCourse = mapBlock?.type === 'hotelMap' ? await getCourseBySlug(mapBlock.courseSlug) : null
  const extraMapCourses = mapBlock?.type === 'hotelMap' && mapBlock.extraCourseSlugs?.length
    ? (await Promise.all(mapBlock.extraCourseSlugs.map(s => getCourseBySlug(s)))).filter(c => c != null)
    : []

  const pageUrl = `${BASE}/guide/${slug}`
  const followAt = followBoxIndex(post.content)

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

  const hotelListLd = hotelBlocks.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: post.title,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: hotelBlocks.length,
    itemListElement: hotelBlocks.map((h, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${pageUrl}#hotel-${i + 1}`,
      name: h.name,
    })),
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/<\//g, '<\\/') }}
      />
      {hotelListLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelListLd).replace(/<\//g, '<\\/') }}
        />
      )}
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
            {insertAt(post.content.map((block, i) => {
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
              if (block.type === 'hotel') {
                return <GuideHotelEntry key={i} hotel={block} n={hotelNumber.get(block)!} />
              }
              if (block.type === 'hotelMap' && mapCourse) {
                return (
                  <GuideHotelMap
                    key={i}
                    course={{ name: mapCourse.name, slug: mapCourse.slug, lat: mapCourse.lat, lng: mapCourse.lng }}
                    extraCourses={extraMapCourses.map(c => ({ name: c.name, slug: c.slug, lat: c.lat, lng: c.lng }))}
                    hotels={hotelBlocks.map((h, j) => ({
                      name: h.name, lat: h.lat, lng: h.lng, bookingUrl: h.bookingUrl,
                      ctaId: `hotel-cta-${j + 1}`,
                      sub: h.priceFrom != null ? `from ~€${h.priceFrom}` : (h.tier ?? ''),
                    }))}
                  />
                )
              }
              return null
            }), followAt, <FollowBox key="follow" />)}
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

          <div style={{
            marginTop: 28, padding: '18px 22px', borderRadius: 14,
            background: '#fff', border: '1px solid #ebebeb',
          }}>
            <ShareButtons url={pageUrl} title={post.title} />
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

// Places the "Follow us" box roughly halfway through the article, never inside a
// hotel list or right after the hotel map. Prefers a heading near the middle; posts
// built around a hotel list get it just before the list starts; otherwise it goes
// at the block boundary closest to the middle.
function followBoxIndex(content: GuideBlock[]): number | null {
  if (content.length < 2) return null
  const textLength = (b: GuideBlock) =>
    b.type === 'paragraph' || b.type === 'heading' ? b.text.length : 400
  const total = content.reduce((sum, b) => sum + textLength(b), 0)
  const firstHotel = content.findIndex(b => b.type === 'hotel')
  const lastHotel = content.findLastIndex(b => b.type === 'hotel')

  const candidates: { i: number; share: number; heading: boolean }[] = []
  let before = 0
  content.forEach((b, i) => {
    const share = before / total
    before += textLength(b)
    if (i === 0) return
    if (firstHotel !== -1 && i > firstHotel && i <= lastHotel) return
    if (content[i - 1].type === 'hotelMap') return
    candidates.push({ i, share, heading: b.type === 'heading' })
  })
  const closest = (list: typeof candidates) =>
    list.reduce<(typeof candidates)[number] | null>(
      (best, c) => (!best || Math.abs(c.share - 0.5) < Math.abs(best.share - 0.5) ? c : best), null)?.i ?? null

  const midHeading = closest(candidates.filter(c => c.heading && c.share >= 0.3 && c.share <= 0.7))
  if (midHeading != null) return midHeading
  if (firstHotel > 0) return content[firstHotel - 1].type === 'heading' ? firstHotel - 1 : firstHotel
  return closest(candidates)
}

function insertAt(nodes: React.ReactNode[], index: number | null, node: React.ReactNode) {
  return index == null ? nodes : [...nodes.slice(0, index), node, ...nodes.slice(index)]
}

function FollowBox() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14,
      margin: '12px 0 28px', padding: '18px 22px', borderRadius: 14,
      background: '#fff', border: '1px solid #ebebeb',
    }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#222' }}>
        Enjoying this guide? Follow us for more Algarve golf tips
      </div>
      <SocialLinks size={22} color="#6a6a6a" />
    </div>
  )
}

function GuideHotelEntry({ hotel, n }: { hotel: GuideHotelBlock; n: number }) {
  const facts: [string, string][] = []
  if (hotel.distanceLabel) {
    facts.push(['From the course', hotel.distanceLabel])
  } else if (hotel.distanceKm != null) {
    facts.push(['From the course', `${hotel.distanceKm.toLocaleString('en-GB', { maximumFractionDigits: 1 })} km${hotel.driveMin != null ? ` · ${hotel.driveMin === 0 ? 'walk' : `about ${hotel.driveMin} min drive`}` : ''}`])
  }
  if (hotel.priceFrom != null) facts.push(['Price', `from about €${hotel.priceFrom} a night`])
  if (hotel.rating != null) {
    facts.push(['Guest rating', `${hotel.rating.toFixed(1)}/10${hotel.ratingSource ? ` on ${hotel.ratingSource}` : ''}${hotel.reviewCount ? ` (${hotel.reviewCount.toLocaleString('en-GB')} reviews)` : ''}`])
  }
  if (hotel.breakfast) facts.push(['Breakfast', hotel.breakfast])

  return (
    <section id={`hotel-${n}`} style={{
      background: '#fff', border: '1px solid #ebebeb', borderRadius: 14,
      padding: '20px 22px', margin: '0 0 24px', scrollMarginTop: 80,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#222', margin: 0, lineHeight: 1.3 }}>
          {`${n}. ${hotel.name}`}
        </h3>
        {hotel.tier && (
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 12,
            background: hotel.tier.startsWith('On-site') ? '#edf7f2' : '#eef4fa',
            color: hotel.tier.startsWith('On-site') ? '#22a06b' : '#2B6090',
            textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap',
          }}>
            {hotel.tier}
          </span>
        )}
      </div>

      {facts.length > 0 && (
        <dl style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px 16px', margin: '16px 0 0', padding: '14px 0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0',
        }}>
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt style={{ fontSize: 11, fontWeight: 700, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</dt>
              <dd style={{ fontSize: 14, color: '#222', margin: '3px 0 0', fontWeight: 600 }}>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <p style={{ fontSize: 16, lineHeight: 1.7, color: '#333', margin: '16px 0 0' }}>
        {renderInlineText(hotel.text)}
      </p>

      {hotel.perks && hotel.perks.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {hotel.perks.map(p => (
            <li key={p} style={{
              fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 12,
              background: '#f4f6f8', color: '#3a4a5a', border: '1px solid #e4e9ee',
            }}>
              {p}
            </li>
          ))}
        </ul>
      )}

      <a
        id={`hotel-cta-${n}`}
        href={hotel.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-hotel-click="guide_hotel_list"
        data-hotel-name={hotel.name}
        style={{
          display: 'inline-block', marginTop: 18, padding: '10px 18px', borderRadius: 10,
          background: '#2B6090', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none',
        }}
      >
        Check prices for {hotel.name} →
      </a>
    </section>
  )
}
