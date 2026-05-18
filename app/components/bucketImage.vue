<template>
  <img :src="imageSrc" />
</template>

<script lang="ts" setup>

const { bucketUrl } = useBucketUrl();

const props = defineProps<{
  src: string;
}>();

const imageSrc = computed(() => bucketUrl.value + props.src)

</script>
