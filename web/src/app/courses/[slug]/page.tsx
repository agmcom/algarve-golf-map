import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCourseBySlug, getAllCourseSlugs, getHotelsNear, getAirports, getCoursesNear } from '@/lib/queries'
import type { CoursePrice } from '@/types/database'
import { CourseMapImage } from '@/components/CourseMapImage'
import { CourseNav } from '@/components/CourseNav'
import { SiteHeader } from '@/components/SiteHeader'
import { Goal, ShoppingBag, UtensilsCrossed, BedDouble, User, Store, PlaneLanding, Flag, Hash, Ruler, Award, Gauge, CircleDot, GraduationCap } from 'lucide-react'

import type { Airport } from '@/types/database'

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function airportDistances(lat: number, lng: number, airports: Airport[]) {
  return airports.map(ap => {
    const straightKm = haversineKm(lat, lng, ap.lat, ap.lng)
    const roadKm     = Math.round(straightKm * ap.road_factor)
    const minutes    = Math.round((roadKm / ap.avg_speed_kmh) * 60)
    const hours      = Math.floor(minutes / 60)
    const mins       = minutes % 60
    const time       = hours > 0 ? `${hours}h ${mins > 0 ? `${mins} min` : ''}`.trim() : `${mins} min`
    return { ...ap, roadKm, time }
  })
}

const PEXELS_FALLBACK = 'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop'

// Pre-generate static pages for all courses
export async function generateStaticParams() {
  const slugs = await getAllCourseSlugs()
  return slugs.map(slug => ({ slug }))
}

