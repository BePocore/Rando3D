import { Binoculars, Camera, MapPin, Video } from 'lucide-react'
import type { TrailPoint } from '../types'

export function PointTypeIcon({ type }: Pick<TrailPoint, 'type'>) {
  if (type === 'photo') return <Camera aria-hidden="true" size={16} />
  if (type === 'video') return <Video aria-hidden="true" size={16} />
  if (type === '360') return <Binoculars aria-hidden="true" size={16} />
  return <MapPin aria-hidden="true" size={16} />
}
