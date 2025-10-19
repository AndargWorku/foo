<template>
  <div class="p-6 bg-white rounded-lg">
    <h2 class="mb-8 text-2xl font- font-extrabold text-gray-900">
      How It Works please follow this instructions
    </h2>
    <ol class="relative border-l-4 border-green-100 space-y-10 ml-2">
      <li
        v-for="(step, index) in instructions"
        :key="step.id"
        class="mb-10 ml-8 flex items-start"
      >
        <!-- Stepper Circle -->
        <div
          class="absolute -left-6 flex h-8 w-8 items-center justify-center rounded-full bg-green-200 text-lg font-medium text-white shadow-md transition-all duration-300 ease-in-out hover:scale-110 hover:bg-green-400"
        >
          {{ index + 1 }}
        </div>

        <div class="flex flex-col mx-4">
          <h3 class="mb-2 text-xl font-semibold text-gray-800">
            Step {{ index + 1 }}
          </h3>
          <p class="text-gray-600 leading-relaxed">
            {{ step.description }}
          </p>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
interface InstructionStep {
  id: string;
  description: string;
  step_number: number;
}

// --- PROPS ---
defineProps<{
  instructions: InstructionStep[];
}>();
</script>
