<template>
  <div class="min-h-screen bg-white font-sans">
    <main class="container mx-auto p-4 md:p-8">
      <div
        v-if="loading"
        class="flex min-h-[60vh] flex-col items-center justify-center"
      >
        <UiSpinner size="lg" class="text-orange-500" />
        <p class="mt-4 text-slate-500">Loading Recipe...</p>
      </div>

      <div v-else-if="error" class="rounded-lg bg-red-50 p-8 text-center">
        <h2 class="text-2xl font-semibold text-red-700">
          Error Loading Recipe
        </h2>
        <p class="mt-2 text-red-600">{{ error.message }}</p>
      </div>

      <div
        v-else-if="!recipeData && !loading"
        class="rounded-lg bg-yellow-50 p-8 text-center"
      >
        <h2 class="text-2xl font-semibold text-yellow-700">Recipe Not Found</h2>
        <p class="mt-2 text-yellow-600">
          This recipe does not exist or may have been removed.
        </p>
      </div>

      <article v-else-if="recipeData">
        <section class="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <img
              :src="activeImage"
              :alt="recipeData.title"
              class="mb-4 h-96 w-full rounded-lg object-cover shadow-md"
            />
            <div class="grid grid-cols-5 gap-2">
              <img
                v-for="image in recipeData.recipe_images"
                :key="image.id"
                :src="image.image_url"
                @click="activeImage = image.image_url"
                class="h-20 w-full cursor-pointer rounded-lg border-2 object-cover transition"
                :class="
                  activeImage === image.image_url
                    ? 'border-orange-500'
                    : 'border-transparent hover:border-orange-300'
                "
              />
            </div>
          </div>

          <div class="flex flex-col">
            <span class="text-sm font-semibold uppercase text-orange-500">{{
              recipeData.recipe_categories[0]?.category.name || "Uncategorized"
            }}</span>
            <h1 class="mt-1 text-4xl font-extrabold text-slate-800">
              {{ recipeData.title }}
            </h1>
            <NuxtLink
              :to="`/users/${recipeData.user?.username}`"
              class="mt-2 text-sm text-slate-500 hover:underline"
            >
              by {{ recipeData.user?.username }}
            </NuxtLink>
            <p class="mt-4 leading-relaxed text-slate-600">
              {{ recipeData.description }}
            </p>

            <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div class="flex items-center font-medium text-slate-700">
                <Icon name="ph:heart-fill" class="mr-1.5 text-red-500" />
                <span>{{ totalLikes }} Likes</span>
              </div>
              <div class="flex items-center font-medium text-slate-700">
                <div class="flex items-center text-yellow-500">
                  <Icon
                    v-for="i in 5"
                    :key="i"
                    name="ph:star-fill"
                    :class="i <= averageRating ? '' : 'opacity-30'"
                  />
                </div>
                <span class="ml-2">
                  {{ averageRating ? averageRating.toFixed(2) : "N/A" }} ({{
                    totalRatings
                  }}
                  ratings)
                </span>
              </div>
            </div>

            <div class="mt-6 flex items-center space-x-2">
              <button
                @click="handleToggleLike"
                :disabled="likeLoading"
                class="p-3 rounded-lg text-slate-600 cursor-pointer transition-all duration-200"
                :class="
                  isLiked
                    ? 'bg-red-200 text-red-600 ring-2 ring-red-200'
                    : 'bg-slate-100 hover:bg-red-100 hover:text-red-600'
                "
                title="Like"
              >
                <Icon name="ph:heart-fill" class="h-5 w-5" />
              </button>
              <button
                @click="handleToggleBookmark"
                :disabled="bookmarkLoading"
                class="p-3 rounded-lg text-slate-600 transition-all cursor-pointer duration-200"
                :class="
                  isBookmarked
                    ? 'bg-blue-200 text-blue-600 ring-2 ring-blue-200'
                    : 'bg-slate-100 hover:bg-blue-100 hover:text-blue-600'
                "
                title="Bookmark"
              >
                <Icon name="ph:bookmark-simple-fill" class="h-5 w-5" />
              </button>
              <a
                href="#comments"
                class="p-3 rounded-lg bg-slate-100 text-slate-600 transition-colors"
                title="Go to Comments"
              >
                <Icon name="ph:chat-circle-dots" class="h-5 w-5" />
              </a>
            </div>

            <div v-if="recipeData.is_premium" class="mt-auto pt-6">
              <UiAppButton
                v-if="!hasAccess"
                @click="handleBuyRecipe"
                :disabled="paymentLoading"
                class="w-full justify-center !py-3 bg-orange-500 hover:bg-orange-600"
              >
                <UiSpinner v-if="paymentLoading" class="mr-2" />
                Purchase for ${{ recipeData.price.toFixed(2) }} to Unlock
                Instructions
              </UiAppButton>
              <div
                v-if="hasAccess"
                class="text-center text-green-700 font-semibold p-3 bg-green-50 rounded-md border border-green-200"
              >
                <Icon
                  name="ph:check-circle-bold"
                  class="inline-block mr-2 text-xl"
                />
                You have access to the instructions.
              </div>
            </div>
          </div>
        </section>

        <section class="border-t pt-8">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div class="lg:col-span-1">
              <IngredientList :ingredients="recipeData.recipe_ingredients" />
            </div>

            <div class="lg:col-span-2">
              <h2 class="text-2xl font-bold text-slate-800 mb-4">
                Instructions
              </h2>

              <div
                v-if="recipeData.is_premium && !hasAccess"
                class="p-8 bg-slate-100 rounded-lg text-center space-y-3 border border-slate-200"
              >
                <Icon
                  name="ph:lock-key-bold"
                  class="w-12 h-12 text-slate-400 mx-auto"
                />
                <p class="font-semibold text-slate-700 text-lg">
                  Instructions are Locked
                </p>
                <p class="text-sm text-slate-500 max-w-sm mx-auto">
                  This is a premium recipe. Purchase it to unlock the
                  step-by-step cooking guide and support the creator.
                </p>
              </div>

              <InstructionSteps
                v-else
                :instructions="recipeData.instructions"
              />
            </div>
          </div>
        </section>

        <section id="comments" class="mt-12 border-t pt-8">
          <!-- Pass total ratings and average rating to RatingSection for local updates -->
          <RatingSection
            :recipe-id="recipeData.id"
            :initial-user-rating="currentUserRating"
            :initial-average-rating="averageRating"
            :initial-total-ratings="totalRatings"
            @rated="handleRatingUpdate"
          />
          <RecipeCommentSection
            :recipe-id="recipeData.id"
            :total-comments="totalComments"
            @comment-added="handleCommentAdded"
          />
        </section>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useToast } from "vue-toastification";
