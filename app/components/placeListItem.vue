<template>
  <div class="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
    <Icon :name="place.icon" size="60" :style="visitedPlaces.has(place.id) ? 'filter: url(\'#shimmer\')' : ''" />

    <div class="flex-1">
      <h3 class="font-semibold text-gray-900">{{ place.name }}</h3>
      <p class="text-sm text-gray-600">{{ place.description }}</p>
    </div>

    <Voting :place="place" />
  </div>
</template>

<script lang="ts" setup>
import type { Place } from '~~/shared/place.type';

const props = defineProps<{place: Place, visitedPlaces: Set<string>}>();
</script>

<style>

</style>