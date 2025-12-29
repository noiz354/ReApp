import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}