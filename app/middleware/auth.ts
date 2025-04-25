export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;
  const { data: user } = await useCurrentUser();
  console.log("auth middleware", user.value);
  if (!user.value && to.path !== "/login") {
    return navigateTo("/login");
  }
});
