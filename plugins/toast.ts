// plugins/toast.ts

import { defineNuxtPlugin } from '#app'

// Fix for CommonJS module import:
// Import the entire module as 'pkg' first, then destructure.
import pkg from 'vue-toastification'
const { default: Toast, POSITION } = pkg

// Import the PluginOptions type separately for type safety
import type { PluginOptions } from 'vue-toastification'

import 'vue-toastification/dist/index.css' // Ensure you have the CSS for styling

export default defineNuxtPlugin((nuxtApp) => {
  // Define custom options for the toast notifications
  const options: PluginOptions = {
    position: POSITION.TOP_RIGHT, // Using the correctly imported POSITION
    timeout: 4000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button', // Can be 'button', true, false, or a component
    icon: true, // Can be true, false, a string, or a component
    rtl: false,
    transition: 'Vue-Toastification__bounce', // Default transition
    maxToasts: 5, // Maximum number of toasts displayed at once
    newestOnTop: true, // Show newest toasts at the top
  }

  // Register the vue-toastification plugin with the Vue app instance
  // This makes `useToast()` available globally and provides the configured options.
  nuxtApp.vueApp.use(Toast, options)
})

// // plugins/toast.ts
// import { defineNuxtPlugin } from '#app'
// import Toast, { type PluginOptions, POSITION } from 'vue-toastification'
// import 'vue-toastification/dist/index.css'

// export default defineNuxtPlugin((nuxtApp) => {
//   // Define custom options for the toast notifications
//   const options: PluginOptions = {
//     position: POSITION.TOP_RIGHT,
//     timeout: 4000,
//     closeOnClick: true,
//     pauseOnFocusLoss: true,
//     pauseOnHover: true,
//     draggable: true,
//     draggablePercent: 0.6,
//     showCloseButtonOnHover: false,
//     hideProgressBar: false,
//     closeButton: 'button',
//     icon: true,
//     rtl: false,
//     transition: 'Vue-Toastification__bounce',
//     maxToasts: 5,
//     newestOnTop: true,
//   }

//   // Register the plugin with the Vue app
//   nuxtApp.vueApp.use(Toast, options)
// })