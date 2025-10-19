// // plugins/auth.ts (Corrected and Final Version)

// import { useAuthStore } from '~/store/auth';

// export default defineNuxtPlugin(async (nuxtApp) => {
//   const authStore = useAuthStore();
//   if (authStore.user) {
//     return;
//   }
  
//   const token = useCookie('auth-token');

//   if (token.value) {
//     await authStore.fetchUser();
//   }
// });


