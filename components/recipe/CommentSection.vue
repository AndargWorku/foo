<template>
  <div class="mt-12 border-t pt-8">
    <h2 class="mb-6 text-3xl font-extrabold text-slate-800">
      Comments ({{ currentTotalComments }})
    </h2>

    <div
      v-if="auth.isAuthenticated"
      class="mb-8 rounded-lg bg-slate-50 p-4 shadow-sm"
    >
      <h3 class="mb-4 text-xl font-bold text-slate-700">Add a Comment</h3>
      <form
        @submit.prevent="handlePostComment"
        class="flex items-start space-x-3"
      >
        <div
          class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600"
        >
          <Icon name="ph:user-circle" class="text-2xl" />
        </div>
        <div class="flex-grow">
          <textarea
            v-model="newComment"
            rows="3"
            placeholder="Share your thoughts on this recipe..."
            class="w-full resize-y rounded-lg border-2 border-slate-200 p-3 transition focus:border-green-500 focus:outline-none"
            required
          ></textarea>
          <div class="mt-3 flex justify-end">
            <button
              type="submit"
              :disabled="loadingAddComment || !newComment.trim()"
              class="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white shadow transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
            >
              <UiSpinner
                v-if="loadingAddComment"
                size="sm"
                class="text-white"
              />
              <span v-else>Post Comment</span>
            </button>
          </div>
        </div>
      </form>
    </div>

    <p
      v-else
      class="mb-8 rounded-lg border bg-slate-50 p-4 text-center text-slate-600"
    >
      <NuxtLink
        :to="`/login?redirect=${route.fullPath}`"
        class="font-semibold text-green-600 hover:underline"
        >Log in</NuxtLink
      >
      to add a comment.
    </p>

    <div class="mt-6 space-y-6">
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-8"
      >
        <UiSpinner size="md" class="text-green-500" />
        <p class="mt-3 text-slate-500">Loading comments...</p>
      </div>
      <div
        v-else-if="error"
        class="rounded-lg border border-red-200 bg-red-50 p-8 text-center"
      >
        <h3 class="text-xl font-semibold text-red-700">
          Failed to Load Comments
        </h3>
        <p class="mt-2 text-red-600">{{ error.message }}</p>
      </div>
      <div v-else-if="comments.length > 0">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="flex items-start space-x-3 rounded-lg border border-slate-100 bg-white p-4 shadow-sm"
        >
          <div
            class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500"
          >
            <Icon name="ph:user-circle" class="text-2xl" />
          </div>
          <div class="flex-grow">
            <div class="mb-1 flex items-baseline">
              <p class="mr-2 font-bold text-slate-800">
                {{ comment.user?.username || "Anonymous" }}
              </p>
              <span class="text-xs text-slate-500">{{
                formatDate(comment.created_at)
              }}</span>
            </div>
            <p class="leading-relaxed text-slate-700">{{ comment.content }}</p>
          </div>
        </div>
      </div>
      <div
        v-else
        class="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center"
      >
        <Icon name="ph:chat-circle-dots" class="mb-3 text-4xl text-slate-400" />
        <p class="text-lg font-medium text-slate-600">No comments yet!</p>
        <p class="mt-1 text-slate-500">
          Be the first to share your thoughts on this delicious recipe.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useToast } from "vue-toastification";
import { useAuthStore } from "~/store/auth";
import { GET_RECIPE_COMMENTS, ADD_COMMENT } from "~/lib/graphql";
import type { Comments } from "~/types/recipe";

const props = defineProps<{
  recipeId: string;
  totalComments: number;
}>();

const emit = defineEmits(["comment-added"]);

const auth = useAuthStore();
const route = useRoute();
const toast = useToast();
const newComment = ref("");

const currentTotalComments = ref(props.totalComments);

const { result, loading, error } = useQuery(
  GET_RECIPE_COMMENTS,
  {
    recipe_id: props.recipeId,
  },
  () => ({
    enabled: !!props.recipeId,
    fetchPolicy: "cache-and-network",
  })
);
const comments = computed(() => result.value?.comments || []);

const {
  mutate: addComment,
  loading: loadingAddComment,
  onError,
  onDone,
} = useMutation(ADD_COMMENT, () => ({
  update: (cache, { data: { insert_comments_one } }) => {
    if (!insert_comments_one) return;

    const query = {
      query: GET_RECIPE_COMMENTS,
      variables: { recipe_id: props.recipeId },
    };
    const data = cache.readQuery<{ comments: Comments[] }>(query);

    if (data) {
      cache.writeQuery({
        ...query,
        data: { comments: [...data.comments, insert_comments_one] },
      });
    }

    currentTotalComments.value++;
    emit("comment-added", currentTotalComments.value);
  },
}));

const handlePostComment = () => {
  if (!auth.isAuthenticated || !newComment.value.trim()) {
    if (!auth.isAuthenticated) {
      toast.error("You must be logged in to post a comment.");
    }
    return;
  }

  addComment({
    recipe_id: props.recipeId,
    content: newComment.value,
  });
};

onDone(() => {
  newComment.value = "";
  toast.success("Comment posted successfully!");
});

onError((apolloError) => {
  console.error("Error posting comment:", apolloError);
  toast.error(apolloError.message || "Failed to post comment.");
});

const formatDate = (isoString: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
