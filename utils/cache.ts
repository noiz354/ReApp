// utils/cache.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Cache Entry Interface with Metadata
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time-to-live in milliseconds
}

// 2 days in milliseconds: 2 * 24 * 60 * 60 * 1000
export const CACHE_DURATION_2_DAYS = 172800000;

export const cache = {
  /**
   * Saves data with a specific TTL.
   */
  async set<T>(key: string, data: T, ttl: number = CACHE_DURATION_2_DAYS): Promise<void> {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      await AsyncStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.error(`[Cache Error] Failed to save key "${key}":`, error);
    }
  },

  /**
   * Retrieves data only if it hasn't expired. 
   * Returns null if expired or missing.
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (!jsonValue) return null;

      const entry: CacheEntry<T> = JSON.parse(jsonValue);
      const isExpired = Date.now() - entry.timestamp > entry.ttl;

      if (isExpired) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error(`[Cache Error] Failed to retrieve key "${key}":`, error);
      return null;
    }
  },

  /**
   * Explicitly clears a specific cache key.
   */
  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  /**
   * Clears all application cache.
   */
  async clearAll(): Promise<void> {
    await AsyncStorage.clear();
  }
};