export const formatDistance = (meters: number): string => {
  if (!Number.isFinite(meters) || meters <= 0) return '--'

  const kilometers = meters / 1000
  return `${kilometers.toLocaleString('fr-FR', {
    maximumFractionDigits: kilometers < 10 ? 2 : 1,
  })} km`
}

export const formatElevation = (meters: number | null | undefined): string => {
  if (meters === null || meters === undefined || !Number.isFinite(meters)) {
    return '--'
  }

  return `${Math.round(meters).toLocaleString('fr-FR')} m`
}

export const formatGain = (meters: number): string => {
  if (!Number.isFinite(meters) || meters <= 0) return '--'

  return `${Math.round(meters).toLocaleString('fr-FR')} m`
}

export const formatLoss = (meters: number): string => {
  if (!Number.isFinite(meters) || meters <= 0) return '--'

  return `${Math.round(meters).toLocaleString('fr-FR')} m`
}
