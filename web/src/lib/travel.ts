// Rough drive-time estimate from straight-line distance. Kept free of map
// libraries so pages that only need minutes don't pull turf into the bundle.

const SPEED_KMH = 70
const ROAD_FACTOR = 0.85

export function timeToRadiusKm(minutes: number): number {
  return (minutes / 60) * SPEED_KMH * ROAD_FACTOR
}

export function distanceToMinutes(distanceKm: number): number {
  return Math.round((distanceKm / (SPEED_KMH * ROAD_FACTOR)) * 60)
}
