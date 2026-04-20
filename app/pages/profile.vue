<template>
  <div v-if="user">
    <section>
      <button @click="logout()">Logout</button>
      <NuxtLink to="/">Back to home</NuxtLink>
    </section>
  </div>
  <div v-else class="w-screen h-screen flex flex-col justify-center align-middle bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]" :style="{backgroundImage: 'linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)', backgroundSize: '2em 2em'}">
    <form class="w-full max-w-lg mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      <div class="p-8">
        <NuxtLink to="/" class="text-xs">Back to home</NuxtLink>
        <h2 class="text-center text-3xl font-extrabold">{{ registerView ? 'Register' : 'Welcome Back' }}</h2>
        <section class="flex flex-col px-4 mt-8">
          <MsgBox v-if="error" type="error" class="mb-4">{{ error }}</MsgBox>
          <template v-if="otpView && email !== ''">
            <MsgBox type="info" class="mb-4">Please enter the code we have send you to your email address.</MsgBox>
            <IconInput v-model="otp" icon-name="" placeholder="OTP token" @submit="login()" />
            <button @click="login()" class="primaryButton" :disabled="loading">{{ loading ? '...' : 'Login' }}</button>
          </template>
          <template v-else>
            <template v-if="registerView">
              <IconInput v-model="email" icon-name="twemoji:envelope" placeholder="E-Mail" autocomplete="email" type="email" />
              <IconInput v-model="username" icon-name="twemoji:bust-in-silhouette" placeholder="Username" @submit="register()" />
              <button @click="register()" class="primaryButton" :disabled="loading">{{ loading ? '...' : 'Register' }}</button>
              <div>
                Already have an account?
                <button @click="registerView = false; error = null;" class="secondaryButton">Login instead</button>
              </div>
            </template>
            <template v-else>
              <IconInput v-model="email" icon-name="twemoji:envelope" placeholder="E-Mail" autocomplete="email" type="email" @submit="requestLogin()" />
              <button @click="requestLogin()" class="primaryButton" :disabled="loading">{{ loading ? '...' : 'Request Code' }}</button>
              <div>
                New here?
                <button @click="registerView = true; error = null;" class="secondaryButton">Register</button>
              </div>
            </template>
          </template>
        </section>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { FetchError } from 'ofetch'

const api = useApi()
const user = useUser();
const votes = useVotes();

const loading = ref(false);
const registerView = ref(false);
const otpView = ref(false);
const error = ref<string | null>(null);

const username = ref("")
const email = ref("")
const otp = ref("")


async function register() {
  if (email.value === '' || username.value === '') {
    error.value = 'Please specify your email address and username!';
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    await api.register(email.value, username.value);
    await requestLogin();
    loading.value = false;
  }
  catch (e) {
    loading.value = false;
    if (e instanceof FetchError) {
      if (e.statusCode === 409) {
        error.value = "E-Mail is already registered!";
        return;
      }
    }
    console.log("error while registering:", e)
  }
  return;
}

async function requestLogin() {
  if (email.value === '') {
    error.value = 'Please specify your email address!';
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    await api.requestLogin(email.value);
    otpView.value = true;
    loading.value = false;
  }
  catch (e) {
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
  if (email.value === '') {
    registerView.value = false;
    otpView.value = false;
    error.value = "There was a strange error, could you re-enter your email address? Sorry for the inconvenience."
    return;
  }
  try {
    loading.value = true;
    error.value = null;
    await api.login(email.value, otp.value)
    votes.value = await api.fetchVotes();
    loading.value = false;
  }
  catch(e) {
    loading.value = false;
    if (e instanceof FetchError) {
      if (e.statusCode == 403) {
        error.value = "The code is wrong!"
        return;
      }
    }
    console.log("error while requesting login:", e);
  }
}

function logout() {
  user.value = null;
  otpView.value = false
  registerView.value = false;
}
</script>

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
  margin-top: 1em;
}
</style>
