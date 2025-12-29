// src/services/backgroundSync.ts
import NetInfo from '@react-native-community/netinfo';
import { hydrateFromCache, refreshFromApi } from '../store/productStore';

let initialized = false;

export function initBackgroundSync() {
  if (initialized) return;
  initialized = true;

  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      refreshFromApi();
    }
  });

  hydrateFromCache();
}
