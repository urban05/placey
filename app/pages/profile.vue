<template>
  <div>
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
      <button @click="api.login(email, otp)">Login</button>
    </section>
  </div>
</template>

<script lang="ts" setup>

const api = useApi()

const registerEmail = ref("")
const registerUsername = ref("")

const email = ref("")
const otp = ref("")

</script>
