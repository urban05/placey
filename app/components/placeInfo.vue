<template>
  <div v-if="place" class="h-full">
    <div class="h-full flex flex-row gap-2">
      <div class="grow overflow-y-scroll pr-2 pb-2 flex flex-col gap-4">
        <img class="h-[50%]" />
        <div class="flex flex-row gap-2 items-center">
          <Icon :name="place.icon" size="50" :style="visitedPlaces.has(place.id) ? 'filter: url(\'#shimmer\')' : ''" />
          <h3 class="grow font-semibold text-gray-900">{{ place.name }}</h3>
        </div>
        <p class="text-sm text-gray-600">{{ place.description }}</p>
      </div>
      <div class="flex flex-col gap-4">
        <button class="aspect-square size-8 relative rounded-full shadow-lg bg-white" @click="onCloseClick">
          <div class="font-bold">X</div>
        </button>
        <Voting :place="place" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const visitedPlaces = useVisitedPlaces();
const place = useCurrentPlace();

function onCloseClick() {
  place.value = null;
}
</script>

<style>

</style>