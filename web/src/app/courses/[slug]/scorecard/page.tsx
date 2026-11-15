import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCourseBySlug, getCoursesNear } from '@/lib/queries'
import { pickTitle, pickDescription, withSiteName } from '@/lib/seo'
import { SCORECARDS, type Scorecard } from '@/data/scorecards'
import { HOLE_GUIDES } from '@/data/hole-guides'
import { COURSE_RATINGS, isJuniorTee } from '@/data/course-ratings'
import {
  allHoles, parOf, parCounts, longestTee, shortestTee, longestHole, shortestHole, hardestHole,
  isSingle18, isNine, loopPairs, teeLength, teeSwatch, toYards, fmtNum,
} from '@/lib/scorecard'
import { ScorecardTable } from '@/components/ScorecardTable'
import { PageViewTracker } from '@/components/PageViewTracker'
import { SiteHeader } from '@/components/SiteHeader'
import { ShareButtons } from '@/components/ShareButtons'
import type { Course } from '@/types/database'

const SITE_URL = 'https://www.algarvegolfmap.com'
const PEXELS_FALLBACK = 'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop'

export const revalidate = 3600

export async function generateStaticParams() {
  return Object.keys(SCORECARDS).map(slug => ({ slug }))
}

function monthYear(iso: string): string {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })
}

const m = (n: number) => `${fmtNum(n)} m`
const my = (n: number) => `${fmtNum(n)} metres (${fmtNum(toYards(n))} yards)`

function holeLabel(loop: string | null, n: number, card: Scorecard): string {
  return card.loops.length > 1 && loop ? `hole ${n} of the ${loop} loop` : `hole ${n}`
}

/** Men's FPG slope for a scorecard tee, when the tee names match (single-loop courses only). */
function slopeFor(slug: string, tee: string): number | null {
  const loops = COURSE_RATINGS[slug]
  if (!loops || loops.length !== 1) return null
  const t = loops[0].tees.find(x => !isJuniorTee(x) && x.colour.toLowerCase() === tee.toLowerCase())
  return t?.men?.slope ?? t?.women?.slope ?? null
}

interface Faq { q: string; a: string }

