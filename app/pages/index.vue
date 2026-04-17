<template>
  <div>
    <Map
      class="fixed top-0 duration-300"
      :style="`height: ${100 - drawerDefaultCoverage}vh`"
    />

    <Navbar class="fixed top-0 w-full" />

    <Drawer :default-size="drawerDefaultCoverage">
      <PlaceList v-if="currentPlace === null" />
      <PlaceInfo v-else />
    </Drawer>
    <div v-html="filtersSvg"></div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/css/index.css";
import filtersSvg from "@/assets/filters.svg?raw";
const currentPlace = useCurrentPlace();

const drawerDefaultCoverage = computed<number>(() => currentPlace.value ? 40 : 20 );
</script>