import { useAuthStore } from "~/store/auth";
import { useAuthAction } from "~/composables/useAuthAction";
import {
  GET_RECIPE_DETAILS,
  LIKE_RECIPE,
  UNLIKE_RECIPE,
  BOOKMARK_RECIPE,
  UNBOOKMARK_RECIPE,
  RATE_RECIPE,
  ADD_COMMENT, // Assuming ADD_COMMENT is used within RecipeCommentSection or passed via prop
  INITIATE_PAYMENT,
} from "~/lib/graphql";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const toast = useToast();
const { executeAuthAction } = useAuthAction();

const recipeId = computed(() => route.params.id as string);
const currentUserId = computed(() => auth.user?.id);
const activeImage = ref("");

// Use a reactive variable for recipe data that can be updated locally
const recipeData = ref<any | null>(null);

const { result, loading, error, refetch } = useQuery(
  GET_RECIPE_DETAILS,
  () => ({
    id: recipeId.value,
    user_id: currentUserId.value || "00000000-0000-0000-0000-000000000000",
  }),
  {
    enabled: !!recipeId.value,
    fetchPolicy: "cache-and-network",
  }
);

// Watch the result from the query and populate recipeData
watch(
  result,
  (newResult) => {
    if (newResult?.recipes_by_pk) {
      recipeData.value = newResult.recipes_by_pk;
    }
  },
  { immediate: true }
);

const { mutate: likeRecipe, loading: likeLoading } = useMutation(LIKE_RECIPE);
const { mutate: unlikeRecipe } = useMutation(UNLIKE_RECIPE);
const { mutate: bookmarkRecipe, loading: bookmarkLoading } =
  useMutation(BOOKMARK_RECIPE);
