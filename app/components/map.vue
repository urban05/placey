<script setup lang="ts">
import { onMounted } from 'vue'

const maplibre = useMapLibre();

onMounted(() => {
  const map = maplibre.createMap({
  container: 'map',
  style: {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: [
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        ],
        tileSize: 256
      }
    },
    layers: [
      {
        id: 'osm-raster',
        type: 'raster',
        source: 'osm'
      }
    ]
  },
  center: [10.003277, 53.499555],
  zoom: 2
  })

  maplibre.createMarker().setLngLat([10.003277, 53.499555]).addTo(map)
})
</script>

<template>
  <div id="map" style="height: 500px; width: 100%;"></div>
</template>