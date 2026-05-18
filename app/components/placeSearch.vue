<template>
  <div class="relative max-w-xl h-full">
    <input @keyup.enter="onEnter" v-model="query" class="bg-white h-full rounded-full px-4 shadow-lg w-full"
      placeholder="Search Places" />
    <Icon name="twemoji:magnifying-glass-tilted-right"
      class="absolute right-3 top-1/2 -translate-y-1/2 grayscale pointer-events-none" size="30" />
  </div>
</template>

<script lang="ts" setup>
const { places, fetch } = usePlaces();
const map = useMap();
const query = useQuery();
const current_place = useCurrentPlace();

function onEnter() {
  zoomMapToFit();
  current_place.setCurrentPlace(null);
}
function zoomMapToFit() {
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
    maxZoom: 15,
  });
}

watch(query, fetch);

</script>
