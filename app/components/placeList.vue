<template>
  <div class="space-y-4 p-2 overflow-y-scroll">
    <div v-for="place in places" :key="place.id" class="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      <Icon :name="place.icon" size="60" :style="visitedPlaces.has(place.id) ? 'filter: url(\'#shimmer\')' : ''" />

      <div class="flex-1">
        <h3 class="font-semibold text-gray-900">{{ place.name }}</h3>
        <p class="text-sm text-gray-600">{{ place.description }}</p>
      </div>

      <Voting :place="place" />
    </div>
  </div>
</template>

<script setup>
const places = usePlaces();
const visitedPlaces = useVisitedPlaces();
</script>
