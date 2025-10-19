<!-- components/RecipeForm.vue -->
<template>
  <VeeForm
    @submit="handleSubmit"
    :validation-schema="schema"
    :initial-values="initialData"
    class="space-y-10"
    v-slot="{ values }"
  >
    <section>
      <h2 class="mb-4 text-xl font-bold text-slate-700">Basic Information</h2>
      <div class="space-y-4">
        <Field name="title" v-slot="{ field, errorMessage }">
          <UiAppInput
            v-bind="field"
            label="Recipe Title"
            placeholder="e.g., Classic Spaghetti Carbonara"
            :error="errorMessage"
          />
        </Field>
        <Field name="description" v-slot="{ field, errorMessage }">
          <UiAppTextarea
            v-bind="field"
            label="Description"
            placeholder="A short story about your recipe, its origin, or why it's special."
            :rows="4"
            :error="errorMessage"
          />
        </Field>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field name="prep_time_minutes" v-slot="{ field, errorMessage }">
            <UiAppInput
              v-bind="field"
              type="number"
              label="Prep Time (minutes)"
              :error="errorMessage"
            />
          </Field>
          <!-- <Field name="cook_time_minutes" v-slot="{ field, errorMessage }">
            <UiAppInput
              v-bind="field"
              type="number"
              label="Cook Time (minutes)"
              :error="errorMessage"
            />
          </Field> -->
        </div>
        <Field name="categoryNames" v-slot="{ field, value, errorMessage }">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              Categories (comma-separated)
            </label>
            <div
              class="flex flex-wrap items-center gap-2 rounded-md border border-slate-300 p-2 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500"
            >
              <span
                v-for="cat in (value || '')
                  .split(',')
                  .map((c) => c.trim())
                  .filter(Boolean)"
                :key="cat"
                class="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800"
              >
                {{ cat }}
              </span>
              <input
                v-bind="field"
                @keydown.enter.prevent
                class="min-w-[150px] flex-grow p-1 focus:outline-none"
                placeholder="Italian, Dessert, Quick..."
              />
            </div>
            <p v-if="errorMessage" class="mt-1 text-sm text-red-500">
              {{ errorMessage }}
            </p>
          </div>
        </Field>
      </div>
    </section>

    <!-- Section 2: Optional Premium Recipe Details -->
    <section class="rounded-lg border border-slate-200 bg-slate-50 p-6">
      <h2 class="mb-2 text-xl font-bold text-slate-700">
        Premium Recipe (Optional)
      </h2>
      <div class="space-y-4">
        <Field
          name="is_premium"
          type="checkbox"
          :value="true"
          v-slot="{ field }"
        >
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              v-bind="field"
              class="h-5 w-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
            />
            <span class="font-medium text-slate-700"
              >Make this a premium (paid) recipe</span
            >
          </label>
        </Field>
        <Field
          v-if="values.is_premium"
          name="price"
          v-slot="{ field, errorMessage }"
        >
          <UiAppInput
            v-bind="field"
            type="number"
            step="0.01"
            label="Price (e.g., in USD)"
            placeholder="9.99"
            :error="errorMessage"
          />
        </Field>
      </div>
    </section>

    <section>
      <h2 class="mb-4 text-xl font-bold text-slate-700">Images</h2>
      <div
        @click="openFilePicker"
        class="mt-2 flex cursor-pointer justify-center rounded-lg border border-dashed border-slate-300 px-6 py-10 transition hover:border-green-500"
      >
        <div class="text-center">
          <Icon name="ph:camera" class="mx-auto h-12 w-12 text-slate-400" />
          <p class="mt-2 text-sm text-slate-500">
            Click to upload images (max 5)
          </p>
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/jpeg, image/png, image/webp"
            @change="handleImageSelection"
            class="hidden"
          />
        </div>
      </div>
      <div v-if="imagePreviews.length" class="mt-4">
        <div class="mb-4 grid grid-cols-3 gap-4 md:grid-cols-5">
          <div
            v-for="(preview, index) in imagePreviews"
            :key="index"
            class="relative"
          >
            <img
              :src="preview.url"
              class="h-24 w-full rounded-md object-cover"
              :alt="`Recipe image preview ${index + 1}`"
            />
            <button
              @click="removeImage(index)"
              type="button"
              class="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-md transition hover:bg-red-700"
              :aria-label="`Remove image ${index + 1}`"
            >
              <Icon name="ph:x-bold" class="h-3 w-3" />
            </button>
          </div>
        </div>
        <label class="mb-2 block text-sm font-medium text-slate-700">
          Select Featured Image
        </label>
        <div class="flex flex-wrap gap-x-6 gap-y-2">
          <label
            v-for="(_, index) in imagePreviews"
            :key="index"
            class="flex cursor-pointer items-center space-x-2"
          >
            <Field
              name="featuredImageIndex"
              type="radio"
              :value="index"
              class="h-4 w-4 border-slate-300 text-green-600 focus:ring-green-500"
            />
            <span>Image {{ index + 1 }}</span>
          </label>
        </div>
        <ErrorMessage
          name="featuredImageIndex"
          class="mt-1 text-sm text-red-500"
        />
      </div>
    </section>

    <section>
      <h2 class="mb-4 text-xl font-bold text-slate-700">Ingredients</h2>
      <FieldArray name="ingredients" v-slot="{ fields, push, remove }">
        <div
          v-for="(field, idx) in fields"
          :key="field.key"
          class="mb-2 grid grid-cols-12 items-start gap-2"
        >
          <Field
            :name="`ingredients[${idx}].name`"
            v-slot="{ field: nameField, errorMessage }"
          >
            <UiAppInput
              v-bind="nameField"
              placeholder="Ingredient Name"
              class="col-span-5"
              :error="errorMessage"
              label-sr-only
            />
          </Field>
          <Field
            :name="`ingredients[${idx}].quantity`"
            v-slot="{ field: quantityField, errorMessage }"
          >
            <UiAppInput
              v-bind="quantityField"
              placeholder="Quantity"
              class="col-span-3"
              :error="errorMessage"
              label-sr-only
            />
          </Field>
          <Field
            :name="`ingredients[${idx}].unit`"
            v-slot="{ field: unitField, errorMessage }"
          >
            <UiAppInput
              v-bind="unitField"
              placeholder="Unit"
              class="col-span-3"
              :error="errorMessage"
              label-sr-only
            />
          </Field>
          <button
            type="button"
            @click="remove(idx)"
            class="col-span-1 p-2 text-slate-400 transition hover:text-red-500"
            :aria-label="`Remove ingredient ${idx + 1}`"
          >
            <Icon name="ph:x-bold" class="h-5 w-5" />
          </button>
        </div>
        <button
          type="button"
          @click="push({ name: '', quantity: '', unit: '' })"
          class="flex items-center text-sm font-semibold text-green-600 hover:text-green-800"
        >
          <Icon name="ph:plus" class="mr-1" /> Add Ingredient
        </button>
      </FieldArray>
    </section>

    <section>
      <h2 class="mb-4 text-xl font-bold text-slate-700">Instructions</h2>
      <FieldArray name="steps" v-slot="{ fields, push, remove }">
        <div
          v-for="(field, idx) in fields"
          :key="field.key"
          class="mb-2 flex items-start gap-2"
        >
          <span class="pt-2 font-bold text-slate-500">{{ idx + 1 }}.</span>
          <Field
            :name="`steps[${idx}].description`"
            as="div"
            class="flex-grow"
            v-slot="{ field: inputField, errorMessage }"
          >
            <UiAppTextarea
              v-bind="inputField"
              :placeholder="`Describe step ${idx + 1}`"
              :rows="2"
              :error="errorMessage"
              label-sr-only
            />
          </Field>
          <button
            type="button"
            @click="remove(idx)"
            class="p-2 text-slate-400 transition hover:text-red-500"
            :aria-label="`Remove step ${idx + 1}`"
          >
            <Icon name="ph:x-bold" class="h-5 w-5" />
          </button>
        </div>
        <button
          type="button"
          @click="push({ description: '' })"
          class="flex items-center text-sm font-semibold text-green-600 hover:text-green-800"
        >
          <Icon name="ph:plus" class="mr-1" /> Add Step
        </button>
      </FieldArray>
    </section>

    <div
      class="flex items-center justify-center gap-4 border-t border-slate-200 pt-6"
    >
      <button
        type="button"
        @click="router.back()"
        class="rounded-full bg-slate-200 px-10 py-3 font-bold text-slate-700 transition hover:bg-slate-300"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="isLoading"
        class="flex items-center rounded-full bg-green-600 px-10 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        <UiSpinner v-if="isLoading" class="mr-2" />
        <span v-if="initialData">Update Recipe</span>
        <span v-else>Create Recipe</span>
      </button>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Form as VeeForm, Field, FieldArray, ErrorMessage } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

