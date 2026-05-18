import type { UUID } from "crypto";
import type { Place } from "~~/shared/place.type";

export function useVisitedPlaces() {
    const api = useApi();
    const visitedPlaceIds = useState('visitedPlaceIds', () => new Set<UUID>());
    const visitedPlaces = useState<Place[]>('visitedPlaces', () => []);

    async function fetchPlaces(): Promise<void> {
       visitedPlaces.value = await api.fetchVisitedPlaces();
    };

    return {
        visitedPlaceIds: readonly(visitedPlaceIds),
        fetchPlaces,
        visitedPlaces: readonly(visitedPlaces)
    };
}
