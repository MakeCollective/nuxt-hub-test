<script setup>
definePageMeta({
  middleware: ["auth"],
});
const user = useCurrentUser();
console.log("index user", user.value);
</script>

<template>
  <main>
    <div v-if="user">{{ user.id }}</div>
    <div v-if="user">Righto let's go.</div>
  </main>
</template>
