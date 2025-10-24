<template>
  <div class="min-h-screen bg-[#f9f5ef] font-serif">
    <main class="container mx-auto px-4 py-8">
      <h1 class="mb-10 text-center text-4xl font-bold text-slate-800">
        Edit Your Recipe
      </h1>

      <div v-if="loading" class="text-center">
        <UiSpinner large />
        <p class="mt-4 text-slate-500">Loading recipe details...</p>
      </div>

      <div v-else-if="error || !recipeData" class="text-center">
        <p class="text-red-600 font-semibold">
          Could not load recipe for editing.
        </p>
        <p class="mt-2 text-slate-500">
          It may not exist, or you may not have permission to edit it.
        </p>
        <NuxtLink
          to="/"
          class="mt-6 inline-block rounded-full bg-green-600 px-6 py-2 font-bold text-white transition hover:bg-green-700"
        >
          Go to Homepage
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div
          class="rounded-xl border border-slate-200 bg-white p-8 shadow-md lg:col-span-3"
        >
          <RecipeForm
            @submit="handleUpdate"
            :is-loading="isUpdating"
            :initial-data="initialDataForForm"
            :existing-images="recipeData.recipe_images"
          />
        </div>

        <aside
          class="rounded-xl border border-slate-200 bg-white p-8 shadow-md lg:col-span-2"
        >
          <h2 class="mb-4 text-xl font-bold text-slate-700">Editing Tips</h2>
          <ul class="list-disc space-y-2 pl-5 text-slate-500">
            <li>Review your steps for clarity.</li>
            <li>Double-check ingredient measurements.</li>
            <li>
              You can replace images by removing the old ones and adding new
              ones.
            </li>
            <li>Changes are saved only after you click "Update Recipe".</li>
          </ul>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useToast } from "vue-toastification"; // 1. Import useToast
import { useImageUpload } from "~/composables/useImageUpload";
import {
  GET_RECIPE_DETAILS,
  UPDATE_RECIPE,
  FIND_OR_CREATE_CATEGORY,
  FIND_OR_CREATE_INGREDIENT,
} from "~/lib/graphql";
import { useAuthStore } from "~/store/auth";
import type { RecipeDetail } from "~/types";

definePageMeta({ middleware: "auth" });

const route = useRoute();
const router = useRouter();
const toast = useToast();
const recipeId = route.params.id as string;
const { uploadImage } = useImageUpload();
const isUpdating = ref(false);

const authStore = useAuthStore();
const currentUserId = computed(() => authStore.user?.id);

const { result, loading, error } = useQuery(
  GET_RECIPE_DETAILS,
  { id: recipeId, user_id: currentUserId.value, isLoggedIn: true },
  { enabled: !!currentUserId.value, fetchPolicy: "cache-and-network" }
);

const recipeData = computed<RecipeDetail | null>(() => {
  if (result.value?.recipes_by_pk?.user.id !== currentUserId.value) {
    return null;
  }
  return result.value?.recipes_by_pk;
});

const initialDataForForm = computed(() => {
  if (!recipeData.value) return undefined;

  const featuredImageIndex = recipeData.value.recipe_images.findIndex(
    (img) => img.is_featured
  );

  return {
    title: recipeData.value.title,
    description: recipeData.value.description,
    prep_time_minutes: recipeData.value.prep_time_minutes,
    cook_time_minutes: recipeData.value.cook_time_minutes,
    servings: recipeData.value.servings,
    is_premium: recipeData.value.is_premium,
    price: recipeData.value.price,
    categoryNames: recipeData.value.recipe_categories
      .map((rc) => rc.category.name)
      .join(", "),
    featuredImageIndex: featuredImageIndex !== -1 ? featuredImageIndex : 0,
    ingredients: recipeData.value.recipe_ingredients.map((ri) => ({
      name: ri.ingredient.name,
      quantity: ri.quantity,
      unit: ri.unit,
    })),
    steps: recipeData.value.instructions.map((step) => ({
      description: step.description,
    })),
  };
});

const { mutate: findOrCreateCategory } = useMutation(FIND_OR_CREATE_CATEGORY);
const { mutate: findOrCreateIngredient } = useMutation(
  FIND_OR_CREATE_INGREDIENT
);
const { mutate: updateRecipe } = useMutation(UPDATE_RECIPE);

async function resolveCategoryIds(categoryNamesStr: string): Promise<number[]> {
  const categoryNames = categoryNamesStr
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const promises = categoryNames.map((name) => findOrCreateCategory({ name }));
  const results = await Promise.all(promises);
  return results.map((res) => res!.data.find_or_create_category[0].id);
}
async function resolveIngredientIds(
  ingredients: { name: string }[]
): Promise<number[]> {
  const promises = ingredients.map((ing) =>
    findOrCreateIngredient({ name: ing.name })
  );
  const results = await Promise.all(promises);
  return results.map((res) => res!.data.find_or_create_ingredient[0].id);
}

interface UpdatePayload {
  formData: any;
  newImageFiles: File[];
  existingImageUrls: string[];
}

async function handleUpdate({
  formData,
  newImageFiles,
  existingImageUrls,
}: UpdatePayload) {
  isUpdating.value = true;

  try {
    const uploadPromises = newImageFiles.map((file) => uploadImage(file));
    const newImageUrls = await Promise.all(uploadPromises);
    const allImageUrls = [...existingImageUrls, ...newImageUrls];

    if (allImageUrls.length === 0) {
      throw new Error("A recipe must have at least one image.");
    }

    const [categoryIds, ingredientIds] = await Promise.all([
      resolveCategoryIds(formData.categoryNames),
      resolveIngredientIds(formData.ingredients),
    ]);

    const updateVariables = {
      id: recipeId,
      recipeData: {
        title: formData.title,
        description: formData.description,
        prep_time_minutes: formData.prep_time_minutes,
        cook_time_minutes: formData.cook_time_minutes,
        servings: formData.servings,
        is_premium: formData.is_premium || false,
        price: formData.is_premium ? formData.price : null,
        featured_image_url: allImageUrls[formData.featuredImageIndex],
      },
      categories: categoryIds.map((id) => ({
        recipe_id: recipeId,
        category_id: id,
      })),
      ingredients: formData.ingredients.map((ing: any, i: number) => ({
        recipe_id: recipeId,
        ingredient_id: ingredientIds[i],
        quantity: ing.quantity,
        unit: ing.unit,
      })),
      instructions: formData.steps.map((step: any, i: number) => ({
        recipe_id: recipeId,
        step_number: i + 1,
        description: step.description,
      })),
      images: allImageUrls.map((url, i) => ({
        recipe_id: recipeId,
        image_url: url,
        is_featured: i === formData.featuredImageIndex,
      })),
    };

    const result = await updateRecipe(updateVariables);

    if (!result?.data) {
      throw new Error(
        "Failed to update. The server did not respond correctly."
      );
    }

    toast.success("Recipe updated successfully! Redirecting...");

    setTimeout(() => {
      router.push(`/recipe/${recipeId}`);
    }, 2000);
  } catch (err: any) {
    console.error("Failed to update recipe:", err);

    toast.error(err.message || "An unexpected error occurred.");
  } finally {
    isUpdating.value = false;
  }
}
</script>

