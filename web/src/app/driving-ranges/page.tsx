import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourses, getAirports } from '@/lib/queries'
import { townSlug } from '@/lib/towns'
import { TownMapClient } from '@/components/TownMapClient'
import type { Course } from '@/types/database'

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

const H1 = 'Driving Ranges in the Algarve'
const SEO_TITLE = 'Driving Ranges in the Algarve | Golf Practice Facilities'
const DESCRIPTION =
  'Every golf course in the Algarve with a driving range, listed town by town — Vilamoura, Almancil, Tavira, Portimão, Lagos and more. Practice facilities, golf academies and green fees for your trip to Portugal.'

// City heading from a course town label like "Almancil · Golden Triangle".
function cityOf(town: string): string {
  return town.split(' · ')[0]
}

const link = { color: '#2B6090', textDecoration: 'none', fontWeight: 500 } as const

function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} style={link}>
      {children}
    </a>
  )
}

export const revalidate = 3600

export function generateMetadata(): Metadata {
  const url = `${BASE}/driving-ranges`
  return {
    title: { absolute: SEO_TITLE },
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      title: SEO_TITLE,
      description: DESCRIPTION,
      url,
      siteName: 'Algarve Golf Map',
      type: 'website',
    },
  }
}

interface CityGroup {
  city: string
  slug: string | null
  courses: Course[]
}

function groupByCity(courses: Course[]): CityGroup[] {
  const map = new Map<string, CityGroup>()
  for (const course of courses) {
    const city = cityOf(course.town)
    if (!map.has(city)) {
      map.set(city, { city, slug: townSlug(course.town), courses: [] })
    }
    map.get(city)!.courses.push(course)
  }
  return Array.from(map.values()).sort(
    (a, b) => b.courses.length - a.courses.length || a.city.localeCompare(b.city),
  )
}

export default async function DrivingRangesPage() {
  const [allCourses, airports] = await Promise.all([getCourses(), getAirports()])

  const courses = allCourses.filter(c => c.driving_range)
  const faro = airports.find(a => a.code === 'FAO') ?? null

  if (courses.length === 0) notFound()

  const groups = groupByCity(courses)

  const centerLat = courses.reduce((sum, c) => sum + c.lat, 0) / courses.length
  const centerLng = courses.reduce((sum, c) => sum + c.lng, 0) / courses.length

  const pageUrl = `${BASE}/driving-ranges`

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Golf Courses in the Algarve', item: BASE },
      { '@type': 'ListItem', position: 3, name: H1, item: pageUrl },
    ],
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: H1,
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
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Which golf courses in the Algarve have a driving range?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${courses.length} of the region's courses have a driving range, including all five courses at Vilamoura, the Quinta do Lago and Vale do Lobo layouts in the Golden Triangle, both Amendoeira courses near Silves, and Monte Rei and Quinta da Ria in the east.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Can you use a driving range in the Algarve without playing a round?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most driving ranges in the Algarve are attached to a golf course and are aimed at green-fee players warming up before a round, but many clubs also sell buckets of range balls to visitors and resort guests. Contact the club directly to check access and prices.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do Algarve golf courses have short-game and putting practice areas?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Alongside the driving range, most of these courses have a putting green and a short-game area, and the majority run a golf academy offering lessons, playing tuition and club fitting.',
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div style={{ position: 'relative' }}>
        <TownMapClient
          courses={courses}
          centerLat={centerLat}
          centerLng={centerLng}
          zoom={8.3}
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
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>Driving Ranges</li>
          </ol>
        </nav>

        <div className="course-directory__header" style={{ marginTop: 16 }}>
          <h1 className="course-directory__title">{H1}</h1>
          <p className="course-directory__subtitle">
            {courses.length} golf courses with a driving range across {groups.length} towns in the Algarve, Portugal
          </p>
        </div>

        <div style={{ maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444', margin: '16px 0 24px' }}>
          <p>
            A good warm-up makes a real difference on an unfamiliar course, and
            most golf clubs in the Algarve have a driving range for exactly that.
            {' '}{courses.length} of the region&apos;s courses have practice facilities,
            usually alongside a putting green and short-game area, and the
            majority also run a <A href="/#courses">golf academy</A> for lessons
            and club fitting.
          </p>
          <p>
            Ranges are grouped below by town — from{' '}
            <A href="/vilamoura/golf-courses">Vilamoura</A> and{' '}
            <A href="/almancil/golf-courses">Almancil</A> on the central coast to{' '}
            <A href="/lagos/golf-courses">Lagos</A> in the west and{' '}
            <A href="/tavira/golf-courses">Tavira</A> in the east. Most ranges are
            aimed at green-fee players warming up before a round, though many
            clubs sell buckets of balls to visitors — check with each club. If
            you are flying in without clubs, see our{' '}
            <A href="/club-rental">golf club rental guide</A>.
          </p>
        </div>

        {groups.map(group => (
          <div key={group.city}>
            <h2 className="course-directory__town">
              {group.slug ? (
                <A href={`/${group.slug}/golf-courses`}>Driving ranges in {group.city}</A>
              ) : (
                `Driving ranges in ${group.city}`
              )}
            </h2>
            <ul className="course-list">
              {group.courses.map(course => (
                <li key={course.id} className="course-list-item">
                  <a href={`/courses/${course.slug}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroUrl(course)}
                      alt={`Driving range at ${course.name}, Algarve`}
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
                        {course.golf_academy && ' · Golf academy'}
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
          </div>
        ))}

        <h2 className="course-directory__town">Practising before your round in the Algarve</h2>
        <div style={{ maxWidth: 700, fontSize: 14.5, lineHeight: 1.7, color: '#444' }}>
          <p>
            If you have an early tee time on a course you don&apos;t know, it is
            worth arriving 45 minutes early to hit the range, roll a few putts and
            get a feel for the greens. Ranges at the bigger resorts —{' '}
            <A href="/vilamoura/golf-courses">Vilamoura</A>,{' '}
            <A href="/golf-resorts">Quinta do Lago, Vale do Lobo</A> and{' '}
            <A href="/silves/golf-courses">Amendoeira</A> — tend to have the most
            practice space, covered bays and short-game areas.
          </p>
          <p>
            For structured lessons or a playing lesson before a big round, the
            golf academies attached to these courses take visitor bookings. And
            if you would rather not travel with your own set, our{' '}
            <A href="/club-rental">club rental guide</A> covers hire at Faro
            Airport and delivery to your course or hotel. More trip planning
            advice is in the <A href="/guide">Algarve golf guide</A>.
          </p>
        </div>
      </section>
    </>
  )
}
