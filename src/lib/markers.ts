import type { PointType } from '../types'

const markerConfig: Record<PointType, { color: string; glyph: string }> = {
  photo: {
    color: '#2563eb',
    glyph:
      'M10 8h2.2l.8-1.4h4L17.8 8H20v10H4V8h2.2L7 6.6h2.2L10 8Zm2 5a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z',
  },
  video: {
    color: '#7c3aed',
    glyph:
      'M5 7h10a2 2 0 0 1 2 2v.8l3-1.8v8l-3-1.8V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm2 3v4h6v-4H7Z',
  },
  '360': {
    color: '#d97706',
    glyph:
      'M12 6c4.4 0 8 1.8 8 4s-3.6 4-8 4a13 13 0 0 1-2.2-.2l1.6 1.6L10 16.8 6 12.8l4-4 1.4 1.4-1.6 1.6c.7.1 1.4.2 2.2.2 3.5 0 6-1.2 6-2s-2.5-2-6-2-6 1.2-6 2c0 .5.8 1.1 2 1.5l-.8 1.8C5.2 12.6 4 11.4 4 10c0-2.2 3.6-4 8-4Zm4 10h4v2h-4v-2Z',
  },
  poi: {
    color: '#059669',
    glyph:
      'M12 3a6 6 0 0 1 6 6c0 4.2-6 12-6 12S6 13.2 6 9a6 6 0 0 1 6-6Zm0 8.5A2.5 2.5 0 1 0 12 6a2.5 2.5 0 0 0 0 5.5Z',
  },
}

export const markerDataUri = (type: PointType): string => {
  const { color, glyph } = markerConfig[type]
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="58" viewBox="0 0 48 58">
      <path fill="rgba(14, 23, 35, 0.25)" d="M24 58c6.5 0 11.8-1.5 11.8-3.4S30.5 51.2 24 51.2 12.2 52.8 12.2 54.6 17.5 58 24 58Z"/>
      <path fill="${color}" stroke="#fff" stroke-width="3" d="M24 3C13.5 3 5 11.3 5 21.6 5 36.3 24 54 24 54s19-17.7 19-32.4C43 11.3 34.5 3 24 3Z"/>
      <circle cx="24" cy="22" r="12" fill="rgba(255,255,255,0.96)"/>
      <path fill="${color}" d="${glyph}" transform="translate(12 10)"/>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
