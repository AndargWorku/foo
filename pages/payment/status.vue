<template>
  <div
    class="flex flex-col items-center justify-center text-center py-20 min-h-screen bg-slate-50"
  >
    <div v-if="status === 'success'">
      <Icon
        name="ph:check-circle-bold"
        class="w-16 h-16 text-green-500 mx-auto"
      />
      <h1 class="text-3xl font-bold mt-4">Payment Successful!</h1>
      <p class="text-slate-600 mt-2">
        Thank you for your purchase. Redirecting you back to the recipe...
      </p>
    </div>
    <div v-else>
      <Icon name="ph:x-circle-bold" class="w-16 h-16 text-red-500 mx-auto" />
      <h1 class="text-3xl font-bold mt-4">Payment Canceled</h1>
      <p class="text-slate-600 mt-2">
        Your payment was not completed. Redirecting you back...
      </p>
      <p v-if="errorMessage" class="text-red-500 mt-2 text-sm">
        Details: {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const status = ref<"success" | "failed">("failed");
const recipeId = ref((route.query.recipe_id as string) || "");
const errorMessage = ref((route.query.message as string) || ""); // Capture error message from URL

onMounted(() => {
  if (route.query.status === "success") {
    status.value = "success";
  } else {
    // Default to failed if status is not 'success'
    status.value = "failed";
  }

  // Redirect back to the recipe page after a short delay
  setTimeout(() => {
    if (recipeId.value) {
      router.push(`/recipe/${recipeId.value}`);
    } else {
      // If recipe_id is not available, redirect to a general recipes list or home
      router.push("/recipes");
    }
  }, 3000);
});
</script>
