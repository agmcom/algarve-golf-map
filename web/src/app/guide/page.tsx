import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedGuidePosts, getCourses } from '@/lib/queries'
import { SiteHeader } from '@/components/SiteHeader'

const BASE = 'https://www.algarvegolfmap.com'
const TITLE = 'Algarve Golf Guide: Tips for Your Trip'

const PEXELS_FALLBACK =
  'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=640&h=400&fit=crop'

export const revalidate = 3600

type Post = Awaited<ReturnType<typeof getPublishedGuidePosts>>[number]

// The four posts that answer the first questions of a trip.
const START_HERE = [
  'how-to-plan-a-golf-trip-to-the-algarve',
  'algarve-golf-season-best-time-to-play-golf',
  'do-you-need-a-handicap-to-play-golf-in-the-algarve',
  'the-10-best-algarve-golf-courses-for-beginners',
]

// Sections are matched on the slug pattern each post series uses; anything unmatched lands in the last one.
const SECTIONS: { id: string; heading: string; intro: string; match: (p: Post) => boolean }[] = [
  {
    id: 'which-course',
    heading: 'Which course should you play?',
    intro: 'Head-to-head comparisons of courses that share a resort or a town, so you can pick the one that suits your game.',
    match: p => p.slug.includes('-vs-'),
  },
  {
    id: 'best-courses',
    heading: 'The best Algarve courses for…',
    intro: 'Shortlists for a particular kind of round: beginners, seniors, par-3 golf and ocean views.',
    match: p => /^(the-10-best|the-best|the-algarve-s-best)/.test(p.slug),
  },
  {
    id: 'where-to-stay',
    heading: 'Where to stay',
    intro: 'Hotels close to each course, chosen on guest ratings and distance, plus the hotels built on a golf estate.',
    match: p => /^(hotels-near|golf-hotels-near|algarve-hotels-with)/.test(p.slug),
  },
  {
    id: 'golf-clubs',
    heading: 'Flying with golf clubs',
    intro: 'What each airline charges to carry a golf bag to Faro, and where to hire clubs if you would rather travel light.',
    match: p => p.categories.includes('transport') || p.categories.includes('equipment'),
  },
  {
    id: 'planning',
    heading: 'Planning, lessons and handicaps',
    intro: 'The practical side of a golf trip: when to go, handicap rules, lessons and first-time golf holidays.',
    match: () => true,
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const count = (await getPublishedGuidePosts()).length
  const url = `${BASE}/guide`
  const description = `${count} practical guides to an Algarve golf trip: when to go, handicap rules, flying with golf clubs, course comparisons and where to stay.`
  return {
    title: TITLE,
    description,
    alternates: { canonical: url },
    openGraph: { title: TITLE, description, url, siteName: 'Algarve Golf Map', locale: 'en_GB', type: 'website', images: ['/og-default.jpg'] },
    twitter: { card: 'summary_large_image', title: TITLE, description },
  }
}

export default async function GuideIndexPage() {
  const [posts, courses] = await Promise.all([getPublishedGuidePosts(), getCourses()])
  const pageUrl = `${BASE}/guide`

  const bySlug = new Map(posts.map(p => [p.slug, p]))
  const featured = START_HERE.map(s => bySlug.get(s)).filter((p): p is Post => p != null)
  const featuredSlugs = new Set(featured.map(p => p.slug))

  // Each post goes in the first section it matches; featured posts aren't repeated.
  const placed = new Set<string>(featuredSlugs)
  const sections = SECTIONS.map(section => {
    const items = posts.filter(p => !placed.has(p.slug) && section.match(p))
    items.forEach(p => placed.add(p.slug))
    return { ...section, items }
  }).filter(s => s.items.length > 0)

  const faqs = [
    {
      q: 'When is the best time to play golf in the Algarve?',
      a: 'Golf is played all year. Late April to May and late September to October bring the best conditions but also the highest green fees. June to August and December to January are the cheapest months for golf, with heat in summer and shorter, wetter days in winter.',
    },
    {
      q: 'Do I need a handicap to play golf in the Algarve?',
      a: 'On most 18-hole courses, yes: the usual limit is 28 for men and 36 for ladies, and you may be asked for a certificate. Several 9-hole and par-3 courses ask for no handicap at all, which makes them the place to start if you have never had one.',
    },
    {
      q: 'How many golf courses are there in the Algarve?',
      a: `We list ${courses.length} active courses, spread along a coastline you can drive end to end in about two hours, from Lagos in the west to Castro Marim on the Spanish border.`,
    },
    {
      q: 'Should I bring my own golf clubs or hire them?',
      a: 'Most airlines flying to Faro charge a separate sports-equipment fee for a golf bag, roughly £30–£40 each way. For a short trip many golfers hire clubs instead, from companies that hand them over at Faro Airport or deliver to your hotel or course.',
    },
    {
      q: 'How much do golf lessons cost in the Algarve?',
      a: 'At the academies we checked, a 30-minute lesson with a PGA professional costs around €30–€55 and an hour around €60–€80, with cheaper rates for shared lessons.',
    },
  ]

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Guide', item: pageUrl },
    ],
  }
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: TITLE,
    url: pageUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, url: `${BASE}/guide/${p.slug}` })),
    },
  }
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd).replace(/<\//g, '<\\/') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/<\//g, '<\\/') }} />

      <div style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: 'var(--font-body)' }}>
        <SiteHeader showBackToMap />

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: 16 }}>
            <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#6a6a6a' }}>
              <li><Link href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>Guide</li>
            </ol>
          </nav>

          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#222', margin: '0 0 12px' }}>{TITLE}</h1>
          <div style={{ maxWidth: 700, fontSize: 16, lineHeight: 1.7, color: '#444', margin: '0 0 16px' }}>
            <p style={{ margin: '0 0 12px' }}>
              The Algarve has {courses.length} golf courses along a coastline you can drive end to end in about two hours,
              and golf is played here all year. That choice is the appeal, and also what makes a first trip hard to plan.
            </p>
            <p style={{ margin: 0 }}>
              These guides answer the questions golfers ask before they book: when to go, whether you need a handicap, which
              course to pick when two share a resort, where to stay, and what it costs to fly with your clubs. Every price and
              rule comes from the courses, hotels and airlines themselves.
            </p>
          </div>

          {/* Jump links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '0 0 36px' }}>
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`} style={chip}>{s.heading}</a>
            ))}
          </div>

          {featured.length > 0 && (
            <section style={{ marginBottom: 44 }}>
              <h2 style={sectionTitle}>Start here</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16 }}>
                {featured.map(post => (
                  <Link key={post.id} href={`/guide/${post.slug}`} style={card}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.hero_image_url ?? PEXELS_FALLBACK}
                      alt={post.hero_image_alt ?? post.title}
                      style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#222', margin: 0, lineHeight: 1.35 }}>{post.title}</h3>
                      {post.excerpt && <p style={{ fontSize: 13, color: '#6a6a6a', lineHeight: 1.6, margin: 0 }}>{post.excerpt}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {sections.map(section => (
            <section key={section.id} id={section.id} style={{ marginBottom: 40, scrollMarginTop: 72 }}>
              <h2 style={sectionTitle}>{section.heading}</h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#555', margin: '-4px 0 14px' }}>{section.intro}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                {section.items.map(post => (
                  <Link key={post.id} href={`/guide/${post.slug}`} style={{ ...card, flexDirection: 'row', alignItems: 'center' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.hero_image_url ?? PEXELS_FALLBACK}
                      alt={post.hero_image_alt ?? post.title}
                      loading="lazy"
                      style={{ width: 84, height: 72, objectFit: 'cover', flexShrink: 0, display: 'block' }}
                    />
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: '#222', margin: 0, padding: '10px 14px', lineHeight: 1.4 }}>
                      {post.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          <section style={{ margin: '12px 0 24px', maxWidth: 760 }}>
            <h2 style={sectionTitle}>Frequently asked questions</h2>
            {faqs.map(f => (
              <div key={f.q} style={{ marginBottom: 18 }}>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#222', margin: '0 0 6px' }}>{f.q}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#444', margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </section>

          <p style={{ maxWidth: 760, fontSize: 14.5, lineHeight: 1.7, color: '#444', borderTop: '1px solid #ebebeb', paddingTop: 20, margin: 0 }}>
            Ready to choose? Compare every course on the <Link href="/" style={link}>Algarve golf map</Link>, see{' '}
            <Link href="/golf-resorts" style={link}>golf resorts side by side</Link> or find{' '}
            <Link href="/club-rental" style={link}>golf club rental in the Algarve</Link>.
          </p>
        </div>
      </div>
    </>
  )
}

const sectionTitle: React.CSSProperties = {
  fontSize: 20, fontWeight: 700, color: '#222',
  margin: '0 0 14px', paddingBottom: 10,
  borderBottom: '2px solid #ebebeb',
}
const card: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', borderRadius: 14,
  border: '1px solid #ebebeb', background: '#fff',
  textDecoration: 'none', overflow: 'hidden',
}
const chip: React.CSSProperties = {
  display: 'inline-block', padding: '6px 12px', borderRadius: 999,
  border: '1px solid #dcdcdc', fontSize: 13, fontWeight: 600,
  color: '#222', textDecoration: 'none', background: '#fff',
}
const link: React.CSSProperties = { color: '#2B6090', textDecoration: 'none', fontWeight: 600 }
