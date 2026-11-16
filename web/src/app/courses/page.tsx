import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { CourseStatusBadge } from '@/components/CourseStatusBadge'
import { getCourses } from '@/lib/queries'
import { TOWN_PAGES } from '@/lib/towns'
import { COURSE_STATUS, getCourseStatus, isUnbookable } from '@/data/course-status'
import type { Course } from '@/types/database'

// "List of Algarve golf courses" / "how many golf courses are in the Algarve".
// Everything here is computed from the database, so the count and the table
// change on their own when a course is added, closes or goes private.
//
// What counts as a course: one entry on our map = one course. A 27-hole venue
// (three nines) counts once; 9-hole courses count; pitch-and-putt / academy
// loops (e.g. Amendoeira's floodlit Academy course) do not.
// Checked 2026-11-16 against the FPG course list (jogargolfe.fpg.pt/listagem-de-campos):
// every FPG Algarve course is on our map, plus Ombria, Pestana Ferragudo and
// The Els Club, which the FPG list does not have yet.

const BASE = 'https://www.algarvegolfmap.com'
const PAGE_URL = `${BASE}/courses`
const LAST_CHECKED = '16 November 2026'

const H1 = 'List of Algarve golf courses'
const SEO_TITLE = 'List of Algarve golf courses: how many there are (2026)'

// The Els Club is inactive in the database (private), so getCourses() leaves it
// out. It is still a golf course in the Algarve, so it is added to the count
// and the table by hand from its status notice.
const PRIVATE_EXTRA = [
  { slug: 'victoria-els-club', name: 'The Els Club', town: 'Vilamoura', region: 'central', holes: 18, par: 72 },
] as const

const REGIONS = [
  { key: 'west', label: 'Western Algarve' },
  { key: 'central', label: 'Central Algarve' },
  { key: 'east', label: 'Eastern Algarve' },
] as const

type Row = {
  slug: string
  name: string
  town: string
  region: string
  holes: number | null
  par: number | null
  priceFrom: number | null
}

function shortTown(town: string): string {
  return town.split(' · ')[0]
}

function townHref(town: string): string | null {
  const t = TOWN_PAGES.find(p => p.towns.includes(town))
  return t ? `/${t.slug}/golf-courses` : null
}

function toRows(courses: Course[]): Row[] {
  const rows: Row[] = courses.map(c => ({
    slug: c.slug, name: c.name, town: c.town ?? '', region: c.region ?? '',
    holes: c.holes, par: c.par,
    priceFrom: isUnbookable(c.slug) ? null : c.price_from,
  }))
  for (const p of PRIVATE_EXTRA) {
    if (!rows.some(r => r.slug === p.slug) && COURSE_STATUS[p.slug]) {
      rows.push({ ...p, priceFrom: null })
    }
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name, 'en'))
}

function countWord(n: number): string {
  const words = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
  return n <= 10 ? words[n] : String(n)
}

function stats(rows: Row[]) {
  const unavailable = rows.filter(r => isUnbookable(r.slug))
  const closed = unavailable.filter(r => getCourseStatus(r.slug)?.kind === 'closed')
  const priv = unavailable.filter(r => getCourseStatus(r.slug)?.kind === 'private')
  return {
    total: rows.length,
    playable: rows.length - unavailable.length,
    closed,
    priv,
    nine: rows.filter(r => r.holes === 9).length,
    eighteen: rows.filter(r => r.holes === 18).length,
    twentySeven: rows.filter(r => r.holes === 27),
    byRegion: REGIONS.map(g => ({ ...g, rows: rows.filter(r => r.region === g.key) })),
  }
}

/** "A, B and C" */
function joinNames(names: string[]): string {
  return names.length <= 1 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

/** "San Lorenzo (closed until mid-2028)" style list of courses visitors can't book. */
function unavailableText(s: ReturnType<typeof stats>): string {
  const parts = [
    ...s.closed.map(r => `${r.name} (${getCourseStatus(r.slug)!.badge.toLowerCase()})`),
    ...s.priv.map(r => `${r.name} (a private members club)`),
  ]
  return joinNames(parts)
}

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const s = stats(toRows(await getCourses()))
  const description = `There are ${s.total} golf courses in the Algarve on our map, and ${s.playable} are open to visitors today. Full list by area with holes, par and green fees from.`
  return {
    title: { absolute: SEO_TITLE },
    description,
    alternates: { canonical: PAGE_URL },
    openGraph: {
      title: SEO_TITLE, description, url: PAGE_URL,
      siteName: 'Algarve Golf Map', locale: 'en_GB', type: 'website',
      images: ['/og-default.jpg'],
    },
  }
}

