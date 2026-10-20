import type { Metadata } from 'next'
import Link from 'next/link'
import { getCourses, getHotels } from '@/lib/queries'
import { RESORT_PAGES, type ResortPage } from '@/lib/resorts'
import { faroDistance, formatDriveTime } from '@/lib/distance'
import type { Course, Hotel } from '@/types/database'

const BASE = 'https://www.algarvegolfmap.com'

const PEXELS_FALLBACK =
  'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=320&h=200&fit=crop'

const TITLE = 'Golf Resorts in the Algarve'

export const revalidate = 3600

const REGION_LABEL: Record<string, string> = { west: 'West', central: 'Central', east: 'East' }

interface ResortRow {
  resort: ResortPage
  hotel: Hotel | undefined
  courses: Course[]
  holes: number
  greenFeeFrom: number | null
  faro: { km: number; mins: number }
  region: string
}

async function getResortRows(): Promise<ResortRow[]> {
  const [allCourses, allHotels] = await Promise.all([getCourses(), getHotels()])
  const coursesBySlug = new Map(allCourses.map(c => [c.slug, c]))
  const hotelsBySlug = new Map(allHotels.map(h => [h.slug, h]))

  return RESORT_PAGES
    .map(resort => {
      const courses = resort.courseSlugs.map(s => coursesBySlug.get(s)).filter(c => c != null)
      const fees = courses.map(c => c.price_from).filter(p => p != null)
      return {
        resort,
        hotel: hotelsBySlug.get(resort.hotelSlugs[0]),
        courses,
        holes: courses.reduce((sum, c) => sum + (c.holes ?? 0), 0),
        greenFeeFrom: fees.length ? Math.min(...fees) : null,
        faro: courses[0] ? faroDistance(courses[0].lat, courses[0].lng) : { km: 0, mins: 0 },
        region: courses[0]?.region ?? '',
      }
    })
    // Resort pages 404 when none of their courses are active (e.g. private clubs), so leave those out.
    .filter(r => r.courses.length > 0)
}

export async function generateMetadata(): Promise<Metadata> {
  const count = (await getResortRows()).length
  const url = `${BASE}/golf-resorts`
  const title = `Best Golf Resorts in the Algarve: ${count} Compared`
  const description = `Compare ${count} Algarve golf resorts side by side: hotel stars, nightly prices, courses, green fees and drive time from Faro Airport.`
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Algarve Golf Map', locale: 'en_GB', type: 'website', images: ['/og-default.jpg'] },
    twitter: { card: 'summary_large_image', title, description },
  }
}

// Hand-picked from each resort's description and facilities (src/lib/resorts.ts, hotel amenities).
const PICKS: { heading: string; text: string; slugs: string[] }[] = [
  {
    heading: 'Most golf on one estate',
    text: 'Quinta do Lago has three 18-hole courses within reach of the hotel, including the South Course, nine-time host of the Portuguese Open. Several other resorts give you two courses without moving hotel.',
    slugs: ['quinta-do-lago', 'vale-do-lobo', 'amendoeira-golf-resort', 'nau-morgado', 'robinson-quinta-da-ria'],
  },
  {
    heading: 'Bucket-list golf',
    text: 'Monte Rei\'s Jack Nicklaus Signature course is widely ranked the best in Portugal. Ombria, opened in 2023, won European design awards in its first season, and Quinta do Lago South is a Portuguese Open venue.',
    slugs: ['monte-rei', 'ombria', 'quinta-do-lago'],
  },
  {
    heading: 'Golf and the beach',
    text: 'The Dona Filipa at Vale do Lobo is a two-minute walk from the sand, Pine Cliffs has a cliffside lift down to Praia da Falésia, Palmares Beach House overlooks Meia Praia, and the Salgados hotels sit close to Salgados beach.',
    slugs: ['vale-do-lobo', 'pine-cliffs', 'palmares', 'salgados'],
  },
  {
    heading: 'Families',
    text: 'These resorts have a kids\' club, so non-golfers have something to do while you play. Balaia adds six pools and a relaxed par-3 course the whole family can try.',
    slugs: ['penina', 'ombria', 'pine-cliffs', 'robinson-quinta-da-ria', 'castro-marim-golf-resort', 'balaia-golf-village'],
  },
  {
    heading: 'Beginners and short rounds',
    text: 'A 9-hole course on site makes it easy to warm up or learn: Balaia\'s par-3 layout, Penina\'s Academy Course and the clifftop 9 holes at Pine Cliffs.',
    slugs: ['balaia-golf-village', 'penina', 'pine-cliffs'],
  },
  {
    heading: 'Self-catering',
    text: 'Apartments, villas and townhouses with your own kitchen, handy for longer stays or groups.',
    slugs: ['amendoeira-golf-resort', 'balaia-golf-village', 'boavista-golf-spa-resort', 'pestana-carvoeiro'],
  },
  {
    heading: 'All-inclusive',
    text: 'Robinson Club Quinta da Ria is the all-inclusive option, with two courses beside the Ria Formosa natural park.',
    slugs: ['robinson-quinta-da-ria'],
  },
  {
    heading: 'Quiet east Algarve',
    text: 'Fewer crowds between Tavira and the Spanish border, from the private Monte Rei estate to the village houses at Castro Marim.',
    slugs: ['monte-rei', 'castro-marim-golf-resort', 'robinson-quinta-da-ria'],
  },
]

