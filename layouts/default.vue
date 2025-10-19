<!-- layouts/default.vue -->
<template>
  <div class="flex flex-col min-h-screen bg-slate-50 text-slate-800">
    <LayoutTheHeader />

    <main id="main-content" class="flex-grow container mx-auto px-4 py-6">
      <slot />
    </main>

    <LayoutTheFooter />
  </div>
</template>

<script setup lang="ts"></script>
