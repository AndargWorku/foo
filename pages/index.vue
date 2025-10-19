<template>
  <div>
    <div
      class="relative overflow-hidden bg-slate-50 px-4 py-20 text-center text-slate-800"
    >
      <div class="absolute inset-0">
        <img
          :src="background"
          alt="Hero Background"
          class="h-full w-full object-cover opacity-20"
        />
      </div>
      <div class="relative z-10 mx-auto container">
        <h1 class="text-5xl font-extrabold md:text-6xl">
          Unlock Culinary Delights
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Discover and share thousands of community curated recipes from around
          the world.
        </p>

        <div class="mx-auto mt-8 flex max-w-2xl items-center space-x-2">
          <form @submit.prevent="handleSearch" class="relative flex-grow">
            <Icon
              name="ph:magnifying-glass"
              class="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400"
            />
            <input
              v-model="searchTerm"
              type="search"
              placeholder="Search for recipes..."
              class="w-full rounded-full border border-slate-300 py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </form>
          <button
            @click="isFilterModalOpen = true"
            class="rounded-full border border-slate-300 bg-white p-4 shadow-sm transition hover:bg-slate-100 cursor-pointer"
          >
            <Icon name="ph:sliders-horizontal" class="h-6 w-6 text-slate-700" />
          </button>
        </div>

        <div class="mt-8 flex justify-center space-x-4">
          <NuxtLink to="/recipes">
            <UiAppButton variant="primary" size="lg" class="cursor-pointer"
              >Browse All Recipes</UiAppButton
            >
          </NuxtLink>
          <NuxtLink to="/create-recipe">
            <UiAppButton variant="secondary" size="lg" class="cursor-pointer"
              >Share Your Recipe</UiAppButton
            >
          </NuxtLink>
        </div>
      </div>
    </div>

    <div
      v-if="hasActiveFilters"
      class="border-b border-slate-200 bg-white py-4"
    >
      <div class="mx-auto flex container flex-wrap items-center gap-2 px-4">
        <span class="text-sm font-medium text-slate-700">Active Filters:</span>

        <span
          v-if="currentFilters.title"
          class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
        >
          Title: "{{ currentFilters.title }}"
          <button
            @click="clearFilter('title')"
            class="-mr-1 ml-1 text-green-500 hover:text-green-700"
          >
            <Icon name="ph:x" class="h-3 w-3" />
          </button>
        </span>

        <span
          v-if="currentFilters.creatorId"
          class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
        >
          Creator: {{ getCreatorUsername(currentFilters.creatorId) }}
          <button
            @click="clearFilter('creatorId')"
            class="-mr-1 ml-1 text-green-500 hover:text-green-700"
          >
            <Icon name="ph:x" class="h-3 w-3" />
          </button>
        </span>

        <span
          v-if="currentFilters.categoryIds?.length > 0"
          class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
        >
          Categories:
          {{ getCategoryNames(currentFilters.categoryIds).join(", ") }}
          <button
            @click="clearFilter('categoryIds')"
            class="-mr-1 ml-1 text-green-500 hover:text-green-700"
          >
            <Icon name="ph:x" class="h-3 w-3" />
          </button>
        </span>

        <span
          v-if="currentFilters.prepTime"
          class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
        >
          Prep Time: {{ getPrepTimeLabel(currentFilters.prepTime) }}
          <button
            @click="clearFilter('prepTime')"
            class="-mr-1 ml-1 text-green-500 hover:text-green-700"
          >
            <Icon name="ph:x" class="h-3 w-3" />
          </button>
        </span>

        <span
          v-if="currentFilters.ingredients?.length > 0"
          class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
        >
          Ingredients: {{ currentFilters.ingredients.join(", ") }}
          <button
            @click="clearFilter('ingredients')"
            class="-mr-1 ml-1 text-green-500 hover:text-green-700"
          >
            <Icon name="ph:x" class="h-3 w-3" />
          </button>
        </span>

        <button
          v-if="hasActiveFilters"
          @click="handleClearFilters"
          class="ml-2 font-medium text-red-600 hover:text-red-800"
        >
          Clear All
        </button>
      </div>
    </div>
    <div class="border-y border-slate-200 bg-white">
      <div
        class="mx-auto grid grid-cols-1 gap-8 px-4 py-6 text-center container md:grid-cols-3"
      >
        <NuxtLink
          to="/recipes"
          class="flex flex-col items-center justify-center rounded-lg bg-white p-6 text-slate-600 shadow-sm transition hover:shadow-lg md:space-x-3"
        >
          <Icon
            name="ph:bowl-food"
            class="mb-2 h-8 w-8 text-green-500 md:mb-0"
          />
          <span class="font-medium">All Recipes</span>
        </NuxtLink>
        <NuxtLink
          to="/creators"
          class="flex flex-col items-center justify-center rounded-lg bg-white p-6 text-slate-600 shadow-sm transition hover:shadow-lg md:space-x-3"
        >
          <Icon
            name="ph:users-three"
            class="mb-2 h-8 w-8 text-green-500 md:mb-0"
          />
          <span class="font-medium">Browse by Creator</span>
        </NuxtLink>

        <a
          href="#"
          @click.prevent="handleProfileClick"
          class="flex flex-col items-center justify-center rounded-lg bg-white p-6 text-slate-600 shadow-sm transition hover:shadow-lg md:space-x-3"
        >
          <Icon
            name="ph:user-circle"
            class="mb-2 h-8 w-8 text-green-500 md:mb-0"
          />
          <span class="font-medium">My Profile</span>
        </a>
      </div>
    </div>

    <div class="mx-auto px-4 py-16 container">
      <h2 class="mb-10 text-center text-3xl font-bold">Browse Categories</h2>

      <div v-if="categoriesLoading" class="flex justify-center">
        <UiSpinner />
      </div>
      <div v-else-if="categoriesError" class="text-center text-red-500">
        Could not load categories.
      </div>

      <div
        v-else
        class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      >
        <button
          v-for="category in groupedCategories"
          :key="category.id"
          @click="filterByCategory(category)"
          class="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
        >
          <div
            class="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
          >
            <Icon
              :name="getCategoryIcon(category.name)"
              class="h-8 w-8 text-green-600"
            />
          </div>
          <span class="text-center font-semibold text-slate-700">{{
            category.name
          }}</span>
        </button>
      </div>
    </div>

    <div class="bg-slate-50 py-16">
      <div class="mx-auto px-4 container">
        <h2 class="mb-10 text-center text-3xl font-bold">
          {{ hasActiveFilters ? "Filtered Recipes" : "Latest Recipes" }}
        </h2>

        <div v-if="recipesLoading" class="flex justify-center">
          <UiSpinner size="lg" />
        </div>
        <div v-else-if="recipesError" class="text-center text-red-500">
          Could not load recipes: {{ recipesError.message }}
        </div>
        <div
          v-else-if="!filteredRecipes.length"
          class="text-center text-slate-500"
        >
          <p>No recipes found matching your criteria.</p>
        </div>
        <div
          v-else
          class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <RecipeCard
            v-for="recipe in filteredRecipes"
            :key="recipe.id"
            :recipe="recipe"
          />
        </div>
      </div>
    </div>

    <FilterModal
      :is-open="isFilterModalOpen"
      @close="isFilterModalOpen = false"
      @apply-filters="handleApplyFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import { useRouter, useRoute } from "vue-router";
