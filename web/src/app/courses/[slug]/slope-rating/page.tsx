import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCourseBySlug, getCoursesNear } from '@/lib/queries'
import { pickTitle, pickDescription, withSiteName } from '@/lib/seo'
import { handicapRule } from '@/lib/handicap'
import {
  COURSE_RATINGS, RATINGS_SOURCE, TEE_RULES, NINE_HOLE_RATED_AS_18,
  slopeRange, hardestMenTee, hardnessRank, courseHandicap, isJuniorTee, type Tee,
} from '@/data/course-ratings'
import { CourseHandicapCalculator } from '@/components/CourseHandicapCalculator'
import { PageViewTracker } from '@/components/PageViewTracker'
import { SiteHeader } from '@/components/SiteHeader'
import { ShareButtons } from '@/components/ShareButtons'
import type { Course } from '@/types/database'

const SITE_URL = 'https://www.algarvegolfmap.com'
const PEXELS_FALLBACK = 'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop'

export const revalidate = 3600

export async function generateStaticParams() {
  return Object.keys(COURSE_RATINGS).map(slug => ({ slug }))
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function rangeText(r: { min: number; max: number }): string {
  return r.min === r.max ? `${r.max}` : `${r.min} to ${r.max}`
}

function ratingCell(t: Tee, who: 'men' | 'women'): string {
  const r = t[who]
  return r ? `${r.cr.toFixed(1)} / ${r.slope}` : '—'
}

function parCell(t: Tee): string {
  const m = t.men?.par
  const w = t.women?.par
  if (m != null && w != null && m !== w) return `${m} (men), ${w} (women)`
  return String(m ?? w ?? '—')
}

function handicapText(course: Course): string {
  const rule = handicapRule(course)
  const m = course.handicap_required_men
  const l = course.handicap_required_ladies
  if (rule === 'limit') {
    const parts = [m != null ? `${m} for men` : null, l != null ? `${l} for ladies` : null].filter(Boolean).join(' and ')
    return `${course.name} asks for a maximum handicap of ${parts}. That limit applies to your Handicap Index whichever tees you play. What changes from one set of tees to another is how many shots you receive.`
  }
  if (rule === 'none') return `${course.name} doesn't require a handicap certificate. The tees you play still change how many shots you receive.`
  if (rule === 'required') return `${course.name} asks for a handicap certificate but doesn't publish a maximum. Contact the club if you're unsure whether you can play.`
  return `We haven't been able to confirm the handicap rules at ${course.name}, so check with the club before you book.`
}

interface Faq { q: string; a: string }

function buildFaqs(course: Course): Faq[] {
  const slug = course.slug
  const top = hardestMenTee(slug)
  const men = slopeRange(slug, 'men')
  const women = slopeRange(slug, 'women')
  const faqs: Faq[] = []
  if (top && men) {
    faqs.push({
      q: `What is the slope rating of ${course.name}?`,
      a: `The official slope rating of ${course.name} is ${top.rating.slope} from its hardest men's tees${top.loop ? ` (the ${top.loop} combination)` : ''}. Across its adult men's tees it runs from ${rangeText(men)}${women ? `, and from ${rangeText(women)} for women` : ''}. A slope of 113 is standard difficulty.`,
    })
    faqs.push({
      q: `What is the course rating of ${course.name}?`,
      a: `From its hardest men's tees, ${course.name} has a course rating of ${top.rating.cr.toFixed(1)} on a par ${top.rating.par}. That is the score a scratch golfer is expected to shoot from those tees. Shorter tees have lower course ratings, shown in the table on this page.`,
    })
    const menTees = (COURSE_RATINGS[slug] ?? []).flatMap(l => l.tees).filter(t => t.men && !isJuniorTee(t))
    const shots = menTees.map(t => courseHandicap(18, t.men!))
    const lo = Math.min(...shots)
    const hi = Math.max(...shots)
    faqs.push({
      q: `How many shots does an 18 handicapper get at ${course.name}?`,
      a: lo === hi
        ? `A man with a Handicap Index of 18 has a course handicap of ${hi} at ${course.name}.`
        : `A man with a Handicap Index of 18 has a course handicap of between ${lo} and ${hi} at ${course.name}, depending on the tees. Use the calculator on this page for your own handicap.`,
    })
    if (NINE_HOLE_RATED_AS_18.includes(slug)) faqs[faqs.length - 1].a += ' These figures are for 18 holes, playing the nine twice.'
  }
  faqs.push({ q: `Do I need a handicap to play ${course.name}?`, a: handicapText(course) })
  return faqs
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  if (!COURSE_RATINGS[slug]) return {}
  const course = await getCourseBySlug(slug)
  if (!course) return {}
  const top = hardestMenTee(slug)
  const men = slopeRange(slug, 'men')
  const title = pickTitle([
    ...(top ? [`${course.name} Slope Rating: ${top.rating.slope} from the Back Tees`] : []),
    `${course.name} Slope Rating and Course Rating`,
    `${course.name} Slope Rating`,
  ])
  const description = pickDescription([
    `Official ${course.name} slope and course ratings for every tee${men ? `, slope ${men.min}–${men.max} for men` : ''}, from the Portuguese Golf Federation, plus a handicap calculator.`,
    `Official ${course.name} slope and course ratings for every tee, plus a course handicap calculator.`,
    `${course.name} slope and course ratings for every tee.`,
  ])
  const heroPhoto = course.photos?.find(p => p.is_hero)
  const ogImages = heroPhoto ? [{ url: heroPhoto.url, width: 1400, height: 600, alt: `${course.name} golf course, Algarve` }] : []
  const canonicalUrl = `${SITE_URL}/courses/${slug}/slope-rating`
  return {
    title: withSiteName(title),
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, siteName: 'Algarve Golf Map', locale: 'en_GB', type: 'website', images: ogImages },
    twitter: { card: 'summary_large_image', title, description, images: ogImages.map(i => i.url) },
  }
}

