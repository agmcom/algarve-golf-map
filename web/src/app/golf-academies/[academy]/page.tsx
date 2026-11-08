import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCourses } from '@/lib/queries'
import { pickDescription, withSiteName, shortTown } from '@/lib/seo'
import { SiteHeader } from '@/components/SiteHeader'
import { CourseNav } from '@/components/CourseNav'
import {
  ACADEMIES, getAcademy, PRICE_STATUS_LABEL, ACADEMIES_LAST_CHECKED_LABEL,
} from '@/data/academies'
import type { Course } from '@/types/database'
import { GraduationCap, Users, Baby, Cpu, Goal } from 'lucide-react'

const BASE = 'https://www.algarvegolfmap.com'

export const revalidate = 3600

export function generateStaticParams() {
  return ACADEMIES.map(a => ({ academy: a.slug }))
}

function withUtm(url: string): string {
  if (url.includes('golfmanager.com')) return url
  const [base, hash] = url.split('#')
  const tagged = base.includes('?') ? `${base}&utm_source=algarvegolfmap.com` : `${base}?utm_source=algarvegolfmap.com`
  return hash ? `${tagged}#${hash}` : tagged
}

function heroPhoto(course?: Course) {
  return course?.photos?.find(p => p.is_hero) ?? course?.photos?.[0]
}

export async function generateMetadata({ params }: { params: Promise<{ academy: string }> }): Promise<Metadata> {
  const { academy: slug } = await params
  const academy = getAcademy(slug)
  if (!academy) return {}
  const courses = await getCourses()
  const base = courses.find(c => c.slug === academy.baseCourse)
  const town = base ? shortTown(base.town) : 'Algarve'
  const nameHasTown = academy.name.toLowerCase().includes(town.toLowerCase())
  const title = nameHasTown ? `${academy.name}: lessons and prices` : `${academy.name}, ${town}: lessons and prices`
  const priceBit = academy.lessonFrom
    ? `Lessons from €${academy.lessonFrom.price}${academy.lessonFrom.duration === 'lesson' ? '' : ` for ${academy.lessonFrom.duration}`}.`
    : 'Prices on request.'
  const description = pickDescription([
    `${academy.name} in ${town}, Algarve. ${priceBit} ${academy.tagline}`,
    `${academy.name} in ${town}, Algarve. ${priceBit}`,
  ])
  const url = `${BASE}/golf-academies/${slug}`
  const photo = heroPhoto(base)
  return {
    title: withSiteName(title.length <= 60 ? title : academy.name),
    description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url, siteName: 'Algarve Golf Map', locale: 'en_GB', type: 'website',
      images: photo ? [{ url: photo.url, width: 1400, height: 600, alt: `${base!.name} golf course` }] : ['/og-default.jpg'],
    },
  }
}

