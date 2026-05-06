<template>
  <div v-if="currentPlace" class="h-full">
    <div class="h-full flex flex-row gap-2">
      <div class="grow overflow-y-scroll pr-2 pb-4 flex flex-col gap-4">
        <BucketImage class="block max-w-full max-h-[50%] w-full h-auto self-center shrink-0 object-cover"
          :src="place_image" />
        <div class="flex flex-row gap-2 items-center">
          <Icon :name="currentPlace.icon" size="50" :style="visitedPlaces.has(currentPlace.id)
            ? 'filter: url(\'#shimmer\')'
            : ''
            " />
          <h3 class="font-semibold text-gray-900">{{ currentPlace.name }}</h3>
          <Icon v-if="currentPlace.verified" name="twemoji:check-mark-button" size="20" />
        </div>
        <p class="text-sm text-gray-800">{{ currentPlace.description }}</p>
        <div class="text-center text-sm text-gray-600">
          {{ currentPlace.address }}
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <button class="aspect-square size-8 relative rounded-full shadow-lg bg-white" @click="onCloseClick">
          <div class="font-bold">X</div>
        </button>
        <Voting :place="currentPlace" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { visitedPlaces } = useVisitedPlaces();
const { currentPlace, setCurrentPlace } = useCurrentPlace();
const place_image = computed(
  () => currentPlace.value?.image ?? "placeholder.svg",
);

function onCloseClick() {
  setCurrentPlace(null);
}
</script>

<style></style>
