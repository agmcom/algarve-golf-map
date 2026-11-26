import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CourseStatusNotice } from '@/components/CourseStatusNotice'
import { getCourseStatus } from '@/data/course-status'
import { getCourseBySlug, getCoursesNear } from '@/lib/queries'
import { pickTitle, pickDescription, withSiteName } from '@/lib/seo'
import { withUtm } from '@/lib/utm'
import { PRACTICE_GROUNDS, PRACTICE_LAST_CHECKED_LABEL, getPracticeGround, practicePageHref, type PracticeGround } from '@/data/practice'
import { MOCK_COURSES } from '@/data/courses'
import { getAcademy } from '@/data/academies'
import { PageViewTracker } from '@/components/PageViewTracker'
import { SiteHeader } from '@/components/SiteHeader'
import { ShareButtons } from '@/components/ShareButtons'
import type { Course } from '@/types/database'

const SITE_URL = 'https://www.algarvegolfmap.com'
const PEXELS_FALLBACK = 'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop'

export const revalidate = 86400

/** Only practice grounds with enough published detail get a page, on one course per ground. */
export async function generateStaticParams() {
  return PRACTICE_GROUNDS.filter(g => g.pageCourse).map(g => ({ slug: g.pageCourse! }))
}

const COURSE_NAME: Record<string, string> = Object.fromEntries(MOCK_COURSES.map(c => [c.slug, c.name]))

/** Name used in headings: the ground's name when several courses share it, else the course name. */
const placeName = (g: PracticeGround, course: Course) => (g.courses.length > 1 ? g.name : course.name)

const item = (g: PracticeGround, label: string) => g.items.find(i => i.label === label)?.detail

interface Faq { q: string; a: string }

function buildFaqs(place: string, g: PracticeGround): Faq[] {
  const faqs: Faq[] = []
  const range = item(g, 'Driving range') ?? item(g, 'Practice range')
  if (range) faqs.push({ q: `Is there a driving range at ${place}?`, a: `Yes. ${range}` })
  const short = item(g, 'Short game')
  if (short) faqs.push({ q: `Is there a short-game practice area at ${place}?`, a: `Yes. ${short}` })
  const putt = item(g, 'Putting')
  if (putt) faqs.push({ q: `Is there a putting green at ${place}?`, a: `Yes. ${putt}` })
  const balls = item(g, 'Balls')
  faqs.push({
    q: `How much are range balls at ${place}?`,
    a: g.balls
      ? `${g.balls.price}, according to the ${g.balls.source.label}. Prices can change, so confirm at the club.`
      : `${g.courses.length > 1 ? 'The club' : place} does not publish a price for range balls.${balls ? ` ${balls}` : ''} Ask at reception when you arrive.`,
  })
  if (g.academy) {
    const a = getAcademy(g.academy)
    if (a) faqs.push({ q: `Can I have a golf lesson at ${place}?`, a: `Yes. ${a.name} teaches at the practice ground. ${a.lessonFrom ? `Lessons start from €${a.lessonFrom.price} for ${a.lessonFrom.duration}.` : 'The club gives lesson prices on request.'}` })
  }
  return faqs
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const g = getPracticeGround(slug)
  if (!g || g.pageCourse !== slug) return {}
  const course = await getCourseBySlug(slug)
  if (!course) return {}
  const place = placeName(g, course)
  const title = pickTitle([
    `${place} Driving Range and Practice Facilities`,
    `${place} Driving Range and Practice Area`,
    `${place} Driving Range`,
  ])
  const description = pickDescription([
    `${place} driving range and practice facilities: ${g.summary.charAt(0).toLowerCase()}${g.summary.slice(1)}`,
    `${place} driving range and practice facilities: range, short-game area, putting greens and range balls, from the club's own information.`,
  ])
  const heroPhoto = course.photos?.find(p => p.is_hero)
  const ogImages = heroPhoto ? [{ url: heroPhoto.url, width: 1400, height: 600, alt: `${course.name} golf course, Algarve` }] : []
  const canonicalUrl = `${SITE_URL}/courses/${slug}/practice-facilities`
  return {
    title: withSiteName(title),
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, siteName: 'Algarve Golf Map', locale: 'en_GB', type: 'website', images: ogImages },
    twitter: { card: 'summary_large_image', title, description, images: ogImages.map(i => i.url) },
  }
}

