<!-- pages/create-recipe.vue -->
<template>
  <div class="min-h-screen bg-[#f9f5ef] font-serif">
    <main class="container mx-auto px-4 py-8">
      <h1 class="mb-10 text-center text-4xl font-bold text-slate-800">
        Share Your Culinary Creation
      </h1>
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div
          class="rounded-xl border border-slate-200 bg-white p-8 shadow-md lg:col-span-3"
        >
          <RecipeForm @submit="handleSubmit" :is-loading="isLoading" />
        </div>

        <aside
          class="rounded-xl border border-slate-200 bg-white p-8 shadow-md lg:col-span-2"
        >
          <h2 class="mb-4 text-xl font-bold text-slate-700">
            Tips for a Great Recipe
          </h2>
          <ul class="list-disc space-y-2 pl-5 text-slate-500">
            <li>Provide clear, concise steps.</li>
            <li>Use accurate ingredient measurements.</li>
            <li>A great photo makes all the difference!</li>
          </ul>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
// import { useToast } from "vue-toastification";
import { useImageUpload } from "~/composables/useImageUpload";
import {
  CREATE_RECIPE,
  FIND_OR_CREATE_CATEGORY,
  FIND_OR_CREATE_INGREDIENT,
} from "~/lib/graphql";
import pkg from "vue-toastification";
const { useToast } = pkg;
definePageMeta({ middleware: "auth" });

const router = useRouter();
const toast = useToast();
const { uploadImage } = useImageUpload();
const isLoading = ref(false);

const { mutate: findOrCreateCategory } = useMutation(FIND_OR_CREATE_CATEGORY);
const { mutate: findOrCreateIngredient } = useMutation(
  FIND_OR_CREATE_INGREDIENT
);
const { mutate: createRecipe } = useMutation(CREATE_RECIPE);

interface SubmitPayload {
  formData: any;
  newImageFiles: File[];
}

async function uploadRecipeImages(files: File[]): Promise<string[]> {
  if (files.length === 0) {
    throw new Error("At least one image is required for the recipe.");
  }
  const uploadPromises = files.map((file) => uploadImage(file));
  return await Promise.all(uploadPromises);
}

async function resolveCategoryIds(categoryNamesStr: string): Promise<number[]> {
  const categoryNames = categoryNamesStr
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const uniqueCategories = new Map<string, string>();
  for (const name of categoryNames) {
    const key = name.toLowerCase();
    if (!uniqueCategories.has(key)) {
      uniqueCategories.set(key, name);
    }
  }
  const uniqueOriginalNames = Array.from(uniqueCategories.values());
  const promises = uniqueOriginalNames.map((name) =>
    findOrCreateCategory({ name })
  );
  const results = await Promise.all(promises);
  return results.map((res) => res!.data.find_or_create_category[0].id);
}

async function resolveIngredientIds(
  ingredients: { name: string }[]
): Promise<number[]> {
  const uniqueIngredients = new Map<string, string>();
  for (const ing of ingredients) {
    const key = ing.name.toLowerCase().trim();
    if (key && !uniqueIngredients.has(key)) {
      uniqueIngredients.set(key, ing.name);
    }
  }
  const uniqueOriginalNames = Array.from(uniqueIngredients.values());
  const promises = uniqueOriginalNames.map((name) =>
    findOrCreateIngredient({ name })
  );
  const results = await Promise.all(promises);
  const ingredientIdMap = new Map<string, number>();
  results.forEach((res, index) => {
    const nameKey = uniqueOriginalNames[index].toLowerCase().trim();
    const id = res!.data.find_or_create_ingredient[0].id;
    ingredientIdMap.set(nameKey, id);
  });
  return ingredients.map(
    (ing) => ingredientIdMap.get(ing.name.toLowerCase().trim())!
  );
}

async function handleSubmit({ formData, newImageFiles }: SubmitPayload) {
  isLoading.value = true;

  try {
    const imageUrls = await uploadRecipeImages(newImageFiles);

    const [categoryIds, ingredientIds] = await Promise.all([
      resolveCategoryIds(formData.categoryNames),
      resolveIngredientIds(formData.ingredients),
    ]);

    const recipeObject = {
      title: formData.title,
      description: formData.description,
      prep_time_minutes: formData.prep_time_minutes,
      cook_time_minutes: formData.cook_time_minutes,
      servings: formData.servings,
      is_premium: formData.is_premium || false,
      price: formData.is_premium ? formData.price : undefined,
      featured_image_url: imageUrls[formData.featuredImageIndex],
      recipe_categories: {
        data: categoryIds.map((id) => ({ category_id: id })),
      },
      recipe_ingredients: {
        data: formData.ingredients.map((ing: any, index: number) => ({
          ingredient_id: ingredientIds[index],
          quantity: ing.quantity,
          unit: ing.unit,
        })),
      },
      instructions: {
        data: formData.steps.map((step: any, index: number) => ({
          step_number: index + 1,
          description: step.description,
        })),
      },
      recipe_images: {
        data: imageUrls.map((url, index) => ({
          image_url: url,
          is_featured: index === formData.featuredImageIndex,
        })),
      },
    };

    const newRecipeResult = await createRecipe({ object: recipeObject });
    const newRecipeId = newRecipeResult?.data.insert_recipes_one.id;

    if (!newRecipeId) {
      throw new Error("Recipe creation failed to return a valid ID.");
    }

    toast.success("Recipe created successfully! Redirecting...");

    setTimeout(() => {
      router.push(`/recipe/${newRecipeId}`);
    }, 2000);
  } catch (err: any) {
    console.error("Failed to create recipe:", err);

    toast.error(
      err.message || "An unexpected error occurred. Please try again."
    );
  } finally {
    isLoading.value = false;
  }
}
</script>
