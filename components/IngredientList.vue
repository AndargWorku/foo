<template>
  <div class="p-6 bg-white rounded-xl border border-gray-100">
    <h2 class="mb-6 text-2xl font-extrabold text-gray-900 pb-3">
      Recipe Ingredients
    </h2>
    <ul class="space-y-4">
      <li
        v-for="item in ingredients"
        :key="item.id"
        class="flex items-center group p-3 rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-sm"
      >
        <div class="flex-shrink-0 mr-4">
          <svg
            class="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <span class="text-lg font-medium text-gray-800">
          {{ item.quantity }} {{ item.unit }} {{ item.ingredient.name }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// --- TYPE DEFINITION for robust props ---
interface IngredientItem {
  id: string;
  quantity: string;
  unit: string;
  ingredient: {
    name: string;
  };
}

// --- PROPS ---
defineProps<{
  ingredients: IngredientItem[];
}>();
</script>
