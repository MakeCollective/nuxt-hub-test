export default defineNuxtRouteMiddleware(async () => {
  const user = await useCurrentUser();
  if (!user.value) {
    return navigateTo("/login");
  }
});
