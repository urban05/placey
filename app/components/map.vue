<script setup lang="ts">
import { onMounted } from 'vue'
import mapConfig from '@/assets/map_config.json';

const maplibre = useMapLibre();

const marker = useTemplateRef('marker');

onMounted(() => {
  const map = maplibre.createMap({
    container: 'map',
    style: mapConfig as any,
    center: [10.003277, 53.499555],
    zoom: 2
  })

  maplibre.createMarker({ element: marker.value! }).setLngLat([10.003277, 53.499555]).addTo(map)
})
</script>

<template>
  <div id="map" style="height: 500px; width: 100%;">
    <div ref="marker">
      <Icon name="glyphs-poly:graduation-cap" class="text-6xl drop-shadow-lg drop-shadow-black" />
    </div>
  </div>
</template>