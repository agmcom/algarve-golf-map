import * as turf from '@turf/turf'
import type { Feature, Polygon, GeoJsonProperties } from 'geojson'
import type { Course } from '@/types/database'

const SPEED_KMH = 70
const ROAD_FACTOR = 0.85

export function timeToRadiusKm(minutes: number): number {
  return (minutes / 60) * SPEED_KMH * ROAD_FACTOR
}

export function distanceToMinutes(distanceKm: number): number {
  return Math.round((distanceKm / (SPEED_KMH * ROAD_FACTOR)) * 60)
}

export interface CourseTime {
  course: Course
  minutes: number
}

export interface PlannerResult {
  type: 'intersection' | 'fallback'
  zone: Feature<Polygon, GeoJsonProperties>
  center: [number, number]        // [lng, lat]
  zoneName: string
  courseTimes: CourseTime[]
  warning?: string
}

export function calculateZone(courses: Course[], maxMinutes: number): PlannerResult {
  const radiusKm = timeToRadiusKm(maxMinutes)

  // Single course — just draw circle around it
  if (courses.length === 1) {
    const c = courses[0]
    const zone = turf.circle([c.lng, c.lat], radiusKm, { steps: 64 })
    return {
      type: 'intersection',
      zone,
      center: [c.lng, c.lat],
      zoneName: nearestZoneName([c.lng, c.lat]),
      courseTimes: [{ course: c, minutes: 0 }],
    }
  }

  // Multiple courses — try to find the intersection of all circles
  const circles = courses.map(c =>
    turf.circle([c.lng, c.lat], radiusKm, { steps: 64 })
  )

  let intersection: Feature<Polygon, GeoJsonProperties> | null = circles[0]
  for (let i = 1; i < circles.length; i++) {
    intersection = turf.intersect(
      turf.featureCollection([intersection!, circles[i]])
    ) as Feature<Polygon, GeoJsonProperties> | null
    if (!intersection) break
  }

  if (intersection) {
    const centroid = turf.centroid(intersection)
    const center = centroid.geometry.coordinates as [number, number]
    return {
      type: 'intersection',
      zone: intersection,
      center,
      zoneName: nearestZoneName(center),
      courseTimes: courses.map(c => ({
        course: c,
        minutes: distanceToMinutes(turf.distance([c.lng, c.lat], center)),
      })),
    }
  }

  // No intersection — fallback to centroid of all course points
  const points = turf.featureCollection(courses.map(c => turf.point([c.lng, c.lat])))
  const centroid = turf.center(points)
  const center = centroid.geometry.coordinates as [number, number]
  const fallbackZone = turf.circle(center, radiusKm, { steps: 64 })

  return {
    type: 'fallback',
    zone: fallbackZone,
    center,
    zoneName: nearestZoneName(center),
    courseTimes: courses.map(c => ({
      course: c,
      minutes: distanceToMinutes(turf.distance([c.lng, c.lat], center)),
    })),
    warning: `The selected courses are too spread out. Travel times will be longer than ${maxMinutes} min from this area.`,
  }
}

// Zone name lookup — finds the nearest named zone to a point
const ZONE_CENTERS: Array<{ name: string; center: [number, number] }> = [
  { name: 'Lagos / Oeste',              center: [-8.67, 37.10] },
  { name: 'Portimão / Alvor',           center: [-8.54, 37.13] },
  { name: 'Carvoeiro / Lagoa',          center: [-8.47, 37.09] },
  { name: 'Albufeira',                  center: [-8.25, 37.09] },
  { name: 'Vilamoura / Quarteira',      center: [-8.12, 37.09] },
  { name: 'Golden Triangle / Almancil', center: [-8.02, 37.02] },
  { name: 'Faro / Olhão',              center: [-7.93, 37.02] },
  { name: 'Tavira / Este',             center: [-7.65, 37.13] },
]

function nearestZoneName(center: [number, number]): string {
  let best = ZONE_CENTERS[0]
  let bestDist = turf.distance(center, best.center)
  for (const z of ZONE_CENTERS.slice(1)) {
    const d = turf.distance(center, z.center)
    if (d < bestDist) { best = z; bestDist = d }
  }
  return best.name
}
