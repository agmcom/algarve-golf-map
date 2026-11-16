import Link from 'next/link'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { CourseStatusBadge } from '@/components/CourseStatusBadge'
import { TownMapClient } from '@/components/TownMapClient'
import { NearbyHotels } from '@/components/NearbyHotels'
import { pickTitle, pickDescription, withSiteName } from '@/lib/seo'
import { getCourses, getAirports, getHotelsNear, getPublishedGuidePosts, getVisitorPriceRanges, type VisitorPriceRange } from '@/lib/queries'
import { renderInlineText } from '@/lib/richText'
import { faroDistance, haversineKm } from '@/lib/distance'
import { handicapRule } from '@/lib/handicap'
import { toHotelListItem } from '@/lib/hotels'
import { PRICE_SEASON, PRICE_LAST_CHECKED } from '@/lib/prices'
import { isUnbookable } from '@/data/course-status'
import { NEAR_TOWN_DRIVE_TIMES } from '@/data/nearTownDriveTimes'
import type { NearTownPage } from '@/data/near-towns'
import type { Course } from '@/types/database'

// "Golf near <town>" for places to stay without a course of their own.
// Courses are listed by drive time from the town centre.

const BASE = 'https://www.algarvegolfmap.com'
const SHORT_DRIVE_MINS = 30
const MIN_COURSES = 4
const MAX_COURSES = 12
const MAX_HOTELS_FALLBACK_KM = 6

type Near = { course: Course; mins: number; km: number }

function joinAnd(parts: string[]): string {
  if (parts.length <= 1) return parts[0] ?? ''
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`
}

// A round at a 27-hole venue is 18 holes.
function roundHoles(c: Course): number {
  return c.holes === 27 ? 18 : c.holes
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

/** Bookable courses by drive time: everything within SHORT_DRIVE_MINS, at least MIN_COURSES. */
async function nearCourses(town: NearTownPage): Promise<{ list: Near[]; withinShort: number }> {
  const times = NEAR_TOWN_DRIVE_TIMES[town.slug] ?? {}
  const all = (await getCourses())
    .filter(c => !isUnbookable(c.slug) && times[c.slug])
    .map(c => ({ course: c, ...times[c.slug] }))
    .sort((a, b) => a.mins - b.mins || a.km - b.km || a.course.name.localeCompare(b.course.name))
  const withinShort = all.filter(x => x.mins <= SHORT_DRIVE_MINS).length
  return { list: all.slice(0, Math.min(MAX_COURSES, Math.max(MIN_COURSES, withinShort))), withinShort }
}

export async function nearTownMetadata(town: NearTownPage): Promise<Metadata> {
  const { list, withinShort } = await nearCourses(town)
  const closest = list[0]
  const title = pickTitle([
    `Golf near ${town.label}: Courses & Drive Times`,
    `Golf near ${town.label}`,
  ])
  const countText = withinShort >= 2
    ? `${withinShort} golf courses within ${SHORT_DRIVE_MINS} minutes of ${town.label}`
    : `The nearest golf courses to ${town.label}`
  const description = pickDescription([
    `${countText}, closest first: ${closest.course.name} is about ${closest.mins} min away. Green fees, handicap rules and where to stay.`,
    `${countText}, closest first, with drive times, green fees and handicap rules.`,
  ])
  const url = `${BASE}/${town.slug}/golf-courses`
  return {
    title: withSiteName(title),
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Algarve Golf Map', locale: 'en_GB', type: 'website', images: ['/og-default.jpg'] },
  }
}

interface Faq { q: string; a: string }

function buildFaqs(town: NearTownPage, list: Near[], withinShort: number, prices: Map<string, VisitorPriceRange>): Faq[] {
  const L = town.label
  const faqs: Faq[] = []
  const [first, ...rest] = list
  const sameTime = rest.filter(x => x.mins === first.mins)
  faqs.push({
    q: `What is the closest golf course to ${L}?`,
    a: sameTime.length
      ? `${joinAnd([first, ...sameTime].map(x => x.course.name))} are the closest, each about ${first.mins} minutes from the centre of ${L} by car.`
      : `${first.course.name} is the closest, about ${first.mins} minutes (${first.km} km) from the centre of ${L} by car.${rest[0] ? ` Next is ${rest[0].course.name}, about ${rest[0].mins} minutes away.` : ''}`,
  })

  if (withinShort >= 2) {
    faqs.push({
      q: `How many golf courses are near ${L}?`,
      a: `On our map, ${withinShort} golf courses open to visitors are within about ${SHORT_DRIVE_MINS} minutes' drive of ${L}, including ${joinAnd(list.slice(0, 3).map(x => x.course.name))}. Drive times are without traffic and can be longer in summer.`,
    })
  }

  const none = list.filter(x => handicapRule(x.course) === 'none')
  if (none.length) {
    faqs.push({
      q: `Can you play golf near ${L} without a handicap?`,
      a: `Yes. ${joinAnd(none.map(x => `${x.course.name} (about ${x.mins} min away)`))} ${none.length === 1 ? 'does' : 'do'} not ask for a handicap certificate. The other courses in the table ask for one, and the limits are shown there.`,
    })
  }

  const priced = list.filter(x => prices.has(x.course.id)).sort((a, b) => prices.get(a.course.id)!.from - prices.get(b.course.id)!.from)
  if (priced.length >= 2) {
    const lo = priced[0]
    faqs.push({
      q: `What is the cheapest golf near ${L}?`,
      a: `Of the courses listed here, ${lo.course.name} has the lowest visitor green fee, from €${prices.get(lo.course.id)!.from} for ${roundHoles(lo.course)} holes in the ${PRICE_SEASON} season, and is about ${lo.mins} minutes from ${L}. Prices change through the year, so check the course's green-fee page for your dates.`,
    })
  }

  const faro = faroDistance(town.lat, town.lng)
  faqs.push({
    q: `How far is ${L} from Faro Airport?`,
    a: town.slug === 'faro'
      ? `Faro Airport is on the western edge of the city, about 10 minutes from the centre by car.`
      : `${L} is roughly ${faro.mins} minutes (${faro.km} km) by car from Faro Airport, without traffic.`,
  })
  return faqs
}

