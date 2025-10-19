<template>
  <svg
    :class="['animate-spin', sizeClass, colorClass]"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    role="status"
    aria-hidden="true"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    ></circle>
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  size: {
    type: String as () => "sm" | "md" | "lg",
    default: "md",
  },
  color: {
    type: String,
    default: "text-green-600",
  },
});

const sizeClass = computed(
  () =>
    ({
      sm: "h-5 w-5",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    }[props.size])
);

const colorClass = computed(() => props.color);
</script>
