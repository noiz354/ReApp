import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';

import RootNavigator from './navigation/RootNavigator';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { navigationRef } from './services/navigationRef';

import { initNotifications } from './native/notifications';
import { pullAndScheduleNotifications } from './services/notificationSync';

export default function App() {
  useEffect(() => {
    // 1️⃣ Initialize local notifications (once)
    initNotifications();

    // 2️⃣ Pull notifications on app start
    pullAndScheduleNotifications();

    // 3️⃣ Pull again whenever app returns to foreground
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        pullAndScheduleNotifications();
      }
    });

    return () => sub.remove();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}
