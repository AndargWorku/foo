<template>
  <div class="bg-slate-50 min-h-screen">
    <main class="container mx-auto px-4 py-12">
      <!-- Page Header -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-extrabold text-slate-800">Meet Our Chefs</h1>
        <p class="mt-2 text-lg text-slate-500">
          Discover the talented creators behind your favorite recipes.
        </p>
      </div>

      <div v-if="loading" class="flex justify-center mt-16">
        <UiSpinner size="lg" />
      </div>

      <div
        v-else-if="error"
        class="text-center text-red-500 mt-16 p-6 bg-red-50 rounded-lg"
      >
        <p class="text-xl font-semibold">Could not load creators.</p>
        <p>{{ error.message }}</p>
      </div>

      <div
        v-else-if="!creators || creators.length === 0"
        class="text-center text-slate-500 mt-16"
      >
        <Icon
          name="ph:user-circle-gear"
          class="mx-auto h-16 w-16 text-slate-400"
        />
        <p class="mt-4 text-xl font-semibold">
          No chefs have published recipes yet.
        </p>
      </div>

      <div
        v-else
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        <NuxtLink
          v-for="creator in creators"
          :key="creator.id"
          :to="{ path: '/recipes', query: { creatorId: creator.id } }"
          class="group block bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 text-center"
        >
          <img
            :src="avatar"
            :alt="`Profile picture of ${creator.username}`"
            class="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
          />
          <h3
            class="mt-4 font-bold text-lg text-slate-800 group-hover:text-green-600 transition-colors"
          >
            {{ creator.username }}
          </h3>
          <p class="text-sm text-slate-500 mt-1">
            {{ creator.recipes_aggregate.aggregate.count }} Recipes
          </p>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import { GET_ALL_CREATORS } from "~/lib/graphql";
import avatar from "@/assets/images/avatar.png";

useSeoMeta({
  title: "Browse Creators | SavoryShare",
  description:
    "Discover the talented chefs and home cooks sharing their recipes on SavoryShare.",
});

const { result, loading, error } = useQuery(GET_ALL_CREATORS);

const creators = computed(() => result.value?.users || []);
</script>
