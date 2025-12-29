// src/store/productStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchProducts } from '../services/api';

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

    const next = await fetchProducts(get().page);
    const merged = [...get().products, ...next];

    set({
      products: merged,
      page: get().page + 1,
      loading: false,
    });

    AsyncStorage.setItem('products', JSON.stringify(merged));
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
