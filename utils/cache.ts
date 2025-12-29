// src/utils/cache.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveCache<T>(key: string, data: T) {
  await AsyncStorage.setItem(key, JSON.stringify({
    data,
    timestamp: Date.now(),
  }));
}

export async function loadCache<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  return JSON.parse(raw).data as T;
}
