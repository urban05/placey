<template>
  <div class="flex items-center w-full bg-white rounded-lg shadow overflow-hidden">
    <button class="grow relative" @click="onPlaceClick">
      <img class="absolute size-full object-cover object-center opacity-50 z-0" :src="place_image" />
      <div class="flex flex-col gap-2 p-2 text-left">
        <div class="flex gap-4 items-center z-2">
          <Icon :name="place.icon" size="50" :style="visitedPlaces.has(place.id) ? 'filter: url(\'#shimmer\')' : ''" />
          <h3 class="font-semibold text-gray-900" :style="text_border">{{ place.name }}</h3>
          <Icon v-if="place.verified" name="twemoji:check-mark-button" size="20" />
        </div>
        <p class="text-sm text-gray-600" :style="text_border">{{ place.description }}</p>
      </div>
    </button>
    <Voting :place="place" class="pr-2" />
  </div>
</template>

<script lang="ts" setup>
import type { Place } from '~~/shared/place.type';

const props = defineProps<{ place: Place }>();
const { visitedPlaces } = useVisitedPlaces();
const currentPlace = useCurrentPlace();
const place_image = computed(() => props.place.image ?? "placeholder.svg");

const tbs = 0.5; // text border size
const text_border = computed(() => `text-shadow: ${tbs}px ${tbs}px 0px white, -${tbs}px -${tbs}px 0px white, ${tbs}px -${tbs}px 0px white, -${tbs}px ${tbs}px 0px white;`)

function onPlaceClick() {
  currentPlace.value = props.place;
}
</script>

