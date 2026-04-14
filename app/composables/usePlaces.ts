import type { Place } from "~~/shared/place.type";

export function usePlaces() {
    return useState<Place[]>('places', () => [])
}
