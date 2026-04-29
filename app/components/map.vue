<script setup lang="ts">
import mapConfig from "@/assets/map_config.json";
import maplibregl from "maplibre-gl";
import maplibre from "maplibre-gl";

const props = defineProps<{ bottomMargin: number }>();
const bottomMarginComputed = computed(() => `calc(${props.bottomMargin}vh + 1em)`)

const { places, fetch } = usePlaces();
const map = useMap();
const userLocation = useUserLocation();
const currentPlace = useCurrentPlace();

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

  // fetch places initially
  fetch();
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

const { visitedPlaces } = useVisitedPlaces();

const lastQueryLocation = useState<{
  latitude: number;
  longitude: number;
} | null>("places:lastLocation", () => null);

function shouldQueryNewPlaces(newLocation: {
  latitude: number;
  longitude: number;
}) {
  if (!lastQueryLocation.value) return true;

  const point1 = new maplibregl.LngLat(
    newLocation.longitude,
    newLocation.latitude,
  );
  const point2 = new maplibregl.LngLat(
    lastQueryLocation.value.longitude,
    lastQueryLocation.value.latitude,
  );

  const distanceInMeters = point1.distanceTo(point2);

  return distanceInMeters > 500;
}

watch(() => {
  return {
    latitude: userLocation.value.latitude,
    longitude: userLocation.value.longitude
  }
}, (location) => {
  if (shouldQueryNewPlaces(location)) fetch()
})

</script>

<template>
  <div id="map" class="relative size-full z-0">
    <Marker v-for="place in sortedPlaces" :lng-lat="[place.longitude, place.latitude]" :icon="place.icon"
      :is-shiny="visitedPlaces.has(place.id)" @click="currentPlace = place" />
  </div>
</template>

<style scoped>
:deep(.maplibregl-ctrl-group) {
  margin-top: 100px !important;
  border-radius: 50vh !important;
  overflow: hidden !important;
}

:deep(.maplibregl-ctrl-attrib) {
  margin-bottom: v-bind('bottomMarginComputed') !important;
  transition-duration: 0.3s;
}
</style>
