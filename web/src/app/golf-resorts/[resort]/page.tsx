import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCourses, getHotelBySlug, getAirports } from '@/lib/queries'
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

function resortFullName(resort: { label: string }): string {
  return resort.label.toLowerCase().endsWith('golf resort')
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

  const title = resortFullName(resort)
  const url = `${BASE}/golf-resorts/${slug}`
  const description = metaDescription(resort.description)

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Algarve Golf Map',
      type: 'website',
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

  const [allCourses, hotel, airports] = await Promise.all([
    getCourses(),
    getHotelBySlug(resort.hotelSlug),
    getAirports(),
  ])
  const courses = allCourses.filter(c => resort.courseSlugs.includes(c.slug))
  const faro = airports.find(a => a.code === 'FAO') ?? null

  if (courses.length === 0) notFound()

  const centerLat = courses.reduce((sum, c) => sum + c.lat, 0) / courses.length
  const centerLng = courses.reduce((sum, c) => sum + c.lng, 0) / courses.length

  const pageUrl = `${BASE}/golf-resorts/${slug}`
  const hotelUrl = hotel ? `${BASE}/hotels/${hotel.slug}` : null

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Golf Resorts in the Algarve', item: `${BASE}/golf-resorts` },
      { '@type': 'ListItem', position: 3, name: resortFullName(resort), item: pageUrl },
    ],
  }

  const itemListElements = [
    ...(hotelUrl ? [{ '@type': 'ListItem', position: 1, name: hotel!.name, url: hotelUrl }] : []),
    ...courses.map((c, i) => ({
      '@type': 'ListItem',
      position: (hotelUrl ? 1 : 0) + i + 1,
      name: c.name,
      url: `${BASE}/courses/${c.slug}`,
    })),
  ]

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: resortFullName(resort),
    numberOfItems: itemListElements.length,
    itemListElement: itemListElements,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />

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
            <li><a href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</a></li>
            <li aria-hidden="true">›</li>
            <li><a href="/golf-resorts" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Golf Resorts</a></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>
              {resort.label}
            </li>
          </ol>
        </nav>

        <div className="course-directory__header" style={{ marginTop: 16 }}>
          <h1 className="course-directory__title">{resortFullName(resort)}</h1>
          <p className="course-directory__subtitle">
            {courses.length} golf {courses.length === 1 ? 'course' : 'courses'}
            {hotel ? ` · ${hotel.name}` : ''}
          </p>
        </div>

        <p style={{ maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444', margin: '0 0 32px' }}>
          {resort.description}
        </p>

        {hotel && (
          <>
            <h2 className="resort-section-title">Hotels in {resortFullName(resort)}</h2>
            <a href={`/hotels/${hotel.slug}`} className="resort-hotel-card">
              <div className="resort-hotel-card__icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a8a8a8" strokeWidth="1.5">
                  <path d="M3 21V8l9-5 9 5v13" strokeLinejoin="round" />
                  <path d="M9 21v-6h6v6" strokeLinejoin="round" />
                  <path d="M7 12h.01M12 12h.01M17 12h.01M7 9h.01M12 9h.01M17 9h.01" strokeLinecap="round" />
                </svg>
              </div>
              <div className="resort-hotel-card__body">
                <h3 className="resort-hotel-card__name">{hotel.name}</h3>
                <div className="resort-hotel-card__label">On-site hotel</div>
                {hotel.stars && (
                  <div className="resort-hotel-card__stars">
                    {Array.from({ length: hotel.stars }).map((_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#f4b942" stroke="none">
                        <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.8l1.2-6.6L2.5 9l6.6-.9z"/>
                      </svg>
                    ))}
                  </div>
                )}
              </div>
            </a>
          </>
        )}

        <h2 className="resort-section-title">Golf Courses in {resortFullName(resort)}</h2>
        <ul className="course-list">
          {courses.map(course => (
            <li key={course.id} className="course-list-item">
              <a href={`/courses/${course.slug}`}>
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
                    {course.difficulty && ` · ${course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}`}
                  </span>
                  {course.price_from != null && (
                    <span className="course-list-item__badges">
                      <span className="course-list-item__price">From €{course.price_from}</span>
                    </span>
                  )}
                  {course.blurb && (
                    <p className="course-list-item__blurb">{course.blurb}</p>
                  )}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
