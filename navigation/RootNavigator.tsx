// src/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const loggedIn = true;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {loggedIn ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}