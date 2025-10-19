<template>
  <NuxtLink
    :to="`/recipe/${recipe.id}`"
    class="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
  >
    <div class="relative h-56 w-full">
      <div v-if="imageUrl" class="h-full w-full">
        <img
          :src="imageUrl"
          :alt="`Image of ${recipe.title}`"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
        ></div>
        <div
          class="absolute bottom-3 left-3 flex items-center space-x-3 text-xs text-white"
        >
          <div class="flex items-center">
            <Icon name="ph:star-fill" class="mr-1 text-yellow-400" />
            <span>{{
              recipe.average_rating ? recipe.average_rating.toFixed(1) : "New"
            }}</span>
          </div>
          <div class="flex items-center">
            <Icon name="ph:heart-fill" class="mr-1 text-red-400" />
            <span>{{ recipe.total_likes || 0 }}</span>
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex h-full w-full items-center justify-center bg-slate-100"
      >
        <Icon name="ph:image" class="h-16 w-16 text-slate-300" />
      </div>
    </div>

    <div class="p-4">
      <span
        v-if="recipe.recipe_categories?.[0]?.category?.name"
        class="text-xs font-semibold uppercase text-green-600"
      >
        {{ recipe.recipe_categories[0].category.name }}
      </span>
      <h3
        class="mt-1 truncate text-lg font-bold text-slate-800 transition-colors group-hover:text-green-700"
      >
        {{ recipe.title }}
      </h3>
      <div
        v-if="recipe.user?.username"
        class="mt-2 flex items-center text-sm text-slate-500"
      >
        <span class="truncate">By {{ recipe.user.username }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface RecipeCardData {
  id: string;
  title: string;
  featured_image_url?: string | null;
  average_rating?: number | null;
  total_likes?: number;
  user?: {
    username: string;
  } | null;
  recipe_categories?: {
    category: {
      name: string;
    };
  }[];
}

const props = defineProps<{
  recipe: RecipeCardData;
}>();

const imageUrl = computed(() => {
  return props.recipe?.featured_image_url || null;
});
</script>
