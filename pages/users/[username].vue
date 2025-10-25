<template>
  <div
    v-if="isLoadingInitialData"
    class="flex justify-center items-center h-screen"
  >
    <UiSpinner size="lg" />
  </div>
  <div v-else-if="fetchError || !user" class="text-center py-20 px-4">
    <h1 class="text-4xl font-bold text-slate-800">Chef Not Found</h1>
    <p class="text-slate-500 mt-2">
      The user profile you are looking for does not exist or an error occurred.
    </p>
    <p v-if="fetchError" class="text-red-500 text-sm mt-2">
      Error: {{ fetchError.message }}
    </p>
    <NuxtLink to="/">
      <UiAppButton class="mt-8 cursor-pointer">Go to Homepage</UiAppButton>
    </NuxtLink>
  </div>
  <div v-else class="bg-slate-50 min-h-screen">
    <header class="relative h-56 md:h-64 bg-slate-200">
      <img
        src="https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=2832"
        :alt="`${user.username}'s cover photo`"
        class="w-full h-full object-cover"
        loading="lazy"
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
                class="px-6 py-2 bg-white cursor-pointer border border-slate-300 text-slate-700 font-semibold rounded-full hover:bg-slate-100 transition flex items-center"
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
                  totalLikesReceived
                }}</span>
              </div>
            </div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-lg font-bold mb-4 text-slate-800">Categories</h3>
            <div
              v-if="userCategoriesLoading || isLoadingInitialData"
              class="text-sm text-slate-500"
            >
              <UiSpinner class="inline-block w-4 h-4 mr-2" /> Loading
              categories...
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
                @click="setActiveTab('recipes')"
                class="py-4 px-1 text-lg font-medium border-b-2 transition-colors cursor-pointer"
                :class="
                  currentTab === 'recipes'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-slate-500 hover:text-green-600 hover:border-green-600'
                "
                aria-controls="recipes-panel"
                :aria-selected="currentTab === 'recipes'"
                role="tab"
              >
                Recipes ({{ userRecipes.length }})
              </button>
              <button
                @click="setActiveTab('bookmarks')"
                class="py-4 px-1 text-lg font-medium border-b-2 transition-colors cursor-pointer"
                :class="
                  currentTab === 'bookmarks'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-slate-500 hover:text-green-600 hover:border-green-600'
                "
                aria-controls="bookmarks-panel"
                :aria-selected="currentTab === 'bookmarks'"
                role="tab"
              >
                Bookmarks ({{ bookmarkCount }})
              </button>
            </nav>
          </div>

          <div
            v-if="currentTab === 'recipes'"
            id="recipes-panel"
            role="tabpanel"
          >
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-slate-800">My Recipes</h2>
              <NuxtLink v-if="isOwnProfile" to="/create-recipe">
                <UiAppButton class="cursor-pointer hover:bg-green-600">
                  <Icon name="ph:plus-circle" class="mr-2" /> Add New Recipe
                </UiAppButton>
              </NuxtLink>
            </div>
            <div
              v-if="userRecipes.length === 0"
              class="text-center py-12 text-slate-500 rounded-lg bg-white border"
            >
              You have not published any recipes yet.
            </div>
            <div v-else>
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div
                  v-for="recipe in paginatedRecipes"
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
                        class="p-2 rounded-full cursor-pointer shadow-md transition bg-white hover:bg-slate-100"
                        aria-label="Edit Recipe"
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
                      aria-label="Delete Recipe"
                    >
                      <Icon name="ph:trash-simple" class="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
              <div
                v-if="totalRecipePages > 1"
                class="flex justify-center mt-8 space-x-2"
              >
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-4 py-2 bg-white border rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page of recipes"
                >
                  Previous
                </button>
                <span class="px-4 py-2 text-slate-700"
                  >Page {{ currentPage }} of {{ totalRecipePages }}</span
                >
                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalRecipePages"
                  class="px-4 py-2 bg-white border rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page of recipes"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="currentTab === 'bookmarks'"
            id="bookmarks-panel"
            role="tabpanel"
          >
            <h2 class="text-2xl font-bold text-slate-800 mb-6">
              Bookmarked Recipes
            </h2>
            <div
              v-if="userBookmarks.length === 0"
              class="text-center py-12 text-slate-500 rounded-lg bg-white border"
            >
              No bookmarked recipes found.
            </div>
            <div
              v-else
              class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <RecipeCard
                v-for="bookmark in paginatedBookmarks"
                :key="bookmark.recipe.id"
                :recipe="bookmark.recipe"
              />
            </div>
            <div
              v-if="totalBookmarkPages > 1"
              class="flex justify-center mt-8 space-x-2"
            >
              <button
                @click="goToBookmarkPage(currentBookmarkPage - 1)"
                :disabled="currentBookmarkPage === 1"
                class="px-4 py-2 bg-white border rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page of bookmarks"
              >
                Previous
              </button>
              <span class="px-4 py-2 text-slate-700"
                >Page {{ currentBookmarkPage }} of
                {{ totalBookmarkPages }}</span
              >
              <button
                @click="goToBookmarkPage(currentBookmarkPage + 1)"
                :disabled="currentBookmarkPage === totalBookmarkPages"
                class="px-4 py-2 bg-white border rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page of bookmarks"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>

    <ConfirmationModal
      :show="confirmationModal.show"
      :title="confirmationModal.title"
      :message="confirmationModal.message"
      confirm-button-text="Delete"
      cancel-button-text="Cancel"
      :loading="isDeletingRecipe"
      @confirm="confirmDeletion"
      @cancel="cancelDeletion"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation } from "@vue/apollo-composable";
