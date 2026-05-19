<script lang="ts" setup>
definePageMeta({
  middleware: ["login"],
});

import compliments from "@/assets/compliments.json";

const user = useUser();
const visitedPlaces = useVisitedPlaces();
const { setCurrentPlace } = useCurrentPlace();

const placeSearch = ref("");
const compliment = ref("");

const filteredPlaces = computed(() =>
  visitedPlaces.visitedPlaces.value.filter(
    (v, _) =>
      v.name.toLowerCase().includes(placeSearch.value.toLowerCase()) ?? [],
  ),
);

onMounted(() => {
  visitedPlaces.fetchPlaces();
  compliment.value = compliments[Math.round(Math.random() * compliments.length)] ?? "";
});
</script>

<template @click="showModal = false">
  <!-- main -->
  <div v-if="user" class="w-dvw h-dvh p-4 flex flex-col">
    <NonIndexHeader title="Profile" />
    <section class="flex gap-8 px-4 py-12 items-stretch">
      <img
        src="../assets/placey-happy.webp"
        class="h-20 aspect-square p-2 border border-gray-200 rounded-full"
      />
      <div class="grow flex flex-col items-center">
        <div class="grow flex justify-center items-center text-5xl font-bold">
          {{ visitedPlaces.visitedPlaces.value.length }}
        </div>
        <p>{{ compliment }}</p>
      </div>
    </section>
    <section class="grow flex flex-col gap-4">
      <div
        class="w-full max-w-xl border border-gray-300 rounded-full flex gap-2 mx-auto px-4 py-2"
      >
        <input
          v-model="placeSearch"
          placeholder="Search Places"
          class="grow outline-none min-w-0"
        />
        <Icon
          name="twemoji:magnifying-glass-tilted-right"
          class="shrink-0 grayscale pointer-events-none"
          size="30"
        />
      </div>
      <div class="grow grid grid-cols-4 content-start gap-2">
        <NuxtLink
          v-for="place in filteredPlaces"
          to="/"
          class="relative flex justify-center items-center border border-gray-300 aspect-square overflow-hidden"
          @click="setCurrentPlace(place.id)"
        >
          <Icon :name="place.icon" size="50" />
          <BucketImage
            v-if="place.image"
            :src="place.image"
            class="absolute size-full object-cover object-center opacity-50 -z-1 blur-xs"
          />
          <div class="absolute bottom-0 w-full text-sm text-center p-2">
            {{ place.name }}
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
