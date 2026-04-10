import maplibre, { Map, Marker, type MapOptions, type MarkerOptions } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export function useMapLibre() {
  function createMap(options: MapOptions): Map {
    return new maplibre.Map(options)
  }

  function createMarker(options: MarkerOptions): Marker {
    return new maplibre.Marker(options)
  }

  return {
    maplibre,
    createMap,
    createMarker
  }
}
