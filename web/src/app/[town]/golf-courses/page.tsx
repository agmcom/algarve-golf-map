import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { pickTitle, pickDescription, withSiteName } from '@/lib/seo'
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

  const courses = (await getCourses()).filter(c => townPage.towns.includes(c.town ?? ''))
  const names = courses.map(c => c.name)
  const namesText = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0]

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
    `Map of ${count} in ${townPage.label}: ${namesText}. Compare green fees and course details.`,
    `Map of ${count} in ${townPage.label}. Compare green fees, difficulty and course details.`,
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

        <p style={{ maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444', margin: '0 0 32px' }}>
          {townPage.description}
        </p>

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
      </section>
    </>
  )
}