function joinNames(names: string[]): string {
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0] ?? ''
}

function buildFaqs(rows: ResortRow[]): { q: string; a: string }[] {
  const byFaro = [...rows].sort((a, b) => a.faro.km - b.faro.km)
  const multiCourse = rows.filter(r => r.courses.length > 1)
  const priced = rows.filter(r => r.hotel?.price_from != null).sort((a, b) => a.hotel!.price_from! - b.hotel!.price_from!)

  const faqs = [
    {
      q: 'What is the best golf resort in the Algarve?',
      a: 'It depends on what you want from the trip. Quinta do Lago has the most golf on one estate, with three 18-hole courses including the South Course, host of the Portuguese Open nine times. Monte Rei\'s Jack Nicklaus Signature course is widely ranked the best in Portugal, and Ombria has won European design awards since opening in 2023.',
    },
    {
      q: 'Which golf resort is closest to Faro Airport?',
      a: `${byFaro[0].resort.label} and ${byFaro[1].resort.label} are the closest, both a short drive from Faro Airport, followed by ${byFaro[2].resort.label}. The resorts in the west, around Portimão and Lagos, are roughly an hour away.`,
    },
    {
      q: 'Which Algarve golf resorts have more than one course?',
      a: `${joinNames(multiCourse.map(r => `${r.resort.label} (${r.courses.length})`))} all have more than one course on the estate, so you can play different layouts without changing hotel.`,
    },
    {
      q: 'Is there an all-inclusive golf resort in the Algarve?',
      a: 'Yes. Robinson Club Quinta da Ria near Tavira is an all-inclusive beach and golf resort, set between its own two courses, Quinta da Ria and Quinta de Cima.',
    },
    {
      q: 'Which golf resorts are good for beginners?',
      a: 'Resorts with a 9-hole course are the easiest start: Balaia Golf Village has a relaxed par-3 course, Penina has its 9-hole Academy Course and Pine Cliffs has a short clifftop course. Most 18-hole courses ask for a handicap certificate, so check the rules before you book.',
    },
  ]
  if (priced.length >= 2) {
    const name = (r: ResortRow) => r.hotel!.name === r.resort.label ? r.resort.label : `${r.hotel!.name} at ${r.resort.label}`
    faqs.push({
      q: 'What is the cheapest golf resort in the Algarve?',
      a: `Of the resorts we list, ${name(priced[0])} has the lowest indicative price, from about €${priced[0].hotel!.price_from} a night, followed by ${name(priced[1])} from about €${priced[1].hotel!.price_from}. Prices change with the season, so check availability for your dates.`,
    })
  }
  return faqs
}

