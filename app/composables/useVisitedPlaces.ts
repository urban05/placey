import type { UUID } from "crypto";
import type { Place } from "~~/shared/place.type";

export function useVisitedPlaces() {
  const api = useApi();
  const visitedPlaces = useState<Place[]>("visitedPlaces", () => []);
  const visitedPlaceIds = computed(
    () => new Set<UUID>(visitedPlaces.value.map((place) => place.id)),
  );

  async function fetchPlaces(): Promise<void> {
    visitedPlaces.value = await api.fetchVisitedPlaces();
  }

  return {
    visitedPlaceIds: readonly(visitedPlaceIds),
    fetchPlaces,
    visitedPlaces: readonly(visitedPlaces),
  };
}
