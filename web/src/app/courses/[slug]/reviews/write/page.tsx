import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCourseBySlug } from '@/lib/queries'
import { formatPlayedMonth } from '@/lib/reviews'
import { ReviewForm } from '@/components/ReviewForm'
import { SiteHeader } from '@/components/SiteHeader'

// The month dropdown is built from today's date.
export const revalidate = 3600

const MONTHS_BACK = 24

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) return {}
  return {
    title: `Write a Review of ${course.name}`,
    robots: { index: false, follow: true },
  }
}

export default async function WriteReviewPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) notFound()

  const now = new Date()
  const monthOptions = Array.from({ length: MONTHS_BACK + 1 }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1))
    const value = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
    return { value, label: formatPlayedMonth(`${value}-01`) }
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: 'var(--font-body)' }}>
      <SiteHeader showBackToMap />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '20px 16px 80px' }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: 18 }}>
          <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#6a6a6a' }}>
            <li><Link href={`/courses/${slug}`} style={{ color: '#6a6a6a', textDecoration: 'none' }}>{course.name}</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href={`/courses/${slug}/reviews`} style={{ color: '#6a6a6a', textDecoration: 'none' }}>Reviews</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>Write a review</li>
          </ol>
        </nav>

        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#222', margin: '0 0 8px', lineHeight: 1.2 }}>
          Review {course.name}
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: '#555', margin: '0 0 24px' }}>
          Help other visiting golfers plan their trip. The most useful reviews tell us how the course was playing on the day —
          greens, fairways, pace of play — and when you played.
        </p>

        <ReviewForm courseSlug={slug} courseName={course.name} monthOptions={monthOptions} />
      </div>
    </div>
  )
}
