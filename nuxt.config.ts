// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-07-30",
  // Nuxt 4 directory structure and features
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  // Nuxt Modules
  // https://nuxt.com/modules
  modules: ["@nuxthub/core", "@nuxt/eslint", "nuxt-auth-utils"],
  hub: {
    database: true,
    kv: true,
  },
  runtimeConfig: {
    public: {},
    auth: {
      cookieSecure: process.env.NODE_ENV === "production",
      cookieSameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    },
  },
  nitro: {
    experimental: {
      // Enable Server API documentation within NuxtHub
      openAPI: true,
    },
  },
  // Development
  devtools: { enabled: true },
});