function buildFaqs(course: Course, card: Scorecard): Faq[] {
  const holes = allHoles(card)
  const faqs: Faq[] = []
  const long = longestTee(card)
  const short = shortestTee(card)
  const pc = parCounts(holes)
  const breakdown = [pc[3] && `${pc[3]} par 3${pc[3] > 1 ? 's' : ''}`, pc[4] && `${pc[4]} par 4${pc[4] > 1 ? 's' : ''}`, pc[5] && `${pc[5]} par 5${pc[5] > 1 ? 's' : ''}`]
    .filter(Boolean).join(', ')

  if (card.loops.length > 1) {
    const pairs = loopPairs(card)
    faqs.push({
      q: `How many holes does ${course.name} have?`,
      a: `${course.name} has ${holes.length} holes in ${card.loops.length} loops of nine: ${card.loops.map(l => l.name).join(', ')}. An 18-hole round combines two of them${pairs.length ? `, and the par of each combination is ${[...new Set(pairs.map(([a, b]) => parOf(a.holes) + parOf(b.holes)))].join(' or ')}` : ''}. The club decides which loops are in play on the day.`,
    })
  } else {
    faqs.push({
      q: `What par is ${course.name}?`,
      a: isNine(card)
        ? `${course.name} is a 9-hole course with a par of ${parOf(holes)} (${breakdown}). Playing the nine twice makes a par ${parOf(holes) * 2} round.`
        : `${course.name} is a par ${parOf(holes)}, with ${breakdown}.`,
    })
  }
  if (long) {
    faqs.push({
      q: `How long is ${course.name}?`,
      a: card.loops.length > 1
        ? `Each loop of nine measures between ${m(Math.min(...card.loops.map(l => teeLength(l.holes, long.tee) ?? Infinity)))} and ${m(Math.max(...card.loops.map(l => teeLength(l.holes, long.tee) ?? 0)))} from the ${long.tee} tees. See the table of 18-hole combinations on this page for full-round lengths.`
        : `From the ${long.tee} tees, ${course.name} measures ${my(long.metres)}.${short && short.tee !== long.tee ? ` The shortest tees, ${short.tee}, play ${my(short.metres)}.` : ''}`,
    })
  }
  const hard = hardestHole(card)
  if (hard && long) {
    faqs.push({
      q: `What is the hardest hole at ${course.name}?`,
      a: `On the club's card, hole ${hard.n} is stroke index 1, the hole rated hardest. It is a par ${hard.par} of ${m(hard.m[long.tee])} from the ${long.tee} tees. Stroke index is also where you receive your first handicap shot.`,
    })
  }
  const lh = longestHole(card)
  if (lh) {
    faqs.push({
      q: `What is the longest hole at ${course.name}?`,
      a: `The longest is ${holeLabel(lh.loop, lh.hole.n, card)}, a par ${lh.hole.par} of ${my(lh.metres)} from the ${lh.tee} tees.`,
    })
  }
  faqs.push({
    q: `Where can I get the official ${course.name} scorecard?`,
    a: `The table on this page is transcribed from the club's own card (the ${course.name} ${card.source.label}), checked in ${monthYear(card.checked)}. You'll also be given a printed card at the pro shop when you check in, and you can print this page.`,
  })
  return faqs
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const card = SCORECARDS[slug]
  if (!card) return {}
  const course = await getCourseBySlug(slug)
  if (!course) return {}
  const holes = allHoles(card)
  const par = parOf(holes)
  const long = longestTee(card)
  const multi = card.loops.length > 1
  const title = pickTitle([
    ...(!multi && long ? [`${course.name} Scorecard: Par ${par}, ${fmtNum(long.metres)} m`] : []),
    `${course.name} Scorecard and Hole Lengths`,
    `${course.name} Scorecard`,
  ])
  const siWord = holes.some(h => h.si != null) ? 'par, stroke index and metres or yards' : 'par and metres or yards'
  const teeWord = card.tees.length === 2 ? 'both tees' : card.tees.length === 1 ? 'the tee' : `all ${card.tees.length} tees`
  const description = pickDescription([
    `Hole-by-hole ${course.name} scorecard: ${siWord} from ${teeWord}${!multi && long ? `. Par ${par}, ${fmtNum(long.metres)} m from the ${long.tee} tees` : ''}.`,
    `Hole-by-hole ${course.name} scorecard: ${siWord} from ${teeWord}, from the club's official card.`,
    `${course.name} scorecard: par and length of every hole.`,
  ])
  const heroPhoto = course.photos?.find(p => p.is_hero)
  const ogImages = heroPhoto ? [{ url: heroPhoto.url, width: 1400, height: 600, alt: `${course.name} golf course, Algarve` }] : []
  const canonicalUrl = `${SITE_URL}/courses/${slug}/scorecard`
  return {
    title: withSiteName(title),
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, siteName: 'Algarve Golf Map', locale: 'en_GB', type: 'website', images: ogImages },
    twitter: { card: 'summary_large_image', title, description, images: ogImages.map(i => i.url) },
  }
}

