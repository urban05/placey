import type { UUID } from "node:crypto";

export function useCurrentPlace() {
  const currentPlaceId = useState<UUID | null>("currentPlace", () => null);
  const { places } = usePlaces();
  const currentPlace = computed(
    () =>
      places.value.find((place) => place.id == currentPlaceId.value) ?? null,
  );

  function setCurrentPlace(id: UUID | null) {
    currentPlaceId.value = id;
  }

  return {
    currentPlace,
    setCurrentPlace,
  };
}
