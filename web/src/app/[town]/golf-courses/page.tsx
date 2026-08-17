import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCourses, getAirports } from '@/lib/queries'
import { TOWN_PAGES } from '@/lib/towns'
import { TownMapClient } from '@/components/TownMapClient'

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

  const title = `${townPage.label} Golf Courses`
  const url = `${BASE}/${slug}/golf-courses`

  return {
    title,
    description: townPage.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: townPage.description,
      url,
      siteName: 'Algarve Golf Map',
      type: 'website',
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

  const [allCourses, airports] = await Promise.all([getCourses(), getAirports()])
  const courses = allCourses.filter(c => townPage.towns.includes(c.town ?? ''))
  const faro = airports.find(a => a.code === 'FAO') ?? null

  if (courses.length === 0) notFound()

  const centerLat = courses.reduce((sum, c) => sum + c.lat, 0) / courses.length
  const centerLng = courses.reduce((sum, c) => sum + c.lng, 0) / courses.length

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

      <section className="course-directory" id="courses">
        <nav aria-label="Breadcrumb" style={{ marginBottom: 8 }}>
          <ol style={{
            display: 'flex', flexWrap: 'wrap', gap: '4px 8px',
            listStyle: 'none', padding: 0, margin: 0,
            fontSize: 13, color: '#6a6a6a',
          }}>
            <li><a href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</a></li>
            <li aria-hidden="true">›</li>
            <li><a href="/#courses" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Golf Courses in the Algarve</a></li>
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

        <p style={{ maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444', margin: '0 0 32px' }}>
          {townPage.description}
        </p>

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
                  <h2 className="course-list-item__name">{course.name}</h2>
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
