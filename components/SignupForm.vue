<!-- components/SignupForm.vue -->
<template>
  <Form @submit="onSubmit" :validation-schema="schema">
    <!-- The old error div has been removed from here -->

    <Field name="username" v-slot="{ field, errorMessage }">
      <div class="mb-4">
        <label class="block mb-1 font-medium text-slate-700">Username</label>
        <UiAppInput
          v-bind="field"
          type="text"
          placeholder="Your username"
          :error="errorMessage"
        />
      </div>
    </Field>
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
      <div class="mb-4">
        <label class="block mb-1 font-medium text-slate-700">Password</label>
        <UiAppInput
          v-bind="field"
          type="password"
          placeholder="••••••••"
          :error="errorMessage"
        />
      </div>
    </Field>
    <Field name="confirmPassword" v-slot="{ field, errorMessage }">
      <div class="mb-6">
        <label class="block mb-1 font-medium text-slate-700"
          >Confirm Password</label
        >
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
      {{ isLoading ? "Signing up..." : "Create Account" }}
    </UiAppButton>
  </Form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Form, Field } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useToast } from "vue-toastification"; // 1. Import useToast
import { useAuthStore } from "~/store/auth";

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast(); // 2. Initialize the toast plugin
const isLoading = ref(false);

// 3. The authError ref is no longer needed
// const authError = ref<string | null>(null);

const schema = toTypedSchema(
  z
    .object({
      username: z
        .string()
        .nonempty("Username is required")
        .min(3, "At least 3 characters"),
      email: z
        .string()
        .nonempty("Email is required")
        .email("Must be a valid email"),
      password: z
        .string()
        .nonempty("Password is required")
        .min(6, "At least 6 characters"),
      confirmPassword: z.string().nonempty("Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
);

async function onSubmit(values: any) {
  isLoading.value = true;
  try {
    await authStore.signup(values);

    // 4. Show success toast
    toast.success("Account created successfully! Welcome.");

    router.push("/");
  } catch (err: any) {
    // 5. Show error toast
    toast.error(err.message || "An unexpected error occurred.");
  } finally {
    isLoading.value = false;
  }
}
</script>

<!-- <template>
  <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">
    <div
      v-if="authError"
      class="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm"
      role="alert"
    >
      <strong class="font-bold">Oops!</strong>
      <span class="ml-2">{{ authError }}</span>
    </div>

    <Field name="username" v-slot="{ field, errorMessage }">
      <div class="mb-4">
        <label class="block mb-1 font-medium text-slate-700">Username</label>
        <UiAppInput
          v-bind="field"
          type="text"
          placeholder="Your username"
          :error="errorMessage"
        />
      </div>
    </Field>
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
      <div class="mb-4">
        <label class="block mb-1 font-medium text-slate-700">Password</label>
        <UiAppInput
          v-bind="field"
          type="password"
          placeholder="••••••••"
          :error="errorMessage"
        />
      </div>
    </Field>
    <Field name="confirmPassword" v-slot="{ field, errorMessage }">
      <div class="mb-6">
        <label class="block mb-1 font-medium text-slate-700"
          >Confirm Password</label
        >
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
      {{ isLoading ? "Signing up..." : "Create Account" }}
    </UiAppButton>
  </Form>
</template>

<script setup lang="ts">
import { Form, Field } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useAuthStore } from "~/store/auth";

const authStore = useAuthStore();
const router = useRouter();

const authError = ref<string | null>(null);
const isLoading = ref(false);

const schema = toTypedSchema(
  z
    .object({
      username: z
        .string()
        .nonempty("Username is required")
        .min(3, "At least 3 characters"),
      email: z
        .string()
        .nonempty("Email is required")
        .email("Must be a valid email"),
      password: z
        .string()
        .nonempty("Password is required")
        .min(6, "At least 6 characters"),
      confirmPassword: z.string().nonempty("Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
);

async function onSubmit(values: any) {
  authError.value = null;
  isLoading.value = true;
  try {
    await authStore.signup(values);
    router.push("/");
  } catch (err: any) {
    authError.value = err.message || "An unexpected error occurred.";
  } finally {
    isLoading.value = false;
  }
}
</script> -->
