<!-- components/RatingSection.vue -->
<template>
  <div class="my-8 rounded-lg border border-slate-100 bg-white p-6">
    <h3 class="mb-4 text-center text-2xl font-bold text-slate-800">
      Rate This Recipe
    </h3>

    <div
      v-if="auth.isAuthenticated"
      class="mb-4 flex items-center justify-center space-x-1"
    >
      <button
        v-for="star in 5"
        :key="star"
        @click="handleSetRating(star)"
        @mouseover="hoverRating = star"
        @mouseleave="hoverRating = 0"
        :disabled="rateLoading"
        class="rounded-full text-5xl transition-colors cursor-pointer duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
        :class="{
          'text-yellow-500': (hoverRating || currentRating) >= star,
          'text-slate-300': (hoverRating || currentRating) < star,
          'hover:text-yellow-400': !rateLoading,
          'cursor-not-allowed': rateLoading,
        }"
        :aria-label="`Rate ${star} star${star > 1 ? 's' : ''}`"
        :title="`Rate ${star} star${star > 1 ? 's' : ''}`"
      >
        <Icon name="ph:star-fill" />
      </button>
    </div>

    <p
      v-else
      class="mt-2 rounded-md bg-slate-100 p-3 text-center text-md text-slate-600"
    >
      <NuxtLink
        :to="`/login?redirect=${route.fullPath}`"
        class="font-semibold text-orange-600 hover:underline"
        >Log in</NuxtLink
      >
      to rate this recipe and share your experience.
    </p>

    <div class="mt-2 text-center text-sm h-5">
      <!-- This container keeps the layout stable -->
      <p
        v-if="rateLoading"
        class="flex items-center justify-center text-orange-500"
      >
        <UiSpinner size="sm" class="mr-2" /> Submitting your rating...
      </p>
      <!-- REMOVED: All other status messages are now handled by toasts -->
      <p
        v-else-if="auth.isAuthenticated && !currentRating"
        class="text-slate-500"
      >
        Click a star to share your rating.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/store/auth";
import { useMutation } from "@vue/apollo-composable";
// import { useToast } from "vue-toastification"; // ADDED
import { useAuthAction } from "~/composables/useAuthAction"; // ADDED
import { RATE_RECIPE } from "~/lib/graphql";
import Toast from "vue-toastification";
const { useToast } = Toast;
const props = defineProps<{
  recipeId: string;
  initialUserRating: number;
}>();
const emit = defineEmits(["rated"]);

const auth = useAuthStore();
const route = useRoute();
const toast = useToast(); // ADDED
const { executeAuthAction } = useAuthAction(); // ADDED
const currentRating = ref(props.initialUserRating);
const hoverRating = ref(0);

watch(
  () => props.initialUserRating,
  (newVal) => {
    currentRating.value = newVal;
  }
);

const {
  mutate: rateRecipe,
  loading: rateLoading,
  onError, // REFACTORED: Use onError hook
  onDone,
} = useMutation(RATE_RECIPE);

const handleSetRating = (rating: number) => {
  executeAuthAction(async () => {
    if (rateLoading.value) return;
    const oldRating = currentRating.value;
    currentRating.value = rating; // Optimistic update

    try {
      await rateRecipe({
        recipe_id: props.recipeId,
        rating: rating,
      });
    } catch (e) {
      console.error("Failed to set rating:", e);
      currentRating.value = oldRating; // Revert on failure
      // Error is handled by the executeAuthAction catch block
      throw e; // Re-throw to be caught by the wrapper
    }
  });
};

// Success handler
onDone(({ data }) => {
  const newRating = data?.insert_recipe_ratings_one?.rating;
  hoverRating.value = 0;
  toast.success(`You rated this recipe ${newRating} out of 5 stars!`); // ADDED: Success feedback
  emit("rated"); // Trigger refetch on parent page
});

// Error handler (in case something isn't caught by the wrapper)
onError((error) => {
  console.error("Rating failed:", error);
  toast.error(error.message || "Failed to submit your rating."); // ADDED: Error feedback
});
</script>

<!-- <template>
  <div class="my-8 rounded-lg border border-slate-100 bg-white p-6">
    <h3 class="mb-4 text-center text-2xl font-bold text-slate-800">
      Rate This Recipe
    </h3>

    <div
      v-if="auth.isAuthenticated"
      class="mb-4 flex items-center justify-center space-x-1"
    >
      <button
        v-for="star in 5"
        :key="star"
        @click="handleSetRating(star)"
        @mouseover="hoverRating = star"
        @mouseleave="hoverRating = 0"
        :disabled="rateLoading"
        class="rounded-full text-5xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
        :class="{
          'text-yellow-500': (hoverRating || currentRating) >= star,
          'text-slate-300': (hoverRating || currentRating) < star,
          'hover:text-yellow-400': !rateLoading,
          'cursor-not-allowed': rateLoading,
        }"
        :aria-label="`Rate ${star} star${star > 1 ? 's' : ''}`"
        :title="`Rate ${star} star${star > 1 ? 's' : ''}`"
      >
        <Icon name="ph:star-fill" />
      </button>
    </div>

    <p
      v-else
      class="mt-2 rounded-md bg-slate-100 p-3 text-center text-md text-slate-600"
    >
      <NuxtLink
        :to="`/login?redirect=${route.fullPath}`"
        class="font-semibold text-orange-600 hover:underline"
      >
        Log in
      </NuxtLink>
      to rate this recipe and share your experience.
    </p>

    <div v-if="auth.isAuthenticated" class="mt-2 text-center text-sm">
      <p
        v-if="rateLoading"
        class="flex items-center justify-center text-orange-500"
      >
        <UiSpinner size="sm" class="mr-2" /> Submitting your rating...
      </p>
      <p v-else-if="rateError" class="font-medium text-red-500">
        Error: {{ rateError.message }}. Please try again.
      </p>
      <p v-else-if="currentRating > 0" class="font-medium text-green-600">
        You rated this recipe {{ currentRating }} out of 5 stars!
      </p>
      <p v-else class="text-slate-500">Click a star to share your rating.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/store/auth";
import { useMutation } from "@vue/apollo-composable";
import { RATE_RECIPE } from "~/lib/graphql";

const props = defineProps<{
  recipeId: string;
  initialUserRating: number;
}>();
const emit = defineEmits(["rated"]);

const auth = useAuthStore();
const route = useRoute();
const { executeAuthAction } = useAuthAction();
const currentRating = ref(props.initialUserRating);
const hoverRating = ref(0);

watch(
  () => props.initialUserRating,
  (newVal) => {
    currentRating.value = newVal;
  }
);

const {
  mutate: rateRecipe,
  loading: rateLoading,
  error: rateError,
  onDone,
} = useMutation(RATE_RECIPE);

const handleSetRating = (rating: number) => {
  executeAuthAction(async () => {
    if (rateLoading.value) return;
    const oldRating = currentRating.value;
    currentRating.value = rating;

    try {
      await rateRecipe({
        recipe_id: props.recipeId,
        rating: rating,
      });
    } catch (e) {
      console.error("Failed to set rating:", e);
      currentRating.value = oldRating;
    }
  });
};

onDone(() => {
  hoverRating.value = 0;
  emit("rated");
});
</script> -->
