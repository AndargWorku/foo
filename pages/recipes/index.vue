<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-slate-800">All Recipes</h1>
      <div class="flex items-center space-x-2">
        <form @submit.prevent="handleSearch" class="relative">
          <Icon
            name="ph:magnifying-glass"
            class="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search recipes..."
            class="pl-10 pr-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
        </form>
        <button
          @click="isFilterModalOpen = true"
          class="p-2 bg-white border border-slate-300 cursor-pointer rounded-full shadow-sm hover:bg-slate-100 transition"
        >
          <Icon name="ph:sliders-horizontal" class="w-6 h-6 text-slate-700" />
        </button>
      </div>
    </div>

    <div
      v-if="hasActiveFilters"
      class="border-b border-slate-200 bg-white py-4 mb-6 -mx-4 px-4"
    >
      <div class="mx-auto flex container flex-wrap items-center gap-2">
        <span class="text-sm font-medium text-slate-700">Active Filters:</span>

        <!-- Title Filter -->
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

    <div v-if="recipesLoading" class="flex justify-center py-10">
      <UiSpinner size="lg" />
    </div>
    <div v-else-if="recipesError" class="text-red-500 text-center py-10">
      Error loading recipes: {{ recipesError.message }}
    </div>
    <div v-else-if="!recipes.length" class="text-center text-slate-500 py-10">
      <p>No recipes found matching your criteria.</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
    </div>

    <!-- TODO: Add pagination here -->

    <FilterModal
      :is-open="isFilterModalOpen"
      @close="isFilterModalOpen = false"
      @apply-filters="handleApplyFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import { GET_RECIPES } from "~/lib/graphql";
import { useRecipeFilters } from "~/composables/useRecipeFilters";
const router = useRouter();
const route = useRoute();

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
  result: recipesResult,
  loading: recipesLoading,
  error: recipesError,
  refetch,
} = useQuery(
  GET_RECIPES,
  () => ({
    ...queryVariables.value,
    limit: 10,
    offset: 0,
    orderBy: { created_at: "desc" },
  }),
  { debounce: 300 }
);
const recipes = computed(() => recipesResult.value?.recipes || []);

watch(
  () => currentFilters.value,
  () => {
    refetch();
  },
  { deep: true, immediate: true }
);
</script>
