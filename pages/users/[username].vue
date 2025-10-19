<template>
  <div v-if="loading" class="flex justify-center items-center h-screen">
    <UiSpinner size="lg" />
  </div>
  <div v-else-if="error || !user" class="text-center py-20 px-4">
    <h1 class="text-4xl font-bold text-slate-800">Chef Not Found</h1>
    <p class="text-slate-500 mt-2">
      The user profile you are looking for does not exist.
    </p>
  </div>
  <div v-else class="bg-slate-50 min-h-screen">
    <header class="relative h-56 md:h-64 bg-slate-200">
      <img
        src="https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=2832"
        alt="Cover photo"
        class="w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
      ></div>
      <div class="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full px-4">
        <div
          class="container mx-auto flex flex-col md:flex-row items-center justify-between"
        >
          <div class="flex items-end space-x-4">
            <div class="pb-4 hidden md:block">
              <h1
                class="text-3xl font-extrabold text-white"
                style="text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5)"
              >
                CHEF {{ user.username.toUpperCase() }}
              </h1>
            </div>
          </div>
          <div class="mt-4 md:mt-0 md:pb-4 flex items-center space-x-4">
            <NuxtLink v-if="isOwnProfile" to="/profile/edit">
              <button
                class="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-full hover:bg-slate-100 transition flex items-center cursor-pointer"
              >
                <Icon name="ph:pencil-simple" class="w-4 h-4 mr-2" /> Edit
                Profile
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <div class="md:hidden text-center mt-20 mb-4">
      <h1 class="text-3xl font-extrabold text-slate-800">
        CHEF {{ user.username.toUpperCase() }}
      </h1>
    </div>

    <div class="container mt-24 mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside class="lg:col-span-1 space-y-6 lg:sticky top-24 self-start">
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-lg font-bold mb-4 text-slate-800">Stats</h3>
            <div class="space-y-3 text-slate-600">
              <div class="flex justify-between items-center">
                <Icon name="ph:book-open" class="mr-2 text-green-500" /><span
                  >Recipes</span
                >
                <span class="font-bold text-slate-800">{{
                  user.recipes_aggregate.aggregate.count
                }}</span>
              </div>
              <div class="flex justify-between items-center">
                <Icon name="ph:heart" class="mr-2 text-red-500" /><span
                  >Likes Received</span
                >
                <span class="font-bold text-slate-800">{{
                  user.recipes_aggregate.aggregate.sum.total_likes || 0
                }}</span>
              </div>
            </div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-lg font-bold mb-4 text-slate-800">Categories</h3>
            <div v-if="userCategoriesLoading" class="text-sm text-slate-500">
              Loading...
            </div>
            <div
              v-else-if="userCategories.length === 0"
              class="text-sm text-slate-500"
            >
              No categories used yet.
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <span
                v-for="cat in userCategories"
                :key="cat.category.id"
                class="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full"
                >{{ cat.category.name }}</span
              >
            </div>
          </div>
        </aside>

        <main class="lg:col-span-3">
          <div class="border-b mb-6">
            <nav class="flex space-x-8">
              <button
                @click="activeTab = 'recipes'"
                class="py-4 px-1 text-lg font-medium border-b-2 transition-colors"
                :class="
                  activeTab === 'recipes'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-slate-500 cursor-pointer hover:text-green-600 hover:border-green-600'
                "
              >
                Recipes ({{ user.recipes.length }})
              </button>
              <button
                @click="activeTab = 'bookmarks'"
                class="py-4 px-1 text-lg font-medium border-b-2 transition-colors"
                :class="
                  activeTab === 'bookmarks'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-slate-500 cursor-pointer hover:text-green-600 hover:border-green-600'
                "
              >
                Bookmarks ({{ user.user_bookmarks.length }})
              </button>
              <button
                v-if="isOwnProfile"
                @click="activeTab = 'purchases'"
                class="py-4 px-1 text-lg font-medium border-b-2 transition-colors"
                :class="
                  activeTab === 'purchases'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-slate-500 hover:text-green-600 cursor-pointer hover:border-green-600'
                "
              >
                Purchase History
              </button>
            </nav>
          </div>

          <div v-show="activeTab === 'recipes'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold text-slate-800">My Recipes</h2>
              <NuxtLink v-if="isOwnProfile" to="/create-recipe">
                <UiAppButton class="cursor-pointer"
                  ><Icon name="ph:plus-circle" class="mr-2" /> Add New
                  Recipe</UiAppButton
                >
              </NuxtLink>
            </div>
            <div
              v-if="user.recipes.length === 0"
              class="text-center py-12 text-slate-500 rounded-lg bg-white border"
            >
              You have not published any recipes yet.
            </div>
            <div
              v-else
              class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <div
                v-for="recipe in user.recipes"
                :key="recipe.id"
                class="relative group"
              >
                <RecipeCard :recipe="recipe" />
                <div
                  v-if="isOwnProfile"
                  class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2"
                >
                  <NuxtLink
                    :to="`/recipes/edit/${recipe.id}`"
                    title="Edit Recipe"
                  >
                    <button
                      class="p-2 rounded-full shadow-md transition bg-white hover:bg-slate-100 cursor-pointer"
                    >
                      <Icon
                        name="ph:pencil-simple"
                        class="w-5 h-5 text-slate-700"
                      />
                    </button>
                  </NuxtLink>
                  <button
                    @click="handleDeleteRecipe(recipe.id, recipe.title)"
                    class="p-2 rounded-full shadow-md transition bg-red-500 hover:bg-red-600 cursor-pointer"
                    title="Delete Recipe"
                  >
                    <Icon name="ph:trash-simple" class="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'bookmarks'">
            <h2 class="text-2xl font-bold text-slate-800 mb-6">
              Bookmarked Recipes
            </h2>
            <div
              v-if="user.user_bookmarks.length === 0"
              class="text-center py-12 text-slate-500 rounded-lg bg-white border"
            >
              No bookmarked recipes found.
            </div>
            <div
              v-else
              class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <RecipeCard
                v-for="bookmark in user.user_bookmarks"
                :key="bookmark.recipe.id"
                :recipe="bookmark.recipe"
              />
            </div>
          </div>

          <div v-show="activeTab === 'purchases'">
            <h2 class="text-2xl font-bold text-slate-800 mb-6">
              My Purchase History
            </h2>
            <div
              v-if="purchaseHistoryLoading"
              class="text-center py-12 text-slate-500"
            >
              <UiSpinner />
            </div>
            <div
              v-else-if="purchaseHistoryError"
              class="text-center py-12 text-red-500"
            >
              Could not load purchase history.
            </div>
            <div
              v-else-if="purchases.length === 0"
              class="text-center py-12 text-slate-500 rounded-lg bg-white border"
            >
              You have not purchased any recipes yet.
            </div>
            <div
              v-else
              class="bg-white rounded-lg shadow-sm border overflow-x-auto"
            >
              <table class="w-full text-left text-sm text-slate-600">
                <thead class="bg-slate-50 text-xs text-slate-700 uppercase">
                  <tr>
                    <th scope="col" class="px-6 py-3">Recipe Title</th>
                    <th scope="col" class="px-6 py-3">Creator</th>
                    <th scope="col" class="px-6 py-3">Date</th>
                    <th scope="col" class="px-6 py-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="purchase in purchases"
                    :key="purchase.id"
                    class="border-b hover:bg-slate-50"
                  >
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-slate-900 whitespace-nowrap"
                    >
                      <NuxtLink
                        :to="`/recipe/${purchase.recipe.id}`"
                        class="hover:underline text-green-700"
                        >{{ purchase.recipe.title }}</NuxtLink
                      >
                    </th>
                    <td class="px-6 py-4">
                      @{{ purchase.recipe.user.username }}
                    </td>
                    <td class="px-6 py-4">
                      {{ new Date(purchase.purchased_at).toLocaleDateString() }}
                    </td>
                    <td class="px-6 py-4 font-bold text-right text-slate-800">
                      ${{ purchase.recipe.price.toFixed(2) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      :show="confirmationModal.show"
      :title="confirmationModal.title"
      :message="confirmationModal.message"
      confirm-button-text="Delete"
      cancel-button-text="Cancel"
      @confirm="confirmDeletion"
      @cancel="cancelDeletion"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useToast } from "vue-toastification";
import { useAuthStore } from "~/store/auth";
import {
  GET_USER_PROFILE_DATA,
  GET_USER_UNIQUE_CATEGORIES,
  DELETE_RECIPE,
  GET_USER_PURCHASE_HISTORY,
} from "~/lib/graphql";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const auth = useAuthStore();
const toast = useToast();
const username = computed(() => route.params.username as string);
const activeTab = ref<"recipes" | "bookmarks" | "purchases">("recipes");

// State for the confirmation modal
const confirmationModal = ref({
  show: false,
  title: "Confirm Deletion",
  message: "",
});
const recipeToDelete = ref<{ id: string; title: string } | null>(null);

const {
  result,
  loading,
  error,
  refetch: refetchProfile,
} = useQuery(
  GET_USER_PROFILE_DATA,
  () => ({ username: username.value }),
  () => ({ fetchPolicy: "cache-and-network" })
);
const user = computed(() => result.value?.users[0]);
const isOwnProfile = computed(
  () => auth.isAuthenticated && auth.user?.id === user.value?.id
);

const { result: userCategoriesResult, loading: userCategoriesLoading } =
  useQuery(
    GET_USER_UNIQUE_CATEGORIES,
    () => ({ userId: user.value?.id }),
    () => ({ enabled: !!user.value?.id })
  );
const userCategories = computed(
  () => userCategoriesResult.value?.recipe_categories || []
);

const {
  result: purchaseHistoryResult,
  loading: purchaseHistoryLoading,
  error: purchaseHistoryError,
} = useQuery(
  GET_USER_PURCHASE_HISTORY,
  () => ({ userId: user.value?.id }),
  () => ({
    enabled: isOwnProfile.value,
    fetchPolicy: "cache-and-network",
  })
);
const purchases = computed(
  () => purchaseHistoryResult.value?.user_purchased_recipes || []
);

const { mutate: deleteRecipe } = useMutation(DELETE_RECIPE, {
  refetchQueries: [
    { query: GET_USER_PROFILE_DATA, variables: { username: username.value } },
  ],
});

const handleDeleteRecipe = (recipeId: string, recipeTitle: string) => {
  recipeToDelete.value = { id: recipeId, title: recipeTitle };
  confirmationModal.value.message = `Are you sure you want to delete the recipe "${recipeTitle}"? This action cannot be undone.`;
  confirmationModal.value.show = true;
};

const confirmDeletion = async () => {
  if (!recipeToDelete.value) return;

  try {
    await deleteRecipe({ id: recipeToDelete.value.id });
    toast.success("Recipe deleted successfully.");
  } catch (err: any) {
    console.error("Failed to delete recipe:", err);
    toast.error(err.message || "An error occurred while deleting the recipe.");
  } finally {
    cancelDeletion(); // Close the modal and reset state
  }
};

const cancelDeletion = () => {
  confirmationModal.value.show = false;
  recipeToDelete.value = null;
};

watch(
  user,
  (newUser) => {
    if (newUser) {
      useSeoMeta({
        title: `Chef ${newUser.username}'s Profile | BiteSized`,
        description: `Discover all the culinary creations by ${newUser.username}.`,
      });
    }
  },
  { immediate: true }
);
</script>

<!-- <template>
  <div v-if="loading" class="flex justify-center items-center h-screen">
    <UiSpinner size="lg" />
  </div>
  <div v-else-if="error || !user" class="text-center py-20 px-4">
    <h1 class="text-4xl font-bold text-slate-800">Chef Not Found</h1>
    <p class="text-slate-500 mt-2">
      The user profile you are looking for does not exist.
    </p>
  </div>
  <div v-else class="bg-slate-50 min-h-screen">
    <header class="relative h-56 md:h-64 bg-slate-200">
      <img
        src="https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=2832"
        alt="Cover photo"
        class="w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
      ></div>
      <div class="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full px-4">
        <div
          class="container mx-auto flex flex-col md:flex-row items-center justify-between"
        >
          <div class="flex items-end space-x-4">
            <div class="pb-4 hidden md:block">
              <h1
                class="text-3xl font-extrabold text-white"
                style="text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5)"
              >
                CHEF {{ user.username.toUpperCase() }}
              </h1>
            </div>
          </div>
          <div class="mt-4 md:mt-0 md:pb-4 flex items-center space-x-4">
            <NuxtLink v-if="isOwnProfile" to="/profile/edit">
              <button
                class="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-full hover:bg-slate-100 transition flex items-center cursor-pointer"
              >
                <Icon name="ph:pencil-simple" class="w-4 h-4 mr-2" /> Edit
                Profile
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <div class="md:hidden text-center mt-20 mb-4">
      <h1 class="text-3xl font-extrabold text-slate-800">
        CHEF {{ user.username.toUpperCase() }}
      </h1>
    </div>

    <div class="container mt-24 mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside class="lg:col-span-1 space-y-6 lg:sticky top-24 self-start">
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-lg font-bold mb-4 text-slate-800">Stats</h3>
            <div class="space-y-3 text-slate-600">
              <div class="flex justify-between items-center">
                <Icon name="ph:book-open" class="mr-2 text-green-500" /><span
                  >Recipes</span
                >
                <span class="font-bold text-slate-800">{{
                  user.recipes_aggregate.aggregate.count
                }}</span>
              </div>
              <div class="flex justify-between items-center">
                <Icon name="ph:heart" class="mr-2 text-red-500" /><span
                  >Likes Received</span
                >
                <span class="font-bold text-slate-800">{{
                  user.recipes_aggregate.aggregate.sum.total_likes || 0
                }}</span>
              </div>
            </div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-lg font-bold mb-4 text-slate-800">Categories</h3>
            <div v-if="userCategoriesLoading" class="text-sm text-slate-500">
              Loading...
            </div>
            <div
              v-else-if="userCategories.length === 0"
              class="text-sm text-slate-500"
            >
              No categories used yet.
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <span
                v-for="cat in userCategories"
                :key="cat.category.id"
                class="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full"
                >{{ cat.category.name }}</span
              >
            </div>
          </div>
        </aside>

        <main class="lg:col-span-3">
          <div class="border-b mb-6">
            <nav class="flex space-x-8">
              <button
                @click="activeTab = 'recipes'"
                class="py-4 px-1 text-lg font-medium border-b-2 transition-colors"
                :class="
                  activeTab === 'recipes'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-slate-500 cursor-pointer hover:text-green-600 hover:border-green-600'
                "
              >
                Recipes ({{ user.recipes.length }})
              </button>
              <button
                @click="activeTab = 'bookmarks'"
                class="py-4 px-1 text-lg font-medium border-b-2 transition-colors"
                :class="
                  activeTab === 'bookmarks'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-slate-500 cursor-pointer hover:text-green-600 hover:border-green-600'
                "
              >
                Bookmarks ({{ user.user_bookmarks.length }})
              </button>
              <button
                v-if="isOwnProfile"
                @click="activeTab = 'purchases'"
                class="py-4 px-1 text-lg font-medium border-b-2 transition-colors"
                :class="
                  activeTab === 'purchases'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-slate-500 hover:text-green-600 cursor-pointer hover:border-green-600'
                "
              >
                Purchase History
              </button>
            </nav>
          </div>

          <div v-show="activeTab === 'recipes'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold text-slate-800">My Recipes</h2>
              <NuxtLink v-if="isOwnProfile" to="/create-recipe">
                <UiAppButton class="cursor-pointer"
                  ><Icon name="ph:plus-circle" class="mr-2" /> Add New
                  Recipe</UiAppButton
                >
              </NuxtLink>
            </div>
            <div
              v-if="user.recipes.length === 0"
              class="text-center py-12 text-slate-500 rounded-lg bg-white border"
            >
              You have not published any recipes yet.
            </div>
            <div
              v-else
              class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <div
                v-for="recipe in user.recipes"
                :key="recipe.id"
                class="relative group"
              >
                <RecipeCard :recipe="recipe" />
                <div
                  v-if="isOwnProfile"
                  class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2"
                >
                  <NuxtLink
                    :to="`/recipes/edit/${recipe.id}`"
                    title="Edit Recipe"
                  >
                    <button
                      class="p-2 rounded-full shadow-md transition bg-white hover:bg-slate-100 cursor-pointer"
                    >
                      <Icon
                        name="ph:pencil-simple"
                        class="w-5 h-5 text-slate-700"
                      />
                    </button>
                  </NuxtLink>
                  <button
                    @click="handleDeleteRecipe(recipe.id, recipe.title)"
                    class="p-2 rounded-full shadow-md transition bg-red-500 hover:bg-red-600 cursor-pointer"
                    title="Delete Recipe"
                  >
                    <Icon name="ph:trash-simple" class="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'bookmarks'">
            <h2 class="text-2xl font-bold text-slate-800 mb-6">
              Bookmarked Recipes
            </h2>
            <div
              v-if="user.user_bookmarks.length === 0"
              class="text-center py-12 text-slate-500 rounded-lg bg-white border"
            >
              No bookmarked recipes found.
            </div>
            <div
              v-else
              class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <RecipeCard
                v-for="bookmark in user.user_bookmarks"
                :key="bookmark.recipe.id"
                :recipe="bookmark.recipe"
              />
            </div>
          </div>

          <div v-show="activeTab === 'purchases'">
            <h2 class="text-2xl font-bold text-slate-800 mb-6">
              My Purchase History
            </h2>
            <div
              v-if="purchaseHistoryLoading"
              class="text-center py-12 text-slate-500"
            >
              <UiSpinner />
            </div>
            <div
              v-else-if="purchaseHistoryError"
              class="text-center py-12 text-red-500"
            >
              Could not load purchase history.
            </div>
            <div
              v-else-if="purchases.length === 0"
              class="text-center py-12 text-slate-500 rounded-lg bg-white border"
            >
              You have not purchased any recipes yet.
            </div>
            <div
              v-else
              class="bg-white rounded-lg shadow-sm border overflow-x-auto"
            >
              <table class="w-full text-left text-sm text-slate-600">
                <thead class="bg-slate-50 text-xs text-slate-700 uppercase">
                  <tr>
                    <th scope="col" class="px-6 py-3">Recipe Title</th>
                    <th scope="col" class="px-6 py-3">Creator</th>
                    <th scope="col" class="px-6 py-3">Date</th>
                    <th scope="col" class="px-6 py-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="purchase in purchases"
                    :key="purchase.id"
                    class="border-b hover:bg-slate-50"
                  >
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-slate-900 whitespace-nowrap"
                    >
                      <NuxtLink
                        :to="`/recipe/${purchase.recipe.id}`"
                        class="hover:underline text-green-700"
                        >{{ purchase.recipe.title }}</NuxtLink
                      >
                    </th>
                    <td class="px-6 py-4">
                      @{{ purchase.recipe.user.username }}
                    </td>
                    <td class="px-6 py-4">
                      {{ new Date(purchase.purchased_at).toLocaleDateString() }}
                    </td>
                    <td class="px-6 py-4 font-bold text-right text-slate-800">
                      ${{ purchase.recipe.price.toFixed(2) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useToast } from "vue-toastification"; 
import { useAuthStore } from "~/store/auth";
import {
  GET_USER_PROFILE_DATA,
  GET_USER_UNIQUE_CATEGORIES,
  DELETE_RECIPE,
  GET_USER_PURCHASE_HISTORY,
} from "~/lib/graphql";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const auth = useAuthStore();
const toast = useToast(); 
const username = computed(() => route.params.username as string);
const activeTab = ref<"recipes" | "bookmarks" | "purchases">("recipes");

const {
  result,
  loading,
  error,
  refetch: refetchProfile,
} = useQuery(
  GET_USER_PROFILE_DATA,
  () => ({ username: username.value }),
  () => ({ fetchPolicy: "cache-and-network" })
);
const user = computed(() => result.value?.users[0]);
const isOwnProfile = computed(
  () => auth.isAuthenticated && auth.user?.id === user.value?.id
);

const { result: userCategoriesResult, loading: userCategoriesLoading } =
  useQuery(
    GET_USER_UNIQUE_CATEGORIES,
    () => ({ userId: user.value?.id }),
    () => ({ enabled: !!user.value?.id })
  );
const userCategories = computed(
  () => userCategoriesResult.value?.recipe_categories || []
);

const {
  result: purchaseHistoryResult,
  loading: purchaseHistoryLoading,
  error: purchaseHistoryError,
} = useQuery(
  GET_USER_PURCHASE_HISTORY,
  () => ({ userId: user.value?.id }),
  () => ({
    enabled: isOwnProfile.value,
    fetchPolicy: "cache-and-network",
  })
);
const purchases = computed(
  () => purchaseHistoryResult.value?.user_purchased_recipes || []
);

const { mutate: deleteRecipe } = useMutation(DELETE_RECIPE, {

  refetchQueries: [
    { query: GET_USER_PROFILE_DATA, variables: { username: username.value } },
  ],
});

const handleDeleteRecipe = async (recipeId: string, recipeTitle: string) => {

  if (
    confirm(
      `Are you sure you want to delete the recipe "${recipeTitle}"? This action cannot be undone.`
    )
  ) {
    try {
      await deleteRecipe({ id: recipeId });
      toast.success("Recipe deleted successfully.");
    } catch (err: any) {
      console.error("Failed to delete recipe:", err);
      toast.error(
        err.message || "An error occurred while deleting the recipe."
      );
    }
  }
};

watch(
  user,
  (newUser) => {
    if (newUser) {
      useSeoMeta({
        title: `Chef ${newUser.username}'s Profile | BiteSized`,
        description: `Discover all the culinary creations by ${newUser.username}.`,
      });
    }
  },
  { immediate: true }
);
</script>
 -->