import background from "@/assets/images/background.jpg";
import { GET_RECIPES, GET_ALL_CATEGORIES_WITH_COUNT } from "~/lib/graphql";
import { useRecipeFilters } from "~/composables/useRecipeFilters";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const {
  isFilterModalOpen,
  searchTerm,
  currentFilters,
  hasActiveFilters,
  queryVariables,
  handleApplyFilters,
  handleSearch,
  clearFilter,
  handleClearFilters,
  getCreatorUsername,
  getCategoryNames,
  getPrepTimeLabel,
} = useRecipeFilters();

const {
  result: categoriesResult,
  loading: categoriesLoading,
  error: categoriesError,
} = useQuery(GET_ALL_CATEGORIES_WITH_COUNT);

const allCategories = computed(
  () =>
    categoriesResult.value?.categories.map((cat) => ({
      ...cat,
      recipesCount: cat.recipes_aggregate?.aggregate?.count || 0,
    })) || []
);

const PREDEFINED_CATEGORIES_NAMES = [
  "breakfast",
  "dessert",
  "dinner",
  "fast food",
  "lunch",
];

const groupedCategories = computed(() => {
  const predefined = [];
  const othersIds: number[] = [];
  let othersCount = 0;

  allCategories.value.forEach((category) => {
    const lowerName = category.name.toLowerCase();
    const isPredefined = PREDEFINED_CATEGORIES_NAMES.some((pcName) =>
      lowerName.includes(pcName)
    );

    if (isPredefined) {
      predefined.push(category);
    } else {
      othersIds.push(category.id);
      othersCount += category.recipesCount;
    }
  });

  const othersCategory = {
    id: "others-group",
    name: "Others",
    slug: "others",
    recipesCount: othersCount,

    ids: othersIds,
  };

  if (othersIds.length > 0) {
    return [...predefined, othersCategory];
  }
  return predefined;
});

