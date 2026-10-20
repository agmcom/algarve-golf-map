import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getHotelBySlug, getCourses, getShopsNear } from '@/lib/queries'
import { RESORT_PAGES, resortForHotel } from '@/lib/resorts'
import { faroDistance, formatDriveTime, nearestCourses } from '@/lib/distance'
import type { Course, Hotel, Shop } from '@/types/database'
import { pickTitle, pickDescription, withSiteName, shortTown } from '@/lib/seo'

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
  return RESORT_PAGES.flatMap(r => r.hotelSlugs).map(hotel => ({ hotel }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hotel: string }>
}): Promise<Metadata> {
  const { hotel: slug } = await params
  const hotel = await getHotelBySlug(slug)
  if (!hotel) return {}

  const url = `${BASE}/hotels/${slug}`

  const resort = resortForHotel(slug)
  const allCourses = resort ? await getCourses() : []
  const resortCourses = (resort?.courseSlugs ?? [])
    .map(s => allCourses.find(c => c.slug === s))
    .filter(c => c != null)
  const firstCourse = resortCourses.find(c => c.photos?.length)
  const image = firstCourse ? heroUrl(firstCourse) : null
  const images = image ? [{ url: image, alt: `${hotel.name} — ${firstCourse!.name} golf course` }] : [{ url: '/og-default.jpg' }]

  const town = shortTown(hotel.town)
  // Marriott names end in ", Algarve" — drop it so titles don't read "…, Algarve, Albufeira".
  const titleName = hotel.name.replace(/, Algarve$/, '')
  const title = pickTitle([
    `${titleName}: Golf Hotel in ${town}`,
    `${titleName}, ${town}`,
    titleName,
  ])
  const courseNames = resortCourses.map(c => c.name)
  const coursesText = courseNames.length > 1
    ? `${courseNames.slice(0, -1).join(', ')} and ${courseNames[courseNames.length - 1]}`
    : courseNames[0]
  const lead = `${hotel.stars ? `${hotel.stars}-star ` : ''}golf hotel in ${town}`
  const price = hotel.price_from ? `, from €${hotel.price_from} a night` : ''
  const description = pickDescription([
    ...(coursesText ? [`${hotel.name}: ${lead} with ${coursesText} on site${price}. Prices and booking.`] : []),
    ...(coursesText ? [`${hotel.name}: ${lead} with ${coursesText} on site${price}.`] : []),
    `${hotel.name}: ${lead}${price}. Prices and booking.`,
    hotel.description ?? `${hotel.name}: ${lead}.`,
  ])

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

export default async function HotelPage({
  params,
}: {
  params: Promise<{ hotel: string }>
}) {
  const { hotel: slug } = await params
  const hotel = await getHotelBySlug(slug)
  if (!hotel) notFound()

  const resort = resortForHotel(slug)
  const [allCourses, shopsNear] = await Promise.all([getCourses(), getShopsNear(hotel.lat, hotel.lng, 20, 25)])
  const courses = resort ? allCourses.filter(c => resort.courseSlugs.includes(c.slug)) : []
  const nearby = nearestCourses(hotel.lat, hotel.lng, '', allCourses.filter(c => !courses.includes(c)), 4)
  const rentalShops = shopsNear.filter(sh => sh.offers_rental && sh.slug).slice(0, 2)
  const perks = golfPerks(hotel)
  const faro = faroDistance(hotel.lat, hotel.lng)
  const faqs = buildFaqs(hotel, courses, nearby, rentalShops)
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  // The resort page 404s when none of its courses are active, so don't link to it then.
  const resortPage = courses.length > 0 ? resort : undefined

  const hotelUrl = `${BASE}/hotels/${slug}`

  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
  ]
  if (resortPage) {
    breadcrumbItems.push(
      { '@type': 'ListItem', position: 2, name: 'Golf Resorts in the Algarve', item: `${BASE}/golf-resorts` },
      { '@type': 'ListItem', position: 3, name: resortPage.label, item: `${BASE}/golf-resorts/${resortPage.slug}` },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/<\//g, '<\\/') }} />

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 20px 60px' }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: 8 }}>
          <ol style={{
            display: 'flex', flexWrap: 'wrap', gap: '4px 8px',
            listStyle: 'none', padding: 0, margin: 0,
            fontSize: 13, color: '#6a6a6a',
          }}>
            <li><Link href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</Link></li>
            <li aria-hidden="true">›</li>
            {resortPage && (
              <>
                <li><Link href="/golf-resorts" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Golf Resorts</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link href={`/golf-resorts/${resortPage.slug}`} style={{ color: '#6a6a6a', textDecoration: 'none' }}>{resortPage.label}</Link></li>
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
            <div style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              {hotel.booking_url && (
                <a
                  href={hotel.booking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hotel-click="hotel_page"
                  data-hotel-name={hotel.name}
                  style={ctaBtn}
                >
                  Check availability →
                </a>
              )}
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
            </div>
          )}
        </div>

        {perks.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={sectionTitle}>Golf at {hotel.name}</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
              {perks.map(p => (
                <li key={p} style={{ fontSize: 14.5, color: '#333', display: 'flex', gap: 8 }}>
                  <span style={{ color: '#22a06b', fontWeight: 700 }}>✓</span> {p}
                </li>
              ))}
            </ul>
          </section>
        )}

        {resortPage && (
          <Link
            href={`/golf-resorts/${resortPage.slug}`}
            style={{
              display: 'block', padding: '16px 20px', marginBottom: 32, borderRadius: 14,
              border: '1.5px solid #e8e8e8', textDecoration: 'none', color: '#222',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#8a8a8a', marginBottom: 4 }}>
              Part of
            </div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{resortPage.label} →</div>
            <div style={{ fontSize: 13.5, color: '#6a6a6a', marginTop: 4 }}>
              {courses.length} golf {courses.length === 1 ? 'course' : 'courses'} on the estate
              {resortPage.hotelSlugs.length > 1 ? ` · ${resortPage.hotelSlugs.length} places to stay` : ''}
              {` · Faro Airport ${formatDriveTime(faro.mins)}`}
            </div>
          </Link>
        )}

        {courses.length > 0 && resort && (
          <section>
            <h2 style={sectionTitle}>
              Golf courses at this resort
            </h2>
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
                        {course.difficulty && ` · ${course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}`}
                      </span>
                      {course.price_from != null && (
                        <span className="course-list-item__badges">
                          <span className="course-list-item__price">From €{course.price_from}</span>
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {nearby.length > 0 && (
          <section style={{ marginTop: 32 }}>
            <h2 style={sectionTitle}>{courses.length > 0 ? 'More golf courses nearby' : `Golf courses near ${hotel.name}`}</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
              {nearby.map(c => (
                <li key={c.id}>
                  <Link href={`/courses/${c.slug}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 16px', border: '1px solid #ebebeb', borderRadius: 12, textDecoration: 'none', color: '#222' }}>
                    <span>
                      <span style={{ fontWeight: 700 }}>{c.name}</span>
                      <span style={{ display: 'block', fontSize: 13, color: '#6a6a6a', marginTop: 2 }}>
                        {c.holes} holes{c.par != null ? ` · Par ${c.par}` : ''}{c.price_from != null ? ` · from €${c.price_from}` : ''}
                      </span>
                    </span>
                    <span style={{ fontSize: 13, color: '#6a6a6a', whiteSpace: 'nowrap' }}>{c.distanceKm} km</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 12.5, color: '#8a8a8a', margin: '8px 0 0' }}>Distances are in a straight line from the hotel.</p>
          </section>
        )}

        <section style={{ marginTop: 32 }}>
          <h2 style={sectionTitle}>Frequently asked questions</h2>
          {faqs.map(f => (
            <div key={f.q} style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#222', margin: '0 0 6px' }}>{f.q}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#444', margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </section>

        {hotel.booking_url && (
          <div style={{ marginTop: 28, padding: '16px 20px', borderRadius: 14, background: '#f3f7fa', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#222' }}>
              Ready to book {hotel.name}?
            </div>
            <a
              href={hotel.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              data-hotel-click="hotel_page_bottom"
              data-hotel-name={hotel.name}
              style={ctaBtn}
            >
              Check availability →
            </a>
          </div>
        )}
      </div>
    </>
  )
}

const ctaBtn: React.CSSProperties = {
  display: 'inline-block', padding: '9px 16px', borderRadius: 9,
  background: '#2B6090', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none',
}

const sectionTitle: React.CSSProperties = {
  fontSize: 18, fontWeight: 700, color: '#222', margin: '0 0 16px', paddingBottom: 10, borderBottom: '2px solid #ebebeb',
}

// Only perks we have confirmed for this hotel (all false/empty until researched).
function golfPerks(hotel: Hotel): string[] {
  return [
    hotel.has_golf_package && (hotel.golf_package_desc ?? 'Golf packages available'),
    hotel.has_shuttle && (hotel.shuttle_courses.length
      ? `Shuttle to ${hotel.shuttle_courses.join(', ')}`
      : 'Shuttle to the golf courses'),
    hotel.club_storage && 'Golf bag storage',
    hotel.club_cleaning && 'Club cleaning',
    hotel.drying_room && 'Drying room for golf shoes and clothing',
    hotel.early_breakfast && 'Early breakfast for morning tee times',
    hotel.late_checkout && 'Late checkout available',
    hotel.offers_rental && 'Golf club rental',
  ].filter((p): p is string => Boolean(p))
}

function joinNames(names: string[]): string {
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0] ?? ''
}

// Built only from data we hold for the hotel; questions without data are left out.
function buildFaqs(
  hotel: Hotel,
  resortCourses: Course[],
  nearby: (Course & { distanceKm: number })[],
  rentalShops: (Shop & { distance_km: number })[],
): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = []

  if (resortCourses.length > 0) {
    faqs.push({
      q: `Does ${hotel.name} have its own golf course?`,
      a: `Yes. ${joinNames(resortCourses.map(c => `${c.name} (${c.holes} holes${c.price_from != null ? `, green fees from €${c.price_from}` : ''})`))} ${resortCourses.length === 1 ? 'is' : 'are'} on the same estate as the hotel.`,
    })
  }

  if (nearby.length > 0) {
    faqs.push({
      q: `Which ${resortCourses.length > 0 ? 'other ' : ''}golf courses are near ${hotel.name}?`,
      a: `The closest are ${joinNames(nearby.slice(0, 3).map(c => `${c.name} (about ${c.distanceKm} km)`))}, measured in a straight line from the hotel.`,
    })
  }

  if (hotel.has_golf_package || hotel.has_shuttle) {
    const parts = [
      hotel.has_golf_package && (hotel.golf_package_desc ?? 'golf packages'),
      hotel.has_shuttle && (hotel.shuttle_courses.length ? `a shuttle to ${hotel.shuttle_courses.join(', ')}` : 'a golf shuttle'),
    ].filter((p): p is string => Boolean(p))
    faqs.push({
      q: `Does ${hotel.name} offer anything extra for golfers?`,
      a: `According to the hotel: ${parts.map((p, i) => (i === 0 ? p.charAt(0).toLowerCase() + p.slice(1) : p)).join('; ')}. Check the current terms when you book.`,
    })
  }

  if (rentalShops.length > 0) {
    faqs.push({
      q: `Can I hire golf clubs near ${hotel.name}?`,
      a: `Yes. ${joinNames(rentalShops.map(sh => `${sh.name} in ${sh.town} (about ${Math.round(sh.distance_km)} km)`))} ${rentalShops.length === 1 ? 'rents' : 'rent'} golf clubs${hotel.offers_rental ? ', and the hotel can also arrange club hire' : ''}.`,
    })
  }

  if (hotel.price_from != null) {
    faqs.push({
      q: `How much does a night at ${hotel.name} cost?`,
      a: `Rooms start from about €${hotel.price_from} a night. Prices change with the season and room type, so check availability for your dates.`,
    })
  }

  return faqs
}
