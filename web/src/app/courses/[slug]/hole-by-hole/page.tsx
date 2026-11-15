import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCourseBySlug, getCoursesNear } from '@/lib/queries'
import { pickTitle, pickDescription, withSiteName } from '@/lib/seo'
import { HOLE_GUIDES, type HoleGuide, type HoleGuideHole } from '@/data/hole-guides'
import { SCORECARDS, type Scorecard, type ScorecardHole } from '@/data/scorecards'
import { COURSE_RATINGS } from '@/data/course-ratings'
import { longestTee, teeSwatch, fmtNum, parCounts } from '@/lib/scorecard'
import { HoleVideo } from '@/components/HoleVideo'
import { PageViewTracker } from '@/components/PageViewTracker'
import { SiteHeader } from '@/components/SiteHeader'
import { ShareButtons } from '@/components/ShareButtons'
import type { Course } from '@/types/database'

const SITE_URL = 'https://www.algarvegolfmap.com'
const PEXELS_FALLBACK = 'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop'

export const revalidate = 3600

export async function generateStaticParams() {
  return Object.keys(HOLE_GUIDES).map(slug => ({ slug }))
}

function monthYear(iso: string): string {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })
}

const mainHoles = (g: HoleGuide) => g.holes.filter(h => !h.alt)
const cardHole = (card: Scorecard | undefined, n: number): ScorecardHole | null =>
  card ? card.loops.flatMap(l => l.holes)[n - 1] ?? null : null

interface Faq { q: string; a: string }

/** Only facts that are on the page: stroke index from the card, "signature" where the club says so. */
function buildFaqs(course: Course, g: HoleGuide, card: Scorecard | undefined): Faq[] {
  const faqs: Faq[] = []
  const holes = mainHoles(g)
  const par = holes.reduce((a, h) => a + h.par, 0)
  const pc = parCounts(holes.map(h => ({ n: h.n, par: h.par, parLadies: null, si: null, siLadies: null, m: {} })))
  faqs.push({
    q: `What par is ${course.name}?`,
    a: `${course.name} is a par ${par} over ${holes.length} holes: ${pc[3]} par 3s, ${pc[4]} par 4s and ${pc[5]} par 5s.`,
  })
  const si1 = card ? card.loops.flatMap(l => l.holes).find(h => h.si === 1) : null
  const long = card ? longestTee(card) : null
  if (si1) {
    const gh = holes.find(h => h.n === si1.n)
    faqs.push({
      q: `What is the hardest hole at ${course.name}?`,
      a: `Hole ${si1.n}, a par ${si1.par}${long && si1.m[long.tee] ? ` of ${fmtNum(si1.m[long.tee])} m from the ${long.tee} tees` : ''}, is stroke index 1 on the club's card, the hole it rates hardest.${gh?.text ? ` ${gh.text}` : ''}`,
    })
  }
  const sig = holes.find(h => h.text && /signature hole/i.test(h.text))
  if (sig) {
    faqs.push({
      q: `What is the signature hole at ${course.name}?`,
      a: `The club calls hole ${sig.n}, a par ${sig.par}, its signature hole. ${sig.text}`,
    })
  }
  if (holes.some(h => h.video)) {
    faqs.push({
      q: `Is there a video of each hole at ${course.name}?`,
      a: `Yes. ${g.videoChannel ?? 'The club'} has published a video of every hole, and you can watch each one under its hole on this page.`,
    })
  }
  return faqs
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const g = HOLE_GUIDES[slug]
  if (!g) return {}
  const course = await getCourseBySlug(slug)
  if (!course) return {}
  const n = mainHoles(g).length
  const hasVideo = g.holes.some(h => h.video)
  const title = pickTitle([
    `${course.name} Hole by Hole: Tips for All ${n} Holes`,
    `${course.name} Hole-by-Hole Guide`,
    `${course.name} Hole by Hole`,
  ])
  const description = pickDescription([
    `${course.name} hole by hole: what each of the ${n} holes looks like, where the trouble is and how the club suggests playing it${hasVideo ? ', with a video of every hole' : ''}.`,
    `${course.name} hole-by-hole guide: layout, hazards and the club's tips for all ${n} holes.`,
    `${course.name} hole by hole: tips for every hole.`,
  ])
  const heroPhoto = course.photos?.find(p => p.is_hero)
  const ogImages = heroPhoto ? [{ url: heroPhoto.url, width: 1400, height: 600, alt: `${course.name} golf course, Algarve` }] : []
  const canonicalUrl = `${SITE_URL}/courses/${slug}/hole-by-hole`
  return {
    title: withSiteName(title),
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, siteName: 'Algarve Golf Map', locale: 'en_GB', type: 'article', images: ogImages },
    twitter: { card: 'summary_large_image', title, description, images: ogImages.map(i => i.url) },
  }
}

