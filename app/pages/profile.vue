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

const user = useUser()

const registerEmail = ref("")
const registerUsername = ref("")

async function register(email: string, username: string) {
  const response = await $fetch(
    `/api/user`, { method: "POST", body: { email, username } }
  );
}


const email = ref("")
const otp = ref("")

async function requestLogin(email: string) {
  const response = await $fetch(
    `/api/user/requestLogin`, { method: "POST", body: { email } }
  );
}

async function login(email: string, otp: string) {
  const response = await $fetch(
    `/api/user/login`, { method: "POST", body: { email, otp } }
  );

  if (!response) return;
  user.value = response;
}

</script>
