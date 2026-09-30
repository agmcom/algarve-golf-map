import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PenLine } from 'lucide-react'
import { getCourseBySlug, getApprovedReviews, getCoursesNear } from '@/lib/queries'
import {
  summarizeReviews, sortReviews, seasonOf, SEASON_LABELS, BUGGY_RULE_LABELS, ROUND_TIME_LABELS, DIFFICULTY_LABELS,
  MIN_REVIEWS_TO_INDEX, REVIEWS_PER_PAGE, RECENT_MONTHS, type RatingAverage, type Season,
} from '@/lib/reviews'
import { ReviewStars } from '@/components/ReviewStars'
import { ReviewCard } from '@/components/ReviewCard'
import { PageViewTracker } from '@/components/PageViewTracker'
import { SiteHeader } from '@/components/SiteHeader'
import { townSlug } from '@/lib/towns'

const SITE_URL = 'https://www.algarvegolfmap.com'
const PEXELS_FALLBACK = 'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop'

type SearchParams = Promise<{ page?: string; season?: string }>

function parseParams(sp: { page?: string; season?: string }) {
  const page = Math.max(1, Number.parseInt(sp.page ?? '1', 10) || 1)
  const season = (sp.season && sp.season in SEASON_LABELS ? sp.season : null) as Season | null
  return { page, season }
}

export async function generateMetadata(
  { params, searchParams }: { params: Promise<{ slug: string }>; searchParams: SearchParams }
): Promise<Metadata> {
  const { slug } = await params
  const { page, season } = parseParams(await searchParams)
  const course = await getCourseBySlug(slug)
  if (!course) return {}

  const reviews = await getApprovedReviews(course.id)
  const s = summarizeReviews(reviews)
  const indexable = s.count >= MIN_REVIEWS_TO_INDEX && !season

  const golfers = `${s.count} golfer${s.count === 1 ? '' : 's'}`
  const title = s.count > 0
    ? `${course.name} Reviews (${s.overall}/5 from ${golfers})${page > 1 ? ` — Page ${page}` : ''}`
    : `${course.name} Reviews`

  const greens = (s.recent?.condition ?? s.condition).find(c => c.key === 'rating_greens')?.average
  const fairways = (s.recent?.condition ?? s.condition).find(c => c.key === 'rating_fairways')?.average
  const description = s.count > 0
    ? `Read ${s.count} review${s.count === 1 ? '' : 's'} of ${course.name} in ${course.town}, Algarve, rated ${s.overall}/5 by visiting golfers. ` +
      `Course condition${s.recent ? ` (rounds played ${s.recent.rangeLabel})` : ''}: greens ${greens}/5, fairways ${fairways}/5. ` +
      `Pace of play, buggy rules and tips.`
    : `Played ${course.name} in ${course.town}, Algarve? Share how the course was playing — greens, fairways, pace of play — and help other golfers plan their trip.`

  const base = `${SITE_URL}/courses/${slug}/reviews`
  const canonicalUrl = !season && page > 1 ? `${base}?page=${page}` : base

  const heroPhoto = course.photos?.find(p => p.is_hero)
  const ogImages = heroPhoto ? [{ url: heroPhoto.url, width: 1400, height: 600, alt: `${course.name} golf course, Algarve` }] : []

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: { title, description, url: canonicalUrl, siteName: 'Algarve Golf Map', locale: 'en_GB', type: 'website', images: ogImages },
    twitter: { card: 'summary_large_image', title, description, images: ogImages.map(i => i.url) },
  }
}

