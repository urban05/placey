<template>
  <div class="p-4">
    <NonIndexHeader title="Contribute" />
    <IconInput v-model="title" icon-name="twemoji:pen" placeholder="Title" />
    <div class="flex gap-2 items-center border border-gray-700 rounded-md my-2 p-3 focus-within:outline-none focus-within:ring-indigo-500 focus-within:border-indigo-500">
      <textarea v-model="desc" class="grow outline-none min-h-10" placeholder="Description" />
    </div>
    <Map class="w-full h-100" :bottom-margin="0">

    </Map>
    <div>[icons]</div>
  </div>
</template>

<script lang="ts" setup>
const title = ref("");
const desc = ref("");
</script>
