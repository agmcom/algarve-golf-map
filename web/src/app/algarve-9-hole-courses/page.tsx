import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourses, getAirports } from '@/lib/queries'
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

const H1 = 'Algarve 9 Hole Golf Courses'
const SEO_TITLE = 'Algarve 9 Hole Golf Courses | Short & Par-3 Courses'
const DESCRIPTION =
  'A map and guide to every 9-hole golf course in the Algarve — Balaia, Pine Cliffs, Vale de Milho and the Academy Course at Penina. Par, length, green fees and handicap rules for a quick round in Portugal.'

// Order the four 9-hole courses deliberately: signature layout first, the two
// beginner-friendly par-3s next, then the Penina academy course.
const SLUGS = ['pine-cliffs', 'vale-de-milho', 'balaia', 'penina-resort'] as const

export const revalidate = 3600

export function generateMetadata(): Metadata {
  const url = `${BASE}/algarve-9-hole-courses`
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

const link = { color: '#2B6090', textDecoration: 'none', fontWeight: 500 } as const

function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} style={link}>
      {children}
    </Link>
  )
}

// Long-form, course-specific copy. Facts only — designer, year, par, length and
// green fee come straight from each course's own page.
const COPY: Record<string, ReactNode> = {
  'pine-cliffs': (
    <>
      <p>
        <A href="/courses/pine-cliffs">Pine Cliffs</A> is the most spectacular of
        the Algarve&apos;s 9-hole courses. Sir Henry Cotton laid it out in 1992
        along the ochre sandstone cliffs of Olhos de Água, above Praia da
        Falésia, and at roughly 2,230 metres off the back tees it is also the
        longest nine on this list — a genuine par 33 rather than a par-3 track.
        Its signature hole, the Devil&apos;s Parlour, is a par 3 played clean
        across a gap in the cliffs with the Atlantic below.
      </p>
      <p>
        A handicap certificate is required (maximum 36 for men and ladies) and
        green fees start at around €54. The course belongs to the five-star{' '}
        <A href="/golf-resorts/pine-cliffs">Pine Cliffs Resort</A>, so it pairs
        naturally with a stay there. For a fuller schedule, it sits a short drive
        from the 18-hole layouts covered on our{' '}
        <A href="/albufeira/golf-courses">Albufeira golf courses</A> page.
      </p>
    </>
  ),
  'vale-de-milho': (
    <>
      <p>
        <A href="/courses/vale-de-milho">Vale de Milho</A> is a compact par-27
        course above the cliffs near Carvoeiro, designed by Dave Thomas and
        opened in 1990. Every hole is a short par 3, which makes it an excellent
        short-game and iron-play test as well as a relaxed round for beginners
        and families. There is no handicap requirement, and a full nine takes
        well under two hours.
      </p>
      <p>
        Many visitors use it to warm up before tackling the longer Pestana
        courses nearby — Gramacho and Vale da Pinta — or as an easy evening nine.
        See the rest of the area on our{' '}
        <A href="/carvoeiro/golf-courses">Carvoeiro golf courses</A> page, and if
        you are travelling without sticks, check{' '}
        <A href="/club-rental">where to hire golf clubs in the Algarve</A>.
      </p>
    </>
  ),
  balaia: (
    <>
      <p>
        <A href="/courses/balaia">Balaia Golf Village</A> near Albufeira is a
        9-hole, par-27 course on which every hole is a par 3. It opened in 1974
        and measures under 1,000 metres, so it is one of the most approachable
        places to play on the central Algarve coast — there is no handicap
        requirement and green fees start at around €45.
      </p>
      <p>
        The course sits inside the self-catering{' '}
        <A href="/golf-resorts/balaia-golf-village">Balaia Golf Village resort</A>
        , which makes it a convenient warm-up on an arrival day or a low-pressure
        family round between longer games at the{' '}
        <A href="/albufeira/golf-courses">18-hole Albufeira courses</A> such as
        Salgados.
      </p>
    </>
  ),
  'penina-resort': (
    <>
      <p>
        The <A href="/courses/penina-resort">Academy Course at Penina</A> is a
        9-hole, par-35 layout that Sir Henry Cotton designed as a companion to
        his 1966 Championship Course — the first purpose-built golf course in
        Portugal. At roughly 1,850 metres it plays as a proper short course
        rather than a par-3 track.
      </p>
      <p>
        Green fees start at around €28, the lowest of any 9-hole course in the
        Algarve, and there is no handicap requirement, so it works well for
        higher-handicap golfers and beginners. It shares the historic parkland
        estate of the <A href="/golf-resorts/penina">Penina Hotel &amp; Golf
        Resort</A> near Portimão — see more on our{' '}
        <A href="/portimao/golf-courses">Portimão golf courses</A> page.
      </p>
    </>
  ),
}