const filterByCategory = (category: {
  id: number | string;
  slug: string;
  ids?: number[];
}) => {
  let categoryIdsToFilter: number[] = [];

  if (category.id === "others-group" && category.ids) {
    categoryIdsToFilter = category.ids;
  } else if (typeof category.id === "number") {
    categoryIdsToFilter = [category.id];
  }

  const newCategoryIds = [
    ...new Set([...currentFilters.value.categoryIds, ...categoryIdsToFilter]),
  ];

  handleApplyFilters({
    categoryIds: newCategoryIds.join(","),
    categorySlug: category.slug,
  });
};

watch(
  () => route.query.categorySlug,
  (slug) => {
    if (slug) {
      const category = allCategories.value.find((c) => c.slug === slug);
      let idsToApply: number[] = [];

      if (category) {
        idsToApply = [category.id];
      } else if (slug === "others") {
        const othersGroup = groupedCategories.value.find(
          (c) => c.slug === "others"
        );
        if (othersGroup && othersGroup.ids) {
          idsToApply = othersGroup.ids;
        }
      }

      if (idsToApply.length > 0) {
        const newCategoryIds = [
          ...new Set([...currentFilters.value.categoryIds, ...idsToApply]),
        ];
        if (
          newCategoryIds.join(",") !==
          currentFilters.value.categoryIds.join(",")
        ) {
          handleApplyFilters({
            categoryIds: newCategoryIds.join(","),
            categorySlug: slug,
          });
        }
      }
    } else {
      if (
        currentFilters.value.categoryIds.length > 0 &&
        route.query.categoryIds
      ) {
        handleApplyFilters({ categoryIds: undefined, categorySlug: undefined });
      } else if (
        currentFilters.value.categoryIds.length === 0 &&
        route.query.categoryIds
      ) {
        handleApplyFilters({ categoryIds: undefined });
      }
    }
  },
  { immediate: true }
);

const recipeQueryVariables = computed(() => {
  const baseVariables = queryVariables.value;

  if (hasActiveFilters.value) {
    return {
      ...baseVariables,
      orderBy: [{ created_at: "desc" }],
    };
  } else {
    return {
      ...baseVariables,
      limit: 6,
      orderBy: [{ created_at: "desc" }],
    };
  }
});

const {
  result: recipesResult,
  loading: recipesLoading,
  error: recipesError,
  refetch,
} = useQuery(GET_RECIPES, recipeQueryVariables, { debounce: 300 });
const filteredRecipes = computed(() => recipesResult.value?.recipes || []);

watch(
  () => currentFilters.value,
  () => {
    refetch();
  },
  { deep: true }
);

const handleProfileClick = () => {
  if (auth.isAuthenticated && auth.user?.username) {
    router.push(`/users/${auth.user.username}`);
  } else {
    router.push({
      path: "/login",
      query: { redirect: "/" },
    });
  }
};

const getCategoryIcon = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes("dessert") || lower.includes("baking")) return "ph:cake";
  if (lower.includes("breakfast")) return "ph:coffee";
  if (lower.includes("dinner")) return "ph:bowl-food";
  if (lower.includes("lunch")) return "ph:bag-simple";
  if (lower.includes("fast food")) return "ph:hamburger";
  if (lower === "others") return "ph:dots-three-outline";
  if (lower.includes("vegan")) return "ph:leaf";
  if (lower.includes("vegetarian")) return "ph:plant";
  if (lower.includes("soup")) return "ph:soup";
  if (lower.includes("salad")) return "ph:salad";
  if (lower.includes("drink")) return "ph:cup";
  if (lower.includes("pasta")) return "ph:spaghetti";

  return "ph:fork-knife";
};
</script>
