import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { pickTitle, pickDescription, withSiteName } from '@/lib/seo'
import { getCourses, getAirports, getHotelsNear, getPublishedGuidePosts, getVisitorPriceRanges, type VisitorPriceRange } from '@/lib/queries'
import { TOWN_PAGES } from '@/lib/towns'
import { renderInlineText } from '@/lib/richText'
import { faroDistance, driveEstimate, haversineKm } from '@/lib/distance'
import { handicapRule } from '@/lib/handicap'
import { toHotelListItem } from '@/lib/hotels'
import { PRICE_SEASON, PRICE_LAST_CHECKED } from '@/lib/prices'
import { TownMapClient } from '@/components/TownMapClient'
import { NearbyHotels } from '@/components/NearbyHotels'
import type { Course } from '@/types/database'

const BASE = 'https://www.algarvegolfmap.com'

const PEXELS_FALLBACK =
  'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop'

// Courses outside the town that still count as "nearby", and how far hotels may sit from the town's courses.
const NEARBY_COURSE_MAX_MINS = 25
const MAX_NEARBY_COURSES = 6
const HOTEL_RADIUS_KM = 10
const SPARSE_HOTEL_RADIUS_KM = 20
const MIN_HOTELS = 5
const MAX_GUIDES = 6

function heroUrl(course: { photos?: { url: string; is_hero?: boolean }[] }): string {
  return (
    course.photos?.find(p => p.is_hero)?.url ??
    course.photos?.[0]?.url ??
    PEXELS_FALLBACK
  )
}