const link = { color: '#2B6090', textDecoration: 'none', fontWeight: 500 } as const

function A({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} style={link}>{children}</Link>
}

const th: React.CSSProperties = {
  textAlign: 'left', fontSize: 10.5, fontWeight: 700, color: '#6a6a6a',
  textTransform: 'uppercase', letterSpacing: '.02em',
  padding: '8px 8px', borderBottom: '1px solid #e4e4e4', whiteSpace: 'nowrap',
}
const td: React.CSSProperties = {
  fontSize: 14, color: '#333', padding: '10px 8px', overflowWrap: 'anywhere',
  borderBottom: '1px solid #f0f0f0', verticalAlign: 'top',
}
const num: React.CSSProperties = { ...td, whiteSpace: 'nowrap', textAlign: 'right' }

export default async function AllCoursesPage() {
  const rows = toRows(await getCourses())
  const s = stats(rows)
  const biggest = [...s.byRegion].sort((a, b) => b.rows.length - a.rows.length)[0]

  const answer =
    `There are ${s.total} golf courses in the Algarve on Algarve Golf Map, and ${s.playable} of them are open to visitors today. ` +
    (s.closed.length + s.priv.length > 0 ? `The other ${countWord(s.closed.length + s.priv.length)} are ${unavailableText(s)}.` : '')

  const regionSentence = joinNames(s.byRegion.map(g => `${g.rows.length} in the ${g.label.toLowerCase().replace('algarve', 'Algarve')}`))

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many golf courses are there in the Algarve?',
        acceptedAnswer: { '@type': 'Answer', text: `${answer} Other sources give different numbers because they count differently, for example treating each nine of a 27-hole venue as a separate layout.` },
      },
      {
        '@type': 'Question',
        name: 'Which part of the Algarve has the most golf courses?',
        acceptedAnswer: { '@type': 'Answer', text: `The ${biggest.label.toLowerCase().replace('algarve', 'Algarve')}, with ${biggest.rows.length} courses. Altogether there are ${regionSentence}.` },
      },
      {
        '@type': 'Question',
        name: 'How many 9-hole golf courses are there in the Algarve?',
        acceptedAnswer: { '@type': 'Answer', text: `${countWord(s.nine).replace(/^./, c => c.toUpperCase())} of the courses on our map have 9 holes. Amendoeira also has a floodlit 9-hole pitch-and-putt Academy course, which we do not count as a full course.` },
      },
    ],
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: H1,
    numberOfItems: rows.length,
    itemListElement: rows.map((r, i) => ({
      '@type': 'ListItem', position: i + 1, name: r.name, url: `${BASE}/courses/${r.slug}`,
    })),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: H1, item: PAGE_URL },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: 'var(--font-body)' }}>
        <SiteHeader showBackToMap />

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '14px 24px 80px' }}>
          <nav aria-label="Breadcrumb">
            <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#6a6a6a' }}>
              <li><Link href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>All golf courses</li>
            </ol>
          </nav>

          <h1 style={{ fontSize: 34, fontWeight: 800, color: '#222', lineHeight: 1.15, margin: '22px 0 14px' }}>{H1}</h1>

          {/* The answer, up front */}
          <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: '18px 22px', marginBottom: 22 }}>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: '#222', margin: 0 }}>{answer}</p>
            <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, margin: '16px 0 0' }}>
              {[
                { n: s.total, l: 'golf courses' },
                { n: s.playable, l: 'open to visitors' },
                ...s.byRegion.map(g => ({ n: g.rows.length, l: g.label })),
              ].map(x => (
                <div key={x.l} style={{ background: '#f6f8fa', borderRadius: 12, padding: '10px 12px' }}>
                  <dt style={{ fontSize: 26, fontWeight: 800, color: '#2B6090', lineHeight: 1.1 }}>{x.n}</dt>
                  <dd style={{ margin: '2px 0 0', fontSize: 13, color: '#555' }}>{x.l}</dd>
                </div>
              ))}
            </dl>
            <p style={{ fontSize: 12.5, color: '#767676', margin: '12px 0 0' }}>Last checked {LAST_CHECKED}.</p>
          </div>

          <Link
            href="/algarve-golf-courses-map-pdf"
            style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '12px 16px', marginBottom: 26, textDecoration: 'none' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/downloads/algarve-golf-courses-map-preview.jpg" alt="" width={84} height={59} style={{ borderRadius: 6, border: '1px solid #eee', flexShrink: 0 }} />
            <span style={{ fontSize: 15, lineHeight: 1.45, color: '#333' }}>
              <strong style={{ color: '#2B6090' }}>Download a printable map (PDF) →</strong>
              <span style={{ display: 'block', fontSize: 13.5, color: '#6a6a6a' }}>Every course on one A4 page, with towns and Faro Airport.</span>
            </span>
          </Link>

          <div style={{ fontSize: 15.5, lineHeight: 1.7, color: '#444' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#222', margin: '0 0 8px' }}>How we count them</h2>
            <p style={{ margin: '0 0 12px' }}>
              One course on our map counts as one golf course. That includes{' '}
              {s.eighteen} 18-hole courses, {countWord(s.twentySeven.length)} 27-hole venues
              ({joinNames(s.twentySeven.map(r => r.name))}), which we count once each, and{' '}
              {countWord(s.nine)} <A href="/algarve-9-hole-courses">9-hole courses</A>. Pitch-and-putt
              and academy loops, such as Amendoeira&apos;s floodlit Academy course, are not included.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              You will see other numbers elsewhere, because sources count in different ways. Top 100 Golf
              Courses, for example, talks of{' '}
              <a href="https://www.top100golfcourses.com/golf-courses/continental-europe/portugal/algarve" target="_blank" rel="noopener noreferrer nofollow" style={link}>42 layouts at 25 clubs</a>:
              some sources treat each nine of a 27-hole venue as its own layout, and some count clubs rather than
              courses. Our list includes every full-length Algarve course on the Portuguese Golf Federation&apos;s
              course list, plus newer ones it does not show yet.
            </p>
          </div>

          {/* The table, by region */}
          {s.byRegion.map(g => (
            <section key={g.key} style={{ marginTop: 30 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#222', margin: '0 0 10px' }}>
                {g.label} <span style={{ fontWeight: 500, color: '#6a6a6a' }}>· {g.rows.length} courses</span>
              </h2>
              <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #ebebeb', borderRadius: 14 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: '39%' }} />
                    <col style={{ width: '24%' }} />
                    <col style={{ width: '14%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '13%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th style={th}>Course</th>
                      <th style={th}>Area</th>
                      <th style={{ ...th, textAlign: 'right' }}>Holes</th>
                      <th style={{ ...th, textAlign: 'right' }}>Par</th>
                      <th style={{ ...th, textAlign: 'right' }}>From</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.rows.map(r => {
                      const tHref = townHref(r.town)
                      return (
                        <tr key={r.slug}>
                          <td style={td}>
                            <Link href={`/courses/${r.slug}`} style={{ ...link, fontWeight: 700 }}>{r.name}</Link>
                            <CourseStatusBadge slug={r.slug} size="sm" style={{ display: 'block', width: 'fit-content', marginTop: 4 }} />
                          </td>
                          <td style={td}>
                            {tHref ? <Link href={tHref} style={{ color: '#444', textDecoration: 'none' }}>{shortTown(r.town)}</Link> : shortTown(r.town)}
                          </td>
                          <td style={num}>{r.holes ?? '—'}</td>
                          <td style={num}>{r.par ?? '—'}</td>
                          <td style={num}>{r.priceFrom != null ? `€${r.priceFrom}` : '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ))}

          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#767676', marginTop: 14 }}>
            &ldquo;From&rdquo; is the lowest visitor green fee we list for each course. Prices change through the
            year, so open a course for its full green fees.
          </p>

          <section style={{ marginTop: 30, fontSize: 15.5, lineHeight: 1.7, color: '#444' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#222', margin: '0 0 8px' }}>Where to go next</h2>
            <p style={{ margin: 0 }}>
              See every course on the <A href="/">Algarve golf map</A>, browse courses by town, such as{' '}
              <A href="/vilamoura/golf-courses">Vilamoura</A>, <A href="/albufeira/golf-courses">Albufeira</A> or{' '}
              <A href="/lagos/golf-courses">Lagos</A>, or compare <A href="/golf-resorts">golf resorts</A> if you want to stay
              on site. Our <A href="/guide">Algarve golf guide</A> covers green fees, handicaps, transfers and more.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
