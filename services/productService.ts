import { getApiClient } from '../api/AbstractApiClient';

export interface CreateProductDto {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export const productService = {
  getProducts: async (categoryId?: string) => {
    const client = await getApiClient(1);
    // Assuming the API supports a category filter query param
    const url = categoryId ? `/products?categoryId=${categoryId}` : '/products';
    const response = await client.get(url);
    return response.data;
  },

  getProduct: async (id: number) => {
    const { data } = await getApiClient(1).get(`/products/${id}`);
    return data;
  },

  createProduct: async (payload: CreateProductDto) => {
    const { data } = await getApiClient(1).post('/products', payload);
    return data;
  },

  updateProduct: async (id: number, payload: UpdateProductDto) => {
    const { data } = await getApiClient(1).put(`/products/${id}`, payload);
    return data;
  },

  deleteProduct: async (id: number) => {
    const { data } = await getApiClient(1).delete(`/products/${id}`);
    return data;
  },
};
