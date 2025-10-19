// nuxt.config.ts
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  modules: [
    "@vee-validate/nuxt",
    "@pinia/nuxt",
    "@nuxt/icon",
    "@nuxtjs/apollo",
  ],

  pinia: {
    storesDirs: ["./store/**"],
    autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
  },

  veeValidate: {
    autoImports: true,
  },

  apollo: {
    clients: {
      default: {
        httpEndpoint:
          process.env.NUXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ||
          "https://backend-2-52d4.onrender.com/v1/graphql",
        wsEndpoint:
          process.env.NUXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT ||
          "https://backend-2-52d4.onrender.com/v1/graphql",
      
        tokenName: "apollo:auth-token", 
        tokenStorage: "cookie",

        getAuth: () => {
          
          const token = useCookie<string | null>("apollo:auth-token").value;
          return token ? `Bearer ${token}` : "";
        },
      },
    },
  },

  runtimeConfig: {
    hasuraAdminSecret: process.env.HASURA_ADMIN_SECRET,
    public: {
      hasuraGraphqlEndpoint: process.env.NUXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT,
      stripePublishableKey: process.env.NUXT_PUBLIC_Chapa_PUBLISHABLE_KEY,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      title: "Food Recipe Zone",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Browse food recipe zone and purchase tickets online.",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      // If Stripe.js is only needed on payment pages, consider dynamic import
      script: [{ src: "https://js.stripe.com/v3/", defer: true }], 
    },
  },
});

