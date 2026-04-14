<template>
  <div class="p-4 max-w-sm mx-auto fixed bottom-8 right-8">
    <div class="flex items-center gap-2 mb-2">
      <input type="checkbox" v-model="enabled" id="toggle" />
      <label for="toggle">Enable Joystick</label>
    </div>

    <div class="text-xs mb-3">
      <div>Lat: {{ location.latitude.toFixed(6) }}</div>
      <div>Lng: {{ location.longitude.toFixed(6) }}</div>
      <div>Heading: {{ location.heading }}°</div>
    </div>

    <div
      class="relative w-40 h-40 mx-auto rounded-full border flex items-center justify-center"
      :class="enabled ? 'bg-gray-100' : 'bg-gray-200 opacity-50'"
    >
      <div
        class="w-16 h-16 bg-blue-500 rounded-full transition-transform duration-100"
        :style="stickStyle"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { set } from "@vueuse/core";

const location = useUserLocation();

const enabled = ref(true);
const px = ref(false);
const nx = ref(false);
const py = ref(false);
const ny = ref(false);

const x = computed(() => (px.value ? 1 : 0) - (nx.value ? 1 : 0));
const y = computed(() => (py.value ? 1 : 0) - (ny.value ? 1 : 0));

const vectorScale = computed(() => {
  const length = Math.sqrt(x.value ** 2 + y.value ** 2);
  return length > 0 ? 1 / length : 0;
});

const step = 40;
const moveSpeed = 0.0005;
const rotateStep = 5;

const movementKeys = ["w", "a", "s", "d"];
const rotateKeys = ["q", "e"];

const degToRad = (deg: number) => deg * (Math.PI / 180);

let lastTime = 0;
function move(time: number) {
  const delta = (time - lastTime) / 100;
  lastTime = time;

  const forwardRad = degToRad(location.value.heading);
  location.value.latitude -=
    Math.cos(forwardRad) * moveSpeed * y.value * vectorScale.value * delta;
  location.value.longitude -=
    Math.sin(forwardRad) * moveSpeed * y.value * vectorScale.value * delta;
  const sideRad = degToRad(location.value.heading + 90);
  location.value.latitude +=
    Math.cos(sideRad) * moveSpeed * x.value * vectorScale.value * delta;
  location.value.longitude +=
    Math.sin(sideRad) * moveSpeed * x.value * vectorScale.value * delta;

  if (enabled.value) requestAnimationFrame(move);
}

watch(enabled, (newVal) => {
  if (newVal) {
    requestAnimationFrame(move);
  }
});

function handleKeyDown(e: KeyboardEvent) {
  if (!enabled.value) return;

  const key = e.key.toLowerCase();

  if ([...movementKeys, ...rotateKeys].includes(key)) {
    e.preventDefault();
  }

  switch (key) {
    case "w":
      ny.value = true;
      break;
    case "s":
      py.value = true;
      break;
    case "a":
      nx.value = true;
      break;
    case "d":
      px.value = true;
      break;
    case "q":
      location.value.heading =
        (location.value.heading - rotateStep + 360) % 360;
      break;
    case "e":
      location.value.heading = (location.value.heading + rotateStep) % 360;
      break;
  }
}

function handleKeyUp(e: KeyboardEvent) {
  if (!enabled.value) return;

  const key = e.key.toLowerCase();

  if ([...movementKeys, ...rotateKeys].includes(key)) {
    e.preventDefault();
  }

  switch (key) {
    case "w":
      ny.value = false;
      break;
    case "s":
      py.value = false;
      break;
    case "a":
      nx.value = false;
      break;
    case "d":
      px.value = false;
      break;
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown, { passive: false });
  window.addEventListener("keyup", handleKeyUp, { passive: false });
  requestAnimationFrame(move);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
});

const stickStyle = computed(() => ({
  transform: `translate(${x.value * vectorScale.value * step}px, ${y.value * vectorScale.value * step}px)`,
}));
</script>
