import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { PartnerForm } from './PartnerForm'

const BASE = 'https://www.algarvegolfmap.com'
const TITLE = 'Partner with Algarve Golf Map'
const DESCRIPTION =
  'Run a hotel, golf course, club rental, transfer or other golf-related business in the Algarve? Tell us what you do and we will look at how we could work together.'

const SERVICES = [
  'Hotel or resort',
  'Golf course',
  'Club rental',
  'Golf shop',
  'Transfers or car hire',
  'Academy or coaching',
  'Golf travel agent or tour operator',
]

const COLLABORATION_EXAMPLES = [
  'Listing your business on the site, or correcting the details we already show',
  'Featuring your services on the course, hotel and resort pages where they are relevant',
  'A commission or referral arrangement for bookings we send your way',
  'Guide articles where your service is genuinely useful to golfers',
]

export function generateMetadata(): Metadata {
  const url = `${BASE}/partners`
  return {
    title: 'Partner with us',
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: { title: TITLE, description: DESCRIPTION, url, siteName: 'Algarve Golf Map', locale: 'en_GB', type: 'website', images: ['/og-default.jpg'] },
  }
}

export default function PartnersPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Partner with us', item: `${BASE}/partners` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <SiteHeader />

      <section className="course-directory" id="partners">
        <nav aria-label="Breadcrumb" style={{ marginBottom: 8 }}>
          <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#6a6a6a' }}>
            <li><Link href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>Partner with us</li>
          </ol>
        </nav>

        <div className="course-directory__header" style={{ marginTop: 16 }}>
          <h1 className="course-directory__title">{TITLE}</h1>
          <p className="course-directory__subtitle">
            Run a golf-related business in the Algarve? Tell us what you do and let&apos;s see how we could work together.
          </p>
        </div>

        <p style={{ maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444', margin: '16px 0 0' }}>
          Algarve Golf Map helps golfers compare the region&apos;s courses and plan their trip: where
          to play, where to stay, how to get around and where to hire clubs. If your business makes
          that trip better, we&apos;d like to hear from you.
        </p>

        <h2 className="course-directory__town">Who we&apos;d like to hear from</h2>
        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
          {[...SERVICES, 'Others'].map(service => (
            <li
              key={service}
              style={{
                padding: '6px 12px', borderRadius: 999,
                border: '1px solid #dcdcdc', background: '#fff',
                fontSize: 13, fontWeight: 600, color: '#222',
              }}
            >
              {service}
            </li>
          ))}
        </ul>

        <h2 className="course-directory__town">How we could work together</h2>
        <div style={{ maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444' }}>
          <p style={{ margin: 0 }}>
            There&apos;s no fixed package, because what makes sense for a hotel is different from what
            makes sense for a club rental company. We look at each business individually. For example:
          </p>
          <ul style={{ margin: '12px 0 0', paddingLeft: 20, listStyle: 'disc' }}>
            {COLLABORATION_EXAMPLES.map(example => <li key={example}>{example}</li>)}
          </ul>
        </div>

        <h2 className="course-directory__town">Tell us about your business</h2>
        <PartnerForm services={SERVICES} />
      </section>
    </>
  )
}
