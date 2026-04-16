import maplibregl from "maplibre-gl";
import type { Place } from "~~/shared/place.type";

let isInitialLoad = true;

export function usePlaces() {
  const userLocation = useUserLocation();
  const query = useQuery();

  const places = useState<Place[]>("places", () => []);
  const lastQueryLocation = useState<{
    latitude: number;
    longitude: number;
  } | null>("places:lastLocation", () => null);

  function shouldQueryNewPlaces(newLocation: {
    latitude: number;
    longitude: number;
  }) {
    if (!lastQueryLocation.value) return true;

    const point1 = new maplibregl.LngLat(
      newLocation.longitude,
      newLocation.latitude,
    );
    const point2 = new maplibregl.LngLat(
      lastQueryLocation.value.longitude,
      lastQueryLocation.value.latitude,
    );

    const distanceInMeters = point1.distanceTo(point2);

    return distanceInMeters > 500;
  }

  async function fetchPlaces(location: {
    latitude: number;
    longitude: number;
  }) {
    const data = await $fetch<Place[]>(
      `/api/places?latitude=${location.latitude.toFixed(6)}&longitude=${location.longitude.toFixed(6)}`,
    );

    places.value = data;
    lastQueryLocation.value = location;
  }

  async function searchPlaces(
    location: {
      latitude: number;
      longitude: number;
    },
    query: string,
  ) {
    const data = await $fetch<Place[]>(
      `/api/places/search?q=${query}&latitude=${location.latitude.toFixed(6)}&longitude=${location.longitude.toFixed(6)}`,
    );

    places.value = data;
    lastQueryLocation.value = location;
  }

  const throttledFetchPlaces = useThrottleFn(fetchPlaces, 1000, true);
  const throttledSearchPlaces = useThrottleFn(searchPlaces, 1000, true);

  if (isInitialLoad) {
    isInitialLoad = false;
    watch(
      () => ({
        latitude: userLocation.value.latitude,
        longitude: userLocation.value.longitude,
        query: query.value,
      }),
      async (newLocation, oldLocation) => {
        if (query.value.length < 2) {
          if (
            shouldQueryNewPlaces(newLocation) ||
            oldLocation?.query != newLocation.query
          ) {
            await throttledFetchPlaces(newLocation);
          }
        } else {
          await throttledSearchPlaces(newLocation, query.value);
        }
      },
      { immediate: true },
    );
  }

  return places;
}
