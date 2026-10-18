import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { MOCK_COURSES } from '@/data/courses'
import { CourseEditForm } from './CourseEditForm'

export const dynamic = 'force-dynamic'

export default async function AdminCourseEditPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const { data: course } = await supabaseAdmin
    .from('courses')
    .select('*, photos:course_photos(id, url, alt, is_hero, position)')
    .eq('slug', slug)
    .single()

  if (!course) notFound()

  // Same merge logic as getCourseBySlug: mock fills null DB fields
  const mock = MOCK_COURSES.find(c => c.slug === slug)
  const dbNonNull = Object.fromEntries(
    Object.entries(course).filter(([, v]) => v !== null && v !== undefined)
  )
  const merged = { ...mock, ...dbNonNull }

  return <CourseEditForm course={merged} />
}