export default async function ScorecardPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const card = SCORECARDS[slug]
  if (!card) notFound()
  const course = await getCourseBySlug(slug)
  if (!course) notFound()

  const holes = allHoles(card)
  const par = parOf(holes)
  const pc = parCounts(holes)
  const long = longestTee(card)
  const short = shortestTee(card)
  const lh = longestHole(card)
  const sh = shortestHole(card)
  const hard = hardestHole(card)
  const multi = card.loops.length > 1
  const nine = isNine(card)
  const hasSi = holes.some(h => h.si != null)
  const pairs = loopPairs(card)
  const hasSlopePage = !!COURSE_RATINGS[slug]
  const teeRows = card.tees
    .map(t => ({ tee: t, metres: teeLength(holes, t), slope: slopeFor(slug, t) }))
    .filter((r): r is { tee: string; metres: number; slope: number | null } => r.metres != null)
  const showSlopeCol = teeRows.some(r => r.slope != null)

  const nearby = (await getCoursesNear(course.lat, course.lng, course.id, 10))
    .filter(n => SCORECARDS[n.slug])
    .slice(0, 5)

  const faqs = buildFaqs(course, card)
  const pageUrl = `${SITE_URL}/courses/${slug}/scorecard`
  const coursePageUrl = `${SITE_URL}/courses/${slug}`

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Golf Courses in the Algarve', item: `${SITE_URL}/#courses` },
      { '@type': 'ListItem', position: 3, name: course.name, item: coursePageUrl },
      { '@type': 'ListItem', position: 4, name: 'Scorecard', item: pageUrl },
    ],
  }
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  const datasetLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${course.name} scorecard`,
    description: `Par${holes.some(h => h.si != null) ? ', stroke index' : ''} and length in metres of every hole at ${course.name}, ${course.town}, Algarve, from each set of tees.`,
    url: pageUrl,
    isBasedOn: card.source.url,
    dateModified: card.checked,
    creator: { '@type': 'Organization', name: 'Algarve Golf Map', url: SITE_URL },
    spatialCoverage: { '@type': 'Place', name: `${course.name}, Algarve, Portugal`, geo: { '@type': 'GeoCoordinates', latitude: course.lat, longitude: course.lng } },
  }

  const stats = [
    { label: nine ? 'Par (9 holes)' : multi ? 'Holes' : 'Par', value: multi ? `${holes.length}` : `${par}` },
    { label: multi ? 'Loops' : 'Length', value: multi ? `${card.loops.length} × 9` : long ? m(long.metres) : '—' },
    { label: 'Tees', value: `${card.tees.length}` },
  ]

  return (
    <>
      <PageViewTracker page="scorecard" slug={slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/<\//g, '<\\/') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/<\//g, '<\\/') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd).replace(/<\//g, '<\\/') }} />
      <style>{`
        @media print {
          header, nav, .no-print, .scorecard-controls { display: none !important; }
          .print-hero { height: auto !important; background: none !important; }
          .print-hero img, .print-hero .hero-shade { display: none !important; }
          .print-hero .hero-text { position: static !important; padding: 0 0 12px !important; }
          .print-hero .hero-text * { color: #000 !important; }
          body { background: #fff !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: 'var(--font-body)' }}>
        <SiteHeader back={{ href: `/courses/${slug}`, label: `Back to ${course.name}`, shortLabel: 'Course' }} />

        {/* Hero */}
        <div className="print-hero" style={{ position: 'relative', height: 300, background: '#d4e6c3', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.photos?.find(p => p.is_hero)?.url ?? PEXELS_FALLBACK}
            alt={`${course.name} golf course, Algarve`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div className="hero-shade" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.68) 0%, rgba(0,0,0,.12) 60%)' }} />
          <div className="hero-text" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '30px 32px 26px', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)', marginBottom: 8 }}>
              Official scorecard
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.15 }}>
              {course.name} Scorecard
            </h1>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,.85)', marginTop: 10 }}>
              {course.town}, Algarve · {holes.length} holes{!multi ? `, par ${par}` : ''}
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ maxWidth: 860, margin: '0 auto', padding: '14px 24px 0' }}>
          <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#6a6a6a' }}>
            <li><Link href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/#courses" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Golf Courses in the Algarve</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href={`/courses/${slug}`} style={{ color: '#6a6a6a', textDecoration: 'none' }}>{course.name}</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>Scorecard</li>
          </ol>
        </nav>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '8px 24px 80px' }}>

          {/* Key facts */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#ebebeb',
            border: '1px solid #ebebeb', borderRadius: 16, overflow: 'hidden', margin: '20px 0 0',
          }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: '#fff', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', color: '#9a9a9a', marginBottom: 5 }}>{s.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#222' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Intro */}
          <div style={{ fontSize: 16, lineHeight: 1.7, color: '#333', margin: '20px 0 8px' }}>
            <p style={{ margin: 0 }}>
              {multi ? (
                <>
                  {course.name} has {holes.length} holes in {card.loops.length} loops of nine ({card.loops.map(l => l.name).join(', ')}), and an 18-hole round combines two of them.
                  {' '}Below is the par{hasSi ? ', stroke index' : ''} and length of every hole from each of its {card.tees.length} sets of tees.
                </>
              ) : (
                <>
                  {course.name} is a {nine ? '9-hole ' : ''}par {par}
                  {long ? <> measuring <strong>{m(long.metres)}</strong> from the {long.tee} tees</> : null}
                  {short && long && short.tee !== long.tee ? <> and {m(short.metres)} from the {short.tee} tees</> : null}.
                  {' '}It has {[pc[3] && `${pc[3]} par 3s`, pc[4] && `${pc[4]} par 4s`, pc[5] && `${pc[5]} par 5s`].filter(Boolean).join(', ')}.
                  {' '}Below is the par{hasSi ? ', stroke index' : ''} and length of every hole from each of its {card.tees.length} sets of tees.
                </>
              )}
            </p>
          </div>

          {/* Scorecard */}
          <section style={{ margin: '28px 0' }}>
            <h2 style={sectionTitle}>{course.name} scorecard</h2>
            <ScorecardTable card={card} courseName={course.name} />
            <p style={{ fontSize: 12, color: '#8a8a8a', margin: '8px 0 0', lineHeight: 1.6 }}>
              Source:{' '}
              <a href={card.source.url} target="_blank" rel="noopener noreferrer" style={{ color: '#8a8a8a' }}>{course.name} {card.source.label}</a>, checked {monthYear(card.checked)}.
              {' '}Clubs sometimes move tees or change the card after course works, so the card you&apos;re given at the club is the one that counts.
              {card.notes.map(n => ` ${n}`).join('')}
            </p>
          </section>

          {/* Holes at a glance */}
          {lh && (
            <section style={{ margin: '28px 0' }}>
              <h2 style={sectionTitle}>{course.name} holes at a glance</h2>
              <ul style={{ fontSize: 15.5, lineHeight: 1.8, color: '#333', margin: 0, paddingLeft: 20 }}>
                <li>
                  <strong>Par mix:</strong> {[pc[3] && `${pc[3]} par 3s`, pc[4] && `${pc[4]} par 4s`, pc[5] && `${pc[5]} par 5s`, pc[6] && `${pc[6]} par 6s`].filter(Boolean).join(', ')}
                  {multi ? ` across the ${holes.length} holes` : ''}.
                </li>
                <li>
                  <strong>Longest hole:</strong> {holeLabel(lh.loop, lh.hole.n, card)}, a par {lh.hole.par} of {my(lh.metres)} from the {lh.tee} tees.
                </li>
                {sh && (
                  <li>
                    <strong>Shortest hole:</strong> {holeLabel(sh.loop, sh.hole.n, card)}, a par {sh.hole.par} of {m(sh.metres)} from the {sh.tee} tees.
                  </li>
                )}
                {hard && long && (
                  <li>
                    <strong>Hardest hole on the card:</strong> hole {hard.n} (stroke index 1), a par {hard.par} of {m(hard.m[long.tee])} from the {long.tee} tees.
                  </li>
                )}
                {isSingle18(card) && (
                  <li>
                    <strong>Front and back nine:</strong> the front nine is par {parOf(holes.slice(0, 9))}
                    {long ? ` (${m(teeLength(holes.slice(0, 9), long.tee)!)})` : ''} and the back nine par {parOf(holes.slice(9))}
                    {long ? ` (${m(teeLength(holes.slice(9), long.tee)!)})` : ''}{long ? `, from the ${long.tee} tees` : ''}.
                  </li>
                )}
              </ul>
            </section>
          )}

          {/* 27-hole combinations */}
          {pairs.length > 0 && long && (
            <section style={{ margin: '28px 0' }}>
              <h2 style={sectionTitle}>18-hole combinations</h2>
              <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid #ebebeb', background: '#fff' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, color: '#333' }}>
                  <thead>
                    <tr>
                      {['Combination', 'Par', ...card.tees].map(h => <th key={h} scope="col" style={th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {pairs.map(([a, b]) => (
                      <tr key={`${a.name}-${b.name}`}>
                        <th scope="row" style={{ ...td, fontWeight: 700, color: '#222', textAlign: 'left' }}>{a.name} + {b.name}</th>
                        <td style={td}>{parOf(a.holes) + parOf(b.holes)}</td>
                        {card.tees.map(t => {
                          const len = teeLength([...a.holes, ...b.holes], t)
                          return <td key={t} style={td}>{len != null ? m(len) : '—'}</td>
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: 12, color: '#8a8a8a', margin: '6px 0 0', lineHeight: 1.6 }}>
                Lengths added up from the hole-by-hole card. Which loops you play depends on the club&apos;s tee sheet that day.
              </p>
            </section>
          )}

          {/* Length by tee */}
          {!multi && teeRows.length > 1 && (
            <section style={{ margin: '28px 0' }}>
              <h2 style={sectionTitle}>How long is {course.name} from each tee?</h2>
              <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid #ebebeb', background: '#fff' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, color: '#333' }}>
                  <thead>
                    <tr>
                      {['Tees', 'Metres', 'Yards', ...(showSlopeCol ? ['Slope'] : [])].map(h => <th key={h} scope="col" style={th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {teeRows.map(r => (
                      <tr key={r.tee}>
                        <th scope="row" style={{ ...td, fontWeight: 700, color: '#222', textAlign: 'left' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                            <span aria-hidden="true" style={{ width: 11, height: 11, borderRadius: '50%', background: teeSwatch(r.tee), border: '1px solid rgba(0,0,0,.25)' }} />
                            {r.tee}
                          </span>
                        </th>
                        <td style={td}>{fmtNum(r.metres)}</td>
                        <td style={td}>{fmtNum(toYards(r.metres))}</td>
                        {showSlopeCol && <td style={td}>{r.slope ?? '—'}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {hasSlopePage && (
                <p style={{ fontSize: 15, lineHeight: 1.7, color: '#333', margin: '12px 0 0' }}>
                  {showSlopeCol ? 'Slope is the men\'s rating where the federation rates that tee for men, otherwise the women\'s. ' : ''}
                  To see how many shots you get from each tee, use the calculator on the{' '}
                  <Link href={`/courses/${slug}/slope-rating`} style={link}>{course.name} slope rating</Link> page.
                </p>
              )}
            </section>
          )}

          {/* Nearby */}
          {nearby.length > 0 && (
            <section className="no-print" style={{ margin: '28px 0' }}>
              <h2 style={sectionTitle}>Scorecards of nearby courses</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {nearby.map(n => {
                  const c = SCORECARDS[n.slug]
                  const nl = longestTee(c)
                  const nm = c.loops.length > 1
                  return (
                    <Link key={n.id} href={`/courses/${n.slug}/scorecard`} style={compareRow}>
                      <span style={compareName}>{n.name}</span>
                      <span style={compareMeta}>
                        {nm ? `${allHoles(c).length} holes` : `par ${parOf(allHoles(c))}${nl ? ` · ${m(nl.metres)}` : ''}`} · {n.distanceKm} km
                      </span>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* FAQs */}
          <section style={{ margin: '28px 0' }}>
            <h2 style={sectionTitle}>{course.name} scorecard: FAQs</h2>
            {faqs.map(f => (
              <div key={f.q} style={{ marginBottom: 18 }}>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#222', margin: '0 0 6px' }}>{f.q}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#444', margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </section>

          {/* Closing */}
          <div className="no-print" style={{ fontSize: 14.5, lineHeight: 1.7, color: '#444', borderTop: '1px solid #ebebeb', paddingTop: 20 }}>
            <p style={{ margin: 0 }}>
              {HOLE_GUIDES[slug] ? <>For what each hole looks like and how to play it, see <Link href={`/courses/${slug}/hole-by-hole`} style={link}>{course.name} hole by hole</Link>. </> : null}
              For facilities, handicap rules and how to get there, see the full{' '}
              <Link href={`/courses/${slug}`} style={link}>{course.name} course guide</Link>
              {course.price_from != null ? <>, and check the <Link href={`/courses/${slug}/green-fees`} style={link}>{course.name} green fees</Link></> : null}.
            </p>
          </div>

          <div className="no-print" style={{ marginTop: 28, padding: '18px 22px', borderRadius: 14, background: '#fff', border: '1px solid #ebebeb' }}>
            <ShareButtons url={pageUrl} title={`${course.name} scorecard — Algarve Golf Map`} label="Share this scorecard" contentType="course" />
          </div>
        </div>
      </div>
    </>
  )
}

const link = { color: '#2B6090', textDecoration: 'none', fontWeight: 500 } as const
const th: React.CSSProperties = {
  textAlign: 'left', padding: '10px 12px', fontSize: 13, fontWeight: 700,
  color: '#6a6a6a', borderBottom: '1px solid #ebebeb', verticalAlign: 'bottom', whiteSpace: 'nowrap',
}
const td: React.CSSProperties = { padding: '10px 12px', borderBottom: '1px solid #f2f2f2', whiteSpace: 'nowrap' }
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
const sectionTitle: React.CSSProperties = {
  fontSize: 18, fontWeight: 700, color: '#222',
  margin: '0 0 16px', paddingBottom: 10,
  borderBottom: '2px solid #ebebeb',
}
