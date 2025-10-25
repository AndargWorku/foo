
// composables/useAuthAction.ts
import { useAuthStore } from '~/store/auth'
// import { useToast } from 'vue-toastification'

import { useRoute, navigateTo } from '#app'
import pkg from "vue-toastification";
const { useToast } = pkg;

export function useAuthAction() {
  const auth = useAuthStore()
  
  const route = useRoute()
  const toast = useToast()

  const execute = (action: () => Promise<any>) => {
    if (!auth.isAuthenticated) {
      toast.info('Please log in to perform this action.')

      
      navigateTo({ path: '/login', query: { redirect: route.fullPath } })
      return 
    }

    try {
      action().catch((err: any) => {
        console.error('Authenticated action failed:', err)
        toast.error(err.message || 'An unexpected error occurred.')
      })
    } catch (err: any) {
      console.error('Authenticated action failed synchronously:', err)
      toast.error(err.message || 'An unexpected error occurred.')
    }
  }

  return { executeAuthAction: execute }
}






