<script setup>
definePageMeta({
  middleware: ["auth"],
  layout: "user",
});
</script>

<template>
  <main>
    <div>Welcome to my dashboard</div>
    <NuxtLink to="/profile">Profile</NuxtLink>
  </main>
</template>

<style scoped></style>