const { mutate: unbookmarkRecipe } = useMutation(UNBOOKMARK_RECIPE);
const { mutate: rateRecipe } = useMutation(RATE_RECIPE);
// const { mutate: initiatePayment, loading: paymentLoading } = useMutation(INITIATE_PAYMENT);
const {
  mutate: initiatePayment,
  loading: paymentLoading,
  error: paymentError,
} = useMutation(INITIATE_PAYMENT);
// Computed properties now derive from recipeData.value
const isLiked = computed(
  () => (recipeData.value?.recipe_likes_aggregate?.aggregate?.count ?? 0) > 0
);
const isBookmarked = computed(
  () => (recipeData.value?.user_bookmarks_aggregate?.aggregate?.count ?? 0) > 0
);
const totalLikes = computed(() => recipeData.value?.total_likes ?? 0);
const averageRating = computed(() => recipeData.value?.average_rating ?? 0);
const totalRatings = computed(
  () => recipeData.value?.recipe_ratings_aggregate?.aggregate?.count ?? 0
);
const currentUserRating = computed(
  () => recipeData.value?.recipe_ratings?.[0]?.rating ?? 0
);
const totalComments = computed(() => recipeData.value?.total_comments ?? 0);

// --- Payment and Premium Recipe Access Logic ---
const hasAccess = computed(() => {
  if (!recipeData.value) return false;

  if (!recipeData.value.is_premium) return true;

  if (auth.isAuthenticated && auth.user?.id === recipeData.value.user?.id) {
    return true;
  }

  if (
    auth.isAuthenticated &&
    (recipeData.value.user_purchased_recipes_aggregate?.aggregate.count ?? 0) >
      0
  ) {
    return true;
  }

  return false;
});
const handleBuyRecipe = () => {
  executeAuthAction(async () => {
    const rId = recipeId.value; // This should be a valid UUID string
    if (!rId) {
      toast.error("Recipe ID is missing for purchase.");
      return;
    }

    try {
      const res = await initiatePayment({ recipeId: rId });

      // Check for GraphQL errors returned in the response
      if (res?.errors) {
        throw new Error(res.errors[0].message);
      }

      const checkoutUrl = res?.data?.initiatePayment?.checkoutUrl;
      if (checkoutUrl) {
        // Redirect to Chapa's page
        window.location.href = checkoutUrl;
      } else {
        // This handles cases where the mutation succeeds but returns no URL
        throw new Error("Could not get a checkout URL from the server.");
      }
    } catch (err: any) {
      // This will now catch both network errors and GraphQL errors
      toast.error(
        err.message || "Failed to initiate payment. Please try again."
      );
      console.error("Payment initiation error:", err);
    }
  });
};

// const handleBuyRecipe = () => {
//   executeAuthAction(async () => {
//     const rId = recipeId.value;
//     if (!rId) {
//       toast.error("Recipe ID is missing for purchase.");
//       return;
//     }
//     try {
//       const res = await initiatePayment({ recipeId: rId });
//       const checkoutUrl = res?.data.initiatePayment.checkoutUrl;
//       if (checkoutUrl) {
//         window.location.href = checkoutUrl;
//       } else {
//         throw new Error("Could not get a checkout URL from the server.");
//       }
//     } catch (err: any) {
//       toast.error(err.message || "Failed to initiate payment.");
//       console.error("Payment initiation error:", err);
//     }
//   });
// };

onMounted(() => {
  if (route.query.status === "success") {
    toast.success(
      "Purchase successful! You now have access to the instructions."
    );
    refetch(); // Refresh recipe data to show unlocked instructions
    router.replace({ query: {} });
  }
});

// --- End Payment Logic ---

// --- Interaction Logic (Like, Bookmark, Rating, Comment) ---

// Helper to update the Apollo cache for GET_RECIPE_DETAILS query
const updateApolloCache = (updates: Partial<typeof recipeData.value>) => {
  const query = GET_RECIPE_DETAILS;
  const variables = {
    id: recipeId.value,
    user_id: currentUserId.value || "00000000-0000-0000-0000-000000000000",
  };

  const apolloClient = useNuxtApp().$apollo.defaultClient;

  // Read the current data from the cache
  const currentData = apolloClient.readQuery({ query, variables });

  if (currentData && currentData.recipes_by_pk) {
    // Create an updated recipe object by merging current data with updates
    const updatedRecipe = {
      ...currentData.recipes_by_pk,
      ...updates,
    };

    // Write the updated data back to the cache
    apolloClient.writeQuery({
      query,
      variables,
      data: {
        recipes_by_pk: updatedRecipe,
      },
    });
  }
};

