<template>
  <div class="space-y-4 p-2 overflow-y-scroll">
    <PlaceListItem v-for="place in places" :key="place.id" :place="place" />
  </div>
</template>

<script setup lang="ts">
const places = usePlaces();
</script>
