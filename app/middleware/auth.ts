export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;
  const user = useCurrentUser();
  if (!user.value && to.path !== "/login") {
    return navigateTo("/login");
  }
});
