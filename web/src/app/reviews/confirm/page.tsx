import { createHash } from 'crypto'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Resend } from 'resend'
import { CircleCheck, CircleAlert } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { SiteHeader } from '@/components/SiteHeader'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Confirm your review',
  robots: { index: false, follow: false },
}

type Outcome =
  | { ok: true; courseName: string; courseSlug: string }
  | { ok: false; message: string }

async function confirm(token: string | undefined): Promise<Outcome> {
  if (!token) return { ok: false, message: 'This confirmation link is incomplete.' }

  const hash = createHash('sha256').update(token).digest('hex')
  const { data: review } = await supabaseAdmin
    .from('course_reviews')
    .select('id, status, verify_expires_at, reviewer_name, rating_overall, title, course:courses(name, slug)')
    .eq('verify_token_hash', hash)
    .maybeSingle()

  if (!review || review.status !== 'unverified') {
    return { ok: false, message: 'This link has already been used or is no longer valid. If you confirmed your review before, it is waiting for approval.' }
  }
  if (review.verify_expires_at && new Date(review.verify_expires_at) < new Date()) {
    return { ok: false, message: 'This confirmation link has expired. Please submit your review again.' }
  }

  const { error } = await supabaseAdmin
    .from('course_reviews')
    .update({ status: 'pending', verified_at: new Date().toISOString(), verify_token_hash: null })
    .eq('id', review.id)
  if (error) return { ok: false, message: 'Something went wrong confirming your review. Please try the link again.' }

  const course = (Array.isArray(review.course) ? review.course[0] : review.course) as { name: string; slug: string } | null
  const courseName = course?.name ?? 'the course'

  // Let the site owner know there is a review to moderate. Failure here must not
  // break the reviewer's confirmation, so errors are only logged.
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Algarve Golf Map <contact@algarvegolfmap.com>',
      to: 'contact@algarvegolfmap.com',
      subject: `[Review] ${courseName} — ${review.rating_overall}/5 from ${review.reviewer_name}`,
      text: `New review waiting for approval.\n\n${courseName}\n"${review.title}" — ${review.rating_overall}/5 by ${review.reviewer_name}\n\nModerate it at https://www.algarvegolfmap.com/admin/reviews`,
    })
  } catch (e) {
    console.error('review admin notification error:', e)
  }

  return { ok: true, courseName, courseSlug: course?.slug ?? '' }
}

export default async function ConfirmReviewPage(
  { searchParams }: { searchParams: Promise<{ token?: string }> }
) {
  const { token } = await searchParams
  const outcome = await confirm(token)

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: 'var(--font-body)' }}>
      <SiteHeader showBackToMap />
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '56px 16px 80px' }}>
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: '36px 24px', textAlign: 'center' }}>
          {outcome.ok ? (
            <>
              <CircleCheck size={40} strokeWidth={1.6} color="#22a06b" />
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#222', margin: '14px 0 10px' }}>Thanks — your review is confirmed</h1>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#444', margin: '0 0 22px' }}>
                We check every review before publishing it, so yours will appear on the {outcome.courseName} page shortly.
                Thank you for helping other golfers plan their trip.
              </p>
              {outcome.courseSlug && (
                <Link href={`/courses/${outcome.courseSlug}`} style={btn}>Back to {outcome.courseName}</Link>
              )}
            </>
          ) : (
            <>
              <CircleAlert size={40} strokeWidth={1.6} color="#c0392b" />
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#222', margin: '14px 0 10px' }}>We couldn&apos;t confirm this review</h1>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#444', margin: '0 0 22px' }}>{outcome.message}</p>
              <Link href="/" style={btn}>Go to the map</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const btn: React.CSSProperties = {
  display: 'inline-block', padding: '12px 22px', borderRadius: 12,
  background: '#2B6090', color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none',
}
