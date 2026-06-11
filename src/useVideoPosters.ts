import { useEffect, useState } from 'react'
import { resolvePointMedia } from './lib/media'
import type { ImportedMedia, TrailPoint } from './types'

// Cache global des vignettes vidéo (1re image), évite de régénérer.
const posterCache = new Map<string, string>()

const generatePoster = (src: string): Promise<string | null> =>
  new Promise((resolve) => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.playsInline = true
    video.preload = 'metadata'

    let settled = false
    const finish = (value: string | null) => {
      if (settled) return
      settled = true
      video.removeAttribute('src')
      video.load()
      resolve(value)
    }

    video.addEventListener('loadeddata', () => {
      try {
        video.currentTime = Math.min(0.1, (video.duration || 1) / 2)
      } catch {
        finish(null)
      }
    })

    video.addEventListener('seeked', () => {
      try {
        const width = 152
        const height = 112
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx || !video.videoWidth) return finish(null)

        const scale = Math.max(width / video.videoWidth, height / video.videoHeight)
        const drawWidth = video.videoWidth * scale
        const drawHeight = video.videoHeight * scale
        ctx.drawImage(
          video,
          (width - drawWidth) / 2,
          (height - drawHeight) / 2,
          drawWidth,
          drawHeight,
        )

        // Badge lecture (cercle sombre + triangle blanc).
        ctx.fillStyle = 'rgba(8, 14, 11, 0.55)'
        ctx.beginPath()
        ctx.arc(width / 2, height / 2, 22, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.moveTo(width / 2 - 7, height / 2 - 11)
        ctx.lineTo(width / 2 - 7, height / 2 + 11)
        ctx.lineTo(width / 2 + 12, height / 2)
        ctx.closePath()
        ctx.fill()

        finish(canvas.toDataURL('image/jpeg', 0.72))
      } catch {
        finish(null)
      }
    })

    video.addEventListener('error', () => finish(null))
    window.setTimeout(() => finish(null), 8_000)
    video.src = src
  })

export function useVideoPosters(
  points: TrailPoint[],
  mediaLibrary: ImportedMedia[],
): Record<string, string> {
  const [posters, setPosters] = useState<Record<string, string>>({})

  useEffect(() => {
    const sources = new Set<string>()
    for (const point of points) {
      const media = resolvePointMedia(point, mediaLibrary)
      if (media?.kind === 'video') sources.add(media.src)
    }

    let cancelled = false
    sources.forEach((src) => {
      if (posterCache.has(src)) {
        const cached = posterCache.get(src)
        if (cached) {
          setPosters((current) =>
            current[src] === cached ? current : { ...current, [src]: cached },
          )
        }
        return
      }
      void generatePoster(src).then((dataUrl) => {
        if (cancelled || !dataUrl) return
        posterCache.set(src, dataUrl)
        setPosters((current) => ({ ...current, [src]: dataUrl }))
      })
    })

    return () => {
      cancelled = true
    }
  }, [points, mediaLibrary])

  return posters
}