// import { useToast } from "vue-toastification";
import { useAuthStore } from "~/store/auth";

import {
  GET_USER_PROFILE_DATA,
  GET_USER_UNIQUE_CATEGORIES,
  DELETE_RECIPE,
} from "~/lib/graphql";
import Toast from "vue-toastification";
const { useToast } = Toast;
definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const toast = useToast();

const username = computed(() => route.params.username as string);

type ProfileTab = "recipes" | "bookmarks";
const currentTab = ref<ProfileTab>(
  (route.query.tab as ProfileTab) || "recipes"
);

const setActiveTab = (tab: ProfileTab) => {
  if (currentTab.value !== tab) {
    currentTab.value = tab;
    if (tab === "bookmarks") {
      currentBookmarkPage.value = 1;
    } else if (tab === "recipes") {
      currentPage.value = 1;
    }
    router.push({ query: { tab } });
  }
};

watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab && ["recipes", "bookmarks"].includes(newTab as string)) {
      currentTab.value = newTab as ProfileTab;
    } else if (!newTab) {
      currentTab.value = "recipes";
    }
  }
);

const confirmationModal = ref({
  show: false,
  title: "Confirm Deletion",
  message: "",
});
const recipeToDelete = ref<{ id: string; title: string } | null>(null);
const isDeletingRecipe = ref(false);

const {
  result,
  loading: initialDataLoading,
  error: fetchError,
  refetch: refetchUserProfile,
} = useQuery(GET_USER_PROFILE_DATA, () => ({ username: username.value }), {
  fetchPolicy: "cache-and-network",
});

const user = computed(() => result.value?.users[0]);
const isOwnProfile = computed(
  () => auth.isAuthenticated && auth.user?.id === user.value?.id
);
const isLoadingInitialData = computed(
  () => initialDataLoading.value && !user.value
);

const userRecipes = computed(() => user.value?.recipes || []);
const userBookmarks = computed(() => user.value?.user_bookmarks || []);

const totalLikesReceived = computed(
  () => user.value?.recipes_aggregate.aggregate?.sum?.total_likes || 0
);
const bookmarkCount = computed(() => userBookmarks.value.length);

