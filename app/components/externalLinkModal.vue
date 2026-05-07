<script lang="ts" setup>
const { showing, link, hide } = useExternalLinkWarn();
const atag = useTemplateRef("atag")
</script>

<template>
  <div v-if="showing" class="fixed t-0 l-0 w-screen h-screen flex justify-center items-center bg-[#0006] z-1000" @click="hide()">
    <div class="w-3/4 max-w-lg p-4 text-center bg-white rounded-lg shadow flex flex-col gap-8" @click="(e) => e.stopPropagation()">
      <div class="text-3xl font-bold">External Page</div>
      <a ref="atag" :href="link" target="_blank" class="text-lg flex justify-center items-center gap-4">
        {{ atag?.hostname }}
        <svg width="16px" height="16px" viewBox="0 0 16.00 16.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00016" transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.16"></g><g id="SVGRepo_iconCarrier"><path d="M10 0L9 1L11.2929 3.29289L6.2929 8.29289L7.70711 9.70711L12.7071 4.7071L15 7L16 6V0H10Z" fill="#000000"></path><path d="M1 2H6V4H3V13H12V10H14V15H1V2Z" fill="#000000"></path></g></svg>
      </a>
      <div class="text-gray-600 text-xs">
        The link will open in a new tab.<br>
        We are not responsible of the content of that page.<br>
        Proceed at your own risk.
      </div>
    </div>
  </div>
</template>

<style>

</style>