<script lang="ts" setup>
definePageMeta({
  middleware: ["login"],
});

import iconConfig from "@/assets/icons.json";
import Fuse from "fuse.js";

const fuse = new Fuse(iconConfig);

const userLocation = useUserLocation();
const api = useApi();

const loaded = ref(false);
const title = ref("");
const desc = ref("");
const address = ref("");
const iconName = ref("twemoji:otter");
const iconSearch = ref("");
const image = ref<string | null>(null);

const icons = computed(() => fuse.search(iconSearch.value));

onMounted(() => {
  loaded.value = true;
});

function onFileChange(e: any) {
  var files = e.target.files || e.dataTransfer.files;
  if (!files.length)
    return;

  const reader = new FileReader();
  reader.onload = () => {
    image.value = reader.result as any;
   };
  reader.readAsDataURL(files[0]);
}

async function onContribute() {
  await api.createPlace({
    address: address.value,
    description: desc.value,
    icon: iconName.value,
    image: image.value ?? "",
    latitude: userLocation.value.latitude,
    longitude: userLocation.value.longitude,
    name: title.value
  });
  navigateTo("/");
}
</script>

<template>
  <div class="fixed size-full flex flex-col p-4 overflow-y-scroll">
    <!-- Bar -->
    <section class="flex justify-between items-start">
      <NuxtLink to="/" class="flex justify-center items-center size-15 border border-gray-200 rounded-full shadow cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 36 36"><path fill="#000" d="M29 14h-9V7L7 18l13 11v-7h9z"/></svg>
      </NuxtLink>
      <div class="self-center text-2xl font-bold">Contribute</div>
      <button class="flex justify-center items-center size-15 border border-gray-200 rounded-full shadow cursor-pointer" @click="onContribute()">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 36 36"><path fill="#000" d="M22 29v-9h7L18 7L7 20h7v9z"/></svg>
      </button>
    </section>
    <div class="pt-4">
      <IconInput v-model="title" icon-name="twemoji:pen" placeholder="Title" />
    </div>
    <div class="flex gap-2 items-center border border-gray-700 rounded-md p-3 focus-within:outline-none focus-within:ring-indigo-500 focus-within:border-indigo-500">
      <textarea v-model="desc" class="grow outline-none min-h-10" placeholder="Description" />
    </div>
    <div>
      <IconInput v-model="address" icon-name="twemoji:closed-mailbox-with-lowered-flag" placeholder="Address" />
    </div>
    <div class="w-full aspect-2/1 max-h-[40%] shrink-0">
      <Map>
        <template v-if="loaded">
          <!-- <Marker :lng-lat="[userLocation.longitude, userLocation.latitude]" icon="twemoji:round-pushpin" :is-shiny="false" /> -->
          <Marker :lng-lat="[userLocation.longitude, userLocation.latitude]" :icon="iconName" :is-shiny="false" />
        </template>
      </Map>
    </div>
    <div class="grow border border-gray-700 rounded-md p-2 my-4 min-h-65 flex flex-col">
      <div class="mb-3 w-full max-w-xl mx-auto relative">
        <input v-model="iconSearch" type="text" placeholder="Search icons" class="bg-white rounded-full px-4 py-1 shadow-lg w-full" />
        <Icon name="twemoji:magnifying-glass-tilted-right"
          class="absolute right-2 top-1/2 -translate-y-1/2 grayscale pointer-events-none" size="24" />
      </div>
      <div class="grow grid grid-cols-[repeat(auto-fit,minmax(42px,1fr))] gap-2 min-h-0 overflow-y-scroll overflow-x-hidden">
        <Icon v-for="icon in icons" :name="`twemoji:${icon.item}`" size="42" @click="iconName = `twemoji:${icon.item}`" class="cursor-pointer" />
      </div>
    </div>
    <div class="border border-gray-700 rounded-md p-2 relative">
      <input @change="onFileChange" type="file" accept="image/png, image/gif, image/jpeg, image/webp" class="absolute size-full top-0 left-0 opacity-0">
      <span v-if="!image">Select an image</span>
      <img v-else :src="image" />
    </div>
  </div>
</template>

<style scoped></style>
