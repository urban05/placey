<template>
  <Map class="fixed top-0 duration-250" :style="`height: ${100 - drawerDefaultCoverage}vh`" />
  <Drawer :default-size="drawerDefaultCoverage">
    <PlaceList />
  </Drawer>
</template>

<script setup lang="ts">
import "@/assets/css/index.css";
import filtersSvg from '@/assets/filters.svg?raw'
import Drawer from "./components/drawer.vue";

const drawerDefaultCoverage = ref(20);
</script>
