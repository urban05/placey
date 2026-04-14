<script setup lang="ts">
import maplibregl from "maplibre-gl";
import type { ShallowRef } from "vue";

const props = defineProps<{
  lngLat: [number, number];
  icon: string;
}>();

const map = inject("map") as ShallowRef<maplibregl.Map>;

let marker: maplibregl.Marker | null = null;
const el = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!map.value || !el.value) return;

  marker = new maplibregl.Marker({
    element: el.value,
    anchor: "bottom",
  })
    .setLngLat(props.lngLat)
    .addTo(map.value);
});

// react to position updates
watch(
  () => props.lngLat,
  (val) => {
    marker?.setLngLat(val);
  },
);

onBeforeUnmount(() => {
  marker?.remove();
});

const zoom = ref(map.value.getZoom()!);
const size = computed(() => 40 * Math.pow(1.2, zoom.value - 13));

map.value.on("zoom", () => {
  zoom.value = map.value.getZoom()!;
});
</script>

<template>
  <div ref="el">
    <div
      class="border-x-8 border-x-transparent border-t-12 border-t-black/40 absolute bottom-0 left-1/2 -translate-x-1/2"
    ></div>
    <Icon :size="size" :name="icon" class="drop-shadow-xl drop-shadow-black" />
  </div>
</template>
