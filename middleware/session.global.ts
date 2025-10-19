
// middleware/session.global.ts


export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore();

  if (auth.user) {
    return;
  }

  const token = useCookie('auth-token');

  if (token.value) {
    await auth.fetchUser();
  }
});