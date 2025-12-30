import { getApiClient } from '../api/AbstractApiClient';

export interface CreateCategoryDto {
  name: string;
  image: string;
}

export const categoryService = {
  getCategories: async () => {
    const { data } = await getApiClient(1).get('/categories');
    return data;
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
