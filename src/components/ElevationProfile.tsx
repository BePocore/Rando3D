import { Activity } from 'lucide-react'
import type { TrackPoint, TrailStats } from '../types'
import { distanceBetween } from '../lib/geo'
import {
  formatDistance,
  formatElevation,
  formatGain,
  formatLoss,
} from '../lib/format'

type ElevationProfileProps = {
  track: TrackPoint[]
  stats: TrailStats
}

type ProfilePoint = {
  distance: number
  elevation: number
}

const buildProfile = (track: TrackPoint[]): ProfilePoint[] => {
  let distance = 0

  return track.reduce<ProfilePoint[]>((profile, point, index) => {
    if (index > 0) {
      distance += distanceBetween(track[index - 1], point)
    }

    if (point.ele !== undefined) {
      profile.push({ distance, elevation: point.ele })
    }

    return profile
  }, [])
}

export function ElevationProfile({ track, stats }: ElevationProfileProps) {
  const profile = buildProfile(track)

  if (profile.length < 2 || stats.maxElevationMeters === null) {
    return (
      <section className="elevation-card" aria-label="Profil d'altitude">
        <div className="elevation-heading">
          <Activity aria-hidden="true" size={17} />
          <strong>Profil d'altitude</strong>
        </div>
        <div className="empty-state">Aucune altitude dans le GPX.</div>
      </section>
    )
  }

  const width = 320
  const height = 116
  const paddingX = 10
  const paddingY = 12
  const minElevation = stats.minElevationMeters ?? stats.maxElevationMeters
  const maxElevation = stats.maxElevationMeters
  const elevationRange = Math.max(maxElevation - minElevation, 1)
  const distanceRange = Math.max(stats.distanceMeters, 1)

  const linePoints = profile.map((point) => {
    const x =
      paddingX +
      (point.distance / distanceRange) * (width - paddingX * 2)
    const y =
      height -
      paddingY -
      ((point.elevation - minElevation) / elevationRange) *
        (height - paddingY * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const areaPoints = [
    `${paddingX},${height - paddingY}`,
    ...linePoints,
    `${width - paddingX},${height - paddingY}`,
  ].join(' ')

  return (
    <section className="elevation-card" aria-label="Profil d'altitude">
      <div className="elevation-heading">
        <Activity aria-hidden="true" size={17} />
        <strong>Profil d'altitude</strong>
      </div>

      <svg
        className="elevation-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Distance ${formatDistance(
          stats.distanceMeters,
        )}, denivele positif ${formatGain(
          stats.elevationGainMeters,
        )}, denivele negatif ${formatLoss(stats.elevationLossMeters)}`}
      >
        <defs>
          <linearGradient id="profile-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0f766e" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#0f766e" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <polyline points={areaPoints} fill="url(#profile-fill)" />
        <polyline
          points={linePoints.join(' ')}
          fill="none"
          stroke="#0f766e"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
      </svg>

      <div className="elevation-summary">
        <span>
          <small>Min</small>
          <strong>{formatElevation(stats.minElevationMeters)}</strong>
        </span>
        <span>
          <small>Max</small>
          <strong>{formatElevation(stats.maxElevationMeters)}</strong>
        </span>
        <span>
          <small>D+</small>
          <strong>{formatGain(stats.elevationGainMeters)}</strong>
        </span>
        <span>
          <small>D-</small>
          <strong>{formatLoss(stats.elevationLossMeters)}</strong>
        </span>
      </div>
    </section>
  )
}
