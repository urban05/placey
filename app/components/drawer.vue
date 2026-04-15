<script setup>
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps({
  defaultSize: {
    type: Number,
    required: true,
  },
})

// Ring buffer of recent pointer samples
const VELOCITY_SAMPLE_MS = 80  // look back window
const FLING_THRESHOLD = 0.5    // px/ms — tune this

const pointerSamples = []

// ─── How far up (% of viewport) before snapping to fullscreen ───
const FULLSCREEN_THRESHOLD = 55
// ────────────────────────────────────────────────────────────────

const isFullscreen = ref(false)
const currentHeight = ref(props.defaultSize)
const isDragging = ref(false)
const dragStartY = ref(0)
const dragStartHeight = ref(0)

const drawerStyle = computed(() => ({
  height: `${currentHeight.value}vh`,
}))

function getVelocity() {
  if (pointerSamples.length < 2) return 0
  const oldest = pointerSamples[0]
  const newest = pointerSamples[pointerSamples.length - 1]
  const dy = newest.y - oldest.y          // positive = finger moved down
  const dt = newest.t - oldest.t
  return dt > 0 ? dy / dt : 0             // px/ms, positive = downward
}

// ─── Drag handlers ───────────────────────────────────────────────

function onDragStart(e) {
  isDragging.value = true
  dragStartY.value = e.touches ? e.touches[0].clientY : e.clientY
  dragStartHeight.value = currentHeight.value

  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
  window.addEventListener('touchmove', onDragMove, { passive: false })
  window.addEventListener('touchend', onDragEnd)
}

function onDragMove(e) {
  if (!isDragging.value) return
  if (e.cancelable) e.preventDefault() // prevent scroll-fighting on touch

  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  const delta = dragStartY.value - clientY
  const newHeight = dragStartHeight.value + (delta / window.innerHeight) * 100

  pointerSamples.push({ y: clientY, t: performance.now() })

  // Keep only samples within the window
  const cutoff = performance.now() - VELOCITY_SAMPLE_MS
  while (pointerSamples.length > 1 && pointerSamples[0].t < cutoff) {
    pointerSamples.shift()
  }

  // Clamp between default size and full viewport
  currentHeight.value = Math.max(
    props.defaultSize,
    Math.min(100, newHeight)
  )
}

function onDragEnd() {
  isDragging.value = false

  const velocity = getVelocity()
  pointerSamples.length = 0               // clear for next gesture

  if (velocity < -FLING_THRESHOLD) {
    // Fast upward fling → fullscreen
    isFullscreen.value = true
    currentHeight.value = 100;
  } else if (velocity > FLING_THRESHOLD) {
    // Fast downward fling → default
    isFullscreen.value = false
    currentHeight.value = props.defaultSize
  } else {
    // Slow/ambiguous → fall back to position
    // Snap: if dragged past threshold → fullscreen, otherwise → default
    if (currentHeight.value > FULLSCREEN_THRESHOLD) {
      isFullscreen.value = true
      currentHeight.value = 100;
    } else {
      isFullscreen.value = false
      currentHeight.value = props.defaultSize
    }
  }


  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('touchmove', onDragMove)
  window.removeEventListener('touchend', onDragEnd)
}

onUnmounted(() => {
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('touchmove', onDragMove)
  window.removeEventListener('touchend', onDragEnd)
})
</script>

<template>
  <div class="drawer z-1" :style="drawerStyle" :class="{ 'is-dragging': isDragging }">

    <!-- Drag handle -->
    <div
      class="drag-handle"
      @mousedown="onDragStart"
      @touchstart.prevent="onDragStart"
    >
      <span class="drag-pill" />
    </div>

    <!-- Drawer content: flex column so the list can fill remaining space -->
    <div class="drawer-content">

      <!-- Static elements above the list (add whatever you need here) -->
      <div class="drawer-header">
        <h2 class="drawer-title">Title</h2>
      </div>

      <!-- Scrollable list — flex: 1 + overflow-y: auto keeps it independent -->
      <slot class="drawer-list" />
      <!-- <ul class="drawer-list">
        <li v-for="n in 40" :key="n" class="drawer-list-item">
          Item {{ n }}
        </li>
      </ul> -->

    </div>
  </div>
</template>

<style scoped>
.drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #eeeeee;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  transition: height 0.3s ease, z-index 0s;
  will-change: height;
}

/* Disable transition while actively dragging for responsive feel */
.drawer.is-dragging {
  transition: none;
}

/* ─── Drag handle ─── */
.drag-handle {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0 14px;
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-pill {
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: #ccc;
}

/* ─── Content area ─── */
.drawer-content {
  flex: 1;           /* fill remaining drawer height */
  display: flex;
  flex-direction: column;
  overflow: hidden;  /* clip so only the list scrolls */
  padding: 0 16px;
}

.drawer-header {
  flex-shrink: 0;    /* never shrinks — always visible */
  padding: 0px 0 12px;
  border-bottom: 1px solid #eee;
}

.drawer-title {
  margin: 0;
  font-size: 1.1rem;
}

/* ─── Scrollable list ─── */
.drawer-list {
  flex: 1;           /* take all remaining space in drawer-content */
  overflow-y: auto;  /* scroll independently */
  list-style: none;
  margin: 0;
  padding: 8px 0;
  -webkit-overflow-scrolling: touch; /* smooth momentum scroll on iOS */
}

.drawer-list-item {
  padding: 12px 4px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.95rem;
  color: #333;
}
</style>
