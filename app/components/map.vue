<script setup lang="ts">
import mapConfig from "@/assets/map_config.json";

const places = usePlaces();
const maplibre = useMapLibre();
const userLocation = useUserLocation();

const map = shallowRef<maplibregl.Map>(null!);
provide("map", map);

onMounted(async () => {
  // Initialize the map
  map.value = maplibre.createMap({
    container: "map",
    style: mapConfig as any,
    center: [userLocation.value.longitude, userLocation.value.latitude],
    zoom: 13,
  });

  map.value.addControl(new maplibre.NavigationControl({
    visualizePitch: true,
    visualizeRoll: true,
    showZoom: true,
    showCompass: true
  }));

  // bind map events to refs
  map.value.on("move", () => {
    const center = map.value.getCenter();
    userLocation.value = {
      latitude: center.lat,
      longitude: center.lng,
      heading: map.value.getBearing()!,
    };
  });

  map.value.on("rotate", () => {
    const center = map.value.getCenter();
    userLocation.value = {
      latitude: center.lat,
      longitude: center.lng,
      heading: map.value.getBearing()!,
    };
  });
});

// needed to z-sort markers
const sortedPlaces = computed(() => {
  userLocation.value; // Ensure reactivity to user location changes
  return places.value
    .map((place) => ({
      ...place,
      y: map.value.project([place.longitude, place.latitude]).y,
    }))
    .sort((a, b) => a.y - b.y);
});
</script>

<template>
  <div id="map" class="size-full">
    <Marker
      v-for="place in sortedPlaces"
      :lng-lat="[place.longitude, place.latitude]"
      :icon="place.icon"
    />
  </div>
</template>
