<template>
  <div class="w-screen h-screen flex flex-row">
    <PlaceList class="hidden lg:block basis-2/5" />
    <Map class="lg:basis-full h-full" />
  </div>
  <div v-html="filtersSvg"></div>
</template>

<script setup lang="ts">
import "@/assets/css/index.css";
import filtersSvg from '@/assets/filters.svg?raw'
</script>
