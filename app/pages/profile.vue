<script lang="ts" setup>
import { FetchError } from "ofetch";
import type { Place } from "~~/shared/place.type";

const api = useApi();
const user = useUser();
const votes = useVotes();
const visitedPlaces = useVisitedPlaces();
const places = ref<Place[] | null>(null);

const loading = ref(false);
const registerView = ref(false);
const otpView = ref(false);
const error = ref<string | null>(null);

const username = ref("");
const email = ref("");
const otp = ref("");

const now = useNow({ interval: 100});
const otpTimeout = 30000;
const otpSendedTime = ref(Date.now());
const otpSendedElapsed = computed(() => now.value.getTime() - otpSendedTime.value);
const otpSendAllow = computed(() => otpSendedElapsed.value > otpTimeout);

const placeSearch = ref("");

onMounted(async () => {
  places.value = await visitedPlaces.getPlaces();
});

const filteredPlaces = computed(() => places.value?.filter((v, _) => v.name.toLowerCase().includes(placeSearch.value.toLowerCase()) ?? []));


async function register() {
  if (email.value === "" || username.value === "") {
    error.value = "Please specify your email address and username!";
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    await api.register(email.value, username.value);
    await requestLogin();
    loading.value = false;
  } catch (e) {
    loading.value = false;
    if (e instanceof FetchError) {
      if (e.statusCode === 409) {
        error.value = "E-Mail is already registered!";
        return;
      }
    }
    console.log("error while registering:", e);
  }
  return;
}

async function requestLogin() {
  if (email.value === "") {
    error.value = "Please specify your email address!";
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    await api.requestLogin(email.value);
    otpSendedTime.value = Date.now();
    otpView.value = true;
    loading.value = false;
  } catch (e) {
    loading.value = false;
    if (e instanceof FetchError) {
      if (e.statusCode === 404) {
        error.value = "E-Mail doesn't exists!";
        return;
      }
    }
    console.log("error while requesting login:", e);
  }
}

async function login() {
  if (email.value === "") {
    registerView.value = false;
    otpView.value = false;
    error.value =
      "There was a strange error, could you re-enter your email address? Sorry for the inconvenience.";
    return;
  }
  try {
    loading.value = true;
    error.value = null;
    await api.login(email.value, otp.value);
    votes.fetch();
    loading.value = false;
    otpView.value = false;
    registerView.value = false;
  } catch (e) {
    loading.value = false;
    if (e instanceof FetchError) {
      if (e.statusCode == 403) {
        error.value = "The code is wrong!";
        return;
      }
    }
    console.log("error while requesting login:", e);
  }
}
</script>

<template @click="showModal = false">
  <!-- main -->
  <div v-if="user" class="w-screen h-screen p-4 flex flex-col">
    <NonIndexHeader title="Profile" />
    <section class="flex gap-8 px-4 py-12 items-stretch">
      <img src="../assets/placey-happy.webp" class="h-20 aspect-square p-2 border border-gray-200 rounded-full" />
      <div class="grow flex flex-col items-center">
        <div class="grow flex justify-center items-center text-5xl font-bold">16</div>
        <p>Du bist der Allerbeste!</p>
      </div>
    </section>
    <section class="grow flex flex-col gap-4">
      <div class="w-full max-w-xl border border-gray-300 rounded-full flex gap-2 mx-auto px-4 py-2">
        <input v-model="placeSearch" placeholder="Search Places" class="grow outline-none min-w-0" />
        <Icon name="twemoji:magnifying-glass-tilted-right" class="shrink-0 grayscale pointer-events-none" size="30" />
      </div>
      <div class="grow grid grid-cols-4 content-start gap-2">
        <div v-for="place in filteredPlaces" class="relative flex justify-center items-center border border-gray-300 aspect-square overflow-hidden">
          <Icon :name="place.icon" size="50" />
          <img :src="place.image ?? 'placeholder.svg'" class="absolute size-full object-cover object-center opacity-50 -z-1" />
          <div class="absolute bottom-0 w-full text-xs">{{ place.name }}</div>
        </div>
      </div>
    </section>
  </div>

  <!-- login -->
  <div
    v-else
    class="w-screen h-screen flex flex-col justify-center align-middle bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]"
    :style="{
      backgroundImage: 'linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)',
      backgroundSize: '2em 2em',
    }"
  >
    <form class="w-full max-w-lg mx-auto p-8 bg-white rounded-lg shadow-xl overflow-hidden">
      <NuxtLink to="/" class="text-xs">Back to home</NuxtLink>
      <h2 class="text-center text-3xl font-extrabold">
        {{ registerView ? "Register" : "Welcome Back" }}
      </h2>
      <section class="flex flex-col px-4 mt-8">
        <MsgBox v-if="error" type="error" class="mb-4">{{ error }}</MsgBox>

        <!-- login: otp -->
        <template v-if="otpView && email !== ''">
          <MsgBox type="info" class="mb-4">
            Please enter the code we have send you to your email address.
          </MsgBox>
          <IconInput v-model="otp" icon-name="" placeholder="OTP token" @submit="login()" />
          <button @click="login()" class="primaryButton" :disabled="loading">
            {{ loading ? "..." : "Login" }}
          </button>
          <div class="mt-4">
            Didn't worked?
            <button
              v-if="otpSendAllow"
              class="secondaryButton"
              type="button"
              @click="requestLogin()"
            >
              Resend Code
            </button>
            <span v-else>Resend Code in {{ Math.ceil((otpTimeout - otpSendedElapsed) / 1000) }}</span>
          </div>
        </template>

        <template v-else>
          <!-- login: register -->
          <template v-if="registerView">
            <IconInput v-model="email" icon-name="twemoji:envelope" placeholder="E-Mail" autocomplete="email" type="email" />
            <IconInput v-model="username" icon-name="twemoji:bust-in-silhouette" placeholder="Username" @submit="register()" />
            <button class="primaryButton" :disabled="loading" @click="register()">
              {{ loading ? "..." : "Register" }}
            </button>
            <div class="mt-4">
              Already have an account?
                <button class="secondaryButton" @click="registerView = false; error = null;">
                Login instead
              </button>
            </div>
          </template>

          <!-- login: login -->
          <template v-else>
            <IconInput v-model="email" icon-name="twemoji:envelope" placeholder="E-Mail" autocomplete="email" type="email" @submit="requestLogin()" autofocus />
            <button class="primaryButton" :disabled="loading" @click="requestLogin()">
              {{ loading ? "..." : "Request Code" }}
            </button>
            <div class="mt-4">
              New here?
                <button class="secondaryButton" @click="registerView = true; error = null;">
                Register
              </button>  
            </div>
          </template>  
        </template>    
      </section>
    </form>      
  </div>
</template>

<style scoped>
button {
  cursor: pointer;
}
.primaryButton {
  margin-block: 0.5em;
  background-color: var(--color-indigo-500);
  border-style: var(--tw-border-style);
  border-width: 1px;
  border-radius: var(--radius-md);
  padding-inline: calc(var(--spacing) * 4);
  padding-block: calc(var(--spacing) * 3);
  text-align: center;
  font-weight: var(--font-weight-medium);
}
.secondaryButton {
  color: darkblue;
}
</style>
