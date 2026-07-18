import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCourses, getHotelBySlug, getAirports } from '@/lib/queries'
import { RESORT_PAGES } from '@/lib/resorts'
import { TownMapClient } from '@/components/TownMapClient'

const BASE = 'https://algarvegolfmap.com'

const PEXELS_FALLBACK =
  'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop'

function heroUrl(course: { photos?: { url: string; is_hero?: boolean }[] }): string {
  return (
    course.photos?.find(p => p.is_hero)?.url ??
    course.photos?.[0]?.url ??
    PEXELS_FALLBACK
  )
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

  const title = `${resort.label} Golf Resort`
  const url = `${BASE}/golf-resorts/${slug}`

  return {
    title,
    description: resort.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: resort.description,
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
      { '@type': 'ListItem', position: 3, name: `${resort.label} Golf Resort`, item: pageUrl },
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
    name: `${resort.label} Golf Resort`,
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
          <h1 className="course-directory__title">{resort.label} Golf Resort</h1>
          <p className="course-directory__subtitle">
            {courses.length} golf {courses.length === 1 ? 'course' : 'courses'}
            {hotel ? ` · ${hotel.name}` : ''}
          </p>
        </div>

        <p style={{ maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444', margin: '0 0 32px' }}>
          {resort.description}
        </p>

        {hotel && (
          <a
            href={`/hotels/${hotel.slug}`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              padding: '18px 22px', marginBottom: 32,
              border: '1.5px solid #e8e8e8', borderRadius: 16,
              textDecoration: 'none', color: 'inherit',
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                On-site hotel
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#222' }}>{hotel.name}</div>
              {hotel.stars && (
                <div style={{ marginTop: 4, display: 'flex', gap: 2 }}>
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#f4b942" stroke="none">
                      <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.8l1.2-6.6L2.5 9l6.6-.9z"/>
                    </svg>
                  ))}
                </div>
              )}
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: '#2B6090', whiteSpace: 'nowrap' }}>
              View hotel details →
            </span>
          </a>
        )}

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
                  <strong className="course-list-item__name">{course.name}</strong>
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
