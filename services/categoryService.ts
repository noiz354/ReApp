// services/categoryService.ts
import { getApiClient } from '../api/AbstractApiClient';
import { cache, CACHE_DURATION_2_DAYS } from '../utils/cache'; // Assuming cache utility exists

export interface CreateCategoryDto {
  name: string;
  image: string;
}

const CATEGORY_CACHE_KEY = 'app_categories';
const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000;

export const categoryService = {
  getCategories: async () => {
    // 1. Try to get valid cache
    const cachedCategories = await cache.get<any[]>(CATEGORY_CACHE_KEY);
    if (cachedCategories) {
      return cachedCategories;
    }

    // 2. Fetch fresh data if cache is missing or expired
    const client = await getApiClient(1);
    const response = await client.get('/categories');
    const categories = response.data;

    // 3. Persist for 2 days
    await cache.set(CATEGORY_CACHE_KEY, categories, CACHE_DURATION_2_DAYS);

    return categories;
  },

  getCategory: async (id: number) => {
    const { data } = await getApiClient(1).get(`/categories/${id}`);
    return data;
  },

  createCategory: async (payload: CreateCategoryDto) => {
    const { data } = await getApiClient(1).post('/categories', payload);
    return data;
  },

  updateCategory: async (id: number, payload: CreateCategoryDto) => {
    const { data } = await getApiClient(1).put(`/categories/${id}`, payload);
    return data;
  },

  deleteCategory: async (id: number) => {
    const { data } = await getApiClient(1).delete(`/categories/${id}`);
    return data;
  },
};
