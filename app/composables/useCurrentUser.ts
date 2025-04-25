export const useCurrentUser = () => {
  return useAsyncData(
    "current-user",
    async () => {
      try {
        return await $fetch("/api/auth/me", { credentials: "include" });
      } catch {
        return null;
      }
    },
    { server: false },
  ); // ensure only runs client-side
};
