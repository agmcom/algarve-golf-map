import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getShopBySlug, getAllShopSlugs, getCoursesNear } from '@/lib/queries'
import { SiteHeader } from '@/components/SiteHeader'
import { CourseNav } from '@/components/CourseNav'
import {
  MapPin, Clock, Phone, Mail, Globe,
  Languages, RefreshCw, Sliders, ParkingCircle,
  Tag, Wrench, Store, Flag, Scissors, GraduationCap, Droplets,
} from 'lucide-react'

const BASE = 'https://www.algarvegolfmap.com'
// Generic golf club display, no people and no visible branding — used only
// when a shop has no real photo of its own, so it never implies this is a
// photo of that specific shop.
const GENERIC_SHOP_FALLBACK =
  'https://images.unsplash.com/photo-1593111774642-a746f5006b7b?auto=format&fit=crop&w=1400&h=600&q=80'
const GENERIC_SHOP_ALT = 'Golf clubs on display'

type ShopWithJoins = NonNullable<Awaited<ReturnType<typeof getShopBySlug>>>

const SERVICE_META: Record<string, { icon: React.ReactNode; label: string }> = {
  repair:         { icon: <Wrench size={26} strokeWidth={1.8} />,       label: 'Club Repair' },
  custom_fitting: { icon: <Sliders size={26} strokeWidth={1.8} />,      label: 'Custom Fitting' },
  rental:         { icon: <Store size={26} strokeWidth={1.8} />,        label: 'Club Rental' },
  stringing:      { icon: <Scissors size={26} strokeWidth={1.8} />,     label: 'Restringing' },
  lessons:        { icon: <GraduationCap size={26} strokeWidth={1.8} />, label: 'Lessons' },
  club_cleaning:  { icon: <Droplets size={26} strokeWidth={1.8} />,     label: 'Club Cleaning' },
}

// A shop whose only tagged service is rental, with no on-course link, is a
// dedicated rental company (e.g. ClubsToHire, Green-Tee) rather than a
// retail/pro shop that also happens to rent clubs — worth its own copy since
// "club rental/hire" is the higher-intent search term for these businesses.
function isDedicatedRentalShop(shop: ShopWithJoins): boolean {
  return shop.offers_rental && !shop.course_id && shop.services.length === 1 && shop.services[0] === 'rental'
}

function buildMetaDescription(shop: ShopWithJoins): string {
  const MAX = 155
  const dedicatedRental = isDedicatedRentalShop(shop)
  let text = dedicatedRental
    ? `${shop.name} — golf club rental company in ${shop.town}, Algarve.`
    : `${shop.name} — golf shop in ${shop.town}, Algarve.`

  const extras: string[] = []
  if (shop.course) extras.push(`On-site at ${shop.course.name}.`)
  if (dedicatedRental) {
    if (shop.rental_pickup_location) extras.push(`Collect at ${shop.rental_pickup_location}.`)
    if (shop.delivery_to_course) extras.push('Delivers to your hotel or course.')
  } else if (shop.offers_rental) {
    extras.push('Club rental available.')
  }
  if (shop.services.includes('custom_fitting')) extras.push('Custom club fitting.')
  if (shop.brands.length) extras.push(`Stocking ${shop.brands.slice(0, 3).join(', ')}.`)

  for (const extra of extras) {
    if ((text + ' ' + extra).length > MAX) break
    text += ' ' + extra
  }

  return text
}

