<template>
  <div class="bg-slate-50 min-h-screen">
    <main class="container mx-auto max-w-lg px-4 py-12">
      <!-- Page Header -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-extrabold text-slate-800">
          Edit Your Profile
        </h1>
        <p class="mt-2 text-lg text-slate-500">Change your public username.</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center mt-16">
        <UiSpinner size="lg" />
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="text-center text-red-500 mt-16 p-6 bg-red-50 rounded-lg"
      >
        <p>Could not load your profile data. Please try again.</p>
      </div>

      <!-- Main Form -->
      <div
        v-else-if="userData"
        class="bg-white p-8 rounded-lg shadow-md border"
      >
        <VeeForm
          @submit="handleSubmit"
          :validation-schema="schema"
          :initial-values="userData"
          class="space-y-6"
        >
          <!-- Avatar Section -->
          <div class="flex items-center space-x-6">
            <div
              class="w-24 h-24 rounded-full bg-green-200 flex items-center justify-center text-4xl font-bold text-green-700"
            >
              {{ (userData.username || "A").charAt(0).toUpperCase() }}
            </div>
            <div>
              <h2 class="text-2xl font-bold text-slate-800">
                {{ userData.username }}
              </h2>
              <p class="text-slate-500">Your public profile handle.</p>
            </div>
          </div>

          <!-- Username Field (The only editable field) -->
          <Field name="username" v-slot="{ field, errorMessage }">
            <UiAppInput v-bind="field" label="Username" :error="errorMessage" />
          </Field>

          <!-- Disabled Email Field -->
          <div>
            <label class="block text-sm font-medium text-slate-700"
              >Email</label
            >
            <input
              type="email"
              :value="userData.email"
              disabled
              class="mt-1 block w-full rounded-md border-slate-300 bg-slate-100 shadow-sm sm:text-sm text-slate-500 cursor-not-allowed"
            />
            <p class="text-xs text-slate-500 mt-1">Email cannot be changed.</p>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end pt-4">
            <UiAppButton type="submit" :disabled="isSubmitting">
              <UiSpinner v-if="isSubmitting" class="mr-2" />
              Save Changes
            </UiAppButton>
          </div>
        </VeeForm>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "~/store/auth";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useToast } from "vue-toastification"; // 1. Import useToast
import { GET_MY_PROFILE_FOR_EDIT, UPDATE_USER_PROFILE } from "~/lib/graphql";
import { Form as VeeForm, Field } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

definePageMeta({ middleware: "auth" });
useSeoMeta({ title: "Edit Your Profile | BiteSized Recipes" });

const auth = useAuthStore();
const router = useRouter();
const toast = useToast(); // 2. Initialize the toast plugin

const { result, loading, error } = useQuery(GET_MY_PROFILE_FOR_EDIT, null, {
  enabled: auth.isAuthenticated,
  fetchPolicy: "network-only",
});

const userData = computed(() => {
  return result.value?.users[0] || { username: "", email: "" };
});

const isSubmitting = ref(false);

const schema = toTypedSchema(
  z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
  })
);

const { mutate: updateUserProfile } = useMutation(UPDATE_USER_PROFILE);

async function handleSubmit(values: any) {
  if (!auth.user?.id) {
    toast.error("Could not verify user. Please log in again.");
    return;
  }
  isSubmitting.value = true;

  try {
    const { data } = await updateUserProfile({
      id: auth.user.id,
      _set: { username: values.username },
    });

    if (data?.update_users_by_pk) {
      await auth.fetchUser(); // Refresh user state globally

      // 3. Replace alert with success toast
      toast.success("Profile updated successfully!");

      router.push(`/users/${data.update_users_by_pk.username}`);
    } else {
      throw new Error("Failed to update profile. Please try again.");
    }
  } catch (err: any) {
    console.error("Profile update failed:", err);

    // 4. Replace alerts with specific error toasts
    if (err.message.includes("Uniqueness violation")) {
      toast.error("That username is already taken. Please choose another one.");
    } else {
      toast.error(err.message || "An unexpected error occurred.");
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>
