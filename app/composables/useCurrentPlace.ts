import type { Place } from "~~/shared/place.type";

export function useCurrentPlace() {
  return useState<Place | null>("currentPlace", () => null);
}
