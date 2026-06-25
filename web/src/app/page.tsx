import { getCourses, getAirports } from '@/lib/queries'
import { HomeClient } from './HomeClient'
import { CourseDirectory } from '@/components/CourseDirectory'

export const revalidate = 3600

export default async function HomePage() {
  const [courses, airports] = await Promise.all([getCourses(), getAirports()])
  return (
    <>
      <div style={{ height: '100svh', position: 'relative' }}>
        <HomeClient courses={courses} hotels={[]} shops={[]} airports={airports} />
      </div>
      <CourseDirectory courses={courses} />
    </>
  )
}
