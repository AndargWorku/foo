<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <nav class="container mx-auto px-6 py-4">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="text-2xl font-bold text-green-600 hover:text-green-800"
        >
          FoodRecipes
        </NuxtLink>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-6">
          <NuxtLink to="/recipes" class="nav-link hover:text-green-800"
            >Recipes</NuxtLink
          >

          <template v-if="auth.isAuthenticated && auth.user">
            <NuxtLink to="/create-recipe" class="nav-link hover:text-green-800">
              Create Recipe
            </NuxtLink>
            <span class="text-zinc-700">
              Welcome, {{ auth.user.username }}
            </span>
            <button
              @click="auth.logout"
              class="font-medium transition-colors text-red-500 hover:text-red-700 cursor-pointer"
            >
              Logout
            </button>
          </template>

          <template v-else>
            <NuxtLink to="/login" class="nav-link hover:text-green-800"
              >Login</NuxtLink
            >
            <NuxtLink to="/signup">
              <UiAppButton variant="primary" class="cursor-pointer"
                >Sign Up</UiAppButton
              >
            </NuxtLink>
          </template>
        </div>
        <!-- Mobile Menu Button can be added here -->
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/store/auth";
const auth = useAuthStore();
</script>
