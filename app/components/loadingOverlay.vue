<!-- components/LoadingOverlay.vue -->
<script setup lang="ts">
const { isLoading, finish } = useInitialLoad()
const route = useRoute();

onMounted(() => {
  if (["/", "/contribute"].includes(route.path)) {
    setTimeout(finish, 3000);
  }
  else {
    finish();
  }
})
</script>

<template>
  <Transition name="fade">
    <div v-if="isLoading" class="fixed t-0 l-0 w-screen h-screen z-1000 flex justify-center items-center bg-white">
      <div class="spinner" />
      <!-- <img src="/loading.gif" class="size-50" /> -->
    </div>
  </Transition>    
</template>

<style scoped>

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e5e5;
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-leave-active { transition: opacity 0.3s ease; }
.fade-leave-to    { opacity: 0; }
</style>