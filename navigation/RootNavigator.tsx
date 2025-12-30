// navigation/RootNavigator.tsx
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '../contexts/AuthContext';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { token, isLoading: authLoading } = useAuth();
  const [onboarded, setOnboarded] = useState(false);
  const [appInitializing, setAppInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem('@onboarded')
      .then(value => {
        if (mounted && value === 'true') setOnboarded(true);
      })
      .finally(() => {
        if (mounted) setAppInitializing(false);
      });
    return () => { mounted = false; };
  }, []);

  const handleSetOnboarded = async () => {
    try {
      await AsyncStorage.setItem('@onboarded', 'true');
      setOnboarded(true); // This trigger causes the Navigator to re-render and show Auth
    } catch (e) {
      console.error("Failed to save onboarding state", e);
    }
  };

  if (appInitializing || authLoading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!onboarded ? (
        // When this finishes and calls setOnboarded, this screen unmounts 
        // and the one below (Auth) mounts automatically.
        <Stack.Screen name="Onboarding">
          {(props) => <OnboardingScreen {...props} onFinish={handleSetOnboarded} />}
        </Stack.Screen>
      ) : token === null ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="Main" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#666' }
});