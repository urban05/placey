<template>
  <div class="flex flex-col justify-center place-items-center">
    <button
      @click="toggleUpvote"
      :disabled="!isLoggedIn"
      :class="!isLoggedIn ? 'opacity-50' : ''"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 36 36"
      >
        <path
          :fill="isUpvoted ? '#008148' : '#ccc'"
          d="M22 29v-9h7L18 7L7 20h7v9z"
        />
      </svg>
    </button>

    <span>{{ place.votes }}</span>

    <button
      @click="toggleDownvote"
      :disabled="!isLoggedIn"
      :class="!isLoggedIn ? 'opacity-50' : ''"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 36 36"
      >
        <path
          :fill="isDownvoted ? '#F03D2D' : '#ccc'"
          d="M22 7v9h7L18 29L7 16h7V7z"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { Place } from "~~/shared/place.type";

const { votes, fetch, vote } = useVotes();
const user = useUser();

const props = defineProps<{
  place: Place;
}>();

const isUpvoted = computed(() => {
  return (
    votes.value.has(props.place.id) && votes.value.get(props.place.id) === true
  );
});

const isDownvoted = computed(() => {
  return (
    votes.value.has(props.place.id) && votes.value.get(props.place.id) === false
  );
});

const isLoggedIn = computed(() => {
  return user.value !== null;
});

function toggleUpvote() {
  if (isUpvoted.value) {
    vote(props.place.id, null);
  } else {
    vote(props.place.id, true);
  }
}

function toggleDownvote() {
  if (isDownvoted.value) {
    vote(props.place.id, null);
  } else {
    vote(props.place.id, false);
  }
}
</script>
