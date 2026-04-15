<template>
  <div>
    <Map class="fixed top-0 duration-250" :style="`height: ${100 - drawerDefaultCoverage}vh`" />
    <Drawer :default-size="drawerDefaultCoverage">
      <PlaceList />
    </Drawer>
    <div v-html="filtersSvg"></div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/css/index.css";
import filtersSvg from '@/assets/filters.svg?raw'

const drawerDefaultCoverage = 20;
</script>
