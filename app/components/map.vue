<script setup lang="ts">
import mapConfig from "@/assets/map_config.json";
import maplibre from "maplibre-gl";

const places = usePlaces();
const map = useMap();
const userLocation = useUserLocation();

provide("map", map);

onMounted(async () => {
  // Initialize the map
  map.value = new maplibre.Map({
    container: "map",
    style: mapConfig as any,
    center: [userLocation.value.longitude, userLocation.value.latitude],
    zoom: 13,
    pitch: 60,
  });

  map.value.addControl(
    new maplibre.NavigationControl({
      visualizePitch: true,
      visualizeRoll: true,
      showZoom: true,
      showCompass: true,
    }),
  );

  // bind map events to refs
  map.value.on("move", () => {
    const center = map.value!.getCenter();
    userLocation.value = {
      latitude: center.lat,
      longitude: center.lng,
      heading: map.value!.getBearing()!,
    };
  });

  map.value.on("rotate", () => {
    const center = map.value!.getCenter();
    userLocation.value = {
      latitude: center.lat,
      longitude: center.lng,
      heading: map.value!.getBearing()!,
    };
  });
});

// needed to z-sort markers
const sortedPlaces = computed(() => {
  if (!map.value) return [];
  userLocation.value; // Ensure reactivity to user location changes
  return places.value
    .map((place) => ({
      ...place,
      y: map.value!.project([place.longitude, place.latitude]).y,
    }))
    .sort((a, b) => a.y - b.y);
});

const visitedPlaces = useVisitedPlaces();
</script>

<template>
  <div id="map" class="size-full z-0">
    <Marker
      v-for="place in sortedPlaces"
      :lng-lat="[place.longitude, place.latitude]"
      :icon="place.icon"
      :is-shiny="visitedPlaces.has(place.id)"
    />
  </div>
</template>

<style scoped>
:deep(.maplibregl-ctrl-group) {
  margin-top: 100px !important;
  border-radius: 50vh !important;
  overflow: hidden !important;
}
</style>
