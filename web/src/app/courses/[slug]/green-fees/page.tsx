import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCourseBySlug, getCourseSlugsWithGreenFees, getCoursesNear, getGreenFeeComparables } from '@/lib/queries'
import { summarizePrices, monthListText, PRICE_SOURCE, PRICE_SEASON, PRICE_LAST_CHECKED, type PriceSummary } from '@/lib/prices'
import { CoursePriceTable } from '@/components/CoursePriceTable'
import { PageViewTracker } from '@/components/PageViewTracker'
import { SiteHeader } from '@/components/SiteHeader'
import { townSlug } from '@/lib/towns'
import type { Course } from '@/types/database'

const SITE_URL = 'https://www.algarvegolfmap.com'
const PEXELS_FALLBACK = 'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getCourseSlugsWithGreenFees()
  return slugs.map(slug => ({ slug }))
}

// "€188–€264" or "a flat €45" for a range.
function rangeText(s: PriceSummary): string {
  const r = s.primary
  if (!r) return ''
  if (r.flat) return `a flat €${r.min}`
  return `€${r.min}–€${r.max}`
}

interface Faq { q: string; a: string }

function buildFaqs(course: Course, s: PriceSummary): Faq[] {
  const name = course.name
  const holes = s.holes ?? course.holes
  const r = s.primary
  const tw = s.twilight
  const sv = s.twilightSaving

  const buggyPhrase = s.buggyIncluded
    ? 'a shared buggy included'
    : s.buggyAddOn != null
      ? `a buggy available for about €${s.buggyAddOn}`
      : 'buggy hire arranged separately'

  const faqs: Faq[] = []

  // 1 — headline price
  if (r?.flat) {
    faqs.push({
      q: `How much does it cost to play ${name}?`,
      a: `A round at ${name} costs €${r.min} for ${holes} holes throughout the ${PRICE_SEASON} season, with ${buggyPhrase}.`,
    })
  } else if (s.twilightOnly && r) {
    faqs.push({
      q: `How much does it cost to play ${name}?`,
      a: `${name} publishes a twilight green fee of €${r.min}–€${r.max} for ${holes} holes, buggy included. It is cheapest in ${monthListText(r.minMonths)} and most expensive in ${monthListText(r.maxMonths)}.`,
    })
  } else if (r) {
    faqs.push({
      q: `How much does it cost to play ${name}?`,
      a: `Green fees at ${name} range from €${r.min} to €${r.max} for ${holes} holes in the ${PRICE_SEASON} season. The cheapest month is ${monthListText(r.minMonths)} at €${r.min}; rates peak in ${monthListText(r.maxMonths)} at €${r.max}.`,
    })
  } else if (course.price_from != null) {
    faqs.push({
      q: `How much does it cost to play ${name}?`,
      a: `${name} quotes green fees from €${course.price_from} per round. A month-by-month breakdown is not yet published — contact the club or your tour operator for exact ${PRICE_SEASON} rates.`,
    })
  }

  // 2 — cheapest time
  if (r && !r.flat) {
    faqs.push({
      q: `When is the cheapest time to play ${name}?`,
      a: `${monthListText(r.minMonths)}, when the visitor green fee drops to €${r.min}. Rates are highest in ${monthListText(r.maxMonths)} at €${r.max}. Across the Algarve, mid-summer and the quieter winter weeks are generally the best value.`,
    })
  } else if (r?.flat) {
    faqs.push({
      q: `When is the cheapest time to play ${name}?`,
      a: `${name} charges the same €${r.min} green fee every month, so there is no cheaper time of year — choose your dates on weather and tee-time availability.`,
    })
  }

  // 3 — twilight
  if (s.twilightOnly && tw) {
    faqs.push({
      q: `Does ${name} have a twilight green fee?`,
      a: `The only rate published for ${name} is a twilight green fee of ${tw.flat ? `€${tw.min}` : `€${tw.min}–€${tw.max}`} for ${holes} holes, buggy included.`,
    })
  } else if (s.hasTwilight && tw) {
    faqs.push({
      q: `Does ${name} have a twilight green fee?`,
      a: `Yes. Twilight rounds at ${name} cost ${tw.flat ? `€${tw.min}` : `€${tw.min}–€${tw.max}`}${sv ? `, around ${sv.minPct}–${sv.maxPct}% less than the standard rate` : ''}. The twilight start time shifts through the year with sunset, so confirm it when you book.`,
    })
  } else {
    faqs.push({
      q: `Does ${name} have a twilight green fee?`,
      a: `A twilight rate is not currently published for ${name}. Ask the club about late-afternoon tee times, which are often discounted.`,
    })
  }

  // 4 — buggy
  faqs.push({
    q: `Is a buggy included at ${name}?`,
    a: s.buggyIncluded
      ? `Yes — the green fee at ${name} includes a shared buggy.`
      : s.buggyAddOn != null
        ? `No, but a buggy can be added for about €${s.buggyAddOn} per round.`
        : `Buggy hire is not listed in the published rates for ${name}; expect roughly €40–€60 per cart and confirm availability with the club.`,
  })

  // 5 — how to book
  const bookParts: string[] = []
  if (course.booking_url) bookParts.push('book online in advance')
  if (course.website) bookParts.push('reserve through the official website')
  if (course.phone) bookParts.push(`call the club on ${course.phone}`)
  faqs.push({
    q: `How do I book a tee time at ${name}?`,
    a: bookParts.length > 0
      ? `You can ${joinList(bookParts)}. Tee times fill up in spring and autumn, so book ahead — and note that stay-and-play packages and golf tour operators often price rounds below the standard green fee.`
      : `Contact ${name} directly or book through a golf tour operator; packages often cost less than the standard green fee.`,
  })

  return faqs
}

