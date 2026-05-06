<script lang="ts" setup>
const { show } = useExternalLinkWarn();

const props = defineProps<{ link: string }>();
</script>

<template>
  <a
    :href="link"
    class="aspect-square size-8 relative rounded-full shadow-lg bg-white cursor-pointer flex justify-center items-center"
    @click="(e: any) => {e.preventDefault(); show(link);}"
  >
    <slot />
  </a>
</template>

<style>

</style>