const handleToggleLike = () => {
  executeAuthAction(async () => {
    const userId = currentUserId.value;
    if (!userId) {
      toast.error("User ID not found.");
      return;
    }

    const wasLiked = isLiked.value;
    const mutation = wasLiked ? unlikeRecipe : likeRecipe;

    try {
      await mutation({ recipe_id: recipeId.value, user_id: userId });
      toast.success(wasLiked ? "Like removed!" : "Recipe liked!");

      // Optimistically update local state and Apollo cache
      if (recipeData.value) {
        recipeData.value = {
          ...recipeData.value,
          total_likes: wasLiked ? totalLikes.value - 1 : totalLikes.value + 1,
          recipe_likes_aggregate: {
            ...recipeData.value.recipe_likes_aggregate,
            aggregate: { count: wasLiked ? 0 : 1 },
          },
        };
      }
      // Consider a refetch here if other aspects depend on server-side count
      // For now, relying on local update for immediate feedback.
      // If server-side validation/complex counts are involved, refetch might be safer.
      // refetch(); // uncomment if you need strict server sync
    } catch (e: any) {
      toast.error(e.message || "Failed to update like status.");
      console.error("Like mutation error:", e);
      refetch(); // Refetch on error to revert optimistic update if needed
    }
  });
};

const handleToggleBookmark = () => {
  executeAuthAction(async () => {
    const userId = currentUserId.value;
    if (!userId) {
      toast.error("User ID not found.");
      return;
    }

    const wasBookmarked = isBookmarked.value;
    const mutation = wasBookmarked ? unbookmarkRecipe : bookmarkRecipe;

    try {
      await mutation({ recipe_id: recipeId.value, user_id: userId });
      toast.success(wasBookmarked ? "Bookmark removed!" : "Recipe bookmarked!");

      // Optimistically update local state and Apollo cache
      if (recipeData.value) {
        recipeData.value = {
          ...recipeData.value,
          user_bookmarks_aggregate: {
            ...recipeData.value.user_bookmarks_aggregate,
            aggregate: { count: wasBookmarked ? 0 : 1 },
          },
        };
      }
      // refetch(); // uncomment if you need strict server sync
    } catch (e: any) {
      toast.error(e.message || "Failed to update bookmark status.");
      console.error("Bookmark mutation error:", e);
      refetch(); // Refetch on error to revert optimistic update if needed
    }
  });
};

const handleRatingUpdate = async ({ newRating, average, count }) => {
  executeAuthAction(async () => {
    if (!recipeData.value) return;

    try {
      await rateRecipe({ recipe_id: recipeId.value, rating: newRating });
      toast.success("Rating submitted!");

      // Update local state directly for immediate UI feedback
      recipeData.value.average_rating = average;
      recipeData.value.recipe_ratings_aggregate.aggregate.count = count;
      recipeData.value.recipe_ratings = [{ rating: newRating }]; // Assuming only one rating per user

      // Update Apollo cache using the helper function
      updateApolloCache({
        average_rating: average,
        recipe_ratings_aggregate: {
          ...recipeData.value.recipe_ratings_aggregate,
          aggregate: { count: count },
        },
        recipe_ratings: [{ rating: newRating }],
      });

      // No full refetch needed as the cache and local state are updated
    } catch (e: any) {
      toast.error(e.message || "Failed to submit rating.");
      console.error("Rating mutation error:", e);
      refetch(); // Refetch on error to ensure data consistency
    }
  });
};

const handleCommentAdded = async (newTotalComments: number) => {
  if (!recipeData.value) return;

  // Update local state directly for immediate UI feedback
  recipeData.value.total_comments = newTotalComments;

  // Update Apollo cache using the helper function
  updateApolloCache({
    total_comments: newTotalComments,
  });

  // No full refetch needed for comments if the RecipeCommentSection handles displaying new comments
};

