<script setup lang="ts">
import { onMounted } from 'vue'
import mapConfig from '@/assets/map_config.json';

import { useGeolocation } from '@vueuse/core';

const { coords } = useGeolocation();

const maplibre = useMapLibre();

const markerElement = useTemplateRef('marker');

onMounted(() => {
  const map = maplibre.createMap({
    container: 'map',
    style: mapConfig as any,
    center: [10.003277, 53.499555],
    zoom: 13
  })

  const marker = maplibre.createMarker({ element: markerElement.value!, anchor: 'bottom' });
  marker.setLngLat([10.003277, 53.499555]).addTo(map)

  watch(coords, (newCoords) => {
    map.setCenter([newCoords.longitude, newCoords.latitude]);
  })
})
</script>

<template>
  <div id="map" style="height: 500px; width: 100%;">
    <div ref="marker">
      <Icon name="twemoji:school" class="text-6xl drop-shadow-lg drop-shadow-black" />
    </div>
  </div>
</template>