function joinList(parts: string[]): string {
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return `${parts[0]} or ${parts[1]}`
  return `${parts.slice(0, -1).join(', ')} or ${parts[parts.length - 1]}`
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) return {}

  const s = summarizePrices(course.prices)
  const holes = s.holes ?? course.holes
  const range = s.primary
    ? (s.primary.flat ? `Flat €${s.primary.min}` : `€${s.primary.min}–€${s.primary.max}`)
    : course.price_from != null ? `From €${course.price_from}` : ''

  const title = `${course.name} Green Fees — Prices by Month`
  const description = `How much does it cost to play ${course.name} in ${course.town}, Algarve? ${range} for ${holes} holes, month-by-month green fees${s.hasTwilight ? ', twilight rates' : ''}, buggy hire and how to book. Updated for the ${PRICE_SEASON} season.`

  const heroPhoto = course.photos?.find(p => p.is_hero)
  const ogImages = heroPhoto
    ? [{ url: heroPhoto.url, width: 1400, height: 600, alt: `${course.name} golf course, Algarve` }]
    : []

  const canonicalUrl = `${SITE_URL}/courses/${slug}/green-fees`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Algarve Golf Map',
      locale: 'en_GB',
      type: 'website',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map(i => i.url),
    },
  }
}

export default async function GreenFeesPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) notFound()

  const s = summarizePrices(course.prices)
  if (!s.hasPrices && course.price_from == null) notFound()

  const [nearby, comparables] = await Promise.all([
    getCoursesNear(course.lat, course.lng, course.id, 6),
    getGreenFeeComparables(),
  ])
  const nearbyPriced = nearby
    .filter(n => n.price_from != null)
    .sort((a, b) => (a.price_from as number) - (b.price_from as number))

  const faqs = buildFaqs(course, s)

  const holes = s.holes ?? course.holes
  const r = s.primary
  const myPrice = course.price_from ?? r?.min ?? null
  const cheaperNearby = myPrice != null ? nearbyPriced.filter(n => (n.price_from as number) < myPrice).length : 0
  const townPath = townSlug(course.town)

  // Up to three courses in a genuinely similar price bracket, anywhere in the
  // Algarve — each links to its own green-fees page. Kept within ±30% (or ±€25)
  // of this course's "from" price so premium/budget courses don't list wildly
  // different rates; hidden below if fewer than two qualify.
  const priceBand = myPrice == null ? 0 : Math.max(25, myPrice * 0.3)
  const similarPriced = myPrice == null ? [] : comparables
    .filter(c => c.slug !== slug && Math.abs(c.priceFrom - myPrice) <= priceBand)
    .sort((a, b) => Math.abs(a.priceFrom - myPrice) - Math.abs(b.priceFrom - myPrice))
    .slice(0, 3)
    .sort((a, b) => a.priceFrom - b.priceFrom)

  const pageUrl = `${SITE_URL}/courses/${slug}/green-fees`
  const coursePageUrl = `${SITE_URL}/courses/${slug}`

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Golf Courses in the Algarve', item: `${SITE_URL}/#courses` },
      { '@type': 'ListItem', position: 3, name: course.name, item: coursePageUrl },
      { '@type': 'ListItem', position: 4, name: 'Green Fees', item: pageUrl },
    ],
  }

  const lowPrice = r?.min ?? course.price_from
  const highPrice = r?.max ?? course.price_from
  const courseOfferLd = {
    '@context': 'https://schema.org',
    '@type': ['GolfCourse', 'SportsActivityLocation'],
    '@id': `${coursePageUrl}#course`,
    name: course.name,
    url: coursePageUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: course.town,
      addressRegion: 'Algarve',
      addressCountry: 'PT',
    },
    geo: { '@type': 'GeoCoordinates', latitude: course.lat, longitude: course.lng },
    numberOfHoles: course.holes,
    ...(lowPrice != null && highPrice != null && {
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'EUR',
        lowPrice,
        highPrice,
        offerCount: s.months.length || 1,
        url: pageUrl,
        category: 'GreenFee',
        description: `${holes}-hole visitor green fee, ${PRICE_SEASON} season`,
      },
    }),
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const websiteWithUtm = course.website
    ? (course.website.includes('?') ? `${course.website}&utm_source=algarvegolfmap.com` : `${course.website}?utm_source=algarvegolfmap.com`)
    : null

  return (
    <>
      <PageViewTracker page="green-fees" slug={slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/<\//g, '<\\/') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseOfferLd).replace(/<\//g, '<\\/') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/<\//g, '<\\/') }} />

      <div style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: 'var(--font-body)' }}>
        <SiteHeader showBackToMap />

        {/* Hero */}
        <div style={{ position: 'relative', height: 340, background: '#d4e6c3', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.photos?.find(p => p.is_hero)?.url ?? PEXELS_FALLBACK}
            alt={`${course.name} golf course, Algarve`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.68) 0%, rgba(0,0,0,.12) 60%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '30px 32px 26px', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)', marginBottom: 8 }}>
              Green Fees · {PRICE_SEASON}
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.15 }}>
              {course.name} Green Fees
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
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>Green Fees</li>
          </ol>
        </nav>

        {/* Content */}
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '8px 24px 80px' }}>

          {/* Intro */}
          <div style={{ maxWidth: 700, fontSize: 16, lineHeight: 1.7, color: '#333', margin: '20px 0 8px' }}>
            <p style={{ margin: '0 0 14px' }}>
              {s.twilightOnly && r
                ? `${PRICE_SOURCE} lists only a twilight green fee for ${course.name}: ${rangeText(s)} for ${holes} holes, with a buggy included.`
                : r?.flat
                  ? `Playing ${course.name} costs ${rangeText(s)} for ${holes} holes throughout the ${PRICE_SEASON} season.`
                  : r
                    ? `A round at ${course.name} costs between €${r.min} and €${r.max} for ${holes} holes in the ${PRICE_SEASON} season, depending on the month.`
                    : `${course.name} quotes green fees from €${course.price_from} per round for the ${PRICE_SEASON} season.`}
            </p>
            <p style={{ margin: 0 }}>
              {s.buggyIncluded
                ? 'The green fee includes a shared buggy.'
                : s.buggyAddOn != null
                  ? `A buggy is optional at around €${s.buggyAddOn} per round.`
                  : 'Buggy hire is arranged separately with the club.'}
              {s.hasTwilight && !s.twilightOnly ? ' Twilight rounds are cheaper still — see below.' : ''}
              {s.coverage.label ? ` ${PRICE_SOURCE} publishes rates for ${s.coverage.label}; for other months, contact the club.` : ''}
            </p>
          </div>

          {/* Price table */}
          <section style={{ margin: '28px 0' }}>
            <h2 style={sectionTitle}>How much does it cost to play {course.name}?</h2>
            {myPrice != null && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#6a6a6a' }}>From</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 34, fontWeight: 800, color: '#222' }}>€{myPrice}</span>
                  <span style={{ fontSize: 14, color: '#6a6a6a' }}>/ {holes} holes</span>
                </div>
              </div>
            )}
            {s.hasPrices ? (
              <>
                <CoursePriceTable summary={s} variant="full" showCaption={false} />
                <p style={{ fontSize: 12, color: '#8a8a8a', margin: '8px 0 0', lineHeight: 1.6 }}>
                  Indicative {PRICE_SEASON}-season visitor rates; source: {PRICE_SOURCE}. Green fees change with demand — confirm the current rate with {course.name} when you book.
                </p>
              </>
            ) : (
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#444', margin: 0 }}>
                We don&apos;t yet have a month-by-month breakdown for {course.name}. The club quotes green fees from
                {' '}<strong>€{course.price_from}</strong>; contact them or your tour operator for exact {PRICE_SEASON} rates.
              </p>
            )}
          </section>

          {/* Cheapest time */}
          {r && (
            <section style={{ margin: '28px 0' }}>
              <h2 style={sectionTitle}>Cheapest time to play {course.name}</h2>
              {r.flat ? (
                <p style={{ fontSize: 15.5, lineHeight: 1.75, color: '#333', margin: 0 }}>
                  {course.name} charges the same €{r.min} green fee every month of the {PRICE_SEASON} season, so there is no cheaper or
                  more expensive time to play — pick your dates around the weather and tee-time availability.
                </p>
              ) : (
                <>
                  <p style={{ fontSize: 15.5, lineHeight: 1.75, color: '#333', margin: '0 0 12px' }}>
                    The lowest green fee at {course.name} is <strong>€{r.min}</strong> in {monthListText(r.minMonths)}. The highest is
                    {' '}<strong>€{r.max}</strong> in {monthListText(r.maxMonths)} — a difference of €{r.max - r.min} per round.
                    Across the Algarve, green fees peak in spring (March–May) and again in autumn (late September–October) when the
                    weather is at its best, and dip in the heat of mid-summer and the quieter winter weeks.
                  </p>
                  <div style={{ background: '#fff8f0', border: '1px solid #f0e0c8', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#7a5a2a', fontWeight: 600 }}>
                    Best value: {monthListText(r.minMonths)} — €{r.min} per round
                  </div>
                </>
              )}
            </section>
          )}

          {/* Twilight */}
          {s.hasTwilight && !s.twilightOnly && s.twilight && (
            <section style={{ margin: '28px 0' }}>
              <h2 style={sectionTitle}>Twilight green fees at {course.name}</h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: '#333', margin: 0 }}>
                {course.name} offers a twilight rate of {s.twilight.flat ? `€${s.twilight.min}` : `€${s.twilight.min}–€${s.twilight.max}`} for {holes} holes.
                {s.twilightSaving
                  ? ` That is roughly ${s.twilightSaving.minPct}–${s.twilightSaving.maxPct}% less than the standard green fee — a saving of €${s.twilightSaving.minAbs}–€${s.twilightSaving.maxAbs} per round.`
                  : ''}
                {' '}Twilight tee-off times shift through the year with sunset, so confirm the cut-off when you book and allow around four
                hours of daylight to finish 18 holes.
              </p>
            </section>
          )}
          {s.twilightOnly && (
            <section style={{ margin: '28px 0' }}>
              <h2 style={sectionTitle}>Twilight green fees at {course.name}</h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: '#333', margin: 0 }}>
                {PRICE_SOURCE} lists only a buggy-inclusive twilight rate for {course.name}, shown in the table above. For morning and
                midday tee times, ask the club for a full-price quote.
              </p>
            </section>
          )}

          {/* Buggy, clubs & extras */}
          <section style={{ margin: '28px 0' }}>
            <h2 style={sectionTitle}>Buggy, clubs &amp; extras</h2>
            <ul style={{ fontSize: 15.5, lineHeight: 1.7, color: '#333', margin: 0, paddingLeft: 20 }}>
              <li>
                {s.buggyIncluded
                  ? 'A shared buggy is included in the green fee.'
                  : s.buggyAddOn != null
                    ? `A buggy is optional at about €${s.buggyAddOn} per round.`
                    : 'Buggy hire is not listed in the published rates — ask the club; expect roughly €40–€60 per cart.'}
              </li>
              {course.offers_rental && course.rental_price_per_round != null && (
                <li>
                  Club hire from €{course.rental_price_per_round} per round
                  {course.rental_brands.length > 0 ? ` (${course.rental_brands.join(', ')})` : ''}.
                </li>
              )}
              {course.caddie_service && (
                <li>Caddies can be booked in advance through the pro shop.</li>
              )}
            </ul>
          </section>

          {/* How to book */}
          <section style={{ margin: '28px 0' }}>
            <h2 style={sectionTitle}>How to book a tee time at {course.name}</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.75, color: '#333', margin: '0 0 16px' }}>
              You can usually book {course.name} online in advance or by phone. In the busy spring and autumn months it is worth
              reserving a few weeks ahead. Golf tour operators and stay-and-play packages often price rounds below the walk-in green
              fee, especially at the premium Golden Triangle and Vilamoura courses.
            </p>
            {course.booking_url && (
              <a href={course.booking_url} target="_blank" rel="noopener noreferrer" style={ctaBtn('#2B6090', '#fff')}>
                Book Tee Time
              </a>
            )}
            {websiteWithUtm && (
              <a href={websiteWithUtm} target="_blank" rel="noopener noreferrer" style={{ ...ctaBtn('#2B6090', '#fff'), marginTop: course.booking_url ? 10 : 0 }}>
                Official website ↗
              </a>
            )}
            {course.phone && (
              <a href={`tel:${course.phone}`} style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 13, color: '#6a6a6a', textDecoration: 'none' }}>
                📞 {course.phone}
              </a>
            )}
          </section>

          {/* Nearby comparison */}
          {nearbyPriced.length > 0 && myPrice != null && (
            <section style={{ margin: '28px 0' }}>
              <h2 style={sectionTitle}>{course.name} green fees vs nearby courses</h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: '#333', margin: '0 0 14px' }}>
                {cheaperNearby === 0
                  ? `${course.name} is the most affordable of the ${nearbyPriced.length + 1} nearby courses with a published rate.`
                  : cheaperNearby === nearbyPriced.length
                    ? `${course.name} is the most expensive of the ${nearbyPriced.length + 1} nearby courses with a published rate.`
                    : `${course.name} sits mid-range on price among nearby courses.`}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {nearbyPriced.map(n => (
                  <Link key={n.id} href={`/courses/${n.slug}/green-fees`} style={compareRow}>
                    <span style={compareName}>⛳ {n.name}</span>
                    <span style={compareMeta}>
                      from <strong style={{ color: '#222' }}>€{n.price_from}</strong> · {n.distanceKm} km
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Similar green fees, anywhere in the Algarve */}
          {similarPriced.length >= 2 && (
            <section style={{ margin: '28px 0' }}>
              <h2 style={sectionTitle}>Algarve courses with similar green fees</h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: '#333', margin: '0 0 14px' }}>
                Elsewhere in the Algarve, these courses sit in the same price bracket as {course.name}.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {similarPriced.map(c => (
                  <Link key={c.slug} href={`/courses/${c.slug}/green-fees`} style={compareRow}>
                    <span style={compareName}>⛳ {c.name}</span>
                    <span style={compareMeta}>
                      from <strong style={{ color: '#222' }}>€{c.priceFrom}</strong> · {c.town.split(' · ')[0]}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          <section style={{ margin: '28px 0' }}>
            <h2 style={sectionTitle}>{course.name} green fees — FAQs</h2>
            {faqs.map(f => (
              <div key={f.q} style={{ marginBottom: 18 }}>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#222', margin: '0 0 6px' }}>{f.q}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#444', margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </section>

          {/* Closing / cross-links */}
          <div style={{ maxWidth: 700, fontSize: 14.5, lineHeight: 1.7, color: '#444', borderTop: '1px solid #ebebeb', paddingTop: 20 }}>
            <p style={{ margin: '0 0 10px' }}>
              For everything else about the course — layout, designer, facilities, nearby hotels and how to get there — see the full
              {' '}<Link href={`/courses/${slug}`} style={link}>{course.name} course guide</Link>.
              {townPath ? <> More options in the area are on the <Link href={`/${townPath}/golf-courses`} style={link}>{course.town} golf courses</Link> page.</> : null}
            </p>
            <p style={{ margin: 0 }}>
              Flying in without clubs? See our <Link href="/club-rental" style={link}>golf club rental guide</Link>. More trip-planning
              advice is in the <Link href="/guide" style={link}>Algarve golf guide</Link>.
            </p>
            <p style={{ margin: '14px 0 0', fontSize: 12, color: '#b0b0b0' }}>Prices last checked {PRICE_LAST_CHECKED}.</p>
          </div>
        </div>
      </div>
    </>
  )
}

const link = { color: '#2B6090', textDecoration: 'none', fontWeight: 500 } as const

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

function ctaBtn(bg: string, color: string): React.CSSProperties {
  return {
    display: 'block', textAlign: 'center',
    padding: '14px 0', borderRadius: 12,
    background: bg, color,
    fontSize: 15, fontWeight: 700,
    textDecoration: 'none', cursor: 'pointer',
  }
}
