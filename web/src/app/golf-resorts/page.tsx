import type { Metadata } from 'next'
import { getCourses, getHotels } from '@/lib/queries'
import { RESORT_PAGES } from '@/lib/resorts'

const BASE = 'https://www.algarvegolfmap.com'

const PEXELS_FALLBACK =
  'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=320&h=200&fit=crop'

const TITLE = 'Golf Resorts in the Algarve'
const DESCRIPTION =
  'Explore the Algarve\'s best golf resorts — from Quinta do Lago and Vale do Lobo in the Golden Triangle to Monte Rei and Robinson Quinta da Ria in the east. Each resort page pairs the on-site hotel with its golf course details and prices.'

export const revalidate = 3600

export function generateMetadata(): Metadata {
  const url = `${BASE}/golf-resorts`
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url,
      siteName: 'Algarve Golf Map',
      type: 'website',
    },
  }
}

export default async function GolfResortsHubPage() {
  const [allCourses, allHotels] = await Promise.all([getCourses(), getHotels()])
  const coursesBySlug = new Map(allCourses.map(c => [c.slug, c]))
  const hotelsBySlug = new Map(allHotels.map(h => [h.slug, h]))

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
    numberOfItems: RESORT_PAGES.length,
    itemListElement: RESORT_PAGES.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${r.label} Golf Resort`,
      url: `${BASE}/golf-resorts/${r.slug}`,
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

      <section className="course-directory" id="golf-resorts">
        <nav aria-label="Breadcrumb" style={{ marginBottom: 8 }}>
          <ol style={{
            display: 'flex', flexWrap: 'wrap', gap: '4px 8px',
            listStyle: 'none', padding: 0, margin: 0,
            fontSize: 13, color: '#6a6a6a',
          }}>
            <li><a href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</a></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>{TITLE}</li>
          </ol>
        </nav>

        <div className="course-directory__header" style={{ marginTop: 16 }}>
          <h1 className="course-directory__title">{TITLE}</h1>
          <p className="course-directory__subtitle">
            {RESORT_PAGES.length} golf resorts, pairing an on-site hotel with its course or courses
          </p>
        </div>

        <p style={{ maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444', margin: '0 0 32px' }}>
          {DESCRIPTION}
        </p>

        <ul className="course-list">
          {RESORT_PAGES.map(resort => {
            const hotel = hotelsBySlug.get(resort.hotelSlug)
            const firstCourse = coursesBySlug.get(resort.courseSlugs[0])
            const heroImage =
              firstCourse?.photos?.find(p => p.is_hero)?.url ??
              firstCourse?.photos?.[0]?.url ??
              PEXELS_FALLBACK

            return (
              <li key={resort.slug} className="course-list-item">
                <a href={`/golf-resorts/${resort.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroImage}
                    alt={`${resort.label} golf resort`}
                    width={80}
                    height={80}
                    loading="lazy"
                  />
                  <div className="course-list-item__body">
                    <h2 className="course-list-item__name">{resort.label}</h2>
                    <span className="course-list-item__meta">
                      {resort.courseSlugs.length} golf {resort.courseSlugs.length === 1 ? 'course' : 'courses'}
                      {hotel?.stars && ` · ${hotel.stars}-star hotel`}
                    </span>
                    {hotel?.price_from != null && (
                      <span className="course-list-item__badges">
                        <span className="course-list-item__price">From €{hotel.price_from}/night</span>
                      </span>
                    )}
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
