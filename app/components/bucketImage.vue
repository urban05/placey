<template>
  <img v-if="imageSrc" :src="imageSrc" />
</template>

<script lang="ts" setup>
const { bucketUrl } = useBucketUrl();

const props = defineProps<{
  src: string;
}>();

const imageSrc = computed(() =>
  bucketUrl.value ? bucketUrl.value + props.src : null,
);
</script>
