<script setup lang="ts">
const props = defineProps<{ defaultSize: number }>();

// Ring buffer of recent pointer samples
const VELOCITY_SAMPLE_MS = 80;  // look back window
const FLING_THRESHOLD = 0.5;    // px/ms — tune this

const pointerSamples: { y: number; t: number }[] = [];

// ─── How far up (% of viewport) before snapping to fullscreen ───
const FULLSCREEN_THRESHOLD = 55;

// ────────────────────────────────────────────────────────────────

const isFullscreen = ref(false);
const currentHeight = ref<number>(props.defaultSize);
const isDragging = ref(false);
const dragStartY = ref(0);
const dragStartHeight = ref(0);

const drawerStyle = computed(() => ({
  height: `${currentHeight.value}vh`,
  '--drawer-height': currentHeight.value,
  paddingTop: 'max(calc(var(--drawer-height) * 1vh - 100vh + 4rem), 0px)',
  borderRadius: isFullscreen.value ? '0' : '16px'
}));

watch(() => props.defaultSize, (newVal) => {
  if (!isFullscreen.value) currentHeight.value = newVal;
});

function getVelocity() {
  if (pointerSamples.length < 2) return 0;
  const oldest = pointerSamples[0]!;
  const newest = pointerSamples[pointerSamples.length - 1]!;
  const dy = newest.y - oldest.y;          // positive = finger moved down
  const dt = newest.t - oldest.t;
  return dt > 0 ? dy / dt : 0;             // px/ms, positive = downward
}

// ─── Drag handlers ───────────────────────────────────────────────

function onDragStart(e: MouseEvent | TouchEvent) {
  isDragging.value = true;
  dragStartY.value = e instanceof MouseEvent ? e.clientY : e.touches[0]!.clientY;
  dragStartHeight.value = currentHeight.value;

  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);
  window.addEventListener('touchmove', onDragMove, { passive: false });
  window.addEventListener('touchend', onDragEnd);
}

function onDragMove(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) return;
  if (e.cancelable) e.preventDefault(); // prevent scroll-fighting on touch

  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0]!.clientY;
  const delta = dragStartY.value - clientY;
  const newHeight = dragStartHeight.value + (delta / window.innerHeight) * 100;

  pointerSamples.push({ y: clientY, t: performance.now() });

  // Keep only samples within the window
  const cutoff = performance.now() - VELOCITY_SAMPLE_MS;
  while (pointerSamples.length > 1 && pointerSamples[0]!.t < cutoff) {
    pointerSamples.shift();
  }

  // Clamp between default size and full viewport
  currentHeight.value = Math.max(
    props.defaultSize,
    Math.min(100, newHeight)
  );
}

function onDragEnd() {
  isDragging.value = false;

  const velocity = getVelocity();
  pointerSamples.length = 0;               // clear for next gesture

  if (velocity < -FLING_THRESHOLD) {
    // Fast upward fling → fullscreen
    isFullscreen.value = true;
    currentHeight.value = 100;
  } else if (velocity > FLING_THRESHOLD) {
    // Fast downward fling → default
    isFullscreen.value = false;
    currentHeight.value = props.defaultSize;
  } else {
    // Slow/ambiguous → fall back to position
    // Snap: if dragged past threshold → fullscreen, otherwise → default
    if (currentHeight.value > FULLSCREEN_THRESHOLD) {
      isFullscreen.value = true;
      currentHeight.value = 100;
    } else {
      isFullscreen.value = false;
      currentHeight.value = props.defaultSize;
    }
  }


  window.removeEventListener('mousemove', onDragMove);
  window.removeEventListener('mouseup', onDragEnd);
  window.removeEventListener('touchmove', onDragMove);
  window.removeEventListener('touchend', onDragEnd);
}

onUnmounted(() => {
  window.removeEventListener('mousemove', onDragMove);
  window.removeEventListener('mouseup', onDragEnd);
  window.removeEventListener('touchmove', onDragMove);
  window.removeEventListener('touchend', onDragEnd);
});
</script>

<template>
  <div class="drawer fixed left-0 right-0 bottom-0 flex flex-col backdrop-blur-md bg-white/20 border border-white/30 z-10" :style="drawerStyle" :class="{ 'is-dragging': isDragging }">

    <!-- Drag handle -->
    <div class="shrink-0 flex justify-center items-center pt-3 pb-4 select-none touch-none cursor-grab active:cursor-grabbing" @mousedown="onDragStart" @touchstart.prevent="onDragStart">
      <span class="w-10 h-1 rounded-xs bg-[#ccc]" />
    </div>

    <!-- Drawer content: flex column so the list can fill remaining space -->
    <div class="flex-1 flex flex-col overflow-hidden px-4">

      <!-- Scrollable list — flex: 1 + overflow-y: auto keeps it independent -->
      <slot class="drawer-list flex-1 overflow-y-auto list-none m-0 py-2 scrolling" />

    </div>
  </div>
</template>

<style scoped>
.drawer {
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease, z-index 0s;
  will-change: height;
}
.drawer.is-dragging {
  /* Disable transition while actively dragging for responsive feel */
  transition: none;
}
.drawer-list {
  /* smooth momentum scroll on iOS */
  -webkit-overflow-scrolling: touch;
}
</style>
