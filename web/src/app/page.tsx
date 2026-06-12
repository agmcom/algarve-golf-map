import { getCourses, getAirports } from '@/lib/queries'
import { HomeClient } from './HomeClient'

export const revalidate = 3600

export default async function HomePage() {
  const [courses, airports] = await Promise.all([getCourses(), getAirports()])
  return <HomeClient courses={courses} hotels={[]} shops={[]} airports={airports} />
}
