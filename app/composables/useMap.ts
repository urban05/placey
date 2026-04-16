import { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const map = shallowRef<Map | null>(null);

export function useMap() {
  return map;
}
