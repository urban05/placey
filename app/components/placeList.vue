<template>
  <div class="space-y-4 p-2 overflow-y-scroll pb-4">
    <template v-if="places && places.length != 0">
      <PlaceListItem v-for="place in places" :key="place.id" :place="place" />
      <div class="flex flex-row justify-center my-8">
        <div class="bg-gray-300 h-px w-1/2" />
      </div>
    </template>
    <NuxtLink to="/contribute" class="flex items-center gap-4 p-4 w-full bg-white rounded-lg shadow">
      <img src="~/assets/placey-sad.webp" width="42em">
      <div class="flex-1">
        <h3 class="font-semibold text-gray-900">Keine Ergebnisse?</h3>
        <p class="text-sm text-gray-600">Füge einen neuen Ort hinzu!</p>
      </div>
    </NuxtLink>
  </div>

</template>

<script setup lang="ts">
const { places } = usePlaces();
</script>
