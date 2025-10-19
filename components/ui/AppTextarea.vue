<template>
  <div>
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
    </label>
    <div class="mt-1">
      <!-- THE FIX: Same as the input component -->
      <textarea
        :id="id"
        v-model="model"
        v-bind="$attrs"
        :placeholder="placeholder"
        :rows="rows"
        :class="[baseInputClasses, error ? errorClasses : defaultClasses]"
      ></textarea>
    </div>
    <p v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>();

defineProps({
  label: { type: String, default: "" },
  id: {
    type: String,
    default: () => `app-textarea-${Math.random().toString(36).substr(2, 9)}`,
  },
  placeholder: { type: String, default: "" },
  rows: { type: Number, default: 4 },
  error: { type: String, default: "" },
});

const baseInputClasses = `
  appearance-none block w-full px-3 py-2 border rounded-md shadow-sm 
  placeholder-gray-400 focus:outline-none sm:text-sm
`;
const defaultClasses =
  "border-gray-300 focus:ring-green-500 focus:border-green-500";
const errorClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
</script>

<!-- <template>
  <div>
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
    </label>
    <div class="mt-1">
      <textarea
        :id="id"
        :value="modelValue"
        :placeholder="placeholder"
        :rows="rows"
        @input="
          $emit(
            'update:modelValue',
            ($event.target as HTMLTextAreaElement).value
          )
        "
        :class="[baseInputClasses, error ? errorClasses : defaultClasses]"
      ></textarea>
    </div>
    <p v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: { type: String, default: "" },
  label: { type: String, default: "" },
  id: {
    type: String,
    default: () => `app-textarea-${Math.random().toString(36).substr(2, 9)}`,
  },
  placeholder: { type: String, default: "" },
  rows: { type: Number, default: 4 },
  error: { type: String, default: "" },
});

defineEmits(["update:modelValue"]);

const baseInputClasses = `
  appearance-none block w-full px-3 py-2 border rounded-md shadow-sm 
  placeholder-gray-400 focus:outline-none sm:text-sm
`;
const defaultClasses =
  "border-gray-300 focus:ring-green-500 focus:border-green-500";
const errorClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
</script> -->
