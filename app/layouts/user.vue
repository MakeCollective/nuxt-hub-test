<script setup lang="ts">
const user = await useCurrentUser();
const { logout } = useAuth();
</script>

<template>
  <div>
    <nav class="user-bar">
      <div v-if="user">Hi {{ user.firstName }}</div>
      <div>
        <button v-if="user" @click="logout">Logout</button>
        <div v-else>Log In</div>
      </div>
    </nav>
    <div v-if="user">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped>
.user-bar {
  background-color: #f8f9fa;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
