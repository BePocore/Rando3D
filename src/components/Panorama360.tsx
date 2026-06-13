import { useEffect, useRef } from 'react'
import 'pannellum/build/pannellum.css'
import 'pannellum'

declare global {
  interface Window {
    pannellum: {
      viewer: (
        container: HTMLElement,
        config: Record<string, unknown>,
      ) => { destroy: () => void }
    }
  }
}

type Panorama360Props = {
  src: string
  className?: string
  // Aperçu dans la fiche : rotation auto + interactions plus discrètes.
  preview?: boolean
}

// Visionneuse panoramique équirectangulaire (image 360 d'un point drone).
// Réutilisée à la fois en plein écran (lightbox) et en aperçu dans la fiche.
export function Panorama360({ src, className, preview = false }: Panorama360Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const viewer = window.pannellum.viewer(container, {
      type: 'equirectangular',
      panorama: src,
      autoLoad: true,
      autoRotate: -2,
      compass: false,
      showZoomCtrl: true,
      showFullscreenCtrl: false,
      keyboardZoom: true,
      mouseZoom: true,
      draggable: true,
      hfov: preview ? 100 : 110,
      minHfov: 50,
      maxHfov: 120,
      crossOrigin: 'anonymous',
    })
    return () => viewer.destroy()
  }, [src, preview])

  return (
    <div
      ref={containerRef}
      className={className}
      // Le drag/zoom du panorama ne doit pas déclencher les gestes parents.
      onClick={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
      onTouchEnd={(event) => event.stopPropagation()}
    />
  )
}
