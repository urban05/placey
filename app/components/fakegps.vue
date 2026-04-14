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

    <div class="relative w-40 h-40 mx-auto rounded-full border flex items-center justify-center"
      :class="enabled ? 'bg-gray-100' : 'bg-gray-200 opacity-50'">
      <div class="w-16 h-16 bg-blue-500 rounded-full transition-transform duration-100" :style="stickStyle"></div>
    </div>
  </div>
</template>

<script setup>
const enabled = ref(true)
const x = ref(0)
const y = ref(0)

const location = useUserLocation()

const step = 40
const moveSpeed = 0.0005
const rotateStep = 5

const movementKeys = ['w', 'a', 's', 'd']
const rotateKeys = ['q', 'e']

const degToRad = (deg) => deg * (Math.PI / 180)

const moveForward = (dir = 1) => {
  const rad = degToRad(location.value.heading)
  location.value.latitude += Math.cos(rad) * moveSpeed * dir
  location.value.longitude += Math.sin(rad) * moveSpeed * dir
}

const moveSide = (dir = 1) => {
  const rad = degToRad(location.value.heading + 90)
  location.value.latitude += Math.cos(rad) * moveSpeed * dir
  location.value.longitude += Math.sin(rad) * moveSpeed * dir
}

const handleKeyDown = (e) => {
  if (!enabled.value) return

  const key = e.key.toLowerCase()

  if ([...movementKeys, ...rotateKeys].includes(key)) {
    e.preventDefault()
  }

  switch (key) {
    case 'w':
      y.value = -step
      moveForward(1)
      break
    case 's':
      y.value = step
      moveForward(-1)
      break
    case 'a':
      x.value = -step
      moveSide(-1)
      break
    case 'd':
      x.value = step
      moveSide(1)
      break
    case 'q':
      location.value.heading = (location.value.heading - rotateStep + 360) % 360
      break
    case 'e':
      location.value.heading = (location.value.heading + rotateStep) % 360
      break
  }
}

const handleKeyUp = (e) => {
  if (!enabled.value) return

  const key = e.key.toLowerCase()

  if ([...movementKeys, ...rotateKeys].includes(key)) {
    e.preventDefault()
  }

  x.value = 0
  y.value = 0
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown, { passive: false })
  window.addEventListener('keyup', handleKeyUp, { passive: false })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})

const stickStyle = computed(() => ({
  transform: `translate(${x.value}px, ${y.value}px)`
}))
</script>