const { result: userCategoriesResult, loading: userCategoriesLoading } =
  useQuery(
    GET_USER_UNIQUE_CATEGORIES,
    () => ({ userId: user.value?.id }),
    () => ({
      enabled: !!user.value?.id && !isLoadingInitialData.value,
      fetchPolicy: "cache-and-network",
    })
  );
const userCategories = computed(
  () => userCategoriesResult.value?.recipe_categories || []
);

const { mutate: deleteRecipe } = useMutation(DELETE_RECIPE);

const handleDeleteRecipe = (recipeId: string, recipeTitle: string) => {
  recipeToDelete.value = { id: recipeId, title: recipeTitle };
  confirmationModal.value.message = `Are you sure you want to delete "${recipeTitle}"? This cannot be undone.`;
  confirmationModal.value.show = true;
};

const confirmDeletion = async () => {
  if (!recipeToDelete.value) return;
  isDeletingRecipe.value = true;
  try {
    await deleteRecipe({ id: recipeToDelete.value.id });
    toast.success("Recipe deleted successfully.");
    await refetchUserProfile();
  } catch (err: any) {
    console.error("Failed to delete recipe:", err);
    toast.error(
      err.message || "Failed to delete the recipe. Please try again."
    );
  } finally {
    isDeletingRecipe.value = false;
    cancelDeletion();
  }
};

const cancelDeletion = () => {
  confirmationModal.value.show = false;
  recipeToDelete.value = null;
};

const recipesPerPage = 6;
const currentPage = ref(1);
const totalRecipePages = computed(() =>
  Math.ceil(userRecipes.value.length / recipesPerPage)
);

const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * recipesPerPage;
  const end = start + recipesPerPage;
  return userRecipes.value.slice(start, end);
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalRecipePages.value) {
    currentPage.value = page;
  }
};

watch(userRecipes, () => {
  currentPage.value = 1;
});

const bookmarksPerPage = 6;
const currentBookmarkPage = ref(1);

const totalBookmarkPages = computed(() =>
  Math.ceil(userBookmarks.value.length / bookmarksPerPage)
);

const paginatedBookmarks = computed(() => {
  const start = (currentBookmarkPage.value - 1) * bookmarksPerPage;
  const end = start + bookmarksPerPage;
  return userBookmarks.value.slice(start, end);
});

const goToBookmarkPage = (page: number) => {
  if (page >= 1 && page <= totalBookmarkPages.value) {
    currentBookmarkPage.value = page;
  }
};

watch(userBookmarks, () => {
  currentBookmarkPage.value = 1;
});

watch(
  user,
  (newUser) => {
    if (newUser) {
      useSeoMeta({
        title: `Chef ${newUser.username}'s Profile | BiteSized`,
        description: `Discover all the culinary creations by ${newUser.username}.`,
        ogTitle: `Chef ${newUser.username}'s Profile | BiteSized`,
        ogDescription: `Discover all the culinary creations by ${newUser.username}.`,
      });
    }
  },
  { immediate: true }
);
</script>