export default async function GolfResortsHubPage() {
  const rows = await getResortRows()
  const rowsBySlug = new Map(rows.map(r => [r.resort.slug, r]))
  const faqs = buildFaqs(rows)

  const pageUrl = `${BASE}/golf-resorts`

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: TITLE, item: pageUrl },
    ],
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: TITLE,
    numberOfItems: rows.length,
    itemListElement: rows.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: r.resort.label,
      url: `${BASE}/golf-resorts/${r.resort.slug}`,
    })),
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

      <section className="course-directory" id="golf-resorts">
        <nav aria-label="Breadcrumb" style={{ marginBottom: 8 }}>
          <ol style={{
            display: 'flex', flexWrap: 'wrap', gap: '4px 8px',
            listStyle: 'none', padding: 0, margin: 0,
            fontSize: 13, color: '#6a6a6a',
          }}>
            <li><Link href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>{TITLE}</li>
          </ol>
        </nav>

        <div className="course-directory__header" style={{ marginTop: 16 }}>
          <h1 className="course-directory__title">{TITLE}</h1>
          <p className="course-directory__subtitle">
            {rows.length} resorts where the hotel and the golf course share the same estate
          </p>
        </div>

        <div style={{ maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444', margin: '0 0 32px' }}>
          <p style={{ margin: '0 0 12px' }}>
            A golf resort means you can walk or take a short buggy ride from your room to the first tee. The Algarve has them
            all along the coast: the Golden Triangle near Faro for championship golf close to the airport, the west around
            Portimão and Lagos for clifftop and hillside courses, and the quieter east towards Tavira and the Spanish border.
          </p>
          <p style={{ margin: 0 }}>
            Compare them side by side below, see which resort suits your trip, then open any resort for its hotel, courses
            and green fees.
          </p>
        </div>

        {/* Comparison table */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={sectionTitle}>Algarve golf resorts compared</h2>
          <div style={{ overflowX: 'auto', border: '1px solid #ebebeb', borderRadius: 12 }}>
            <table style={{ width: '100%', minWidth: 760, borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#fafafa', textAlign: 'left' }}>
                  {['Resort', 'Area', 'Hotel', 'Golf', 'Green fee from', 'Hotel from', 'Faro Airport', 'Google rating'].map(h => (
                    <th key={h} scope="col" style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.resort.slug} style={{ borderTop: '1px solid #ebebeb' }}>
                    <th scope="row" style={{ ...td, fontWeight: 700 }}>
                      <Link href={`/golf-resorts/${r.resort.slug}`} style={link}>{r.resort.label}</Link>
                    </th>
                    <td style={td}>
                      {(r.hotel?.town ?? r.courses[0].town ?? '').split(' · ')[0]}
                      {r.region && <span style={muted}> · {REGION_LABEL[r.region] ?? r.region}</span>}
                    </td>
                    <td style={td}>{r.hotel?.stars ? `${r.hotel.stars}★` : '—'}</td>
                    <td style={td}>
                      {r.courses.length} {r.courses.length === 1 ? 'course' : 'courses'}
                      <span style={muted}> · {r.holes} holes</span>
                    </td>
                    <td style={td}>{r.greenFeeFrom != null ? `€${r.greenFeeFrom}` : '—'}</td>
                    <td style={td}>{r.hotel?.price_from != null ? `€${r.hotel.price_from}/night` : '—'}</td>
                    <td style={td}>{formatDriveTime(r.faro.mins)}</td>
                    <td style={td}>
                      {r.hotel?.google_rating != null
                        ? <>{r.hotel.google_rating}<span style={muted}> ({r.hotel.google_user_ratings_total?.toLocaleString('en-GB')})</span></>
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12.5, color: '#6a6a6a', margin: '8px 0 0' }}>
            Prices are indicative starting rates and change with the season. Drive times from Faro Airport are estimates.
          </p>
        </section>

        {/* Which resort suits you */}
        <section style={{ marginBottom: 40, maxWidth: 760 }}>
          <h2 style={sectionTitle}>Which golf resort suits you?</h2>
          {PICKS.map(pick => {
            const picked = pick.slugs.map(s => rowsBySlug.get(s)).filter(r => r != null)
            if (picked.length === 0) return null
            return (
              <div key={pick.heading} style={{ marginBottom: 22 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#222', margin: '0 0 6px' }}>{pick.heading}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#444', margin: '0 0 8px' }}>{pick.text}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {picked.map(r => (
                    <Link key={r.resort.slug} href={`/golf-resorts/${r.resort.slug}`} style={chip}>
                      {r.resort.label}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </section>

        {/* All resorts */}
        <h2 style={sectionTitle}>All {rows.length} golf resorts</h2>
        <ul className="course-list">
          {rows.map(({ resort, hotel, courses }) => {
            const firstCourse = courses[0]
            const heroImage =
              firstCourse?.photos?.find(p => p.is_hero)?.url ??
              firstCourse?.photos?.[0]?.url ??
              PEXELS_FALLBACK

            return (
              <li key={resort.slug} className="course-list-item">
                <Link href={`/golf-resorts/${resort.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroImage}
                    alt={firstCourse ? `${resort.label} golf resort — ${firstCourse.name}` : `${resort.label} golf resort`}
                    width={80}
                    height={80}
                    loading="lazy"
                  />
                  <div className="course-list-item__body">
                    <h3 className="course-list-item__name">{resort.label}</h3>
                    <span className="course-list-item__meta">
                      {courses.length} golf {courses.length === 1 ? 'course' : 'courses'}
                      {hotel?.stars && ` · ${hotel.stars}-star hotel`}
                    </span>
                    {hotel?.price_from != null && (
                      <span className="course-list-item__badges">
                        <span className="course-list-item__price">From €{hotel.price_from}/night</span>
                      </span>
                    )}
                    <p className="course-list-item__blurb">{resort.description}</p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* FAQ */}
        <section style={{ margin: '40px 0 24px', maxWidth: 760 }}>
          <h2 style={sectionTitle}>Frequently asked questions</h2>
          {faqs.map(f => (
            <div key={f.q} style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#222', margin: '0 0 6px' }}>{f.q}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#444', margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </section>

        <div style={{ maxWidth: 760, fontSize: 14.5, lineHeight: 1.7, color: '#444', borderTop: '1px solid #ebebeb', paddingTop: 20 }}>
          <p style={{ margin: 0 }}>
            Not sure you need a handicap? Read{' '}
            <Link href="/guide/do-you-need-a-handicap-to-play-golf-in-the-algarve" style={link}>do you need a handicap to play golf in the Algarve</Link>.
            For every hotel built on a golf estate, region by region, see{' '}
            <Link href="/guide/algarve-hotels-with-a-golf-course-on-site" style={link}>Algarve hotels with a golf course on-site</Link>,
            or browse <Link href="/#courses" style={link}>all golf courses in the Algarve</Link>.
          </p>
        </div>
      </section>
    </>
  )
}

const sectionTitle: React.CSSProperties = {
  fontSize: 18, fontWeight: 700, color: '#222',
  margin: '0 0 16px', paddingBottom: 10,
  borderBottom: '2px solid #ebebeb',
}
const th: React.CSSProperties = { padding: '10px 12px', fontSize: 12.5, fontWeight: 700, color: '#6a6a6a', whiteSpace: 'nowrap' }
const td: React.CSSProperties = { padding: '10px 12px', color: '#222', textAlign: 'left', verticalAlign: 'top' }
const muted: React.CSSProperties = { color: '#8a8a8a' }
const link: React.CSSProperties = { color: '#2B6090', textDecoration: 'none', fontWeight: 600 }
const chip: React.CSSProperties = {
  display: 'inline-block', padding: '6px 12px', borderRadius: 999,
  border: '1px solid #dcdcdc', fontSize: 13, fontWeight: 600,
  color: '#222', textDecoration: 'none', background: '#fff',
}
