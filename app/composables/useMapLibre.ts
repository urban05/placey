import maplibre, {
  Map,
  Marker,
  Popup,
  type MapOptions,
  type MarkerOptions,
  type PopupOptions,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export function useMapLibre() {
  function createMap(options: MapOptions): Map {
    return new maplibre.Map(options);
  }

  function createMarker(options: MarkerOptions): Marker {
    return new maplibre.Marker(options);
  }

  function createPopup(options: PopupOptions): Popup {
    return new maplibre.Popup(options);
  }

  return {
    maplibre,
    createMap,
    createMarker,
    createPopup,
  };
}