export default async function NineHoleCoursesPage() {
  const [allCourses, airports] = await Promise.all([getCourses(), getAirports()])

  const bySlug = new Map(allCourses.map(c => [c.slug, c]))
  const courses = SLUGS.map(s => bySlug.get(s)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  )
  const faro = airports.find(a => a.code === 'FAO') ?? null

  if (courses.length === 0) notFound()

  const centerLat = courses.reduce((sum, c) => sum + c.lat, 0) / courses.length
  const centerLng = courses.reduce((sum, c) => sum + c.lng, 0) / courses.length

  const pageUrl = `${BASE}/algarve-9-hole-courses`

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
        name: 'How many 9-hole golf courses are there in the Algarve?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Four: Pine Cliffs at Olhos de Água, Vale de Milho near Carvoeiro, Balaia Golf Village near Albufeira, and the Academy Course at the Penina resort near Portimão.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which Algarve 9-hole course is best for beginners?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Balaia and Vale de Milho are both par-3, par-27 layouts with no handicap requirement, which makes them the easiest options for beginners and families. The Academy Course at Penina is also beginner-friendly and slightly longer at par 35.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you need a handicap to play a 9-hole course in the Algarve?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Only Pine Cliffs asks for a handicap certificate, with a maximum of 36 for men and ladies. Balaia, Vale de Milho and Penina’s Academy Course have no handicap requirement.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can you play just 9 holes at the Algarve’s 18-hole courses?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Many 18-hole courses in the Algarve sell 9-hole and twilight green fees, particularly outside the summer months. Availability varies by course, so check the individual course page or contact the club directly.',
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
          zoom={9.3}
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
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>9 Hole Golf Courses</li>
          </ol>
        </nav>

        <div className="course-directory__header" style={{ marginTop: 16 }}>
          <h1 className="course-directory__title">{H1}</h1>
          <p className="course-directory__subtitle">
            {courses.length} nine-hole golf courses in the Algarve, Portugal
          </p>
        </div>

        <div style={{ maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444', margin: '16px 0 8px' }}>
          <p>
            The Algarve is best known for its championship 18-hole layouts, but
            the region also has four 9-hole golf courses that are ideal for a
            quick round, an arrival or departure day, a game with the family, or
            easing back in gently. This page maps every 9-hole course in the
            Algarve and sets out what each one offers — par, length, green fees
            and handicap requirements.
          </p>
          <p>
            Three of the four sit on the central Algarve coast between Albufeira
            and Carvoeiro; the fourth is on the historic Penina estate near
            Portimão. For the full picture, browse{' '}
            <A href="/#courses">every golf course in the Algarve</A> or read the{' '}
            <A href="/guide">Algarve golf guide</A>.
          </p>
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
                    {course.town && ` · ${course.town}`}
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
            </li>
          ))}
        </ul>

        <h2 className="course-directory__town">Algarve 9-hole courses in detail</h2>
        {courses.map(course => (
          <div key={course.id} style={{ maxWidth: 700, marginBottom: 28 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#222', margin: '0 0 8px' }}>
              <A href={`/courses/${course.slug}`}>{course.name}</A>
              <span style={{ fontWeight: 500, color: '#6a6a6a' }}>
                {' '}— 9 holes{course.par != null && `, par ${course.par}`}
              </span>
            </h3>
            <div style={{ fontSize: 14.5, lineHeight: 1.7, color: '#444' }}>
              {COPY[course.slug]}
            </div>
          </div>
        ))}

        <h2 className="course-directory__town">Planning a 9-hole round in the Algarve</h2>
        <div style={{ maxWidth: 700, fontSize: 14.5, lineHeight: 1.7, color: '#444' }}>
          <p>
            A dedicated 9-hole course is the easy way to fit golf around travel
            days, non-golfing partners or younger players. If you would rather
            play a shorter round on one of the bigger courses, many 18-hole clubs
            also offer 9-hole and twilight green fees outside the peak summer
            months — availability is listed on each{' '}
            <A href="/#courses">course page</A>.
          </p>
          <p>
            Two of the four 9-hole courses — <A href="/golf-resorts/pine-cliffs">Pine
            Cliffs</A> and <A href="/golf-resorts/penina">Penina</A> — belong to
            resorts you can stay at; see all{' '}
            <A href="/golf-resorts">golf resorts in the Algarve</A>. For clubs,
            trolleys and shoes on arrival, our{' '}
            <A href="/club-rental">club rental guide</A> covers Faro Airport and
            delivery to your course or hotel.
          </p>
        </div>
      </section>
    </>
  )
}
