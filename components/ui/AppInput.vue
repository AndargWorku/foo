<template>
  <div>
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700"
      :class="{ 'sr-only': labelSrOnly }"
    >
      {{ label }}
    </label>
    <div class="mt-1">
      <!-- 
        THE FIX:
        - We use v-model="model" to create a two-way binding.
        - We pass all other attributes from the parent using 'v-bind="$attrs"'.
          This is crucial because Vee-Validate's 'field' object includes 'name',
          'onBlur', 'onChange', which are now passed directly to the input.
      -->
      <input
        :id="id"
        :type="type"
        v-model="model"
        v-bind="$attrs"
        :placeholder="placeholder"
        :class="[baseInputClasses, error ? errorClasses : defaultClasses]"
      />
    </div>
    <p v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
// This uses the new `defineModel` feature in Vue 3.4+ for cleaner v-model handling.
// If you are on an older version of Vue, I will provide the alternative below.
const model = defineModel<string | number>();

defineProps({
  label: { type: String, default: "" },
  labelSrOnly: { type: Boolean, default: false },
  id: {
    type: String,
    default: () => `app-input-${Math.random().toString(36).substr(2, 9)}`,
  },
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
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
      :class="{ 'sr-only': labelSrOnly }"
    >
      {{ label }}
    </label>
    <div class="mt-1">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        :class="[baseInputClasses, error ? errorClasses : defaultClasses]"
      />
    </div>
    <p v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: { type: [String, Number], default: "" },
  label: { type: String, default: "" },
  labelSrOnly: { type: Boolean, default: false },
  id: {
    type: String,
    default: () => `app-input-${Math.random().toString(36).substr(2, 9)}`,
  },
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
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
