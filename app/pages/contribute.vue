<template>
  <div class="fixed size-full flex flex-col p-4">
    <NonIndexHeader title="Contribute" />
    <div class="pt-4">
      <IconInput v-model="title" icon-name="twemoji:pen" placeholder="Title" />
    </div>
    <div class="flex gap-2 items-center border border-gray-700 rounded-md p-3 focus-within:outline-none focus-within:ring-indigo-500 focus-within:border-indigo-500">
      <textarea v-model="desc" class="grow outline-none min-h-10" placeholder="Description" />
    </div>
    <div class="w-full aspect-2/1 max-h-[40%] shrink-0 my-4">
      <Map>
        <template v-if="loaded">
          <Marker :lng-lat="[userLocation.longitude, userLocation.latitude]" icon="twemoji:round-pushpin" :is-shiny="false" />
        </template>
      </Map>
    </div>
    <div class="grow overflow-y-scroll border border-gray-700 rounded-md p-3">
      <Icon v-for="icon in iconConfig" :name="`twemoji:${icon}`" size="20" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import iconConfig from "@/assets/icons.json";

const userLocation = useUserLocation();

const loaded = ref(false);
const title = ref("");
const desc = ref("");


onMounted(() => {
  loaded.value = true;
});
</script>