// --- Watchers ---
watch(
  recipeData,
  (newRecipe) => {
    if (newRecipe) {
      activeImage.value =
        newRecipe.featured_image_url ||
        newRecipe.recipe_images?.[0]?.image_url ||
        "";
      useSeoMeta({
        title: `${newRecipe.title} | BiteSized Recipes`,
        description: newRecipe.description,
        ogImage: newRecipe.featured_image_url,
      });
    }
  },
  { immediate: true }
);

watch(error, (newError) => {
  if (newError) {
    toast.error("Could not refresh recipe data.");
    console.error("Recipe data fetching error:", newError);
  }
});
</script>

<!-- <template>
  <div class="min-h-screen bg-white font-sans">
    <main class="container mx-auto p-4 md:p-8">
      <div
        v-if="loading"
        class="flex min-h-[60vh] flex-col items-center justify-center"
      >
        <UiSpinner size="lg" class="text-orange-500" />
        <p class="mt-4 text-slate-500">Loading Recipe...</p>
      </div>

      <div v-else-if="error" class="rounded-lg bg-red-50 p-8 text-center">
        <h2 class="text-2xl font-semibold text-red-700">
          Error Loading Recipe
        </h2>
        <p class="mt-2 text-red-600">{{ error.message }}</p>
      </div>

      <div
        v-else-if="!recipe && !loading"
        class="rounded-lg bg-yellow-50 p-8 text-center"
      >
        <h2 class="text-2xl font-semibold text-yellow-700">Recipe Not Found</h2>
        <p class="mt-2 text-yellow-600">
          This recipe does not exist or may have been removed.
        </p>
      </div>

      <article v-else-if="recipe">
        <section class="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <img
              :src="activeImage"
              :alt="recipe.title"
              class="mb-4 h-96 w-full rounded-lg object-cover shadow-md"
            />
            <div class="grid grid-cols-5 gap-2">
              <img
                v-for="image in recipe.recipe_images"
                :key="image.id"
                :src="image.image_url"
                @click="activeImage = image.image_url"
                class="h-20 w-full cursor-pointer rounded-lg border-2 object-cover transition"
                :class="
                  activeImage === image.image_url
                    ? 'border-orange-500'
                    : 'border-transparent hover:border-orange-300'
                "
              />
            </div>
          </div>

          <div class="flex flex-col">
            <span class="text-sm font-semibold uppercase text-orange-500">{{
              recipe.recipe_categories[0]?.category.name || "Uncategorized"
            }}</span>
            <h1 class="mt-1 text-4xl font-extrabold text-slate-800">
              {{ recipe.title }}
            </h1>
            <NuxtLink
              :to="`/users/${recipe.user?.username}`"
              class="mt-2 text-sm text-slate-500 hover:underline"
            >
              by {{ recipe.user?.username }}
            </NuxtLink>
            <p class="mt-4 leading-relaxed text-slate-600">
              {{ recipe.description }}
            </p>

            <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div class="flex items-center font-medium text-slate-700">
                <Icon name="ph:heart-fill" class="mr-1.5 text-red-500" />
                <span>{{ totalLikes }} Likes</span>
              </div>
              <div class="flex items-center font-medium text-slate-700">
                <div class="flex items-center text-yellow-500">
                  <Icon
                    v-for="i in 5"
                    :key="i"
                    name="ph:star-fill"
                    :class="i <= averageRating ? '' : 'opacity-30'"
                  />
                </div>
                <span class="ml-2">
                  {{ averageRating ? averageRating.toFixed(2) : "N/A" }} ({{
                    totalRatings
                  }}
                  ratings)
                </span>
              </div>
            </div>

            <div class="mt-6 flex items-center space-x-2">
              <button
                @click="handleToggleLike"
                :disabled="likeLoading"
                class="p-3 rounded-lg text-slate-600 cursor-pointer transition-all duration-200"
                :class="
                  isLiked
                    ? 'bg-red-200 text-red-600 ring-2 ring-red-200'
                    : 'bg-slate-100 hover:bg-red-100 hover:text-red-600'
                "
                title="Like"
              >
                <Icon name="ph:heart-fill" class="h-5 w-5" />
              </button>
              <button
                @click="handleToggleBookmark"
                :disabled="bookmarkLoading"
                class="p-3 rounded-lg text-slate-600 transition-all cursor-pointer duration-200"
                :class="
                  isBookmarked
                    ? 'bg-blue-200 text-blue-600 ring-2 ring-blue-200'
                    : 'bg-slate-100 hover:bg-blue-100 hover:text-blue-600'
                "
                title="Bookmark"
              >
                <Icon name="ph:bookmark-simple-fill" class="h-5 w-5" />
              </button>
              <a
                href="#comments"
                class="p-3 rounded-lg bg-slate-100 text-slate-600 transition-colors"
                title="Go to Comments"
              >
                <Icon name="ph:chat-circle-dots" class="h-5 w-5" />
              </a>
            </div>
          </div>
        </section>

        <section class="border-t pt-8">
          <div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div class="lg:col-span-1">
              <IngredientList :ingredients="recipe.recipe_ingredients" />
            </div>
            <div class="lg:col-span-2">
              <InstructionSteps :instructions="recipe.instructions" />
            </div>
          </div>
        </section>

        <section id="comments" class="mt-12 border-t pt-8">
          <RatingSection
            :recipe-id="recipe.id"
            :initial-user-rating="currentUserRating"
            @rated="handleRatingUpdate"
          />
          <RecipeCommentSection
            :recipe-id="recipe.id"
            :total-comments="recipe.total_comments"
            @comment-added="handleCommentAdded"
          />
        </section>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useToast } from "vue-toastification";