export async function generateStaticParams() {
  const slugs = await getAllShopSlugs()
  return slugs.map(slug => ({ shop: slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shop: string }>
}): Promise<Metadata> {
  const { shop: slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) return {}

  // Name already names the town for most on-course shops (e.g. Nevada Bob's
  // locations) — avoid repeating it in the title, which pushes past Google's
  // ~60-char safe length and reads as keyword-stuffed.
  const nameHasTown = shop.name.toLowerCase().includes(shop.town.toLowerCase())
  // Dedicated rental companies whose own name doesn't already say so (e.g.
  // "ClubsToHire" vs. "Faro Golf Club Hire") get "Golf Club Rental" spelled
  // out in the title — that's the higher-intent search term for them.
  const nameHasRentalKeyword = /rental|hire/i.test(shop.name)
  const title = nameHasTown
    ? shop.name
    : isDedicatedRentalShop(shop) && !nameHasRentalKeyword
      ? `${shop.name} – Golf Club Rental in ${shop.town}`
      : `${shop.name} – ${shop.town}`

  // Meta description is purpose-built and length-capped (~155 chars) rather
  // than reusing the full on-page body text, which is written for readers
  // and often runs longer than Google will display before truncating.
  const description = buildMetaDescription(shop)

  const url = `${BASE}/shops/${slug}`
  const image = shop.photo_url ?? GENERIC_SHOP_FALLBACK
  const imageAlt = shop.photo_url ? (shop.photo_alt ?? shop.name) : GENERIC_SHOP_ALT

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url, siteName: 'Algarve Golf Map', type: 'website',
      images: [{ url: image, width: 1400, height: 600, alt: imageAlt }],
    },
  }
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ shop: string }>
}) {
  const { shop: slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) notFound()

  const shopUrl = `${BASE}/shops/${slug}`
  const mapsUrl = shop.google_maps_url ?? `https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lng}`
  const heroImage = shop.photo_url ?? GENERIC_SHOP_FALLBACK
  const heroAlt = shop.photo_url ? (shop.photo_alt ?? `${shop.name} golf shop`) : GENERIC_SHOP_ALT

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const staticMapUrl = mapboxToken
    ? `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-s+2B6090(${shop.lng},${shop.lat})/${shop.lng},${shop.lat},14,0/700x220@2x?access_token=${mapboxToken}`
    : null

  // Not excluding the on-site course — it naturally comes back as the
  // nearest one (distance ~0) and gets its own "On-site" badge below.
  // getCoursesNear does `.neq('id', excludeId)`, and the `id` column is a
  // uuid — passing '' errors the query (silently falling back to mock data),
  // so a real-shaped but unused nil UUID is passed instead of an empty string.
  const nearbyCourses = await getCoursesNear(shop.lat, shop.lng, '00000000-0000-0000-0000-000000000000', 5)

  const knownServices = shop.services.filter(s => SERVICE_META[s])
  const extraServices = shop.services.filter(s => !SERVICE_META[s])

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Golf Shops in the Algarve', item: `${BASE}/shops` },
      { '@type': 'ListItem', position: 3, name: shop.name, item: shopUrl },
    ],
  }

  const sameAs = [shop.website, shop.instagram_url, shop.facebook_url].filter(Boolean) as string[]

  const storeLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: shop.name,
    description: shop.description ?? undefined,
    url: shopUrl,
    image: shop.photo_url ?? undefined,
    telephone: shop.phone ?? undefined,
    email: shop.email ?? undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: shop.address ?? undefined,
      addressLocality: shop.town,
      addressRegion: 'Algarve',
      addressCountry: 'PT',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: shop.lat,
      longitude: shop.lng,
    },
    brand: shop.brands.length ? shop.brands : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  }

  const sections = [
    ...(shop.description ? [{ id: 'about', label: 'About' }] : []),
    { id: 'location', label: 'Location & Hours' },
    ...(shop.brands.length ? [{ id: 'brands', label: 'Brands' }] : []),
    ...(shop.services.length ? [{ id: 'services', label: 'Services' }] : []),
    ...(shop.offers_rental ? [{ id: 'rental', label: 'Club Rental' }] : []),
    { id: 'nearby-courses', label: 'Nearby Courses' },
  ]

  const contactCard = (
    <>
      {shop.offers_rental && shop.rental_price_per_day != null && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: '#6a6a6a' }}>Club rental from</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 34, fontWeight: 800, color: '#222' }}>€{shop.rental_price_per_day}</span>
            <span style={{ fontSize: 14, color: '#6a6a6a' }}>/ day</span>
          </div>
        </div>
      )}

      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={ctaBtn('#2B6090', '#fff')}>
        Get Directions
      </a>

      {shop.website && (
        <a
          href={shop.website.includes('?') ? `${shop.website}&utm_source=algarvegolfmap.com` : `${shop.website}?utm_source=algarvegolfmap.com`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...ctaBtn('#eaf2f8', '#2B6090'), marginTop: 10 }}
        >
          Visit Website ↗
        </a>
      )}

      {shop.phone && (
        <a href={`tel:${shop.phone}`} style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 13, color: '#6a6a6a', textDecoration: 'none' }}>
          📞 {shop.phone}
        </a>
      )}
      {shop.email && (
        <a href={`mailto:${shop.email}`} style={{ display: 'block', textAlign: 'center', marginTop: 6, fontSize: 13, color: '#6a6a6a', textDecoration: 'none' }}>
          ✉️ {shop.email}
        </a>
      )}
      {(shop.instagram_url || shop.facebook_url) && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 10 }}>
          {shop.instagram_url && (
            <a href={shop.instagram_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, fontWeight: 600, color: '#2B6090', textDecoration: 'none' }}>
              Instagram ↗
            </a>
          )}
          {shop.facebook_url && (
            <a href={shop.facebook_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, fontWeight: 600, color: '#2B6090', textDecoration: 'none' }}>
              Facebook ↗
            </a>
          )}
        </div>
      )}
    </>
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeLd) }} />

      <div style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: 'var(--font-body)' }}>

        <SiteHeader showBackToMap />

        {/* Hero */}
        <div style={{ position: 'relative', height: 420, background: '#d4e6c3', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={heroAlt}
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
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {shop.course && (
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 10px',
                  borderRadius: 12, background: 'rgba(255,255,255,.2)',
                  color: '#fff', backdropFilter: 'blur(4px)',
                  letterSpacing: '.04em', textTransform: 'uppercase',
                }}>
                  On-site
                </span>
              )}
            </div>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.15 }}>
              {shop.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 15, color: 'rgba(255,255,255,.85)' }}>
                📍 {shop.town}, Algarve
              </span>
              {shop.course && (
                <a
                  href={`/courses/${shop.course.slug}`}
                  style={{
                    fontSize: 13, fontWeight: 600, color: '#fff',
                    background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(4px)',
                    padding: '4px 12px', borderRadius: 12, textDecoration: 'none',
                  }}
                >
                  On-site at {shop.course.name} →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Section nav */}
        <CourseNav sections={sections} />

        {/* Content */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>

          {/* Quick stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1, background: '#ebebeb',
            border: '1px solid #ebebeb', borderRadius: 16,
            overflow: 'hidden', margin: '28px 0',
          }}>
            {[
              { label: 'Brands',        value: shop.brands.length ? `${shop.brands.length}` : '—',                                    icon: <Tag size={15} strokeWidth={1.8} /> },
              { label: 'Services',      value: shop.services.length ? `${shop.services.length}` : '—',                                 icon: <Wrench size={15} strokeWidth={1.8} /> },
              { label: 'Club Rental',   value: shop.offers_rental ? (shop.rental_price_per_day != null ? `€${shop.rental_price_per_day}/day` : 'Yes') : 'No', icon: <Store size={15} strokeWidth={1.8} /> },
              { label: 'Nearest Course', value: nearbyCourses[0] ? `${nearbyCourses[0].distanceKm} km` : '—',                           icon: <Flag size={15} strokeWidth={1.8} /> },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{ background: '#fff', padding: '12px 12px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 5, color: '#b0b0b0' }}>
                  {icon}
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase' }}>{label}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#222', lineHeight: 1.2 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="course-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>

            {/* Left column */}
            <div>
              {/* About */}
              {shop.description && (
                <section id="about" style={{ marginBottom: 32 }}>
                  <h2 style={sectionTitle}>About</h2>
                  <p style={{ fontSize: 17, lineHeight: 1.7, color: '#333', margin: 0 }}>
                    {shop.description}
                  </p>
                </section>
              )}

              {/* Location & Hours */}
              <section id="location" style={{ marginBottom: 36 }}>
                <h2 style={sectionTitle}>Location & Hours</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: staticMapUrl ? 14 : 0 }}>
                  {shop.address && (
                    <InfoBlockRow icon={<MapPin size={15} strokeWidth={1.8} />} label={shop.address} value={
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2B6090', fontWeight: 600, textDecoration: 'none' }}>
                        Directions
                      </a>
                    } />
                  )}
                  {shop.opening_hours && (
                    <InfoBlockRow icon={<Clock size={15} strokeWidth={1.8} />} label="Opening hours" value={shop.opening_hours} />
                  )}
                  {shop.parking && (
                    <InfoBlockRow icon={<ParkingCircle size={15} strokeWidth={1.8} />} label="Parking" value={shop.parking} />
                  )}
                </div>
                {staticMapUrl && (
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', borderRadius: 14, overflow: 'hidden', border: '1px solid #ebebeb' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={staticMapUrl}
                      alt={`Map showing the location of ${shop.name}`}
                      width={700}
                      height={220}
                      loading="lazy"
                      style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
                    />
                  </a>
                )}
              </section>

              {/* Brands */}
              {shop.brands.length > 0 && (
                <section id="brands" style={{ marginBottom: 36 }}>
                  <h2 style={sectionTitle}>Brands</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {shop.brands.map(b => (
                      <span key={b} style={{
                        fontSize: 12.5, fontWeight: 600, color: '#444',
                        background: '#f4f4f4', padding: '5px 12px', borderRadius: 20,
                      }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Services */}
              {shop.services.length > 0 && (
                <section id="services" style={{ marginBottom: 36 }}>
                  <h2 style={sectionTitle}>Services</h2>

                  {knownServices.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                      {knownServices.map(s => (
                        <FacilityCard key={s} icon={SERVICE_META[s].icon} label={SERVICE_META[s].label} />
                      ))}
                    </div>
                  )}

                  {(extraServices.length > 0 || shop.fitting_technology || shop.accepts_trade_in || shop.languages_spoken.length > 0) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: knownServices.length > 0 ? 14 : 0 }}>
                      {extraServices.map(s => (
                        <InfoBlockRow key={s} icon={<Wrench size={15} strokeWidth={1.8} />} label={s.replace(/_/g, ' ')} value="" />
                      ))}
                      {shop.fitting_technology && (
                        <InfoBlockRow icon={<Sliders size={15} strokeWidth={1.8} />} label="Fitting technology" value={shop.fitting_technology} />
                      )}
                      {shop.accepts_trade_in && (
                        <InfoBlockRow icon={<RefreshCw size={15} strokeWidth={1.8} />} label="Trade-ins" value="Accepted" />
                      )}
                      {shop.languages_spoken.length > 0 && (
                        <InfoBlockRow icon={<Languages size={15} strokeWidth={1.8} />} label="Languages" value={shop.languages_spoken.join(', ')} />
                      )}
                    </div>
                  )}
                </section>
              )}

              {/* Club Rental */}
              {shop.offers_rental && (
                <section id="rental" style={{ marginBottom: 36 }}>
                  <h2 style={sectionTitle}>Club Rental</h2>

                  {shop.rental_pickup_location && (
                    <div style={{ marginBottom: 14 }}>
                      <InfoBlockRow icon={<MapPin size={15} strokeWidth={1.8} />} label="Collect at" value={shop.rental_pickup_location} />
                    </div>
                  )}

                  <div style={{
                    padding: '18px 20px', borderRadius: 14,
                    border: '1px solid #ebebeb', background: '#fff',
                  }}>
                    <p style={{ fontSize: 15, color: '#333', margin: 0, lineHeight: 1.6 }}>
                      Club rental available
                      {shop.rental_price_per_day != null && <> from <strong>€{shop.rental_price_per_day}</strong> / day</>}
                      {shop.delivery_to_course && ' · delivery to your course'}
                    </p>
                    {shop.rental_set_types.length > 0 && (
                      <p style={{ fontSize: 13, color: '#6a6a6a', margin: '8px 0 0' }}>
                        Set types: {shop.rental_set_types.map(t => t.replace(/_/g, ' ')).join(', ')}
                      </p>
                    )}
                    {shop.rental_price_notes && (
                      <p style={{ fontSize: 13, color: '#6a6a6a', margin: '8px 0 0' }}>
                        {shop.rental_price_notes}
                      </p>
                    )}
                  </div>

                  {shop.rental_delivery_areas.length > 0 && (
                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#6a6a6a', marginBottom: 8 }}>Delivers to</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {shop.rental_delivery_areas.map(area => (
                          <span key={area} style={{
                            fontSize: 12.5, fontWeight: 600, color: '#444',
                            background: '#f4f4f4', padding: '5px 12px', borderRadius: 20,
                          }}>
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Prices & Contact — mobile only (desktop shows in right column) */}
              <section className="course-booking-mobile" id="contact-mobile" style={{ marginBottom: 36 }}>
                <h2 style={sectionTitle}>Visit This Shop</h2>
                {contactCard}
              </section>

              {/* Nearby Courses */}
              {nearbyCourses.length > 0 && (
                <section id="nearby-courses" style={{ marginBottom: 36 }}>
                  <h2 style={sectionTitle}>Nearby Courses</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {nearbyCourses.map(n => {
                      const isOnsite = n.id === shop.course_id
                      return (
                        <a key={n.id} href={`/courses/${n.slug}`} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '14px 16px', borderRadius: 14,
                          border: '1px solid #ebebeb', background: '#fff',
                          textDecoration: 'none', gap: 12,
                        }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                ⛳ {n.name}
                              </span>
                              {isOnsite && (
                                <span style={{
                                  fontSize: 10, fontWeight: 700, color: '#22a06b',
                                  background: '#edf7f2', border: '1px solid #b8e8d0',
                                  borderRadius: 6, padding: '1px 6px',
                                  letterSpacing: '.02em', flexShrink: 0, whiteSpace: 'nowrap',
                                }}>
                                  On-site
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 12, color: '#6a6a6a', marginTop: 3 }}>
                              {n.town} · {n.holes} holes{n.par != null && ` · par ${n.par}`}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#222' }}>{n.distanceKm} km away</div>
                            {n.price_from != null && (
                              <div style={{ fontSize: 12, color: '#6a6a6a' }}>from €{n.price_from}</div>
                            )}
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Right column — sticky contact card (desktop only) */}
            <div className="course-booking-desktop" style={{ position: 'sticky', top: 76 }}>
              <div style={{
                background: '#fff', border: '1px solid #ebebeb',
                borderRadius: 20, padding: '24px 22px',
                boxShadow: '0 4px 24px rgba(0,0,0,.08)',
              }}>
                {contactCard}
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

function ctaBtn(bg: string, color: string): React.CSSProperties {
  return {
    display: 'block', textAlign: 'center',
    padding: '14px 0', borderRadius: 12,
    background: bg, color,
    fontSize: 15, fontWeight: 700,
    textDecoration: 'none', cursor: 'pointer',
  }
}

function InfoBlockRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', borderRadius: 12,
      border: '1px solid #ebebeb', background: '#fff', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#222',
        }}>
          {icon}
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#222', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </span>
      </div>
      {value !== '' && (
        <span style={{ fontSize: 13, color: '#6a6a6a', textAlign: 'right', flexShrink: 0 }}>{value}</span>
      )}
    </div>
  )
}

function FacilityCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 8, padding: '16px 8px', borderRadius: 14,
      border: '1.5px solid #e8e8e8',
      background: '#fff',
      textAlign: 'center',
    }}>
      <div style={{ color: '#222' }}>{icon}</div>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#222', lineHeight: 1.3 }}>
        {label}
      </span>
    </div>
  )
}
