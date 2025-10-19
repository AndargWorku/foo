<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-slate-100 px-4"
  >
    <div class="bg-white shadow-sm rounded-2xl p-10 w-full max-w-md">
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-sm"
        >
          🍲
        </div>
        <h1 class="mt-4 text-2xl font-bold text-slate-800">Welcome Back</h1>
        <p class="text-slate-500">Sign in to continue to Food Recipe App</p>
      </div>

      <LoginForm />

      <p class="text-sm text-center mt-6 text-slate-500">
        Don’t have an account?
        <NuxtLink
          to="/signup"
          class="font-semibold text-green-600 hover:underline"
        >
          Sign Up
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "guest",
});
</script>
