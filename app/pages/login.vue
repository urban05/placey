<script lang="ts" setup>
import { FetchError } from "ofetch";

const api = useApi();
const user = useUser();
const route = useRoute();
const votes = useVotes();
const visitedPlaces = useVisitedPlaces();

const loading = ref(false);
const registerView = ref(false);
const otpView = ref(false);
const error = ref<string | null>(null);

const username = ref("");
const email = ref("");
const otp = ref("");

const now = useNow({ interval: 100 });
const otpTimeout = 30000;
const otpSendedTime = ref(Date.now());
const otpSendedElapsed = computed(
  () => now.value.getTime() - otpSendedTime.value,
);
const otpSendAllow = computed(() => otpSendedElapsed.value > otpTimeout);

function doRedirect() {
  navigateTo(route.query.redirect?.toString() ?? "/");
}

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

    setTimeout(() => {
      // TODO: this needs to be handles better!
      votes.fetch();
      visitedPlaces.fetchPlaces();
    }, 0);

    loading.value = false;
    otpView.value = false;
    registerView.value = false;

    doRedirect();
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

<template>
  <div
    class="w-dvw h-dvh flex flex-col justify-center align-middle bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]"
    :style="{
      backgroundImage:
        'linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)',
      backgroundSize: '2em 2em',
    }"
  >
    <form
      class="w-full max-w-lg mx-auto p-8 bg-white rounded-lg shadow-xl overflow-hidden"
    >
      <template v-if="user">
        <div class="flex flex-col gap-4">
          <MsgBox type="info" class="text-center"
            >You are already logged in!</MsgBox
          >
          <NuxtLink to="/" class="primaryButton self-center"
            >To Homepage</NuxtLink
          >
        </div>
      </template>
      <template v-else>
        <NuxtLink to="/" class="text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 36 36"
          >
            <path fill="#000" d="M29 14h-9V7L7 18l13 11v-7h9z" />
          </svg>
        </NuxtLink>
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
            <IconInput
              v-model="otp"
              icon-name=""
              placeholder="OTP token"
              @submit="login()"
            />
            <button
              @click="login()"
              class="primaryButton my-0.5"
              :disabled="loading"
            >
              {{ loading ? "..." : "Login" }}
            </button>
            <div class="mt-4">
              Didn't work?
              <button
                v-if="otpSendAllow"
                class="secondaryButton"
                type="button"
                @click="requestLogin()"
              >
                Resend code
              </button>
              <span v-else
                >Resend code in
                {{ Math.ceil((otpTimeout - otpSendedElapsed) / 1000) }}</span
              >
            </div>
          </template>

          <template v-else>
            <!-- login: register -->
            <template v-if="registerView">
              <IconInput
                v-model="email"
                icon-name="twemoji:envelope"
                placeholder="E-Mail"
                autocomplete="email"
                type="email"
              />
              <IconInput
                v-model="username"
                icon-name="twemoji:bust-in-silhouette"
                placeholder="Username"
                @submit="register()"
              />
              <button
                class="primaryButton my-0.5"
                :disabled="loading"
                @click="register()"
              >
                {{ loading ? "..." : "Register" }}
              </button>
              <div class="mt-4">
                Already have an account?
                <button
                  class="secondaryButton"
                  @click="
                    registerView = false;
                    error = null;
                  "
                >
                  Login instead
                </button>
              </div>
            </template>

            <!-- login: login -->
            <template v-else>
              <IconInput
                v-model="email"
                icon-name="twemoji:envelope"
                placeholder="E-Mail"
                autocomplete="email"
                type="email"
                @submit="requestLogin()"
                autofocus
              />
              <button
                class="primaryButton my-0.5"
                :disabled="loading"
                @click="requestLogin()"
              >
                {{ loading ? "..." : "Request Code" }}
              </button>
              <div class="mt-4">
                New here?
                <button
                  class="secondaryButton"
                  @click="
                    registerView = true;
                    error = null;
                  "
                >
                  Register
                </button>
              </div>
            </template>
          </template>
        </section>
      </template>
    </form>
    <ul class="fixed w-full text-center bottom-2 p-4">
      <li>versatiles for vector tiles</li>
      <li>iconify/glyphs-twemoji for icons, CC-BY 4.0</li>
    </ul>
  </div>
</template>

<style>
button {
  cursor: pointer;
}
.primaryButton {
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