const router = useRouter();

const props = defineProps<{
  isLoading: boolean;
  initialData?: Record<string, any>;
  existingImages?: { image_url: string; is_featured: boolean }[];
}>();
const emit = defineEmits<{
  (
    e: "submit",
    payload: {
      formData: any;
      newImageFiles: File[];
      existingImageUrls: string[];
    }
  ): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const imagePreviews = ref<{ url: string; file?: File }[]>([]);

const schema = toTypedSchema(
  z
    .object({
      title: z.string().min(5, "Title must be at least 5 characters long."),
      description: z
        .string()
        .min(20, "Description must be at least 20 characters long."),
      prep_time_minutes: z.coerce
        .number({ invalid_type_error: "Must be a number." })
        .positive("Must be a positive number."),
      // cook_time_minutes: z.coerce
      //   .number({ invalid_type_error: "Must be a number." })
      //   .positive("Must be a positive number."),
      categoryNames: z.string().min(2, "Please add at least one category."),
      is_premium: z.boolean().optional(),
      price: z.coerce.number().optional(),
      featuredImageIndex: z
        .number({ required_error: "Please select a featured image." })
        .min(0),
      ingredients: z
        .array(
          z.object({
            name: z.string().min(1, "Name is required."),
            quantity: z.string().min(1, "Quantity is required."),
            unit: z.string().optional(),
          })
        )
        .min(1, "At least one ingredient is required."),
      steps: z
        .array(
          z.object({
            description: z
              .string()
              .min(10, "Step description must be at least 10 characters."),
          })
        )
        .min(1, "At least one instruction step is required."),
    })
    .refine((data) => !data.is_premium || (data.price && data.price > 0), {
      message: "Price must be a positive number for premium recipes.",
      path: ["price"],
    })
);

const openFilePicker = () => fileInput.value?.click();
const handleImageSelection = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  const files = Array.from(target.files).slice(
    0,
    5 - imagePreviews.value.length
  );
  for (const file of files) {
    if (file.type.startsWith("image/")) {
      imagePreviews.value.push({
        url: URL.createObjectURL(file),
        file: file,
      });
    }
  }
  target.value = "";
};
const removeImage = (index: number) => {
  const preview = imagePreviews.value[index];
  if (preview.file) {
    URL.revokeObjectURL(preview.url);
  }
  imagePreviews.value.splice(index, 1);
};
const handleSubmit = (values: any) => {
  const newImageFiles = imagePreviews.value
    .map((p) => p.file)
    .filter((f): f is File => f !== undefined);

  const existingImageUrls = imagePreviews.value
    .filter((p) => !p.file)
    .map((p) => p.url);

  emit("submit", {
    formData: values,
    newImageFiles,
    existingImageUrls,
  });
};

onMounted(() => {
  if (props.existingImages && props.existingImages.length > 0) {
    imagePreviews.value = props.existingImages.map((img) => ({
      url: img.image_url,
    }));
  }
});
onUnmounted(() => {
  imagePreviews.value.forEach((preview) => {
    if (preview.file) {
      URL.revokeObjectURL(preview.url);
    }
  });
});
</script>
