<template>
  <button class="flex items-center gap-4 p-4 w-full bg-white rounded-lg shadow" @click="onPlaceClick">
    <Icon :name="place.icon" size="60" :style="visitedPlaces.has(place.id) ? 'filter: url(\'#shimmer\')' : ''" />

    <div class="flex-1">
      <h3 class="font-semibold text-gray-900">{{ place.name }}</h3>
      <p class="text-sm text-gray-600">{{ place.description }}</p>
    </div>

    <Voting :place="place" />
  </button>
</template>

<script lang="ts" setup>
import type { Place } from '~~/shared/place.type';

const props = defineProps<{ place: Place }>();
const visitedPlaces = useVisitedPlaces();
const currentPlace = useCurrentPlace();

function onPlaceClick() {
  currentPlace.value = props.place;
}
</script>