export default async function AcademyPage({ params }: { params: Promise<{ academy: string }> }) {
  const { academy: slug } = await params
  const academy = getAcademy(slug)
  if (!academy) notFound()

  const courses = await getCourses()
  const bySlug = new Map(courses.map(c => [c.slug, c]))
  const base = bySlug.get(academy.baseCourse)
  const linked = academy.courses.map(s => bySlug.get(s)).filter((c): c is Course => !!c)
  const photo = heroPhoto(base)
  const town = base ? shortTown(base.town) : 'Algarve'
  const pageUrl = `${BASE}/golf-academies/${slug}`
  const hasPrices = academy.priceGroups.length > 0
  const others = ACADEMIES.filter(a => a.slug !== slug)
    .map(a => ({ a, c: bySlug.get(a.baseCourse) }))
    .filter(x => x.c && base)
    .sort((x, y) => Math.hypot(x.c!.lat - base!.lat, x.c!.lng - base!.lng) - Math.hypot(y.c!.lat - base!.lat, y.c!.lng - base!.lng))
    .slice(0, 3)

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Golf academies in the Algarve', item: `${BASE}/golf-academies` },
      { '@type': 'ListItem', position: 3, name: academy.name, item: pageUrl },
    ],
  }
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: academy.name,
    description: academy.tagline,
    url: pageUrl,
    image: photo?.url,
    telephone: academy.contact.phone,
    email: academy.contact.email,
    sameAs: [academy.contact.website],
    address: { '@type': 'PostalAddress', addressLocality: town, addressRegion: 'Algarve', addressCountry: 'PT' },
    ...(base && { geo: { '@type': 'GeoCoordinates', latitude: base.lat, longitude: base.lng } }),
  }

  const sections = [
    { id: 'about', label: 'About' },
    { id: 'prices', label: 'Prices' },
    ...(academy.programmes.length ? [{ id: 'programmes', label: 'Programmes' }] : []),
    ...(academy.team.length ? [{ id: 'team', label: 'Team' }] : []),
    ...(academy.facilities.length || academy.technology.length ? [{ id: 'facilities', label: 'Facilities' }] : []),
    { id: 'courses', label: linked.length > 1 ? 'Courses' : 'Course' },
  ]

  const contactCard = (
    <>
      <div style={{ marginBottom: 20 }}>
        {academy.lessonFrom ? (
          <>
            <div style={{ fontSize: 12, color: '#6a6a6a' }}>Private lessons from</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 34, fontWeight: 800, color: '#222' }}>€{academy.lessonFrom.price}</span>
              <span style={{ fontSize: 14, color: '#6a6a6a' }}>/ {academy.lessonFrom.duration}</span>
            </div>
            {academy.priceStatus !== 'current' && (
              <div style={{ fontSize: 12, color: '#9a6a00', marginTop: 4 }}>{PRICE_STATUS_LABEL[academy.priceStatus]}</div>
            )}
          </>
        ) : (
          <>
            <div style={{ fontSize: 12, color: '#6a6a6a' }}>Lesson prices</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#222' }}>Price on request</div>
          </>
        )}
      </div>
      {academy.contact.booking && (
        <a href={academy.contact.booking} target="_blank" rel="noopener noreferrer" style={ctaBtn('#2B6090', '#fff')}>
          Book a lesson online ↗
        </a>
      )}
      <a href={withUtm(academy.contact.website)} target="_blank" rel="noopener noreferrer"
        style={{ ...ctaBtn(academy.contact.booking ? '#eaf2f8' : '#2B6090', academy.contact.booking ? '#2B6090' : '#fff'), marginTop: academy.contact.booking ? 10 : 0 }}>
        Visit academy website ↗
      </a>
      {academy.contact.phone && (
        <a href={`tel:${academy.contact.phone.replace(/\s/g, '')}`} style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 13, color: '#6a6a6a', textDecoration: 'none' }}>
          📞 {academy.contact.phone}
        </a>
      )}
      {academy.contact.email && (
        <a href={`mailto:${academy.contact.email}`} style={{ display: 'block', textAlign: 'center', marginTop: 6, fontSize: 13, color: '#6a6a6a', textDecoration: 'none' }}>
          ✉️ {academy.contact.email}
        </a>
      )}
    </>
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />

      <div style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: 'var(--font-body)' }}>
        <SiteHeader back={{ href: '/golf-academies', label: 'All golf academies', shortLabel: 'Academies' }} />

        {/* Hero */}
        <div style={{ position: 'relative', height: 380, background: '#3d6b4f', overflow: 'hidden' }}>
          {/* No stock photo when the course has none: a generic clubhouse could be mistaken for this one. */}
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo.url}
              alt={photo.alt ?? `${base!.name} golf course in ${town}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.7) 0%, rgba(0,0,0,.1) 60%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 24px 28px', maxWidth: 900, margin: '0 auto' }}>
            <nav aria-label="Breadcrumb" style={{ marginBottom: 10 }}>
              <Link href="/golf-academies" style={{ fontSize: 13, color: 'rgba(255,255,255,.85)', textDecoration: 'none' }}>
                ← Golf academies in the Algarve
              </Link>
            </nav>
            <h1 style={{ fontSize: 34, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.15 }}>{academy.name}</h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.9)', margin: '10px 0 0', maxWidth: 640, lineHeight: 1.5 }}>
              📍 {town}, Algarve · {academy.tagline}
            </p>
          </div>
        </div>

        <CourseNav sections={sections} />

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
          {/* Quick facts */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 1, background: '#ebebeb',
            border: '1px solid #ebebeb', borderRadius: 16, overflow: 'hidden', margin: '28px 0',
          }}>
            {[
              { label: 'Lessons from', value: academy.lessonFrom ? `€${academy.lessonFrom.price}` : 'On request', icon: <GraduationCap size={15} strokeWidth={1.8} /> },
              { label: 'Beginner course', value: academy.beginnerProgramme ? 'Yes' : '—', icon: <Users size={15} strokeWidth={1.8} /> },
              { label: 'Juniors', value: academy.juniors ? 'Yes' : '—', icon: <Baby size={15} strokeWidth={1.8} /> },
              { label: 'Courses', value: `${linked.length}`, icon: <Goal size={15} strokeWidth={1.8} /> },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{ background: '#fff', padding: '12px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 5, color: '#b0b0b0' }}>
                  {icon}
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase' }}>{label}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#222', lineHeight: 1.2 }}>{value}</div>
              </div>
            ))}
          </div>

          <div className="course-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
            <div>
              <section id="about" style={{ marginBottom: 32 }}>
                <h2 style={sectionTitle}>About the academy</h2>
                {academy.about.map((p, i) => (
                  <p key={i} style={{ fontSize: 17, lineHeight: 1.7, color: '#333', margin: '0 0 14px' }}>{p}</p>
                ))}
              </section>

              <section id="prices" style={{ marginBottom: 36 }}>
                <h2 style={sectionTitle}>Lesson prices</h2>
                {hasPrices ? (
                  <>
                    {academy.priceStatus !== 'current' && (
                      <p style={noteBox}>
                        <strong>{PRICE_STATUS_LABEL[academy.priceStatus]}.</strong>{' '}
                        {academy.priceNote ?? 'Prices may have changed, so confirm them with the academy when you book.'}
                      </p>
                    )}
                    {academy.priceGroups.map(g => (
                      <div key={g.title} style={{ marginBottom: 18 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#222', margin: '0 0 8px' }}>{g.title}</h3>
                        <div style={{ border: '1px solid #ebebeb', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
                          {g.rows.map((r, i) => (
                            <div key={r.label} style={{
                              display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 14px',
                              borderTop: i ? '1px solid #f0f0f0' : 'none', fontSize: 14,
                            }}>
                              <span style={{ color: '#444' }}>{r.label}</span>
                              <strong style={{ color: '#222', whiteSpace: 'nowrap' }}>{r.price}</strong>
                            </div>
                          ))}
                        </div>
                        {g.note && <p style={{ fontSize: 12.5, color: '#6a6a6a', margin: '6px 0 0' }}>{g.note}</p>}
                      </div>
                    ))}
                    {academy.priceStatus === 'current' && academy.priceNote && (
                      <p style={{ fontSize: 13, color: '#6a6a6a', margin: '0 0 8px' }}>{academy.priceNote}</p>
                    )}
                  </>
                ) : (
                  <p style={{ fontSize: 16, lineHeight: 1.7, color: '#333', margin: '0 0 8px' }}>
                    <strong>Price on request.</strong> {academy.name} doesn&apos;t publish its lesson prices, so contact the
                    academy for a quote{academy.contact.phone ? ` on ${academy.contact.phone}` : ''} or through its website.
                  </p>
                )}
                <p style={{ fontSize: 12.5, color: '#888', margin: '8px 0 0' }}>
                  {academy.priceSource
                    ? <>Source: <a href={academy.priceSource.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2B6090' }}>{academy.priceSource.label}</a>. </>
                    : null}
                  Checked {ACADEMIES_LAST_CHECKED_LABEL}.
                </p>
              </section>

              {academy.programmes.length > 0 && (
                <section id="programmes" style={{ marginBottom: 36 }}>
                  <h2 style={sectionTitle}>Programmes and schools</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {academy.programmes.map(p => (
                      <div key={p.name} style={card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: 15, color: '#222' }}>{p.name}</strong>
                          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#2B6090' }}>{p.price ?? 'Price on request'}</span>
                        </div>
                        <p style={{ fontSize: 14, color: '#555', margin: '6px 0 0', lineHeight: 1.6 }}>{p.detail}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {academy.team.length > 0 && (
                <section id="team" style={{ marginBottom: 36 }}>
                  <h2 style={sectionTitle}>The team</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {academy.team.map(t => (
                      <div key={t.name} style={card}>
                        <strong style={{ fontSize: 15, color: '#222' }}>{t.name}</strong>
                        <span style={{ fontSize: 13, color: '#6a6a6a' }}> · {t.role}</span>
                        {t.bio && <p style={{ fontSize: 14, color: '#555', margin: '6px 0 0', lineHeight: 1.6 }}>{t.bio}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {(academy.facilities.length > 0 || academy.technology.length > 0) && (
                <section id="facilities" style={{ marginBottom: 36 }}>
                  <h2 style={sectionTitle}>Facilities and technology</h2>
                  {academy.facilities.length > 0 && (
                    <ul style={{ margin: '0 0 14px', paddingLeft: 20, fontSize: 15, lineHeight: 1.8, color: '#333' }}>
                      {academy.facilities.map(f => <li key={f}>{f}</li>)}
                    </ul>
                  )}
                  {academy.technology.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {academy.technology.map(t => (
                        <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: '#444', background: '#f0f0f0', padding: '5px 12px', borderRadius: 20 }}>
                          <Cpu size={13} strokeWidth={1.8} /> {t}
                        </span>
                      ))}
                    </div>
                  )}
                </section>
              )}

              <section className="course-booking-mobile" id="contact-mobile" style={{ marginBottom: 36 }}>
                <h2 style={sectionTitle}>Book a lesson</h2>
                {contactCard}
              </section>

              <section id="courses" style={{ marginBottom: 36 }}>
                <h2 style={sectionTitle}>{linked.length > 1 ? 'Courses this academy serves' : 'Where the academy is'}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {linked.map(c => (
                    <Link key={c.slug} href={`/courses/${c.slug}`} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#222' }}>⛳ {c.name}</div>
                        <div style={{ fontSize: 12, color: '#6a6a6a', marginTop: 3 }}>{shortTown(c.town)} · {c.holes} holes{c.par != null && ` · par ${c.par}`}</div>
                      </div>
                      {c.price_from != null && <div style={{ fontSize: 12, color: '#6a6a6a', whiteSpace: 'nowrap' }}>green fee from €{c.price_from}</div>}
                    </Link>
                  ))}
                </div>
              </section>

              {others.length > 0 && (
                <section id="other-academies" style={{ marginBottom: 36 }}>
                  <h2 style={sectionTitle}>Other academies nearby</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {others.map(({ a, c }) => (
                      <Link key={a.slug} href={`/golf-academies/${a.slug}`} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#222' }}>{a.name}</div>
                          <div style={{ fontSize: 12, color: '#6a6a6a', marginTop: 3 }}>{shortTown(c!.town)}</div>
                        </div>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#2B6090', whiteSpace: 'nowrap' }}>
                          {a.lessonFrom ? `from €${a.lessonFrom.price}` : 'Price on request'}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <p style={{ fontSize: 14, margin: '14px 0 0' }}>
                    <Link href="/golf-academies" style={{ color: '#2B6090', fontWeight: 600 }}>See all golf academies in the Algarve →</Link>
                  </p>
                </section>
              )}
            </div>

            <div className="course-booking-desktop" style={{ position: 'sticky', top: 124 }}>
              <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: '24px 22px', boxShadow: '0 4px 24px rgba(0,0,0,.08)' }}>
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
  fontSize: 18, fontWeight: 700, color: '#222', margin: '0 0 16px', paddingBottom: 10, borderBottom: '2px solid #ebebeb',
}
const card: React.CSSProperties = {
  padding: '14px 16px', borderRadius: 14, border: '1px solid #ebebeb', background: '#fff',
}
const noteBox: React.CSSProperties = {
  fontSize: 13.5, lineHeight: 1.6, color: '#5c4500', background: '#fff8e6', border: '1px solid #f3dfa8',
  borderRadius: 10, padding: '10px 14px', margin: '0 0 16px',
}

function ctaBtn(bg: string, color: string): React.CSSProperties {
  return {
    display: 'block', textAlign: 'center', padding: '14px 0', borderRadius: 12,
    background: bg, color, fontSize: 15, fontWeight: 700, textDecoration: 'none',
  }
}
