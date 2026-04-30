<template>
  <div>
    <Map class="fixed top-0 h-screen" :top-margin="100" :bottom-margin="drawerDefaultCoverage" />

    <Navbar class="fixed top-0 w-full" />

    <!-- <div class="fixed bottom-0 left-0 w-screen bg-white duration-300" :style="`height: ${drawerDefaultCoverage}%`" /> -->
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
import type { Place } from "~~/shared/place.type";
const currentPlace = useCurrentPlace();

const drawerDefaultCoverage = computed<number>(() => currentPlace.value ? 40 : 20);

const map = useMap();


// this shouldn't be here, but it currently has to be. maybe worth moving the map padding to a composable

function adjustMap(newVal: { currentPlace: Place | null, drawerCoverage: number }) {
  map.value?.easeTo({
    center: newVal.currentPlace ? [newVal.currentPlace!.longitude, newVal.currentPlace!.latitude] : undefined,
    padding: {
      top: 150,
      left: 50,
      right: 50,
      bottom: newVal.drawerCoverage / 100 * screen.height + 50,
    },
    zoom: 15,
  })
}

watch(() => { return { currentPlace: currentPlace.value, drawerCoverage: drawerDefaultCoverage.value } }, adjustMap);
adjustMap({
  currentPlace: currentPlace.value,
  drawerCoverage: drawerDefaultCoverage.value
})

</script>