export async function NearTownView({ town }: { town: NearTownPage }) {
  const [{ list, withinShort }, airports, guidePosts] = await Promise.all([nearCourses(town), getAirports(), getPublishedGuidePosts()])
  const faro = airports.find(a => a.code === 'FAO') ?? null
  const prices = await getVisitorPriceRanges(list.map(x => x.course))

  // Map: frame the town and its listed courses.
  const lats = [town.lat, ...list.map(x => x.course.lat)]
  const lngs = [town.lng, ...list.map(x => x.course.lng)]
  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
  const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
  const spreadKm = Math.max(...list.map(x => haversineKm(centerLat, centerLng, x.course.lat, x.course.lng)), haversineKm(centerLat, centerLng, town.lat, town.lng))
  const zoom = spreadKm <= 8 ? 11.3 : spreadKm <= 14 ? 10.6 : spreadKm <= 22 ? 10 : 9.4

  // Where to stay: in the town itself, closest to the centre first.
  let hotelRows = await getHotelsNear(town.lat, town.lng, town.hotelRadiusKm, 60)
  if (hotelRows.length < 3) hotelRows = await getHotelsNear(town.lat, town.lng, MAX_HOTELS_FALLBACK_KM, 60)
  const hotels = hotelRows.map(toHotelListItem)

  const guides = town.guides
    .map(slug => guidePosts.find(p => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => p != null)

  const faqs = buildFaqs(town, list, withinShort, prices)
  const pageUrl = `${BASE}/${town.slug}/golf-courses`
  const H1 = `Golf near ${town.label}`

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'All golf courses', item: `${BASE}/courses` },
      { '@type': 'ListItem', position: 3, name: H1, item: pageUrl },
    ],
  }
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Golf courses near ${town.label}`,
    numberOfItems: list.length,
    itemListElement: list.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.course.name, url: `${BASE}/courses/${x.course.slug}` })),
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

      <SiteHeader showBackToMap />

      <div style={{ position: 'relative' }}>
        <TownMapClient courses={list.map(x => x.course)} centerLat={centerLat} centerLng={centerLng} zoom={zoom} faro={faro} />
      </div>

      <section className="course-directory" id="courses">
        <nav aria-label="Breadcrumb" style={{ marginBottom: 8 }}>
          <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#6a6a6a' }}>
            <li><Link href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/courses" style={{ color: '#6a6a6a', textDecoration: 'none' }}>All golf courses</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>{H1}</li>
          </ol>
        </nav>

        <div className="course-directory__header" style={{ marginTop: 16 }}>
          <h1 className="course-directory__title">{H1}</h1>
          <p className="course-directory__subtitle">
            {withinShort >= 2
              ? `${withinShort} golf courses within ${SHORT_DRIVE_MINS} minutes' drive of ${town.label}`
              : `The nearest golf courses to ${town.label}, by drive time`}
          </p>
        </div>

        <div style={{ maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444', margin: '0 0 18px' }}>
          {town.intro.map((para, i) => (
            <p key={i} style={{ margin: i === 0 ? 0 : '14px 0 0' }}>{renderInlineText(para)}</p>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '0 0 30px' }}>
          <span style={factChip}>⛳ Closest: {list[0].course.name}, ~{list[0].mins} min</span>
          <span style={factChip}>✈️ {town.slug === 'faro' ? '~10 min' : `~${faroDistance(town.lat, town.lng).mins} min`} from Faro Airport</span>
          {town.related.map(r => (
            <Link key={r.href} href={r.href} style={{ ...factChip, color: '#2B6090', textDecoration: 'none' }}>{r.label} →</Link>
          ))}
        </div>

        {/* Courses by drive time */}
        <h2 style={sectionTitle}>Golf courses near {town.label}, closest first</h2>
        <div style={{ overflowX: 'auto', border: '1px solid #ebebeb', borderRadius: 12, background: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 560 }}>
            <thead>
              <tr style={{ background: '#f6f6f6', textAlign: 'left' }}>
                <th style={th}>Course</th>
                <th style={th}>Drive</th>
                <th style={th}>Holes</th>
                <th style={th}>Green fee</th>
                <th style={th}>Handicap</th>
              </tr>
            </thead>
            <tbody>
              {list.map(({ course: c, mins, km }) => {
                const p = prices.get(c.id)
                return (
                  <tr key={c.id} style={{ borderTop: '1px solid #ebebeb' }}>
                    <td style={{ ...td, fontWeight: 600 }}>
                      <Link href={`/courses/${c.slug}`} style={link}>{c.name}</Link>
                      <CourseStatusBadge slug={c.slug} size="sm" style={{ display: 'block', width: 'fit-content', marginTop: 4 }} />
                    </td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>~{mins} min <span style={{ color: '#8a8a8a' }}>· {km} km</span></td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{c.holes}{c.par != null && <span style={{ color: '#8a8a8a' }}> · par {c.par}</span>}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>
                      {p ? <Link href={`/courses/${c.slug}/green-fees`} style={link}>{priceText(p)}</Link> : '—'}
                    </td>
                    <td style={td}>{handicapText(c)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 12, color: '#8a8a8a', margin: '8px 0 0', lineHeight: 1.6, maxWidth: 700 }}>
          Drive times are from the centre of {town.label}, without traffic, rounded to the nearest 5 minutes. Green fees are the
          visitor range for one round in the {`${PRICE_SEASON} season`}, from each club&apos;s own price list or booking system
          (last checked {PRICE_LAST_CHECKED}). This is a selection of the nearest courses, not every course you could play.
        </p>

        {/* Where to stay */}
        {hotels.length > 0 && (
          <section style={sectionWrap}>
            <h2 style={sectionTitle}>Where to stay in {town.label} for golf</h2>
            <p style={bodyText}>
              {hotels.length} places to stay in and around {town.label}, closest to the centre first. Distances are to the centre of {town.label}.
            </p>
            <NearbyHotels hotels={hotels} onsiteHotelId={null} />
          </section>
        )}

        {guides.length > 0 && (
          <section style={sectionWrap}>
            <h2 style={sectionTitle}>Guides for golf near {town.label}</h2>
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

        <section style={sectionWrap}>
          <h2 style={sectionTitle}>Golf near {town.label}: FAQs</h2>
          {faqs.map(f => (
            <div key={f.q} style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#222', margin: '0 0 6px' }}>{f.q}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#444', margin: 0, maxWidth: 700 }}>{f.a}</p>
            </div>
          ))}
        </section>

        <div style={{ maxWidth: 700, fontSize: 14.5, lineHeight: 1.7, color: '#444', borderTop: '1px solid #ebebeb', paddingTop: 20, marginTop: 36 }}>
          <p style={{ margin: 0 }}>
            See every course on the <Link href="/" style={link}>Algarve golf map</Link> or in the{' '}
            <Link href="/courses" style={link}>full list of Algarve golf courses</Link>. Flying in without clubs? See our{' '}
            <Link href="/club-rental" style={link}>golf club rental guide</Link>.
          </p>
        </div>
      </section>
    </>
  )
}

const link = { color: '#2B6090', textDecoration: 'none', fontWeight: 500 } as const
const sectionWrap: React.CSSProperties = { margin: '40px 0 0' }
const sectionTitle: React.CSSProperties = { fontSize: 20, fontWeight: 700, color: '#222', margin: '0 0 12px' }
const bodyText: React.CSSProperties = { maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444', margin: '0 0 14px' }
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
const compareName: React.CSSProperties = { fontSize: 14, fontWeight: 700, color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
const compareMeta: React.CSSProperties = { flexShrink: 0, fontSize: 13, color: '#6a6a6a' }