export default async function CourseReviewsPage(
  { params, searchParams }: { params: Promise<{ slug: string }>; searchParams: SearchParams }
) {
  const { slug } = await params
  const { page, season } = parseParams(await searchParams)
  const course = await getCourseBySlug(slug)
  if (!course) notFound()

  const [allReviews, nearby] = await Promise.all([
    getApprovedReviews(course.id),
    getCoursesNear(course.lat, course.lng, course.id, 5),
  ])
  const reviews = sortReviews(allReviews)
  const s = summarizeReviews(reviews)

  const filtered = season ? reviews.filter(r => seasonOf(r.played_month) === season) : reviews
  const totalPages = Math.max(1, Math.ceil(filtered.length / REVIEWS_PER_PAGE))
  if (page > totalPages) notFound()
  const pageReviews = filtered.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE)

  const seasonsPresent = (Object.keys(SEASON_LABELS) as Season[]).filter(se => reviews.some(r => seasonOf(r.played_month) === se))

  const pageUrl = `${SITE_URL}/courses/${slug}/reviews`
  const coursePageUrl = `${SITE_URL}/courses/${slug}`
  const writeHref = `/courses/${slug}/reviews/write`
  const townPath = townSlug(course.town)
  const hasReviews = s.count > 0
  const pageHref = (p: number) => {
    const q = new URLSearchParams()
    if (season) q.set('season', season)
    if (p > 1) q.set('page', String(p))
    const qs = q.toString()
    return `/courses/${slug}/reviews${qs ? `?${qs}` : ''}`
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Golf Courses in the Algarve', item: `${SITE_URL}/#courses` },
      { '@type': 'ListItem', position: 3, name: course.name, item: coursePageUrl },
      { '@type': 'ListItem', position: 4, name: 'Reviews', item: pageUrl },
    ],
  }

  const reviewsLd = s.count >= MIN_REVIEWS_TO_INDEX && s.overall != null ? {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': pageUrl,
    url: pageUrl,
    name: `${course.name} Reviews`,
    ...(s.lastApprovedAt && { dateModified: s.lastApprovedAt }),
    mainEntity: {
      '@type': ['GolfCourse', 'SportsActivityLocation'],
      '@id': `${coursePageUrl}#course`,
      name: course.name,
      url: coursePageUrl,
      address: { '@type': 'PostalAddress', addressLocality: course.town, addressRegion: 'Algarve', addressCountry: 'PT' },
      geo: { '@type': 'GeoCoordinates', latitude: course.lat, longitude: course.lng },
      ...(course.photos?.find(p => p.is_hero) && { image: course.photos.find(p => p.is_hero)!.url }),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: s.overall,
        reviewCount: s.count,
        bestRating: 5,
        worstRating: 1,
      },
      review: pageReviews.map(r => ({
        '@type': 'Review',
        name: r.title,
        reviewBody: r.body,
        datePublished: (r.approved_at ?? r.created_at).slice(0, 10),
        author: { '@type': 'Person', name: r.reviewer_name },
        reviewRating: { '@type': 'Rating', ratingValue: r.rating_overall, bestRating: 5, worstRating: 1 },
      })),
    },
  } : null

  return (
    <>
      <PageViewTracker page="reviews" slug={slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/<\//g, '<\\/') }} />
      {reviewsLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsLd).replace(/<\//g, '<\\/') }} />
      )}

      <div style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: 'var(--font-body)' }}>
        <SiteHeader showBackToMap />

        {/* Hero */}
        <div style={{ position: 'relative', height: 280, background: '#d4e6c3', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.photos?.find(p => p.is_hero)?.url ?? PEXELS_FALLBACK}
            alt={`${course.name} golf course, Algarve`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.7) 0%, rgba(0,0,0,.12) 60%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '26px 24px 22px', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)', marginBottom: 8 }}>
              Golfer reviews
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.15 }}>
              {course.name} Reviews
            </h1>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,.88)', marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {hasReviews && s.overall != null ? (
                <>
                  <ReviewStars value={s.overall} size={17} />
                  <span><strong style={{ color: '#fff' }}>{s.overall}</strong>/5 · {s.count} review{s.count === 1 ? '' : 's'}</span>
                </>
              ) : (
                <span>{course.town}, Algarve · {course.holes} holes{course.par != null ? `, par ${course.par}` : ''}</span>
              )}
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ maxWidth: 760, margin: '0 auto', padding: '14px 16px 0' }}>
          <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#6a6a6a' }}>
            <li><Link href="/" style={crumb}>Home</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/#courses" style={crumb}>Golf Courses in the Algarve</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href={`/courses/${slug}`} style={crumb}>{course.name}</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>Reviews</li>
          </ol>
        </nav>

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '8px 16px 80px' }}>

          {hasReviews && s.overall != null ? (
            <>
              {/* Summary */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: '20px 22px', margin: '22px 0 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 44, fontWeight: 800, color: '#222', lineHeight: 1 }}>{s.overall}</span>
                  <div>
                    <ReviewStars value={s.overall} size={18} />
                    <div style={{ fontSize: 13.5, color: '#6a6a6a', marginTop: 4 }}>
                      Based on {s.count} review{s.count === 1 ? '' : 's'}
                      {s.recommendPct != null && <> · <strong style={{ color: '#22a06b' }}>{s.recommendPct}%</strong> would recommend</>}
                    </div>
                  </div>
                </div>
                <Link href={writeHref} style={ctaBtn}><PenLine size={16} strokeWidth={2} /> Write a review</Link>
              </div>

              {/* Current condition */}
              <section style={{ margin: '28px 0' }}>
                <h2 style={sectionTitle}>Current course condition</h2>
                {s.recent ? (
                  <p style={muted}>
                    Based on {s.recent.count} round{s.recent.count === 1 ? '' : 's'} played {s.recent.rangeLabel}.
                  </p>
                ) : (
                  <p style={muted}>
                    No rounds reported in the last {RECENT_MONTHS} months — these are the all-time condition ratings. Played recently?{' '}
                    <Link href={writeHref} style={link}>Tell other golfers how it was</Link>.
                  </p>
                )}
                <RatingBars items={s.recent?.condition ?? s.condition} />

                {(s.topFlags.length > 0 || s.buggyRule || s.roundTime) && (
                  <ul style={{ fontSize: 14.5, lineHeight: 1.7, color: '#333', margin: '16px 0 0', paddingLeft: 20 }}>
                    {s.topFlags.map(f => (
                      <li key={f.flag}>
                        {f.label} — reported by {f.count} golfer{f.count === 1 ? '' : 's'}{s.recent ? ' recently' : ''}
                      </li>
                    ))}
                    {s.buggyRule && (
                      <li>Most reported buggy rule: <strong>{BUGGY_RULE_LABELS[s.buggyRule.value]}</strong></li>
                    )}
                    {s.roundTime && (
                      <li>Typical round time: <strong>{ROUND_TIME_LABELS[s.roundTime.value].toLowerCase()}</strong></li>
                    )}
                  </ul>
                )}
              </section>

              {/* How it plays for different handicaps */}
              {s.difficultyByBand.length > 0 && (
                <section style={{ margin: '28px 0' }}>
                  <h2 style={sectionTitle}>How {course.name} plays for your handicap</h2>
                  <ul style={{ fontSize: 14.5, lineHeight: 1.7, color: '#333', margin: 0, paddingLeft: 20 }}>
                    {s.difficultyByBand.map(b => (
                      <li key={b.label}>
                        <strong>{b.label}:</strong> {DIFFICULTY_LABELS[b.answer].toLowerCase()} — {b.answerCount} of {b.count} golfer{b.count === 1 ? '' : 's'}
                      </li>
                    ))}
                  </ul>
                  {course.slope_rating != null && (
                    <p style={{ ...muted, margin: '10px 0 0' }}>Official slope rating: {course.slope_rating} (113 is average).</p>
                  )}
                </section>
              )}

              {/* Ratings breakdown */}
              {s.experience.some(e => e.average != null) && (
                <section style={{ margin: '28px 0' }}>
                  <h2 style={sectionTitle}>Ratings breakdown</h2>
                  <RatingBars items={s.experience.filter(e => e.average != null)} />
                </section>
              )}

              {/* Course club hire */}
              {s.clubHire && s.clubHire.average != null && (
                <section style={{ margin: '28px 0' }}>
                  <h2 style={sectionTitle}>Club hire at {course.name}</h2>
                  <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#333', margin: 0 }}>
                    {s.clubHire.count} golfer{s.clubHire.count === 1 ? '' : 's'} hired clubs from the course and rated them{' '}
                    <strong>{s.clubHire.average}/5</strong>
                    {course.rental_price_per_round != null && <> (from €{course.rental_price_per_round} per round)</>}.
                    {' '}Flying in without clubs? Compare options in our <Link href="/club-rental" style={link}>golf club rental guide</Link>.
                  </p>
                </section>
              )}

              {/* Reviews list */}
              <section style={{ margin: '28px 0' }} id="reviews">
                <h2 style={sectionTitle}>What golfers say about {course.name}</h2>

                {seasonsPresent.length > 1 && (
                  <nav aria-label="Filter by season" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                    <Link href={`/courses/${slug}/reviews`} style={chip(!season)}>All seasons</Link>
                    {seasonsPresent.map(se => (
                      <Link key={se} href={`/courses/${slug}/reviews?season=${se}`} rel="nofollow" style={chip(season === se)}>
                        {SEASON_LABELS[se]}
                      </Link>
                    ))}
                  </nav>
                )}

                {pageReviews.length === 0 ? (
                  <p style={muted}>No reviews from rounds played in this season yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {pageReviews.map(r => <ReviewCard key={r.id} review={r} />)}
                  </div>
                )}

                {totalPages > 1 && (
                  <nav aria-label="Pagination" style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20, flexWrap: 'wrap' }}>
                    {page > 1 && <Link href={pageHref(page - 1)} style={chip(false)}>← Newer</Link>}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <Link key={p} href={pageHref(p)} aria-current={p === page ? 'page' : undefined} style={chip(p === page)}>{p}</Link>
                    ))}
                    {page < totalPages && <Link href={pageHref(page + 1)} style={chip(false)}>Older →</Link>}
                  </nav>
                )}
              </section>
            </>
          ) : (
            /* Empty state — our own course data only, no external reviews */
            <section style={{ margin: '28px 0' }}>
              <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: '28px 22px', textAlign: 'center' }}>
                <h2 style={{ fontSize: 21, fontWeight: 800, color: '#222', margin: '0 0 8px' }}>No reviews yet</h2>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: '#555', margin: '0 auto 20px', maxWidth: 480 }}>
                  Played {course.name} recently? Be the first to tell other golfers how the course was playing — greens,
                  fairways, pace of play and buggy rules.
                </p>
                <Link href={writeHref} style={{ ...ctaBtn, display: 'inline-flex' }}><PenLine size={16} strokeWidth={2} /> Be the first to review</Link>
              </div>

              <h2 style={{ ...sectionTitle, marginTop: 32 }}>{course.name} at a glance</h2>
              <ul style={{ fontSize: 15, lineHeight: 1.8, color: '#333', margin: 0, paddingLeft: 20 }}>
                <li>{course.holes} holes{course.par != null && `, par ${course.par}`}{course.length_meters != null && `, ${course.length_meters.toLocaleString('en-GB')} m`} in {course.town}</li>
                {course.slope_rating != null && course.difficulty && (
                  <li>Slope rating {course.slope_rating} — {course.difficulty} for the average golfer</li>
                )}
                {course.handicap_required_men != null && (
                  <li>Maximum handicap: men {course.handicap_required_men}{course.handicap_required_ladies != null && `, ladies ${course.handicap_required_ladies}`}</li>
                )}
                {course.price_from != null && (
                  <li>Green fees from €{course.price_from} — <Link href={`/courses/${slug}/green-fees`} style={link}>see prices by month</Link></li>
                )}
                {course.designer && <li>Designed by {course.designer}{course.year_opened && `, opened ${course.year_opened}`}</li>}
              </ul>
            </section>
          )}

          {/* Nearby courses */}
          {nearby.length > 0 && (
            <section style={{ margin: '28px 0' }}>
              <h2 style={sectionTitle}>Reviews of nearby courses</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {nearby.map(n => (
                  <Link key={n.id} href={`/courses/${n.slug}/reviews`} style={compareRow}>
                    <span style={compareName}>{n.name}</span>
                    <span style={compareMeta}>
                      {n.review_count > 0 && n.rating != null
                        ? <><strong style={{ color: '#222' }}>{n.rating}</strong>/5 · {n.review_count} review{n.review_count === 1 ? '' : 's'} · </>
                        : null}
                      {n.distanceKm} km
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Cross-links */}
          <div style={{ fontSize: 14.5, lineHeight: 1.7, color: '#444', borderTop: '1px solid #ebebeb', paddingTop: 20 }}>
            <p style={{ margin: 0 }}>
              For the layout, facilities, nearby hotels and how to get there, see the full{' '}
              <Link href={`/courses/${slug}`} style={link}>{course.name} course guide</Link>
              {course.price_from != null && <>, or check <Link href={`/courses/${slug}/green-fees`} style={link}>{course.name} green fees</Link></>}.
              {townPath && <> More options nearby are on the <Link href={`/${townPath}/golf-courses`} style={link}>{course.town} golf courses</Link> page.</>}
            </p>
            {hasReviews && (
              <p style={{ margin: '12px 0 0', fontSize: 12.5, color: '#8a8a8a' }}>
                Reviews are written by golfers and checked by Algarve Golf Map before publishing. Each reviewer confirms their email address.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function RatingBars({ items }: { items: RatingAverage[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map(i => (
        <div key={i.key} style={{ display: 'grid', gridTemplateColumns: 'minmax(110px, 170px) 1fr 36px', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 14, color: '#333' }}>{i.label}</span>
          <span style={{ height: 8, borderRadius: 4, background: '#ececec', overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', width: `${((i.average ?? 0) / 5) * 100}%`, background: '#2B6090', borderRadius: 4 }} />
          </span>
          <strong style={{ fontSize: 14, color: '#222', textAlign: 'right' }}>{i.average ?? '—'}</strong>
        </div>
      ))}
    </div>
  )
}

const crumb = { color: '#6a6a6a', textDecoration: 'none' } as const
const link = { color: '#2B6090', textDecoration: 'none', fontWeight: 500 } as const
const muted: React.CSSProperties = { fontSize: 14, lineHeight: 1.6, color: '#6a6a6a', margin: '0 0 14px' }

const sectionTitle: React.CSSProperties = {
  fontSize: 18, fontWeight: 700, color: '#222',
  margin: '0 0 16px', paddingBottom: 10,
  borderBottom: '2px solid #ebebeb',
}

const ctaBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '12px 20px', borderRadius: 12, background: '#2B6090', color: '#fff',
  fontSize: 15, fontWeight: 700, textDecoration: 'none',
}

function chip(active: boolean): React.CSSProperties {
  return {
    padding: '7px 13px', borderRadius: 18, fontSize: 13, fontWeight: 500, textDecoration: 'none',
    border: `1.5px solid ${active ? '#2B6090' : '#dcdcdc'}`,
    background: active ? '#eaf1f8' : '#fff', color: active ? '#2B6090' : '#333',
  }
}

const compareRow: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '12px 16px', borderRadius: 12, border: '1px solid #ebebeb',
  background: '#fff', textDecoration: 'none', gap: 12,
}
const compareName: React.CSSProperties = {
  fontSize: 14, fontWeight: 700, color: '#222',
  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
}
const compareMeta: React.CSSProperties = { flexShrink: 0, fontSize: 13, color: '#6a6a6a' }
