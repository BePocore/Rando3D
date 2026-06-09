export const cesiumIonToken = import.meta.env.VITE_CESIUM_ION_TOKEN as
  | string
  | undefined

export const useWorldTerrain = import.meta.env.VITE_FLAT_TERRAIN !== 'true'

export const terrainStatusLabel = useWorldTerrain
  ? 'Terrain 3D actif'
  : 'Terrain plat'
