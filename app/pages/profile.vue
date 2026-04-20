<template>
  <div>
    <<NuxtLink to="/">Back to home</NuxtLink>
      <section>
        <input v-model="registerEmail" />
        <input v-model="registerUsername" />
        <button @click="api.register(registerEmail, registerUsername)">Register</button>
      </section>
      <hr />
      <section>
        <input v-model="email" />
        <button @click="api.requestLogin(email)">Request Login</button>
        <input v-model="otp" />
        <button @click="login">Login</button>
      </section>
  </div>
</template>

<script lang="ts" setup>

const api = useApi()

const registerEmail = ref("")
const registerUsername = ref("")

const email = ref("")
const otp = ref("")

const votes = useVotes();

async function login() {
  await api.login(email.value, otp.value)
  votes.value = await api.fetchVotes();
}

</script>