import { useAuthStore } from "~/store/auth";
import { useAuthAction } from "~/composables/useAuthAction";
import {
  GET_RECIPE_DETAILS,
  LIKE_RECIPE,
  UNLIKE_RECIPE,
  BOOKMARK_RECIPE,
  UNBOOKMARK_RECIPE,
  RATE_RECIPE,
  ADD_COMMENT,
} from "~/lib/graphql";

const route = useRoute();
const auth = useAuthStore();
const toast = useToast();
const { executeAuthAction } = useAuthAction();

const recipeId = computed(() => route.params.id as string);
const currentUserId = computed(() => auth.user?.id);
const activeImage = ref("");

const { result, loading, error, refetch } = useQuery(
  GET_RECIPE_DETAILS,
  () => ({
    id: recipeId.value,
    user_id: currentUserId.value || "00000000-0000-0000-0000-000000000000",
  }),
  () => ({
    enabled: !!recipeId.value,
    fetchPolicy: "cache-and-network",
  })
);

const { mutate: likeRecipe, loading: likeLoading } = useMutation(LIKE_RECIPE);
const { mutate: unlikeRecipe } = useMutation(UNLIKE_RECIPE);
const { mutate: bookmarkRecipe, loading: bookmarkLoading } =
  useMutation(BOOKMARK_RECIPE);
const { mutate: unbookmarkRecipe } = useMutation(UNBOOKMARK_RECIPE);
const { mutate: rateRecipe } = useMutation(RATE_RECIPE);
const { mutate: addComment } = useMutation(ADD_COMMENT);

const recipe = computed(() => result.value?.recipes_by_pk);
const isLiked = computed(
  () => (recipe.value?.recipe_likes_aggregate?.aggregate?.count ?? 0) > 0
);
const isBookmarked = computed(
  () => (recipe.value?.user_bookmarks_aggregate?.aggregate?.count ?? 0) > 0
);
const totalLikes = computed(() => recipe.value?.total_likes ?? 0);
const averageRating = computed(() => recipe.value?.average_rating ?? 0);
const totalRatings = computed(
  () => recipe.value?.recipe_ratings_aggregate?.aggregate?.count ?? 0
);
const currentUserRating = computed(
  () => recipe.value?.recipe_ratings?.[0]?.rating ?? 0
);

