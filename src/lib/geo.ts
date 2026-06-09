import type { TrackPoint, TrailStats } from '../types'

const earthRadiusMeters = 6_371_000

const toRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180
}

export const distanceBetween = (from: TrackPoint, to: TrackPoint): number => {
  const lat1 = toRadians(from.lat)
  const lat2 = toRadians(to.lat)
  const deltaLat = toRadians(to.lat - from.lat)
  const deltaLng = toRadians(to.lng - from.lng)

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2

  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export const computeTrailStats = (track: TrackPoint[]): TrailStats => {
  let distanceMeters = 0
  let elevationGainMeters = 0
  let elevationLossMeters = 0
  let maxElevationMeters: number | null = null
  let minElevationMeters: number | null = null

  track.forEach((point, index) => {
    if (index > 0) {
      const previous = track[index - 1]
      distanceMeters += distanceBetween(previous, point)

      if (previous.ele !== undefined && point.ele !== undefined) {
        const gain = point.ele - previous.ele
        if (gain > 0.5) elevationGainMeters += gain
        if (gain < -0.5) elevationLossMeters += Math.abs(gain)
      }
    }

    if (point.ele !== undefined) {
      maxElevationMeters =
        maxElevationMeters === null
          ? point.ele
          : Math.max(maxElevationMeters, point.ele)
      minElevationMeters =
        minElevationMeters === null
          ? point.ele
          : Math.min(minElevationMeters, point.ele)
    }
  })

  return {
    distanceMeters,
    elevationGainMeters,
    elevationLossMeters,
    maxElevationMeters,
    minElevationMeters,
    pointCount: track.length,
  }
}

export const nearestElevation = (
  target: Pick<TrackPoint, 'lat' | 'lng'>,
  track: TrackPoint[],
): number | undefined => {
  const nearest = track.reduce<{
    point: TrackPoint | null
    distance: number
  }>(
    (best, point) => {
      const distance = distanceBetween(target, point)
      return distance < best.distance ? { point, distance } : best
    },
    { point: null, distance: Number.POSITIVE_INFINITY },
  )

  return nearest.point?.ele
}
