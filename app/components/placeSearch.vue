<template>
  <div class="relative max-w-xl">
    <input
      @input="searchPlaces"
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
import type { Place } from "~~/shared/place.type";

const location = useUserLocation();
const places = usePlaces();

const query = ref("");

async function searchPlaces() {
  const data = await $fetch<Place[]>(
    `/api/places/search?q=${query.value}&latitude=${location.value.latitude.toFixed(6)}&longitude=${location.value.longitude.toFixed(6)}`,
  );

  places.value = data;
}
</script>
