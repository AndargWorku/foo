// composables/useRecipeFilters.ts
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import { watchDebounced } from '@vueuse/core'; 
import { GET_ALL_CATEGORIES_WITH_COUNT, GET_ALL_CREATORS } from '~/lib/graphql';

export const PREP_TIME_RANGES = [
  { label: 'Any Time', value: '', min: 0, max: 9999 },
  { label: 'Under 15 min', value: '0-15', min: 0, max: 15 },
  { label: '15 - 30 min', value: '15-30', min: 15, max: 30 },
  { label: '30 - 60 min', value: '30-60', min: 30, max: 60 },
  { label: 'Over 60 min', value: '60-9999', min: 60, max: 9999 },
];

export function useRecipeFilters() {
  const route = useRoute();
  const router = useRouter();

  const isFilterModalOpen = ref(false);
  const searchTerm = ref((route.query.title as string) || '');


  watchDebounced(
    searchTerm,
    (newTerm) => {
      
      if (route.query.title !== newTerm) {
        handleApplyFilters({ title: newTerm || undefined });
      }
    },
    { debounce: 2000 } 
  );

  const currentFilters = computed(() => {
    return {
      title: (route.query.title as string) || '',
      creatorId: (route.query.creatorId as string) || '',
      categoryIds: route.query.categoryIds
        ? (route.query.categoryIds as string).split(',').map(Number)
        : [],
      prepTime: (route.query.prepTime as string) || '',
      ingredients: route.query.ingredients
        ? (route.query.ingredients as string).split(',')
        : [],
    };
  });

  const hasActiveFilters = computed(() => {
    const { title, creatorId, categoryIds, prepTime, ingredients } = currentFilters.value;
    return !!title || !!creatorId || categoryIds.length > 0 || !!prepTime || ingredients.length > 0;
  });

  const queryVariables = computed(() => {
    const whereClause: any = { _and: [] };
    const { title, creatorId, categoryIds, prepTime, ingredients } = currentFilters.value;

    if (title) {
      whereClause._and.push({ title: { _ilike: `%${title}%` } });
    }
    if (creatorId) {
      whereClause._and.push({ user_id: { _eq: creatorId } });
    }
    if (categoryIds.length > 0) {
      whereClause._and.push({ recipe_categories: { category_id: { _in: categoryIds } } });
    }
    if (ingredients.length > 0) {
      const ingredientClauses = ingredients.map((ingredientName) => ({
        recipe_ingredients: { ingredient: { name: { _ilike: `%${ingredientName}%` } } },
      }));
      whereClause._and.push(...ingredientClauses);
    }
    if (prepTime) {
      const range = PREP_TIME_RANGES.find((r) => r.value === prepTime);
      if (range && range.value !== '') {
        whereClause._and.push({
          prep_time_minutes: { _gte: range.min, _lte: range.max },
        });
      }
    }

    return whereClause._and.length > 0 ? { where: whereClause } : { where: {} };
  });

  const handleApplyFilters = (newFilters: Record<string, any>) => {
    const currentQuery = { ...route.query };

    for (const key in newFilters) {
      const value = newFilters[key];
      if (value !== undefined && value !== null && value !== '') {
        currentQuery[key] = value;
      } else {
        delete currentQuery[key];
      }
    }

    if (Object.prototype.hasOwnProperty.call(newFilters, 'categoryIds')) {
      if (!newFilters.categoryIds || newFilters.categoryIds.length === 0) {
        delete currentQuery.categorySlug;
      }
    }
    
    router.push({ path: route.path, query: currentQuery });
    searchTerm.value = (currentQuery.title as string) || '';
  };

  const clearFilter = (key: keyof typeof currentFilters.value) => {
    const newQuery = { ...route.query };
    delete newQuery[key];

    if (key === 'categoryIds') {
      delete newQuery.categorySlug;
    }
    
    router.push({ query: newQuery });

    if (key === 'title') {
      searchTerm.value = '';
    }
  };

  const handleClearFilters = () => {
    router.push({ path: route.path });
    searchTerm.value = '';
  };

  const { result: categoriesResult } = useQuery(GET_ALL_CATEGORIES_WITH_COUNT);
  const allCategories = computed(() => categoriesResult.value?.categories || []);

  const { result: creatorsResult } = useQuery(GET_ALL_CREATORS);
  const allCreators = computed(() => creatorsResult.value?.users || []);

  const getCreatorUsername = (id: string) =>
    allCreators.value.find((c) => c.id === id)?.username || 'Unknown Creator';

  const getCategoryNames = (ids: number[]) =>
    allCategories.value.filter((c) => ids.includes(c.id)).map((c) => c.name);

  const getPrepTimeLabel = (value: string) =>
    PREP_TIME_RANGES.find((r) => r.value === value)?.label || '';

  return {
    isFilterModalOpen,
    searchTerm,
    currentFilters,
    hasActiveFilters,
    queryVariables,
    handleApplyFilters,
    handleSearch: () => handleApplyFilters({ title: searchTerm.value || undefined }),
    clearFilter,
    handleClearFilters,
    getCreatorUsername,
    getCategoryNames,
    getPrepTimeLabel,
    PREP_TIME_RANGES,
  };
}




