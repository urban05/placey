<template>
  <nav class="flex flex-row justify-center p-2 gap-2 h-16 z-100 md:px-24">
    <PlaceSearch class="w-full" />
    <div class="aspect-square bg-white shadow-lg rounded-full flex justify-center place-items-center">
      <Icon name="twemoji:plus" size="30" />
    </div>
    <NuxtLink to="/profile"
      class="aspect-square bg-white shadow-lg rounded-full flex justify-center place-items-center outline-4 outline-gray-200 md:absolute md:right-4 md:top-4 md:h-16">
      <img src="../assets/placey-happy.webp" class="h-11 md:h-14 aspect-square" />
    </NuxtLink>
  </nav>
</template>

<script lang="ts" setup></script>
