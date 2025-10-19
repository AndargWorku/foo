<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
  >
    <div class="relative w-auto max-w-lg mx-auto my-6">
      <div
        class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
      >
        <div
          class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t bg-green-600"
        >
          <h3 class="text-xl font-semibold text-slate-800">
            {{ title }}
          </h3>
          <button
            class="p-1 ml-auto bg-transparent border-0 text-slate-400 opacity-70 float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:text-slate-600"
            @click="emit('cancel')"
          >
            <span
              class="text-white h-6 w-6 text-2xl block cursor-pointer outline-none focus:outline-none"
            >
              ×
            </span>
          </button>
        </div>
        <div class="relative p-6 flex-auto">
          <p class="text-slate-600 text-lg leading-relaxed">
            {{ message }}
          </p>
        </div>
        <div
          class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b space-x-3"
        >
          <button
            class="text-slate-500 background-transparent cursor-pointer font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border border-slate-300 rounded-md hover:bg-slate-50"
            type="button"
            @click="emit('cancel')"
          >
            {{ cancelButtonText }}
          </button>
          <button
            class="bg-green-500 text-white cursor-pointer active:bg-green-600 font-bold uppercase text-sm px-6 py-2 rounded-md shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            @click="emit('confirm')"
          >
            {{ confirmButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="show" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Confirmation",
  },
  message: {
    type: String,
    default: "Are you sure you want to proceed?",
  },
  confirmButtonText: {
    type: String,
    default: "Confirm",
  },
  cancelButtonText: {
    type: String,
    default: "Cancel",
  },
});

const emit = defineEmits(["confirm", "cancel"]);
</script>
