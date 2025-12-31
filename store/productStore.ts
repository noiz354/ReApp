// src/store/productStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 1. Import the searchService
import { searchService } from '../services/searchService';

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
};

type State = {
  products: Product[];
  page: number;
  loading: boolean;
  loadNext: () => Promise<void>;
};

export const useProductStore = create<State>((set, get) => ({
  products: [],
  page: 1,
  loading: false,

  loadNext: async () => {
    if (get().loading) return;
    set({ loading: true });

    try {
      // 2. Call searchProducts with an empty query as requested
      // We calculate the offset based on the current page and a fixed limit (e.g., 10)
      const LIMIT = 10;
      const currentOffset = (get().page - 1) * LIMIT;

      const next = await searchService.searchProducts({
        query: "", // REQUIRED: Empty query to fetch the default list
        limit: LIMIT,
        offset: currentOffset,
      });

      const merged = [...get().products, ...next];

      set({
        products: merged,
        page: get().page + 1,
        loading: false,
      });

      AsyncStorage.setItem('products', JSON.stringify(merged));
    } catch (error) {
      console.error("Failed to fetch products via searchService:", error);
      set({ loading: false });
    }
  },
}));

export async function hydrateFromCache() {
  const raw = await AsyncStorage.getItem('products');
  if (raw) {
    useProductStore.setState({ products: JSON.parse(raw) });
  }
}

export async function refreshFromApi() {
  useProductStore.setState({ products: [], page: 1 });
  await useProductStore.getState().loadNext();
}