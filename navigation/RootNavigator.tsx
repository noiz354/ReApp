import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Logic & Context
import { useAuth } from '../contexts/AuthContext';

// Stacks & Screens
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { token, isLoading: authLoading } = useAuth(); // Real auth state
  const [onboarded, setOnboarded] = useState(false);
  const [appInitializing, setAppInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Check onboarding status on boot
    AsyncStorage.getItem('@onboarded')
      .then(value => {
        if (!mounted) return;
        if (value === 'true') setOnboarded(true);
      })
      .finally(() => {
        if (mounted) setAppInitializing(false);
      });

    return () => { mounted = false; };
  }, []);

  const handleSetOnboarded = async () => {
    try {
      await AsyncStorage.setItem('@onboarded', 'true');
      setOnboarded(true);
    } catch (e) {
      console.error("Failed to save onboarding state", e);
    }
  };

  // Combine both initialization states
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
        // 1. Onboarding Flow
        <Stack.Screen name="Onboarding">
          {(props) => <OnboardingScreen {...props} setOnboarded={handleSetOnboarded} />}
        </Stack.Screen>
      ) : token === null ? (
        // 2. Auth Flow (Login/Register)
        <Stack.Screen name="Auth">
          {(props) => <AuthStack {...props} setOnboarded={handleSetOnboarded} />}
        </Stack.Screen>
      ) : (
        // 3. Main Application Flow
        <Stack.Screen name="Main" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#666' }
});