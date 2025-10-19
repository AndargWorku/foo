<template>
  <footer class="bg-white text-black mt-auto">
    <div class="container mx-auto px-6 py-8">
      <div class="flex flex-col items-center text-center">
        <h2 class="text-2xl font-bold">FoodRecipes</h2>
        <p class="mt-2 text-zinc-400">
          Your daily source of culinary inspiration.
        </p>

        <p class="mt-8 text-sm text-zinc-500">
          &copy; {{ new Date().getFullYear() }} FoodRecipes. All rights
          reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No script logic needed for this static component
</script>
