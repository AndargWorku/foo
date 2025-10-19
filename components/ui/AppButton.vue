<template>
  <button
    :type="type"
    :class="[baseClasses, variantClasses]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String as () => "primary" | "secondary" | "danger",
    default: "primary",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as () => "button" | "submit" | "reset",
    default: "button",
  },
});

defineEmits(["click"]);

const baseClasses = `
  inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm 
  focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:cursor-not-allowed
`;

const variantClasses = computed(() => {
  switch (props.variant) {
    case "secondary":
      return `
        text-gray-700 bg-white border border-gray-300 hover:bg-gray-50
        focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-400
      `;
    case "danger":
      return `
        text-white bg-red-600 hover:bg-red-700
        focus:ring-red-500 disabled:bg-red-300
      `;
    case "primary":
    default:
      return `
        text-white bg-green-600 hover:bg-green-700
        focus:ring-green-500 disabled:bg-green-400
      `;
  }
});
</script>
