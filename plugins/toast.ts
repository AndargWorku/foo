// plugins/toast.ts
import { defineNuxtPlugin } from '#app'
import Toast, { type PluginOptions, POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  // Define custom options for the toast notifications
  const options: PluginOptions = {
    position: POSITION.TOP_RIGHT,
    timeout: 4000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false,
    transition: 'Vue-Toastification__bounce',
    maxToasts: 5,
    newestOnTop: true,
  }

  // Register the plugin with the Vue app
  nuxtApp.vueApp.use(Toast, options)
})