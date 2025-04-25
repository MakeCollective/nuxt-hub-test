<script setup>
definePageMeta({
  middleware: ["auth"],
});
const { data: user, error } = await useCurrentUser();
console.log("index user", user);
console.log("index", error?.value);
</script>

<template>
  <main>
    <div v-if="user">{{ user.email }}</div>
    <div v-if="user">Righto let's go.</div>
  </main>
</template>