function joinAnd(parts: string[]): string {
  if (parts.length <= 1) return parts[0] ?? ''
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`
}

function minMaxText(values: number[], unit: string, prefix = ''): string {
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  return lo === hi ? `${prefix}${lo}${unit}` : `${prefix}${lo}–${prefix}${hi}${unit}`
}

function priceText(p: VisitorPriceRange | undefined): string {
  if (!p) return '—'
  if (p.to == null || p.to === p.from) return `€${p.from}`
  return `€${p.from}–€${p.to}`
}

function handicapText(c: Course): string {
  const rule = handicapRule(c)
  if (rule === 'limit') {
    const men = c.handicap_required_men
    const ladies = c.handicap_required_ladies
    if (men != null && ladies != null) return `Max ${men} men / ${ladies} ladies`
    return `Max ${men ?? ladies}`
  }
  if (rule === 'required') return 'Required'
  if (rule === 'none') return 'Not required'
  return '—'
}

interface Faq { q: string; a: string }

function buildFaqs(
  label: string,
  courses: Course[],
  prices: Map<string, VisitorPriceRange>,
  nearby: { course: Course; mins: number }[],
  nearbyCount: number,
): Faq[] {
  const faqs: Faq[] = []
  const n = courses.length

  // 1 — how many courses
  const listed = joinAnd(courses.map(c => `${c.name} (${c.holes} holes)`))
  const more = nearbyCount
    ? ` Another ${nearbyCount} ${nearbyCount === 1 ? 'course is' : 'courses are'} within about ${NEARBY_COURSE_MAX_MINS} minutes by car, including ${joinAnd(nearby.slice(0, 3).map(x => x.course.name))}.`
    : ''
  faqs.push({
    q: `How many golf courses are there in ${label}?`,
    a: n === 1
      ? `There is one golf course in ${label}: ${listed}.${more}`
      : `There are ${n} golf courses in ${label}: ${listed}.${more}`,
  })

  // 2 — cheapest and most expensive
  const priced = courses.filter(c => prices.has(c.id)).sort((a, b) => prices.get(a.id)!.from - prices.get(b.id)!.from)
  if (priced.length >= 2) {
    const lo = priced[0]
    const hi = priced[priced.length - 1]
    const loP = prices.get(lo.id)!
    const hiP = prices.get(hi.id)!
    faqs.push({
      q: `What is the cheapest golf course in ${label}?`,
      a: `${lo.name} has the lowest visitor green fee in ${label}, from €${loP.from} for ${lo.holes} holes in the ${PRICE_SEASON} season. The most expensive is ${hi.name}, from €${hiP.from}${hiP.to != null && hiP.to !== hiP.from ? ` and up to €${hiP.to} in its busiest months` : ''}.`,
    })
  } else if (priced.length === 1) {
    const p = prices.get(priced[0].id)!
    faqs.push({
      q: `How much does it cost to play golf in ${label}?`,
      a: `A visitor round at ${priced[0].name} costs ${priceText(p)} for ${priced[0].holes} holes in the ${PRICE_SEASON} season, depending on the month.`,
    })
  }

  // 3 — handicap
  const none = courses.filter(c => handicapRule(c) === 'none')
  const needs = courses.filter(c => ['limit', 'required'].includes(handicapRule(c)))
  if (none.length || needs.length) {
    const rules = joinAnd(needs.map(c => {
      const rule = handicapRule(c)
      if (rule === 'required') return `${c.name} (no limit published)`
      return `${c.name} (maximum ${c.handicap_required_men ?? '—'} for men, ${c.handicap_required_ladies ?? '—'} for ladies)`
    }))
    let answer: string
    if (none.length === n) {
      answer = n === 1 ? `Yes — ${none[0].name} does not require a handicap.` : `Yes — none of the ${label} courses require a handicap.`
    } else if (none.length) {
      answer = `Yes, at ${joinAnd(none.map(c => c.name))}, which ${none.length === 1 ? 'does' : 'do'} not require a handicap. The others ask for a handicap certificate: ${rules}.`
    } else if (n === 1) {
      const c = courses[0]
      answer = handicapRule(c) === 'limit'
        ? `No — ${c.name} asks for a handicap certificate, with a maximum of ${c.handicap_required_men ?? '—'} for men and ${c.handicap_required_ladies ?? '—'} for ladies.`
        : `No — ${c.name} asks for a handicap certificate, though it publishes no limit.`
    } else {
      answer = `No — every course in ${label} asks for a handicap certificate: ${rules}.`
    }
    faqs.push({ q: `Can you play golf in ${label} without a handicap?`, a: answer })
  }

  // 4 — Faro airport
  const faro = courses.map(c => faroDistance(c.lat, c.lng))
  faqs.push({
    q: `How far is ${label} from Faro Airport?`,
    a: `The ${n === 1 ? `${courses[0].name} course is` : `${label} courses are`} roughly ${minMaxText(faro.map(f => f.mins), ' minutes')} (${minMaxText(faro.map(f => f.km), ' km')}) by car from Faro Airport, the Algarve's main international airport.`,
  })

  // 5 — twilight
  const twilight = courses.filter(c => prices.get(c.id)?.twilightFrom != null)
  if (twilight.length) {
    faqs.push({
      q: `Are there cheaper twilight green fees in ${label}?`,
      a: `Yes. ${joinAnd(twilight.map(c => `${c.name} (from €${prices.get(c.id)!.twilightFrom})`))} ${twilight.length === 1 ? 'publishes' : 'publish'} a twilight rate for late-afternoon tee times. The start time moves with sunset through the year, so confirm it when you book.`,
    })
  }

  return faqs
}

export const revalidate = 3600

export async function generateStaticParams() {
  return TOWN_PAGES.map(t => ({ town: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ town: string }>
}): Promise<Metadata> {
  const { town: slug } = await params
  const townPage = TOWN_PAGES.find(t => t.slug === slug)
  if (!townPage) return {}

  const courses = (await getCourses()).filter(c => townPage.towns.includes(c.town ?? ''))
  const names = courses.map(c => c.name)
  const namesText = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0]
  const froms = courses.map(c => c.price_from).filter((p): p is number => p != null)

  // Ferragudo has a single course with its own page; aim this one at "golf near Ferragudo" so they don't compete.
  const title = pickTitle(slug === 'ferragudo'
    ? ['Golf near Ferragudo: Map & Green Fees']
    : [
        `${townPage.label} Golf Courses: Map & Green Fees`,
        `${townPage.label} Golf Courses Map`,
        `${townPage.label} Golf Courses`,
      ])
  const count = courses.length === 1 ? 'the golf course' : `the ${courses.length} golf courses`
  const description = pickDescription([
    ...(froms.length ? [`Map of ${count} in ${townPage.label}: ${namesText}. Green fees from €${Math.min(...froms)}, handicap rules and where to stay.`] : []),
    `Map of ${count} in ${townPage.label}: ${namesText}. Compare green fees and course details.`,
    `Map of ${count} in ${townPage.label}. Compare green fees, handicap rules and where to stay.`,
  ])
  const url = `${BASE}/${slug}/golf-courses`

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
      images: ['/og-default.jpg'],
    },
  }
}

