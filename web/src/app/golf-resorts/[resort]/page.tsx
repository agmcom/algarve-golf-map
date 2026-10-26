import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { withSiteName, pickTitle } from '@/lib/seo'
import { getCourses, getHotelBySlug, getAirports, getCourseSlugsWithGreenFees } from '@/lib/queries'
import { faroDistance, formatDriveTime } from '@/lib/distance'
import { handicapRule } from '@/lib/handicap'
import type { Course, Hotel } from '@/types/database'
import { RESORT_PAGES } from '@/lib/resorts'
import { TownMapClient } from '@/components/TownMapClient'

const BASE = 'https://www.algarvegolfmap.com'

const PEXELS_FALLBACK =
  'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop'

function heroUrl(course: { photos?: { url: string; is_hero?: boolean }[] }): string {
  return (
    course.photos?.find(p => p.is_hero)?.url ??
    course.photos?.[0]?.url ??
    PEXELS_FALLBACK
  )
}

// Avoid doubled names like "Pine Cliffs Resort Golf Resort" or "NAU Morgado Golf & Country Club Golf Resort".
function resortFullName(resort: { label: string }): string {
  const label = resort.label.toLowerCase()
  return label.endsWith('resort') || label.includes('golf')
    ? resort.label
    : `${resort.label} Golf Resort`
}

const META_DESCRIPTION_MAX = 155

function metaDescription(text: string): string {
  if (text.length <= META_DESCRIPTION_MAX) return text

  const firstSentenceEnd = text.indexOf('. ')
  if (firstSentenceEnd !== -1 && firstSentenceEnd + 1 <= META_DESCRIPTION_MAX) {
    return text.slice(0, firstSentenceEnd + 1)
  }

  const truncated = text.slice(0, META_DESCRIPTION_MAX)
  return `${truncated.slice(0, truncated.lastIndexOf(' '))}…`
}

export const revalidate = 3600

export async function generateStaticParams() {
  return RESORT_PAGES.map(r => ({ resort: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ resort: string }>
}): Promise<Metadata> {
  const { resort: slug } = await params
  const resort = RESORT_PAGES.find(r => r.slug === slug)
  if (!resort) return {}

  const title = pickTitle([
    `${resortFullName(resort)}: Hotels, Courses & Prices`,
    `${resortFullName(resort)}: Hotels & Courses`,
    resortFullName(resort),
  ])
  const url = `${BASE}/golf-resorts/${slug}`
  const description = metaDescription(resort.description)

  const allCourses = await getCourses()
  const firstCourse = resort.courseSlugs
    .map(s => allCourses.find(c => c.slug === s))
    .find(c => c?.photos?.length)
  const image = firstCourse ? heroUrl(firstCourse) : null
  const images = image ? [{ url: image, alt: `${title} — ${firstCourse!.name}` }] : [{ url: '/og-default.jpg' }]

  return {
    title: withSiteName(title),
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Algarve Golf Map', locale: 'en_GB',
      type: 'website',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map(i => i.url),
    },
  }
}