<!-- 

 <template>
  <div
    v-if="isLoadingInitialData"
    class="flex justify-center items-center h-screen"
  >
    <UiSpinner size="lg" />
  </div>
  <div v-else-if="fetchError || !user" class="text-center py-20 px-4">
    <h1 class="text-4xl font-bold text-slate-800">Chef Not Found</h1>
    <p class="text-slate-500 mt-2">
      The user profile you are looking for does not exist or an error occurred.
    </p>
    <p v-if="fetchError" class="text-red-500 text-sm mt-2">
      Error: {{ fetchError.message }}
    </p>
    <NuxtLink to="/">
      <UiAppButton class="mt-8 cursor-pointer">Go to Homepage</UiAppButton>
    </NuxtLink>
  </div>
  <div v-else class="bg-slate-50 min-h-screen">
    <header class="relative h-56 md:h-64 bg-slate-200">
      <img
        src="https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=2832"
        :alt="`${user.username}'s cover photo`"
        class="w-full h-full object-cover"
        loading="lazy"
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
                class="px-6 py-2 bg-white cursor-pointer border border-slate-300 text-slate-700 font-semibold rounded-full hover:bg-slate-100 transition flex items-center"
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
                  totalLikesReceived
                }}</span>
              </div>
            </div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-lg font-bold mb-4 text-slate-800">Categories</h3>
            <div
              v-if="userCategoriesLoading || isLoadingInitialData"
              class="text-sm text-slate-500"
            >
              <UiSpinner class="inline-block w-4 h-4 mr-2" /> Loading
              categories...
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
                @click="setActiveTab('recipes')"
                class="py-4 px-1 text-lg font-medium border-b-2 transition-colors cursor-pointer"
                :class="
                  currentTab === 'recipes'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-slate-500 hover:text-green-600 hover:border-green-600'
                "
                aria-controls="recipes-panel"
                :aria-selected="currentTab === 'recipes'"
                role="tab"
              >
                Recipes ({{ userRecipes.length }})
              </button>
              <button
                @click="setActiveTab('bookmarks')"
                class="py-4 px-1 text-lg font-medium border-b-2 transition-colors cursor-pointer"
                :class="
                  currentTab === 'bookmarks'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-slate-500 hover:text-green-600 hover:border-green-600'
                "
                aria-controls="bookmarks-panel"
                :aria-selected="currentTab === 'bookmarks'"
                role="tab"
              >
                Bookmarks ({{ bookmarkCount }})
              </button>
              <button
                v-if="isOwnProfile"
                @click="setActiveTab('purchases')"
                class="py-4 px-1 text-lg font-medium border-b-2 transition-colors cursor-pointer"
                :class="
                  currentTab === 'purchases'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-slate-500 hover:text-green-600 hover:border-green-600'
                "
                aria-controls="purchases-panel"
                :aria-selected="currentTab === 'purchases'"
                role="tab"
              >
                Purchase History ({{ purchaseCount }})
              </button>
            </nav>
          </div>

          <div
            v-if="currentTab === 'recipes'"
            id="recipes-panel"
            role="tabpanel"
          >
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-slate-800">My Recipes</h2>
              <NuxtLink v-if="isOwnProfile" to="/create-recipe">
                <UiAppButton class="cursor-pointer hover:bg-green-600">
                  <Icon name="ph:plus-circle" class="mr-2" /> Add New Recipe
                </UiAppButton>
              </NuxtLink>
            </div>
            <div
              v-if="userRecipes.length === 0"
              class="text-center py-12 text-slate-500 rounded-lg bg-white border"
            >
              You have not published any recipes yet.
            </div>
            <div v-else>
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div
                  v-for="recipe in paginatedRecipes"
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
                        class="p-2 rounded-full cursor-pointer shadow-md transition bg-white hover:bg-slate-100"
                        aria-label="Edit Recipe"
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
                      aria-label="Delete Recipe"
                    >
                      <Icon name="ph:trash-simple" class="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
              <div
                v-if="totalRecipePages > 1"
                class="flex justify-center mt-8 space-x-2"
              >
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-4 py-2 bg-white border rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page of recipes"
                >
                  Previous
                </button>
                <span class="px-4 py-2 text-slate-700"
                  >Page {{ currentPage }} of {{ totalRecipePages }}</span
                >
                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalRecipePages"
                  class="px-4 py-2 bg-white border rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page of recipes"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="currentTab === 'bookmarks'"
            id="bookmarks-panel"
            role="tabpanel"
          >
            <h2 class="text-2xl font-bold text-slate-800 mb-6">
              Bookmarked Recipes
            </h2>
            <div
              v-if="userBookmarks.length === 0"
              class="text-center py-12 text-slate-500 rounded-lg bg-white border"
            >
              No bookmarked recipes found.
            </div>
            <div
              v-else
              class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <RecipeCard
                v-for="bookmark in paginatedBookmarks"
                :key="bookmark.recipe.id"
                :recipe="bookmark.recipe"
              />
            </div>
            <div
              v-if="totalBookmarkPages > 1"
              class="flex justify-center mt-8 space-x-2"
            >
              <button
                @click="goToBookmarkPage(currentBookmarkPage - 1)"
                :disabled="currentBookmarkPage === 1"
                class="px-4 py-2 bg-white border rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page of bookmarks"
              >
                Previous
              </button>
              <span class="px-4 py-2 text-slate-700"
                >Page {{ currentBookmarkPage }} of
                {{ totalBookmarkPages }}</span
              >
              <button
                @click="goToBookmarkPage(currentBookmarkPage + 1)"
                :disabled="currentBookmarkPage === totalBookmarkPages"
                class="px-4 py-2 bg-white border rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page of bookmarks"
              >
                Next
              </button>
            </div>
          </div>

          <div
            v-if="currentTab === 'purchases'"
            id="purchases-panel"
            role="tabpanel"
          >
            <h2 class="text-2xl font-bold text-slate-800 mb-6">
              My Purchase History
            </h2>

            <div
              v-if="purchaseHistoryLoading && paginatedPurchases.length === 0"
              class="text-center py-12 text-slate-500"
            >
              <UiSpinner /> Loading purchase history...
            </div>
            <div
              v-else-if="purchaseHistoryError"
              class="text-center py-12 text-red-500 rounded-lg bg-white border"
            >
              <p>Could not load purchase history. Please try again.</p>
              <p class="text-sm mt-2">{{ purchaseHistoryError.message }}</p>
            </div>
            <div
              v-else-if="
                paginatedPurchases.length === 0 && !purchaseHistoryLoading
              "
              class="text-center py-12 text-slate-500 rounded-lg bg-white border"
            >
              You have not purchased any recipes yet.
            </div>
            <div
              v-else-if="paginatedPurchases.length > 0"
              class="bg-white rounded-lg shadow-sm border overflow-x-auto"
            >
              <table class="w-full text-left text-sm text-slate-600">
                <thead class="bg-slate-50 text-xs text-slate-700 uppercase">
                  <tr>
                    <th scope="col" class="px-6 py-3">Recipe Title</th>
                    <th scope="col" class="px-6 py-3">Creator</th>
                    <th scope="col" class="px-6 py-3">Date</th>
                    <th scope="col" class="px-6 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="purchase in paginatedPurchases"
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
                      <NuxtLink
                        :to="`/profile/${purchase.recipe.user.username}`"
                        class="hover:underline text-slate-700"
                      >
                        @{{ purchase.recipe.user.username }}
                      </NuxtLink>
                    </td>
                    <td class="px-6 py-4">
                      {{ formatDate(purchase.purchased_at) }}
                    </td>
                    <td class="px-6 py-4 font-bold text-right text-slate-800">
                      {{
                        formatCurrency(purchase.amount_paid, purchase.currency)
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              v-if="totalPurchasePages > 1"
              class="flex justify-center mt-8 space-x-2"
            >
              <button
                @click="goToPurchasePage(currentPurchasePage - 1)"
                :disabled="currentPurchasePage === 1 || purchaseHistoryLoading"
                class="px-4 py-2 bg-white border rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page of purchase history"
              >
                Previous
              </button>
              <span class="px-4 py-2 text-slate-700"
                >Page {{ currentPurchasePage }} of
                {{ totalPurchasePages }}</span
              >
              <button
                @click="goToPurchasePage(currentPurchasePage + 1)"
                :disabled="
                  currentPurchasePage === totalPurchasePages ||
                  purchaseHistoryLoading
                "
                class="px-4 py-2 bg-white border rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page of purchase history"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>

    <ConfirmationModal
      :show="confirmationModal.show"
      :title="confirmationModal.title"
      :message="confirmationModal.message"
      confirm-button-text="Delete"
      cancel-button-text="Cancel"
      :loading="isDeletingRecipe"
      @confirm="confirmDeletion"
      @cancel="cancelDeletion"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
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
const router = useRouter();
const auth = useAuthStore();
const toast = useToast();

const username = computed(() => route.params.username as string);

type ProfileTab = "recipes" | "bookmarks" | "purchases";
const currentTab = ref<ProfileTab>(
  (route.query.tab as ProfileTab) || "recipes"
);

const setActiveTab = (tab: ProfileTab) => {
  if (currentTab.value !== tab) {
    currentTab.value = tab;
    if (tab === "purchases") {
      currentPurchasePage.value = 1;
      if (isOwnProfile.value && auth.user?.id) {
        refetchPurchaseHistory();
      }
    } else if (tab === "bookmarks") {
      currentBookmarkPage.value = 1;
    } else if (tab === "recipes") {
      currentPage.value = 1;
    }
    router.push({ query: { tab } });
  }
};

watch(
  () => route.query.tab,
  (newTab) => {
    if (
      newTab &&
      ["recipes", "bookmarks", "purchases"].includes(newTab as string)
    ) {
      currentTab.value = newTab as ProfileTab;
    } else if (!newTab) {
      currentTab.value = "recipes";
    }
  }
);

const confirmationModal = ref({
  show: false,
  title: "Confirm Deletion",
  message: "",
});
const recipeToDelete = ref<{ id: string; title: string } | null>(null);
const isDeletingRecipe = ref(false);

const {
  result,
  loading: initialDataLoading,
  error: fetchError,
  refetch: refetchUserProfile,
} = useQuery(GET_USER_PROFILE_DATA, () => ({ username: username.value }), {
  fetchPolicy: "cache-and-network",
});

const user = computed(() => result.value?.users[0]);
const isOwnProfile = computed(
  () => auth.isAuthenticated && auth.user?.id === user.value?.id
);
const isLoadingInitialData = computed(
  () => initialDataLoading.value && !user.value
);

const userRecipes = computed(() => user.value?.recipes || []);
const userBookmarks = computed(() => user.value?.user_bookmarks || []);

const totalLikesReceived = computed(
  () => user.value?.recipes_aggregate.aggregate?.sum?.total_likes || 0
);
const bookmarkCount = computed(() => userBookmarks.value.length);

const { result: userCategoriesResult, loading: userCategoriesLoading } =
  useQuery(
    GET_USER_UNIQUE_CATEGORIES,
    () => ({ userId: user.value?.id }),
    () => ({
      enabled: !!user.value?.id && !isLoadingInitialData.value,
      fetchPolicy: "cache-and-network",
    })
  );
const userCategories = computed(
  () => userCategoriesResult.value?.recipe_categories || []
);

const purchasesPerPage = 10;
const currentPurchasePage = ref(1);

const purchaseOffset = computed(
  () => (currentPurchasePage.value - 1) * purchasesPerPage
);

const isPurchaseQueryEnabled = computed(() => {
  return (
    isOwnProfile.value && currentTab.value === "purchases" && !!auth.user?.id
  );
});

const {
  result: purchaseHistoryResult,
  loading: purchaseHistoryLoading,
  error: purchaseHistoryError,
  refetch: refetchPurchaseHistory,

  variables: purchaseHistoryVariables,
} = useQuery(
  GET_USER_PURCHASE_HISTORY,
  computed(() => ({
    userId: auth.user?.id,
    limit: purchasesPerPage,
    offset: purchaseOffset.value,
  })),
  {
    enabled: isPurchaseQueryEnabled,
    fetchPolicy: "network-only",
  }
);

const paginatedPurchases = computed(
  () => purchaseHistoryResult.value?.user_purchased_recipes || []
);

const purchaseCount = computed(
  () =>
    purchaseHistoryResult.value?.user_purchased_recipes_aggregate?.aggregate
      ?.count || 0
);

const totalPurchasePages = computed(() =>
  Math.ceil(purchaseCount.value / purchasesPerPage)
);

const goToPurchasePage = (page: number) => {
  if (page >= 1 && page <= totalPurchasePages.value) {
    currentPurchasePage.value = page;
  }
};

watch(
  [currentTab, currentPurchasePage],
  ([newTab, newPage], [oldTab, oldPage]) => {
    if (newTab === "purchases" && isPurchaseQueryEnabled.value) {
      if (newTab !== oldTab) {
        currentPurchasePage.value = 1;
      } else if (newPage !== oldPage) {
        refetchPurchaseHistory();
      }
    }
  }
);

watch(
  () => auth.user?.id,
  (newUserId, oldUserId) => {
    if (
      newUserId &&
      newUserId !== oldUserId &&
      currentTab.value === "purchases"
    ) {
      currentPurchasePage.value = 1;
      refetchPurchaseHistory();
    }
  },
  { immediate: true }
);

const { mutate: deleteRecipe } = useMutation(DELETE_RECIPE);

const handleDeleteRecipe = (recipeId: string, recipeTitle: string) => {
  recipeToDelete.value = { id: recipeId, title: recipeTitle };
  confirmationModal.value.message = `Are you sure you want to delete "${recipeTitle}"? This cannot be undone.`;
  confirmationModal.value.show = true;
};

const confirmDeletion = async () => {
  if (!recipeToDelete.value) return;
  isDeletingRecipe.value = true;
  try {
    await deleteRecipe({ id: recipeToDelete.value.id });
    toast.success("Recipe deleted successfully.");
    await refetchUserProfile();
    if (currentTab.value === "purchases" && isOwnProfile.value) {
      await refetchPurchaseHistory();
    }
  } catch (err: any) {
    console.error("Failed to delete recipe:", err);
    toast.error(
      err.message || "Failed to delete the recipe. Please try again."
    );
  } finally {
    isDeletingRecipe.value = false;
    cancelDeletion();
  }
};

const cancelDeletion = () => {
  confirmationModal.value.show = false;
  recipeToDelete.value = null;
};

const recipesPerPage = 6;
const currentPage = ref(1);
const totalRecipePages = computed(() =>
  Math.ceil(userRecipes.value.length / recipesPerPage)
);

const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * recipesPerPage;
  const end = start + recipesPerPage;
  return userRecipes.value.slice(start, end);
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalRecipePages.value) {
    currentPage.value = page;
  }
};

