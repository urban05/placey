<template>
  <div class="space-y-4 p-2 overflow-y-scroll">
    <template v-if="places && places.length != 0">
      <PlaceListItem v-for="place in places" :key="place.id" :place="place" />
    </template>
    <button v-else class="flex items-center gap-4 p-4 w-full bg-white rounded-lg shadow" @click="onAddPlace">
      <img src="~/assets/placey-sad.webp" width="42em">
      <div class="flex-1">
        <h3 class="font-semibold text-gray-900">Keine Ergebnisse?</h3>
        <p class="text-sm text-gray-600">Füge einen neuen Ort hinzu!</p>
      </div>
    </button>
  </div>
  
</template>

<script setup lang="ts">
const places = usePlaces();

function onAddPlace() {
  console.log('Add Place');
  // go to add place view
}
</script>
