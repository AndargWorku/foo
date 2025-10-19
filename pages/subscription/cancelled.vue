<!-- pages/subscription/cancelled.vue -->
<template>
  <div
    class="flex flex-col items-center justify-center min-h-[70vh] text-center"
  >
    <Icon name="ph:x-circle-fill" class="text-red-500 text-6xl" />
    <h1 class="text-4xl font-bold mt-4">Payment Cancelled</h1>
    <p class="text-slate-600 mt-2">
      Your payment process was cancelled. You have not been charged.
    </p>
    <div class="mt-8">
      <NuxtLink to="/">
        <UiAppButton variant="secondary" size="lg"
          >Back to Homepage</UiAppButton
        >
      </NuxtLink>
    </div>
  </div>
</template>
