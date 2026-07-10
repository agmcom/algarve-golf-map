import type { Course } from '@/types/database'
import { townSlug } from '@/lib/towns'

interface Props {
  courses: Course[]
}

const PEXELS_FALLBACK =
  'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop'

function heroUrl(course: Course): string {
  return (
    course.photos?.find(p => p.is_hero)?.url ??
    course.photos?.[0]?.url ??
    PEXELS_FALLBACK
  )
}

function groupByTown(courses: Course[]): { town: string; courses: Course[] }[] {
  const map = new Map<string, Course[]>()
  for (const course of courses) {
    const town = course.town ?? 'Algarve'
    if (!map.has(town)) map.set(town, [])
    map.get(town)!.push(course)
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([town, courses]) => ({ town, courses }))
}

export function CourseDirectory({ courses }: Props) {
  const groups = groupByTown(courses)

  return (
    <section className="course-directory" id="courses">
      <div className="course-directory__header">
        <h2 className="course-directory__title">Golf Courses in the Algarve</h2>
        <p className="course-directory__subtitle">
          {courses.length} courses across the Algarve — from Lagos to Vila Real de Santo António
        </p>
      </div>

      {groups.map(({ town, courses: townCourses }) => {
        const slug = townSlug(town)
        return (
        <div key={town}>
          <h3 className="course-directory__town">
            {slug
              ? <a href={`/${slug}/golf-courses`} style={{ color: 'inherit', textDecoration: 'none' }}>Golf Courses in {town}</a>
              : <>Golf Courses in {town}</>
            }
          </h3>
          <ul className="course-list">
            {townCourses.map(course => (
              <li key={course.id} className="course-list-item">
                <a href={`/courses/${course.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroUrl(course)}
                    alt={`${course.name} golf course`}
                    width={80}
                    height={80}
                    loading="lazy"
                  />
                  <div className="course-list-item__body">
                    <strong className="course-list-item__name">{course.name}</strong>
                    <span className="course-list-item__meta">
                      {course.holes} holes
                      {course.par != null && ` · Par ${course.par}`}
                      {course.difficulty && ` · ${course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}`}
                    </span>
                    {course.price_from != null && (
                      <span className="course-list-item__badges">
                        <span className="course-list-item__price">From €{course.price_from}</span>
                      </span>
                    )}
                    {course.blurb && (
                      <p className="course-list-item__blurb">{course.blurb}</p>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
        )}
      )}
    </section>
  )
}
