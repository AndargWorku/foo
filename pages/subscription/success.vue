<!-- pages/subscription/success.vue -->
<template>
  <div
    class="flex flex-col items-center justify-center min-h-[70vh] text-center"
  >
    <Icon name="ph:check-circle-fill" class="text-green-500 text-6xl" />
    <h1 class="text-4xl font-bold mt-4">Payment Successful!</h1>
    <p class="text-slate-600 mt-2">
      Thank you for subscribing! Your account is now premium.
    </p>
    <p class="text-slate-500 text-sm mt-1">
      It may take a moment for the changes to apply.
    </p>
    <div class="mt-8">
      <NuxtLink to="/">
        <UiAppButton variant="primary" size="lg"
          >Explore Premium Recipes</UiAppButton
        >
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "~/store/auth";

const auth = useAuthStore();

// When the user lands on this page, immediately refetch their user data
// to update their `subscription_status` in the Pinia store.
onMounted(async () => {
  await auth.fetchUser();
});
</script>