export default async function SlopeRatingPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const loops = COURSE_RATINGS[slug]
  if (!loops) notFound()
  const course = await getCourseBySlug(slug)
  if (!course) notFound()

  const top = hardestMenTee(slug)
  const men = slopeRange(slug, 'men')
  const women = slopeRange(slug, 'women')
  const nineHole = NINE_HOLE_RATED_AS_18.includes(slug)
  const rank = hardnessRank(slug)
  const menTeeCount = loops[0].tees.filter(t => t.men).length
  const hasJunior = loops.some(l => l.tees.some(isJuniorTee))

  const nearby = (await getCoursesNear(course.lat, course.lng, course.id, 8))
    .filter(n => COURSE_RATINGS[n.slug] && hardestMenTee(n.slug))
    .slice(0, 5)

  const faqs = buildFaqs(course)
  const pageUrl = `${SITE_URL}/courses/${slug}/slope-rating`
  const coursePageUrl = `${SITE_URL}/courses/${slug}`

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Golf Courses in the Algarve', item: `${SITE_URL}/#courses` },
      { '@type': 'ListItem', position: 3, name: course.name, item: coursePageUrl },
      { '@type': 'ListItem', position: 4, name: 'Slope Rating', item: pageUrl },
    ],
  }
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <>
      <PageViewTracker page="slope-rating" slug={slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/<\//g, '<\\/') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/<\//g, '<\\/') }} />

      <div style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: 'var(--font-body)' }}>
        <SiteHeader showBackToMap />

        {/* Hero */}
        <div style={{ position: 'relative', height: 300, background: '#d4e6c3', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.photos?.find(p => p.is_hero)?.url ?? PEXELS_FALLBACK}
            alt={`${course.name} golf course, Algarve`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.68) 0%, rgba(0,0,0,.12) 60%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '30px 32px 26px', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)', marginBottom: 8 }}>
              Slope &amp; course rating
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.15 }}>
              {course.name} Slope Rating
            </h1>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,.85)', marginTop: 10 }}>
              📍 {course.town}, Algarve · {course.holes} holes{course.par != null ? `, par ${course.par}` : ''}
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ maxWidth: 760, margin: '0 auto', padding: '14px 24px 0' }}>
          <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#6a6a6a' }}>
            <li><Link href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/#courses" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Golf Courses in the Algarve</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href={`/courses/${slug}`} style={{ color: '#6a6a6a', textDecoration: 'none' }}>{course.name}</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>Slope Rating</li>
          </ol>
        </nav>

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '8px 24px 80px' }}>

          {/* Intro */}
          <div style={{ fontSize: 16, lineHeight: 1.7, color: '#333', margin: '20px 0 8px' }}>
            {top && (
              <p style={{ margin: '0 0 14px' }}>
                The official slope rating of {course.name} is <strong>{top.rating.slope}</strong> from its hardest men&apos;s tees
                {top.loop ? ` (the ${top.loop} combination)` : ''}, with a course rating of <strong>{top.rating.cr.toFixed(1)}</strong> on a par {top.rating.par}.
                {men && men.min !== men.max
                  ? ` Across its adult men's tees the slope runs from ${men.min} to ${men.max}${women ? `, and from ${rangeText(women)} for women` : ''}.`
                  : women ? ` For women, the slope runs from ${rangeText(women)}.` : ''}
              </p>
            )}
            <p style={{ margin: 0 }}>
              These figures come from the Portuguese Golf Federation&apos;s course rating table, which is used to work out every
              golfer&apos;s handicap on the course. A slope of 113 is standard difficulty: the higher the number, the more shots an
              average club golfer needs compared with a scratch player.
              {nineHole ? ` ${course.name} is a 9-hole course, and the federation rates it as two loops of nine.` : ''}
            </p>
          </div>

          {/* Table(s) */}
          <section style={{ margin: '28px 0' }}>
            <h2 style={sectionTitle}>{course.name} course and slope ratings by tee</h2>
            {loops.map(loop => (
              <div key={loop.fpgName} style={{ marginBottom: 20 }}>
                {loops.length > 1 && <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#222', margin: '0 0 8px' }}>{loop.name}</h3>}
                <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid #ebebeb', background: '#fff' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, color: '#333' }}>
                    <thead>
                      <tr>
                        {['Tees', 'Men: rating / slope', 'Women: rating / slope', 'Par'].map(h => (
                          <th key={h} scope="col" style={th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loop.tees.map(t => (
                        <tr key={t.colour}>
                          <th scope="row" style={{ ...td, fontWeight: 700, color: '#222', textAlign: 'left' }}>{t.colour}</th>
                          <td style={td}>{ratingCell(t, 'men')}</td>
                          <td style={td}>{ratingCell(t, 'women')}</td>
                          <td style={td}>{parCell(t)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <p style={{ fontSize: 12, color: '#8a8a8a', margin: '4px 0 0', lineHeight: 1.6 }}>
              Tees are listed from longest to shortest. Tee colours are the names registered with the federation, and the club may use
              different names on the course.{hasJunior ? ' In Portuguese Golf Federation junior competitions, green tees are used by under-12s and purple tees by under-10s, so we leave them out of the ranges and the calculator.' : ''} Source:{' '}
              <a href={RATINGS_SOURCE.url} target="_blank" rel="noopener noreferrer" style={{ color: '#8a8a8a' }}>{RATINGS_SOURCE.label}</a>, checked {RATINGS_SOURCE.checked}.
            </p>
          </section>

          {/* Calculator */}
          <section style={{ margin: '28px 0' }}>
            <h2 style={sectionTitle}>How many shots will you get at {course.name}?</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.75, color: '#333', margin: '0 0 14px' }}>
              Enter your Handicap Index to see your course handicap from each set of tees.
            </p>
            <CourseHandicapCalculator loops={loops} courseName={course.name} nineHole={nineHole} />
          </section>

          {/* Which tees */}
          <section style={{ margin: '28px 0' }}>
            <h2 style={sectionTitle}>Which tees can you play?</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.75, color: '#333', margin: '0 0 12px' }}>{handicapText(course)}</p>
            {TEE_RULES[slug] && (
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: '#333', margin: '0 0 12px' }}>{TEE_RULES[slug]}</p>
            )}
            <p style={{ fontSize: 15.5, lineHeight: 1.75, color: '#333', margin: 0 }}>
              Clubs decide which tees visitors can use, so ask when you book. Our guide to{' '}
              <Link href="/guide/do-you-need-a-handicap-to-play-golf-in-the-algarve" style={link}>handicap rules in the Algarve</Link> covers every course.
            </p>
          </section>

          {/* How hard */}
          {rank && top && (
            <section style={{ margin: '28px 0' }}>
              <h2 style={sectionTitle}>How hard is {course.name}?</h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: '#333', margin: 0 }}>
                {rank.rank === 1
                  ? `With a slope of ${top.rating.slope} from its longest tees, ${course.name} has the highest slope rating of the ${rank.of} rated 18-hole courses in the Algarve.`
                  : `With a slope of ${top.rating.slope} from its longest tees, ${course.name} ranks ${ordinal(rank.rank)} of the ${rank.of} rated 18-hole courses in the Algarve, where 1st is the hardest.`}
                {' '}Slope doesn&apos;t measure everything, though: hills, wind and course conditions also change how a round feels.
                See the full ranking in{' '}
                <Link href="/guide/the-hardest-golf-courses-in-the-algarve" style={link}>the hardest golf courses in the Algarve</Link>
                {menTeeCount > 1 ? ', and remember that shorter tees make any course more manageable.' : '.'}
              </p>
            </section>
          )}

          {/* Nearby */}
          {nearby.length > 0 && (
            <section style={{ margin: '28px 0' }}>
              <h2 style={sectionTitle}>{course.name} vs nearby courses</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {nearby.map(n => (
                  <Link key={n.id} href={`/courses/${n.slug}/slope-rating`} style={compareRow}>
                    <span style={compareName}>⛳ {n.name}</span>
                    <span style={compareMeta}>
                      slope <strong style={{ color: '#222' }}>{hardestMenTee(n.slug)!.rating.slope}</strong> (back tees) · {n.distanceKm} km
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          <section style={{ margin: '28px 0' }}>
            <h2 style={sectionTitle}>{course.name} slope rating: FAQs</h2>
            {faqs.map(f => (
              <div key={f.q} style={{ marginBottom: 18 }}>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#222', margin: '0 0 6px' }}>{f.q}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#444', margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </section>

          {/* Closing */}
          <div style={{ fontSize: 14.5, lineHeight: 1.7, color: '#444', borderTop: '1px solid #ebebeb', paddingTop: 20 }}>
            <p style={{ margin: 0 }}>
              For the layout, facilities and how to get there, see the full{' '}
              <Link href={`/courses/${slug}`} style={link}>{course.name} course guide</Link>
              {course.price_from != null ? <>, and check the <Link href={`/courses/${slug}/green-fees`} style={link}>{course.name} green fees</Link></> : null}.
            </p>
          </div>

          <div style={{ marginTop: 28, padding: '18px 22px', borderRadius: 14, background: '#fff', border: '1px solid #ebebeb' }}>
            <ShareButtons url={pageUrl} title={`${course.name} slope rating — Algarve Golf Map`} label="Share these ratings" contentType="course" />
          </div>
        </div>
      </div>
    </>
  )
}

const link = { color: '#2B6090', textDecoration: 'none', fontWeight: 500 } as const
const th: React.CSSProperties = {
  textAlign: 'left', padding: '10px 12px', fontSize: 13, fontWeight: 700,
  color: '#6a6a6a', borderBottom: '1px solid #ebebeb', verticalAlign: 'bottom',
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
