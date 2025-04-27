<script setup lang="ts">
import type { H3Error } from "h3";
const { login } = useAuth();

const form = ref({
  email: "",
  password: "",
});

const loading = ref(false);
const error = ref("");

async function handleSubmit() {
  error.value = "";
  loading.value = true;

  try {
    await login(form.value.email, form.value.password);
  } catch (err: unknown) {
    const serverError = err as H3Error;
    error.value = serverError.message || "Something went wrong";
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div class="max-w-md mx-auto py-12">
    <h1 class="text-2xl font-semibold mb-6">Login</h1>
    <NuxtLink to="/dashboard">
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Dashboard
      </button>
    </NuxtLink>
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700"
          >Email</label
        >
        <input
          v-model="form.email"
          type="email"
          id="email"
          required
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700"
          >Password</label
        >
        <input
          v-model="form.password"
          type="password"
          id="password"
          required
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {{ loading ? "Registering..." : "Register" }}
      </button>

      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
    </form>
  </div>
</template>
