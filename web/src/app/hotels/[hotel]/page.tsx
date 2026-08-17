import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getHotelBySlug, getCourses } from '@/lib/queries'
import { RESORT_PAGES, resortSlugForHotel } from '@/lib/resorts'

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

export async function generateStaticParams() {
  return RESORT_PAGES.map(r => ({ hotel: r.hotelSlug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hotel: string }>
}): Promise<Metadata> {
  const { hotel: slug } = await params
  const hotel = await getHotelBySlug(slug)
  if (!hotel) return {}

  const title = `${hotel.name} — Golf Hotel in ${hotel.town}, Algarve`
  const description = hotel.description
    ?? `${hotel.name} in ${hotel.town}, Algarve${hotel.stars ? ` — ${hotel.stars}-star` : ''} golf hotel${hotel.price_from ? `, from €${hotel.price_from}/night` : ''}.`

  const url = `${BASE}/hotels/${slug}`

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

export default async function HotelPage({
  params,
}: {
  params: Promise<{ hotel: string }>
}) {
  const { hotel: slug } = await params
  const hotel = await getHotelBySlug(slug)
  if (!hotel) notFound()

  const resort = RESORT_PAGES.find(r => r.hotelSlug === slug)
  const allCourses = resort ? await getCourses() : []
  const courses = resort ? allCourses.filter(c => resort.courseSlugs.includes(c.slug)) : []

  const hotelUrl = `${BASE}/hotels/${slug}`

  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
  ]
  if (resort) {
    breadcrumbItems.push(
      { '@type': 'ListItem', position: 2, name: 'Golf Resorts in the Algarve', item: `${BASE}/golf-resorts` },
      { '@type': 'ListItem', position: 3, name: resort.label, item: `${BASE}/golf-resorts/${resort.slug}` },
    )
  }
  breadcrumbItems.push({
    '@type': 'ListItem',
    position: breadcrumbItems.length + 1,
    name: hotel.name,
    item: hotelUrl,
  })

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  }

  const lodgingLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: hotel.name,
    description: hotel.description ?? undefined,
    url: hotelUrl,
    starRating: hotel.stars ? { '@type': 'Rating', ratingValue: hotel.stars } : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: hotel.town,
      addressRegion: 'Algarve',
      addressCountry: 'PT',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: hotel.lat,
      longitude: hotel.lng,
    },
    amenityFeature: hotel.amenities.map(a => ({ '@type': 'LocationFeatureSpecification', name: a })),
    priceRange: hotel.price_from ? `From €${hotel.price_from}` : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingLd) }}
      />

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 20px 60px' }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: 8 }}>
          <ol style={{
            display: 'flex', flexWrap: 'wrap', gap: '4px 8px',
            listStyle: 'none', padding: 0, margin: 0,
            fontSize: 13, color: '#6a6a6a',
          }}>
            <li><a href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</a></li>
            <li aria-hidden="true">›</li>
            {resort && (
              <>
                <li><a href="/golf-resorts" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Golf Resorts</a></li>
                <li aria-hidden="true">›</li>
                <li><a href={`/golf-resorts/${resort.slug}`} style={{ color: '#6a6a6a', textDecoration: 'none' }}>{resort.label}</a></li>
                <li aria-hidden="true">›</li>
              </>
            )}
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>{hotel.name}</li>
          </ol>
        </nav>

        <div style={{ marginTop: 16, marginBottom: 24 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#222', margin: '0 0 8px', lineHeight: 1.15 }}>
            {hotel.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {hotel.stars && (
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#f4b942" stroke="none">
                    <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.8l1.2-6.6L2.5 9l6.6-.9z"/>
                  </svg>
                ))}
              </div>
            )}
            <span style={{ fontSize: 14, color: '#6a6a6a' }}>{hotel.town}, Algarve</span>
          </div>
        </div>

        <div style={{ borderRadius: 16, border: '1.5px solid #e8e8e8', overflow: 'hidden', marginBottom: 32 }}>
          {hotel.price_from && (
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>From</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#222' }}>€{hotel.price_from}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>/night</div>
              </div>
            </div>
          )}
          {hotel.description && (
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#444', margin: 0 }}>
                {hotel.description}
              </p>
            </div>
          )}
          {hotel.amenities.length > 0 && (
            <div style={{ padding: '16px 22px', borderBottom: hotel.website ? '1px solid #f0f0f0' : 'none' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
                {hotel.amenities.map(a => (
                  <span key={a} style={{ fontSize: 13, color: '#555', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ color: '#22a06b', fontWeight: 700, fontSize: 14 }}>✓</span> {a}
                  </span>
                ))}
              </div>
            </div>
          )}
          {(hotel.website || hotel.booking_url) && (
            <div style={{ padding: '16px 22px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {hotel.website && (
                <a
                  href={hotel.website.includes('?') ? `${hotel.website}&utm_source=algarvegolfmap.com` : `${hotel.website}?utm_source=algarvegolfmap.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 14, fontWeight: 600, color: '#2B6090', textDecoration: 'none' }}
                >
                  Visit hotel website ↗
                </a>
              )}
              {hotel.booking_url && (
                <a
                  href={hotel.booking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 14, fontWeight: 600, color: '#2B6090', textDecoration: 'none' }}
                >
                  Check availability ↗
                </a>
              )}
            </div>
          )}
        </div>

        {courses.length > 0 && resort && (
          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#222', margin: '0 0 16px', paddingBottom: 10, borderBottom: '2px solid #ebebeb' }}>
              Golf courses at this resort
            </h2>
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
        )}
      </div>
    </>
  )
}
