// src/services/backgroundSync.ts
import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';
import { hydrateFromCache, refreshFromApi } from '../store/productStore';
import { pullAndScheduleNotifications } from './notificationSync';

let initialized = false;

export function initBackgroundSync() {
  if (initialized) return;
  initialized = true;

  // Initial hydration (offline-first)
  hydrateFromCache();

  // Initial notification pull
  pullAndScheduleNotifications();

  // Network reconnect
  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      refreshFromApi();
      pullAndScheduleNotifications();
    }
  });

  // App foreground
  AppState.addEventListener('change', state => {
    if (state === 'active') {
      refreshFromApi();
      pullAndScheduleNotifications();
    }
  });
}
