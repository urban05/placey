<template>
  <div>
    <Map
      class="fixed top-0"
      :style="`height: ${100 - drawerDefaultCoverage}vh`"
    />

    <Navbar class="fixed top-0 w-full" />

    <Drawer :default-size="drawerDefaultCoverage">
      <PlaceList />
    </Drawer>
    <div v-html="filtersSvg"></div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/css/index.css";
import filtersSvg from "@/assets/filters.svg?raw";

const drawerDefaultCoverage = 20;
</script>
