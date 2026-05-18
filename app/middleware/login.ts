export default defineNuxtRouteMiddleware((to, _from) => {
  const user = useUser();
  if (!user.value) return navigateTo(`/login?redirect=${to.path}`);
});