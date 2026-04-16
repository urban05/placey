<template>
  <div class="relative max-w-xl">
    <input
      @keyup.enter="zoomMapToFit"
      v-model="query"
      class="bg-white rounded-full px-4 py-2 shadow-lg w-full"
      placeholder="Search Places"
    />
    <Icon
      name="twemoji:magnifying-glass-tilted-right"
      class="absolute right-2 top-1/2 -translate-y-1/2 grayscale pointer-events-none"
      size="30"
    />
  </div>
</template>

<script lang="ts" setup>
const places = usePlaces();
const map = useMap();
const query = useQuery();

async function zoomMapToFit() {
  const bounds: [number, number, number, number] = places.value.reduce(
    (acc, place) => [
      Math.min(acc[0]!, place.longitude),
      Math.min(acc[1]!, place.latitude),
      Math.max(acc[2]!, place.longitude),
      Math.max(acc[3]!, place.latitude),
    ],
    [Infinity, Infinity, -Infinity, -Infinity],
  );

  map.value?.fitBounds(bounds, {
    padding: { top: 150, bottom: 150, left: 150, right: 150 },
    maxZoom: 15,
  });
}
</script>
