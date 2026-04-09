import maplibre, { Map, Marker, type MapOptions } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export function useMapLibre() {
  function createMap(options: MapOptions): Map {
    return new maplibre.Map(options)
  }

  function createMarker(): Marker {
    return new maplibre.Marker()
  }

  return {
    maplibre,
    createMap,
    createMarker
  }
}