const updateRecipeInteractionCache = (
  interactionType: "like" | "bookmark" | "rating" | "comment",
  newValue: any
) => {
  const query = GET_RECIPE_DETAILS;
  const variables = {
    id: recipeId.value,
    user_id: currentUserId.value || "00000000-0000-0000-0000-000000000000",
  };

  const apolloClient = useNuxtApp().$apollo.defaultClient;

  const data = apolloClient.readQuery({ query, variables });

  if (data && data.recipes_by_pk) {
    let updatedRecipe = { ...data.recipes_by_pk };

    if (interactionType === "like") {
      updatedRecipe.total_likes = newValue.totalLikes;
      updatedRecipe.recipe_likes_aggregate = {
        ...updatedRecipe.recipe_likes_aggregate,
        aggregate: { count: newValue.isLiked ? 1 : 0 },
      };
    } else if (interactionType === "bookmark") {
      updatedRecipe.user_bookmarks_aggregate = {
        ...updatedRecipe.user_bookmarks_aggregate,
        aggregate: { count: newValue.isBookmarked ? 1 : 0 },
      };
    } else if (interactionType === "rating") {
      updatedRecipe.average_rating = newValue.averageRating;
      updatedRecipe.total_ratings = newValue.totalRatings;
      updatedRecipe.recipe_ratings_aggregate = {
        ...updatedRecipe.recipe_ratings_aggregate,
        aggregate: { count: newValue.totalRatings },
      };
      updatedRecipe.recipe_ratings = [{ rating: newValue.userRating }];
    } else if (interactionType === "comment") {
      updatedRecipe.total_comments = newValue.totalComments;
    }

    apolloClient.writeQuery({
      query,
      variables,
      data: {
        recipes_by_pk: updatedRecipe,
      },
    });
  }
};

const handleToggleLike = () => {
  executeAuthAction(async () => {
    const userId = currentUserId.value;
    if (!userId) throw new Error("User ID not found.");

    const wasLiked = isLiked.value;
    const mutation = wasLiked ? unlikeRecipe : likeRecipe;

    try {
      await mutation({ recipe_id: recipeId.value, user_id: userId });
      toast.success(wasLiked ? "Like removed!" : "Recipe liked!");

      const newTotalLikes = wasLiked
        ? totalLikes.value - 1
        : totalLikes.value + 1;
      updateRecipeInteractionCache("like", {
        isLiked: !wasLiked,
        totalLikes: newTotalLikes,
      });

      refetch();
    } catch (e) {
      toast.error("Failed to update like status.");
      console.error("Like mutation error:", e);
      refetch();
    }
  });
};

const handleToggleBookmark = () => {
  executeAuthAction(async () => {
    const userId = currentUserId.value;
    if (!userId) throw new Error("User ID not found.");

    const wasBookmarked = isBookmarked.value;
    const mutation = wasBookmarked ? unbookmarkRecipe : bookmarkRecipe;

    try {
      await mutation({ recipe_id: recipeId.value, user_id: userId });
      toast.success(wasBookmarked ? "Bookmark removed!" : "Recipe bookmarked!");

      updateRecipeInteractionCache("bookmark", {
        isBookmarked: !wasBookmarked,
      });

      refetch();
    } catch (e) {
      toast.error("Failed to update bookmark status.");
      console.error("Bookmark mutation error:", e);
      refetch();
    }
  });
};

const handleRatingUpdate = async ({ newRating, average, count }) => {
  executeAuthAction(async () => {
    try {
      await rateRecipe({ recipe_id: recipeId.value, rating: newRating });
      toast.success("Rating submitted!");
      updateRecipeInteractionCache("rating", {
        userRating: newRating,
        averageRating: average,
        totalRatings: count,
      });
      refetch();
    } catch (e) {
      toast.error("Failed to submit rating.");
      console.error("Rating mutation error:", e);
      refetch();
    }
  });
};

const handleCommentAdded = async (newCommentCount: number) => {
  updateRecipeInteractionCache("comment", { totalComments: newCommentCount });
  refetch();
};

watch(
  recipe,
  (newRecipe) => {
    if (newRecipe) {
      activeImage.value =
        newRecipe.featured_image_url ||
        newRecipe.recipe_images[0]?.image_url ||
        "";
      useSeoMeta({
        title: `${newRecipe.title} | BiteSized Recipes`,
        description: newRecipe.description,
        ogImage: newRecipe.featured_image_url,
      });
    }
  },
  { immediate: true }
);

watch(error, (newError) => {
  if (newError) {
    toast.error("Could not refresh recipe data.");
  }
});
</script> -->
