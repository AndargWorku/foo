<!-- pages/payment/status.vue -->
<!-- <template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center"
  >
    <div class="max-w-md">
      <Icon
        name="ph:check-circle-bold"
        class="mx-auto h-16 w-16 text-green-500"
      />
      <h1 class="mt-4 text-3xl font-bold text-slate-800">
        Payment Successful!
      </h1>
      <p class="mt-2 text-slate-600">
        Your purchase has been confirmed. We are now unlocking the recipe and
        redirecting you...
      </p>
    </div>

    <div class="mt-8">
      <UiSpinner />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

definePageMeta({ layout: "blank" });

const route = useRoute();
const router = useRouter();
const toast = useToast();

const recipeId = ref((route.query.recipe_id as string) || "");

onMounted(() => {
  toast.success("Your payment was successful!"); 

  setTimeout(() => {
    if (recipeId.value) {
      const redirectPath = `/recipe/${recipeId.value}?purchase_success=true`;
      router.push(redirectPath);
    } else {
      toast.warning(
        "Could not find the recipe you were on. Taking you to the home page."
      );
      router.push("/");
    }
  }, 400);
});
</script> -->

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
        Thank you. Taking you back to your unlocked recipe...
      </p>
    </div>

    <div v-else>
      <Icon name="ph:x-circle-bold" class="w-16 h-16 text-red-500 mx-auto" />
      <h1 class="text-3xl font-bold mt-4">Payment continue</h1>
      <p class="text-slate-600 mt-2">
        Your payment was not completed. Redirecting you back to the recipe...
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const status = ref<"success" | "failed">("failed");

const recipeId = ref((route.query.recipe_id as string) || "");

onMounted(() => {
  if (route.query.status === "success") {
    status.value = "success";
  }

  setTimeout(() => {
    if (recipeId.value) {
      let redirectPath = `/recipe/${recipeId.value}`;
      if (status.value === "success") {
        redirectPath += "?purchase_success=true";
      }
      router.push(redirectPath);
    } else {
      toast.error(
        "Could not find the recipe you were on. Taking you to the recipes list."
      );
      router.push("/recipes");
    }
  }, 4000);
});
</script>
-->
