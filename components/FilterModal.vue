<!-- FilterModal.vue -->
<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-sm transform rounded-2xl bg-white p-6 shadow-xl transition-all"
      >
        <div
          class="mb-4 flex items-center justify-between border-b border-slate-200 pb-3"
        >
          <h2 class="text-xl font-bold text-slate-800">Filter Recipes</h2>
          <button
            @click="closeModal"
            class="rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <Icon name="ph:x-bold" class="h-5 w-5" />
          </button>
        </div>

        <div class="max-h-[70vh] space-y-5 overflow-y-auto pr-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700"
              >Recipe Title</label
            >
            <UiAppInput
              v-model="filters.title"
              placeholder="e.g., 'Spicy Chicken Curry'"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700"
              >Browse by Creator</label
            >
            <select
              v-model="filters.creatorId"
              class="w-full rounded-md border border-zinc-300 cursor-pointer px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Creators</option>
              <option
                v-for="creator in creators"
                :key="creator.id"
                :value="creator.id"
              >
                {{ creator.username }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700"
              >Max Preparation Time ({{ displayPrepTime }} min)</label
            >
            <input
              v-model.number="filters.prepTimeSliderValue"
              type="range"
              min="0"
              :max="MAX_PREP_TIME_SLIDER_VALUE"
              step="5"
              class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-green-500"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700"
              >Contains Ingredients</label
            >
            <select
              multiple
              v-model="filters.ingredientNames"
              class="h-32 w-full rounded-md border cursor-pointer border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option
                v-for="ingredient in ingredients"
                :key="ingredient.id"
                :value="ingredient.name"
              >
                {{ ingredient.name }}
              </option>
            </select>
            <p class="mt-1 text-xs text-slate-500">
              Hold Ctrl/Cmd to select multiple.
            </p>
          </div>

          <div class="cursor-pointer">
            <label class="mb-1 block text-sm font-medium text-slate-700"
              >Categories</label
            >
            <div
              class="max-h-32 space-y-2 overflow-y-auto rounded-md border p-3"
            >
              <div
                v-for="category in categories"
                :key="category.id"
                class="flex items-center"
              >
                <input
                  :id="`cat-${category.id}`"
                  v-model="filters.categoryIds"
                  type="checkbox"
                  :value="category.id"
                  class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label
                  :for="`cat-${category.id}`"
                  class="ml-2 text-sm text-slate-600"
                >
                  {{ category.name }} ({{
                    category.recipes_aggregate?.aggregate?.count || 0
                  }})
                </label>
              </div>
            </div>
          </div>
        </div>

        <div
          class="mt-6 flex items-center justify-end space-x-3 border-t border-slate-200 pt-4"
        >
          <UiAppButton
            type="button"
            variant="secondary"
            @click="resetFilters"
            class="cursor-pointer"
            >Reset</UiAppButton
          >
          <UiAppButton
            type="button"
            @click="applyFilters"
            class="cursor-pointer"
            >Apply Filters</UiAppButton
          >
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import {
  GET_ALL_CATEGORIES_WITH_COUNT,
  GET_ALL_CREATORS,
  GET_ALL_INGREDIENTS,
} from "~/lib/graphql";
import { PREP_TIME_RANGES } from "~/composables/useRecipeFilters";

const MAX_PREP_TIME_SLIDER_VALUE = 180;
const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close", "apply-filters"]);

const route = useRoute();

const { result: categoriesResult } = useQuery(GET_ALL_CATEGORIES_WITH_COUNT);
const categories = computed(() => categoriesResult.value?.categories || []);

const { result: creatorsResult } = useQuery(GET_ALL_CREATORS);
const creators = computed(() => creatorsResult.value?.users || []);

const { result: ingredientsResult } = useQuery(GET_ALL_INGREDIENTS);
const ingredients = computed(() => ingredientsResult.value?.ingredients || []);

const defaultFilters = {
  title: "",
  creatorId: "",
  prepTimeSliderValue: MAX_PREP_TIME_SLIDER_VALUE,
  categoryIds: [] as number[],
  ingredientNames: [] as string[],
};
const filters = ref({ ...defaultFilters });

const displayPrepTime = computed(() => {
  return filters.value.prepTimeSliderValue >= MAX_PREP_TIME_SLIDER_VALUE
    ? "Any"
    : filters.value.prepTimeSliderValue;
});

watch(
  () => props.isOpen,
  (isNowOpen) => {
    if (isNowOpen) {
      filters.value.title = (route.query.title as string) || "";
      filters.value.creatorId = (route.query.creatorId as string) || "";

      const routePrepTime = route.query.prepTime as string | undefined;
      if (routePrepTime) {
        const range = PREP_TIME_RANGES.find((r) => r.value === routePrepTime);
        filters.value.prepTimeSliderValue = range
          ? range.max
          : MAX_PREP_TIME_SLIDER_VALUE;
      } else {
        filters.value.prepTimeSliderValue = MAX_PREP_TIME_SLIDER_VALUE; // Default to 'Any Time'
      }

      filters.value.categoryIds = route.query.categoryIds
        ? (route.query.categoryIds as string).split(",").map(Number)
        : [];
      filters.value.ingredientNames = route.query.ingredients
        ? (route.query.ingredients as string).split(",")
        : [];
    }
  },
  { immediate: true }
);

const closeModal = () => emit("close");

const resetFilters = () => {
  Object.assign(filters.value, defaultFilters);

  emit("apply-filters", {});
  closeModal();
};

const applyFilters = () => {
  const query: Record<string, any> = {};

  if (filters.value.title) query.title = filters.value.title;
  if (filters.value.creatorId) query.creatorId = filters.value.creatorId;

  if (filters.value.prepTimeSliderValue < MAX_PREP_TIME_SLIDER_VALUE) {
    const selectedRange = PREP_TIME_RANGES.slice(1).find(
      (range) => filters.value.prepTimeSliderValue <= range.max
    );

    if (selectedRange) {
      query.prepTime = selectedRange.value;
    }
  }

  if (filters.value.categoryIds.length > 0)
    query.categoryIds = filters.value.categoryIds.join(",");
  if (filters.value.ingredientNames.length > 0)
    query.ingredients = filters.value.ingredientNames.join(",");

  emit("apply-filters", query);
  closeModal();
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .transform,
.modal-leave-active .transform {
  transition: transform 0.3s ease;
}
.modal-enter-from .transform,
.modal-leave-to .transform {
  transform: scale(0.95);
}
</style>
