<script lang="ts" setup>
const user = useUser();
const router = useRouter();

const props = defineProps<{title: string}>();

const modalRef = useTemplateRef('modalRef');
const showModal = ref(false);

function logout() {
  user.value = null;
  location.reload();
}

function onDocClick(e: any) {
  if (showModal.value && !e.target.contains(modalRef.value))
  showModal.value = false;
}

watch(showModal, (newValue) => {
  if (newValue) setTimeout(() => document.addEventListener('click', onDocClick), 0);
  else document.removeEventListener('click', onDocClick);
});

onUnmounted(() => document.removeEventListener('click', onDocClick));
</script>

<template>
  <!-- settings modal -->
  <div v-if="showModal" ref="modalRef" class="fixed top-22 right-4 w-50 p-2 flex flex-col gap-2 bg-white rounded-lg shadow z-10">
    <NuxtLink to="/profile" class="flex gap-3 items-center p-2 rounded-md cursor-pointer text-[#141414] active:scale-[99%]">
      <img src="../assets/placey-happy.webp" class="size-5" />
      <div class="font-semibold">Profile</div>
    </NuxtLink>
    <NuxtLink to="/settings" class="flex gap-3 items-center p-2 rounded-md cursor-pointer text-[#141414] active:scale-[99%]">
      <Icon name="twemoji:gear" class="size-5" />
      <div class="font-semibold">Settings</div>
    </NuxtLink>
    <NuxtLink to="/contribute" class="flex gap-3 items-center p-2 rounded-md cursor-pointer text-[#141414] active:scale-[99%]">
      <Icon name="twemoji:plus" class="size-5" />
      <div class="font-semibold">Contribute</div>
    </NuxtLink>
    <NuxtLink to="/impressum" class="flex gap-3 items-center p-2 rounded-md cursor-pointer text-[#141414] active:scale-[99%]">
      <Icon name="twemoji:information" class="size-5" />
      <div class="font-semibold">Impressum</div>
    </NuxtLink>
    <button class="flex gap-3 items-center p-2 rounded-md cursor-pointer text-[#141414] active:scale-[99%]" @click="logout()">
      <Icon name="twemoji:ladder" class="size-5" />
      <div class="font-semibold">Log out</div>
    </button>
  </div>  

  <!-- Bar -->
  <section class="flex justify-between items-start">
    <button class="flex justify-center items-center size-15 border border-gray-200 rounded-full shadow cursor-pointer" @click="router.back()">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 36 36"><path fill="#000" d="M29 14h-9V7L7 18l13 11v-7h9z"/></svg>
    </button>
    <div class="self-center text-2xl font-bold">{{ props.title }}</div>
    <button class="flex justify-center items-center size-15 border border-gray-200 rounded-full shadow cursor-pointer" @click="showModal = true"><Icon name="twemoji:gear" size="30" /></button>
  </section>
</template>

<style>

</style>