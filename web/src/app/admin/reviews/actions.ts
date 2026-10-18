'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export type ModerateResult = { ok: true } | { ok: false; error: string }

// Recompute the denormalised courses.rating / review_count from approved reviews.
async function refreshCourseRating(courseId: string) {
  const { data } = await supabaseAdmin
    .from('course_reviews')
    .select('rating_overall')
    .eq('course_id', courseId)
    .eq('status', 'approved')

  const ratings = (data ?? []).map(r => r.rating_overall as number)
  const rating = ratings.length ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : null
  await supabaseAdmin.from('courses').update({ rating, review_count: ratings.length }).eq('id', courseId)
}

async function setStatus(id: string, status: 'approved' | 'rejected'): Promise<ModerateResult> {
  const { data: review, error } = await supabaseAdmin
    .from('course_reviews')
    .update({ status, approved_at: status === 'approved' ? new Date().toISOString() : null })
    .eq('id', id)
    .in('status', ['pending', 'approved', 'rejected'])
    .select('course_id, course:courses(slug)')
    .single()

  if (error || !review) return { ok: false, error: error?.message ?? 'Review not found' }

  await refreshCourseRating(review.course_id)

  const course = (Array.isArray(review.course) ? review.course[0] : review.course) as { slug: string } | null
  if (course?.slug) {
    revalidatePath(`/courses/${course.slug}`)
    revalidatePath(`/courses/${course.slug}/reviews`)
    revalidatePath(`/courses/${course.slug}/green-fees`)
  }
  revalidatePath('/sitemap.xml')
  revalidatePath('/admin/reviews')
  return { ok: true }
}

export async function approveReview(id: string) {
  return setStatus(id, 'approved')
}

export async function rejectReview(id: string) {
  return setStatus(id, 'rejected')
}