export default async function PracticeFacilitiesPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const g = getPracticeGround(slug)
  if (!g || g.pageCourse !== slug) notFound()
  const course = await getCourseBySlug(slug)
  if (!course) notFound()
  const courseStatus = getCourseStatus(course.slug)

  const place = placeName(g, course)
  const shared = g.courses.filter(s => s !== slug)
  const academy = g.academy ? getAcademy(g.academy) : undefined
  const faqs = buildFaqs(place, g)
  const pageUrl = `${SITE_URL}/courses/${slug}/practice-facilities`
  const coursePageUrl = `${SITE_URL}/courses/${slug}`

  // Nearby practice grounds (one entry per ground).
  const near = await getCoursesNear(course.lat, course.lng, course.id, 25)
  const seen = new Set<string>([g.id])
  const nearby = near.flatMap(n => {
    const ng = getPracticeGround(n.slug)
    if (!ng || seen.has(ng.id)) return []
    seen.add(ng.id)
    return [{ course: n, ground: ng }]
  }).slice(0, 5)

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Golf Courses in the Algarve', item: `${SITE_URL}/#courses` },
      { '@type': 'ListItem', position: 3, name: course.name, item: coursePageUrl },
      { '@type': 'ListItem', position: 4, name: 'Practice facilities', item: pageUrl },
    ],
  }
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  const placeLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: `${place} driving range and practice facilities`,
    description: g.summary,
    url: pageUrl,
    containedInPlace: { '@type': 'GolfCourse', name: course.name, url: coursePageUrl },
    geo: { '@type': 'GeoCoordinates', latitude: course.lat, longitude: course.lng },
    address: { '@type': 'PostalAddress', addressLocality: course.town, addressRegion: 'Algarve', addressCountry: 'PT' },
  }

  return (
    <>
      <PageViewTracker page="practice_facilities" slug={slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/<\//g, '<\\/') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/<\//g, '<\\/') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(placeLd).replace(/<\//g, '<\\/') }} />

      <div style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: 'var(--font-body)' }}>
        <SiteHeader back={{ href: `/courses/${slug}`, label: `Back to ${course.name}`, shortLabel: 'Course' }} />

        {/* Hero */}
        <div style={{ position: 'relative', height: 300, background: '#d4e6c3', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.photos?.find(p => p.is_hero)?.url ?? PEXELS_FALLBACK}
            alt={`${course.name} golf course, Algarve`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.68) 0%, rgba(0,0,0,.12) 60%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '30px 32px 26px', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)', marginBottom: 8 }}>
              Practice facilities
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.15 }}>
              {place} driving range and practice facilities
            </h1>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,.85)', marginTop: 10 }}>
              {/algarve/i.test(course.town) ? course.town : `${course.town}, Algarve`} · range, short game and putting
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ maxWidth: 860, margin: '0 auto', padding: '14px 24px 0' }}>
          <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#6a6a6a' }}>
            <li><Link href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/#courses" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Golf Courses in the Algarve</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href={`/courses/${slug}`} style={{ color: '#6a6a6a', textDecoration: 'none' }}>{course.name}</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>Practice facilities</li>
          </ol>
        </nav>

        {courseStatus && (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '16px 24px 0' }}>
            <CourseStatusNotice status={courseStatus} compact={courseStatus.kind === 'facility' || courseStatus.kind === 'reopened'} />
          </div>
        )}

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '8px 24px 80px' }}>
          {g.notice && (
            <p style={{ fontSize: 15, lineHeight: 1.6, color: '#7A5200', background: '#FFF4DB', borderRadius: 12, padding: '10px 14px', margin: '20px 0 0' }}>
              <strong>Note:</strong> {g.notice}
            </p>
          )}

          <p style={{ fontSize: 17, lineHeight: 1.7, color: '#333', margin: '20px 0 0' }}>{g.summary}</p>
          {shared.length > 0 && (
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: '#444', margin: '12px 0 0' }}>
              These practice facilities are shared by{' '}
              {g.courses.map((s, i) => (
                <span key={s}>
                  {i > 0 && (i === g.courses.length - 1 ? ' and ' : ', ')}
                  <Link href={`/courses/${s}`} style={link}>{COURSE_NAME[s] ?? s}</Link>
                </span>
              ))}.
            </p>
          )}

          <section style={{ margin: '28px 0' }}>
            <h2 style={sectionTitle}>What there is to practise on</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {g.items.map(it => (
                <div key={it.label} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '14px 18px' }}>
                  <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#222', margin: '0 0 4px' }}>{it.label}</h3>
                  <p style={{ fontSize: 15.5, lineHeight: 1.65, color: '#444', margin: 0 }}>{it.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ margin: '28px 0' }}>
            <h2 style={sectionTitle}>Range balls and prices</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: '#333', margin: 0 }}>
              {g.balls ? (
                <>{g.balls.price}, from the <a href={withUtm(g.balls.source.url)} target="_blank" rel="noopener noreferrer nofollow" style={link}>{g.balls.source.label}</a>. Prices can change, so confirm at the club.</>
              ) : (
                <>{shared.length > 0 ? 'The club' : place} doesn&apos;t publish a price for range balls{item(g, 'Balls') ? <>. {item(g, 'Balls')}</> : '.'} Ask at reception when you arrive, or call the club{course.phone ? <> on <a href={`tel:${course.phone.replace(/\s+/g, '')}`} style={link}>{course.phone}</a></> : null}.</>
              )}
            </p>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#555', margin: '10px 0 0' }}>
              The club doesn&apos;t publish the range&apos;s opening hours, so check with reception if you plan to practise early or late in the day.
            </p>
          </section>

          {academy && (
            <section style={{ margin: '28px 0' }}>
              <h2 style={sectionTitle}>Lessons</h2>
              <Link href={`/golf-academies/${academy.slug}`} style={{ display: 'block', padding: '16px 18px', borderRadius: 14, border: '1px solid #ebebeb', background: '#fff', textDecoration: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: 16, color: '#222' }}>{academy.name}</strong>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#222' }}>
                    {academy.lessonFrom ? `Lessons from €${academy.lessonFrom.price} / ${academy.lessonFrom.duration}` : 'Price on request'}
                  </span>
                </div>
                <p style={{ fontSize: 14.5, color: '#555', margin: '8px 0 0', lineHeight: 1.6 }}>{academy.tagline}</p>
                <div style={{ marginTop: 10, fontSize: 14, fontWeight: 600, color: '#2B6090' }}>See the academy page →</div>
              </Link>
            </section>
          )}

          {nearby.length > 0 && (
            <section style={{ margin: '28px 0' }}>
              <h2 style={sectionTitle}>Other practice grounds nearby</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {nearby.map(({ course: n, ground: ng }) => (
                  <Link key={ng.id} href={practicePageHref(ng) ?? `/courses/${n.slug}#practice`} style={compareRow}>
                    <span style={compareName}>{ng.name}</span>
                    <span style={compareMeta}>{n.distanceKm} km</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section style={{ margin: '28px 0' }}>
            <h2 style={sectionTitle}>{place} practice facilities: FAQs</h2>
            {faqs.map(f => (
              <div key={f.q} style={{ marginBottom: 18 }}>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#222', margin: '0 0 6px' }}>{f.q}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#444', margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </section>

          <p style={{ fontSize: 12, color: '#8a8a8a', margin: '0 0 20px', lineHeight: 1.6 }}>
            Source:{' '}
            {g.sources.map((s, i) => (
              <span key={s.url}>
                {i > 0 && ', '}
                <a href={withUtm(s.url)} target="_blank" rel="noopener noreferrer nofollow" style={{ color: '#8a8a8a' }}>{s.label}</a>
              </span>
            ))}
            , checked {PRACTICE_LAST_CHECKED_LABEL}.
          </p>

          <div style={{ fontSize: 14.5, lineHeight: 1.7, color: '#444', borderTop: '1px solid #ebebeb', paddingTop: 20 }}>
            <p style={{ margin: 0 }}>
              For green fees, handicap rules and how to get there, see the full{' '}
              <Link href={`/courses/${slug}`} style={link}>{course.name} course guide</Link>.
            </p>
          </div>

          <div style={{ marginTop: 28, padding: '18px 22px', borderRadius: 14, background: '#fff', border: '1px solid #ebebeb' }}>
            <ShareButtons url={pageUrl} title={`${place} driving range and practice facilities — Algarve Golf Map`} label="Share this page" contentType="course" />
          </div>
        </div>
      </div>
    </>
  )
}

const link = { color: '#2B6090', textDecoration: 'none', fontWeight: 500 } as const
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
const sectionTitle: React.CSSProperties = {
  fontSize: 18, fontWeight: 700, color: '#222',
  margin: '0 0 16px', paddingBottom: 10,
  borderBottom: '2px solid #ebebeb',
}
