<script setup lang="ts">
import { onMounted } from "vue";
import mapConfig from "@/assets/map_config.json";
import { useGeolocation } from "@vueuse/core";

const { coords } = useGeolocation();

const { data, refresh } = await useFetch(
  () => `/api/places?latitude=10.003277&longitude=53.499555`,
);

const maplibre = useMapLibre();

const markerRefs = ref<Record<string, HTMLElement | null>>({});

const zoom = ref(13);

onMounted(() => {
  const map = maplibre.createMap({
    container: "map",
    style: mapConfig as any,
    center: [10.003277, 53.499555],
    zoom: 13,
  });

  map.on("zoom", () => {
    zoom.value = map.getZoom()!;
  });

  watch(coords, (newCoords) => {
    map.setCenter([newCoords.longitude, newCoords.latitude]);
    refresh();
  });

  for (const place of data.value!) {
    const placePopup = maplibre.createPopup({offset: 25}).setHTML(`<h1>${place.name}</h1><p>--------</p><p>${place.description}</p><p>--------</p><p>${place.address}</p>`);
    const placeMarker = maplibre.createMarker({
      element: markerRefs.value[place.id]!,
      anchor: "bottom",
    });
    placeMarker.setLngLat([place.longitude, place.latitude]).setPopup(placePopup).addTo(map);
  }
});
</script>

<template>
  <div id="map" style="height: 100vh; width: 100%">
    <div
      v-for="place in data"
      :ref="(el) => (markerRefs[place.id] = el as HTMLElement)"
    >
      <Icon
        :name="place.icon"
        class="drop-shadow-lg drop-shadow-black cursor-pointer"
        :size="40 * 1.2 ** (zoom - 13)"
      />
    </div>
  </div>
</template>
