// middleware/guest.ts
import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
    return navigateTo('/', { replace: true })
  }
})