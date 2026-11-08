import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { getCourses } from '@/lib/queries'
import { shortTown } from '@/lib/seo'
import { ACADEMIES, ACADEMIES_LAST_CHECKED_LABEL, type Academy } from '@/data/academies'
import type { Course } from '@/types/database'

const BASE = 'https://www.algarvegolfmap.com'

const TITLE = 'Golf academies in the Algarve'
const DESCRIPTION =
  'Every Algarve golf academy we could verify: lesson prices, beginner schools, PGA professionals and which courses each one serves.'

export const revalidate = 3600

export function generateMetadata(): Metadata {
  const url = `${BASE}/golf-academies`
  return {
    title: 'Golf academies in the Algarve: lessons and prices',
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: { title: TITLE, description: DESCRIPTION, url, siteName: 'Algarve Golf Map', locale: 'en_GB', type: 'website', images: ['/og-default.jpg'] },
  }
}

// No stock fallback: a generic course photo could be mistaken for this academy's course.
function heroUrl(course?: Course): string | undefined {
  return course?.photos?.find(p => p.is_hero)?.url ?? course?.photos?.[0]?.url
}

// West → east, so the list reads like a drive along the coast.
function sortWestToEast(items: { academy: Academy; base?: Course }[]) {
  return [...items].sort((a, b) => (a.base?.lng ?? 0) - (b.base?.lng ?? 0))
}

export default async function GolfAcademiesPage() {
  const courses = await getCourses()
  const bySlug = new Map(courses.map(c => [c.slug, c]))
  const items = sortWestToEast(ACADEMIES.map(academy => ({ academy, base: bySlug.get(academy.baseCourse) })))
  const withPrices = items.filter(i => i.academy.lessonFrom)
  const pageUrl = `${BASE}/golf-academies`

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
    numberOfItems: items.length,
    itemListElement: items.map((i, n) => ({
      '@type': 'ListItem', position: n + 1, name: i.academy.name, url: `${BASE}/golf-academies/${i.academy.slug}`,
    })),
  }

  const cheapest = withPrices.reduce<number | null>((min, i) => {
    const p = i.academy.lessonFrom!.price
    return min == null || p < min ? p : min
  }, null)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <SiteHeader showBackToMap />

      <section className="course-directory" id="golf-academies">
        <nav aria-label="Breadcrumb" style={{ marginBottom: 8 }}>
          <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#6a6a6a' }}>
            <li><Link href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>{TITLE}</li>
          </ol>
        </nav>

        <div className="course-directory__header" style={{ marginTop: 16 }}>
          <h1 className="course-directory__title">{TITLE}</h1>
          <p className="course-directory__subtitle">
            {items.length} academies and teaching programmes, from Lagos to Castro Marim
          </p>
        </div>

        <div style={{ maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444', margin: '16px 0 32px' }}>
          <p style={{ margin: '0 0 12px' }}>
            Most big Algarve resorts have a golf academy with PGA professionals, and many run short schools for beginners
            that include clubs and a first game on the course.
            {cheapest != null && <> Published prices for a 30-minute private lesson start at <strong>€{cheapest}</strong>.</>}
          </p>
          <p style={{ margin: '0 0 12px' }}>
            Every detail below comes from the academy&apos;s own website or price list, checked in {ACADEMIES_LAST_CHECKED_LABEL}.
            Where an academy doesn&apos;t publish prices we say &ldquo;price on request&rdquo;. This list isn&apos;t complete:
            other courses also offer lessons, but we only list an academy once we can confirm the details.
          </p>
          <p style={{ margin: 0 }}>
            For a side-by-side look at costs, see our guide to{' '}
            <Link href="/guide/golf-lessons-in-the-algarve" style={{ color: '#2B6090', fontWeight: 600 }}>golf lessons in the Algarve</Link>.
          </p>
        </div>

        <ul className="course-list">
          {items.map(({ academy, base }) => {
            const courseNames = academy.courses.map(s => bySlug.get(s)?.name).filter(Boolean) as string[]
            return (
              <li key={academy.slug} className="course-list-item">
                <Link href={`/golf-academies/${academy.slug}`}>
                  {heroUrl(base) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={heroUrl(base)!} alt={`${base!.name}, home of ${academy.name}`} width={80} height={80} loading="lazy" />
                  ) : (
                    <span aria-hidden="true" style={{ width: 80, height: 80, flexShrink: 0, borderRadius: 8, background: '#3d6b4f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>⛳</span>
                  )}
                  <div className="course-list-item__body">
                    <strong className="course-list-item__name">{academy.name}</strong>
                    <span className="course-list-item__meta">
                      {base ? shortTown(base.town) : ''}{courseNames.length > 0 && ` · ${courseNames.join(', ')}`}
                    </span>
                    <span className="course-list-item__badges">
                      <span className="course-list-item__price">
                        {academy.lessonFrom ? `Lessons from €${academy.lessonFrom.price} / ${academy.lessonFrom.duration}` : 'Price on request'}
                      </span>
                      {academy.beginnerProgramme && <span style={{ fontSize: 12, color: '#6a6a6a' }}>Beginner programme</span>}
                      {academy.juniors && <span style={{ fontSize: 12, color: '#6a6a6a' }}>Juniors</span>}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
