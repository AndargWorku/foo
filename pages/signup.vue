<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-green-50 px-4"
  >
    <div class="bg-white shadow-sm rounded-2xl p-10 w-full max-w-md">
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-sm"
        >
          🍳
        </div>
        <h1 class="mt-4 text-2xl font-bold text-slate-800">Create Account</h1>
        <p class="text-slate-500">Join us and share your favorite recipes</p>
      </div>
      <SignupForm />
      <p class="text-sm text-center mt-6 text-slate-500">
        Already have an account?
        <NuxtLink
          to="/login"
          class="font-semibold text-green-600 hover:underline"
        >
          Sign In
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
