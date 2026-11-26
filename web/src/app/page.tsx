import type { Metadata } from 'next'
import { getCourses, getAirports } from '@/lib/queries'
import { HomeClient } from './HomeClient'
import { CourseDirectory } from '@/components/CourseDirectory'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const count = (await getCourses()).length
  const title = `Algarve Golf Courses Map: Compare All ${count} Courses`
  const description =
    'Interactive map of every golf course in the Algarve, Portugal. Compare green fees, difficulty, ocean views and handicap rules, then plan your golf holiday.'
  return {
    title: { absolute: title },
    description,
    openGraph: { type: 'website', siteName: 'Algarve Golf Map', locale: 'en_GB', title, description, url: '/', images: ['/og-default.jpg'] },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-default.jpg'] },
  }
}

// Tells Google the site's name, so results show "Algarve Golf Map" instead of the domain.
const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Algarve Golf Map',
  alternateName: ['AlgarveGolfMap', 'algarvegolfmap.com'],
  url: 'https://www.algarvegolfmap.com/',
}

export default async function HomePage() {
  const [courses, airports] = await Promise.all([getCourses(), getAirports()])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
      <div style={{ height: '100svh', position: 'relative' }}>
        <HomeClient courses={courses} hotels={[]} shops={[]} airports={airports} />
      </div>
      <CourseDirectory courses={courses} />
    </>
  )
}
