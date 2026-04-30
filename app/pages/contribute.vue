<template>
  <div class="p-4">
    <NonIndexHeader title="Contribute" />
    <IconInput v-model="title" icon-name="twemoji:pen" placeholder="Title" />
    <div class="flex gap-2 items-center border border-gray-700 rounded-md my-2 p-3 focus-within:outline-none focus-within:ring-indigo-500 focus-within:border-indigo-500">
      <textarea v-model="desc" class="grow outline-none min-h-10" placeholder="Description" />
    </div>
    <Map class="w-full h-100">
      <template v-if="loaded">
        <Marker :lng-lat="[userLocation.longitude, userLocation.latitude]" icon="twemoji:round-pushpin" :is-shiny="false" />
      </template>
    </Map>
    <div>
      <div v-for="(items, category) in iconCategories">
        <div>{{ category }}</div>
        <Icon v-for="icon in items" :name="`twemoji:${icon}`" size="20" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface IconCollection {
  [key: string]: string[]
}

const userLocation = useUserLocation();

const loaded = ref(false);
const title = ref("");
const desc = ref("");
const iconCategories = ref<IconCollection>();


onMounted(async () => {
  loaded.value = true;

  iconCategories.value = (await $fetch('https://api.iconify.design/collection?prefix=twemoji') as any).categories;
});
</script>