watch(userRecipes, () => {
  currentPage.value = 1;
});

const bookmarksPerPage = 6;
const currentBookmarkPage = ref(1);

const totalBookmarkPages = computed(() =>
  Math.ceil(userBookmarks.value.length / bookmarksPerPage)
);

const paginatedBookmarks = computed(() => {
  const start = (currentBookmarkPage.value - 1) * bookmarksPerPage;
  const end = start + bookmarksPerPage;
  return userBookmarks.value.slice(start, end);
});

const goToBookmarkPage = (page: number) => {
  if (page >= 1 && page <= totalBookmarkPages.value) {
    currentBookmarkPage.value = page;
  }
};

watch(userBookmarks, () => {
  currentBookmarkPage.value = 1;
});

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

const formatCurrency = (amount: number, currency: string = "ETB") => {
  if (typeof amount !== "number" || isNaN(amount)) return `0.00 ${currency}`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  }).format(amount);
};

watch(
  user,
  (newUser) => {
    if (newUser) {
      useSeoMeta({
        title: `Chef ${newUser.username}'s Profile | BiteSized`,
        description: `Discover all the culinary creations by ${newUser.username}.`,
        ogTitle: `Chef ${newUser.username}'s Profile | BiteSized`,
        ogDescription: `Discover all the culinary creations by ${newUser.username}.`,
      });
    }
  },
  { immediate: true }
);
</script>
-->
--> -->
