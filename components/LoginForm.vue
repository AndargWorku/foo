<template>
  <Form @submit="onSubmit" :validation-schema="schema">
    <Field name="email" v-slot="{ field, errorMessage }">
      <div class="mb-4">
        <label class="block mb-1 font-medium text-slate-700">Email</label>
        <UiAppInput
          v-bind="field"
          type="email"
          placeholder="you@example.com"
          :error="errorMessage"
        />
      </div>
    </Field>
    <Field name="password" v-slot="{ field, errorMessage }">
      <div class="mb-6">
        <label class="block mb-1 font-medium text-slate-700">Password</label>
        <UiAppInput
          v-bind="field"
          type="password"
          placeholder="••••••••"
          :error="errorMessage"
        />
      </div>
    </Field>

    <UiAppButton
      type="submit"
      :disabled="isLoading"
      class="w-full justify-center !py-3 !text-base"
    >
      <UiSpinner v-if="isLoading" size="sm" class="mr-2" />
      {{ isLoading ? "Signing in..." : "Sign In" }}
    </UiAppButton>
  </Form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Form, Field } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useToast } from "vue-toastification";
import { useAuthStore } from "~/store/auth";
// Import navigateTo and useRoute from #app for Nuxt 3
import { navigateTo, useRoute } from "#app";

const authStore = useAuthStore();
// const router = useRouter(); // No longer needed here
const route = useRoute();
const toast = useToast();
const isLoading = ref(false);

const schema = toTypedSchema(
  z.object({
    email: z
      .string()
      .nonempty("Email is required")
      .email("Must be a valid email"),
    password: z.string().nonempty("Password is required"),
  })
);

async function onSubmit(values: any) {
  isLoading.value = true;
  try {
    await authStore.login(values);

    toast.success("Login successful! Welcome back.");

    // Retrieve the redirect path from the query parameter
    const redirectPath = route.query.redirect?.toString();

    // Perform the redirect. navigateTo handles server-side and client-side correctly.
    // If no redirect is specified, go to the homepage.
    await navigateTo(redirectPath || "/", { replace: true });
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred.");
  } finally {
    isLoading.value = false;
  }
}
</script>