export default async function HoleByHolePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const g = HOLE_GUIDES[slug]
  if (!g) notFound()
  const course = await getCourseBySlug(slug)
  if (!course) notFound()

  const card = SCORECARDS[slug]
  const holes = mainHoles(g)
  const par = holes.reduce((a, h) => a + h.par, 0)
  const long = card ? longestTee(card) : null
  const hasSi = !!card && card.loops.flatMap(l => l.holes).some(h => h.si != null)
  const hasVideo = g.holes.some(h => h.video)
  const missing = holes.filter(h => !h.text).map(h => h.n)

  const nearby = (await getCoursesNear(course.lat, course.lng, course.id, 15))
    .filter(n => HOLE_GUIDES[n.slug])
    .slice(0, 5)

  const faqs = buildFaqs(course, g, card)
  const pageUrl = `${SITE_URL}/courses/${slug}/hole-by-hole`
  const coursePageUrl = `${SITE_URL}/courses/${slug}`

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Golf Courses in the Algarve', item: `${SITE_URL}/#courses` },
      { '@type': 'ListItem', position: 3, name: course.name, item: coursePageUrl },
      { '@type': 'ListItem', position: 4, name: 'Hole by hole', item: pageUrl },
    ],
  }
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${course.name} hole by hole`,
    description: `A description of each of the ${holes.length} holes at ${course.name}, ${course.town}, Algarve, with the club's own tips for playing them.`,
    url: pageUrl,
    dateModified: g.checked,
    isBasedOn: g.source.url,
    author: { '@type': 'Organization', name: 'Algarve Golf Map', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'Algarve Golf Map', url: SITE_URL },
    about: { '@type': 'GolfCourse', name: course.name, url: coursePageUrl },
  }

  const stats = [
    { label: 'Par', value: `${par}` },
    { label: 'Holes', value: `${holes.length}` },
    { label: long ? `Length (${long.tee})` : 'Length', value: long ? `${fmtNum(long.metres)} m` : course.length_meters ? `${fmtNum(course.length_meters)} m` : '—' },
  ]

  const holeStats = (h: HoleGuideHole) => {
    const c = h.alt ? null : cardHole(card, h.n)
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: 13, color: '#6a6a6a', margin: '2px 0 10px' }}>
        <span><strong style={{ color: '#222' }}>Par {h.par}</strong></span>
        {c && hasSi && c.si != null && <span>Stroke index {c.si}</span>}
        {c && card!.tees.map(t => c.m[t] != null && (
          <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span aria-hidden="true" style={{ width: 9, height: 9, borderRadius: '50%', background: teeSwatch(t), border: '1px solid rgba(0,0,0,.25)' }} />
            {t} {fmtNum(c.m[t])} m
          </span>
        ))}
      </div>
    )
  }

  return (
    <>
      <PageViewTracker page="hole_by_hole" slug={slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/<\//g, '<\\/') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/<\//g, '<\\/') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd).replace(/<\//g, '<\\/') }} />
      <style>{`
        .hole-jump a:hover { background: #222 !important; color: #fff !important; }
        .hole-card { scroll-margin-top: 80px; }
        @media print {
          header, nav, .no-print { display: none !important; }
          .print-hero { height: auto !important; background: none !important; }
          .print-hero img, .print-hero .hero-shade { display: none !important; }
          .print-hero .hero-text { position: static !important; padding: 0 0 12px !important; }
          .print-hero .hero-text * { color: #000 !important; }
          .hole-card { break-inside: avoid; }
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
              Course guide
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.15 }}>
              {course.name} hole by hole
            </h1>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,.85)', marginTop: 10 }}>
              {course.town}, Algarve · {holes.length} holes, par {par}{hasVideo ? ' · video of every hole' : ''}
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
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>Hole by hole</li>
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
              What each hole at {course.name} looks like, where the trouble is and how the club suggests playing it.
              {' '}The notes are our summary of the club&apos;s own hole-by-hole guide
              {card ? <>, with par{hasSi ? ', stroke index' : ''} and metres from the <Link href={`/courses/${slug}/scorecard`} style={link}>official scorecard</Link></> : null}.
              {hasVideo ? <> Under every hole there is the club&apos;s own video of it.</> : null}
            </p>
          </div>

          {/* Jump to hole */}
          <nav aria-label="Jump to a hole" className="hole-jump no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '18px 0 6px' }}>
            {holes.map(h => (
              <a key={h.n} href={`#hole-${h.n}`} style={{
                width: 38, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 10, border: '1px solid #dcdcdc', background: '#fff', color: '#333',
                fontSize: 13.5, fontWeight: 700, textDecoration: 'none',
              }}>{h.n}</a>
            ))}
          </nav>

          {/* Holes */}
          <section style={{ margin: '22px 0' }}>
            <h2 style={sectionTitle}>All {holes.length} holes at {course.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {holes.map(h => {
                const alts = g.holes.filter(a => a.alt && a.n === h.n)
                return (
                  <article key={h.n} id={`hole-${h.n}`} className="hole-card" style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '16px 18px' }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#222', margin: 0 }}>Hole {h.n}</h3>
                    {holeStats(h)}
                    {h.text ? (
                      <p style={holeText}>{h.text}</p>
                    ) : (
                      <p style={{ ...holeText, color: '#8a8a8a', fontStyle: 'italic' }}>
                        The club&apos;s guide doesn&apos;t give a reliable description of this hole, so we&apos;ve left it out rather than guess.
                      </p>
                    )}
                    {alts.map(a => (
                      <div key={a.alt} style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed #e4e4e4' }}>
                        <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#222', margin: 0 }}>Alternative hole {a.alt}</h4>
                        {holeStats(a)}
                        {a.text && <p style={holeText}>{a.text}</p>}
                      </div>
                    ))}
                    {h.video && <HoleVideo id={h.video} title={`${course.name}, hole ${h.n}`} />}
                  </article>
                )
              })}
            </div>
            <p style={{ fontSize: 12, color: '#8a8a8a', margin: '12px 0 0', lineHeight: 1.6 }}>
              Source: <a href={g.source.url} target="_blank" rel="noopener noreferrer" style={{ color: '#8a8a8a' }}>{course.name} official hole-by-hole guide</a>, summarised in our own words, checked {monthYear(g.checked)}.
              {hasVideo && g.videoChannel ? ` Videos: ${g.videoChannel} on YouTube.` : ''}
              {missing.length ? ` Hole${missing.length > 1 ? 's' : ''} ${missing.join(' and ')} ${missing.length > 1 ? 'have' : 'has'} no description because the club's page repeats the same text for ${missing.length > 1 ? 'them' : 'it'}.` : ''}
              {' '}Courses change bunkers, tees and hazards over time, so ask the pro shop about anything new before your round.
            </p>
          </section>

          {/* Nearby */}
          {nearby.length > 0 && (
            <section className="no-print" style={{ margin: '28px 0' }}>
              <h2 style={sectionTitle}>Nearby courses, hole by hole</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {nearby.map(n => (
                  <Link key={n.id} href={`/courses/${n.slug}/hole-by-hole`} style={compareRow}>
                    <span style={compareName}>{n.name}</span>
                    <span style={compareMeta}>par {mainHoles(HOLE_GUIDES[n.slug]).reduce((a, h) => a + h.par, 0)} · {n.distanceKm} km</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          <section style={{ margin: '28px 0' }}>
            <h2 style={sectionTitle}>{course.name} hole by hole: FAQs</h2>
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
              {card ? <>For the full card, see the <Link href={`/courses/${slug}/scorecard`} style={link}>{course.name} scorecard</Link>. </> : null}
              {COURSE_RATINGS[slug] ? <>To work out your shots from each tee, use the <Link href={`/courses/${slug}/slope-rating`} style={link}>{course.name} slope rating</Link> page. </> : null}
              For facilities, handicap rules and how to get there, see the full{' '}
              <Link href={`/courses/${slug}`} style={link}>{course.name} course guide</Link>
              {course.price_from != null ? <>, and check the <Link href={`/courses/${slug}/green-fees`} style={link}>{course.name} green fees</Link></> : null}.
            </p>
          </div>

          <div className="no-print" style={{ marginTop: 28, padding: '18px 22px', borderRadius: 14, background: '#fff', border: '1px solid #ebebeb' }}>
            <ShareButtons url={pageUrl} title={`${course.name} hole by hole — Algarve Golf Map`} label="Share this guide" contentType="course" />
          </div>
        </div>
      </div>
    </>
  )
}

const link = { color: '#2B6090', textDecoration: 'none', fontWeight: 500 } as const
const holeText: React.CSSProperties = { fontSize: 15.5, lineHeight: 1.7, color: '#333', margin: 0 }
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
