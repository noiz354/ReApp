// src/navigation/RootNavigator.tsx
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const loggedIn = false; // real auth should control this via AuthContext
  const [onboarded, setOnboarded] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem('@onboarded')
      .then(value => {
        if (!mounted) return;
        if (value === 'true') setOnboarded(true);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setInitializing(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (initializing)
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading...</Text>
      </View>
    );

  const initialRoute = !onboarded ? 'Onboarding' : loggedIn ? 'Main' : 'Auth';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
      <Stack.Screen name="Onboarding">{props => <OnboardingScreen {...props} />}</Stack.Screen>
      <Stack.Screen name="Auth">{props => <AuthStack {...props} setOnboarded={async () => {
          try { await AsyncStorage.setItem('@onboarded', 'true'); } catch (e) {}
          setOnboarded(true);
        }} />}</Stack.Screen>
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({ splash: { flex: 1, justifyContent: 'center', alignItems: 'center' } });