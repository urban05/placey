<script setup lang="ts">
import mapConfig from "@/assets/map_config.json";
import type { an } from "vue-router/dist/index-BzEKChPW.js";

const places = usePlaces();
const maplibre = useMapLibre();
const userLocation = useUserLocation();

const markerRefs = ref<Record<string, HTMLElement | null>>({});
const popupRefs = ref<Record<string, HTMLElement | null>>({});

const zoom = ref(13);

const lastQueryLocation = ref<{ latitude: number; longitude: number }>({
  latitude: userLocation.value.latitude,
  longitude: userLocation.value.longitude,
});

function shouldQueryNewPlaces(newLocation: { latitude: number; longitude: number }) {
  const distance = Math.abs(newLocation.latitude - lastQueryLocation.value.latitude) +
    Math.abs(newLocation.longitude - lastQueryLocation.value.longitude);

  return distance > 0.005;

}

const { data } = await useFetch(
  () => `/api/places?latitude=${lastQueryLocation.value.latitude.toFixed(6)}&longitude=${lastQueryLocation.value.longitude.toFixed(6)}`, {
  onResponse: (ctx) => {
    places.value = ctx.response._data as any[];
  }
}
);

const map = ref<any>(null);
const playerMarker = ref<maplibregl.Marker | null>(null);

onMounted(() => {
  map.value = maplibre.createMap({
    container: "map",
    style: mapConfig as any,
    center: [userLocation.value.longitude, userLocation.value.latitude],
    zoom: 13,
  });

  map.value.on("zoom", () => {
    zoom.value = map.value.getZoom()!;
  });

  playerMarker.value = maplibre.createMarker({
    color: "#FF0000"
  }).setLngLat([userLocation.value.longitude, userLocation.value.latitude]).addTo(map.value);
})

watch(
  () => { return { latitude: userLocation.value.latitude, longitude: userLocation.value.longitude, heading: userLocation.value.heading } },
  async (newLocation) => {
    map.value?.setCenter([newLocation.longitude, newLocation.latitude]);
    map.value?.setBearing(newLocation.heading);
    playerMarker.value?.setLngLat([newLocation.longitude, newLocation.latitude]);
    if (shouldQueryNewPlaces(newLocation)) {
      lastQueryLocation.value = { latitude: newLocation.latitude, longitude: newLocation.longitude };
    }
  }
);

const markers = ref<maplibregl.Marker[]>([]);

watch(places, (newPlaces) => {
  // Remove old markers
  for (const marker of markers.value) {
    marker.remove();
  }
  markers.value = [];

  // add new markers
  for (const place of newPlaces) {
    const placePopup = maplibre.createPopup({ offset: 25, maxWidth: '100vw' }).setDOMContent(popupRefs.value[place.id]!);
    maplibre.createMarker({
      element: markerRefs.value[place.id]!,
      anchor: "bottom",
    }).setLngLat([place.longitude, place.latitude]).setPopup(placePopup).addTo(map.value!);
  }
});


</script>

<template>
  <div id="map" style="height: 100vh; width: 100%">
    <div v-for="place in places" :ref="(el) => (markerRefs[place.id] = el as HTMLElement)">
      <Icon :name="place.icon" class="drop-shadow-lg drop-shadow-black cursor-pointer"
        :size="40 * 1.2 ** (zoom - 13)" />
    </div>

    <div v-for="place in places" :ref="(el) => (popupRefs[place.id] = el as HTMLElement)">
      <div class="flex flex-col w-max">
        <h1 class="text-xl text-nowrap whitespace-nowrap font-bold">{{ place.name }}</h1>
        <p class="text-sm text-wrap break-normal my-3 w-0 min-w-full">{{ place.description }}</p>
        <p>Addresse:</p>
        <p>{{ place.address }}</p>
      </div>
    </div>
  </div>
</template>