export default async function ResortPage({
  params,
}: {
  params: Promise<{ resort: string }>
}) {
  const { resort: slug } = await params
  const resort = RESORT_PAGES.find(r => r.slug === slug)
  if (!resort) notFound()

  const [allCourses, hotelResults, airports, greenFeeSlugs] = await Promise.all([
    getCourses(),
    Promise.all(resort.hotelSlugs.map(s => getHotelBySlug(s))),
    getAirports(),
    getCourseSlugsWithGreenFees(),
  ])
  const hotels = hotelResults.filter((h): h is Hotel => h != null)
  const courses = resort.courseSlugs
    .map(s => allCourses.find(c => c.slug === s))
    .filter((c): c is Course => c != null)
  const faro = airports.find(a => a.code === 'FAO') ?? null

  if (courses.length === 0) notFound()

  const centerLat = courses.reduce((sum, c) => sum + c.lat, 0) / courses.length
  const centerLng = courses.reduce((sum, c) => sum + c.lng, 0) / courses.length
  const drive = faroDistance(centerLat, centerLng)
  const name = resortFullName(resort)
  const totalHoles = courses.reduce((sum, c) => sum + (c.holes ?? 0), 0)
  const faqs = buildFaqs(name, hotels, courses)

  const pageUrl = `${BASE}/golf-resorts/${slug}`

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Golf Resorts in the Algarve', item: `${BASE}/golf-resorts` },
      { '@type': 'ListItem', position: 3, name, item: pageUrl },
    ],
  }

  const itemListElements = [
    ...hotels.map(h => ({ name: h.name, url: `${BASE}/hotels/${h.slug}` })),
    ...courses.map(c => ({ name: c.name, url: `${BASE}/courses/${c.slug}` })),
  ].map((item, i) => ({ '@type': 'ListItem', position: i + 1, ...item }))

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: itemListElements.length,
    itemListElement: itemListElements,
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/<\//g, '<\\/') }} />

      <div style={{ position: 'relative' }}>
        <TownMapClient
          courses={courses}
          centerLat={centerLat}
          centerLng={centerLng}
          faro={faro}
        />
      </div>

      <section className="course-directory" id="resort">
        <nav aria-label="Breadcrumb" style={{ marginBottom: 8 }}>
          <ol style={{
            display: 'flex', flexWrap: 'wrap', gap: '4px 8px',
            listStyle: 'none', padding: 0, margin: 0,
            fontSize: 13, color: '#6a6a6a',
          }}>
            <li><Link href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/golf-resorts" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Golf Resorts</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>
              {resort.label}
            </li>
          </ol>
        </nav>

        <div className="course-directory__header" style={{ marginTop: 16 }}>
          <h1 className="course-directory__title">
            {/* When the hotel shares the resort's name, keep the two pages' headings distinct. */}
            {hotels.some(h => h.name === name || h.name === resort.label) ? `${name}: Golf Courses & Where to Stay` : name}
          </h1>
          <p className="course-directory__subtitle">
            {courses.length} golf {courses.length === 1 ? 'course' : 'courses'} ({totalHoles} holes)
            {` · ${hotels.length === 1 ? '1 place' : `${hotels.length} places`} to stay`}
            {` · Faro Airport ${formatDriveTime(drive.mins)}`}
          </p>
        </div>

        <p style={{ maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444', margin: '0 0 32px' }}>
          {resort.description}
        </p>

        {hotels.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={sectionTitle}>Where to stay at {name}</h2>
            <div style={{ display: 'grid', gap: 14 }}>
              {hotels.map(hotel => (
                <div key={hotel.id} style={{ border: '1.5px solid #e8e8e8', borderRadius: 14, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#222', margin: '0 0 4px' }}>
                        <Link href={`/hotels/${hotel.slug}`} style={{ color: '#222', textDecoration: 'none' }}>{hotel.name}</Link>
                      </h3>
                      <div style={{ fontSize: 13.5, color: '#6a6a6a' }}>
                        {hotel.stars ? `${'★'.repeat(hotel.stars)} · ` : ''}
                        {hotel.google_rating != null
                          ? `Google ${hotel.google_rating}/5 (${hotel.google_user_ratings_total?.toLocaleString('en-GB')} reviews)`
                          : 'On-site hotel'}
                      </div>
                    </div>
                    {hotel.price_from != null && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: '#888' }}>From</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#222' }}>€{hotel.price_from}</div>
                        <div style={{ fontSize: 11, color: '#888' }}>/night</div>
                      </div>
                    )}
                  </div>
                  {hotel.amenities.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', margin: '12px 0 0' }}>
                      {hotel.amenities.slice(0, 4).map(a => (
                        <span key={a} style={{ fontSize: 13, color: '#555' }}>
                          <span style={{ color: '#22a06b', fontWeight: 700 }}>✓</span> {a}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginTop: 14 }}>
                    {hotel.booking_url && (
                      <a
                        href={hotel.booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-hotel-click="resort_page"
                        data-hotel-name={hotel.name}
                        style={{
                          display: 'inline-block', padding: '9px 16px', borderRadius: 9,
                          background: '#2B6090', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none',
                        }}
                      >
                        Check availability →
                      </a>
                    )}
                    <Link href={`/hotels/${hotel.slug}`} style={link}>Hotel details</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section style={{ marginBottom: 36 }}>
          <h2 style={sectionTitle}>Golf courses at {name}</h2>
          <ul className="course-list">
            {courses.map(course => (
              <li key={course.id} className="course-list-item">
                <Link href={`/courses/${course.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroUrl(course)}
                    alt={`${course.name} golf course`}
                    width={80}
                    height={80}
                    loading="lazy"
                  />
                  <div className="course-list-item__body">
                    <h3 className="course-list-item__name">{course.name}</h3>
                    <span className="course-list-item__meta">
                      {course.holes} holes
                      {course.par != null && ` · Par ${course.par}`}
                      {course.designer && ` · ${course.designer}`}
                    </span>
                    {course.price_from != null && (
                      <span className="course-list-item__badges">
                        <span className="course-list-item__price">From €{course.price_from}</span>
                      </span>
                    )}
                  </div>
                </Link>
                {greenFeeSlugs.includes(course.slug) && (
                  <Link href={`/courses/${course.slug}/green-fees`} style={{ ...link, display: 'inline-block', fontSize: 13, margin: '6px 0 0' }}>
                    {course.name} green fees by month →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 24, maxWidth: 760 }}>
          <h2 style={sectionTitle}>Frequently asked questions</h2>
          {faqs.map(f => (
            <div key={f.q} style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#222', margin: '0 0 6px' }}>{f.q}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#444', margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </section>

        <p style={{ maxWidth: 760, fontSize: 14.5, lineHeight: 1.7, color: '#444', borderTop: '1px solid #ebebeb', paddingTop: 20, margin: 0 }}>
          Comparing options? See all <Link href="/golf-resorts" style={link}>golf resorts in the Algarve</Link> side by side.
        </p>
      </section>
    </>
  )
}

function joinNames(names: string[]): string {
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0] ?? ''
}

// Built only from data we hold for the resort; questions without data are left out.
function buildFaqs(name: string, hotels: Hotel[], courses: Course[]): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = []

  faqs.push({
    q: `How many golf courses does ${name} have?`,
    a: courses.length === 1
      ? `${name} has one course: ${courses[0].name}, ${courses[0].holes} holes${courses[0].par != null ? `, par ${courses[0].par}` : ''}${courses[0].designer ? `, designed by ${courses[0].designer}` : ''}.`
      : `${name} has ${courses.length} courses: ${joinNames(courses.map(c => `${c.name} (${c.holes} holes${c.par != null ? `, par ${c.par}` : ''})`))}.`,
  })

  const priced = courses.filter(c => c.price_from != null)
  if (priced.length > 0) {
    faqs.push({
      q: `How much are green fees at ${name}?`,
      a: `Visitor green fees start from ${joinNames(priced.map(c => `€${c.price_from} at ${c.name}`))}. Rates vary by month and time of day, and hotel guests may get different rates, so check when you book.`,
    })
  }

  const withHcp = courses.filter(c => c.handicap_required_men != null)
  const noHcp = courses.filter(c => handicapRule(c) === 'none')
  const noLimit = courses.filter(c => handicapRule(c) === 'required')
  if (withHcp.length + noHcp.length + noLimit.length > 0) {
    const limit = (c: Course) => `${c.handicap_required_men} for men${c.handicap_required_ladies != null ? ` and ${c.handicap_required_ladies} for ladies` : ''}`
    const sameLimit = withHcp.every(c => limit(c) === limit(withHcp[0]))
    const parts: string[] = []
    if (withHcp.length) parts.push(sameLimit
      ? `${joinNames(withHcp.map(c => c.name))} ${withHcp.length === 1 ? 'asks' : 'ask'} for a maximum handicap of ${limit(withHcp[0])}.`
      : `Maximum handicaps: ${withHcp.map(c => `${c.name} ${limit(c)}`).join('; ')}.`)
    if (noHcp.length) parts.push(`${joinNames(noHcp.map(c => c.name))} ${noHcp.length === 1 ? 'does' : 'do'} not ask for a handicap.`)
    if (noLimit.length) parts.push(`${joinNames(noLimit.map(c => c.name))} ${noLimit.length === 1 ? 'asks' : 'ask'} for a handicap but ${noLimit.length === 1 ? 'does' : 'do'} not publish a limit, so check with the club when you book.`)
    faqs.push({
      q: `Do I need a handicap to play at ${name}?`,
      a: parts.join(' '),
    })
  }

  if (hotels.length > 0) {
    faqs.push({
      q: `Where can I stay at ${name}?`,
      a: `${joinNames(hotels.map(h => `${h.name}${h.stars ? ` (${h.stars}-star${h.price_from != null ? `, from about €${h.price_from} a night` : ''})` : h.price_from != null ? ` (from about €${h.price_from} a night)` : ''}`))} ${hotels.length === 1 ? 'is' : 'are'} on the estate, so you can stay a short walk or buggy ride from the first tee.`,
    })
  }

  return faqs
}

const sectionTitle: React.CSSProperties = {
  fontSize: 18, fontWeight: 700, color: '#222',
  margin: '0 0 16px', paddingBottom: 10,
  borderBottom: '2px solid #ebebeb',
}
const link: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: '#2B6090', textDecoration: 'none' }
