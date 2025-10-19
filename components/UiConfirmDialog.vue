<!-- components/UiConfirmDialog.vue -->
<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        class="relative w-full max-w-md transform rounded-xl bg-white p-6 text-left shadow-xl transition-all"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title"
      >
        <div class="flex items-start">
          <!-- Icon for destructive actions -->
          <div
            v-if="isDestructive"
            class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <Icon
              name="ph:warning"
              class="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
          </div>
          <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3
              class="text-lg font-semibold leading-6 text-slate-900"
              id="modal-title"
            >
              {{ title }}
            </h3>
            <div class="mt-2">
              <p class="text-sm text-slate-500">
                {{ message }}
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 sm:flex sm:flex-row-reverse sm:gap-3">
          <button
            @click="$emit('confirm')"
            type="button"
            class="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors sm:w-auto"
            :class="
              isDestructive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            "
          >
            {{ confirmText }}
          </button>
          <button
            @click="$emit('cancel')"
            type="button"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto"
          >
            {{ cancelText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
  }>(),
  {
    confirmText: "Confirm",
    cancelText: "Cancel",
    isDestructive: false,
  }
);

defineEmits(["confirm", "cancel"]);
</script>
