import type { Place } from "~~/shared/place.type";

export function usePlaces() {
  const api = useApi();
  const userLocation = useUserLocation();
  const query = useQuery();

  const places = useState<Place[]>("places", () => []);

  async function fetchPlaces(location: {
    latitude: number;
    longitude: number;
  }) {
    const data = await api.fetchPlaces(location);

    places.value = data;
  }

  async function searchPlaces(
    location: {
      latitude: number;
      longitude: number;
    },
    query: string,
  ) {
    const data = await api.searchPlaces(location, query);

    places.value = data;
  }

  const throttledFetchPlaces = useThrottleFn(fetchPlaces, 1000, true);
  const throttledSearchPlaces = useThrottleFn(searchPlaces, 500, true);

  async function fetch(): Promise<void> {
    if (query.value) {
      await throttledSearchPlaces(userLocation.value, query.value);
    } else {
      await throttledFetchPlaces(userLocation.value);
    }
  }

  return {
    places: readonly(places),
    fetch,
  };
}

export function usePlacesRaw() {
  return useState<Place[]>("places", () => []);
}