export default async function TownPage({
  params,
}: {
  params: Promise<{ town: string }>
}) {
  const { town: slug } = await params
  const townPage = TOWN_PAGES.find(t => t.slug === slug)
  if (!townPage) notFound()

  const [allCourses, airports, guidePosts] = await Promise.all([getCourses(), getAirports(), getPublishedGuidePosts()])
  const courses = allCourses.filter(c => townPage.towns.includes(c.town ?? ''))
  const faro = airports.find(a => a.code === 'FAO') ?? null

  if (courses.length === 0) notFound()

  const centerLat = courses.reduce((sum, c) => sum + c.lat, 0) / courses.length
  const centerLng = courses.reduce((sum, c) => sum + c.lng, 0) / courses.length

  const prices = await getVisitorPriceRanges(courses)

  // Courses in other towns, measured from whichever of this town's courses is closest.
  const nearbyAll = allCourses
    .filter(c => !townPage.towns.includes(c.town ?? ''))
    .map(c => {
      const best = courses
        .map(t => ({ from: t, ...driveEstimate(t.lat, t.lng, c.lat, c.lng) }))
        .sort((a, b) => a.mins - b.mins)[0]
      return { course: c, mins: best.mins, from: best.from }
    })
    .filter(x => x.mins <= NEARBY_COURSE_MAX_MINS)
    .sort((a, b) => a.mins - b.mins)
  const nearby = nearbyAll.slice(0, MAX_NEARBY_COURSES)
  const nearbyPrices = await getVisitorPriceRanges(nearby.map(x => x.course))

  // Places to stay, measured to the nearest of this town's courses.
  const spreadKm = Math.max(...courses.map(c => haversineKm(centerLat, centerLng, c.lat, c.lng)))
  const candidates = (await getHotelsNear(centerLat, centerLng, spreadKm + SPARSE_HOTEL_RADIUS_KM, 1000))
    .map(h => ({ ...h, distance_km: Math.min(...courses.map(c => haversineKm(c.lat, c.lng, h.lat, h.lng))) }))
  let hotelPool = candidates.filter(h => h.distance_km <= HOTEL_RADIUS_KM)
  if (hotelPool.length < MIN_HOTELS) hotelPool = candidates.filter(h => h.distance_km <= SPARSE_HOTEL_RADIUS_KM)
  const hotels = hotelPool.sort((a, b) => a.distance_km - b.distance_km).map(toHotelListItem)

  // Guide posts about this town or any of its courses, matched on whole slug segments.
  const keys = [slug, ...courses.map(c => c.slug)]
  const guides = guidePosts
    .filter(p => keys.some(k => `-${p.slug}-`.includes(`-${k}-`)))
    .slice(0, MAX_GUIDES)

  const byPrice = [...courses].sort((a, b) => (prices.get(a.id)?.from ?? Infinity) - (prices.get(b.id)?.from ?? Infinity))
  const faroTimes = courses.map(c => faroDistance(c.lat, c.lng).mins)
  const froms = courses.map(c => prices.get(c.id)).filter((p): p is VisitorPriceRange => p != null)
  const totalHoles = courses.reduce((sum, c) => sum + c.holes, 0)
  const faqs = buildFaqs(townPage.label, courses, prices, nearby, nearbyAll.length)

  const pageUrl = `${BASE}/${slug}/golf-courses`

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Golf Courses in the Algarve', item: BASE },
      { '@type': 'ListItem', position: 3, name: `${townPage.label} Golf Courses`, item: pageUrl },
    ],
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Golf Courses in ${townPage.label}`,
    numberOfItems: courses.length,
    itemListElement: courses.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `${BASE}/courses/${c.slug}`,
    })),
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/<\//g, '<\\/') }}
      />

      <div style={{ position: 'relative' }}>
        <TownMapClient
          courses={courses}
          centerLat={centerLat}
          centerLng={centerLng}
          faro={faro}
        />
      </div>

      <section className="course-directory" id="courses">
        <nav aria-label="Breadcrumb" style={{ marginBottom: 8 }}>
          <ol style={{
            display: 'flex', flexWrap: 'wrap', gap: '4px 8px',
            listStyle: 'none', padding: 0, margin: 0,
            fontSize: 13, color: '#6a6a6a',
          }}>
            <li><Link href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/#courses" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Golf Courses in the Algarve</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>
              {townPage.label}
            </li>
          </ol>
        </nav>

        <div className="course-directory__header" style={{ marginTop: 16 }}>
          <h1 className="course-directory__title">{townPage.label} Golf Courses</h1>
          <p className="course-directory__subtitle">
            {courses.length} golf {courses.length === 1 ? 'course' : 'courses'} in {townPage.label}, Algarve
          </p>
        </div>

        <div style={{ maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444', margin: '0 0 20px' }}>
          <p style={{ margin: 0 }}>{townPage.description}</p>
          {townPage.more?.map(para => (
            <p key={para.slice(0, 40)} style={{ margin: '14px 0 0' }}>{renderInlineText(para)}</p>
          ))}
        </div>

        {/* Quick facts */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '0 0 32px' }}>
          <span style={factChip}>⛳ {courses.length} {courses.length === 1 ? 'course' : 'courses'} · {totalHoles} holes</span>
          {froms.length > 0 && (
            <span style={factChip}>💶 Green fees from €{Math.min(...froms.map(p => p.from))}</span>
          )}
          <span style={factChip}>✈️ {minMaxText(faroTimes, ' min', '~')} from Faro Airport</span>
        </div>

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
                  <h2 className="course-list-item__name">{course.name}</h2>
                  <span className="course-list-item__meta">
                    {course.holes} holes
                    {course.par != null && ` · Par ${course.par}`}
                    {course.difficulty && ` · ${course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}`}
                    {course.review_count > 0 && course.rating != null && ` · ★ ${course.rating} (${course.review_count} review${course.review_count === 1 ? '' : 's'})`}
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
              </Link>
              {course.review_count > 0 && (
                <Link href={`/courses/${course.slug}/reviews`} className="course-list-item__reviews">
                  Read {course.name} reviews →
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Green fee comparison */}
        {froms.length > 0 && (
          <section style={sectionWrap}>
            <h2 style={sectionTitle}>{townPage.label} green fees compared</h2>
            <p style={bodyText}>
              Visitor green fees for the {PRICE_SEASON} season, lowest to highest. The range runs from the cheapest month to the
              busiest; tap a price for the month-by-month breakdown.
            </p>
            <div style={{ overflowX: 'auto', border: '1px solid #ebebeb', borderRadius: 12, background: '#fff' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 520 }}>
                <thead>
                  <tr style={{ background: '#f6f6f6', textAlign: 'left' }}>
                    <th style={th}>Course</th>
                    <th style={th}>Holes</th>
                    <th style={th}>Green fee</th>
                    <th style={th}>Handicap</th>
                    <th style={th}>From Faro</th>
                  </tr>
                </thead>
                <tbody>
                  {byPrice.map(c => {
                    const p = prices.get(c.id)
                    return (
                      <tr key={c.id} style={{ borderTop: '1px solid #ebebeb' }}>
                        <td style={{ ...td, fontWeight: 600 }}>
                          <Link href={`/courses/${c.slug}`} style={link}>{c.name}</Link>
                        </td>
                        <td style={td}>{c.holes}</td>
                        <td style={{ ...td, whiteSpace: 'nowrap' }}>
                          {p ? <Link href={`/courses/${c.slug}/green-fees`} style={link}>{priceText(p)}</Link> : '—'}
                        </td>
                        <td style={td}>{handicapText(c)}</td>
                        <td style={{ ...td, whiteSpace: 'nowrap' }}>~{faroDistance(c.lat, c.lng).mins} min</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 12, color: '#8a8a8a', margin: '8px 0 0', lineHeight: 1.6 }}>
              Prices are the lowest visitor rate for one round, taken from each club&apos;s own price list or booking system
              (last checked {PRICE_LAST_CHECKED}). Drive times are estimates.
            </p>
          </section>
        )}

        {/* Courses nearby */}
        {nearby.length > 0 && (
          <section style={sectionWrap}>
            <h2 style={sectionTitle}>Golf courses near {townPage.label}</h2>
            <p style={bodyText}>
              Staying in {townPage.label}? These courses in neighbouring areas are within about {NEARBY_COURSE_MAX_MINS} minutes by car.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {nearby.map(({ course: c, mins, from }) => (
                <Link key={c.id} href={`/courses/${c.slug}`} style={compareRow}>
                  <span style={{ ...compareName, whiteSpace: 'normal' }}>⛳ {c.name}</span>
                  <span style={{ ...compareMeta, flexShrink: 1, textAlign: 'right' }}>
                    {nearbyPrices.get(c.id) && <>from <strong style={{ color: '#222' }}>€{nearbyPrices.get(c.id)!.from}</strong> · </>}
                    ~{mins} min{courses.length > 1 ? ` from ${from.name}` : ''}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Where to stay */}
        {hotels.length > 0 && (
          <section style={sectionWrap}>
            <h2 style={sectionTitle}>Where to stay near the {townPage.label} golf courses</h2>
            <p style={bodyText}>
              {hotels.length} places to stay, closest first. Distances are to the nearest {townPage.label} course.
            </p>
            <NearbyHotels hotels={hotels} onsiteHotelId={null} />
          </section>
        )}

        {/* Related guides */}
        {guides.length > 0 && (
          <section style={sectionWrap}>
            <h2 style={sectionTitle}>{townPage.label} golf guides</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {guides.map(g => (
                <Link key={g.id} href={`/guide/${g.slug}`} style={compareRow}>
                  <span style={{ ...compareName, whiteSpace: 'normal' }}>📖 {g.title}</span>
                  <span style={compareMeta}>Read →</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQs */}
        <section style={sectionWrap}>
          <h2 style={sectionTitle}>{townPage.label} golf — FAQs</h2>
          {faqs.map(f => (
            <div key={f.q} style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#222', margin: '0 0 6px' }}>{f.q}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#444', margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </section>

        <div style={{ maxWidth: 700, fontSize: 14.5, lineHeight: 1.7, color: '#444', borderTop: '1px solid #ebebeb', paddingTop: 20, marginTop: 36 }}>
          <p style={{ margin: 0 }}>
            Flying in without clubs? See our <Link href="/club-rental" style={link}>golf club rental guide</Link>. More trip-planning
            advice is in the <Link href="/guide" style={link}>Algarve golf guide</Link>.
          </p>
        </div>
      </section>
    </>
  )
}

const link = { color: '#2B6090', textDecoration: 'none', fontWeight: 500 } as const

const sectionWrap: React.CSSProperties = { margin: '40px 0 0' }

const sectionTitle: React.CSSProperties = {
  fontSize: 20, fontWeight: 700, color: '#222', margin: '0 0 12px',
}

const bodyText: React.CSSProperties = {
  maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444', margin: '0 0 14px',
}

const factChip: React.CSSProperties = {
  fontSize: 13.5, fontWeight: 600, color: '#333', background: '#fff',
  border: '1px solid #ebebeb', borderRadius: 999, padding: '7px 14px',
}

const th: React.CSSProperties = { padding: '10px 14px', fontSize: 12.5, fontWeight: 700, color: '#555' }
const td: React.CSSProperties = { padding: '11px 14px', color: '#333', verticalAlign: 'top' }

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
