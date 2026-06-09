import type { TrackPoint } from '../types'

const parseNumber = (value: string | null): number | null => {
  if (!value) return null

  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

const childText = (node: Element, tagName: string): string | undefined => {
  return node.getElementsByTagName(tagName)[0]?.textContent?.trim()
}

export const parseGpx = (gpxText: string): TrackPoint[] => {
  const parser = new DOMParser()
  const document = parser.parseFromString(gpxText, 'application/xml')
  const parseError = document.getElementsByTagName('parsererror')[0]

  if (parseError) {
    throw new Error('Le fichier GPX est invalide.')
  }

  const trackNodes = Array.from(document.getElementsByTagName('trkpt'))
  const routeNodes = Array.from(document.getElementsByTagName('rtept'))
  const nodes = trackNodes.length > 0 ? trackNodes : routeNodes

  return nodes
    .map((node) => {
      const lat = parseNumber(node.getAttribute('lat'))
      const lng = parseNumber(node.getAttribute('lon'))
      const ele = parseNumber(childText(node, 'ele') ?? null)
      const time = childText(node, 'time')

      if (lat === null || lng === null) return null

      return {
        lat,
        lng,
        ...(ele !== null ? { ele } : {}),
        ...(time ? { time } : {}),
      }
    })
    .filter((point): point is TrackPoint => point !== null)
}
