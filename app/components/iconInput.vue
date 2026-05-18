<script lang="ts" setup>
defineOptions({
  inheritAttrs: false
});

const model = defineModel();
const props = defineProps<{iconName: string}>();
defineEmits(['submit'])
</script>

<template>
  <div class="flex gap-2 items-center border border-gray-700 rounded-md my-2 p-3 focus-within:outline-none focus-within:ring-indigo-500 focus-within:border-indigo-500">
    <Icon :name="iconName" />
    <input v-model="model" v-bind="$attrs" class="grow outline-none" @submit="$emit('submit')" />
  </div>
</template>

<style scoped>
</style>