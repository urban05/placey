<template>
  <div>
    <section>
      <input v-model="registerEmail" />
      <input v-model="registerUsername" />
      <button @click="register(registerEmail, registerUsername)">Register</button>
    </section>
    <hr />
    <section>
      <input v-model="email" />
      <button @click="requestLogin(email)">Request Login</button>
      <input v-model="otp" />
      <button @click="login(email, otp)">Login</button>
    </section>
  </div>
</template>

<script lang="ts" setup>

const registerEmail = ref("")
const registerUsername = ref("")

async function register(email: string, username: string) {
  const response = await $fetch(
    `/api/user`, { method: "POST", body: { email, username } }
  );

  console.log(response)
}


const email = ref("")
const otp = ref("")

async function requestLogin(email: string) {
  const response = await $fetch(
    `/api/user/requestLogin`, { method: "POST", body: { email } }
  );

  console.log(response)
}

async function login(email: string, otp: string) {
  const response = await $fetch(
    `/api/user/login`, { method: "POST", body: { email, otp } }
  );

  console.log(response)
}

</script>
