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
              to="/creators"
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
                <span class="ml-2"
                  >{{ averageRating ? averageRating.toFixed(2) : "N/A" }} ({{
                    totalRatings
                  }}
                  ratings)</span
                >
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
                class="w-full justify-center cursor-pointer !py-3 bg-green-500 hover:bg-green-600"
              >
                <UiSpinner v-if="paymentLoading" class="mr-2" />
                Purchase for ${{ recipeData.price.toFixed(2) }} to Unlock
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
import { computed, ref, watch } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
// import { useToast } from "vue-toastification";
import { useAuthStore } from "~/store/auth";
import { useAuthAction } from "~/composables/useAuthAction";
import {
  GET_RECIPE_DETAILS,
  LIKE_RECIPE,
  UNLIKE_RECIPE,
  BOOKMARK_RECIPE,
  UNBOOKMARK_RECIPE,
  INITIATE_PAYMENT,
} from "~/lib/graphql";
import pkg from "vue-toastification";
const { useToast } = pkg;
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const toast = useToast();
const { executeAuthAction } = useAuthAction();

const recipeId = computed(() => route.params.id as string);
const currentUserId = computed(() => auth.user?.id || null);
const activeImage = ref("");
const recipeData = ref<any | null>(null);

const { result, loading, error, refetch } = useQuery(
  GET_RECIPE_DETAILS,
  () => ({
    id: recipeId.value,
    user_id: currentUserId.value,
    isLoggedIn: !!currentUserId.value,
  }),
  {
    enabled: !!recipeId.value,
    fetchPolicy: "cache-and-network",
  }
);

const { mutate: likeRecipe, loading: likeLoading } = useMutation(LIKE_RECIPE);
const { mutate: unlikeRecipe } = useMutation(UNLIKE_RECIPE);
const { mutate: bookmarkRecipe, loading: bookmarkLoading } =
  useMutation(BOOKMARK_RECIPE);
const { mutate: unbookmarkRecipe } = useMutation(UNBOOKMARK_RECIPE);
const { mutate: initiatePayment, loading: paymentLoading } =
  useMutation(INITIATE_PAYMENT);

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
const hasAccess = computed(() => {
  if (!recipeData.value) return false;
  if (!recipeData.value.is_premium) return true;
  if (auth.isAuthenticated && auth.user?.id === recipeData.value.user?.id)
    return true;
  if (
    auth.isAuthenticated &&
    (recipeData.value.user_purchased_recipes_aggregate?.aggregate?.count ?? 0) >
      0
  )
    return true;
  return false;
});

watch(
  result,
  (newResult) => {
    if (newResult?.recipes_by_pk) {
      recipeData.value = structuredClone(newResult.recipes_by_pk);

      if (!activeImage.value) {
        activeImage.value =
          newResult.recipes_by_pk.featured_image_url ||
          newResult.recipes_by_pk.recipe_images?.[0]?.image_url ||
          "";
      }
    }
  },
  { immediate: true }
);

watch(
  () => route.query.purchase_success,
  async (newVal) => {
    if (newVal === "true") {
      toast.success("Purchase successful! Unlocking recipe instructions.");
      await refetch();
      router.replace({
        query: { ...route.query, purchase_success: undefined },
      });
    }
  },
  { immediate: true }
);

const handleToggleLike = () => {
  executeAuthAction(async () => {
    if (!currentUserId.value || !recipeData.value) return;
    const wasLiked = isLiked.value;

    const newLikes = wasLiked ? totalLikes.value - 1 : totalLikes.value + 1;
    const newLikeCount = wasLiked ? 0 : 1;
    recipeData.value = {
      ...recipeData.value,
      total_likes: newLikes,
      recipe_likes_aggregate: {
        ...recipeData.value.recipe_likes_aggregate,
        aggregate: {
          ...recipeData.value.recipe_likes_aggregate.aggregate,
          count: newLikeCount,
        },
      },
    };

    try {
      const mutation = wasLiked ? unlikeRecipe : likeRecipe;
      await mutation({
        recipe_id: recipeId.value,
        user_id: currentUserId.value,
      });
      toast.success(wasLiked ? "Like removed!" : "Recipe liked!");
    } catch (e: any) {
      toast.error(e.message || "Failed to update like status.");
      refetch();
    }
  });
};

const handleToggleBookmark = () => {
  executeAuthAction(async () => {
    if (!currentUserId.value || !recipeData.value) return;
    const wasBookmarked = isBookmarked.value;

    recipeData.value = {
      ...recipeData.value,
      user_bookmarks_aggregate: {
        ...recipeData.value.user_bookmarks_aggregate,
        aggregate: {
          ...recipeData.value.user_bookmarks_aggregate.aggregate,
          count: wasBookmarked ? 0 : 1,
        },
      },
    };

    try {
      const mutation = wasBookmarked ? unbookmarkRecipe : bookmarkRecipe;
      await mutation({
        recipe_id: recipeId.value,
        user_id: currentUserId.value,
      });
      toast.success(wasBookmarked ? "Bookmark removed!" : "Recipe bookmarked!");
    } catch (e: any) {
      toast.error(e.message || "Failed to update bookmark status.");
      refetch();
    }
  });
};

const handleRatingUpdate = (
  payload: { newRating: number; average: number; count: number } | undefined
) => {
  if (!payload || !recipeData.value) return;
  const { newRating, average, count } = payload;

  recipeData.value = {
    ...recipeData.value,
    average_rating: average,
    recipe_ratings_aggregate: {
      ...recipeData.value.recipe_ratings_aggregate,
      aggregate: {
        ...recipeData.value.recipe_ratings_aggregate.aggregate,
        count: count,
      },
    },
    recipe_ratings: [{ rating: newRating }],
  };
  toast.success("Rating submitted!");
};

const handleCommentAdded = (newTotalComments: number) => {
  if (!recipeData.value) return;
  recipeData.value = {
    ...recipeData.value,
    total_comments: newTotalComments,
  };
};

const handleBuyRecipe = () => {
  executeAuthAction(async () => {
    if (!recipeId.value) return toast.error("Recipe ID is missing.");
    try {
      const res = await initiatePayment({ recipeId: recipeId.value });
      const checkoutUrl = res?.data?.initiatePayment?.checkoutUrl;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error(
          res?.errors?.[0]?.message || "Could not retrieve checkout URL."
        );
      }
    } catch (err: any) {
      toast.error(
        err.message || "Failed to initiate payment. Please try again."
      );
    }
  });
};
</script>
