<script lang="ts" setup>
const { show } = useExternalLinkWarn();

const props = defineProps<{ link: string }>();
</script>

<template>
  <a
    :href="link"
    @click="(e: any) => {e.preventDefault(); show(link);}"
  >
    <slot />
  </a>
</template>

<style>

</style>