const SITE_URL = 'https://algarvegolfmap.com'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) return {}

  const title = `${course.name} — Golf Course in ${course.town}, Algarve`
  const description = course.blurb
    ?? `Play ${course.name} in ${course.town}, Algarve. ${course.holes} holes, par ${course.par}${course.price_from ? `, from €${course.price_from}` : ''}. Book your tee time online.`

  const heroPhoto = course.photos?.find(p => p.is_hero)
  const ogImages = heroPhoto
    ? [{ url: heroPhoto.url, width: 1400, height: 600, alt: `${course.name} golf course in the Algarve` }]
    : []

  const canonicalUrl = `${SITE_URL}/courses/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Algarve Golf Map',
      locale: 'en_GB',
      type: 'website',
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

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const DIFFICULTY_LABEL: Record<string, string> = {
  easy:        'Easy',
  moderate:    'Moderate',
  challenging: 'Challenging',
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) notFound()

  const [hotels, airportList, nearbyCourses] = await Promise.all([
    getHotelsNear(course.lat, course.lng),
    getAirports(),
    getCoursesNear(course.lat, course.lng, course.id, 5),
  ])
  const airports = airportDistances(course.lat, course.lng, airportList).sort((a, b) => a.roadKm - b.roadKm)

  // Index prices by month for quick lookup
  const currentMonth = new Date().getMonth() + 1  // 1–12
  const pricesByMonth: Record<number, { standard?: CoursePrice; twilight?: CoursePrice }> = {}
  for (const p of course.prices) {
    if (!pricesByMonth[p.month]) pricesByMonth[p.month] = {}
    if (p.time_slot === 'standard' || p.time_slot === 'early_bird') pricesByMonth[p.month].standard = p
    else if (p.time_slot === 'twilight' || p.time_slot === 'sunset') pricesByMonth[p.month].twilight = p
  }
  const monthsWithPrices = Object.keys(pricesByMonth).map(Number).sort((a, b) => a - b)
  const hasPrices = monthsWithPrices.length > 0
  const hasTwilight = course.prices.some(p => p.time_slot === 'twilight' || p.time_slot === 'sunset')

  const facilities = [
    { label: 'Driving range',  active: course.driving_range },
    { label: 'Pro shop',       active: course.pro_shop },
    { label: 'Restaurant',     active: course.restaurant },
    { label: 'Caddie service', active: course.caddie_service },
    { label: 'Club hire',      active: course.offers_rental },
  ].filter(f => f.active)

  // JSON-LD structured data
  const heroPhotoUrl = course.photos?.find(p => p.is_hero)?.url
  const allPhotoUrls = course.photos?.map(p => p.url) ?? []

  const amenityFeatures = [
    course.driving_range  && { '@type': 'LocationFeatureSpecification', name: 'Driving Range',  value: true },
    course.putting_green  && { '@type': 'LocationFeatureSpecification', name: 'Putting Green',  value: true },
    course.golf_academy   && { '@type': 'LocationFeatureSpecification', name: 'Golf Academy',   value: true },
    course.pro_shop       && { '@type': 'LocationFeatureSpecification', name: 'Pro Shop',       value: true },
    course.restaurant     && { '@type': 'LocationFeatureSpecification', name: 'Restaurant',     value: true },
    course.caddie_service && { '@type': 'LocationFeatureSpecification', name: 'Caddie Service', value: true },
    course.offers_rental  && { '@type': 'LocationFeatureSpecification', name: 'Club Hire',      value: true },
  ].filter(Boolean)

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['GolfCourse', 'SportsActivityLocation'],
    name: course.name,
    description: course.blurb ?? `Golf course in ${course.town}, Algarve, Portugal. ${course.holes} holes, par ${course.par}.`,
    url: `${SITE_URL}/courses/${course.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: course.town,
      addressRegion: 'Algarve',
      addressCountry: 'PT',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: course.lat,
      longitude: course.lng,
    },
    ...(course.website    && { sameAs: course.website }),
    ...(course.phone      && { telephone: course.phone }),
    ...(course.price_from && { priceRange: `From €${course.price_from}` }),
    ...(heroPhotoUrl      && { image: allPhotoUrls.length > 1 ? allPhotoUrls : heroPhotoUrl }),
    ...(course.designer   && { architect: { '@type': 'Person', name: course.designer } }),
    ...(course.year_opened && { foundingDate: String(course.year_opened) }),
    numberOfHoles: course.holes,
    ...(course.par        && { courseLength: course.length_meters ? `${course.length_meters}m` : undefined }),
    ...(amenityFeatures.length > 0 && { amenityFeature: amenityFeatures }),
    ...(course.rating != null && course.review_count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: course.rating.toFixed(1),
        reviewCount: course.review_count,
        bestRating: '5',
        worstRating: '1',
      },
    }),
    currenciesAccepted: 'EUR',
    touristType: 'Golf Tourists',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: 'var(--font-body)' }}>

        <SiteHeader showBackToMap />

        {/* Hero */}
        <div style={{ position: 'relative', height: 420, background: '#d4e6c3', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.photos?.find(p => p.is_hero)?.url ?? PEXELS_FALLBACK}
            alt={course.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,.65) 0%, rgba(0,0,0,.1) 60%)',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '32px 32px 28px',
            maxWidth: 900, margin: '0 auto',
          }}>
            {/* Tags */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {course.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 10px',
                  borderRadius: 12, background: 'rgba(255,255,255,.2)',
                  color: '#fff', backdropFilter: 'blur(4px)',
                  letterSpacing: '.04em', textTransform: 'uppercase',
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.15 }}>
              {course.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 }}>
              <span style={{ fontSize: 15, color: 'rgba(255,255,255,.85)' }}>
                📍 {course.town}, Algarve
              </span>
              {course.rating != null && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#fff' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#2A6B4A">
                    <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.8l1.2-6.6L2.5 9l6.6-.9z" />
                  </svg>
                  <strong style={{ fontSize: 15, fontWeight: 700 }}>{course.rating.toFixed(2)}</strong>
                  {course.review_count > 0 && (
                    <span style={{ fontSize: 13, opacity: .75 }}>({course.review_count} reviews)</span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section nav */}
        <CourseNav sections={[
          ...(course.blurb ? [{ id: 'about', label: 'About' }] : []),
          { id: 'facilities', label: 'Facilities' },
          { id: 'getting-there', label: 'Getting There' },
          ...(course.onsite_hotel ? [{ id: 'onsite-hotel', label: 'On-site Hotel' }] : []),
          ...(course.dress_code ? [{ id: 'dress-code', label: 'Dress Code' }] : []),
          ...(course.course_map_url ? [{ id: 'course-map', label: 'Course Map' }] : []),
          { id: 'nearby-courses', label: 'Nearby Courses' },
          { id: 'nearby-hotels', label: 'Nearby Hotels' },
        ]} />

        {/* Content */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>

          {/* Quick stats */}
          {(() => {
            const hcpValue = (() => {
              const m = course.handicap_required_men
              const l = course.handicap_required_ladies
              if (m != null && l != null) return `Men ${m}  ·  Ladies ${l}`
              if (m != null) return `Men ${m}`
              if (l != null) return `Ladies ${l}`
              return null
            })()
            const stats = [
              { label: 'Holes',      value: `${course.holes}`,                                                          icon: <Flag size={15} strokeWidth={1.8} /> },
              { label: 'Par',        value: course.par != null ? `${course.par}` : '—',                                 icon: <Hash size={15} strokeWidth={1.8} /> },
              { label: 'Distance',   value: course.length_meters != null ? `${course.length_meters.toLocaleString()} m` : '—', icon: <Ruler size={15} strokeWidth={1.8} /> },
              { label: 'Max HCP',    value: hcpValue ?? '—',                                                            icon: <Award size={15} strokeWidth={1.8} /> },
              { label: 'Slope',      value: course.slope_rating != null ? `${course.slope_rating}` : '—',               icon: <Gauge size={15} strokeWidth={1.8} /> },
              { label: 'Difficulty', value: course.difficulty ? DIFFICULTY_LABEL[course.difficulty] : '—',              icon: <Gauge size={15} strokeWidth={1.8} /> },
            ]
            return (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1, background: '#ebebeb',
                border: '1px solid #ebebeb', borderRadius: 16,
                overflow: 'hidden', margin: '28px 0',
              }}>
                {stats.map(({ label, value, icon }) => (
                  <div key={label} style={{ background: '#fff', padding: '12px 12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 5, color: '#b0b0b0' }}>
                      {icon}
                      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase' }}>{label}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#222', lineHeight: 1.2 }}>{value}</div>
                  </div>
                ))}
              </div>
            )
          })()}

          {/* Two-column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>

            {/* Left column */}
            <div>
              {/* Blurb */}
              {course.blurb && (
                <section id="about" style={{ marginBottom: 32 }}>
                  <h2 style={sectionTitle}>About</h2>
                  <p style={{ fontSize: 17, lineHeight: 1.7, color: '#333', margin: 0 }}>
                    {course.blurb}
                  </p>
                </section>
              )}

              {/* Designer / year */}
              {(course.designer || course.year_opened) && (
                <p style={{ fontSize: 13, color: '#888', margin: '0 0 32px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {course.designer && <span>Designed by <strong style={{ color: '#555' }}>{course.designer}</strong></span>}
                  {course.designer && course.year_opened && <span>·</span>}
                  {course.year_opened && <span>Opened <strong style={{ color: '#555' }}>{course.year_opened}</strong></span>}
                </p>
              )}

              {/* Facilities */}
              <section id="facilities" style={{ marginBottom: 36 }}>
                <h2 style={sectionTitle}>Facilities</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[
                    { icon: <Goal size={28} strokeWidth={1.8} />,            label: 'Driving Range',  active: course.driving_range },
                    { icon: <CircleDot size={28} strokeWidth={1.8} />,       label: 'Putting Green',  active: course.putting_green },
                    { icon: <GraduationCap size={28} strokeWidth={1.8} />,   label: 'Golf Academy',   active: course.golf_academy },
                    { icon: <ShoppingBag size={28} strokeWidth={1.8} />,     label: 'Pro Shop',       active: course.pro_shop },
                    { icon: <UtensilsCrossed size={28} strokeWidth={1.8} />, label: 'Restaurant',     active: course.restaurant },
                    { icon: <BedDouble size={28} strokeWidth={1.8} />,       label: 'On-site Hotel',  active: !!course.onsite_hotel },
                    { icon: <User size={28} strokeWidth={1.8} />,            label: 'Caddie Service', active: course.caddie_service },
                    { icon: <Store size={28} strokeWidth={1.8} />,           label: 'Club Hire',      active: course.offers_rental },
                  ].sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0)).map(f => (
                    <FacilityCard key={f.label} icon={f.icon} label={f.label} active={f.active} />
                  ))}
                </div>
                {course.offers_rental && course.rental_price_per_round != null && (
                  <p style={{ fontSize: 13, color: '#444', marginTop: 10 }}>
                    Club hire from <strong>€{course.rental_price_per_round}</strong> / round
                    {course.rental_brands.length > 0 && ` · ${course.rental_brands.join(', ')}`}
                  </p>
                )}
              </section>

              {/* Getting There */}
              <section id="getting-there" style={{ marginBottom: 36 }}>
                <h2 style={sectionTitle}>Getting There</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {airports.map(ap => (
                    <div key={ap.code} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px', borderRadius: 12,
                      border: '1px solid #ebebeb', background: '#fff',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                          background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#222',
                        }}>
                          <PlaneLanding size={15} strokeWidth={1.8} />
                        </div>
                        <div>
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#222' }}>{ap.city}</span>
                          <span style={{
                            marginLeft: 7, fontSize: 10, fontWeight: 700, color: '#888',
                            background: '#f4f4f4', borderRadius: 5, padding: '1px 5px',
                            letterSpacing: '.04em',
                          }}>{ap.code}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#222' }}>{ap.roadKm} km</span>
                        <span style={{ fontSize: 13, color: '#888', marginLeft: 8 }}>{ap.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* On-site Hotel */}
              {course.onsite_hotel && (
                <section id="onsite-hotel" style={{ marginBottom: 36 }}>
                  <h2 style={sectionTitle}>On-site Hotel</h2>
                  <div style={{ borderRadius: 16, border: '1.5px solid #e8e8e8', overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{
                      padding: '20px 22px 16px',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
                    }}>
                      <div>
                        <div style={{ fontSize: 17, fontWeight: 700, color: '#222', lineHeight: 1.3 }}>
                          {course.onsite_hotel.name}
                        </div>
                        {course.onsite_hotel.stars && (
                          <div style={{ marginTop: 4, display: 'flex', gap: 2 }}>
                            {Array.from({ length: course.onsite_hotel.stars }).map((_, i) => (
                              <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#f4b942" stroke="none">
                                <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.8l1.2-6.6L2.5 9l6.6-.9z"/>
                              </svg>
                            ))}
                          </div>
                        )}
                      </div>
                      {course.onsite_hotel.price_from && (
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>From</div>
                          <div style={{ fontSize: 20, fontWeight: 700, color: '#222' }}>€{course.onsite_hotel.price_from}</div>
                          <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>/night</div>
                        </div>
                      )}
                    </div>
                    {/* Description */}
                    {course.onsite_hotel.description && (
                      <div style={{ padding: '16px 22px', borderBottom: '1px solid #f0f0f0' }}>
                        <p style={{ fontSize: 14, lineHeight: 1.65, color: '#444', margin: 0 }}>
                          {course.onsite_hotel.description}
                        </p>
                      </div>
                    )}
                    {/* Amenities */}
                    {course.onsite_hotel.amenities.length > 0 && (
                      <div style={{ padding: '14px 22px', borderBottom: course.onsite_hotel.website ? '1px solid #f0f0f0' : 'none' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px' }}>
                          {course.onsite_hotel.amenities.map(a => (
                            <span key={a} style={{ fontSize: 12.5, color: '#555', display: 'flex', alignItems: 'center', gap: 5 }}>
                              <span style={{ color: '#22a06b', fontWeight: 700, fontSize: 13 }}>✓</span> {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* CTA */}
                    {course.onsite_hotel.website && (
                      <div style={{ padding: '14px 22px' }}>
                        <a
                          href={course.onsite_hotel.website.includes('?') ? `${course.onsite_hotel.website}&utm_source=algarvegolfmap.com` : `${course.onsite_hotel.website}?utm_source=algarvegolfmap.com`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            fontSize: 13.5, fontWeight: 600, color: '#2A6B4A',
                            textDecoration: 'none',
                          }}
                        >
                          Visit hotel website ↗
                        </a>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Dress Code */}
              {course.dress_code && (
                <section id="dress-code" style={{ marginBottom: 36 }}>
                  <h2 style={sectionTitle}>Dress Code</h2>
                  <p style={{ fontSize: 17, lineHeight: 1.7, color: '#333', margin: 0 }}>
                    {course.dress_code}
                  </p>
                </section>
              )}

              {/* Course Map */}
              {course.course_map_url && (
                <section id="course-map" style={{ marginBottom: 36 }}>
                  <h2 style={sectionTitle}>Course Map</h2>
                  <CourseMapImage
                    src={course.course_map_url}
                    alt={`${course.name} course map`}
                  />
                </section>
              )}

              {/* Nearby Courses */}
              {nearbyCourses.length > 0 && (
                <section id="nearby-courses" style={{ marginBottom: 36 }}>
                  <h2 style={sectionTitle}>Nearby Courses</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {nearbyCourses.map(n => (
                      <a key={n.id} href={`/courses/${n.slug}`} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '14px 16px', borderRadius: 14,
                        border: '1px solid #ebebeb', background: '#fff',
                        textDecoration: 'none', gap: 12,
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            ⛳ {n.name}
                          </div>
                          <div style={{ fontSize: 12, color: '#6a6a6a', marginTop: 3 }}>
                            {n.town} · {n.holes} holes · par {n.par}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#222' }}>{n.distanceKm} km away</div>
                          {n.price_from != null && (
                            <div style={{ fontSize: 12, color: '#6a6a6a' }}>from €{n.price_from}</div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* Nearby Hotels */}
              {hotels.length > 0 && (
                <section id="nearby-hotels" style={{ marginBottom: 36 }}>
                  <h2 style={sectionTitle}>Nearby Hotels</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {hotels.map(hotel => (
                      <HotelCard key={hotel.id} hotel={hotel} courseTown={course.town} />
                    ))}
                  </div>
                  <a
                    href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent('hotels near ' + course.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block', textAlign: 'center', marginTop: 14,
                      padding: '12px 0', borderRadius: 12,
                      border: '1.5px solid #2A6B4A', color: '#2A6B4A',
                      fontSize: 14, fontWeight: 600, textDecoration: 'none',
                      background: '#eef7f2',
                    }}
                  >
                    Search all hotels near {course.town} →
                  </a>
                </section>
              )}

            </div>

            {/* Right column — sticky booking card */}
            <div style={{ position: 'sticky', top: 76 }}>
              <div style={{
                background: '#fff', border: '1px solid #ebebeb',
                borderRadius: 20, padding: '24px 22px',
                boxShadow: '0 4px 24px rgba(0,0,0,.08)',
              }}>
                {course.price_from != null && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, color: '#6a6a6a' }}>From</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 34, fontWeight: 800, color: '#222' }}>€{course.price_from}</span>
                      <span style={{ fontSize: 14, color: '#6a6a6a' }}>/ round</span>
                    </div>
                  </div>
                )}

                {/* Price breakdown by month */}
                {hasPrices && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ border: '1px solid #ebebeb', borderRadius: 12, overflow: 'hidden' }}>
                      {/* Header */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: hasTwilight ? '44px 1fr 1fr' : '44px 1fr',
                        padding: '7px 12px', background: '#f9f9f9',
                        borderBottom: '1px solid #ebebeb',
                      }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.05em' }}></span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'right' }}>Standard</span>
                        {hasTwilight && (
                          <span style={{ fontSize: 10, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'right' }}>Twilight</span>
                        )}
                      </div>
                      {/* One row per month that has data */}
                      {monthsWithPrices.map(m => {
                        const { standard, twilight } = pricesByMonth[m]
                        const isCurrent = m === currentMonth
                        return (
                          <div key={m} style={{
                            display: 'grid',
                            gridTemplateColumns: hasTwilight ? '44px 1fr 1fr' : '44px 1fr',
                            padding: '8px 12px',
                            borderBottom: '1px solid #f4f4f4',
                            background: isCurrent ? '#fff8f0' : '#fff',
                          }}>
                            <span style={{
                              fontSize: 12, fontWeight: isCurrent ? 700 : 500,
                              color: isCurrent ? '#2A6B4A' : '#888',
                            }}>
                              {MONTH_LABELS[m - 1]}
                            </span>
                            <span style={{
                              fontSize: 13, fontWeight: 700,
                              color: isCurrent ? '#222' : '#444',
                              textAlign: 'right',
                            }}>
                              {standard
                                ? <>€{standard.price_eur}{standard.buggy_included && <span style={{ fontSize: 10, color: '#888', fontWeight: 400 }}> incl. buggy</span>}</>
                                : '—'
                              }
                            </span>
                            {hasTwilight && (
                              <span style={{
                                fontSize: 13, fontWeight: 700,
                                color: isCurrent ? '#555' : '#aaa',
                                textAlign: 'right',
                              }}>
                                {twilight
                                  ? <>€{twilight.price_eur}{twilight.buggy_included && <span style={{ fontSize: 10, color: '#888', fontWeight: 400 }}> incl.</span>}</>
                                  : '—'
                                }
                              </span>
                            )}
                          </div>
                        )
                      })}
                      {/* Buggy add-on note */}
                      {(() => {
                        const sample = course.prices.find(p => !p.buggy_included && p.buggy_price)
                        return sample ? (
                          <div style={{ padding: '7px 12px', fontSize: 11, color: '#888', background: '#fafafa' }}>
                            + buggy €{sample.buggy_price} optional
                          </div>
                        ) : null
                      })()}
                    </div>
                    <p style={{ fontSize: 10, color: '#b0b0b0', margin: '6px 0 0', textAlign: 'right' }}>
                      Prices indicative · source: algarvegolf.net
                    </p>
                  </div>
                )}

                {course.booking_url && (
                  <a
                    href={course.booking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={ctaBtn('#2A6B4A', '#fff')}
                  >
                    Book Tee Time
                  </a>
                )}

                {course.website && (
                  <a
                    href={course.website.includes('?') ? `${course.website}&utm_source=algarvegolfmap.com` : `${course.website}?utm_source=algarvegolfmap.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...ctaBtn('#2A6B4A', '#fff'), marginTop: course.booking_url ? 10 : 0 }}
                  >
                    Official website ↗
                  </a>
                )}

                {course.phone && (
                  <a href={`tel:${course.phone}`} style={{
                    display: 'block', textAlign: 'center', marginTop: 14,
                    fontSize: 13, color: '#6a6a6a', textDecoration: 'none',
                  }}>
                    📞 {course.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


const sectionTitle: React.CSSProperties = {
  fontSize: 18, fontWeight: 700, color: '#222',
  margin: '0 0 16px', paddingBottom: 10,
  borderBottom: '2px solid #ebebeb',
}

// Replace XXXXXXXX with your Booking.com affiliate ID when ready
const BOOKING_AID = 'XXXXXXXX'

function bookingSearchUrl(town: string): string {
  const query = encodeURIComponent(`${town}, Algarve, Portugal`)
  return `https://www.booking.com/searchresults.html?ss=${query}&aid=${BOOKING_AID}`
}

function HotelCard({ hotel, courseTown }: {
  hotel: { id: string; name: string; stars: number | null; price_from: number | null; town: string; booking_url: string | null; has_golf_package: boolean; distance_km: number; google_rating?: number | null }
  courseTown: string
}) {
  const stars = hotel.stars ?? 0
  const url = hotel.booking_url
    ?? `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name + ' Algarve')}&aid=${BOOKING_AID}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 16px', borderRadius: 14,
        border: '1px solid #ebebeb', background: '#fff',
        textDecoration: 'none', gap: 12,
        transition: 'border-color .15s, box-shadow .15s',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {hotel.name}
          </span>
          {hotel.has_golf_package && (
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10,
              background: '#f4fbf6', color: '#22a06b', border: '1px solid #d4edda',
              flexShrink: 0,
            }}>
              ⛳ Golf pkg
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#f5a623' }}>{'★'.repeat(stars)}</span>
          <span style={{ fontSize: 12, color: '#6a6a6a' }}>
            {hotel.town} · {hotel.distance_km.toFixed(1)} km away
          </span>
          {hotel.google_rating != null && (
            <span style={{ fontSize: 12, color: '#6a6a6a' }}>
              · ⭐ {hotel.google_rating.toFixed(1)} <span style={{ color: '#b0b0b0' }}>Google</span>
            </span>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {hotel.price_from != null && (
          <>
            <div style={{ fontSize: 11, color: '#6a6a6a' }}>from</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#222' }}>€{hotel.price_from}</div>
            <div style={{ fontSize: 11, color: '#6a6a6a' }}>/night</div>
          </>
        )}
        <div style={{
          marginTop: 6, padding: '5px 12px', borderRadius: 8,
          background: '#2A6B4A', color: '#fff',
          fontSize: 12, fontWeight: 600,
        }}>
          See prices →
        </div>
      </div>
    </a>
  )
}

function FacilityCard({ icon, label, active }: { icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 8, padding: '16px 8px', borderRadius: 14,
      border: `1.5px solid ${active ? '#e8e8e8' : '#f0f0f0'}`,
      background: '#fff',
      opacity: active ? 1 : 0.45,
      textAlign: 'center',
    }}>
      <div style={{ color: active ? '#222' : '#ccc' }}>{icon}</div>
      <span style={{ fontSize: 12, fontWeight: 600, color: active ? '#222' : '#aaa', lineHeight: 1.3 }}>
        {label}
      </span>
    </div>
  )
}


function ctaBtn(bg: string, color: string): React.CSSProperties {
  return {
    display: 'block', textAlign: 'center',
    padding: '14px 0', borderRadius: 12,
    background: bg, color,
    fontSize: 15, fontWeight: 700,
    textDecoration: 'none', cursor: 'pointer',
  }
}
