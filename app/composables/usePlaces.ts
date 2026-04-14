import type { Place } from "~~/shared/place.type";

const userLocation = useUserLocation();

// store location of last data
const lastQueryLocation = ref<{ latitude: number; longitude: number }>({
  latitude: userLocation.value.latitude,
  longitude: userLocation.value.longitude,
});

// check how far away the user is from the last query location
function shouldQueryNewPlaces(newLocation: {
  latitude: number;
  longitude: number;
}) {
  const distance =
    Math.abs(newLocation.latitude - lastQueryLocation.value.latitude) +
    Math.abs(newLocation.longitude - lastQueryLocation.value.longitude);

  return distance > 0.005;
}

// Watch for movement
watch(
  () => {
    return {
      latitude: userLocation.value.latitude,
      longitude: userLocation.value.longitude,
      heading: userLocation.value.heading,
    };
  },
  (newLocation) => {
    lastQueryLocation.value = newLocation;
  },
);

const { data } = await useFetch(
  () =>
    `/api/places?latitude=${lastQueryLocation.value.latitude.toFixed(6)}&longitude=${lastQueryLocation.value.longitude.toFixed(6)}`,
);

export function usePlaces() {
  return data as Ref<Place[]>;
}
