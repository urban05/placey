<script lang="ts" setup>
const props = defineProps<{type: 'info' | 'warning' | 'error'}>();

const classes = {
  'info': 'bg-blue-100 border border-blue-400 text-blue-700',
  'warning': 'bg-orange-100 border border-orange-400 text-orange-700',
  'error': 'bg-red-100 border border-red-400 text-red-700'
};
</script>

<template>
  <div :class="classes[type]" class="px-4 py-2 rounded-lg"><slot /></div>
</template>