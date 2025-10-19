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
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const status = ref<"success" | "failed">("failed");
const recipeId = ref((route.query.recipe_id as string) || ""); // Assuming your webhook could pass this

onMounted(() => {
  if (route.query.status === "success") {
    status.value = "success";
  }

  // Redirect back to the recipe page after a short delay
  setTimeout(() => {
    if (recipeId.value) {
      router.push(`/recipe/${recipeId.value}`);
    } else {
      router.push("/recipes");
    }
  }, 3000);
});
</script>
