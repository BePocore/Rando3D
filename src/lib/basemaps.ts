export type BasemapId = 'relief' | 'satellite' | 'topo' | 'streets'

export type BasemapOption = {
  id: BasemapId
  label: string
  description: string
}

export const basemapOptions: BasemapOption[] = [
  {
    id: 'relief',
    label: 'Ombrage',
    description: 'Ombrage de terrain clair, sans routes dominantes.',
  },
  {
    id: 'satellite',
    label: 'Satellite',
    description: 'Images aeriennes, peu de routes visibles.',
  },
  {
    id: 'topo',
    label: 'Topo',
    description: 'Courbes de niveau et lecture rando.',
  },
  {
    id: 'streets',
    label: 'Carte',
    description: 'Fond classique avec routes et noms.',
  },
]

export const defaultBasemap: BasemapId = 'topo'
